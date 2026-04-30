import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Mic, ArrowRight } from "lucide-react";
import { HayySidebar } from "@/components/layout/HayySidebar";
import { HayyAvatar } from "@/components/ui/HayyAvatar";
import { getRooms } from "@/lib/api/rooms";
import { getReferralRequests, getReferralThreads } from "@/lib/api/referrals";
import { getNotifications } from "@/lib/api/notifications";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { isMockMode } from "@/lib/runtimeMode";

// ---------------------------------------------------------------------------
// Profile completion helpers (unchanged from original)
// ---------------------------------------------------------------------------

interface ChecklistItem {
  label: string;
  done: boolean;
}

function buildChecklist(profile: {
  full_name?: string | null;
  headline?: string | null;
  bio?: string | null;
  target_roles?: string[];
  skills?: string[];
  linkedin_url?: string | null;
  resume_url?: string | null;
  video_intro_url?: string | null;
} | null): ChecklistItem[] {
  if (!profile) {
    return [
      { label: "Add bio", done: true },
      { label: "Add skills", done: true },
      { label: "Add resume", done: false },
      { label: "Add LinkedIn", done: false },
      { label: "Add video intro", done: false },
    ];
  }
  return [
    { label: "Add bio", done: !!profile.bio },
    { label: "Add skills", done: !!(profile.skills && profile.skills.length > 0) },
    { label: "Add resume", done: !!profile.resume_url },
    { label: "Add LinkedIn", done: !!profile.linkedin_url },
    { label: "Add video intro", done: !!profile.video_intro_url },
  ];
}

// ---------------------------------------------------------------------------
// Donut SVG
// ---------------------------------------------------------------------------

