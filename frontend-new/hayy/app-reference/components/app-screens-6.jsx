// Hayy minimal screens — part 6: states, auth steps & settings sub-pages.
// Email login · Verify code · Empty inbox · Live Room (you're speaking) ·
// Edit Profile · Notifications · Privacy · Invite Friends · Saved Rooms.

// ── shared auth shell (logo top, like the Entry) ──
const AuthShell = ({ children, footer, onBack, brandColor = "var(--clay)" }) => (
  <div className="hy" style={{
    position: "relative", width: "100%", height: "100%", overflow: "hidden",
    display: "flex", flexDirection: "column", background: "var(--bg)", fontFamily: "var(--body)",
  }}>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(140% 70% at 50% -10%, color-mix(in oklab, var(--clay) 12%, var(--bg)) 0%, var(--bg) 50%)" }} />
    <div style={{ position: "relative", zIndex: 2, paddingTop: SAFE_TOP - 8, padding: `${SAFE_TOP - 8}px 16px 0` }}>
      <RoundBtn icon={<Chevron />} onClick={onBack} />
    </div>
    <div style={{ position: "relative", zIndex: 2, flex: 1, minHeight: 0, overflowY: "auto", padding: "26px 28px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: 60, height: 60, borderRadius: 18, background: "var(--paper)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 26, boxShadow: "var(--shadow-warm, 0 14px 40px -16px rgba(80,40,20,.3))" }}>
        <HayyMark size={0.46} color={brandColor} />
      </div>
      {children}
    </div>
    {footer && <div style={{ position: "relative", zIndex: 2, flex: "none", padding: "16px 28px 34px" }}>{footer}</div>}
  </div>
);

// ════════════════════════ EMAIL LOGIN ════════════════════════
const EmailLoginScreen = ({ brandColor }) => {
  const nav = useNav();
  return (
  <AuthShell brandColor={brandColor} onBack={() => nav.back()}
    footer={<Btn kind="primary" size="xl" iconRight={I.arrow} onClick={() => nav.go("verify")} style={{ width: "100%", justifyContent: "center" }}>Continue</Btn>}>
    <h1 style={{ fontSize: 28, textAlign: "center", lineHeight: 1.1, marginBottom: 10 }}>What's your email?</h1>
    <p style={{ fontSize: 15, color: "var(--ink-soft)", textAlign: "center", marginBottom: 30, maxWidth: 280 }}>
      We'll send a 6-digit code. No passwords to remember.
    </p>
    <div style={{ width: "100%", padding: "16px 18px", borderRadius: 14, background: "var(--paper)", border: "1.5px solid var(--clay)", fontSize: 17, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ color: "var(--ink)" }}>adam@</span>
      <span style={{ width: 2, height: 22, background: "var(--clay)", display: "inline-block", animation: "none" }} />
    </div>
    <p style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 16, textAlign: "center" }}>By continuing you agree to our Terms & Privacy.</p>
  </AuthShell>
  );
};

// ════════════════════════ VERIFY CODE ════════════════════════
const VerifyCodeScreen = ({ brandColor }) => {
  const nav = useNav();
  return (
  <AuthShell brandColor={brandColor} onBack={() => nav.back()}
    footer={
      <div style={{ textAlign: "center" }}>
        <Btn kind="primary" size="xl" iconRight={I.arrow} onClick={() => nav.go("onboarding")} style={{ width: "100%", justifyContent: "center" }}>Verify</Btn>
        <p style={{ fontSize: 13, color: "var(--ink-mute)", marginTop: 14 }}>Resend code in <b style={{ color: "var(--ink-soft)" }}>0:24</b></p>
      </div>
    }>
    <h1 style={{ fontSize: 28, textAlign: "center", lineHeight: 1.1, marginBottom: 10 }}>Check your email</h1>
    <p style={{ fontSize: 15, color: "var(--ink-soft)", textAlign: "center", marginBottom: 32, maxWidth: 280 }}>
      We sent a code to <b style={{ color: "var(--ink)" }}>adam@hayy.app</b>
    </p>
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      {["4", "1", "9", "", "", ""].map((d, i) => (
        <div key={i} style={{
          width: 46, height: 56, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--display)", fontSize: 26,
          background: "var(--paper)",
          border: i === 3 ? "1.5px solid var(--clay)" : "1px solid var(--line)",
          color: "var(--ink)",
        }}>{d}{i === 3 && <span style={{ width: 2, height: 26, background: "var(--clay)" }} />}</div>
      ))}
    </div>
  </AuthShell>
  );
};

