/**
 * Public landing page — ported from the redesign HeroA + HeroNav mocks
 * (frontend-new/hayy/project/components/hero.jsx).
 *
 * Wraps in `.hy hy-bg-hero` so redesign tokens + warm radial gradient resolve.
 *
 * The LiveRoomPreview card pulls a real room (live > nearest upcoming) via
 * useQuery(getRooms) — no fixture data. If no rooms are loaded yet, falls
 * back to a placeholder card so the layout never collapses.
 *
 * The previous Index sections (PublicHeader, ProblemSolution, HowItWorks,
 * UpcomingRooms, ForHosts, ForRecruiters, JoinSection, Footer) are
 * intentionally removed — the redesign's hero IS the landing page in this
 * direction. Those sections can be re-added in their own redesign pass.
 */

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Btn, I, LiveTag, Waveform } from "@/components/ui/primitives";
import { getRooms } from "@/lib/api/rooms";
import type { Room } from "@/data/mockData";
import type { CSSProperties } from "react";

const HeroNav = () => (
  <header
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 8,
      gap: 16,
      flexWrap: "wrap",
    }}
  >
    <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            background: "var(--clay)",
            color: "var(--paper)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--display)",
            fontWeight: 600,
            fontSize: 18,
            fontStyle: "italic",
          }}
        >
          h
        </span>
        <span style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 500 }}>
          Hayy
        </span>
      </div>
    </Link>

    <nav
      className="hidden md:flex"
      style={{ gap: 28, fontSize: 14, color: "var(--ink-soft)" }}
    >
      <Link to="/login" style={{ color: "inherit", textDecoration: "none" }}>
        Rooms
      </Link>
      <Link to="/signup?type=host" style={{ color: "inherit", textDecoration: "none" }}>
        Hosts
      </Link>
      <Link
        to="/signup?type=recruiter"
        style={{ color: "inherit", textDecoration: "none" }}
      >
        For recruiters
      </Link>
    </nav>

    <div style={{ display: "flex", gap: 8 }}>
      <Link to="/login" className="hidden md:inline-flex" style={{ textDecoration: "none" }}>
        <Btn kind="ghost">Sign in</Btn>
      </Link>
      <Link to="/signup" style={{ textDecoration: "none" }}>
        <Btn kind="primary">Join Hayy</Btn>
      </Link>
    </div>
  </header>
);

// ---------------------------------------------------------------------------
// LiveRoomPreview — pulled from real rooms, not fixture content
// ---------------------------------------------------------------------------

function pickFeaturedRoom(rooms: Room[]): Room | null {
  if (rooms.length === 0) return null;
  const live = rooms.find((r) => r.status === "live");
  if (live) return live;
  const upcoming = rooms
    .filter((r) => r.status === "upcoming")
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  return upcoming[0] ?? rooms[0] ?? null;
}

const cardStyle: CSSProperties = {
  background: "var(--paper)",
  border: "1px solid var(--line-soft)",
  borderRadius: "var(--radius-xl)",
  boxShadow: "var(--shadow-warm)",
  position: "relative",
  padding: 24,
};

