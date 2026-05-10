// App Dashboard — two directions, desktop + mobile.
// A: "Today, in one screen" — a focused, brief-style dashboard with a single
//    primary action and a vertical timeline of warm activity.
// B: "Atlas" — a richer, denser dashboard with a left rail, a hero room and
//    an editorial card grid.

const Sidebar = ({ active = "Home" }) => (
  <aside style={{
    width: 220, background: "var(--cream)", borderRight: "1px solid var(--line)",
    padding: "22px 16px", display: "flex", flexDirection: "column", gap: 22,
    height: "100%",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 6px" }}>
      <span style={{
        width: 28, height: 28, borderRadius: 10, background: "var(--clay)",
        color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--display)", fontStyle: "italic", fontWeight: 600, fontSize: 17,
      }}>h</span>
      <span style={{ fontFamily: "var(--display)", fontSize: 19 }}>Hayy</span>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <p className="mono" style={{ fontSize: 10, letterSpacing: ".1em", color: "var(--ink-mute)", padding: "0 10px", marginBottom: 6, textTransform: "uppercase" }}>Community</p>
      {[
        { l: "Home", icon: I.home },
        { l: "Rooms", icon: I.mic },
        { l: "Referrals", icon: I.shake, badge: 4 },
        { l: "Messages", icon: I.msg, badge: 2 },
        { l: "Notifications", icon: I.bell, badge: 3 },
        { l: "Profile", icon: I.users },
      ].map(it => (
        <div key={it.l} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
          borderRadius: 12, fontSize: 13, fontWeight: 500,
          background: active === it.l ? "var(--clay)" : "transparent",
          color: active === it.l ? "var(--paper)" : "var(--ink-soft)",
        }}>
          {it.icon}<span style={{ flex: 1 }}>{it.l}</span>
          {it.badge && <span className="mono" style={{
            fontSize: 10, padding: "2px 6px", borderRadius: 999,
            background: active === it.l ? "rgba(255,255,255,.2)" : "var(--clay)",
            color: active === it.l ? "white" : "var(--paper)",
          }}>{it.badge}</span>}
        </div>
      ))}
    </div>

    <div style={{ marginTop: "auto", padding: 14, borderRadius: 16, background: "var(--paper)", border: "1px solid var(--line)" }}>
      <p className="mono" style={{ fontSize: 10, letterSpacing: ".1em", color: "var(--clay)", textTransform: "uppercase" }}>Founding member</p>
      <p style={{ fontFamily: "var(--display)", fontSize: 15, marginTop: 4 }}>You're shaping Hayy.</p>
    </div>
  </aside>
);

