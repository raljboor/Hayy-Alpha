// Hayy minimal screens — part 4: Schedule, Refer, Referrals pipeline,
// Room Recap, Settings, Onboarding. Same minimal language.

// Small labeled field block
const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 8, letterSpacing: ".01em" }}>{label}</p>
    {children}
  </div>
);
const Input = ({ value, placeholder, big }) => (
  <div style={{
    padding: big ? "14px 16px" : "12px 16px", borderRadius: 14,
    background: "var(--paper)", border: "1px solid var(--line)",
    fontSize: big ? 18 : 15, color: value ? "var(--ink)" : "var(--ink-mute)",
    fontFamily: big ? "var(--display)" : "var(--body)",
  }}>{value || placeholder}</div>
);

// ════════════════════════ SCHEDULE A ROOM ════════════════════════
const ScheduleScreen = () => {
  const nav = useNav();
  const [when, setWhen] = React.useState("now");
  const now = when === "now";
  return (
  <DrillScreen
    title="Start a room"
    eyebrow="HOST"
    footer={now
      ? <Btn kind="primary" size="xl" icon={I.mic} onClick={() => nav.go("hostRoom")} style={{ width: "100%", justifyContent: "center" }}>Go live now</Btn>
      : <Btn kind="primary" size="xl" iconRight={I.arrow} onClick={() => nav.go("scheduled")} style={{ width: "100%", justifyContent: "center" }}>Schedule room</Btn>}>
    <div style={{ paddingTop: 10, paddingBottom: 12 }}>
      {/* when — start now or schedule for later */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "var(--cream)", borderRadius: 12, padding: 3 }}>
        {[["now", "Start now"], ["later", "Schedule"]].map(([v, l]) => (
          <button key={v} onClick={() => setWhen(v)} style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 600, fontFamily: "var(--body)",
            background: when === v ? "var(--paper)" : "transparent",
            color: when === v ? "var(--ink)" : "var(--ink-soft)",
            boxShadow: when === v ? "var(--shadow-soft)" : "none",
          }}>{l}</button>
        ))}
      </div>

      <Field label="Title">
        <Input big value="" placeholder="What's the conversation?" />
      </Field>
      <Field label="Topic">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Product", "Engineering", "Design", "Data", "Recruiting"].map((t, i) => (
            <span key={t} className="hy-pill" style={{
              textTransform: "none", letterSpacing: 0, fontSize: 13,
              background: i === 0 ? "var(--clay)" : "var(--paper)",
              color: i === 0 ? "var(--paper)" : "var(--ink-soft)",
              border: i === 0 ? "none" : "1px solid var(--line)",
            }}>{t}</span>
          ))}
        </div>
      </Field>
      {now ? (
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 16px", borderRadius: 14, background: "color-mix(in oklab, var(--clay) 8%, var(--paper))", border: "1px solid color-mix(in oklab, var(--clay) 22%, var(--line))", marginBottom: 16 }}>
          <span className="hy-livedot" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Opens the moment you go live</p>
            <Meta>Followers get pinged it just started</Meta>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}><Field label="Date"><Input value="Tonight" placeholder="Pick" /></Field></div>
          <div style={{ flex: 1 }}><Field label="Time"><Input value="7:00 PM" placeholder="Pick" /></Field></div>
        </div>
      )}
      <Field label="Co-hosts">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {["Rashid K", "Jenna S"].map((n, i) => (
            <Avatar key={i} name={n} size={38} tone={["dark", "olive"][i]} />
          ))}
          <span style={{ width: 38, height: 38, borderRadius: 999, border: "1.5px dashed var(--line)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-mute)" }}>
            {React.cloneElement(I.plus, { size: 16 })}
          </span>
        </div>
      </Field>
      <Field label="Visibility">
        <Card pad={0} style={{ overflow: "hidden" }}>
          {[["Open to everyone", true], ["Invite only", false]].map(([l, on], i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: i === 0 ? "1px solid var(--line-soft)" : "none" }}>
              <span style={{ fontSize: 14.5 }}>{l}</span>
              <span style={{ width: 20, height: 20, borderRadius: 999, border: on ? "6px solid var(--clay)" : "2px solid var(--line)" }} />
            </div>
          ))}
        </Card>
      </Field>
    </div>
  </DrillScreen>
  );
};

