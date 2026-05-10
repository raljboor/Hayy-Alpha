/**
 * Dashboard — ported from the redesign DashboardA mock
 * (frontend-new/hayy/project/components/dashboard.jsx → DashboardA).
 *
 * AppLayout owns the desktop sidebar and the mobile top bar / dropdown
 * nav, so the redesign's internal Sidebar / MobileTopbar / MobileTabbar
 * are intentionally NOT included here.
 *
 * Layout:
 *   1. Greeting (real date, real first name)
 *   2. Today's room — hero card pulled from the next live or upcoming
 *      room (getRooms)
 *   3. Two columns:
 *      left  → activity timeline backed by real notifications
 *      right → profile-completion donut + founding-member card
 *
 * No fixture data: every count, name, room, and timeline event is
 * derived from the existing src/lib/api/* layer.
 */

import { useMemo, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Btn, I, LiveTag } from "@/components/ui/primitives";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getRooms } from "@/lib/api/rooms";
import { getNotifications } from "@/lib/api/notifications";
import { getReferralRequests } from "@/lib/api/referrals";
import type { Room } from "@/data/mockData";

// ---------------------------------------------------------------------------
// Profile-completion checklist (same logic as the previous Dashboard but
// surfaced via the redesign's donut card)
// ---------------------------------------------------------------------------

interface ChecklistItem {
  label: string;
  done: boolean;
}

function buildChecklist(profile: {
  bio?: string | null;
  headline?: string | null;
  skills?: string[];
  linkedin_url?: string | null;
  resume_url?: string | null;
  video_intro_url?: string | null;
} | null): ChecklistItem[] {
  if (!profile) {
    return [
      { label: "Add headline", done: false },
      { label: "Add bio", done: false },
      { label: "Add skills", done: false },
      { label: "Add LinkedIn", done: false },
      { label: "Add resume", done: false },
      { label: "Add video intro", done: false },
    ];
  }
  return [
    { label: "Add headline", done: !!profile.headline },
    { label: "Add bio", done: !!profile.bio },
    { label: "Add skills", done: !!(profile.skills && profile.skills.length > 0) },
    { label: "Add LinkedIn", done: !!profile.linkedin_url },
    { label: "Add resume", done: !!profile.resume_url },
    { label: "Add video intro", done: !!profile.video_intro_url },
  ];
}

// ---------------------------------------------------------------------------
// Hero room — pick the most relevant single room to surface
// ---------------------------------------------------------------------------

function pickHeroRoom(rooms: Room[]): Room | null {
  if (rooms.length === 0) return null;
  // Prefer live rooms first, then nearest upcoming, then anything that hasn't ended.
  const live = rooms.find((r) => r.status === "live");
  if (live) return live;
  const upcoming = rooms
    .filter((r) => r.status === "upcoming")
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  return upcoming[0] ?? rooms[0] ?? null;
}

function formatStartTime(room: Room): string {
  if (room.status === "live") return "Live now";
  const start = new Date(room.startsAt);
  const now = Date.now();
  const diffMin = Math.round((start.getTime() - now) / 60_000);
  if (diffMin < 0) return "Starting soon";
  if (diffMin < 60) return `Starting in ${diffMin} min`;
  if (diffMin < 24 * 60) return `Starting in ${Math.round(diffMin / 60)}h`;
  return start.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
  });
}

function formatToday(): string {
  const d = new Date();
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Timeline dot colour by notification type
// ---------------------------------------------------------------------------

function dotForType(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("accept") || t.includes("referral")) return "var(--clay)";
  if (t.includes("room") || t.includes("speak")) return "var(--olive)";
  if (t.includes("message") || t.includes("reply")) return "var(--ink)";
  return "var(--clay-2)";
}

// ---------------------------------------------------------------------------
// Donut SVG — exact port of the redesign's DonutPct
// ---------------------------------------------------------------------------

