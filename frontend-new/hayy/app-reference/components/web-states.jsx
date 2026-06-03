// Web parity states — the front-end equivalents of the app's state screens
// (Loading · Empty Inbox · Empty Schedule · Offline · No Results). Same logic
// as the app: every list has an empty state, the app has a skeleton + offline +
// no-results. Reuses Sidebar / MobileTopbar / MobileTabbar / Btn / Avatar / I.

const Eyebrow = ({ children, color = "var(--clay)" }) => (
  <p className="mono" style={{ fontSize: 11, color, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>{children}</p>
);

// Shared frame: desktop sidebar + main; mobile topbar/tabbar.
const StateFrame = ({ device, active, tab, children }) => {
  const isMobile = device === "mobile";
  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active={active} />}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {isMobile && <div style={{ padding: "18px 18px 0" }}><MobileTopbar /></div>}
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
        {isMobile && <div style={{ padding: "0 18px 0" }}><MobileTabbar active={tab} /></div>}
      </main>
    </div>
  );
};

// Centered empty / error layout used by Empty Inbox / Schedule / Offline.
const CenterState = ({ icon, eyebrow, title, body, primary, secondary, tone = "var(--clay)" }) => (
  <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40, gap: 4 }}>
    <div style={{
      width: 74, height: 74, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center",
      background: "color-mix(in oklab, " + tone + " 12%, var(--paper))", color: tone, marginBottom: 18,
      border: "1px solid color-mix(in oklab, " + tone + " 24%, var(--line))",
    }}>{React.cloneElement(icon, { size: 32 })}</div>
    {eyebrow && <Eyebrow color={tone}>{eyebrow}</Eyebrow>}
    <h1 style={{ fontSize: 30, marginTop: 6, lineHeight: 1.05 }}>{title}</h1>
    <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.55, maxWidth: 380, marginTop: 10 }}>{body}</p>
    <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap", justifyContent: "center" }}>
      {primary && <Btn kind="primary" iconRight={I.arrow}>{primary}</Btn>}
      {secondary && <Btn kind="soft">{secondary}</Btn>}
    </div>
  </div>
);

// ── LOADING / SKELETON ─────────────────────────────────────────────
const Skel = ({ w = "100%", h = 14, r = 10, style }) => (
  <div className="hy-skel" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

const WebLoading = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <StateFrame device={device} active="Home" tab="Home">
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: isMobile ? 18 : "32px 44px", display: "flex", flexDirection: "column", gap: isMobile ? 16 : 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Skel w={120} h={12} r={999} />
            <Skel w={isMobile ? 200 : 320} h={isMobile ? 30 : 44} r={12} />
            <Skel w={isMobile ? 160 : 220} h={14} r={999} />
          </div>
          {!isMobile && <Skel w={42} h={42} r={14} />}
        </div>
        {/* hero skeleton */}
        <div className="hy-card" style={{ padding: isMobile ? 18 : 26, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 240px", gap: 22 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Skel w={130} h={22} r={999} />
            <Skel w="80%" h={isMobile ? 24 : 30} r={10} />
            <Skel w="55%" h={14} r={999} />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Skel w={130} h={42} r={999} />
              <Skel w={100} h={42} r={999} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: 10 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                <Skel w={34} h={34} r={99} /><div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}><Skel w="70%" h={11} r={999} /><Skel w="50%" h={9} r={999} /></div>
              </div>
            ))}
          </div>
        </div>
        {/* grid skeleton */}
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", flex: 1, minHeight: 0 }}>
          <div className="hy-card" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
            <Skel w={160} h={18} r={999} />
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Skel w={13} h={13} r={99} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}><Skel w="85%" h={13} r={999} /><Skel w="55%" h={10} r={999} /></div>
              </div>
            ))}
          </div>
          {!isMobile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="hy-card" style={{ padding: 22, display: "flex", gap: 16, alignItems: "center" }}><Skel w={72} h={72} r={99} /><div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}><Skel w="60%" h={12} r={999} /><Skel w="80%" h={18} r={10} /><Skel w="90%" h={11} r={999} /></div></div>
              <div className="hy-card" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12 }}><Skel w="50%" h={12} r={999} /><Skel w="90%" h={18} r={10} /><Skel w="100%" h={22} r={8} /></div>
            </div>
          )}
        </div>
      </div>
    </StateFrame>
  );
};