const DonutChart = ({ pct }: { pct: number }) => {
  const R = 36;
  const circumference = 2 * Math.PI * R;
  const dash = (pct / 100) * circumference;
  return (
    <svg width={88} height={88} viewBox="0 0 88 88" style={{ transform: "rotate(-90deg)" }}>
      <circle cx={44} cy={44} r={R} fill="none" stroke="var(--line)" strokeWidth={8} />
      <circle
        cx={44} cy={44} r={R} fill="none"
        stroke="var(--clay)" strokeWidth={8}
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
      />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Mono label
// ---------------------------------------------------------------------------

const MonoLabel = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <p
    style={{
      fontFamily: "monospace",
      fontSize: 10,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: "var(--clay)",
      margin: 0,
      ...style,
    }}
  >
    {children}
  </p>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Dashboard = () => {
  const { userId, profile } = useCurrentUser();
  const firstName = profile?.full_name?.trim().split(" ")[0] ?? "there";

  // All data fetches preserved from original — only UI layer changes.
  const roomsQ       = useAsync(() => getRooms(), []);
  const referralsQ   = useAsync(() => getReferralRequests(userId ?? undefined), [userId]);
  const threadsQ     = useAsync(() => getReferralThreads(userId ?? undefined), [userId]);
  const notificationsQ = useAsync(() => getNotifications(userId ?? undefined), [userId]);

  // Keep computed values so no data fetching is broken.
  const referralRequests = referralsQ.data ?? [];
  void threadsQ;        // fetched; wired to activity timeline in a future phase
  void notificationsQ;  // fetched; wired to activity timeline in a future phase

  const checklist = useMemo(
    () => (isMockMode ? buildChecklist(null) : buildChecklist(profile)),
    [profile],
  );
  const completedCount = checklist.filter((c) => c.done).length;
  const pct = Math.round((completedCount / checklist.length) * 100);

  // Hero room: real data only — never show mock rooms.
  const heroRoom = useMemo(() => {
    if (isMockMode) return null;
    const rooms = roomsQ.data ?? [];
    return (
      rooms.find((r) => r.status === "live") ??
      rooms.find((r) => r.status === "upcoming") ??
      null
    );
  }, [roomsQ.data]);

  // Date string for greeting header
  const dateStr = new Date()
    .toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    .toUpperCase();

  // Pending referral count — keep this computed even if not shown yet
  void referralRequests;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        display: "flex",
        background: "var(--bg)",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Sidebar ── */}
      <HayySidebar active="Home" />

      {/* ── Main scroll area ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "36px 32px 48px" }}>
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 272px",
            gap: "28px",
            alignItems: "start",
          }}
        >
          {/* ════════════════ LEFT COLUMN ════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* ── Greeting ── */}
            <header style={{ paddingBottom: 4 }}>
              <MonoLabel style={{ marginBottom: 10 }}>{dateStr}</MonoLabel>
              <h1
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 500,
                  color: "var(--ink)",
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                Good morning,{" "}
                <span style={{ fontStyle: "italic", color: "var(--clay)" }}>
                  {firstName}.
                </span>
              </h1>
            </header>

            {/* ── Hero room card ── */}
            <section
              style={{
                background: "linear-gradient(135deg, var(--paper) 0%, var(--cream) 100%)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-warm)",
                padding: "28px 28px 24px",
              }}
            >
              <MonoLabel style={{ marginBottom: 14 }}>Live now</MonoLabel>

              {roomsQ.loading ? (
                <div style={{ height: 80, display: "flex", alignItems: "center", color: "var(--ink-mute)", fontSize: 14 }}>
                  Loading rooms…
                </div>
              ) : heroRoom ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "center" }}>
                  <div>
                    {heroRoom.status === "live" && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          background: "var(--live)",
                          color: "var(--paper)",
                          fontSize: 10,
                          fontFamily: "monospace",
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          padding: "3px 8px",
                          borderRadius: "var(--radius-pill)",
                          marginBottom: 10,
                        }}
                      >
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "var(--paper)", opacity: .85,
                          animation: "pulse 1.5s ease-in-out infinite",
                        }} />
                        Live
                      </span>
                    )}
                    <h2
                      style={{
                        fontFamily: "'Fraunces', Georgia, serif",
                        fontSize: 22,
                        fontWeight: 500,
                        color: "var(--ink)",
                        margin: "0 0 6px",
                        lineHeight: 1.25,
                      }}
                    >
                      {heroRoom.title}
                    </h2>
                    <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "0 0 4px" }}>
                      {heroRoom.category}
                      {heroRoom.attendees > 0 && ` · ${heroRoom.attendees} listening`}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <Link
                      to={`/app/rooms/${heroRoom.id}/live`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "var(--clay)",
                        color: "var(--paper)",
                        fontSize: 13,
                        fontWeight: 600,
                        padding: "10px 18px",
                        borderRadius: "var(--radius-pill)",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Mic size={14} />
                      Join room
                    </Link>
                    <Link
                      to="/app/rooms"
                      style={{
                        fontSize: 12,
                        color: "var(--ink-soft)",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      Browse all <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Fraunces', Georgia, serif",
                        fontSize: 18,
                        fontWeight: 500,
                        color: "var(--ink-soft)",
                        margin: "0 0 4px",
                      }}
                    >
                      No rooms scheduled today
                    </p>
                    <p style={{ fontSize: 13, color: "var(--ink-mute)", margin: 0 }}>
                      New rooms drop throughout the week.
                    </p>
                  </div>
                  <Link
                    to="/app/rooms"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "transparent",
                      color: "var(--ink-soft)",
                      fontSize: 13,
                      fontWeight: 500,
                      padding: "9px 16px",
                      borderRadius: "var(--radius-pill)",
                      border: "1px solid var(--line)",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Browse rooms <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </section>

            {/* ── Activity timeline ── */}
            <section
              style={{
                background: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-soft)",
                padding: "24px",
              }}
            >
              <MonoLabel style={{ marginBottom: 16 }}>Recent activity</MonoLabel>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "32px 0",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--line-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--line)",
                    }}
                  />
                </span>
                <p
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: 16,
                    color: "var(--ink-soft)",
                    margin: 0,
                  }}
                >
                  Your activity will appear here
                </p>
                <p style={{ fontSize: 13, color: "var(--ink-mute)", margin: 0 }}>
                  Join a room or send a referral request to get started.
                </p>
              </div>
            </section>
          </div>

          {/* ════════════════ RIGHT PANEL ════════════════ */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 0 }}>

            {/* ── Profile completion ── */}
            <div
              style={{
                background: "var(--cream)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-soft)",
                padding: "22px",
              }}
            >
              <MonoLabel style={{ marginBottom: 16 }}>Profile</MonoLabel>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <DonutChart pct={pct} />
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {pct}%
                  </span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: 17,
                      fontWeight: 500,
                      color: "var(--ink)",
                      margin: "0 0 4px",
                    }}
                  >
                    {pct === 100 ? "Complete!" : `${pct}% done`}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0, lineHeight: 1.45 }}>
                    Hosts say yes more often to complete profiles.
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <ul style={{ listStyle: "none", margin: "18px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {checklist.map((item) => (
                  <li key={item.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: `1.5px solid ${item.done ? "var(--clay)" : "var(--line)"}`,
                        background: item.done ? "var(--clay)" : "transparent",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.done && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="var(--paper)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: item.done ? "var(--ink-mute)" : "var(--ink-soft)",
                        textDecoration: item.done ? "line-through" : "none",
                      }}
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/app/profile"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 18,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--clay)",
                  textDecoration: "none",
                  fontFamily: "monospace",
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                }}
              >
                Complete profile <ArrowRight size={11} />
              </Link>
            </div>

            {/* ── Founding member card ── */}
            <div
              style={{
                background: "var(--clay)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-warm)",
                padding: "22px",
              }}
            >
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--paper)",
                  opacity: 0.75,
                  margin: "0 0 8px",
                }}
              >
                Founding member
              </p>
              <p
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: 17,
                  fontWeight: 500,
                  color: "var(--paper)",
                  margin: "0 0 4px",
                  lineHeight: 1.35,
                }}
              >
                You're in the Hayy founding community.
              </p>
              <p style={{ fontSize: 12, color: "var(--paper)", opacity: 0.7, margin: 0 }}>
                Your feedback shapes what we build next.
              </p>
            </div>

            {/* ── Avatar identity chip ── */}
            {profile?.full_name && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-pill)",
                  padding: "8px 14px 8px 8px",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <HayyAvatar name={profile.full_name} size={32} tone="clay" />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", margin: 0, lineHeight: 1.2 }}>
                    {profile.full_name}
                  </p>
                  {profile.headline && (
                    <p style={{ fontSize: 11, color: "var(--ink-mute)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>
                      {profile.headline}
                    </p>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