// ──────────────────────────────────────────────────────────────────
// DASHBOARD A — "Today" — focused, brief-style
// ──────────────────────────────────────────────────────────────────
const DashboardA = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <div className="hy" style={{
      width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)",
    }}>
      {!isMobile && <Sidebar active="Home" />}

      <main style={{
        flex: 1, padding: isMobile ? 18 : "32px 44px", overflow: "hidden",
        display: "flex", flexDirection: "column", gap: isMobile ? 18 : 28,
      }}>
        {isMobile && <MobileTopbar />}

        {/* Greeting + brief */}
        <div>
          <p className="mono" style={{ fontSize: 11, letterSpacing: ".12em", color: "var(--clay)", textTransform: "uppercase" }}>
            Tuesday · April 29
          </p>
          <h1 style={{ fontSize: isMobile ? 30 : 44, marginTop: 6 }}>
            Good morning, <span className="display-italic">Amira.</span>
          </h1>
          <p style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: isMobile ? 14 : 16 }}>
            One room is calling your name today.
          </p>
        </div>

        {/* Today's room — hero brief */}
        <div className="hy-card" style={{
          padding: isMobile ? 18 : 26, borderRadius: "var(--radius-xl)",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 240px",
          gap: isMobile ? 16 : 24, alignItems: "center",
          background: "linear-gradient(135deg, var(--paper), var(--cream))",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <LiveTag>Starting in 42 min</LiveTag>
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)" }}>ROOM 04</span>
            </div>
            <h2 style={{ fontSize: isMobile ? 24 : 32, marginTop: 12, lineHeight: 1.05 }}>
              Breaking into Amazon as<br />a newcomer to Canada
            </h2>
            <p style={{ marginTop: 10, color: "var(--ink-soft)", fontSize: 14 }}>
              Hosted by Maya N. · 3 referral hosts on stage · Match: 92%
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <Btn kind="primary" iconRight={I.arrow}>Join the room</Btn>
              <Btn kind="ghost">Remind me</Btn>
            </div>
          </div>

          <div style={{
            display: "flex", flexDirection: isMobile ? "row" : "column", gap: 10,
            justifyContent: "center",
          }}>
            {[
              { n: "Maya N.", r: "Sr PM, AWS", t: "clay" },
              { n: "Rashid K.", r: "Eng Mgr", t: "olive" },
              { n: "Jenna S.", r: "Recruiter", t: "sand" },
            ].map(p => (
              <div key={p.n} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 14, background: "var(--paper)", border: "1px solid var(--line-soft)",
                flex: isMobile ? 1 : "none", minWidth: 0,
              }}>
                <Avatar name={p.n} size={32} tone={p.t} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 500 }}>{p.n}</p>
                  <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>{p.r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two columns: Today's flow + side panel */}
        <div style={{
          display: "grid", gap: isMobile ? 18 : 24,
          gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr",
          flex: 1, minHeight: 0,
        }}>
          {/* Vertical flow */}
          <div className="hy-card" style={{ padding: isMobile ? 18 : 24, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3 style={{ fontSize: 20 }}>Your warm activity</h3>
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)" }}>LAST 7 DAYS</span>
            </div>

            <div style={{ marginTop: 16, position: "relative", paddingLeft: 22 }}>
              <span style={{
                position: "absolute", top: 6, bottom: 6, left: 6, width: 1,
                background: "var(--line)",
              }} />
              {[
                { dot: "var(--clay)", t: "Maya N. accepted your coffee request",
                  s: "Replied in 4h · says yes to chats most weeks", time: "12m ago" },
                { dot: "var(--olive)", t: "You spoke in Product Builders Room",
                  s: "Got 3 follow-ups · 2 became messages", time: "2h ago" },
                { dot: "var(--ink)", t: "Rashid K. wrote: 'Send me your resume'",
                  s: "Eng Mgr · Amazon · responding now", time: "Yesterday" },
                { dot: "var(--clay)", t: "New room you'd like is scheduled",
                  s: "RBC × New Grads · Friday 6pm", time: "2d" },
              ].map((e, i) => (
                <div key={i} style={{ position: "relative", paddingBottom: 16 }}>
                  <span style={{
                    position: "absolute", left: -22, top: 4, width: 13, height: 13, borderRadius: 999,
                    background: e.dot, border: "2px solid var(--paper)",
                    boxShadow: `0 0 0 1px ${e.dot}`,
                  }} />
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{e.t}</p>
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", flex: "none" }}>{e.time}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>{e.s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Side panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 20 }}>
            {/* Profile completion donut */}
            <div className="hy-card" style={{ padding: 22, background: "var(--cream)" }}>
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <DonutPct pct={62} />
                <div>
                  <p className="mono" style={{ fontSize: 10, letterSpacing: ".1em", color: "var(--clay)", textTransform: "uppercase" }}>Profile</p>
                  <p style={{ fontFamily: "var(--display)", fontSize: 24, marginTop: 2 }}>62% warm</p>
                  <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>
                    Add a 30s video intro — hosts say yes 3× more.
                  </p>
                </div>
              </div>
              <Btn kind="soft" size="md" style={{ marginTop: 14, width: "100%", justifyContent: "center" }}>
                Record video intro
              </Btn>
            </div>

            {/* Streak / vibe */}
            <div className="hy-card" style={{ padding: 22, background: "var(--clay)", color: "var(--paper)", borderColor: "transparent" }}>
              <p className="mono" style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", opacity: .85 }}>Founding</p>
              <p style={{ fontFamily: "var(--display)", fontSize: 20, marginTop: 6, lineHeight: 1.2 }}>
                You're in the top 8% of helpful members this month.
              </p>
              <div style={{
                marginTop: 14, display: "flex", gap: 6, alignItems: "center",
              }}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} style={{
                    flex: 1, height: 22, borderRadius: 5,
                    background: i < 5 ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.18)",
                  }} />
                ))}
                <span className="mono" style={{ fontSize: 11, marginLeft: 4 }}>5/7</span>
              </div>
            </div>
          </div>
        </div>

        {isMobile && <MobileTabbar />}
      </main>
    </div>
  );
};

