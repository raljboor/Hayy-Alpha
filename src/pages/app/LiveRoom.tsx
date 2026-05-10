/**
 * LiveRoom — ported from the redesign LiveRoomA "Stage" mock
 * (frontend-new/hayy/project/components/liveroom.jsx → LiveRoomA).
 *
 * IMPORTANT: full LiveKit wiring from the previous implementation is
 * preserved verbatim — the redesign is a re-skin only:
 *   - getLiveKitToken() → lkRoom.connect()
 *   - room subscription, participant sync, mic toggle
 *   - <AudioTrackRenderer> for remote audio attach/detach
 *
 * Layout:
 *   - LiveTopbar (back arrow, LiveTag, title, elapsed clock, attendee count)
 *   - 1fr / 280px grid: stage left, side conversation right
 *   - Stage: speaker tiles with redesign clay ring + waveform "speaking" badge
 *   - Footer: pill control bar (Raise, React, Refer me, Chat, Leave)
 *   - Modals (Refer me, Ask question) re-skinned without @/components/ui/dialog
 */

import { Link, useParams, useNavigate } from "react-router-dom";
import {
  useMemo,
  useState,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type FormEvent,
} from "react";
import {
  Room as LKRoom,
  RoomEvent,
  ConnectionState,
  RemoteAudioTrack,
  Track,
} from "livekit-client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, Btn, I, Icon, LiveTag, Waveform } from "@/components/ui/primitives";
import { getLiveKitToken } from "@/lib/api/livekit";
import { getRoomById, leaveRoom } from "@/lib/api/rooms";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LKStatus = "idle" | "connecting" | "connected" | "error";

type LKParticipant = {
  identity: string;
  name: string;
  isMicEnabled: boolean;
  isSpeaking: boolean;
  isLocal: boolean;
};

type Question = {
  id: string;
  userId: string;
  displayName: string;
  text: string;
};

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
  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <audio ref={ref} autoPlay playsInline style={{ display: "none" }} />;
};

// ---------------------------------------------------------------------------
// Modal helper (no @/components/ui/dialog)
// ---------------------------------------------------------------------------

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}) => {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="hy"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(15,15,20,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--paper)",
          borderRadius: "var(--radius-xl)",
          maxWidth: 460,
          width: "100%",
          padding: 28,
          boxShadow: "var(--shadow-warm)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--display)",
            fontSize: 24,
            fontWeight: 500,
            margin: 0,
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              marginTop: 8,
              color: "var(--ink-soft)",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
        <div style={{ marginTop: 18 }}>{children}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Shared field styles
// ---------------------------------------------------------------------------

const inputStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid var(--line)",
  background: "var(--paper)",
  fontSize: 14,
  color: "var(--ink)",
  width: "100%",
  outline: "none",
  fontFamily: "var(--sans)",
};

const fieldLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--ink-mute)",
  letterSpacing: ".1em",
  textTransform: "uppercase",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const LiveRoom = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { userId, profile } = useCurrentUser();

  const { data: room, isLoading } = useQuery({
    queryKey: ["live-room", id],
    queryFn: () => getRoomById(id),
    enabled: !!id,
  });

  const [muted, setMuted] = useState(true);
  const [hand, setHand] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [chatText, setChatText] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  // Elapsed clock — refreshed every 30s
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  const elapsedLabel = useMemo(() => {
    if (!room) return "";
    const startMs = new Date(room.startsAt).getTime();
    const diffMs = now - startMs;
    if (diffMs < 0) return "Starting soon";
    const totalSec = Math.floor(diffMs / 1000);
    const mm = Math.floor(totalSec / 60);
    const ss = totalSec % 60;
    return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  }, [now, room]);

  // -------------------------------------------------------------------------
  // LiveKit state (Supabase mode only)
  // -------------------------------------------------------------------------

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
        return lkRoom.connect(livekitUrl, token, { autoSubscribe: true });
      })
      .then(() => {
        if (cancelled) return;
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
  }, [id, userId]);

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
        setMuted(muted);
      }
    }
  };

  const submitReferral = (e: FormEvent) => {
    e.preventDefault();
    setReferralOpen(false);
    toast.success("Request sent", {
      description: "Your host will get a warm intro request.",
    });
  };

  const submitQuestion = (e: FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    const displayName = profile?.full_name ?? "You";
    setQuestions((prev) => [
      {
        id: `q${Date.now()}`,
        userId: userId ?? "",
        displayName,
        text: questionText.trim(),
      },
      ...prev,
    ]);
    setQuestionText("");
    setQuestionOpen(false);
    toast.success("Question added to the queue");
  };

  const sendChat = (e: FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    const displayName = profile?.full_name ?? "You";
    setQuestions((prev) => [
      {
        id: `q${Date.now()}`,
        userId: userId ?? "",
        displayName,
        text: chatText.trim(),
      },
      ...prev,
    ]);
    setChatText("");
  };

  // -------------------------------------------------------------------------
  // Render guards
  // -------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div
        className="hy"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          className="mono"
          style={{
            fontSize: 12,
            color: "var(--ink-mute)",
            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          Loading room…
        </p>
      </div>
    );
  }

  if (!room) {
    return (
      <div
        className="hy"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--ink-soft)" }}>Room not found.</p>
      </div>
    );
  }

  const tones: ("clay" | "olive" | "sand" | "dark")[] = ["clay", "olive", "sand", "dark"];

  return (
    <div
      className="hy"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Hidden audio renderers for remote participant tracks */}
      {isSupabaseConfigured &&
        lkAudioTracks.map((track) => <AudioTrackRenderer key={track.sid} track={track} />)}

      {/* Topbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "16px 28px",
          borderBottom: "1px solid var(--line-soft)",
          background: "var(--paper)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <button
            type="button"
            onClick={async () => {
              if (userId) await leaveRoom(room.id, userId).catch(() => {});
              navigate(`/app/rooms/${room.id}`);
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--ink-soft)",
              cursor: "pointer",
              padding: 4,
              display: "inline-flex",
            }}
            aria-label="Leave room"
          >
            <Icon d="m15 18-6-6 6-6" size={18} />
          </button>
          <LiveTag />
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--ink)",
              marginLeft: 4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 380,
            }}
          >
            {room.title}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
            {elapsedLabel}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "var(--ink-soft)",
            }}
          >
            {I.users} {Math.max(room.attendees, lkParticipants.length)}
          </span>
        </div>
      </div>

      <div
        className="liveroom-grid"
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* Stage */}
        <main
          style={{
            padding: 28,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div>
            <p
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--clay)",
                letterSpacing: ".12em",
                textTransform: "uppercase",
              }}
            >
              On stage
            </p>
            <h2 style={{ fontSize: 26, marginTop: 4, fontFamily: "var(--display)" }}>
              {room.description || "Welcome to the room."}
            </h2>
          </div>

          {/* Connecting / error / empty / connected */}
          {lkStatus === "connecting" && (
            <StagePlaceholder
              label="Connecting to live audio…"
              hint="Hang tight while we join the room."
            />
          )}
          {lkStatus === "error" && (
            <StagePlaceholder label="Could not connect" hint={lkError ?? ""} error />
          )}
          {lkStatus === "connected" && lkParticipants.length === 0 && (
            <StagePlaceholder
              label="You're the first one here"
              hint="Others will appear when they join. Unmute to speak."
            />
          )}
          {lkStatus !== "connecting" &&
            lkStatus !== "error" &&
            lkParticipants.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gap: 24,
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  justifyItems: "center",
                  padding: "12px 0",
                }}
              >
                {lkParticipants.map((p, i) => (
                  <SpeakerTile
                    key={p.identity}
                    name={p.name || p.identity}
                    role={p.isLocal ? "You" : ""}
                    tone={tones[i % tones.length]}
                    speaking={p.isSpeaking}
                    micOn={p.isMicEnabled}
                    isHost={room.hostId === p.identity}
                  />
                ))}
              </div>
            )}

          {/* Footer pill controls */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "center",
              gap: 10,
              padding: 10,
              background: "var(--paper)",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--line)",
              boxShadow: "var(--shadow-soft)",
              alignSelf: "center",
              flexWrap: "wrap",
            }}
          >
            <ControlBtn
              icon={muted ? I.micOff : I.mic}
              label={muted ? "Unmute" : "Mute"}
              onClick={toggleMic}
              highlight={!muted}
            />
            <ControlBtn
              icon={I.hand}
              label={hand ? "Lower" : "Raise"}
              onClick={() => setHand(!hand)}
              highlight={hand}
            />
            <ControlBtn icon={I.heart} label="React" onClick={() => toast("👏")} />
            <ControlBtn
              icon={I.shake}
              label="Refer me"
              highlight
              onClick={() => setReferralOpen(true)}
            />
            <ControlBtn
              icon={I.msg}
              label="Ask"
              onClick={() => setQuestionOpen(true)}
            />
            <ControlBtn
              icon={I.closed}
              label="Leave"
              danger
              onClick={async () => {
                if (userId) await leaveRoom(room.id, userId).catch(() => {});
                navigate(`/app/rooms/${room.id}`);
              }}
            />
          </div>
        </main>

        {/* Side conversation */}
        <aside
          className="liveroom-aside"
          style={{
            borderLeft: "1px solid var(--line-soft)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "var(--paper)",
          }}
        >
          <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--line-soft)" }}>
            <p
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--clay)",
                letterSpacing: ".12em",
                textTransform: "uppercase",
              }}
            >
              Side conversation
            </p>
          </div>
          <div
            style={{
              flex: 1,
              overflow: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {questions.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--ink-mute)", textAlign: "center", padding: "24px 0" }}>
                No questions yet — be the first to ask.
              </p>
            ) : (
              questions.map((m, i) => (
                <div key={m.id} style={{ display: "flex", gap: 8 }}>
                  <Avatar name={m.displayName} size={26} tone={tones[i % tones.length]} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 11, color: "var(--ink-mute)", margin: 0 }}>
                      {m.displayName}
                    </p>
                    <p style={{ fontSize: 13, marginTop: 2 }}>{m.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <form
            onSubmit={sendChat}
            style={{
              padding: 12,
              borderTop: "1px solid var(--line-soft)",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Message the room…"
              style={{
                flex: 1,
                background: "var(--cream)",
                borderRadius: "var(--radius-pill)",
                padding: "8px 14px",
                fontSize: 12,
                color: "var(--ink)",
                border: "1px solid var(--line)",
                outline: "none",
                fontFamily: "var(--sans)",
              }}
            />
            <Btn kind="primary" size="md" type="submit">
              {I.arrow}
            </Btn>
          </form>
        </aside>
      </div>

      {/* Referral modal */}
      <Modal
        open={referralOpen}
        onClose={() => setReferralOpen(false)}
        title="Request a warm intro"
        description="Be specific and kind — hosts get a notification with your message."
      >
        <form onSubmit={submitReferral} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Request type</span>
            <select defaultValue="referral" style={{ ...inputStyle, appearance: "none" }}>
              <option value="coffee_chat">Coffee chat</option>
              <option value="referral">Referral</option>
              <option value="resume_feedback">Resume feedback</option>
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Message</span>
            <textarea
              rows={4}
              required
              placeholder="Hi — really enjoyed your perspective on Canadian corporate hiring. I'm targeting Ops roles…"
              style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
            />
          </label>
          <Btn
            kind="primary"
            size="lg"
            type="submit"
            iconRight={I.shake}
            style={{ justifyContent: "center", width: "100%" }}
          >
            Send to host
          </Btn>
        </form>
      </Modal>

      {/* Question modal */}
      <Modal
        open={questionOpen}
        onClose={() => setQuestionOpen(false)}
        title="Ask a question"
        description="Hosts read every question — keep it specific."
      >
        <form onSubmit={submitQuestion} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <textarea
            rows={4}
            required
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="What's the difference between an internal referral and an employee submission?"
            style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
          />
          <Btn
            kind="primary"
            size="lg"
            type="submit"
            style={{ justifyContent: "center", width: "100%" }}
          >
            Add to queue
          </Btn>
        </form>
      </Modal>

      <style>{`
        @media (max-width: 880px) {
          .liveroom-grid { grid-template-columns: 1fr !important; }
          .liveroom-aside { display: none !important; }
        }
      `}</style>
    </div>
  );
};

// ---------------------------------------------------------------------------
// SpeakerTile
// ---------------------------------------------------------------------------

const SpeakerTile = ({
  name,
  role,
  tone,
  speaking,
  micOn,
  isHost,
}: {
  name: string;
  role: string;
  tone: "clay" | "olive" | "sand" | "dark";
  speaking?: boolean;
  micOn?: boolean;
  isHost?: boolean;
}) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
    <div style={{ position: "relative" }}>
      <Avatar name={name} size={92} tone={tone} />
      {speaking && (
        <span
          style={{
            position: "absolute",
            inset: -5,
            borderRadius: "50%",
            border: "2px solid var(--clay)",
            animation: "hy-pulse 1.6s ease-out infinite",
          }}
        />
      )}
      {isHost && (
        <span
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            background: "var(--clay)",
            color: "var(--paper)",
            borderRadius: "var(--radius-pill)",
            padding: "2px 7px",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: ".05em",
            textTransform: "uppercase",
            border: "2px solid var(--paper)",
          }}
        >
          Host
        </span>
      )}
      <span
        style={{
          position: "absolute",
          bottom: -2,
          right: -2,
          width: 22,
          height: 22,
          borderRadius: "var(--radius-pill)",
          background: "var(--paper)",
          border: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: micOn ? "var(--clay)" : "var(--ink-mute)",
        }}
      >
        {micOn && speaking ? (
          <Waveform bars={3} height={10} color="var(--clay)" />
        ) : micOn ? (
          I.mic
        ) : (
          I.micOff
        )}
      </span>
    </div>
    <div style={{ textAlign: "center", maxWidth: 122 }}>
      <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>{name}</p>
      {role && (
        <p style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 1, lineHeight: 1.2 }}>
          {role}
        </p>
      )}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// ControlBtn (footer pill control)