// ════════════════════════ REFER SOMEONE (compose) ════════════════
const ReferComposeScreen = () => {
  const nav = useNav();
  return (
  <DrillScreen
    title="Refer someone"
    eyebrow="WARM INTRO"
    footer={<Btn kind="primary" size="xl" iconRight={I.shake} onClick={() => nav.go("referrals")} style={{ width: "100%", justifyContent: "center" }}>Send referral</Btn>}>
    <div style={{ paddingTop: 10, paddingBottom: 12 }}>
      <Field label="Who are you referring?">
        <Card pad={12} style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Avatar name="Adam Saleh" size={40} tone="clay" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14.5, fontWeight: 600 }}>Adam Saleh</p>
            <Meta>Aspiring PM · Toronto</Meta>
          </div>
          {React.cloneElement(I.check, { size: 18 })}
        </Card>
      </Field>
      <Field label="For which role / team?">
        <Input value="" placeholder="e.g. APM, AWS" />
      </Field>
      <Field label="To whom?">
        <Card pad={12} style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Avatar name="Sarah Chen" size={40} tone="olive" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14.5, fontWeight: 600 }}>Sarah Chen</p>
            <Meta>Recruiter · AWS</Meta>
          </div>
          {React.cloneElement(I.check, { size: 18 })}
        </Card>
      </Field>
      <Field label="Add a note">
        <div style={{ padding: "14px 16px", borderRadius: 14, background: "var(--paper)", border: "1px solid var(--line)", fontSize: 14.5, lineHeight: 1.5, color: "var(--ink-soft)", minHeight: 96 }}>
          Adam asked a brilliant question in my room tonight on product sense. Sharp, curious, and genuinely kind — worth 20 minutes of your time.
        </div>
      </Field>
    </div>
  </DrillScreen>
  );
};

// ════════════════════════ REFERRALS PIPELINE ════════════════════════
const lanes = [
  { s: "In motion", c: "var(--clay)", items: [
    { who: "Sarah Chen", role: "APM · AWS", via: "via Maya", tone: "olive", step: "Recruiter reviewing" },
    { who: "Tom Reyes", role: "SWE · Shopify", via: "via Layla", tone: "dark", step: "Intro sent" },
  ] },
  { s: "Replied", c: "#3fb98a", items: [
    { who: "Dana Liu", role: "Design · Figma", via: "via Priya", tone: "clay", step: "Call booked Thu" },
  ] },
  { s: "Landed", c: "var(--ink-mute)", items: [
    { who: "You", role: "joined Stripe", via: "via Omar", tone: "sand", step: "Mar '26" },
  ] },
];

const ReferralsScreen = () => {
  const nav = useNav();
  return (
  <AppScreen tab="you">
    <ScreenHead eyebrow="PIPELINE" title="Referrals" trailing={<RoundBtn icon={React.cloneElement(I.plus, { size: 18 })} onClick={() => nav.go("refer")} />} />
    <div style={{ display: "flex", flexDirection: "column", gap: 22, paddingBottom: 16 }}>
      {lanes.map((lane) => (
        <div key={lane.s}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: lane.c }} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".04em" }}>{lane.s}</span>
            <Meta>{lane.items.length}</Meta>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {lane.items.map((it, i) => (
              <Card key={i} onClick={() => nav.go("referralDetail")} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <Avatar name={it.who} size={42} tone={it.tone} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{it.who}</p>
                  <Meta>{it.role} · {it.via}</Meta>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: lane.c }}>{it.step}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  </AppScreen>
  );
};

// ════════════════════════ ROOM RECAP (post-room) ════════════════════
const recapClips = [
  { t: "On telling a product story", who: "Maya", len: "0:42" },
  { t: "The one question to always ask", who: "Rashid", len: "1:05" },
];