const DonutPct = ({ pct = 60, size = 72 }) => {
  const stroke = 8, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flex: "none" }}>
      <circle cx={size/2} cy={size/2} r={r} stroke="var(--line)" strokeWidth={stroke} fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke="var(--clay)" strokeWidth={stroke} fill="none"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct/100)} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x="50%" y="54%" textAnchor="middle" fontFamily="var(--display)" fontSize="16" fill="var(--ink)">
        {pct}
      </text>
    </svg>
  );
};

const MobileTopbar = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{
        width: 26, height: 26, borderRadius: 8, background: "var(--clay)", color: "var(--paper)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--display)", fontStyle: "italic", fontWeight: 600, fontSize: 16,
      }}>h</span>
      <span style={{ fontFamily: "var(--display)", fontSize: 18 }}>Hayy</span>
    </div>
    <div style={{ display: "flex", gap: 10 }}>
      <span style={{ width: 36, height: 36, borderRadius: 12, background: "var(--paper)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-soft)" }}>{I.search}</span>
      <span style={{ position: "relative", width: 36, height: 36, borderRadius: 12, background: "var(--paper)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-soft)" }}>
        {I.bell}
        <span style={{ position: "absolute", top: 8, right: 8, width: 6, height: 6, borderRadius: 99, background: "var(--clay)" }} />
      </span>
    </div>
  </div>
);

const MobileTabbar = () => (
  <div style={{
    marginLeft: -18, marginRight: -18, marginTop: 4, padding: "10px 18px",
    background: "var(--paper)", borderTop: "1px solid var(--line)",
    display: "flex", justifyContent: "space-around",
  }}>
    {[
      { l: "Home", i: I.home, on: true },
      { l: "Rooms", i: I.mic },
      { l: "Refer", i: I.shake, b: 4 },
      { l: "Inbox", i: I.msg, b: 2 },
      { l: "You", i: I.users },
    ].map(t => (
      <div key={t.l} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: t.on ? "var(--clay)" : "var(--ink-mute)" }}>
        {t.i}
        <span style={{ fontSize: 10, fontWeight: 500 }}>{t.l}</span>
        {t.b && <span style={{ position: "absolute", top: -2, right: 8, width: 14, height: 14, borderRadius: 99, background: "var(--clay)", color: "var(--paper)", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)" }}>{t.b}</span>}
      </div>
    ))}
  </div>
);