// ---------------------------------------------------------------------------

const ControlBtn = ({
  icon,
  label,
  highlight,
  danger,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  highlight?: boolean;
  danger?: boolean;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      padding: "8px 14px",
      borderRadius: "var(--radius-pill)",
      background: highlight ? "var(--clay)" : danger ? "rgba(220,60,60,.08)" : "transparent",
      color: highlight ? "var(--paper)" : danger ? "hsl(0 65% 45%)" : "var(--ink-soft)",
      border: "none",
      cursor: "pointer",
      minWidth: 64,
      fontFamily: "var(--sans)",
    }}
  >
    {icon}
    <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
  </button>
);

// ---------------------------------------------------------------------------
// StagePlaceholder
// ---------------------------------------------------------------------------

const StagePlaceholder = ({
  label,
  hint,
  error,
}: {
  label: string;
  hint: string;
  error?: boolean;
}) => (
  <div
    style={{
      borderRadius: "var(--radius-xl)",
      border: `1px dashed ${error ? "var(--live)" : "var(--line)"}`,
      background: error ? "rgba(220,60,60,.05)" : "var(--cream)",
      padding: 36,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      textAlign: "center",
    }}
  >
    <p
      style={{
        fontFamily: "var(--display)",
        fontSize: 18,
        fontWeight: 500,
        margin: 0,
      }}
    >
      {label}
    </p>
    {hint && (
      <p style={{ fontSize: 13, color: "var(--ink-soft)", maxWidth: 360, margin: 0 }}>{hint}</p>
    )}
  </div>
);

export default LiveRoom;
