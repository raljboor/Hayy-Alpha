/**
 * Live room — ported to the redesign "Circle" direction
 * (frontend-new/hayy/project/components/liveroom.jsx → LiveRoomB):
 * a concentric stage with the host in the centre, on-stage speakers on the
 * inner ring, and listeners on the outer ring. Wrapped in `.hy` so the
 * redesign CSS vars resolve; the stage geometry is computed with trig and
 * positioned by percentage so it scales.
 *
 * All LiveKit wiring (connect, participant sync, audio track rendering, mic
 * toggle) and the mic / hand / question / referral / chat controls are
 * unchanged from the previous version — only the presentation changed.
 */
import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { Video, VideoOff, MicOff, Volume2, X, Send, Loader2, WifiOff } from "lucide-react";
import {
  Room as LKRoom,
  RoomEvent,
  ConnectionState,
  RemoteAudioTrack,
  Track,
} from "livekit-client";
import { getLiveKitToken } from "@/lib/api/livekit";
import { getUser, users } from "@/lib/mockData";
import { getRoomById, leaveRoom } from "@/lib/api/rooms";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, Btn, LiveTag, Waveform, Icon, I, type AvatarTone } from "@/components/ui/primitives";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Question = {
  id: string;
  userId: string;
  displayName: string;
  text: string;
  upvotes: number;
};

/** Shape of a participant derived from LiveKit room state */
type LKParticipant = {
  identity: string;
  name: string;
  isMicEnabled: boolean;
  isSpeaking: boolean;
  isLocal: boolean;
};

/** Legacy mock-only tile type — only used when Supabase is not configured */
type Tile = {
  id: string;
  user: ReturnType<typeof getUser>;
  isHost?: boolean;
  isSpeaker: boolean;
  speaking?: boolean;
  hasVideo?: boolean;
  muted?: boolean;
};

/** Unified participant shape for the concentric stage */
type CircleParticipant = {
  id: string;
  name: string;
  role?: string;
  tone: AvatarTone;
  isHost?: boolean;
  speaking?: boolean;
  micOff?: boolean;
  hand?: boolean;
  isLocal?: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TONES: AvatarTone[] = ["clay", "olive", "sand", "dark"];
const toneFor = (seed: string): AvatarTone => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
};

const firstName = (name: string) => name.split(" ")[0];

const HAND_PATH =
  "M7 11V5a2 2 0 1 1 4 0v6M11 11V3a2 2 0 1 1 4 0v8M15 11V5a2 2 0 1 1 4 0v8a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8 2 2 0 1 1 4 0";

// ---------------------------------------------------------------------------
// Mock-only fixtures (never used when Supabase is configured)
// ---------------------------------------------------------------------------

const MOCK_QUESTIONS: Question[] = [
  { id: "q1", userId: "u1", displayName: getUser("u1")?.name ?? "Participant", text: "How do referrals actually work?", upvotes: 24 },
  { id: "q2", userId: "u5", displayName: getUser("u5")?.name ?? "Participant", text: "What makes someone referral-ready?", upvotes: 18 },
  { id: "q3", userId: "u3", displayName: getUser("u3")?.name ?? "Participant", text: "Should I message before or after applying?", upvotes: 12 },
  { id: "q4", userId: "u4", displayName: getUser("u4")?.name ?? "Participant", text: "How do I follow up without being annoying?", upvotes: 9 },
];

// ---------------------------------------------------------------------------
// AudioTrackRenderer — attaches a LiveKit RemoteAudioTrack to an <audio> node
// ---------------------------------------------------------------------------