// ════════════════════════ EMPTY INBOX (state) ════════════════════════
const EmptyInboxScreen = () => {
  const nav = useNav();
  return (
  <AppScreen tab="inbox">
    <ScreenHead eyebrow="WARM INTROS" title="Inbox" trailing={<RoundBtn icon={I.search} onClick={() => nav.go("search")} />} />
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 70, paddingLeft: 20, paddingRight: 20 }}>
      <div style={{ width: 84, height: 84, borderRadius: 26, background: "var(--cream)", border: "1px solid var(--line)", color: "var(--clay)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
        {React.cloneElement(I.msg, { size: 34 })}
      </div>
      <h2 style={{ fontSize: 23, marginBottom: 10 }}>No intros yet</h2>
      <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.5, marginBottom: 26, maxWidth: 260 }}>
        Conversations start in the rooms. Drop into one tonight — the warm intros follow.
      </p>
      <Btn kind="primary" size="lg" iconRight={I.arrow} onClick={() => nav.go("rooms")}>Find a room</Btn>
    </div>
  </AppScreen>
  );
};

// ════════════════════════ LIVE ROOM — you're speaking ════════════════
const stageSpeakers = [
  { n: "Maya Nasrallah", r: "Host · AWS", tone: "clay" },
  { n: "You", r: "Speaking", tone: "olive", you: true, talking: true },
  { n: "Rashid Khoury", r: "Amazon", tone: "dark" },
];

