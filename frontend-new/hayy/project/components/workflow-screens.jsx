// workflow-screens.jsx — drilling screens behind buttons
// Booking, Referral detail, Connections list, Pre-room green room, Share sheet

// ──────────────────────────────────────────────────────────────────
// Booking flow — Calendly-feel, no pricing language.
// Step 1: pick the offer · Step 2: pick a slot · Step 3: confirm.
// ──────────────────────────────────────────────────────────────────
const BookingFlow = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const days = [
    { d: "MON", n: "5", slots: 0 },
    { d: "TUE", n: "6", slots: 2 },
    { d: "WED", n: "7", slots: 3, today: true },
    { d: "THU", n: "8", slots: 2 },
    { d: "FRI", n: "9", slots: 4 },
    { d: "SAT", n: "10", slots: 0 },
    { d: "SUN", n: "11", slots: 1 },
  ];
  const slots = ["7:00 pm", "7:30 pm", "8:30 pm"];

  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Profile" />}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {isMobile && <div style={{ padding: "18px 18px 0" }}><MobileTopbar /></div>}

        <div style={{
          padding: isMobile ? "16px 18px" : "32px 64px 24px",
          display: "flex", alignItems: "center", gap: 14,
          borderBottom: "1px solid var(--line-soft)",
        }}>
          <Btn kind="ghost" size="md" icon={I.arrow}>Back to profile</Btn>
          <span className="mono" style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em" }}>
            STEP 2 OF 3 · PICK A TIME
          </span>
        </div>

        <div style={{
          flex: 1, overflow: "hidden",
          padding: isMobile ? "18px" : "36px 64px",
          display: "grid", gap: isMobile ? 18 : 36,
          gridTemplateColumns: isMobile ? "1fr" : "320px 1fr",
        }}>

          {/* Left: who + what */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="hy-card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name="Amira Hassan" size={48} tone="dark" />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>Amira Hassan</p>
                  <p style={{ fontSize: 12, color: "var(--ink-mute)" }}>Senior PD · Wealthsimple</p>
                </div>
              </div>
              <div style={{ paddingTop: 14, borderTop: "1px solid var(--line-soft)" }}>
                <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>You picked</p>
                <h2 style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 500, marginTop: 6 }}>Coffee chat</h2>
                <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { i: I.cal, t: "30 minutes" },
                    { i: I.msg, t: "Hayy in-app audio" },
                    { i: I.lock, t: "She approves before booking" },
                  ].map(r => (
                    <li key={r.t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-soft)" }}>
                      <span style={{ color: "var(--ink-mute)" }}>{r.i}</span>{r.t}
                    </li>
                  ))}
                </ul>
              </div>
              <Btn kind="ghost" size="md" style={{ alignSelf: "flex-start" }}>Change offer</Btn>
            </div>
            <p style={{ fontSize: 11, color: "var(--ink-mute)", lineHeight: 1.5 }}>
              Times shown in your local timezone — Halifax (ADT). Amira's in Toronto (EDT).
            </p>
          </aside>

          {/* Right: calendar + slots */}
          <section style={{ display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <div>
                <p className="mono" style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em" }}>MAY 2026</p>
                <h1 style={{ fontFamily: "var(--display)", fontSize: 28, fontWeight: 500, marginTop: 4 }}>Pick a time that works</h1>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500, border: "1px solid var(--line)" }}>‹</span>
                <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500, border: "1px solid var(--line)" }}>›</span>
              </div>
            </div>

            <div style={{
              display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6,
            }}>
              {days.map((d, i) => (
                <button key={i} style={{
                  padding: "12px 6px", borderRadius: 12, border: "1px solid " + (d.today ? "var(--clay)" : "var(--line-soft)"),
                  background: d.today ? "var(--paper)" : "transparent",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  cursor: d.slots ? "pointer" : "not-allowed", opacity: d.slots ? 1 : 0.4,
                  font: "inherit",
                }}>
                  <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".08em" }}>{d.d}</span>
                  <span style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 500, color: d.today ? "var(--clay)" : "var(--ink)" }}>{d.n}</span>
                  <span style={{ width: 4, height: 4, borderRadius: 99, background: d.slots ? "var(--olive)" : "transparent" }} />
                </button>
              ))}
            </div>

            <div>
              <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>Wed, May 7 · 3 slots open</p>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                {slots.map((s, i) => (
                  <div key={s} style={{
                    padding: "14px 18px", borderRadius: 12,
                    background: i === 1 ? "var(--ink)" : "transparent",
                    color: i === 1 ? "var(--paper)" : "var(--ink)",
                    border: "1px solid " + (i === 1 ? "var(--ink)" : "var(--line-soft)"),
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{s}</span>
                    {i === 1 && <Btn kind="soft" size="md" style={{ background: "var(--paper)", color: "var(--ink)", borderColor: "transparent" }}>Continue</Btn>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              padding: 14, borderRadius: 12, background: "var(--cream)",
              fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5,
              display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <span style={{ color: "var(--olive)", flex: "none" }}>{I.lock}</span>
              <span>Amira approves bookings within 1 day, on average. You'll get a confirmation by both email and Hayy push — and a reminder 30 min before.</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};


// ──────────────────────────────────────────────────────────────────
// Referral detail — drilling into a single card from the pipeline
// ──────────────────────────────────────────────────────────────────
const ReferralDetail = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const timeline = [
    { d: "Apr 22 · 9:14 am", t: "You wrote the intro", sub: "To Maya at Notion · 4 paragraphs", who: "you" },
    { d: "Apr 22 · 11:02 am", t: "Maya replied", sub: "Asked for a portfolio link and a 1-line summary.", who: "them" },
    { d: "Apr 22 · 4:48 pm", t: "Diego sent his portfolio", sub: "diegorivas.design · resume.pdf attached.", who: "candidate" },
    { d: "Apr 24 · 10:30 am", t: "Maya forwarded to her hiring manager", sub: "\"This is exactly the level we're hiring for.\"", who: "them", warm: true },
    { d: "Apr 26", t: "Phone screen scheduled", sub: "Tue Apr 30 · 2:00 pm ET", who: "system" },
  ];

  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Referrals" />}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {isMobile && <div style={{ padding: "18px 18px 0" }}><MobileTopbar /></div>}

        <div style={{
          padding: isMobile ? "14px 18px" : "20px 56px",
          display: "flex", alignItems: "center", gap: 12,
          borderBottom: "1px solid var(--line-soft)", flexWrap: "wrap",
        }}>
          <Btn kind="ghost" size="md" icon={I.arrow}>Pipeline</Btn>
          <span style={{ color: "var(--ink-mute)", fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Diego Rivas → Maya Nguyen, Notion</span>
          <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <Pill style={{ background: "var(--olive)", color: "var(--paper)", borderColor: "transparent" }}>In conversation</Pill>
            <span className="mono" style={{ alignSelf: "center", fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em" }}>OPENED 5 DAYS AGO</span>
          </span>
        </div>

        <div style={{
          flex: 1, overflow: "hidden",
          padding: isMobile ? "20px 18px" : "32px 56px",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: isMobile ? 22 : 36,
        }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
            {/* Header */}
            <header style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar name="Diego Rivas" size={isMobile ? 56 : 72} tone="olive" />
              <div>
                <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>Candidate</p>
                <h1 style={{ fontFamily: "var(--display)", fontSize: isMobile ? 26 : 32, fontWeight: 500, lineHeight: 1.05, marginTop: 4 }}>Diego Rivas</h1>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>PM · Notion · Mexico City → Toronto</p>
              </div>
            </header>

            {/* The ask */}
            <div className="hy-card" style={{ padding: 20, background: "var(--cream)" }}>
              <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>The ask</p>
              <p style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 18, lineHeight: 1.5, marginTop: 10, color: "var(--ink-soft)" }}>
                "Maya — Diego's been a PM at Notion for 3 years and is looking to move to Toronto. He's specifically excited about Wealthsimple's design culture. I worked with him on Newcomer Q&A — he's exactly the kind of thoughtful operator you'd want…"
              </p>
              <Btn kind="ghost" size="md" iconRight={I.arrow} style={{ marginTop: 12 }}>Read full message</Btn>
            </div>

            {/* Timeline */}
            <section>
              <h2 style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 500 }}>What's happened</h2>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column" }}>
                {timeline.map((e, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: isMobile ? "1fr" : "150px 1fr",
                    gap: isMobile ? 4 : 18,
                    padding: "16px 0",
                    borderTop: i === 0 ? "1px solid var(--line-soft)" : "1px dashed var(--line-soft)",
                  }}>
                    <p className="mono" style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em", paddingTop: 2 }}>{e.d.toUpperCase()}</p>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: 99,
                          background: e.warm ? "var(--clay)" : e.who === "you" ? "var(--ink)" : "var(--olive)",
                        }} />
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{e.t}</p>
                        {e.warm && <Pill style={{ background: "var(--clay)", color: "var(--paper)", borderColor: "transparent" }}>warm signal</Pill>}
                      </div>
                      <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4, lineHeight: 1.5 }}>{e.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Next step */}
            <div style={{
              padding: 18, borderRadius: 14, border: "1px solid var(--clay)",
              display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
              background: "var(--paper)",
            }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>Next step</p>
                <p style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>Check in with Diego after the phone screen on Apr 30.</p>
              </div>
              <Btn kind="soft" size="md">Snooze</Btn>
              <Btn kind="primary" size="md" icon={I.msg}>Message Diego</Btn>
            </div>
          </div>

          {/* Side */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            <div className="hy-card" style={{ padding: 18 }}>
              <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>Recipient</p>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name="Maya Nguyen" size={42} tone="clay" />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>Maya Nguyen</p>
                  <p style={{ fontSize: 12, color: "var(--ink-mute)" }}>Design Lead · Notion</p>
                </div>
              </div>
              <ul style={{ marginTop: 14, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                <li style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--ink-mute)" }}>Replies in</span>
                  <span style={{ fontWeight: 500 }}>~ 2 days</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--ink-mute)" }}>Past intros</span>
                  <span style={{ fontWeight: 500 }}>4 · 3 hires</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--ink-mute)" }}>Hayy since</span>
                  <span style={{ fontWeight: 500 }}>2022</span>
                </li>
              </ul>
            </div>
            <div className="hy-card" style={{ padding: 18 }}>
              <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>Visibility</p>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.5 }}>
                Diego sees that you opened a referral and Maya replied — but not the body of Maya's messages until you forward them.
              </p>
              <Btn kind="ghost" size="md" style={{ marginTop: 12 }}>Manage what Diego sees</Btn>
            </div>
            <div className="hy-card" style={{ padding: 18 }}>
              <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>Danger</p>
              <Btn kind="ghost" size="md" style={{ marginTop: 12 }}>Withdraw referral</Btn>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};


// ──────────────────────────────────────────────────────────────────
// Connections list — who-knows-who, behind "4 mutual" pills
// ──────────────────────────────────────────────────────────────────
const Connections = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const lanes = [
    { l: "Mutual with Amira", n: 4, people: [
      { n: "Maya Nguyen", r: "Design Lead · Notion", how: "Newcomer Q&A · Apr", t: "clay" },
      { n: "Rashid Khoury", r: "Eng Manager · Stripe", how: "Refers across MENA", t: "olive" },
      { n: "Layla Park", r: "Product · Figma", how: "Quoted Amira's recap", t: "sand" },
      { n: "Sara Mahmoud", r: "Eng · Shopify", how: "Amira referred her in '24", t: "dark" },
    ] },
    { l: "Met in rooms", n: 23, people: [
      { n: "Diego Rivas", r: "PM · Notion", how: "Newcomer designers Q&A", t: "olive" },
      { n: "Han Liu", r: "Brand · Linear", how: "Late-night portfolio teardown", t: "clay" },
      { n: "Yusra Ali", r: "Founder · stealth", how: "Breaking into Amazon", t: "sand" },
    ] },
    { l: "Followed by you", n: 38, people: [
      { n: "Karim Reda", r: "Director · Klarna", how: "Hosts every other Friday", t: "dark" },
      { n: "Naomi Park", r: "Senior IC · Vercel", how: "Replied 3 times", t: "olive" },
    ] },
  ];

  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="People" />}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {isMobile && <div style={{ padding: "18px 18px 0" }}><MobileTopbar /></div>}

        <header style={{
          padding: isMobile ? "16px 18px 0" : "32px 56px 0",
          display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>People</p>
            <h1 style={{ fontFamily: "var(--display)", fontSize: isMobile ? 28 : 36, fontWeight: 500, marginTop: 4 }}>Your circle, by how you met</h1>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["All · 65", "Mutual · 4", "Rooms · 23", "Following · 38"].map((t, i) => (
              <span key={t} style={{
                padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500,
                background: i === 0 ? "var(--ink)" : "transparent", color: i === 0 ? "var(--paper)" : "var(--ink-mute)",
                border: i === 0 ? "1px solid var(--ink)" : "1px solid var(--line)",
                whiteSpace: "nowrap",
              }}>{t}</span>
            ))}
          </div>
        </header>

        <div style={{
          flex: 1, overflow: "hidden",
          padding: isMobile ? "16px 18px 22px" : "24px 56px 36px",
          display: "flex", flexDirection: "column", gap: 28,
        }}>
          {lanes.map(lane => (
            <section key={lane.l}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ fontFamily: "var(--display)", fontSize: 20, fontWeight: 500 }}>{lane.l}</h2>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em" }}>{lane.n} PEOPLE · SEE ALL →</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 10 }}>
                {lane.people.map(p => (
                  <div key={p.n} className="hy-card" style={{
                    padding: 14, display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <Avatar name={p.n} size={44} tone={p.t} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{p.n}</p>
                      <p style={{ fontSize: 12, color: "var(--ink-mute)" }}>{p.r}</p>
                      <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".06em", marginTop: 4 }}>{p.how.toUpperCase()}</p>
                    </div>
                    <Btn kind="ghost" size="md">View</Btn>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};


// ──────────────────────────────────────────────────────────────────
// Pre-room green room — what happens when you tap "Join" on a live room
// ──────────────────────────────────────────────────────────────────
const GreenRoom = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";

  const inside = [
    { n: "Amira H", r: "host", t: "dark" },
    { n: "Diego R", r: "co-host", t: "olive" },
    { n: "Layla P", r: "speaker", t: "sand" },
    { n: "Maya N", r: "listener", t: "clay" },
    { n: "Han L", r: "listener", t: "olive" },
    { n: "Karim R", r: "listener", t: "dark" },
    { n: "Yusra A", r: "listener", t: "sand" },
  ];

  return (
    <div className="hy" style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      overflow: "hidden",
      background: "linear-gradient(180deg, var(--cream), var(--bg))",
      alignItems: "center", justifyContent: "center",
      padding: isMobile ? 22 : 56,
    }}>
      <div className="hy-card" style={{
        width: "100%", maxWidth: isMobile ? "100%" : 560,
        padding: isMobile ? 22 : 36,
        display: "flex", flexDirection: "column", gap: 22,
        background: "var(--paper)",
        boxShadow: "var(--shadow-warm)",
      }}>
        {/* live tag */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 10px", borderRadius: 999,
            background: "var(--clay)", color: "var(--paper)",
            fontSize: 11, fontWeight: 600, letterSpacing: ".08em",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--paper)", animation: "hyPulse 1.6s ease-in-out infinite" }} />
            LIVE · 23 MIN IN
          </span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em", marginLeft: "auto" }}>7 INSIDE</span>
        </div>

        {/* what's happening */}
        <div>
          <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>You're about to join</p>
          <h1 style={{ fontFamily: "var(--display)", fontSize: isMobile ? 26 : 32, fontWeight: 500, lineHeight: 1.1, marginTop: 6 }}>
            Newcomer designers <span className="display-italic">Q&A</span>
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.55 }}>
            Hosted by <b style={{ color: "var(--ink)" }}>Amira Hassan</b> · with <b style={{ color: "var(--ink)" }}>Diego Rivas</b>.
            They're talking about portfolio teardowns. You can listen in — or raise your hand to speak.
          </p>
        </div>

        {/* who's inside */}
        <div style={{ paddingTop: 18, borderTop: "1px solid var(--line-soft)" }}>
          <p className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>People inside</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            {inside.map(p => (
              <div key={p.n} title={`${p.n} · ${p.r}`} style={{
                position: "relative",
                border: p.r === "host" ? "2px solid var(--clay)" : "2px solid transparent",
                borderRadius: 999, padding: 1,
              }}>
                <Avatar name={p.n} size={isMobile ? 32 : 36} tone={p.t} />
                {(p.r === "host" || p.r === "co-host" || p.r === "speaker") && (
                  <span style={{
                    position: "absolute", bottom: -2, right: -2,
                    width: 12, height: 12, borderRadius: 99,
                    background: "var(--paper)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: 99,
                      background: p.r === "host" ? "var(--clay)" : "var(--olive)",
                    }} />
                  </span>
                )}
              </div>
            ))}
            <span style={{ fontSize: 12, color: "var(--ink-mute)", marginLeft: 6 }}>+ Maya, Karim know you</span>
          </div>
        </div>

        {/* mic + role */}
        <div style={{
          padding: 14, borderRadius: 14, background: "var(--cream)",
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Join as</span>
            <div style={{ display: "flex", gap: 4, padding: 3, borderRadius: 999, background: "var(--paper)", border: "1px solid var(--line-soft)" }}>
              {["Listener", "Hand raised"].map((r, i) => (
                <span key={r} style={{
                  padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500,
                  background: i === 0 ? "var(--ink)" : "transparent",
                  color: i === 0 ? "var(--paper)" : "var(--ink-mute)",
                }}>{r}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Microphone</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--olive)", letterSpacing: ".06em" }}>READY · MUTED</span>
              <Btn kind="ghost" size="md">Test</Btn>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 8 }}>
          <Btn kind="ghost" size="lg" style={{ flex: 1, justifyContent: "center" }}>Cancel</Btn>
          <Btn kind="primary" size="lg" iconRight={I.arrow} style={{ flex: 2, justifyContent: "center" }}>Slip in quietly</Btn>
        </div>

        {/* footnote */}
        <p style={{ fontSize: 11, color: "var(--ink-mute)", lineHeight: 1.5 }}>
          You'll appear as a listener with your name. The host will be notified when you raise your hand.
        </p>
      </div>

      <style>{`@keyframes hyPulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }`}</style>
    </div>
  );
};


// ──────────────────────────────────────────────────────────────────
// Share sheet — what happens when you tap Share on a profile
// ──────────────────────────────────────────────────────────────────
const ShareSheet = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const channels = [
    { l: "Copy link", d: "hayy.app/amira", i: I.lock },
    { l: "Send via Hayy DM", d: "Pick a friend", i: I.msg },
    { l: "Email", d: "Pre-filled subject + intro", i: I.cal },
    { l: "Twitter / X", d: "With your one-line endorsement", i: I.shake },
  ];

  return (
    <div className="hy" style={{
      width: "100%", height: "100%",
      background: "rgba(15, 15, 20, .35)",
      display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      <div className="hy-card" style={{
        width: "100%", maxWidth: isMobile ? "100%" : 460,
        margin: isMobile ? 0 : 0,
        borderRadius: isMobile ? "18px 18px 0 0" : "var(--radius-xl)",
        background: "var(--paper)",
        padding: isMobile ? 22 : 28,
        display: "flex", flexDirection: "column", gap: 18,
        boxShadow: "0 -8px 40px rgba(0,0,0,.18)",
      }}>
        {isMobile && (
          <div style={{ alignSelf: "center", width: 38, height: 4, borderRadius: 99, background: "var(--line)", marginTop: -8, marginBottom: 4 }} />
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name="Amira Hassan" size={48} tone="dark" />
          <div>
            <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>Share profile</p>
            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>Amira Hassan</p>
            <p style={{ fontSize: 12, color: "var(--ink-mute)" }}>Senior PD · Wealthsimple · Toronto</p>
          </div>
        </div>

        <div style={{
          padding: "10px 14px", borderRadius: 12,
          background: "var(--cream)", border: "1px solid var(--line-soft)",
          fontSize: 13, color: "var(--ink-soft)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span className="mono" style={{ letterSpacing: ".04em" }}>hayy.app/amira</span>
          <Btn kind="ghost" size="md">Copy</Btn>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {channels.map(c => (
            <button key={c.l} style={{
              padding: "12px 14px", borderRadius: 12,
              background: "transparent", border: "1px solid transparent",
              display: "flex", alignItems: "center", gap: 14,
              cursor: "pointer", font: "inherit", textAlign: "left", color: "var(--ink)",
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: 10,
                background: "var(--cream)", border: "1px solid var(--line-soft)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--ink-soft)",
              }}>{c.i}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{c.l}</p>
                <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>{c.d}</p>
              </div>
              <span style={{ color: "var(--ink-mute)" }}>›</span>
            </button>
          ))}
        </div>

        <div style={{
          padding: 12, borderRadius: 12,
          background: "var(--paper)", border: "1px dashed var(--line)",
          fontSize: 12, color: "var(--ink-mute)", lineHeight: 1.5,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ color: "var(--olive)", flex: "none" }}>{I.lock}</span>
          <span>Hayy never lets people share parts of someone's profile they've marked private.</span>
        </div>
      </div>
    </div>
  );
};


Object.assign(window, { BookingFlow, ReferralDetail, Connections, GreenRoom, ShareSheet });