const AudioTrackRenderer = ({ track }: { track: RemoteAudioTrack }) => {
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    track.attach(el);
    return () => {
      track.detach(el);
    };
  }, [track]);
  return <audio ref={ref} autoPlay playsInline className="hidden" />;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const LiveRoom = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { userId, profile } = useCurrentUser();
  const { data: room, loading } = useAsync(() => getRoomById(id), [id]);

  const [muted, setMuted] = useState(true);
  const [video, setVideo] = useState(false);
  const [hand, setHand] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [chatText, setChatText] = useState("");

  // Narrow-viewport flag — mirrors the design's isMobile prop, used to size
  // the concentric-stage avatars (positions scale via %, sizes don't).
  const [compact, setCompact] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setCompact(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // In Supabase mode: always start with no questions — real questions will come
  // from Realtime in a future phase. In mock mode: use the fixture questions.
  const [questions, setQuestions] = useState<Question[]>(
    isSupabaseConfigured ? [] : MOCK_QUESTIONS,
  );

  // ---------------------------------------------------------------------------
  // LiveKit state (Supabase mode only)
  // ---------------------------------------------------------------------------

  type LKStatus = "idle" | "connecting" | "connected" | "error";
  const [lkStatus, setLkStatus] = useState<LKStatus>("idle");
  const [lkError, setLkError] = useState<string | null>(null);
  const [lkParticipants, setLkParticipants] = useState<LKParticipant[]>([]);
  const [lkAudioTracks, setLkAudioTracks] = useState<RemoteAudioTrack[]>([]);
  const lkRoomRef = useRef<LKRoom | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !id || !userId) return;

    let cancelled = false;
    const lkRoom = new LKRoom();
    lkRoomRef.current = lkRoom;

    const syncParticipants = () => {
      if (cancelled) return;

      const all: LKParticipant[] = [];

      // Local participant
      const local = lkRoom.localParticipant;
      if (local.identity) {
        all.push({
          identity: local.identity,
          name: local.name ?? local.identity,
          isMicEnabled: local.isMicrophoneEnabled,
          isSpeaking: local.isSpeaking,
          isLocal: true,
        });
      }

      // Remote participants
      lkRoom.remoteParticipants.forEach((p) => {
        all.push({
          identity: p.identity,
          name: p.name ?? p.identity,
          isMicEnabled: p.isMicrophoneEnabled,
          isSpeaking: p.isSpeaking,
          isLocal: false,
        });
      });

      setLkParticipants(all);

      // Collect subscribed remote audio tracks for rendering
      const tracks: RemoteAudioTrack[] = [];
      lkRoom.remoteParticipants.forEach((p) => {
        p.getTrackPublications().forEach((pub) => {
          if (
            pub.track &&
            pub.track.source === Track.Source.Microphone &&
            pub.track instanceof RemoteAudioTrack
          ) {
            tracks.push(pub.track as RemoteAudioTrack);
          }
        });
      });
      setLkAudioTracks(tracks);
    };

    lkRoom
      .on(RoomEvent.Connected, () => {
        if (!cancelled) {
          setLkStatus("connected");
          syncParticipants();
        }
      })
      .on(RoomEvent.Disconnected, () => {
        if (!cancelled) {
          setLkStatus("idle");
          setLkParticipants([]);
          setLkAudioTracks([]);
        }
      })
      .on(RoomEvent.Reconnecting, () => {
        if (!cancelled) setLkStatus("connecting");
      })
      .on(RoomEvent.Reconnected, () => {
        if (!cancelled) {
          setLkStatus("connected");
          syncParticipants();
        }
      })
      .on(RoomEvent.ParticipantConnected, syncParticipants)
      .on(RoomEvent.ParticipantDisconnected, syncParticipants)
      .on(RoomEvent.TrackSubscribed, syncParticipants)
      .on(RoomEvent.TrackUnsubscribed, syncParticipants)
      .on(RoomEvent.LocalTrackPublished, syncParticipants)
      .on(RoomEvent.LocalTrackUnpublished, syncParticipants)
      .on(RoomEvent.ActiveSpeakersChanged, syncParticipants);

    setLkStatus("connecting");
    setLkError(null);

    getLiveKitToken(id)
      .then(({ token, livekitUrl }) => {
        if (cancelled) return;
        return lkRoom.connect(livekitUrl, token, {
          autoSubscribe: true,
        });
      })
      .then(() => {
        if (cancelled) return;
        // Start with mic muted — user explicitly unmutes via the control bar
        return lkRoom.localParticipant.setMicrophoneEnabled(false);
      })
      .then(() => {
        if (!cancelled) syncParticipants();
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLkStatus("error");
          setLkError(
            err instanceof Error
              ? err.message
              : "Failed to connect to live audio.",
          );
        }
      });

    return () => {
      cancelled = true;
      lkRoom.disconnect();
      lkRoomRef.current = null;
    };
  }, [id, userId]); // isSupabaseConfigured is a module constant — not needed in deps

  // ---------------------------------------------------------------------------
  // Mock-only tiles (never used when Supabase is configured)
  // ---------------------------------------------------------------------------

  const tiles: Tile[] = useMemo(() => {
    if (isSupabaseConfigured) return [];
    const pool = users.concat(users).slice(0, 8);
    return pool.map((u, i) => ({
      id: `${u.id}-${i}`,
      user: u,
      isHost: i === 0,
      isSpeaker: i < 4,
      speaking: i === 1 || i === 2,
      hasVideo: i === 0 || i === 3,
      muted: i === 3,
    }));
  }, []);

  // Raised hands: mock-only
  const raisedHands = isSupabaseConfigured ? [] : [users[4], users[5]];

  // ---------------------------------------------------------------------------
  // Concentric-stage grouping — host (centre), speakers (inner), listeners (outer).
  // Supabase mode derives roles from LiveKit signal (mic-on = on stage); mock
  // mode uses the tile fixtures + a synthesized listener ring.
  // ---------------------------------------------------------------------------

  const circle = useMemo(() => {
    const cap = <T,>(arr: T[], n: number) => arr.slice(0, n);

    if (isSupabaseConfigured) {
      const mapped: CircleParticipant[] = lkParticipants.map((p) => ({
        id: p.identity,
        name: p.name || p.identity,
        tone: toneFor(p.identity),
        isHost: !!room && p.identity === room.hostId,
        speaking: p.isSpeaking,
        micOff: !p.isMicEnabled,
        isLocal: p.isLocal,
      }));
      const center = mapped.find((m) => m.isHost) ?? mapped[0] ?? null;
      const rest = mapped.filter((m) => m.id !== center?.id);
      return {
        center,
        inner: cap(rest.filter((m) => !m.micOff), 6),
        outer: cap(rest.filter((m) => m.micOff), 10),
        total: mapped.length,
      };
    }

    const centerTile = tiles.find((t) => t.isHost) ?? tiles[0];
    const toCp = (t: Tile): CircleParticipant => ({
      id: t.id,
      name: t.user?.name ?? "Guest",
      role: t.user?.role,
      tone: toneFor(t.user?.id ?? t.id),
      isHost: t.isHost,
      speaking: t.speaking,
      micOff: t.muted,
    });
    const center = centerTile ? toCp(centerTile) : null;
    const inner = cap(
      tiles.filter((t) => t.isSpeaker && t.id !== centerTile?.id).map(toCp),
      6,
    );
    const stageUserIds = new Set(tiles.map((t) => t.user?.id));
    const handIds = new Set(raisedHands.map((u) => u.id));
    const outer = cap(
      users
        .filter((u) => !stageUserIds.has(u.id))
        .map((u) => ({
          id: u.id,
          name: u.name,
          role: u.role,
          tone: toneFor(u.id),
          micOff: true,
          hand: handIds.has(u.id),
        })),
      10,
    );
    return { center, inner, outer, total: tiles.length + outer.length };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lkParticipants, tiles, room]);

  const activeSpeaker =
    [circle.center, ...circle.inner].find((p) => p && p.speaking) ?? null;

  // ---------------------------------------------------------------------------
  // Loading / not found
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="hy fixed inset-0 z-50 flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="animate-pulse h-10 w-56 rounded" style={{ background: "var(--sand)" }} />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="hy fixed inset-0 z-50 flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p style={{ color: "var(--ink-mute)" }}>Room not found.</p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const submitReferral = (e: React.FormEvent) => {
    e.preventDefault();
    setReferralOpen(false);
    toast.success("Request sent", { description: "Your host will get a warm intro request." });
  };

  const submitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    const displayName = profile?.full_name ?? "You";
    setQuestions([
      { id: `q${Date.now()}`, userId: userId ?? "", displayName, text: questionText.trim(), upvotes: 1 },
      ...questions,
    ]);
    setQuestionText("");
    setQuestionOpen(false);
    toast.success("Question added to the queue");
  };

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    const displayName = profile?.full_name ?? "You";
    setQuestions([
      { id: `q${Date.now()}`, userId: userId ?? "", displayName, text: chatText.trim(), upvotes: 1 },
      ...questions,
    ]);
    setChatText("");
  };

  const toggleMic = async () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (
      isSupabaseConfigured &&
      lkRoomRef.current?.state === ConnectionState.Connected
    ) {
      try {
        await lkRoomRef.current.localParticipant.setMicrophoneEnabled(!nextMuted);
      } catch {
        // revert UI if LiveKit call fails
        setMuted(muted);
      }
    }
  };

  const leave = async () => {
    if (userId) {
      await leaveRoom(room.id, userId).catch(() => {});
    }
    navigate(`/app/rooms/${room.id}`);
  };

  // ---------------------------------------------------------------------------
  // Stage body — connection states (Supabase) or the concentric circle
  // ---------------------------------------------------------------------------

  const hasParticipants = isSupabaseConfigured
    ? lkParticipants.length > 0
    : !!circle.center;

  const stageMessage = (icon: React.ReactNode, title: string, body: string) => (
    <div className="flex flex-col items-center justify-center text-center gap-3 h-full">
      <span style={{ color: "var(--ink-mute)" }}>{icon}</span>
      <p style={{ fontFamily: "var(--display)", fontSize: 20 }}>{title}</p>
      <p style={{ fontSize: 14, color: "var(--ink-mute)", maxWidth: 320 }}>{body}</p>
    </div>
  );

  let stageBody: React.ReactNode;
  if (isSupabaseConfigured && lkStatus === "connecting") {
    stageBody = stageMessage(
      <Loader2 className="h-8 w-8 animate-spin" />,
      "Connecting to live audio…",
      "Hang tight while we join the room.",
    );
  } else if (isSupabaseConfigured && lkStatus === "error") {
    stageBody = stageMessage(<WifiOff className="h-8 w-8" />, "Could not connect", lkError ?? "");
  } else if (!hasParticipants) {
    stageBody = stageMessage(
      <span style={{ display: "inline-flex" }}>{I.mic}</span>,
      isSupabaseConfigured ? "You're the first one here" : "No live participants yet",
      isSupabaseConfigured
        ? "Others will appear here when they join. Unmute to speak."
        : "Live audio will connect here once room audio is enabled.",
    );
  } else {
    stageBody = (
      <CircleStage
        center={circle.center}
        inner={circle.inner}
        outer={circle.outer}
        compact={compact}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      className="hy fixed inset-0 z-50 flex flex-col"
      style={{ background: "radial-gradient(ellipse at center, var(--cream) 0%, var(--bg) 70%)", color: "var(--ink)" }}
    >
      {/* Hidden audio renderers for remote participant tracks */}
      {isSupabaseConfigured &&
        lkAudioTracks.map((track) => (
          <AudioTrackRenderer key={track.sid} track={track} />
        ))}

      {/* Top bar */}
      <header
        className="flex items-center justify-between gap-3 shrink-0"
        style={{ padding: compact ? "12px 14px" : "16px 28px", borderBottom: "1px solid var(--line-soft)", background: "var(--paper)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate(`/app/rooms/${room.id}`)}
            aria-label="Back to room"
            style={{ display: "inline-flex", color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer" }}
          >
            <Icon d="m15 18-6-6 6-6" size={18} />
          </button>
          <LiveTag />
          {!compact && (
            <span style={{ fontSize: 14, fontWeight: 500, marginLeft: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 380 }}>
              {room.title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3.5">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-soft)" }}>
            {I.users} {circle.total}
          </span>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-[1fr_360px] overflow-hidden">
        {/* Stage */}
        <section className="overflow-hidden flex flex-col min-w-0">
          {/* Title strip */}
          <div style={{ padding: compact ? "14px 18px 0" : "18px 28px 0", textAlign: "center" }}>
            <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase" }}>
              The circle · {circle.total} in the room
            </p>
            <h2 style={{ fontSize: compact ? 18 : 22, marginTop: 4, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
              {room.title}
            </h2>
          </div>

          {/* Stage body */}
          <div className="flex-1 relative flex items-center justify-center px-4 py-4 overflow-hidden">
            {stageBody}
          </div>
        </section>

        {/* Right panel — questions */}
        <aside className="hidden lg:flex flex-col" style={{ borderLeft: "1px solid var(--line-soft)", background: "var(--cream)" }}>
          <div className="flex items-center gap-2" style={{ padding: 16, borderBottom: "1px solid var(--line-soft)" }}>
            <span style={{ color: "var(--clay)", display: "inline-flex" }}>{I.msg}</span>
            <p style={{ fontFamily: "var(--display)", fontSize: 16, fontWeight: 500 }}>Questions</p>
            <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-mute)" }}>{questions.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {questions.length === 0 ? (
              <p style={{ fontSize: 14, color: "var(--ink-mute)", textAlign: "center", paddingTop: 32 }}>No questions yet.</p>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="hy-card" style={{ padding: 12 }}>
                  <div className="flex items-start gap-2.5">
                    <Avatar name={q.displayName} size={32} tone={toneFor(q.userId || q.displayName)} />
                    <div className="min-w-0 flex-1">
                      <p style={{ fontSize: 12, fontWeight: 600 }}>{q.displayName}</p>
                      <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 2 }}>{q.text}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <button style={{ fontSize: 11, color: "var(--ink-mute)", background: "none", border: "none", cursor: "pointer" }}>
                          ↑ {q.upvotes} upvotes
                        </button>
                        <span className="mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-mute)" }}>In queue</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={sendChat} className="flex gap-2" style={{ padding: 12, borderTop: "1px solid var(--line-soft)" }}>
            <Input
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Ask a question…"
              className="bg-card"
            />
            <Button type="submit" variant="hero" size="icon"><Send className="h-4 w-4" /></Button>
          </form>
        </aside>
      </div>

      {/* Bottom control bar */}
      <footer
        className="shrink-0 flex items-center justify-between gap-3"
        style={{ padding: compact ? "12px 14px" : "16px 28px", borderTop: "1px solid var(--line-soft)", background: "var(--paper)" }}
      >
        {!compact && (
          <div className="flex items-center gap-2.5 min-w-0">
            {activeSpeaker ? (
              <>
                <Avatar name={activeSpeaker.name} size={32} tone={activeSpeaker.tone} />
                <p style={{ fontSize: 13, fontWeight: 500 }}>{firstName(activeSpeaker.name)} is speaking</p>
                <Waveform bars={14} height={18} color="var(--clay)" />
              </>
            ) : (
              <p style={{ fontSize: 13, color: "var(--ink-mute)" }}>No one is speaking right now</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-2" style={{ marginLeft: "auto" }}>
          <CircleCtl
            icon={muted ? I.micOff : I.mic}
            label="Mic"
            active={!muted}
            onClick={toggleMic}
          />
          <CircleCtl
            icon={video ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            label="Video"
            active={video}
            onClick={() => setVideo(!video)}
          />
          <CircleCtl
            icon={<span style={{ display: "inline-flex" }}>{I.hand}</span>}
            label="Hand"
            active={hand}
            onClick={() => setHand(!hand)}
          />
          <CircleCtl
            icon={<span style={{ display: "inline-flex" }}>{I.msg}</span>}
            label="Ask"
            onClick={() => setQuestionOpen(true)}
          />
          <CircleCtl
            icon={<span style={{ display: "inline-flex" }}>{I.shake}</span>}
            label={compact ? undefined : "Refer me"}
            highlight
            onClick={() => setReferralOpen(true)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Moderator tools"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: 10, borderRadius: 999, background: "var(--cream)",
                  color: "var(--ink)", border: "1px solid var(--line)", cursor: "pointer",
                }}
              >
                {I.more}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top">
              <DropdownMenuLabel>Moderator tools</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><MicOff className="h-4 w-4" />Mute participant</DropdownMenuItem>
              <DropdownMenuItem><Volume2 className="h-4 w-4" />Spotlight speaker</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <X className="h-4 w-4" />Remove participant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CircleCtl
            icon={<span style={{ display: "inline-flex" }}>{I.closed}</span>}
            label={compact ? undefined : "Leave"}
            danger
            onClick={leave}
          />
        </div>
      </footer>

      {/* Request referral modal */}
      <Dialog open={referralOpen} onOpenChange={setReferralOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Request a warm intro</DialogTitle>
            <DialogDescription>
              Be specific and kind — hosts get a notification with your message.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitReferral} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Select host</Label>
              {tiles.length > 0 ? (
                <Select defaultValue={tiles[0]?.user?.id}>
                  <SelectTrigger className="bg-cream"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tiles.filter((t) => t.isSpeaker).map((t) => (
                      <SelectItem key={t.id} value={t.user!.id}>
                        {t.user!.name} — {t.user!.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="rounded-xl border border-border bg-cream px-3 py-2 text-sm text-muted-foreground">
                  Room host
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Request type</Label>
              <Select defaultValue="referral">
                <SelectTrigger className="bg-cream"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="coffee">Coffee chat</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="resume">Resume feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                rows={4}
                placeholder="Hi — really enjoyed your perspective on Canadian corporate hiring. I'm targeting Ops roles and would love a 15-min chat…"
                className="bg-cream resize-none"
                required
              />
            </div>
            <Button type="submit" variant="hero" className="w-full">Submit request</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ask question modal */}
      <Dialog open={questionOpen} onOpenChange={setQuestionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Ask a question</DialogTitle>
            <DialogDescription>Hosts read every question — keep it specific.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitQuestion} className="space-y-4 mt-2">
            <Textarea
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="What's the difference between an internal referral and an employee submission?"
              className="bg-cream resize-none"
              required
            />
            <Button type="submit" variant="hero" className="w-full">Add to queue</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ---------------------------------------------------------------------------
// CircleStage — concentric rings: host centre, speakers inner, listeners outer
// ---------------------------------------------------------------------------

const W = 760;
const H = 560;
const CX = W / 2;
const CY = H / 2 - 30;

const CircleStage = ({
  center,
  inner,
  outer,
  compact,
}: {
  center: CircleParticipant | null;
  inner: CircleParticipant[];
  outer: CircleParticipant[];
  compact: boolean;
}) => {
  const hostSize = compact ? 64 : 88;
  const speakerSize = compact ? 44 : 60;
  const listenerSize = compact ? 30 : 40;

  return (
    <div
      style={{ position: "relative", width: "100%", maxWidth: compact ? 380 : 760, margin: "0 auto", aspectRatio: `${W} / ${H}` }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }} preserveAspectRatio="xMidYMid meet">
        {[90, 160, 230].map((r, i) => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="var(--line)" strokeDasharray="2 6" opacity={0.7 - i * 0.18} />
        ))}
        {!center && (
          <text x={CX} y={CY + 4} textAnchor="middle" fontSize="11" fontFamily="var(--mono)" fill="var(--ink-mute)" letterSpacing=".12em">
            STAGE
          </text>
        )}
      </svg>

      {center && <CircleNode cp={center} size={hostSize} kind="host" leftPct={(CX / W) * 100} topPct={(CY / H) * 100} compact={compact} />}
      <Orbit items={inner} r={160} size={speakerSize} kind="speaker" compact={compact} />
      <Orbit items={outer} r={230} size={listenerSize} kind="listener" compact={compact} />
    </div>
  );
};

const Orbit = ({
  items,
  r,
  size,
  kind,
  compact,
}: {
  items: CircleParticipant[];
  r: number;
  size: number;
  kind: "speaker" | "listener";
  compact: boolean;
}) => (
  <>
    {items.map((it, i) => {
      const angle = (i / Math.max(items.length, 1)) * Math.PI * 2 - Math.PI / 2;
      const x = CX + Math.cos(angle) * r;
      const y = CY + Math.sin(angle) * r;
      return (
        <CircleNode
          key={it.id}
          cp={it}
          size={size}
          kind={kind}
          leftPct={(x / W) * 100}
          topPct={(y / H) * 100}
          compact={compact}
        />
      );
    })}
  </>
);

const CircleNode = ({
  cp,
  size,
  kind,
  leftPct,
  topPct,
  compact,
}: {
  cp: CircleParticipant;
  size: number;
  kind: "host" | "speaker" | "listener";
  leftPct: number;
  topPct: number;
  compact: boolean;
}) => {
  const isHost = kind === "host";
  const ringActive = isHost || cp.speaking;
  return (
    <div
      title={cp.role ? `${cp.name} · ${cp.role}` : cp.name}
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div style={{ position: "relative" }}>
        <Avatar name={cp.name} size={size} tone={cp.tone} />

        {ringActive && (
          <span
            className={cp.speaking ? "animate-hy-pulse" : undefined}
            style={{ position: "absolute", inset: -4, borderRadius: "50%", border: `${isHost ? 3 : 2}px solid var(--clay)` }}
          />
        )}

        {isHost && (
          <span
            style={{
              position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)",
              background: "var(--clay)", color: "var(--paper)", fontSize: 9, fontWeight: 600,
              padding: "2px 8px", borderRadius: 999, letterSpacing: ".06em", textTransform: "uppercase",
              border: "2px solid var(--paper)", whiteSpace: "nowrap",
            }}
          >
            Host
          </span>
        )}

        {cp.isLocal && !isHost && (
          <span
            style={{
              position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)",
              background: "var(--ink)", color: "var(--paper)", fontSize: 9, fontWeight: 600,
              padding: "2px 8px", borderRadius: 999, letterSpacing: ".06em", textTransform: "uppercase",
              border: "2px solid var(--paper)", whiteSpace: "nowrap",
            }}
          >
            You
          </span>
        )}

        {cp.micOff && kind !== "listener" && (
          <span
            style={{
              position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: 999,
              background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-mute)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ transform: "scale(0.55)", display: "inline-flex" }}>{I.micOff}</span>
          </span>
        )}

        {cp.hand && (
          <span
            style={{
              position: "absolute", bottom: -3, right: -3, width: 18, height: 18, borderRadius: 999,
              background: "var(--spotlight)", border: "2px solid var(--paper)", color: "var(--ink)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon d={HAND_PATH} size={10} />
          </span>
        )}
      </div>

      {kind !== "listener" && (
        <span style={{ fontSize: compact ? 9 : 10, fontWeight: 500, whiteSpace: "nowrap" }}>
          {firstName(cp.name)}
        </span>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// CircleCtl — round control button (bottom bar)
// ---------------------------------------------------------------------------

const CircleCtl = ({
  icon,
  label,
  onClick,
  active,
  highlight,
  danger,
}: {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  active?: boolean;
  highlight?: boolean;
  danger?: boolean;
}) => (
  <button
    onClick={onClick}
    aria-label={label}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: label ? "10px 16px" : 10,
      borderRadius: 999,
      background: highlight ? "var(--clay)" : active ? "var(--ink)" : "var(--cream)",
      color: highlight || active ? "var(--paper)" : danger ? "hsl(0 65% 45%)" : "var(--ink)",
      border: "1px solid " + (highlight || active ? "transparent" : "var(--line)"),
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
    }}
  >
    {icon}
    {label}
  </button>
);

export default LiveRoom;
