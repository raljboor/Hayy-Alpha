// Hayy — App entry experience.
// Minimal launch: a brand-logo splash that SEGUES into a login screen.
// Inspiration: the launch/login screens of high-use apps (Spotify, Instagram,
// Linear, Airbnb) — restrained, brand-first, one clear path in.
//
// The logo is a single persistent element: it begins centered (splash), then
// glides up to make room as the auth panel rises beneath it.

// ── Brand mark (the Hayy "H": two bars + center node) ──────────────
const HayyMark = ({ size = 1, color = "var(--clay)" }) => (
  <svg viewBox="0 0 64 64" width={64 * size} height={64 * size} fill={color}
    style={{ display: "block" }} aria-label="Hayy">
    <rect x="12" y="9" width="9" height="46" rx="2.4" />
    <rect x="43" y="9" width="9" height="46" rx="2.4" />
    <circle cx="32" cy="32" r="7.2" />
  </svg>
);

// ── Provider button ────────────────────────────────────────────────
const ProviderBtn = ({ glyph, label, primary, onClick }) => (
  <button onClick={onClick} style={{
    width: "100%", height: 52, borderRadius: 14, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    fontSize: 15, fontWeight: 600, fontFamily: "var(--body)",
    border: primary ? "none" : "1px solid var(--line)",
    background: primary ? "var(--clay)" : "transparent",
    color: primary ? "var(--paper, #fff)" : "var(--ink)",
    transition: "transform .12s ease, opacity .12s ease",
  }}
    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.985)")}
    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
    {glyph}{label}
  </button>
);

const GAppleGlyph = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ flex: "none" }}>
    <path d="M16.36 12.8c.02 2.49 2.2 3.32 2.23 3.33-.02.06-.35 1.2-1.15 2.37-.69 1.01-1.4 2.02-2.54 2.04-1.11.02-1.47-.66-2.74-.66s-1.67.64-2.72.68c-1.09.04-1.93-1.1-2.62-2.11-1.42-2.06-2.5-5.82-1.05-8.36.72-1.26 2.01-2.06 3.4-2.08 1.07-.02 2.09.72 2.75.72.66 0 1.9-.89 3.2-.76.54.02 2.06.22 3.04 1.64-.08.05-1.81 1.06-1.79 3.16M14.13 5.6c.59-.71.98-1.7.87-2.69-.85.03-1.87.57-2.48 1.28-.54.63-1.02 1.64-.89 2.6.94.08 1.91-.48 2.5-1.19" />
  </svg>
);

const GGoogleGlyph = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" style={{ flex: "none" }}>
    <path fill="#4285F4" d="M23 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.16c-.27 1.4-1.07 2.59-2.28 3.39v2.82h3.69C21.64 18.74 23 15.79 23 12.27z" />
    <path fill="#34A853" d="M12 23c3.08 0 5.66-1.02 7.55-2.76l-3.69-2.82c-1.02.69-2.33 1.1-3.86 1.1-2.97 0-5.49-2-6.39-4.7H1.7v2.91C3.58 20.45 7.5 23 12 23z" />
    <path fill="#FBBC05" d="M5.61 13.82c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18V6.55H1.7C.92 8.1.48 9.85.48 11.64s.44 3.54 1.22 5.09l3.91-2.91z" />
    <path fill="#EA4335" d="M12 5.76c1.67 0 3.18.57 4.36 1.7l3.27-3.27C17.66 2.36 15.08 1.36 12 1.36 7.5 1.36 3.58 3.91 1.7 7.55l3.91 2.91c.9-2.7 3.42-4.7 6.39-4.7z" />
  </svg>
);

const GMailGlyph = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);