// ──────────────────────────────────────────────────────────────────
// DASHBOARD B — "Atlas" — editorial dense
// ──────────────────────────────────────────────────────────────────
const DashboardB = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Home" />}
      <main style={{ flex: 1, padding: isMobile ? 18 : "32px 40px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 18 }}>
        {isMobile && <MobileTopbar />}

        {/* Header strip with stats inline */}
        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.6fr repeat(3, 1fr)",
          gap: 14, alignItems: "stretch",
        }}>
          <div>
            <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".1em", textTransform: "uppercase" }}>Issue · Apr 29</p>
            <h1 style={{ fontSize: isMobile ? 28 : 36, marginTop: 4 }}>
              Welcome back, <span className="display-italic">Amira.</span>
            </h1>
          </div>
          {[
            { n: 6, l: "Referrals" },
            { n: 3, l: "Accepted" },
            { n: "92%", l: "Profile match" },
          ].map(s => (
            <div key={s.l} className="hy-card" style={{ padding: 14, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontFamily: "var(--display)", fontSize: 28, lineHeight: 1 }}>{s.n}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Hero room — full bleed */}
        <div className="hy-card" style={{
          padding: 0, overflow: "hidden",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr",
          minHeight: isMobile ? 220 : 260,
        }}>
          <div style={{ padding: isMobile ? 18 : 28, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16 }}>
            <div>
              <LiveTag>Starting · 42 min</LiveTag>
              <h2 style={{ fontSize: isMobile ? 26 : 36, marginTop: 12, lineHeight: 1.05 }}>
                Breaking into Amazon as a newcomer
              </h2>
              <p style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: 14 }}>
                Hosted by Maya N. · 3 referral hosts on stage
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn kind="primary" iconRight={I.arrow}>Join</Btn>
              <Btn kind="ghost">Remind me</Btn>
            </div>
          </div>
          <div style={{
            background: "linear-gradient(135deg, var(--clay) 0%, var(--clay-2) 100%)",
            color: "var(--paper)", padding: 24, position: "relative", overflow: "hidden",
            display: "flex", alignItems: "flex-end",
          }}>
            <div style={{ position: "absolute", inset: 0,
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,.2), transparent 50%)" }} />
            <div style={{ position: "relative", display: "flex", gap: -10 }}>
              {["MN", "RK", "JS", "OA"].map((n, i) => (
                <span key={i} style={{ marginLeft: i === 0 ? 0 : -14 }}>
                  <Avatar name={n} size={56} tone={["sand", "olive", "dark", "clay"][i]} />
                </span>
              ))}
            </div>
            <div style={{ position: "absolute", top: 22, right: 22, fontFamily: "var(--display)", fontSize: 60, opacity: .25, lineHeight: 1 }}>04</div>
          </div>
        </div>

        {/* Card grid */}
        <div style={{
          display: "grid", gap: 14, flex: 1, minHeight: 0,
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        }}>
          {/* Pending replies */}
          <div className="hy-card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3 style={{ fontSize: 17 }}>Stay warm</h3>
              <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".1em" }}>3 PENDING</span>
            </div>
            {[
              { n: "Rashid K.", r: "Eng Mgr · Amazon", s: "waiting 2d", t: "olive" },
              { n: "Layla P.", r: "Design · Figma", s: "waiting 1d", t: "sand" },
              { n: "Diego R.", r: "PM · Notion", s: "waiting 4h", t: "dark" },
            ].map(p => (
              <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={p.n} size={34} tone={p.t} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{p.n}</p>
                  <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>{p.r}</p>
                </div>
                <span className="mono" style={{ fontSize: 10, color: "var(--clay)" }}>{p.s}</span>
              </div>
            ))}
          </div>

          {/* Recommended hosts */}
          <div className="hy-card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            <h3 style={{ fontSize: 17 }}>Hosts open this week</h3>
            {[
              { n: "Maya Nasrallah", r: "Sr PM · AWS", c: "3 chats open", t: "clay" },
              { n: "Priya Shah", r: "Recruiter · Stripe", c: "2 chats open", t: "olive" },
              { n: "Ben Tanaka", r: "Founder", c: "1 chat open", t: "sand" },
            ].map(p => (
              <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: "1px solid var(--line-soft)" }}>
                <Avatar name={p.n} size={36} tone={p.t} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{p.n}</p>
                  <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>{p.r}</p>
                </div>
                <span style={{ fontSize: 11, color: "var(--olive)", whiteSpace: "nowrap" }}>● {p.c}</span>
              </div>
            ))}
          </div>

          {/* Newsroom card — story */}
          <div className="hy-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--ink)", color: "var(--paper)", borderColor: "transparent" }}>
            <div style={{ padding: 18, flex: 1 }}>
              <p className="mono" style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", opacity: .7 }}>Story · 4 min read</p>
              <h3 style={{ fontFamily: "var(--display)", fontSize: 22, marginTop: 8, lineHeight: 1.1 }}>
                "I joined Shopify two weeks after my first Hayy room."
              </h3>
              <p style={{ fontSize: 12, opacity: .7, marginTop: 10 }}>— Sara M. · joined Mar '26</p>
            </div>
            <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 11, opacity: .75 }}>HAYY DIARIES №07</span>
              <span style={{ opacity: .7 }}>{I.arrow}</span>
            </div>
          </div>
        </div>

        {isMobile && <MobileTabbar />}
      </main>
    </div>
  );
};

Object.assign(window, { DashboardA, DashboardB });
