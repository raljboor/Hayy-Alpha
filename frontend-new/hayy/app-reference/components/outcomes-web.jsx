// outcomes-web.jsx — the web side of the feedback loop.
// Mirrors the app's outcome tracking (app-screens-9) on desktop + mobile.
//   · WinsWeb          — "Your journey": pursuits + community wins + give-back
//   · OutcomeUpdateWeb — the panel that opens from a referral thread
// Reuses Sidebar / MobileTopbar / MobileTabbar / Btn / Pill / Avatar / I / SectionLabel.

const OUTCOME_STAGES_WEB = [
  { key: "intro",     label: "Warm intro",   icon: I.shake },
  { key: "talking",   label: "In conversation", icon: I.msg },
  { key: "interview", label: "Interviewing", icon: I.cal },
  { key: "final",     label: "Final round",  icon: I.bolt },
  { key: "offer",     label: "Offer",        icon: I.spark },
  { key: "landed",    label: "Landed",       icon: I.brief },
];

// Horizontal milestone stepper for desktop cards.
const OutcomeStepperWeb = ({ current = 3 }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
    {OUTCOME_STAGES_WEB.map((s, i) => {
      const done = i < current, here = i === current, future = i > current;
      const last = i === OUTCOME_STAGES_WEB.length - 1;
      return (
        <div key={s.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <span style={{ flex: 1, height: 2, background: i === 0 ? "transparent" : (done || here ? "var(--clay)" : "var(--line)") }} />
            <span style={{
              width: here ? 30 : 26, height: here ? 30 : 26, borderRadius: 999, flex: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: (done || here) ? "var(--clay)" : "var(--cream)",
              color: (done || here) ? "var(--paper)" : "var(--ink-mute)",
              border: future ? "1.5px solid var(--line)" : "none",
              boxShadow: here ? "0 0 0 5px color-mix(in oklab, var(--clay) 18%, transparent)" : "none",
            }}>{done ? React.cloneElement(I.check, { size: 13 }) : React.cloneElement(s.icon, { size: here ? 15 : 13 })}</span>
            <span style={{ flex: 1, height: 2, background: last ? "transparent" : (done ? "var(--clay)" : "var(--line)") }} />
          </div>
          <p style={{ fontSize: 11, fontWeight: here ? 700 : 500, color: future ? "var(--ink-mute)" : "var(--ink)", marginTop: 7, textAlign: "center", lineHeight: 1.25 }}>{s.label}</p>
        </div>
      );
    })}
  </div>
);

const communityWinsWeb = [
  { who: "Omar Aziz", role: "Data → PM · RBC", t: "clay", note: "Came back to host", icon: I.mic },
  { who: "Sara Mahmoud", role: "PM · Shopify", t: "olive", note: "Got the offer", icon: I.spark },
  { who: "Dana Liu", role: "Design · Figma", t: "sand", note: "Final round", icon: I.bolt },
];

const WinsWeb = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Referrals" />}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {isMobile && <div style={{ padding: "18px 18px 0" }}><MobileTopbar /></div>}

        <div style={{ padding: isMobile ? "18px 18px 14px" : "28px 48px 20px", borderBottom: "1px solid var(--line-soft)",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <SectionLabel>Outcomes</SectionLabel>
            <h1 style={{ fontSize: isMobile ? 30 : 40, marginTop: 6, lineHeight: 1.04 }}>Your <span className="display-italic">journey.</span></h1>
          </div>
          <div style={{ display: "flex", gap: isMobile ? 14 : 28 }}>
            {[["2", "Pursuits"], ["4", "Interviews"], ["1", "Final round"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: isMobile ? "left" : "right" }}>
                <p style={{ fontFamily: "var(--display)", fontSize: isMobile ? 24 : 30, lineHeight: 1, color: "var(--clay)", fontWeight: 500 }}>{n}</p>
                <p className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflow: "hidden", padding: isMobile ? "18px 18px" : "24px 48px 28px",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: isMobile ? 22 : 36 }}>

          {/* pursuits */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
            <SectionLabel>In motion</SectionLabel>

            <article className="hy-card" style={{ padding: isMobile ? 18 : 22, display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name="Maya Nasrallah" size={42} tone="clay" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 16, fontWeight: 600 }}>Product Manager · AWS</p>
                  <p style={{ fontSize: 12, color: "var(--ink-mute)" }}>via Maya Nasrallah</p>
                </div>
                <Pill style={{ background: "var(--clay)", color: "var(--paper)", borderColor: "transparent" }}>Final round</Pill>
              </div>
              <OutcomeStepperWeb current={3} />
              <div style={{ display: "flex", gap: 8 }}>
                <Btn kind="primary" size="md" iconRight={I.arrow}>Update status</Btn>
                <Btn kind="soft" size="md" icon={I.msg}>Message Maya</Btn>
              </div>
            </article>

            <article className="hy-card" style={{ padding: isMobile ? 16 : 20, display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name="Layla Park" size={40} tone="olive" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 600 }}>APM · Figma</p>
                <p style={{ fontSize: 12, color: "var(--ink-mute)" }}>via Layla Park · Interviewing</p>
              </div>
              <Btn kind="soft" size="md">Update</Btn>
            </article>
          </div>

          {/* right rail — community + flywheel */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            <div className="hy-card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                <SectionLabel>Wins this week</SectionLabel>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)" }}>61 INTROS · 23 HIRES</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {communityWinsWeb.map(w => (
                  <div key={w.who} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <div style={{ position: "relative", flex: "none" }}>
                      <Avatar name={w.who} size={38} tone={w.t} />
                      <span style={{ position: "absolute", bottom: -3, right: -3, width: 19, height: 19, borderRadius: 99, background: "var(--clay)", color: "var(--paper)", border: "2px solid var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>{React.cloneElement(w.icon, { size: 10 })}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13.5, fontWeight: 600 }}>{w.who}</p>
                      <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>{w.role}</p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--clay)" }}>{w.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* give-back / flywheel */}
            <div className="hy-card" style={{ padding: 18, background: "linear-gradient(135deg, var(--clay), var(--clay-2))", color: "var(--paper)", borderColor: "transparent", boxShadow: "var(--shadow-warm)" }}>
              <p className="mono" style={{ fontSize: 10, opacity: .85, letterSpacing: ".12em", textTransform: "uppercase" }}>When you land it</p>
              <h3 style={{ fontFamily: "var(--display)", fontSize: 20, marginTop: 6, lineHeight: 1.2, fontWeight: 500 }}>
                You got the warm intro. Be one.
              </h3>
              <p style={{ marginTop: 8, fontSize: 12.5, opacity: .92, lineHeight: 1.5 }}>
                Every hire who comes back makes the next intro warmer. Host a room, open to referrals, or mentor.
              </p>
              <Btn kind="soft" size="md" iconRight={I.shake} style={{ marginTop: 14, background: "var(--paper)", color: "var(--ink)", borderColor: "transparent" }}>Pay it forward</Btn>
            </div>
          </aside>
        </div>
        {isMobile && <div style={{ padding: "0 18px 12px" }}><MobileTabbar /></div>}
      </main>
    </div>
  );
};

// The update panel — opens from a referral thread ("how's it going?")
const OutcomeUpdateWeb = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const pick = 3; // final round
  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(15,15,20,.35)", overflow: "hidden", padding: isMobile ? 0 : 24 }}>
      <div className="hy-card" style={{
        width: "100%", maxWidth: isMobile ? "100%" : 520, alignSelf: isMobile ? "flex-end" : "center",
        background: "var(--paper)", borderRadius: isMobile ? "18px 18px 0 0" : "var(--radius-xl)",
        padding: isMobile ? 22 : 28, display: "flex", flexDirection: "column", gap: 18,
        boxShadow: "0 24px 70px -20px rgba(0,0,0,.4)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name="Maya Nasrallah" size={44} tone="clay" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionLabel>Update your referral</SectionLabel>
            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>Product Manager · AWS</p>
            <p style={{ fontSize: 12, color: "var(--ink-mute)" }}>via Maya Nasrallah</p>
          </div>
        </div>

        {/* stages */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {OUTCOME_STAGES_WEB.map((s, i) => {
            const on = i === pick;
            return (
              <div key={s.key} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12,
                background: on ? "color-mix(in oklab, var(--clay) 9%, var(--paper))" : "var(--paper)",
                border: "1.5px solid " + (on ? "var(--clay)" : "var(--line-soft)"),
              }}>
                <span style={{ width: 28, height: 28, borderRadius: 9, flex: "none", display: "flex", alignItems: "center", justifyContent: "center",
                  background: on ? "var(--clay)" : "var(--cream)", color: on ? "var(--paper)" : "var(--ink-mute)" }}>{React.cloneElement(s.icon, { size: 14 })}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: on ? 700 : 500 }}>{s.label}</span>
                {on && React.cloneElement(I.check, { size: 17, color: "var(--clay)" })}
              </div>
            );
          })}
        </div>

        {/* visibility */}
        <div>
          <SectionLabel>Who sees this</SectionLabel>
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            {[["Private", true], ["Share as a win", false], ["Anonymous", false]].map(([l, on]) => (
              <span key={l} style={{
                padding: "7px 13px", borderRadius: 999, fontSize: 12.5, fontWeight: 500,
                background: on ? "var(--ink)" : "transparent", color: on ? "var(--paper)" : "var(--ink-soft)",
                border: "1px solid " + (on ? "var(--ink)" : "var(--line)"),
              }}>{l}</span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Btn kind="primary" size="lg" iconRight={I.check} style={{ flex: 1, justifyContent: "center" }}>Save update</Btn>
          <Btn kind="ghost" size="lg">Cancel</Btn>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { WinsWeb, OutcomeUpdateWeb, OutcomeStepperWeb });