// ════════════════════════════════════════════════════════════════════
// Entry screen — splash that segues into login. `phase` is controlled
// from the host so the same component drives every frame in the canvas.
//   phase: "splash" | "login"
// ════════════════════════════════════════════════════════════════════
const HayyEntry = ({ phase = "login", brandColor = "var(--clay)", onEmail, onProvider }) => {
  const isSplash = phase === "splash";

  return (
    <div className="hy hayy-entry" style={{
      position: "relative", width: "100%", height: "100%", overflow: "hidden",
      background: "var(--bg)", display: "flex", flexDirection: "column",
      fontFamily: "var(--body)",
    }}>
      {/* Soft brand wash behind everything */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: isSplash
          ? "radial-gradient(120% 80% at 50% 42%, color-mix(in oklab, var(--clay) 16%, var(--bg)) 0%, var(--bg) 62%)"
          : "radial-gradient(140% 70% at 50% -10%, color-mix(in oklab, var(--clay) 12%, var(--bg)) 0%, var(--bg) 50%)",
        transition: "background .9s ease",
      }} />

      {/* LOGO LOCKUP — single element that glides between positions */}
      <div style={{
        position: "absolute", left: 0, right: 0,
        top: isSplash ? "50%" : "13%",
        transform: isSplash ? "translateY(-50%)" : "translateY(0)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 18,
        transition: "top .9s cubic-bezier(.7,0,.2,1), transform .9s cubic-bezier(.7,0,.2,1)",
        zIndex: 2,
      }}>
        <div style={{
          width: 84, height: 84, borderRadius: 24, background: "var(--paper, #fff)",
          border: "1px solid var(--line)", boxShadow: "var(--shadow-warm, 0 18px 50px -20px rgba(80,40,20,.35))",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: isSplash ? "scale(1)" : "scale(.78)",
          transition: "transform .9s cubic-bezier(.7,0,.2,1)",
        }}>
          <HayyMark size={0.62} color={brandColor} />
        </div>
        <div style={{
          fontFamily: "var(--display)", fontSize: 30, fontWeight: 500,
          letterSpacing: ".26em", paddingLeft: ".26em", color: "var(--ink)",
        }}>HAYY</div>
        <div style={{
          fontSize: 13.5, color: "var(--ink-mute)", letterSpacing: ".02em",
          opacity: isSplash ? 1 : 0, height: isSplash ? "auto" : 0,
          transition: "opacity .5s ease",
        }}>Careers grow in conversation</div>
      </div>

      {/* SPLASH loader dot */}
      <div style={{
        position: "absolute", bottom: 54, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity: isSplash ? 1 : 0, transition: "opacity .4s ease",
      }}>
        <span className="hy-livedot" style={{ width: 8, height: 8 }} />
      </div>

      {/* LOGIN PANEL — rises in beneath the logo */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        padding: "0 28px 44px",
        display: "flex", flexDirection: "column", gap: 11,
        transform: isSplash ? "translateY(24px)" : "translateY(0)",
        opacity: isSplash ? 0 : 1,
        transition: "opacity .6s ease .25s, transform .8s cubic-bezier(.7,0,.2,1) .2s",
        zIndex: 2,
      }}>
        <p style={{
          textAlign: "center", fontSize: 25, lineHeight: 1.12, fontFamily: "var(--display)",
          fontWeight: 500, marginBottom: 8,
        }}>
          You're two rooms from your<br />next <span className="display-italic" style={{ fontStyle: "italic" }}>yes.</span>
        </p>
        <p style={{
          textAlign: "center", fontSize: 14, lineHeight: 1.5, color: "var(--ink-soft)",
          marginBottom: 18, padding: "0 8px",
        }}>
          Meet the people inside the companies you care about — not their inboxes.
        </p>

        <ProviderBtn primary glyph={<GAppleGlyph />} label="Continue with Apple" onClick={onProvider} />
        <ProviderBtn glyph={<GGoogleGlyph />} label="Continue with Google" onClick={onProvider} />
        <ProviderBtn glyph={<GMailGlyph />} label="Continue with email" onClick={onEmail} />

        <div style={{
          textAlign: "center", marginTop: 12, fontSize: 14, color: "var(--ink-soft)",
        }}>
          Already a member? <span style={{ color: "var(--clay)", fontWeight: 600 }}>Sign in</span>
        </div>

        <p style={{
          textAlign: "center", marginTop: 10, fontSize: 11, lineHeight: 1.5,
          color: "var(--ink-mute)", padding: "0 14px",
        }}>
          By continuing you agree to Hayy's <u>Terms</u> & <u>Privacy Policy</u>.
        </p>
      </div>
    </div>
  );
};

// ── Self-running version for the interactive phone (splash→login once) ──
const HayyEntryLive = ({ brandColor }) => {
  const [phase, setPhase] = React.useState("splash");
  React.useEffect(() => {
    const t = setTimeout(() => setPhase("login"), 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div onClick={() => setPhase("login")} style={{ width: "100%", height: "100%" }}>
      <HayyEntry phase={phase} brandColor={brandColor} />
    </div>
  );
};

Object.assign(window, { HayyEntry, HayyEntryLive, HayyMark });
