import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { HayyAvatar } from "@/components/ui/HayyAvatar";

// LiveRoomCard kept imported for future use — not rendered in Phase 11B
import { LiveRoomCard as _LiveRoomCard } from "./LiveRoomCard";
void _LiveRoomCard;

const stageRoster = [
  { name: "Maya Nasrallah", role: "Sr PM, AWS",          tone: "clay"  as const },
  { name: "Rashid Khoury",  role: "Eng Mgr, Amazon",     tone: "dark"  as const },
  { name: "Jenna Sun",      role: "Talent, Shopify",      tone: "olive" as const },
  { name: "Omar Aziz",      role: "Data, RBC",            tone: "clay"  as const },
  { name: "Layla Park",     role: "Design, Figma",        tone: "sand"  as const },
  { name: "Ben Tanaka",     role: "Founder",              tone: "olive" as const },
  { name: "Priya Shah",     role: "Recruiter, Stripe",    tone: "dark"  as const },
];

const heroStats = [
  { value: "412", label: "Members"    },
  { value: "38",  label: "Companies"  },
  { value: "61",  label: "Warm Intros"},
];

const display = "'Fraunces', Georgia, serif";
const mono    = "monospace";
const sans    = "'Inter', system-ui, sans-serif";

export const Hero = () => {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--bg)",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "56px 56px 40px",
        overflow: "hidden",
      }}
      className="hy-hero-section"
    >
      {/* Keyframes injected once per render — lightweight */}
      <style>{`
        @keyframes hy-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(1.6); }
        }
        .hy-livedot { animation: hy-pulse 1.6s ease-in-out infinite; }
        @media (max-width: 768px) {
          .hy-hero-section { padding: 40px 20px 32px !important; min-height: auto !important; }
          .hy-hero-h1      { font-size: clamp(40px, 11vw, 72px) !important; }
          .hy-hero-btns    { flex-direction: column !important; }
        }
      `}</style>

      {/* ── 1. Live dot line ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 28,
        }}
      >
        <span
          className="hy-livedot"
          style={{
            display: "inline-block",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--live)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: mono,
            fontSize: 11,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "var(--clay)",
          }}
        >
          Tonight at 7pm · Room 04
        </span>
      </div>

      {/* ── 2. H1 heading ── */}
      <h1
        className="hy-hero-h1"
        style={{
          fontFamily: display,
          fontSize: "clamp(52px, 8.5vw, 112px)",
          lineHeight: 0.92,
          letterSpacing: "-0.04em",
          fontWeight: 500,
          color: "var(--ink)",
          margin: 0,
          maxWidth: "14em",
        }}
      >
        You're{" "}
        <span style={{ fontStyle: "italic", color: "var(--clay)" }}>
          two rooms
        </span>{" "}
        away
        <br />
        from the conversation
        <br />
        that changes{" "}
        <span
          style={{
            borderBottom: "3px solid var(--clay)",
            paddingBottom: 4,
          }}
        >
          everything.
        </span>
      </h1>

      {/* ── 3. Buttons ── */}
      <div
        className="hy-hero-btns"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginTop: 36,
        }}
      >
        <Link
          to="/signup"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--clay)",
            color: "var(--paper)",
            borderRadius: "var(--radius-pill)",
            padding: "16px 26px",
            fontSize: 16,
            fontWeight: 500,
            fontFamily: sans,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Reserve a seat
          <ArrowRight size={16} />
        </Link>

        <Link
          to="/signup?type=host"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--paper)",
            color: "var(--ink)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-pill)",
            padding: "16px 26px",
            fontSize: 16,
            fontWeight: 500,
            fontFamily: sans,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          <Sparkles size={15} />
          See who's hosting
        </Link>
      </div>

      {/* ── 4. On stage tonight roster (desktop only) ── */}
      <div
        className="hy-desktop-only"
        style={{
          flexDirection: "column",
          gap: 12,
          marginTop: 56,
        }}
      >
        <p
          style={{
            fontFamily: mono,
            fontSize: 10,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "var(--ink-mute)",
            margin: 0,
          }}
        >
          On stage tonight —
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 18px",
          }}
        >
          {stageRoster.map((person) => (
            <div
              key={person.name}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <HayyAvatar name={person.name} size={22} tone={person.tone} />
              <span
                style={{
                  fontSize: 13,
                  color: "var(--ink-soft)",
                  fontFamily: sans,
                  whiteSpace: "nowrap",
                }}
              >
                {person.name}
                <span style={{ color: "var(--ink-mute)" }}> · {person.role}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Bottom-right stat block (desktop only) ── */}
      <div
        className="hy-desktop-only"
        style={{
          position: "absolute",
          right: 56,
          bottom: 40,
          flexDirection: "row",
          gap: 32,
          alignItems: "flex-end",
        }}
      >
        {heroStats.map((s) => (
          <div key={s.label} style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: display,
                fontSize: 38,
                lineHeight: 1,
                color: "var(--ink)",
                fontWeight: 500,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 10,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--ink-mute)",
                marginTop: 4,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