const LiveRoomSpeakingScreen = () => (
  <div className="hy" data-palette="dusk" style={{
    position: "relative", width: "100%", height: "100%", overflow: "hidden",
    display: "flex", flexDirection: "column", background: "var(--bg)", fontFamily: "var(--body)",
  }}>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(90% 50% at 50% 24%, color-mix(in oklab, var(--clay) 22%, var(--bg)) 0%, var(--bg) 70%)" }} />

    <div style={{ position: "relative", zIndex: 2, paddingTop: SAFE_TOP, paddingLeft: 20, paddingRight: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <RoundBtn icon={<Chevron />} />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><span className="hy-livedot" /><Meta>LIVE · 42 HERE</Meta></div>
      <RoundBtn icon={React.cloneElement(I.more, { size: 18 })} />
    </div>

    {/* "you're on" banner */}
    <div style={{ position: "relative", zIndex: 2, margin: "16px 22px 0", padding: "12px 16px", borderRadius: 14, background: "color-mix(in oklab, var(--clay) 18%, var(--bg))", border: "1px solid color-mix(in oklab, var(--clay) 40%, transparent)", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 30, height: 30, borderRadius: 10, background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{React.cloneElement(I.mic, { size: 15 })}</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 600 }}>You're on stage</p>
        <Meta>Maya invited you up — go ahead</Meta>
      </div>
    </div>

    <div style={{ position: "relative", zIndex: 2, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, padding: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "22px 18px", maxWidth: 320 }}>
        {stageSpeakers.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 92 }}>
            <div style={{ position: "relative", borderRadius: 999, padding: 3, background: s.talking ? "var(--clay)" : "transparent", boxShadow: s.talking ? "0 0 0 4px color-mix(in oklab, var(--clay) 24%, transparent)" : "none" }}>
              <Avatar name={s.n} size={s.you ? 84 : 64} tone={s.tone} />
              {(s.you || s.r.startsWith("Host")) && (
                <span style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: 999, background: "var(--clay)", color: "var(--paper)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>{React.cloneElement(I.mic, { size: 12 })}</span>
              )}
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{s.n.split(" ")[0]}</p>
              <p style={{ fontSize: 11, color: s.you ? "var(--clay)" : "var(--ink-mute)", fontWeight: s.you ? 600 : 400 }}>{s.r}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ position: "relative", zIndex: 2, flex: "none", padding: "16px 22px 34px", display: "flex", alignItems: "center", gap: 12 }}>
      <button style={{ height: 54, flex: 1, borderRadius: 18, background: "var(--clay)", color: "var(--paper)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, fontSize: 15, fontWeight: 600 }}>
        {React.cloneElement(I.mic, { size: 20 })}Mic on
      </button>
      <button style={{ height: 54, minWidth: 54, borderRadius: 18, background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center" }}>{React.cloneElement(I.hand2, { size: 22 })}</button>
      <button style={{ height: 54, minWidth: 54, borderRadius: 18, background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center" }}>{React.cloneElement(I.heart, { size: 22 })}</button>
    </div>
  </div>
);

// ════════════════════════ EDIT PROFILE ════════════════════════
const EditProfileScreen = () => (
  <DrillScreen
    title="Edit profile"
    eyebrow=""
    action={<span style={{ fontSize: 15, fontWeight: 600, color: "var(--clay)" }}>Save</span>}>
    <div style={{ paddingTop: 8, paddingBottom: 16 }}>
      {/* avatar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 26 }}>
        <div style={{ position: "relative" }}>
          <Avatar name="Adam Saleh" size={88} tone="clay" />
          <span style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 30, borderRadius: 999, background: "var(--clay)", color: "var(--paper)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>{React.cloneElement(I.plus, { size: 15 })}</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--clay)", fontWeight: 600, marginTop: 12 }}>Change photo</p>
      </div>

      <Field label="Name"><Input value="Adam Saleh" placeholder="Your name" /></Field>
      <Field label="Headline"><Input value="Aspiring PM · ex-Growth" placeholder="One line about you" /></Field>
      <Field label="About">
        <div style={{ padding: "14px 16px", borderRadius: 14, background: "var(--paper)", border: "1px solid var(--line)", fontSize: 14.5, lineHeight: 1.5, color: "var(--ink-soft)", minHeight: 80 }}>
          Two years into a marketing role, working toward product. Curious about fintech and how great teams ship.
        </div>
      </Field>
      <Field label="Experience">
        <Card pad={0} style={{ overflow: "hidden" }}>
          {[["Growth Marketing Lead", "Lumen", "2023 — Now", "clay"], ["Marketing Associate", "Brightwave", "2021 — 2023", "olive"]].map(([role, co, dates, tone], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 14px", borderBottom: i === 0 ? "1px solid var(--line-soft)" : "none" }}>
              <Logo name={co} tone={tone} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{role}</p>
                <Meta>{co} · {dates}</Meta>
              </div>
              {React.cloneElement(I.arrow, { size: 15 })}
            </div>
          ))}
        </Card>
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", marginTop: 8, padding: "11px 0", borderRadius: 12, border: "1px dashed var(--line)", background: "transparent", color: "var(--clay)", fontSize: 13.5, fontWeight: 600, fontFamily: "var(--body)", cursor: "pointer" }}>{React.cloneElement(I.plus, { size: 15 })} Add experience</button>
      </Field>
      <Field label="Education">
        <Card pad={0} style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 14px" }}>
            <Logo name="University of Toronto" tone="dark" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600 }}>BCom, Marketing</p>
              <Meta>University of Toronto · 2017 — 2021</Meta>
            </div>
            {React.cloneElement(I.arrow, { size: 15 })}
          </div>
        </Card>
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", marginTop: 8, padding: "11px 0", borderRadius: 12, border: "1px dashed var(--line)", background: "transparent", color: "var(--clay)", fontSize: 13.5, fontWeight: 600, fontFamily: "var(--body)", cursor: "pointer" }}>{React.cloneElement(I.plus, { size: 15 })} Add education</button>
      </Field>
      <Field label="Skills">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Product strategy", "Growth", "SQL", "User research"].map((c) => (
            <span key={c} className="hy-pill" style={{ textTransform: "none", letterSpacing: 0, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>{c}{React.cloneElement(I.closed, { size: 12 })}</span>
          ))}
          <span className="hy-pill" style={{ textTransform: "none", letterSpacing: 0, fontSize: 13, color: "var(--clay)", borderStyle: "dashed", display: "inline-flex", alignItems: "center", gap: 5 }}>{React.cloneElement(I.plus, { size: 12 })}Add</span>
        </div>
      </Field>
      <Field label="Interests">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Product", "Fintech", "New grad"].map((c) => (
            <span key={c} className="hy-pill" style={{ textTransform: "none", letterSpacing: 0, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>{c}{React.cloneElement(I.closed, { size: 12 })}</span>
          ))}
          <span className="hy-pill" style={{ textTransform: "none", letterSpacing: 0, fontSize: 13, color: "var(--clay)", borderStyle: "dashed", display: "inline-flex", alignItems: "center", gap: 5 }}>{React.cloneElement(I.plus, { size: 12 })}Add</span>
        </div>
      </Field>
      <Field label="Links">
        <Card pad={0} style={{ overflow: "hidden" }}>
          {[["LinkedIn", "in/adamsaleh"], ["Portfolio", "adam.work"]].map(([l, v], i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 15px", borderBottom: i === 0 ? "1px solid var(--line-soft)" : "none" }}>
              <span style={{ color: "var(--ink-mute)", display: "flex" }}>{React.cloneElement(I.link, { size: 16 })}</span>
              <span style={{ flex: 1, fontSize: 14 }}>{v}</span>
              <Meta>{l}</Meta>
            </div>
          ))}
        </Card>
      </Field>
    </div>
  </DrillScreen>
);

// ════════════════════════ NOTIFICATIONS SETTINGS ════════════════════
const notifGroups = [
  { h: "ROOMS", rows: [["Room reminders", true], ["New rooms from people you follow", true], ["Room starting soon", false]] },
  { h: "INTROS & REFERRALS", rows: [["New messages", true], ["Referral updates", true], ["Intro requests", true]] },
  { h: "SOCIAL", rows: [["New followers", false], ["Reactions to your questions", true]] },
];

const NotificationsSettingsScreen = () => (
  <DrillScreen title="Notifications" eyebrow="">
    <div style={{ paddingTop: 8, paddingBottom: 16 }}>
      {notifGroups.map((g) => (
        <div key={g.h} style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", color: "var(--ink-mute)", marginBottom: 8, paddingLeft: 4 }}>{g.h}</p>
          <Card pad={0} style={{ overflow: "hidden" }}>
            {g.rows.map(([l, on], i) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i < g.rows.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
                <span style={{ flex: 1, fontSize: 14.5 }}>{l}</span>
                <Toggle on={on} />
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>
  </DrillScreen>
);

// ════════════════════════ PRIVACY ════════════════════════
const PrivacyScreen = () => (
  <DrillScreen title="Privacy" eyebrow="">
    <div style={{ paddingTop: 8, paddingBottom: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", color: "var(--ink-mute)", marginBottom: 8, paddingLeft: 4 }}>VISIBILITY</p>
      <Card pad={0} style={{ overflow: "hidden", marginBottom: 22 }}>
        {[["Show me in search", true], ["Let hosts see I'm in a room", true], ["Open to referrals", true], ["Show my company", false]].map(([l, on], i, arr) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
            <span style={{ flex: 1, fontSize: 14.5 }}>{l}</span>
            <Toggle on={on} />
          </div>
        ))}
      </Card>

      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", color: "var(--ink-mute)", marginBottom: 8, paddingLeft: 4 }}>WHO CAN MESSAGE YOU</p>
      <Card pad={0} style={{ overflow: "hidden", marginBottom: 22 }}>
        {[["Everyone", false], ["People from my rooms", true], ["Connections only", false]].map(([l, on], i, arr) => (
          <div key={l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
            <span style={{ fontSize: 14.5 }}>{l}</span>
            <span style={{ width: 20, height: 20, borderRadius: 999, border: on ? "6px solid var(--clay)" : "2px solid var(--line)" }} />
          </div>
        ))}
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {["Blocked accounts", "Download my data", "Delete account"].map((l, i) => (
          <div key={l} style={{ display: "flex", alignItems: "center", padding: "14px 6px", borderBottom: i < 2 ? "1px solid var(--line-soft)" : "none" }}>
            <span style={{ flex: 1, fontSize: 15, color: l === "Delete account" ? "#c0492f" : "var(--ink)" }}>{l}</span>
            {React.cloneElement(I.arrow, { size: 15 })}
          </div>
        ))}
      </div>
    </div>
  </DrillScreen>
);

// ════════════════════════ INVITE FRIENDS ════════════════════════
const invited = [
  { n: "Dana Liu", s: "Joined", tone: "clay" },
  { n: "Tom Reyes", s: "Invited", tone: "dark" },
];

const InviteFriendsScreen = () => (
  <DrillScreen title="Invite friends" eyebrow="" wash>
    <div style={{ paddingTop: 8, paddingBottom: 16 }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div style={{ width: 72, height: 72, borderRadius: 22, background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", boxShadow: "0 14px 36px -12px color-mix(in oklab, var(--clay) 70%, transparent)" }}>{React.cloneElement(I.shake, { size: 32 })}</div>
        <h2 style={{ fontSize: 24, lineHeight: 1.1, marginBottom: 10 }}>Bring someone in</h2>
        <p style={{ fontSize: 15, color: "var(--ink-soft)", maxWidth: 270, margin: "0 auto" }}>Careers grow faster together. Invite a friend and you both get priority seats.</p>
      </div>

      {/* code */}
      <Card style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, borderStyle: "dashed" }}>
        <div style={{ flex: 1 }}>
          <Meta>YOUR INVITE LINK</Meta>
          <p style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>hayy.app/adam</p>
        </div>
        <Btn kind="soft" size="md" icon={I.link}>Copy</Btn>
      </Card>
      <Btn kind="primary" size="xl" iconRight={I.arrow} style={{ width: "100%", justifyContent: "center", marginBottom: 26 }}>Share invite</Btn>

      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", color: "var(--ink-mute)", marginBottom: 10, paddingLeft: 2 }}>YOU'VE INVITED</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {invited.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", borderBottom: i < invited.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
            <Avatar name={p.n} size={40} tone={p.tone} />
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{p.n}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: p.s === "Joined" ? "#3fb98a" : "var(--ink-mute)" }}>{p.s}</span>
          </div>
        ))}
      </div>
    </div>
  </DrillScreen>
);

