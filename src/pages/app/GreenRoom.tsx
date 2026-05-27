/**
 * Green room — the "are you sure?" pause between tapping Join and being live.
 * Ported from workflow-screens.jsx → GreenRoom: a centred warm card with a
 * live tag, who's inside, a join-as / mic-check panel, and the slip-in CTA.
 *
 * Full-screen route (no app sidebar). This is where the actual joinRoom()
 * write now happens — RoomDetail navigates here, and "Slip in quietly"
 * registers the participant then enters the live room.
 */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getRoomById, joinRoom } from "@/lib/api/rooms";
import { getUser } from "@/lib/mockData";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar, Btn, I, type AvatarTone } from "@/components/ui/primitives";

// Representative "people inside" — stub until live presence is wired.
const inside: { n: string; r: "host" | "co-host" | "speaker" | "listener"; t: AvatarTone }[] = [
  { n: "Amira H", r: "host", t: "dark" },
  { n: "Diego R", r: "co-host", t: "olive" },
  { n: "Layla P", r: "speaker", t: "sand" },
  { n: "Maya N", r: "listener", t: "clay" },
  { n: "Han L", r: "listener", t: "olive" },
  { n: "Karim R", r: "listener", t: "dark" },
  { n: "Yusra A", r: "listener", t: "sand" },
];

const GreenRoom = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { userId } = useCurrentUser();
  const { data: room, loading } = useAsync(() => getRoomById(id), [id]);

  const [role, setRole] = useState<"Listener" | "Hand raised">("Listener");
  const [joining, setJoining] = useState(false);

  const host = room ? getUser(room.hostId) : undefined;

  const handleJoin = async () => {
    if (!userId) { toast.error("Please sign in to join."); return; }
    setJoining(true);
    try {
      const { error } = await joinRoom(id, userId);
      if (error) throw error;
      navigate(`/app/rooms/${id}/live`);
    } catch {
      toast.error("Couldn't join the room — please try again.");
      setJoining(false);
    }
  };

  return (
    <div
      className="hy"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(22px, 4vw, 56px)",
        background: "linear-gradient(180deg, var(--cream), var(--bg))",
        color: "var(--ink)",
      }}
    >
      <div
        className="hy-card"
        style={{
          width: "100%",
          maxWidth: 560,
          padding: "clamp(22px, 4vw, 36px)",
          display: "flex",
          flexDirection: "column",
          gap: 22,
          background: "var(--paper)",
          boxShadow: "var(--shadow-warm)",
        }}
      >
        {/* Live tag */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 999,
              background: "var(--clay)", color: "var(--paper)",
              fontSize: 11, fontWeight: 600, letterSpacing: ".08em",
            }}
          >
            <span className="animate-hy-pulse" style={{ width: 6, height: 6, borderRadius: 99, background: "var(--paper)" }} />
            LIVE
          </span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em", marginLeft: "auto" }}>
            {inside.length} INSIDE
          </span>
        </div>

        {/* What's happening */}
        <div>
          <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>
            You're about to join
          </p>
          <h1 style={{ fontFamily: "var(--display)", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 500, lineHeight: 1.1, marginTop: 6 }}>
            {loading ? "Loading room…" : room?.title ?? "Room not found"}
          </h1>
          {room && (
            <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.55 }}>
              Hosted by <b style={{ color: "var(--ink)" }}>{host?.name ?? "Hayy host"}</b>. You can listen in — or raise your hand to speak.
            </p>
          )}
        </div>

        {/* Who's inside */}
        <div style={{ paddingTop: 18, borderTop: "1px solid var(--line-soft)" }}>
          <p className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>
            People inside
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            {inside.map((p) => (
              <div
                key={p.n}
                title={`${p.n} · ${p.r}`}
                style={{ position: "relative", border: p.r === "host" ? "2px solid var(--clay)" : "2px solid transparent", borderRadius: 999, padding: 1 }}
              >
                <Avatar name={p.n} size={36} tone={p.t} />
                {(p.r === "host" || p.r === "co-host" || p.r === "speaker") && (
                  <span style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: 99, background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ width: 6, height: 6, borderRadius: 99, background: p.r === "host" ? "var(--clay)" : "var(--olive)" }} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Join as + mic */}
        <div style={{ padding: 14, borderRadius: 14, background: "var(--cream)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Join as</span>
            <div style={{ display: "flex", gap: 4, padding: 3, borderRadius: 999, background: "var(--paper)", border: "1px solid var(--line-soft)" }}>
              {(["Listener", "Hand raised"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none",
                    background: role === r ? "var(--ink)" : "transparent",
                    color: role === r ? "var(--paper)" : "var(--ink-mute)",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Microphone</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--olive)", letterSpacing: ".06em" }}>READY · MUTED</span>
              <Btn kind="ghost" size="md" onClick={() => toast("Mic check", { description: "Your mic is ready — you'll join muted." })}>Test</Btn>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 8 }}>
          <Btn kind="ghost" size="lg" style={{ flex: 1, justifyContent: "center" }} onClick={() => navigate(`/app/rooms/${id}`)}>
            Cancel
          </Btn>
          <Btn
            kind="primary"
            size="lg"
            iconRight={I.arrow}
            style={{ flex: 2, justifyContent: "center" }}
            onClick={handleJoin}
            disabled={joining || loading || !room}
          >
            {joining ? "Joining…" : role === "Hand raised" ? "Join & raise hand" : "Slip in quietly"}
          </Btn>
        </div>

        <p style={{ fontSize: 11, color: "var(--ink-mute)", lineHeight: 1.5 }}>
          You'll appear as a listener with your name. The host will be notified when you raise your hand.
        </p>
      </div>
    </div>
  );
};

export default GreenRoom;