const RecapScreen = () => {
  const nav = useNav();
  return (
  <DrillScreen
    title="Recap"
    eyebrow="ROOM 04 · ENDED"
    action={<RoundBtn icon={React.cloneElement(I.link, { size: 16 })} />}
    wash
    footer={<Btn kind="primary" size="xl" icon={I.shake} onClick={() => nav.go("thread")} style={{ width: "100%", justifyContent: "center" }}>Follow up with 3 people</Btn>}>
    <div style={{ paddingTop: 8, paddingBottom: 12 }}>
      <h1 style={{ fontSize: 26, lineHeight: 1.1, marginBottom: 8 }}>Breaking into Product at Big&nbsp;Tech</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <Meta>58 MIN</Meta><Meta>·</Meta><Meta>42 ATTENDED</Meta><Meta>·</Meta><Meta>9 SPOKE</Meta>
      </div>

      {/* people you met */}
      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-mute)", marginBottom: 12 }}>PEOPLE YOU MET</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 26 }}>
        {[["Maya Nasrallah", "Sr PM · AWS", "clay"], ["Rashid Khoury", "Eng Mgr · Amazon", "dark"], ["Jenna Sun", "Talent · Shopify", "olive"]].map(([n, r, t], i) => (
          <Card key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={n} size={40} tone={t} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14.5, fontWeight: 600 }}>{n}</p>
              <Meta>{r}</Meta>
            </div>
            <Btn kind="soft" size="md" icon={I.msg} onClick={() => nav.go("thread")}>Say hi</Btn>
          </Card>
        ))}
      </div>

      {/* highlight clips */}
      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-mute)", marginBottom: 12 }}>HIGHLIGHTS</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, paddingBottom: 8 }}>
        {recapClips.map((c, i) => (
          <Card key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <Icon d="M8 5v14l11-7z" size={16} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{c.t}</p>
              <Meta>{c.who}</Meta>
            </div>
            <Meta>{c.len}</Meta>
          </Card>
        ))}
      </div>
    </div>
  </DrillScreen>
  );
};

// ════════════════════════ SETTINGS ════════════════════════
const settingsGroups = [
  { h: "ACCOUNT", rows: [
    { icon: I.users, label: "Edit profile" },
    { icon: I.bell, label: "Notifications", note: "On" },
    { icon: I.lock, label: "Privacy" },
  ] },
  { h: "PREFERENCES", rows: [
    { icon: I.mic, label: "Audio & video" },
    { icon: I.spark, label: "Interests", note: "6" },
    { icon: I.shake, label: "Referral settings" },
  ] },
  { h: "SUPPORT", rows: [
    { icon: I.msg, label: "Help & feedback" },
    { icon: I.link, label: "Invite friends" },
  ] },
];

const Toggle = ({ on }) => (
  <span style={{ width: 42, height: 24, borderRadius: 999, background: on ? "var(--clay)" : "var(--line)", position: "relative", flex: "none" }}>
    <span style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: 999, background: "#fff", transition: "left .15s" }} />
  </span>
);