// ── EMPTY INBOX ────────────────────────────────────────────────────
const WebEmptyInbox = ({ device = "desktop" }) => (
  <StateFrame device={device} active="Inbox" tab="Inbox">
    <div style={{ padding: device === "mobile" ? "18px 18px 12px" : "28px 48px 18px", borderBottom: "1px solid var(--line-soft)" }}>
      <Eyebrow>Inbox</Eyebrow>
      <h1 style={{ fontSize: device === "mobile" ? 30 : 40, marginTop: 6, lineHeight: 1.05 }}>Warm intros land here</h1>
    </div>
    <CenterState
      icon={I.msg}
      eyebrow="Nothing yet"
      title="Your inbox is quiet — for now"
      body="When you meet someone in a room or ask for a warm intro, the conversation shows up here, with the room you met in attached. No cold DMs."
      primary="Find a room to join"
      secondary="Browse hosts"
    />
  </StateFrame>
);

// ── EMPTY SCHEDULE ─────────────────────────────────────────────────
const WebEmptySchedule = ({ device = "desktop" }) => (
  <StateFrame device={device} active="Rooms" tab="Home">
    <div style={{ padding: device === "mobile" ? "18px 18px 12px" : "28px 48px 18px", borderBottom: "1px solid var(--line-soft)" }}>
      <Eyebrow>Your schedule</Eyebrow>
      <h1 style={{ fontSize: device === "mobile" ? 30 : 40, marginTop: 6, lineHeight: 1.05 }}>Nothing booked yet</h1>
    </div>
    <CenterState
      icon={I.cal}
      eyebrow="Empty week"
      title="No rooms or calls on the calendar"
      body="Reserve a room or book a 1:1 with a host and it'll show up here, grouped by day. We'll remind you before it starts."
      primary="Discover rooms this week"
      secondary="Host a room"
    />
  </StateFrame>
);

// ── OFFLINE / ERROR ────────────────────────────────────────────────
const WebOffline = ({ device = "desktop" }) => (
  <StateFrame device={device} active="Home" tab="Home">
    <CenterState
      icon={I.wifiOff}
      tone="var(--ink-soft)"
      eyebrow="Connection lost"
      title="You're offline"
      body="The rooms need a connection. Check your network and we'll pick up right where you left off — nothing's lost."
      primary="Try again"
      secondary="View saved"
    />
  </StateFrame>
);

// ── NO RESULTS (search empty) ──────────────────────────────────────
const WebNoResults = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <StateFrame device={device} active="Search" tab="Home">
      <div style={{ padding: isMobile ? "18px 18px 12px" : "32px 48px 18px", borderBottom: "1px solid var(--line-soft)" }}>
        <Eyebrow>Discover</Eyebrow>
        <div style={{
          marginTop: 12, display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
          borderRadius: 14, border: "1px solid var(--line)", background: "var(--paper)", maxWidth: 520,
        }}>
          {React.cloneElement(I.search, { size: 18 })}
          <span style={{ color: "var(--ink)", fontSize: 15 }}>fractional cfo roles in tunis</span>
          <span style={{ marginLeft: "auto", color: "var(--ink-mute)", cursor: "pointer" }}>{React.cloneElement(I.closed, { size: 16 })}</span>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40 }}>
        <div style={{ width: 74, height: 74, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", background: "color-mix(in oklab, var(--clay) 12%, var(--paper))", color: "var(--clay)", marginBottom: 18, border: "1px solid color-mix(in oklab, var(--clay) 24%, var(--line))" }}>
          {React.cloneElement(I.search, { size: 30 })}
        </div>
        <Eyebrow>No matches</Eyebrow>
        <h1 style={{ fontSize: 28, marginTop: 6, lineHeight: 1.05 }}>Nothing for that — yet</h1>
        <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.55, maxWidth: 400, marginTop: 10 }}>
          No rooms, people, or topics matched. Try a broader search, or let us ping you the moment something opens up.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 22, flexWrap: "wrap", justifyContent: "center" }}>
          <Btn kind="primary" iconRight={I.bell}>Alert me when it opens</Btn>
        </div>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <p className="mono" style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-mute)" }}>Try instead</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 460 }}>
            {["Finance roles", "Remote-first", "Startup CFOs", "MENA region", "Open to mentor"].map(s => (
              <Pill key={s}>{s}</Pill>
            ))}
          </div>
        </div>
      </div>
    </StateFrame>
  );
};

Object.assign(window, { WebLoading, WebEmptyInbox, WebEmptySchedule, WebOffline, WebNoResults });