const DonutPct = ({ pct = 60, size = 72 }: { pct?: number; size?: number }) => {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flex: "none" }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--line)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="var(--clay)"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        fontFamily="var(--display)"
        fontSize="16"
        fill="var(--ink)"
      >
        {pct}
      </text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Shared style tokens
// ---------------------------------------------------------------------------

const sectionLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: ".12em",
  color: "var(--clay)",
  textTransform: "uppercase",
  fontWeight: 600,
  margin: 0,
};

const cardStyle: CSSProperties = {
  background: "var(--paper)",
  border: "1px solid var(--line-soft)",
  borderRadius: "var(--radius-xl)",
  boxShadow: "var(--shadow-soft)",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Dashboard = () => {
  const { userId, profile } = useCurrentUser();
  const fullName = profile?.full_name ?? "";
  const firstName = fullName.trim().split(/\s+/)[0] || "there";

  const roomsQ = useQuery({
    queryKey: ["dashboard-rooms"],
    queryFn: getRooms,
    staleTime: 60_000,
  });
  const notificationsQ = useQuery({
    queryKey: ["dashboard-notifications", userId],
    queryFn: () => getNotifications(userId ?? undefined),
    staleTime: 30_000,
  });
  const referralsQ = useQuery({
    queryKey: ["dashboard-referrals", userId],
    queryFn: () => getReferralRequests(userId ?? undefined),
    staleTime: 30_000,
  });

  const rooms = roomsQ.data ?? [];
  const notifications = notificationsQ.data ?? [];
  const referrals = referralsQ.data ?? [];

  const heroRoom = useMemo(() => pickHeroRoom(rooms), [rooms]);
  const checklist = useMemo(() => buildChecklist(profile ?? null), [profile]);
  const completedCount = checklist.filter((c) => c.done).length;
  const pct = Math.round((completedCount / checklist.length) * 100);

  // Live activity timeline: the last 4 notifications, sorted by recency
  // (the API already returns them newest-first in mock mode).
  const timelineEvents = notifications.slice(0, 4);

  // Pending follow-ups for the secondary headline "X are waiting on you"
  const pendingCount = referrals.filter((r) => r.status === "pending").length;

  const greetingSubtitle =
    pendingCount > 0
      ? `${pendingCount} ${pendingCount === 1 ? "person is" : "people are"} waiting on you today.`
      : heroRoom
        ? "One room is calling your name today."
        : "Calm inbox. Quiet day. Make it count.";

  return (
    <div
      className="hy"
      style={{
        background: "var(--bg)",
        color: "var(--ink)",
        // AppLayout already constrains width; let the redesign breathe inside it.
        margin: "-24px -16px",
        padding: "32px 16px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* Greeting */}
        <div>
          <p style={sectionLabelStyle}>{formatToday()}</p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", marginTop: 6, lineHeight: 1.05 }}>
            Good day, <span className="display-italic">{firstName}.</span>
          </h1>
          <p style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: 16, margin: "8px 0 0" }}>
            {greetingSubtitle}
          </p>
        </div>

        {/* Hero room */}
        <HeroRoomCard room={heroRoom} loading={roomsQ.isLoading} />

        {/* Two-column grid */}
        <div
          className="dashboard-grid"
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
            alignItems: "start",
          }}
        >
          {/* Activity timeline */}
          <div
            style={{
              ...cardStyle,
              padding: 24,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3 style={{ fontSize: 20, fontFamily: "var(--display)", fontWeight: 500, margin: 0 }}>
                Your warm activity
              </h3>
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".08em" }}
              >
                LAST UPDATES
              </span>
            </div>

            {notificationsQ.isLoading ? (
              <TimelineSkeleton />
            ) : timelineEvents.length === 0 ? (
              <EmptyTimeline />
            ) : (
              <div style={{ marginTop: 16, position: "relative", paddingLeft: 22 }}>
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    bottom: 6,
                    left: 6,
                    width: 1,
                    background: "var(--line)",
                  }}
                />
                {timelineEvents.map((n) => {
                  const dot = dotForType(n.type);
                  return (
                    <div key={n.id} style={{ position: "relative", paddingBottom: 16 }}>
                      <span
                        style={{
                          position: "absolute",
                          left: -22,
                          top: 4,
                          width: 13,
                          height: 13,
                          borderRadius: 999,
                          background: dot,
                          border: "2px solid var(--paper)",
                          boxShadow: `0 0 0 1px ${dot}`,
                        }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{n.title}</p>
                        <span
                          className="mono"
                          style={{
                            fontSize: 10,
                            color: "var(--ink-mute)",
                            flex: "none",
                            letterSpacing: ".05em",
                          }}
                        >
                          {n.time}
                        </span>
                      </div>
                      {n.body && (
                        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>{n.body}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <Link
              to="/app/notifications"
              style={{
                marginTop: 8,
                fontSize: 13,
                color: "var(--clay)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              See everything →
            </Link>
          </div>

          {/* Side panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Profile completion donut */}
            <div style={{ ...cardStyle, padding: 22, background: "var(--cream)" }}>
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <DonutPct pct={pct} />
                <div>
                  <p style={{ ...sectionLabelStyle, fontSize: 10 }}>Profile</p>
                  <p
                    style={{
                      fontFamily: "var(--display)",
                      fontSize: 24,
                      marginTop: 2,
                      lineHeight: 1,
                    }}
                  >
                    {pct}% warm
                  </p>
                  <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 6 }}>
                    {completedCount === checklist.length
                      ? "Your profile is complete — hosts say yes faster."
                      : `${checklist.length - completedCount} thing${
                          checklist.length - completedCount === 1 ? "" : "s"
                        } left. Each one helps hosts say yes.`}
                  </p>
                </div>
              </div>

              {/* Mini checklist preview */}
              <ul
                style={{
                  marginTop: 14,
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {checklist.slice(0, 4).map((c) => (
                  <li
                    key={c.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 13,
                      color: c.done ? "var(--ink-mute)" : "var(--ink)",
                      textDecoration: c.done ? "line-through" : "none",
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 999,
                        background: c.done ? "var(--clay)" : "transparent",
                        border: `1.5px solid ${c.done ? "var(--clay)" : "var(--line)"}`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--paper)",
                        flex: "none",
                      }}
                    >
                      {c.done && I.check}
                    </span>
                    {c.label}
                  </li>
                ))}
              </ul>

              <Link
                to="/app/profile"
                style={{ display: "block", textDecoration: "none", marginTop: 14 }}
              >
                <Btn
                  kind="soft"
                  size="md"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Complete your profile
                </Btn>
              </Link>
            </div>

            {/* Founding-member card */}
            <div
              style={{
                ...cardStyle,
                padding: 22,
                background: "var(--clay)",
                color: "var(--paper)",
                borderColor: "transparent",
              }}
            >
              <p
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  opacity: 0.85,
                  margin: 0,
                }}
              >
                Founding member
              </p>
              <p
                style={{
                  fontFamily: "var(--display)",
                  fontSize: 20,
                  marginTop: 6,
                  lineHeight: 1.2,
                }}
              >
                You're shaping what Hayy becomes next.
              </p>
              <Link
                to="/app/settings"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 14,
                  fontSize: 13,
                  color: "var(--paper)",
                  textDecoration: "none",
                  fontWeight: 500,
                  opacity: 0.95,
                }}
              >
                Share feedback {I.arrow}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Hero room card
// ---------------------------------------------------------------------------

const HeroRoomCard = ({ room, loading }: { room: Room | null; loading: boolean }) => {
  if (loading) {
    return (
      <div
        style={{
          ...cardStyle,
          padding: 26,
          minHeight: 220,
          background: "linear-gradient(135deg, var(--paper), var(--cream))",
        }}
      >
        <p
          className="mono"
          style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".08em" }}
        >
          LOADING TODAY'S ROOM…
        </p>
      </div>
    );
  }

  if (!room) {
    return (
      <div
        style={{
          ...cardStyle,
          padding: 26,
          background: "linear-gradient(135deg, var(--paper), var(--cream))",
        }}
      >
        <p style={{ ...sectionLabelStyle, fontSize: 10 }}>Quiet today</p>
        <h2
          style={{
            fontSize: 28,
            marginTop: 12,
            lineHeight: 1.1,
            fontFamily: "var(--display)",
            fontWeight: 500,
          }}
        >
          No live or upcoming rooms <span className="display-italic">yet</span>.
        </h2>
        <p style={{ marginTop: 10, color: "var(--ink-soft)", fontSize: 14 }}>
          Browse the rooms feed to RSVP — we'll surface the next one here.
        </p>
        <Link to="/app/rooms" style={{ display: "inline-block", marginTop: 18, textDecoration: "none" }}>
          <Btn kind="primary" iconRight={I.arrow}>
            Browse rooms
          </Btn>
        </Link>
      </div>
    );
  }

  const startsLabel = formatStartTime(room);

  return (
    <div
      className="dashboard-hero"
      style={{
        ...cardStyle,
        padding: 26,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 240px",
        gap: 24,
        alignItems: "center",
        background: "linear-gradient(135deg, var(--paper), var(--cream))",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {room.status === "live" ? (
            <LiveTag>{startsLabel}</LiveTag>
          ) : (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: "var(--radius-pill)",
                background: "var(--paper)",
                border: "1px solid var(--line)",
                fontSize: 11,
                fontFamily: "var(--mono)",
                color: "var(--ink-soft)",
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              {startsLabel}
            </span>
          )}
          <span
            className="mono"
            style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".08em" }}
          >
            {room.company.toUpperCase()}
          </span>
        </div>
        <h2
          style={{
            fontSize: "clamp(22px, 3vw, 32px)",
            marginTop: 12,
            lineHeight: 1.05,
            fontFamily: "var(--display)",
            fontWeight: 500,
          }}
        >
          {room.title}
        </h2>
        <p style={{ marginTop: 10, color: "var(--ink-soft)", fontSize: 14 }}>
          {room.attendees > 0 && `${room.attendees} attending · `}
          {room.speakers} speaker{room.speakers === 1 ? "" : "s"} · {room.durationMin} min
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <Link to={`/app/rooms/${room.id}`} style={{ textDecoration: "none" }}>
            <Btn kind="primary" iconRight={I.arrow}>
              {room.status === "live" ? "Join the room" : "View details"}
            </Btn>
          </Link>
          {room.status === "upcoming" && (
            <Link to={`/app/rooms/${room.id}`} style={{ textDecoration: "none" }}>
              <Btn kind="ghost">Remind me</Btn>
            </Link>
          )}
        </div>
      </div>

      {/* Tag chip column — uses the room's own tags so it's not fixture data */}
      <HeroTagsColumn tags={room.tags} />

      <style>{`
        @media (max-width: 720px) {
          .dashboard-hero { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const HeroTagsColumn = ({ tags }: { tags: string[] }) => {
  if (!tags.length) return <span />;
  const tones = ["clay", "olive", "sand"] as const;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {tags.slice(0, 3).map((t, i) => (
        <div
          key={t}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 14,
            background: "var(--paper)",
            border: "1px solid var(--line-soft)",
          }}
        >
          <Avatar name={t} size={28} tone={tones[i % tones.length]} />
          <span style={{ fontSize: 12, fontWeight: 500 }}>{t}</span>
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Empty / loading bits
// ---------------------------------------------------------------------------

const TimelineSkeleton = (): ReactNode => (
  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        style={{
          height: 36,
          borderRadius: 8,
          background: "var(--line-soft)",
          opacity: 0.6,
        }}
      />
    ))}
  </div>
);

const EmptyTimeline = (): ReactNode => (
  <p style={{ marginTop: 16, fontSize: 14, color: "var(--ink-soft)" }}>
    No activity yet. Join your first room to start filling this timeline.
  </p>
);

export default Dashboard;