// ════════════════════════ SAVED ROOMS ════════════════════════
const saved = [
  { t: "Referrals, honestly: what works", host: "Priya Shah", co: "Stripe", when: "Thu 6PM", tone: "clay" },
  { t: "From bootcamp to backend", host: "Omar Aziz", co: "RBC", when: "Sat 11AM", tone: "sand" },
  { t: "Negotiating your first offer", host: "Jenna Sun", co: "Shopify", when: "Next wk", tone: "olive" },
];

const SavedRoomsScreen = () => (
  <DrillScreen title="Saved rooms" eyebrow="">
    <div style={{ paddingTop: 8, paddingBottom: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      {saved.map((r, i) => (
        <Card key={i} style={{ display: "flex", gap: 13, alignItems: "center" }}>
          <Avatar name={r.host} size={44} tone={r.tone} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2, marginBottom: 4 }}>{r.t}</p>
            <Meta>{r.host} · {r.co}</Meta>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--clay)" }}>{r.when}</p>
            <span style={{ color: "var(--clay)", display: "inline-flex", marginTop: 4 }}>{React.cloneElement(I.spark, { size: 15 })}</span>
          </div>
        </Card>
      ))}
    </div>
  </DrillScreen>
);

Object.assign(window, {
  EmailLoginScreen, VerifyCodeScreen, EmptyInboxScreen, LiveRoomSpeakingScreen,
  EditProfileScreen, NotificationsSettingsScreen, PrivacyScreen, InviteFriendsScreen, SavedRoomsScreen,
});
