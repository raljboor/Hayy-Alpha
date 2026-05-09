// Rooms list (timeline), Referrals (kept), Profile (story), Onboarding (kept).

// ──────────────────────────────────────────────────────────────────
// ROOMS LIST — agenda timeline. A vertical day-by-day list, not a card grid.
// ──────────────────────────────────────────────────────────────────
const RoomsList = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const days = [
    { label: "Tonight", date: "Tue · Apr 29", items: [
      { time: "Now", live: true, t: "Breaking into Amazon as a newcomer", host: "Maya Nasrallah", role: "Sr PM · AWS", tone: "clay", attendees: 28, tag: "Tech", min: "14 min in" },
      { time: "8:00pm", live: false, t: "Product, Data & Software Career Room", host: "Rashid Khoury", role: "Eng Manager · Amazon", tone: "olive", attendees: 41, tag: "Product" },
      { time: "9:30pm", live: false, t: "Late-night portfolio teardown", host: "Layla Park", role: "Designer · Figma", tone: "sand", attendees: 12, tag: "Design" },
    ]},
    { label: "Tomorrow", date: "Wed · Apr 30", items: [
      { time: "12:00pm", live: false, t: "Stripe recruiter AMA", host: "Priya Shah", role: "Recruiter · Stripe", tone: "olive", attendees: 56, tag: "Tech" },
      { time: "6:30pm", live: false, t: "Operations roles — what hiring managers want", host: "Ben Tanaka", role: "Founder · Stealth", tone: "dark", attendees: 22, tag: "Operations" },
    ]},
    { label: "This weekend", date: "Sat · May 3", items: [
      { time: "11:00am", live: false, t: "Career Access for International Pros", host: "Layla Park", role: "Designer · Figma", tone: "sand", attendees: 84, tag: "Newcomers" },
      { time: "5:00pm", live: false, t: "Designing your way into Figma", host: "Layla Park", role: "Designer · Figma", tone: "clay", attendees: 33, tag: "Design" },
    ]},
  ];
  const filters = ["All", "Tech", "Operations", "Finance", "Newcomers", "Product", "Design", "MENA"];

  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Rooms" />}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* Sticky header strip */}
        <div style={{
          padding: isMobile ? "18px 18px 14px" : "28px 48px 20px",
          borderBottom: "1px solid var(--line-soft)",
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          {isMobile && <MobileTopbar />}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase" }}>The agenda</p>
              <h1 style={{ fontSize: isMobile ? 30 : 42, marginTop: 6, lineHeight: 1.05 }}>
                What's <span className="display-italic">happening</span> next.
              </h1>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn kind="ghost" size="md" icon={I.search}>Search</Btn>
              <Btn kind="soft" size="md" icon={I.plus}>Propose a room</Btn>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {filters.map((f, i) => (
              <button key={f} style={{
                padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500,
                background: i === 0 ? "var(--ink)" : "transparent",
                color: i === 0 ? "var(--paper)" : "var(--ink-soft)",
                border: "1px solid " + (i === 0 ? "var(--ink)" : "var(--line)"),
                cursor: "pointer",
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ flex: 1, overflow: "hidden", padding: isMobile ? "16px 18px" : "20px 48px 28px" }}>
          {days.map(day => (
            <section key={day.label} style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "180px 1fr",
              gap: isMobile ? 12 : 28,
              paddingTop: 18, paddingBottom: 4,
              borderTop: "1px solid var(--line-soft)",
              marginTop: 6,
            }}>
              <div style={{ position: isMobile ? "static" : "sticky", top: 0 }}>
                <h2 style={{ fontSize: isMobile ? 22 : 28, lineHeight: 1.1 }}>{day.label}</h2>
                <p className="mono" style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 4, letterSpacing: ".06em", textTransform: "uppercase" }}>{day.date}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {day.items.map((it, i) => (
                  <article key={it.t} style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "70px 1fr" : "92px 1fr auto",
                    gap: isMobile ? 12 : 20,
                    alignItems: "center",
                    padding: isMobile ? "14px 0" : "18px 0",
                    borderTop: i === 0 ? "0" : "1px dashed var(--line-soft)",
                  }}>
                    <div style={{ textAlign: "left" }}>
                      <p className="mono" style={{
                        fontSize: 13, color: it.live ? "var(--clay)" : "var(--ink)",
                        fontWeight: 600, letterSpacing: ".02em",
                      }}>{it.time}</p>
                      <p className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 3, letterSpacing: ".08em", textTransform: "uppercase" }}>
                        {it.tag}
                      </p>
                    </div>

                    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        {it.live && <LiveTag>Live · {it.min}</LiveTag>}
                        <h3 style={{
                          fontFamily: "var(--display)", fontSize: isMobile ? 18 : 22,
                          fontWeight: 500, lineHeight: 1.15,
                        }}>{it.t}</h3>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink-soft)", fontSize: 12 }}>
                        <Avatar name={it.host} size={22} tone={it.tone} />
                        <span>{it.host} · <span style={{ color: "var(--ink-mute)" }}>{it.role}</span></span>
                        <span style={{ color: "var(--ink-mute)" }}>·</span>
                        <span style={{ color: "var(--ink-mute)" }}>{it.attendees} going</span>
                      </div>
                    </div>

                    {!isMobile && (
                      <Btn kind={it.live ? "primary" : "soft"} size="md" iconRight={it.live ? I.arrow : undefined}>
                        {it.live ? "Join now" : "RSVP"}
                      </Btn>
                    )}
                    {isMobile && (
                      <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: -4 }}>
                        <Btn kind={it.live ? "primary" : "soft"} size="md">
                          {it.live ? "Join now" : "RSVP"}
                        </Btn>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {isMobile && <div style={{ padding: "0 18px 12px" }}><MobileTabbar /></div>}
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// REFERRALS — pipeline with status lanes (unchanged direction)
// ──────────────────────────────────────────────────────────────────
const Referrals = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const lanes = [
    { title: "Pending", tone: "var(--ink-mute)", count: 3, items: [
      { who: "Rashid Khoury", role: "Eng Manager · Amazon", waiting: "2d", t: "olive" },
      { who: "Layla Park", role: "Designer · Figma", waiting: "1d", t: "sand" },
      { who: "Diego Rivas", role: "PM · Notion", waiting: "4h", t: "dark" },
    ]},
    { title: "In conversation", tone: "var(--clay)", count: 2, items: [
      { who: "Maya Nasrallah", role: "Sr PM · AWS", note: "Coffee chat Thu 4pm", t: "clay" },
      { who: "Priya Shah", role: "Recruiter · Stripe", note: "Sent resume yesterday", t: "olive" },
    ]},
    { title: "Referred", tone: "var(--olive)", count: 2, items: [
      { who: "Sara Mahmoud", role: "Eng · Shopify", note: "Submitted Apr 22", t: "sand" },
      { who: "Ben Tanaka", role: "Founder · Stealth", note: "Intro made Apr 19", t: "dark" },
    ]},
  ];
  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Referrals" />}
      <main style={{ flex: 1, padding: isMobile ? 18 : "32px 44px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 18 }}>
        {isMobile && <MobileTopbar />}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase" }}>Pipeline</p>
            <h1 style={{ fontSize: isMobile ? 30 : 40, marginTop: 6 }}>
              Your <span className="display-italic">warm</span> conversations.
            </h1>
            <p style={{ marginTop: 6, color: "var(--ink-soft)", fontSize: 14 }}>7 active · 2 awaiting your reply</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn kind="soft" size="md">Outgoing</Btn>
            <Btn kind="ghost" size="md">Incoming</Btn>
          </div>
        </div>

        <div style={{
          display: "grid", gap: 14, flex: 1, minHeight: 0,
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        }}>
          {lanes.map(lane => (
            <div key={lane.title} className="hy-card" style={{
              padding: 16, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden",
              borderTop: `3px solid ${lane.tone}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 500 }}>{lane.title}</h3>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)" }}>{lane.count}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
                {lane.items.map(it => (
                  <div key={it.who} style={{
                    padding: 12, borderRadius: 14, background: "var(--cream)",
                    border: "1px solid var(--line-soft)",
                    display: "flex", flexDirection: "column", gap: 8,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={it.who} size={32} tone={it.t} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{it.who}</p>
                        <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>{it.role}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
                      <span className="mono" style={{ color: "var(--ink-soft)" }}>
                        {it.waiting ? `Waiting ${it.waiting}` : it.note}
                      </span>
                      <span style={{ color: "var(--clay)", fontWeight: 500, cursor: "pointer" }}>Open →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {isMobile && <MobileTabbar />}
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// PROFILE — story-style. No banner, no tabs.
// Quote-led intro, two-column layout with editorial sidebar.
// ──────────────────────────────────────────────────────────────────
const Profile = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Profile" />}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {isMobile && <div style={{ padding: "18px 18px 0" }}><MobileTopbar /></div>}

        <div style={{
          flex: 1, overflow: "hidden",
          padding: isMobile ? "16px 18px 18px" : "40px 64px 32px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.45fr 1fr",
          gap: isMobile ? 22 : 56,
        }}>
          {/* Left: the story */}
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 18 : 28, minWidth: 0 }}>
            {/* Identity row */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ position: "relative" }}>
                <Avatar name="Amira Hassan" size={isMobile ? 64 : 76} tone="dark" />
                <span style={{
                  position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderRadius: 99,
                  background: "var(--olive)", border: "3px solid var(--paper)",
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="mono" style={{ fontSize: 11, color: "var(--olive)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>
                  Open to coffee chats
                </p>
                <h1 style={{ fontSize: isMobile ? 30 : 40, marginTop: 2, lineHeight: 1.05 }}>Amira Hassan</h1>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 4 }}>
                  Senior Product Designer · Toronto, Canada
                </p>
              </div>
            </div>

            {/* Quote-led intro */}
            <blockquote style={{
              borderLeft: "3px solid var(--clay)",
              padding: "6px 0 6px 20px",
              fontFamily: "var(--display)",
              fontSize: isMobile ? 22 : 30,
              lineHeight: 1.25,
              fontWeight: 400,
              color: "var(--ink)",
              margin: 0,
            }}>
              <span style={{ fontStyle: "italic" }}>
                "I'm here because I rebuilt my career from scratch
                in a new country — and I want to make that path shorter for the
                next person."
              </span>
            </blockquote>

            {/* Two short bio paragraphs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 600 }}>
              <p>
                Eight years designing for fintech and SaaS, in Cairo and Toronto.
                I care about quiet, considered tools — and about the moment
                someone realises they belong in a room.
              </p>
              <p>
                I host two rooms a month for newcomer designers, and I've made
                <span style={{ color: "var(--clay)", fontWeight: 600 }}> 61 warm intros </span>
                through Hayy. If you're moving countries or pivoting roles, my
                inbox is open.
              </p>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Product design", "Design systems", "Newcomer to CA", "MENA community", "Mentorship", "Fintech"].map(t => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>

            {/* CTAs (desktop) */}
            {!isMobile && (
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <Btn kind="primary" size="lg" icon={I.shake}>Request a referral</Btn>
                <Btn kind="soft" size="lg" icon={I.msg}>Send a message</Btn>
                <Btn kind="ghost" size="lg">Save</Btn>
              </div>
            )}

            {/* Career path — editorial timeline */}
            <div style={{ marginTop: isMobile ? 8 : 16 }}>
              <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>
                The path here
              </p>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column" }}>
                {[
                  { year: "2024 —", role: "Senior Product Designer", co: "Wealthsimple", note: "Lead design for newcomer onboarding & banking products." },
                  { year: "2021–24", role: "Product Designer", co: "Shopify · Toronto", note: "Design systems, merchant tools. Moved to Canada in 2021." },
                  { year: "2018–21", role: "Product Designer", co: "Fawry · Cairo", note: "Founding designer on consumer payments." },
                  { year: "2016–18", role: "Visual Designer", co: "Independent", note: "Brand & product work for MENA startups." },
                ].map((r, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: isMobile ? "70px 1fr" : "100px 1fr",
                    gap: isMobile ? 12 : 22,
                    padding: "14px 0",
                    borderTop: i === 0 ? "1px solid var(--line-soft)" : "1px dashed var(--line-soft)",
                  }}>
                    <p className="mono" style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em" }}>{r.year}</p>
                    <div>
                      <p style={{ fontFamily: "var(--display)", fontSize: 16, fontWeight: 500 }}>
                        {r.role} <span style={{ color: "var(--ink-mute)", fontWeight: 400 }}>· {r.co}</span>
                      </p>
                      <p style={{ marginTop: 4, fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>{r.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div style={{
              marginTop: isMobile ? 8 : 12,
              padding: isMobile ? 18 : 24, borderRadius: "var(--radius-lg)",
              background: "var(--cream)", border: "1px solid var(--line-soft)",
              display: "flex", gap: 14, alignItems: "flex-start",
            }}>
              <Avatar name="Diego Rivas" size={40} tone="olive" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--display)", fontSize: isMobile ? 16 : 18, lineHeight: 1.45, fontStyle: "italic" }}>
                  "Amira's the reason I got my Shopify interview. She didn't
                  just refer me — she rehearsed answers with me on a Sunday."
                </p>
                <p style={{ marginTop: 8, fontSize: 12, color: "var(--ink-mute)" }}>
                  Diego Rivas · PM at Notion · referred Mar 2024
                </p>
              </div>
            </div>
          </div>

          {/* Right: editorial sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            {/* Stats — vertical, editorial */}
            <div style={{
              padding: isMobile ? 18 : 22, borderRadius: "var(--radius-lg)",
              background: "var(--cream)", border: "1px solid var(--line-soft)",
              display: "flex", flexDirection: "column", gap: 14,
            }}>
              {[
                { n: "61", l: "Warm intros made through Hayy" },
                { n: "12", l: "Rooms hosted in the last 6 months" },
                { n: "3.4 days", l: "Average time to reply" },
              ].map((s, i) => (
                <div key={s.l} style={{
                  display: "flex", alignItems: "baseline", gap: 14,
                  paddingTop: i === 0 ? 0 : 14,
                  borderTop: i === 0 ? 0 : "1px dashed var(--line-soft)",
                }}>
                  <p style={{ fontFamily: "var(--display)", fontSize: 32, lineHeight: 1, fontWeight: 500, color: "var(--clay)", flex: "none" }}>{s.n}</p>
                  <p className="mono" style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em", textTransform: "uppercase" }}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Signature room — recurring host */}
            <div className="hy-card" style={{
              padding: 18,
              background: "linear-gradient(135deg, var(--clay), var(--clay-2))",
              color: "var(--paper)", borderColor: "transparent",
              boxShadow: "var(--shadow-warm)",
            }}>
              <p className="mono" style={{ fontSize: 10, opacity: .8, letterSpacing: ".12em", textTransform: "uppercase" }}>Signature room · every 2nd Thursday</p>
              <h3 style={{ fontFamily: "var(--display)", fontSize: 20, marginTop: 6, lineHeight: 1.2, fontWeight: 500 }}>
                Newcomer designers Q&A
              </h3>
              <p style={{ marginTop: 6, fontSize: 12, opacity: .9, lineHeight: 1.5 }}>
                A recurring open room for designers who've moved countries. No
                slides, no agenda — just questions you'd ask a friend.
              </p>
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 11, opacity: .85 }}>Next · Thu May 8 · 7pm</span>
                <Btn kind="soft" size="md" style={{ background: "var(--paper)", color: "var(--ink)", borderColor: "transparent" }}>RSVP</Btn>
              </div>
            </div>

            {/* Availability calendar */}
            <div className="hy-card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase" }}>This week</p>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)" }}>1 / 3 chats taken</span>
              </div>
              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                {[
                  { d: "Mon", n: 28, s: "off" },
                  { d: "Tue", n: 29, s: "off" },
                  { d: "Wed", n: 30, s: "open" },
                  { d: "Thu", n: 1, s: "taken" },
                  { d: "Fri", n: 2, s: "open" },
                  { d: "Sat", n: 3, s: "off" },
                  { d: "Sun", n: 4, s: "open" },
                ].map(d => {
                  const map = {
                    open: { bg: "var(--paper)", fg: "var(--ink)", border: "var(--olive)" },
                    taken: { bg: "var(--clay)", fg: "var(--paper)", border: "transparent" },
                    off: { bg: "var(--cream)", fg: "var(--ink-mute)", border: "transparent" },
                  };
                  const m = map[d.s];
                  return (
                    <div key={d.d} style={{
                      padding: "8px 0", borderRadius: 10, textAlign: "center",
                      background: m.bg, color: m.fg,
                      border: "1.5px solid " + m.border,
                    }}>
                      <p className="mono" style={{ fontSize: 9, opacity: .7, letterSpacing: ".08em", textTransform: "uppercase" }}>{d.d}</p>
                      <p style={{ fontFamily: "var(--display)", fontSize: 16, fontWeight: 500, marginTop: 2 }}>{d.n}</p>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 12, fontSize: 11, color: "var(--ink-mute)", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, border: "1.5px solid var(--olive)" }} /> Open
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--clay)" }} /> Taken
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--cream)" }} /> Unavailable
                </span>
              </div>
            </div>

            {/* Open to */}
            <div className="hy-card" style={{ padding: 18 }}>
              <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase" }}>Happy to help with</p>
              <ul style={{ marginTop: 10, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {["Coffee chats (3 / month)", "Resume review", "Portfolio review", "Mock interviews"].map(t => (
                  <li key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <span style={{ color: "var(--olive)" }}>{I.check}</span>{t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mutual connections */}
            <div className="hy-card" style={{ padding: 18 }}>
              <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase" }}>You both know</p>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: -6 }}>
                <div style={{ display: "flex" }}>
                  {[
                    { n: "Maya N.", t: "clay" },
                    { n: "Rashid K.", t: "olive" },
                    { n: "Layla P.", t: "sand" },
                    { n: "Sara M.", t: "dark" },
                  ].map((p, i) => (
                    <div key={p.n} style={{ marginLeft: i === 0 ? 0 : -8, border: "2px solid var(--paper)", borderRadius: 999 }}>
                      <Avatar name={p.n} size={32} tone={p.t} />
                    </div>
                  ))}
                </div>
                <p style={{ marginLeft: 12, fontSize: 13, color: "var(--ink-soft)" }}>
                  <span style={{ color: "var(--ink)", fontWeight: 500 }}>4 mutual</span> · incl. Maya, Rashid
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile sticky CTA */}
        {isMobile && (
          <div style={{
            padding: 14, borderTop: "1px solid var(--line-soft)", background: "var(--paper)",
            display: "flex", gap: 8,
          }}>
            <Btn kind="primary" size="md" icon={I.shake} style={{ flex: 1, justifyContent: "center" }}>Refer me</Btn>
            <Btn kind="soft" size="md" icon={I.msg} style={{ flex: 1, justifyContent: "center" }}>Message</Btn>
          </div>
        )}
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// ONBOARDING — single warm step (unchanged direction)
// ──────────────────────────────────────────────────────────────────
const Onboarding = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <div className="hy hy-bg-hero" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: isMobile ? "16px 18px" : "20px 56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 26, height: 26, borderRadius: 8, background: "var(--clay)", color: "var(--paper)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--display)", fontStyle: "italic", fontWeight: 600, fontSize: 16 }}>h</span>
          <span style={{ fontFamily: "var(--display)", fontSize: 18 }}>Hayy</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)" }}>STEP 02 / 04</span>
          <div style={{ width: isMobile ? 80 : 160, height: 4, borderRadius: 99, background: "var(--line)" }}>
            <div style={{ width: "50%", height: "100%", borderRadius: 99, background: "var(--clay)" }} />
          </div>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>Skip</span>
        </div>
      </div>

      <div style={{
        flex: 1, padding: isMobile ? "0 18px 18px" : "0 56px 40px",
        display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 1fr",
        gap: isMobile ? 24 : 56, alignItems: "center", overflow: "hidden",
      }}>
        <div>
          <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            Why you're here
          </p>
          <h1 style={{ fontSize: isMobile ? 38 : 64, marginTop: 12, lineHeight: 1.0 }}>
            What kind of <span className="display-italic">conversation</span><br />
            would change things for you?
          </h1>
          <p style={{ marginTop: 16, fontSize: isMobile ? 15 : 17, color: "var(--ink-soft)", maxWidth: 520 }}>
            Pick one or two. We'll match you to rooms and hosts where the
            people inside actually answer this question.
          </p>

          <div style={{ marginTop: isMobile ? 22 : 32, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { t: "I want a referral into a specific company", on: true },
              { t: "I'm exploring what role fits me next", on: false },
              { t: "I'm new to Canada and rebuilding my network", on: true },
              { t: "I want to host rooms and help others", on: false },
            ].map(o => (
              <label key={o.t} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
                borderRadius: 16, border: "1.5px solid " + (o.on ? "var(--clay)" : "var(--line)"),
                background: "var(--paper)",
                boxShadow: o.on ? "var(--shadow-soft)" : "none",
                cursor: "pointer",
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 999, flex: "none",
                  background: o.on ? "var(--clay)" : "transparent",
                  border: "1.5px solid " + (o.on ? "var(--clay)" : "var(--line)"),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--paper)",
                }}>
                  {o.on && I.check}
                </span>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{o.t}</span>
              </label>
            ))}
          </div>

          <div style={{ marginTop: isMobile ? 22 : 32, display: "flex", gap: 10 }}>
            <Btn kind="ghost" size="lg">Back</Btn>
            <Btn kind="primary" size="lg" iconRight={I.arrow}>Continue</Btn>
          </div>
        </div>

        {!isMobile && (
          <div style={{ position: "relative" }}>
            <div className="hy-card" style={{ padding: 24, borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-warm)" }}>
              <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase" }}>Based on your answers</p>
              <h3 style={{ fontFamily: "var(--display)", fontSize: 22, marginTop: 8, lineHeight: 1.15, fontWeight: 500 }}>
                You'd fit beautifully in 3 rooms this week.
              </h3>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { t: "Career Access for International Pros", w: "Sat 11am", h: "Layla P.", tone: "sand" },
                  { t: "Breaking into Amazon as a newcomer", w: "Tonight", h: "Maya N.", tone: "clay", live: true },
                  { t: "Newcomer designers Q&A", w: "Mon 7pm", h: "Amira H.", tone: "olive" },
                ].map(r => (
                  <div key={r.t} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: 12,
                    borderRadius: 14, border: "1px solid var(--line-soft)", background: "var(--cream)",
                  }}>
                    <Avatar name={r.h} size={32} tone={r.tone} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{r.t}</p>
                      <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>{r.h} · {r.w}</p>
                    </div>
                    {r.live && <LiveTag>Live</LiveTag>}
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 14, fontSize: 12, color: "var(--ink-mute)", fontStyle: "italic" }}>
                You can change these any time. We don't share your goals with anyone.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { RoomsList, Referrals, Profile, Onboarding });
