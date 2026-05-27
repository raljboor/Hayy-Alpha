/**
 * Post-room Recap — ported from extra-screens.jsx → RoomRecap.
 * Editorial summary after a live room ended: saved clips + follow-ups +
 * replay. Clips / follow-ups / mentioned topics are stub content for now;
 * the room title + host are loaded from the room record.
 */
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getRoomById } from "@/lib/api/rooms";
import { getUser } from "@/lib/mockData";
import { useAsync } from "@/lib/useAsync";
import { Avatar, Btn, Pill, Waveform, I, type AvatarTone } from "@/components/ui/primitives";

const clips = [
  { t: "On the realistic timeline", who: "Maya N.", dur: "1:24", q: "It took me 14 months. Anyone telling you 3 is selling something." },
  { t: "Skip the cover letter — almost always", who: "Rashid K.", dur: "0:48", q: "If a referral exists, the cover letter is noise. Spend that time on STAR stories." },
  { t: "Newcomer salary anchor", who: "Maya N.", dur: "2:11", q: "Anchor your number on Toronto market — not your last role's currency." },
];

const followups: { who: string; t: AvatarTone; what: string; status: string }[] = [
  { who: "Amira → Rashid K.", t: "olive", what: "Resume review", status: "Scheduled" },
  { who: "Diego → Maya N.", t: "clay", what: "Coffee chat", status: "Awaiting reply" },
  { who: "Sara → Layla P.", t: "sand", what: "Portfolio session", status: "Scheduled" },
];

const mentioned = ["Amazon Day-1", "STAR stories", "Toronto salary anchor", "Newcomer mortgage", "AWS Sr PM", "Cover letters"];

const SectionLabel = ({ children, color = "var(--clay)" }: { children: React.ReactNode; color?: string }) => (
  <p className="mono" style={{ fontSize: 11, color, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>
    {children}
  </p>
);

const RoomRecap = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: room } = useAsync(() => getRoomById(id), [id]);
  const host = room ? getUser(room.hostId) : undefined;

  const title = room?.title ?? "Room recap";

  return (
    <div className="hy" style={{ background: "transparent", color: "var(--ink)" }}>
      {/* Header strip */}
      <div style={{ paddingBottom: 24, borderBottom: "1px solid var(--line-soft)" }}>
        <Btn kind="ghost" size="md" icon={<span style={{ display: "inline-flex", transform: "scaleX(-1)" }}>{I.arrow}</span>} onClick={() => navigate("/app/rooms")}>
          Back to rooms
        </Btn>
        <div style={{ marginTop: 12 }}>
          <SectionLabel>Recap · 47 min</SectionLabel>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", marginTop: 6, lineHeight: 1.05 }}>{title}</h1>
        </div>
        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar name={host?.name ?? "Host"} size={28} tone="clay" />
            <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Hosted by {host?.name ?? "the Hayy team"}</span>
          </div>
          <span style={{ width: 1, height: 16, background: "var(--line)" }} />
          <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            <b style={{ color: "var(--ink)" }}>{room?.attendees ?? 0}</b> attended · <b style={{ color: "var(--clay)" }}>{followups.length}</b> follow-ups
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 md:gap-10 mt-6">
        {/* Clips */}
        <div className="flex flex-col gap-[18px] min-w-0">
          <section>
            <SectionLabel>What we'll remember</SectionLabel>
            <p style={{ marginTop: 8, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 600 }}>
              Three moments worth saving. Tap any clip to listen back, share to a thread, or pull a quote.
            </p>
            <div className="mt-4 flex flex-col">
              {clips.map((c, i) => (
                <article
                  key={c.t}
                  className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start"
                  style={{ padding: "18px 0", borderTop: i === 0 ? "1px solid var(--line-soft)" : "1px dashed var(--line-soft)" }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".06em" }}>{`CLIP 0${i + 1}`}</span>
                      <span style={{ width: 4, height: 4, borderRadius: 99, background: "var(--ink-mute)" }} />
                      <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)" }}>{c.dur}</span>
                    </div>
                    <h3 style={{ fontFamily: "var(--display)", fontSize: "clamp(18px, 2.4vw, 22px)", fontWeight: 500, marginTop: 6, lineHeight: 1.2 }}>{c.t}</h3>
                    <blockquote style={{ marginTop: 10, paddingLeft: 14, borderLeft: "2px solid var(--clay)", fontFamily: "var(--display)", fontStyle: "italic", fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                      "{c.q}"
                    </blockquote>
                    <p style={{ marginTop: 8, fontSize: 12, color: "var(--ink-mute)" }}>— {c.who}</p>
                  </div>
                  <button
                    onClick={() => toast("Clip playback", { description: "Replay clips land in a later phase." })}
                    style={{ width: 180, maxWidth: "100%", height: 64, borderRadius: 14, background: "var(--cream)", border: "1px solid var(--line-soft)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 14px", cursor: "pointer" }}
                  >
                    <span style={{ width: 32, height: 32, borderRadius: 999, background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>▶</span>
                    <Waveform bars={14} height={22} active={false} color="var(--ink-mute)" />
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4 min-w-0">
          <div className="hy-card" style={{ padding: 18, background: "var(--cream)" }}>
            <SectionLabel>Follow-ups · the wins</SectionLabel>
            <div className="mt-3 flex flex-col">
              {followups.map((f, i) => (
                <div key={f.who} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: i === 0 ? "0" : "1px dashed var(--line-soft)" }}>
                  <Avatar name={f.who.split(" ")[0]} size={28} tone={f.t} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 500 }}>{f.who}</p>
                    <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>{f.what}</p>
                  </div>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase", color: f.status === "Scheduled" ? "var(--olive)" : "var(--ink-mute)" }}>{f.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hy-card" style={{ padding: 18 }}>
            <SectionLabel>Mentioned in the room</SectionLabel>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {mentioned.map((t) => <Pill key={t}>{t}</Pill>)}
            </div>
          </div>

          <div style={{ padding: 18, borderRadius: "var(--radius-lg)", background: "linear-gradient(135deg, var(--clay), var(--clay-2))", color: "var(--paper)", boxShadow: "var(--shadow-warm)" }}>
            <SectionLabel color="rgba(255,255,255,.85)">Replay</SectionLabel>
            <p style={{ marginTop: 8, fontFamily: "var(--display)", fontSize: 18, lineHeight: 1.3 }}>
              Listen to the full 47 min — or skim from the transcript.
            </p>
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <Btn kind="soft" size="md" style={{ background: "var(--paper)", color: "var(--ink)", borderColor: "transparent" }} onClick={() => toast("Replay", { description: "Full replay lands in a later phase." })}>Play full</Btn>
              <Btn kind="ghost" size="md" style={{ color: "var(--paper)" }} onClick={() => toast("Transcript", { description: "Transcripts land in a later phase." })}>Transcript</Btn>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RoomRecap;
