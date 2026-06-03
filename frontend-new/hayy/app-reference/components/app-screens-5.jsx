// Hayy minimal screens — part 5: the flow gaps.
// Room Detail · Book a 1:1 · Room Scheduled · Your Schedule ·
// Request an intro · Connections · Referral Detail.
// Reuses Card/Meta/Stack + DrillScreen/Chevron/Field/Input from earlier files.

// ════════════════════════ ROOM DETAIL (preview) ════════════════════
const detailSpeakers = [
  { n: "Maya Nasrallah", r: "Host · Sr PM, AWS", tone: "clay" },
  { n: "Rashid Khoury", r: "Eng Mgr, Amazon", tone: "dark" },
  { n: "Jenna Sun", r: "Talent, Shopify", tone: "olive" },
];

const RoomDetailScreen = () => {
  const nav = useNav();
  return (
  <DrillScreen
    eyebrow="ROOM 04"
    title="Tonight, 7:00 PM"
    action={<RoundBtn icon={React.cloneElement(I.link, { size: 16 })} />}
    wash
    footer={
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Meta>42 GOING</Meta>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>Starts in 2h 14m</p>
        </div>
        <Btn kind="primary" size="lg" iconRight={I.arrow} onClick={() => nav.go("greenRoom")}>Reserve seat</Btn>
      </div>
    }>
    <div style={{ paddingTop: 8, paddingBottom: 12 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <span className="hy-pill" style={{ textTransform: "none", letterSpacing: 0, fontSize: 12 }}>Product</span>
        <span className="hy-pill" style={{ textTransform: "none", letterSpacing: 0, fontSize: 12 }}>Interviews</span>
      </div>
      <h1 style={{ fontSize: 28, lineHeight: 1.08, marginBottom: 16 }}>Breaking into Product at Big&nbsp;Tech</h1>
      <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-soft)", marginBottom: 24 }}>
        Maya and friends unpack how they actually got hired — portfolios, the case interview, and the unwritten rules. Bring questions; hands go up.
      </p>

      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-mute)", marginBottom: 12 }}>ON STAGE</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 24 }}>
        {detailSpeakers.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px", borderBottom: i < detailSpeakers.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
            <Avatar name={s.n} size={42} tone={s.tone} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{s.n}</p>
              <Meta>{s.r}</Meta>
            </div>
            {i === 0 && <span style={{ width: 30, height: 30, borderRadius: 10, background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>{React.cloneElement(I.mic, { size: 14 })}</span>}
          </div>
        ))}
      </div>

      <Card style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Stack names={["A B", "C D", "E F", "G H"]} n={42} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600 }}>Sara, Tom & 40 others</p>
          <Meta>have reserved a seat</Meta>
        </div>
      </Card>
    </div>
  </DrillScreen>
  );
};

// ════════════════════════ BOOK A 1:1 ════════════════════════
const days = [["Mon", "2"], ["Tue", "3"], ["Wed", "4"], ["Thu", "5"], ["Fri", "6"]];
const slots = ["9:00", "9:30", "10:00", "11:00", "1:30", "2:00", "3:00", "4:30"];

const BookOneOnOneScreen = () => {
  const nav = useNav();
  return (
  <DrillScreen
    title="Book a 1:1"
    eyebrow="WITH MAYA NASRALLAH"
    footer={<Btn kind="primary" size="xl" iconRight={I.arrow} onClick={() => nav.go("scheduled")} style={{ width: "100%", justifyContent: "center" }}>Confirm · Wed 10:00 AM</Btn>}>
    <div style={{ paddingTop: 10, paddingBottom: 12 }}>
      <Card style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <Avatar name="Maya Nasrallah" size={46} tone="clay" />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 600 }}>Maya Nasrallah</p>
          <Meta>Sr PM · AWS · 20 min call</Meta>
        </div>
      </Card>

      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-mute)", marginBottom: 12 }}>PICK A DAY</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {days.map(([d, n], i) => {
          const on = i === 2;
          return (
            <div key={d} style={{
              flex: 1, textAlign: "center", padding: "12px 0", borderRadius: 14, cursor: "pointer",
              background: on ? "var(--clay)" : "var(--paper)", color: on ? "var(--paper)" : "var(--ink)",
              border: on ? "none" : "1px solid var(--line)",
            }}>
              <div style={{ fontSize: 11, opacity: .8 }}>{d}</div>
              <div style={{ fontFamily: "var(--display)", fontSize: 20, marginTop: 2 }}>{n}</div>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-mute)", marginBottom: 12 }}>AVAILABLE TIMES</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {slots.map((t, i) => {
          const on = i === 2;
          return (
            <div key={t} style={{
              padding: "13px 0", textAlign: "center", borderRadius: 13, fontSize: 15, fontWeight: 600, cursor: "pointer",
              background: on ? "color-mix(in oklab, var(--clay) 12%, var(--paper))" : "var(--paper)",
              color: on ? "var(--clay)" : "var(--ink)",
              border: on ? "1.5px solid var(--clay)" : "1px solid var(--line)",
            }}>{t} {i < 4 ? "AM" : "PM"}</div>
          );
        })}
      </div>
    </div>
  </DrillScreen>
  );
};