const LiveRoomPreview = ({ room }: { room: Room | null }) => {
  if (!room) {
    return (
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-mute)",
              letterSpacing: ".08em",
            }}
          >
            ROOMS LOADING…
          </span>
        </div>
        <h3 style={{ fontSize: 26, marginTop: 14, lineHeight: 1.1 }}>
          Live rooms appear here as soon as a host opens one.
        </h3>
        <p style={{ marginTop: 8, fontSize: 13, color: "var(--ink-soft)" }}>
          Sign up to be in the founding cohort.
        </p>
      </div>
    );
  }

  const isLive = room.status === "live";
  const tones: ("clay" | "olive" | "sand" | "dark")[] = ["clay", "olive", "sand", "dark"];
  const speakerSlots = Array.from({ length: Math.min(room.speakers || 4, 4) });

  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {isLive ? (
          <LiveTag>Live · {room.attendees} listening</LiveTag>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: "var(--radius-pill)",
              background: "var(--cream)",
              border: "1px solid var(--line)",
              fontSize: 11,
              fontFamily: "var(--mono)",
              color: "var(--ink-soft)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            Upcoming · {new Date(room.startsAt).toLocaleDateString()}
          </span>
        )}
        <span
          className="mono"
          style={{ fontSize: 11, color: "var(--ink-soft)", letterSpacing: ".06em" }}
        >
          {room.company.toUpperCase()}
        </span>
      </div>

      <h3 style={{ fontSize: 26, marginTop: 14, lineHeight: 1.1 }}>{room.title}</h3>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 8 }}>
        {room.speakers} speaker{room.speakers === 1 ? "" : "s"} · {room.durationMin} min
      </p>

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
        }}
      >
        {speakerSlots.map((_, i) => {
          const tag = room.tags[i] ?? `Tag ${i + 1}`;
          const tone = tones[i % tones.length];
          const speaking = isLive && i < 2;
          return (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar name={tag} size={52} tone={tone} />
                {speaking && (
                  <span
                    style={{
                      position: "absolute",
                      inset: -4,
                      borderRadius: "50%",
                      border: "2px solid var(--clay)",
                    }}
                  />
                )}
              </div>
              <p style={{ fontSize: 11, marginTop: 6, fontWeight: 500 }}>{tag}</p>
            </div>
          );
        })}
      </div>

      {isLive && (
        <div
          style={{
            marginTop: 18,
            padding: "12px 14px",
            borderRadius: "var(--radius-md)",
            background: "var(--cream)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Waveform bars={20} height={22} color="var(--clay)" />
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
            Live audio in this room.
          </span>
        </div>
      )}

      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          className="mono"
          style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em" }}
        >
          {isLive ? "Join in seconds" : "RSVP to be notified"}
        </span>
        <Link to="/signup" style={{ textDecoration: "none" }}>
          <Btn kind="primary" iconRight={I.arrow}>
            {isLive ? "Tap to join" : "Reserve a seat"}
          </Btn>
        </Link>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const Index = () => {
  const { data: rooms = [] } = useQuery({
    queryKey: ["public-rooms"],
    queryFn: getRooms,
    staleTime: 60_000,
  });
  const featured = pickFeaturedRoom(rooms);
  const liveCount = rooms.filter((r) => r.status === "live").length;

  return (
    <div
      className="hy hy-bg-hero"
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "clamp(20px, 4vw, 56px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <HeroNav />

      <div
        className="landing-hero-grid"
        style={{
          flex: 1,
          display: "grid",
          gap: "clamp(24px, 4vw, 56px)",
          gridTemplateColumns: "1.05fr 1fr",
          alignItems: "center",
          marginTop: 40,
        }}
      >
        <div>
          <span
            className="hy-pill"
            style={{ marginBottom: 22, display: "inline-flex" }}
          >
            <span className="hy-livedot" />
            {liveCount > 0
              ? `${liveCount} room${liveCount === 1 ? "" : "s"} live now`
              : "Rooms open daily"}
          </span>
          <h1
            style={{
              fontSize: "clamp(44px, 7vw, 84px)",
              fontWeight: 500,
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
            }}
          >
            Careers grow
            <br />
            <span className="display-italic">in conversation.</span>
          </h1>
          <p
            style={{
              marginTop: 24,
              fontSize: "clamp(16px, 2vw, 19px)",
              color: "var(--ink-soft)",
              maxWidth: 480,
              lineHeight: 1.5,
            }}
          >
            Hayy is a live community where you meet the people inside companies you care about
            — not their inboxes. Drop into a room, get warm, then ask for the referral.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 32, flexWrap: "wrap" }}>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <Btn kind="primary" size="xl" iconRight={I.arrow}>
                Join the next room
              </Btn>
            </Link>
            <Link to="/signup?type=host" style={{ textDecoration: "none" }}>
              <Btn kind="soft" size="xl">
                Become a host
              </Btn>
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              gap: 22,
              marginTop: 36,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex" }}>
              {(["clay", "olive", "sand", "dark"] as const).map((tone, i) => (
                <span key={tone} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                  <Avatar name={["AB", "MN", "RK", "JS"][i]} size={34} tone={tone} />
                </span>
              ))}
            </div>
            <div
              className="mono"
              style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.4 }}
            >
              Founding cohort of newcomers,
              <br />
              hosts &amp; operators.
            </div>
          </div>
        </div>

        <div className="landing-hero-preview">
          <LiveRoomPreview room={featured} />
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .landing-hero-grid { grid-template-columns: 1fr !important; margin-top: 24px !important; }
          .landing-hero-preview { margin-top: 12px; }
        }
      `}</style>
    </div>
  );
};

export default Index;
