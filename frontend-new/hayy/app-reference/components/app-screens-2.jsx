// Hayy minimal screens — part 2: Inbox (messages), Activity, Profile.
// Uses Card/Meta from app-screens-1 + shell from app-shell.

// ════════════════════════ INBOX (messages) ════════════════════════
const threads = [
  { n: "Maya Nasrallah", co: "AWS", msg: "Loved your question tonight — let's talk referral.", t: "2m", unread: 2, tone: "clay", on: true },
  { n: "Layla Park", co: "Figma", msg: "Sending your portfolio to our recruiter 🤝", t: "1h", unread: 0, tone: "olive" },
  { n: "Hayy", co: "Team", msg: "Your seat for Room 04 is confirmed.", t: "3h", unread: 0, tone: "dark", system: true },
  { n: "Omar Aziz", co: "RBC", msg: "Happy to do a warm intro to the hiring mgr.", t: "Yesterday", unread: 0, tone: "sand" },
  { n: "Priya Shah", co: "Stripe", msg: "You: Thank you — that means a lot.", t: "Mon", unread: 0, tone: "clay" },
];

const InboxScreen = () => {
  const nav = useNav();
  return (
  <AppScreen tab="inbox">
    <ScreenHead eyebrow="WARM INTROS" title="Inbox" trailing={<RoundBtn icon={I.search} onClick={() => nav.go("search")} />} />

    <Card pad={14} onClick={() => nav.go("referrals")} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, cursor: "pointer", background: "color-mix(in oklab, var(--clay) 8%, var(--paper))", borderColor: "color-mix(in oklab, var(--clay) 22%, var(--line))" }}>
      <span style={{ width: 38, height: 38, borderRadius: 12, background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        {React.cloneElement(I.shake, { size: 19 })}
      </span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 600 }}>2 referrals in motion</p>
        <Meta>Maya & Layla are connecting you</Meta>
      </div>
      {React.cloneElement(I.arrow, { size: 18 })}
    </Card>

    <div style={{ display: "flex", flexDirection: "column" }}>
      {threads.map((t, i) => (
        <div key={i} onClick={() => nav.go("thread")} style={{
          display: "flex", gap: 13, alignItems: "center", padding: "13px 4px", cursor: "pointer",
          borderBottom: i < threads.length - 1 ? "1px solid var(--line-soft)" : "none",
        }}>
          <div style={{ position: "relative", flex: "none" }}>
            {t.system
              ? <span style={{ width: 46, height: 46, borderRadius: 14, background: "var(--ink)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}><HayyMark size={0.4} color="var(--paper)" /></span>
              : <Avatar name={t.n} size={46} tone={t.tone} />}
            {t.on && <span style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: 99, background: "#3fb98a", border: "2px solid var(--paper)" }} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <p style={{ fontSize: 15, fontWeight: t.unread ? 700 : 600 }}>{t.n}</p>
              <Meta>{t.t}</Meta>
            </div>
            <p style={{
              fontSize: 13.5, color: t.unread ? "var(--ink)" : "var(--ink-mute)",
              fontWeight: t.unread ? 500 : 400, marginTop: 3, overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{t.msg}</p>
          </div>
          {t.unread > 0 && <span style={{ flex: "none", minWidth: 19, height: 19, padding: "0 5px", borderRadius: 99, background: "var(--clay)", color: "var(--paper)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.unread}</span>}
        </div>
      ))}
    </div>
  </AppScreen>
  );
};

// ════════════════════════ ACTIVITY ════════════════════════
const activity = [
  { who: "Maya Nasrallah", act: "invited you to speak in", obj: "Room 04", t: "2m", tone: "clay", icon: I.mic, accent: true },
  { who: "Layla Park", act: "wants to connect you with a recruiter", obj: "", t: "1h", tone: "olive", icon: I.shake, accent: true },
  { who: "Jenna Sun", act: "reacted to your question", obj: "", t: "3h", tone: "dark", icon: I.heart },
  { who: "Omar Aziz", act: "started following you", obj: "", t: "5h", tone: "sand", icon: I.users },
  { who: "Rashid Khoury", act: "is hosting", obj: "New grad → first eng role", t: "Yesterday", tone: "clay", icon: I.mic },
];

const ActivityScreen = () => (
  <AppScreen tab="activity">
    <ScreenHead eyebrow="ACTIVITY" title="Recent" />
    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", color: "var(--ink-mute)", marginBottom: 12 }}>TODAY</p>
    <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingBottom: 16 }}>
      {activity.map((a, i) => (
        <div key={i} style={{
          display: "flex", gap: 13, alignItems: "center", padding: "12px 12px",
          borderRadius: 16,
          background: a.accent ? "color-mix(in oklab, var(--clay) 7%, var(--paper))" : "transparent",
          border: a.accent ? "1px solid color-mix(in oklab, var(--clay) 18%, var(--line))" : "1px solid transparent",
        }}>
          <div style={{ position: "relative", flex: "none" }}>
            <Avatar name={a.who} size={44} tone={a.tone} />
            <span style={{
              position: "absolute", bottom: -3, right: -3, width: 21, height: 21, borderRadius: 99,
              background: a.accent ? "var(--clay)" : "var(--ink)", color: "var(--paper)",
              border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>{React.cloneElement(a.icon, { size: 11 })}</span>
          </div>
          <p style={{ flex: 1, fontSize: 14, lineHeight: 1.35 }}>
            <b>{a.who}</b> <span style={{ color: "var(--ink-soft)" }}>{a.act}</span>
            {a.obj && <b> {a.obj}</b>}
            <span style={{ color: "var(--ink-mute)", fontSize: 12 }}> · {a.t}</span>
          </p>
          {a.accent && <Btn kind="primary" size="md" style={{ flex: "none" }}>{i === 0 ? "Accept" : "View"}</Btn>}
        </div>
      ))}
    </div>
  </AppScreen>
);

// ════════════════════════ PROFILE (You) ════════════════════════
const ProfileScreen = () => {
  const nav = useNav();
  const menuRoutes = ["wins", "schedule", "referrals", "saved", "invite"];
  return (
  <AppScreen tab="you">
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 6 }}>
      <RoundBtn onClick={() => nav.go("invite")} icon={React.cloneElement(I.link, { size: 17 })} />
      <RoundBtn onClick={() => nav.go("settings")} icon={React.cloneElement(I.gear, { size: 18 })} />
    </div>

    {/* identity */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 20 }}>
      <Avatar name="Adam Saleh" size={92} tone="clay" />
      <h1 style={{ fontSize: 27, marginTop: 14 }}>Adam Saleh</h1>
      <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 4 }}>Aspiring PM · ex-Growth</p>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8, color: "var(--ink-mute)" }}>
        {React.cloneElement(I.pin, { size: 13 })}<span style={{ fontSize: 13 }}>Toronto, Canada</span>
      </div>
      <div style={{ display: "flex", gap: 9, marginTop: 18, width: "100%" }}>
        <Btn kind="primary" size="lg" onClick={() => nav.go("editProfile")} style={{ flex: 1, justifyContent: "center" }}>Edit profile</Btn>
        <Btn kind="soft" size="lg" icon={I.link} onClick={() => nav.go("invite")} style={{ flex: "none" }}>Share</Btn>
      </div>
    </div>

    {/* stats */}
    <Card style={{ display: "flex", justifyContent: "space-around", marginBottom: 12, padding: "16px 0" }}>
      {[["18", "ROOMS"], ["6", "INTROS"], ["3", "REFERRALS"], ["214", "FOLLOWERS"]].map(([n, l]) => (
        <div key={l} onClick={() => l === "FOLLOWERS" && nav.go("follows")} style={{ textAlign: "center", cursor: l === "FOLLOWERS" ? "pointer" : "default" }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 24, lineHeight: 1 }}>{n}</div>
          <Meta>{l}</Meta>
        </div>
      ))}
    </Card>

    {/* progress nudge */}
    <Card onClick={() => nav.go("editProfile")} style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 22, cursor: "pointer" }}>
      <div style={{ position: "relative", width: 44, height: 44, flex: "none" }}>
        <svg width="44" height="44" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="19" fill="none" stroke="var(--line)" strokeWidth="4" />
          <circle cx="22" cy="22" r="19" fill="none" stroke="var(--clay)" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 19 * 0.7} ${2 * Math.PI * 19}`} transform="rotate(-90 22 22)" />
        </svg>
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>70%</span>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 600 }}>Complete your profile</p>
        <Meta>Add your goals to get better intros</Meta>
      </div>
      {React.cloneElement(I.arrow, { size: 18 })}
    </Card>

    <RichProfileBody data={MY_PROFILE} />

    {/* menu */}
    <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingBottom: 16 }}>
      {[
        { icon: I.spark, label: "Your journey", note: "Outcomes" },
        { icon: I.cal, label: "Your schedule", note: "2 upcoming" },
        { icon: I.shake, label: "Referrals", note: "3 active" },
        { icon: I.spark, label: "Saved rooms", note: "" },
        { icon: I.users, label: "Invite friends", note: "" },
      ].map((m, i) => (
        <div key={i} onClick={() => nav.go(menuRoutes[i])} style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 6px", cursor: "pointer", borderBottom: "1px solid var(--line-soft)" }}>
          <span style={{ width: 36, height: 36, borderRadius: 11, background: "var(--cream)", border: "1px solid var(--line)", color: "var(--clay)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            {React.cloneElement(m.icon, { size: 17 })}
          </span>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{m.label}</span>
          {m.note && <Meta>{m.note}</Meta>}
          {React.cloneElement(I.arrow, { size: 16 })}
        </div>
      ))}
    </div>
  </AppScreen>
  );
};

Object.assign(window, { InboxScreen, ActivityScreen, ProfileScreen });