// ════════════════════════ ROOM SCHEDULED (confirmation) ════════════
const RoomScheduledScreen = () => {
  const nav = useNav();
  return (
  <div className="hy" style={{
    position: "relative", width: "100%", height: "100%", overflow: "hidden",
    display: "flex", flexDirection: "column", background: "var(--bg)", fontFamily: "var(--body)",
  }}>
    <Wash />
    <div style={{ position: "relative", zIndex: 2, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 34px" }}>
      <div style={{
        width: 84, height: 84, borderRadius: 999, background: "var(--clay)", color: "var(--paper)",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 26,
        boxShadow: "0 16px 40px -12px color-mix(in oklab, var(--clay) 70%, transparent)",
      }}>{React.cloneElement(I.check, { size: 38 })}</div>
      <h1 style={{ fontSize: 30, lineHeight: 1.05, marginBottom: 12 }}>
        Your room is <span className="display-italic">on the calendar.</span>
      </h1>
      <p style={{ fontSize: 15, color: "var(--ink-soft)", marginBottom: 28, maxWidth: 300 }}>
        We'll remind your followers 15 minutes before it starts. Share it to fill more seats.
      </p>

      <Card style={{ width: "100%", textAlign: "left", marginBottom: 8 }}>
        <Meta>TONIGHT · 7:00 PM</Meta>
        <p style={{ fontSize: 17, fontWeight: 600, marginTop: 6 }}>Breaking into Product at Big Tech</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <Avatar name="Adam Saleh" size={26} tone="clay" />
          <Meta>You're hosting · 2 co-hosts</Meta>
        </div>
      </Card>
    </div>

    <div style={{ position: "relative", zIndex: 2, flex: "none", padding: "16px 22px 34px", display: "flex", gap: 10 }}>
      <Btn kind="soft" size="lg" icon={I.link} style={{ flex: "none" }}>Share</Btn>
      <Btn kind="primary" size="lg" style={{ flex: 1, justifyContent: "center" }} onClick={() => nav.go("home")}>Done</Btn>
    </div>
  </div>
  );
};

// ════════════════════════ YOUR SCHEDULE ════════════════════════
const schedule = [
  { group: "TODAY", items: [
    { t: "Breaking into Product at Big Tech", host: "Maya Nasrallah", time: "7:00 PM", role: "Reserved", tone: "clay", soon: true },
  ] },
  { group: "TOMORROW", items: [
    { t: "1:1 with Maya Nasrallah", host: "20 min call", time: "10:00 AM", role: "Booked", tone: "clay" },
    { t: "Design portfolios that get callbacks", host: "Layla Park", time: "8:30 PM", role: "Reserved", tone: "olive" },
  ] },
  { group: "THIS WEEK", items: [
    { t: "New grad → first eng role", host: "Rashid Khoury", time: "Thu", role: "Hosting", tone: "dark" },
  ] },
];

const YourScheduleScreen = () => (
  <DrillScreen title="Your schedule" eyebrow="">
    <div style={{ paddingTop: 8, paddingBottom: 16 }}>
      {schedule.map((sec) => (
        <div key={sec.group} style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", color: "var(--ink-mute)", marginBottom: 11, paddingLeft: 2 }}>{sec.group}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sec.items.map((it, i) => (
              <Card key={i} style={{ display: "flex", gap: 13, alignItems: "center", borderColor: it.soon ? "color-mix(in oklab, var(--clay) 28%, var(--line))" : "var(--line)" }}>
                <div style={{ textAlign: "center", flex: "none", width: 54 }}>
                  <div style={{ fontFamily: "var(--display)", fontSize: 16, lineHeight: 1.1, color: it.soon ? "var(--clay)" : "var(--ink)" }}>{it.time}</div>
                </div>
                <div style={{ width: 1, alignSelf: "stretch", background: "var(--line-soft)" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.2 }}>{it.t}</p>
                  <Meta>{it.host}</Meta>
                </div>
                <span style={{
                  flex: "none", fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 999,
                  background: it.role === "Hosting" ? "var(--clay)" : "var(--cream)",
                  color: it.role === "Hosting" ? "var(--paper)" : "var(--ink-soft)",
                  border: it.role === "Hosting" ? "none" : "1px solid var(--line)",
                }}>{it.role}</span>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  </DrillScreen>
);

// ════════════════════════ REQUEST AN INTRO ════════════════════════
const RequestIntroScreen = () => {
  const nav = useNav();
  return (
  <DrillScreen
    title="Ask for an intro"
    eyebrow="WARM INTRO"
    footer={<Btn kind="primary" size="xl" iconRight={I.shake} onClick={() => nav.go("referrals")} style={{ width: "100%", justifyContent: "center" }}>Send request</Btn>}>
    <div style={{ paddingTop: 10, paddingBottom: 12 }}>
      <Field label="Who do you want to meet?">
        <Card pad={12} style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Avatar name="Sarah Chen" size={40} tone="olive" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14.5, fontWeight: 600 }}>Sarah Chen</p>
            <Meta>Recruiter · AWS</Meta>
          </div>
          {React.cloneElement(I.check, { size: 18 })}
        </Card>
      </Field>

      <Field label="Ask through">
        <Card pad={12} style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Avatar name="Maya Nasrallah" size={40} tone="clay" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14.5, fontWeight: 600 }}>Maya Nasrallah</p>
            <Meta>Knows Sarah · 4 mutual</Meta>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#3fb98a" }}>Strong</span>
        </Card>
      </Field>

      <Field label="What's the ask?">
        <Input value="" placeholder="e.g. 15 min about the APM role" />
      </Field>

      <Field label="Why you?">
        <div style={{ padding: "14px 16px", borderRadius: 14, background: "var(--paper)", border: "1px solid var(--line)", fontSize: 14.5, lineHeight: 1.5, color: "var(--ink-soft)", minHeight: 92 }}>
          Hi Maya — would you be open to introducing me to Sarah? I've been building toward product for two years and AWS is the team I'd most love to learn from.
        </div>
      </Field>
    </div>
  </DrillScreen>
  );
};

// ════════════════════════ CONNECTIONS / NETWORK ════════════════════
const network = [
  { group: "FROM YOUR ROOMS", people: [
    { n: "Maya Nasrallah", r: "Sr PM · AWS", mut: "4 mutual", tone: "clay" },
    { n: "Rashid Khoury", r: "Eng Mgr · Amazon", mut: "2 mutual", tone: "dark" },
    { n: "Jenna Sun", r: "Talent · Shopify", mut: "6 mutual", tone: "olive" },
  ] },
  { group: "PEOPLE YOU MAY KNOW", people: [
    { n: "Omar Aziz", r: "Data · RBC", mut: "3 mutual", tone: "sand", suggest: true },
    { n: "Layla Park", r: "Design · Figma", mut: "1 mutual", tone: "clay", suggest: true },
  ] },
];

const ConnectionsScreen = () => {
  const nav = useNav();
  return (
  <DrillScreen title="Your network" eyebrow="" action={<RoundBtn icon={React.cloneElement(I.search, { size: 16 })} onClick={() => nav.go("search")} />}>
    <div style={{ paddingTop: 8, paddingBottom: 16 }}>
      <Card style={{ display: "flex", justifyContent: "space-around", marginBottom: 24, padding: "15px 0" }}>
        {[["128", "CONNECTIONS"], ["61", "WARM INTROS"], ["12", "COMPANIES"]].map(([n, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--display)", fontSize: 24, lineHeight: 1 }}>{n}</div>
            <Meta>{l}</Meta>
          </div>
        ))}
      </Card>

      {network.map((sec) => (
        <div key={sec.group} style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", color: "var(--ink-mute)", marginBottom: 10, paddingLeft: 2 }}>{sec.group}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sec.people.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", borderBottom: i < sec.people.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
                <Avatar name={p.n} size={44} tone={p.tone} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{p.n}</p>
                  <Meta>{p.r} · {p.mut}</Meta>
                </div>
                {p.suggest
                  ? <Btn kind="soft" size="md" icon={I.plus}>Connect</Btn>
                  : <Btn kind="soft" size="md" icon={I.msg} onClick={() => nav.go("thread")}>Message</Btn>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </DrillScreen>
  );
};

// ════════════════════════ REFERRAL DETAIL ════════════════════════
const timeline = [
  { t: "Referral sent", who: "Maya → Sarah Chen", when: "Mon 8:12 PM", done: true },
  { t: "Recruiter reviewing", who: "Sarah opened your profile", when: "Tue 9:40 AM", done: true },
  { t: "Replied", who: "\u201cLet's set up a call\u201d", when: "Tue 2:15 PM", done: true, accent: true },
  { t: "Call booked", who: "Thu, 10:00 AM", when: "Upcoming", done: false },
];

const ReferralDetailScreen = () => {
  const nav = useNav();
  return (
  <DrillScreen
    title="Referral"
    eyebrow="IN MOTION"
    action={<RoundBtn icon={React.cloneElement(I.more, { size: 18 })} />}
    footer={
      <div style={{ display: "flex", gap: 9 }}>
        <Btn kind="primary" size="lg" iconRight={I.arrow} onClick={() => nav.go("updateOutcome")} style={{ flex: 1, justifyContent: "center" }}>Update status</Btn>
        <Btn kind="soft" size="lg" icon={I.msg}>Message</Btn>
      </div>
    }>
    <div style={{ paddingTop: 8, paddingBottom: 12 }}>
      {/* the connection */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ textAlign: "center" }}>
          <Avatar name="Adam Saleh" size={52} tone="clay" />
          <p style={{ fontSize: 12, fontWeight: 600, marginTop: 6 }}>You</p>
        </div>
        <div style={{ flex: "none", color: "var(--clay)", marginBottom: 18 }}>{React.cloneElement(I.shake, { size: 20 })}</div>
        <div style={{ textAlign: "center" }}>
          <Avatar name="Sarah Chen" size={52} tone="olive" />
          <p style={{ fontSize: 12, fontWeight: 600, marginTop: 6 }}>Sarah Chen</p>
        </div>
      </div>
      <p style={{ textAlign: "center", marginBottom: 24 }}><Meta>APM · AWS · via Maya Nasrallah</Meta></p>

      {/* timeline */}
      <div style={{ position: "relative", paddingLeft: 6 }}>
        {timeline.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14, paddingBottom: i < timeline.length - 1 ? 22 : 0, position: "relative" }}>
            {/* line */}
            {i < timeline.length - 1 && (
              <span style={{ position: "absolute", left: 9, top: 22, bottom: 0, width: 2, background: s.done ? "var(--clay)" : "var(--line)" }} />
            )}
            <span style={{
              flex: "none", width: 20, height: 20, borderRadius: 999, marginTop: 1, zIndex: 1,
              background: s.done ? "var(--clay)" : "var(--paper)",
              border: s.done ? "none" : "2px solid var(--line)",
              color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>{s.done && React.cloneElement(I.check, { size: 12 })}</span>
            <div style={{ flex: 1, marginTop: -2 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: s.accent ? "var(--clay)" : "var(--ink)" }}>{s.t}</p>
              <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 2 }}>{s.who}</p>
              <Meta>{s.when}</Meta>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DrillScreen>
  );
};

Object.assign(window, {
  RoomDetailScreen, BookOneOnOneScreen, RoomScheduledScreen, YourScheduleScreen,
  RequestIntroScreen, ConnectionsScreen, ReferralDetailScreen,
});
