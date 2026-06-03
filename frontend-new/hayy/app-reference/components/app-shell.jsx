// Hayy — minimal, app-native screens.
// Same language as the App Entry: brand-first, generous whitespace, soft wash,
// one clear focus per screen. Mobile-only. Inspired by the restraint of
// high-use apps (iMessage, Clubhouse, Airbnb, Partiful).
//
// All screens fill a phone screen: status-bar safe top (~54), scroll body,
// a shared bottom TabBar above the home indicator (~34).

const SAFE_TOP = 56;
const TAB_H = 80; // tab bar height incl. home-indicator clearance

// ── Navigation context (used by the wiring prototype) ──────────────
const NavContext = React.createContext({ go: () => {}, back: () => {} });
const useNav = () => React.useContext(NavContext);
// In the static gallery there's no provider, so go/back are harmless no-ops.

// ── Soft brand wash (top of every screen) ──────────────────────────
const Wash = () => (
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0, height: 320, pointerEvents: "none",
    background: "radial-gradient(120% 70% at 50% -8%, color-mix(in oklab, var(--clay) 14%, var(--bg)) 0%, var(--bg) 60%)",
    zIndex: 0,
  }} />
);

// ── Bottom tab bar — shared across screens ─────────────────────────
const TABS = [
  { id: "home", label: "Home", icon: I.home },
  { id: "activity", label: "Activity", icon: I.bell, dot: true },
  { id: "host", label: "Start", icon: I.plus, center: true },
  { id: "inbox", label: "Inbox", icon: I.msg, badge: 2 },
  { id: "you", label: "You", icon: I.users },
];

const TabBar = ({ active = "home", onTab }) => {
  const nav = useNav();
  const handle = onTab || ((id) => nav.go(id));
  return (
  <nav style={{
    position: "relative", zIndex: 5, flex: "none",
    paddingTop: 12, paddingBottom: 30, paddingLeft: 14, paddingRight: 14,
    background: "var(--paper)",
    borderTop: "1px solid var(--line)",
    boxShadow: "0 -10px 30px -12px color-mix(in oklab, var(--ink) 22%, transparent)",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  }}>
    {TABS.map(t => {
      const on = t.id === active;
      if (t.center) {
        return (
          <div key={t.id} onClick={() => handle(t.id)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flex: 1, cursor: "pointer",
          }}>
            <span style={{
              width: 46, height: 46, borderRadius: 16, marginTop: -2,
              background: "var(--clay)", color: "var(--paper)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 18px -6px color-mix(in oklab, var(--clay) 70%, transparent)",
            }}>{React.cloneElement(t.icon, { size: 24, stroke: 2.2 })}</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".01em", color: "var(--ink-mute)" }}>{t.label}</span>
          </div>
        );
      }
      return (
        <div key={t.id} onClick={() => handle(t.id)} style={{
          position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flex: 1,
          color: on ? "var(--clay)" : "var(--ink-mute)", cursor: "pointer",
        }}>
          <span style={{ position: "relative" }}>
            {React.cloneElement(t.icon, { size: 23, stroke: on ? 2 : 1.6 })}
            {t.badge && (
              <span className="mono" style={{
                position: "absolute", top: -5, right: -9,
                minWidth: 15, height: 15, padding: "0 4px", borderRadius: 999,
                background: "var(--clay)", color: "var(--paper)", fontSize: 9, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid var(--paper)",
              }}>{t.badge}</span>
            )}
            {t.dot && !on && (
              <span style={{
                position: "absolute", top: -2, right: -3, width: 7, height: 7, borderRadius: 999,
                background: "var(--clay)", border: "1.5px solid var(--paper)",
              }} />
            )}
          </span>
          <span style={{ fontSize: 10, fontWeight: on ? 600 : 500, letterSpacing: ".01em" }}>{t.label}</span>
        </div>
      );
    })}
  </nav>
  );
};

// ── Screen shell ───────────────────────────────────────────────────
const AppScreen = ({ children, tab = "home", wash = true, pad = true, scroll = true, bg = "var(--bg)", onTab }) => (
  <div className="hy" style={{
    position: "relative", width: "100%", height: "100%", overflow: "hidden",
    display: "flex", flexDirection: "column", background: bg, fontFamily: "var(--body)",
  }}>
    {wash && <Wash />}
    <div style={{
      flex: 1, minHeight: 0, overflowY: scroll ? "auto" : "hidden", position: "relative", zIndex: 1,
      paddingTop: SAFE_TOP, paddingLeft: pad ? 22 : 0, paddingRight: pad ? 22 : 0,
    }}>
      {children}
    </div>
    <TabBar active={tab} onTab={onTab} />
  </div>
);

// Compact screen header — eyebrow + big title, optional trailing control
const ScreenHead = ({ eyebrow, title, trailing, leading, sub }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
      {leading}
      <div>
        {eyebrow && <p className="mono" style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--clay)", whiteSpace: "nowrap" }}>{eyebrow}</p>}
        <h1 style={{ fontSize: 34, lineHeight: 1.02, marginTop: eyebrow ? 7 : 0 }}>{title}</h1>
        {sub && <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 8 }}>{sub}</p>}
      </div>
    </div>
    {trailing}
  </div>
);

const RoundBtn = ({ icon, badge, onClick }) => (
  <button onClick={onClick} style={{
    position: "relative", width: 42, height: 42, borderRadius: 14, flex: "none",
    background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  }}>
    {icon}
    {badge && <span style={{ position: "absolute", top: 9, right: 9, width: 7, height: 7, borderRadius: 99, background: "var(--clay)", border: "1.5px solid var(--paper)" }} />}
  </button>
);

const Chevron = ({ dir = "left", size = 18 }) => (
  <Icon size={size} d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
);

// ── Drill-in screen: back header, sticky footer action, no tab bar ──
const DrillScreen = ({ children, title, eyebrow, action, onBack, footer, bg = "var(--bg)", wash = false, pad = true }) => {
  const nav = useNav();
  const back = onBack || nav.back;
  return (
  <div className="hy" style={{
    position: "relative", width: "100%", height: "100%", overflow: "hidden",
    display: "flex", flexDirection: "column", background: bg, fontFamily: "var(--body)",
  }}>
    {wash && <Wash />}
    {/* header */}
    <div style={{
      position: "relative", zIndex: 3, flex: "none", paddingTop: SAFE_TOP - 8,
      padding: `${SAFE_TOP - 8}px 16px 12px`,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <RoundBtn icon={<Chevron />} onClick={back} />
      <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
        {eyebrow && <p className="mono" style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--clay)" }}>{eyebrow}</p>}
        {title && <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.1, marginTop: eyebrow ? 2 : 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</p>}
      </div>
      <div style={{ width: 42, height: 42, flex: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>{action}</div>
    </div>
    {/* body */}
    <div style={{
      flex: 1, minHeight: 0, overflowY: "auto", position: "relative", zIndex: 1,
      paddingLeft: pad ? 22 : 0, paddingRight: pad ? 22 : 0, paddingTop: 6,
    }}>
      {children}
    </div>
    {/* footer */}
    {footer && (
      <div style={{
        position: "relative", zIndex: 3, flex: "none",
        padding: "14px 22px 34px", borderTop: "1px solid var(--line-soft)",
        background: "color-mix(in oklab, var(--paper) 90%, transparent)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      }}>{footer}</div>
    )}
  </div>
  );
};

Object.assign(window, { AppScreen, TabBar, ScreenHead, RoundBtn, Wash, DrillScreen, Chevron, NavContext, useNav, SAFE_TOP, TAB_H });