const SettingsScreen = () => {
  const nav = useNav();
  const routes = { "Edit profile": "editProfile", "Notifications": "notifs", "Privacy": "privacy", "Invite friends": "invite" };
  return (
  <DrillScreen title="Settings" eyebrow="">
    <div style={{ paddingTop: 8, paddingBottom: 16 }}>
      {/* identity row */}
      <Card style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 24 }}>
        <Avatar name="Adam Saleh" size={52} tone="clay" />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 600 }}>Adam Saleh</p>
          <Meta>adam@hayy.app</Meta>
        </div>
        {React.cloneElement(I.arrow, { size: 18 })}
      </Card>

      {/* quiet hours toggle highlight */}
      <Card style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{ width: 38, height: 38, borderRadius: 11, background: "var(--cream)", border: "1px solid var(--line)", color: "var(--clay)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          {React.cloneElement(I.bell, { size: 17 })}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14.5, fontWeight: 600 }}>Room reminders</p>
          <Meta>15 min before start</Meta>
        </div>
        <Toggle on />
      </Card>

      {settingsGroups.map((g) => (
        <div key={g.h} style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", color: "var(--ink-mute)", marginBottom: 8, paddingLeft: 4 }}>{g.h}</p>
          <Card pad={0} style={{ overflow: "hidden" }}>
            {g.rows.map((r, i) => (
              <div key={r.label} onClick={() => routes[r.label] && nav.go(routes[r.label])} style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 15px", cursor: routes[r.label] ? "pointer" : "default", borderBottom: i < g.rows.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
                <span style={{ color: "var(--ink-soft)", flex: "none", display: "flex" }}>{React.cloneElement(r.icon, { size: 18 })}</span>
                <span style={{ flex: 1, fontSize: 15 }}>{r.label}</span>
                {r.note && <Meta>{r.note}</Meta>}
                {React.cloneElement(I.arrow, { size: 15 })}
              </div>
            ))}
          </Card>
        </div>
      ))}

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--clay)", fontWeight: 600, padding: "8px 0 4px" }}>Sign out</p>
      <p style={{ textAlign: "center", fontSize: 11, color: "var(--ink-mute)" }}>Hayy v2.4.0</p>
    </div>
  </DrillScreen>
  );
};

// ════════════════════════ ONBOARDING (multi-step) ════════════════════
// One screen, three quiet steps shown as a progress + the "interests" step.
const interestChips = ["Product", "Engineering", "Design", "Data", "Recruiting", "Fintech", "AI / ML", "Startups", "New grad", "Career switch"];

const OnboardingScreen = () => {
  const nav = useNav();
  return (
  <div className="hy" style={{
    position: "relative", width: "100%", height: "100%", overflow: "hidden",
    display: "flex", flexDirection: "column", background: "var(--bg)", fontFamily: "var(--body)",
  }}>
    <Wash />
    {/* progress */}
    <div style={{ position: "relative", zIndex: 2, paddingTop: SAFE_TOP, padding: `${SAFE_TOP}px 22px 0`, display: "flex", alignItems: "center", gap: 8 }}>
      {[1, 1, 0].map((on, i) => (
        <span key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: on ? "var(--clay)" : "var(--line)" }} />
      ))}
      <span style={{ marginLeft: 8, fontSize: 13, color: "var(--clay)", fontWeight: 600, cursor: "pointer" }} onClick={() => nav.go("home")}>Skip</span>
    </div>

    <div style={{ position: "relative", zIndex: 2, flex: 1, minHeight: 0, overflowY: "auto", padding: "26px 22px 0" }}>
      <p className="mono" style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--clay)", marginBottom: 12 }}>STEP 2 OF 3</p>
      <h1 style={{ fontSize: 32, lineHeight: 1.05, marginBottom: 10 }}>
        What are you <span className="display-italic">into?</span>
      </h1>
      <p style={{ fontSize: 15, color: "var(--ink-soft)", marginBottom: 26, maxWidth: 320 }}>
        Pick a few topics. We'll fill your rooms with the right people and conversations.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {interestChips.map((c, i) => {
          const on = [0, 2, 8].includes(i);
          return (
            <span key={c} className="hy-pill" style={{
              textTransform: "none", letterSpacing: 0, fontSize: 14, padding: "10px 16px",
              background: on ? "var(--clay)" : "var(--paper)",
              color: on ? "var(--paper)" : "var(--ink-soft)",
              border: on ? "none" : "1px solid var(--line)",
              display: "inline-flex", alignItems: "center", gap: 7,
            }}>{on && React.cloneElement(I.check, { size: 13 })}{c}</span>
          );
        })}
      </div>
    </div>

    <div style={{ position: "relative", zIndex: 2, flex: "none", padding: "16px 22px 34px" }}>
      <Btn kind="primary" size="xl" iconRight={I.arrow} onClick={() => nav.go("home")} style={{ width: "100%", justifyContent: "center" }}>Continue</Btn>
    </div>
  </div>
  );
};

Object.assign(window, { ScheduleScreen, ReferComposeScreen, ReferralsScreen, RecapScreen, SettingsScreen, OnboardingScreen, Field, Input, Toggle });
