// Hayy minimal screens — part 7: the screens a real v1 still needs.
// Functional: Search Results · Live Room (Host) · 1:1 Call · Follows · Help.
// States & modals: Permission · Report/Block · Reschedule · Offline · Empty Schedule.

// ════════════════════════ SEARCH RESULTS ════════════════════════
const resultTabs = ["All", "Rooms", "People", "Companies"];
const resRooms = [
  { t: "Cracking the PM case interview", host: "Maya Nasrallah", live: true, n: 42, tone: "clay" },
  { t: "How we hire designers at Figma", host: "Layla Park", live: false, n: 28, tone: "olive" },
];
const resPeople = [
  { n: "Maya Nasrallah", r: "Sr PM · AWS", tone: "clay" },
  { n: "Priya Shah", r: "Recruiter · Stripe", tone: "dark" },
];

const SearchResultsScreen = () => {
  const nav = useNav();
  return (
  <AppScreen tab="rooms">
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingTop: 4 }}>
      <RoundBtn icon={<Chevron />} onClick={() => nav.back()} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, padding: "11px 14px", borderRadius: 14, background: "var(--paper)", border: "1px solid var(--line)" }}>
        {React.cloneElement(I.search, { size: 17 })}
        <span style={{ fontSize: 15, color: "var(--ink)" }}>product</span>
        <span style={{ marginLeft: "auto", color: "var(--ink-mute)", fontSize: 13 }}>✕</span>
      </div>
    </div>

    <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 22, paddingBottom: 2 }}>
      {resultTabs.map((c, i) => (
        <span key={c} className="hy-pill" style={{
          flex: "none", padding: "7px 14px", fontSize: 13, letterSpacing: 0, textTransform: "none",
          background: i === 0 ? "var(--clay)" : "var(--paper)",
          color: i === 0 ? "var(--paper)" : "var(--ink-soft)",
          border: i === 0 ? "none" : "1px solid var(--line)",
        }}>{c}</span>
      ))}
    </div>

    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", color: "var(--ink-mute)", marginBottom: 11 }}>ROOMS</p>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
      {resRooms.map((r, i) => (
        <Card key={i} onClick={() => nav.go("roomDetail")} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <Avatar name={r.host} size={42} tone={r.tone} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.2 }}>{r.t}</p>
            <Meta>{r.host} · {r.n} going</Meta>
          </div>
          {r.live ? <LiveTag>Live</LiveTag> : <Meta>TONIGHT</Meta>}
        </Card>
      ))}
    </div>

    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", color: "var(--ink-mute)", marginBottom: 11 }}>PEOPLE</p>
    <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingBottom: 16 }}>
      {resPeople.map((p, i) => (
        <div key={i} onClick={() => nav.go("publicProfile")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", cursor: "pointer", borderBottom: i < resPeople.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
          <Avatar name={p.n} size={42} tone={p.tone} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{p.n}</p>
            <Meta>{p.r}</Meta>
          </div>
          <Btn kind="soft" size="md">Follow</Btn>
        </div>
      ))}
    </div>
  </AppScreen>
  );
};

// ════════════════════════ LIVE ROOM — HOST CONTROLS ════════════════
const stageReqs = [
  { n: "Adam Saleh", r: "Aspiring PM", tone: "clay" },
  { n: "Dana Liu", r: "Design student", tone: "olive" },
];
const onStageHost = [
  { n: "Maya Nasrallah", r: "You · host", tone: "clay", host: true },
  { n: "Rashid Khoury", r: "Amazon", tone: "dark", talking: true },
  { n: "Jenna Sun", r: "Shopify", tone: "olive" },
];

const LiveRoomHostScreen = () => {
  const nav = useNav();
  return (
  <div className="hy" data-palette="dusk" style={{
    position: "relative", width: "100%", height: "100%", overflow: "hidden",
    display: "flex", flexDirection: "column", background: "var(--bg)", fontFamily: "var(--body)",
  }}>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(90% 50% at 50% 18%, color-mix(in oklab, var(--clay) 20%, var(--bg)) 0%, var(--bg) 70%)" }} />

    <div style={{ position: "relative", zIndex: 2, paddingTop: SAFE_TOP, paddingLeft: 20, paddingRight: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><span className="hy-livedot" /><Meta>LIVE · HOSTING</Meta></div>
      <button onClick={() => nav.go("recap")} style={{ fontSize: 13, fontWeight: 700, color: "var(--clay)", background: "color-mix(in oklab, var(--clay) 16%, transparent)", border: "1px solid color-mix(in oklab, var(--clay) 40%, transparent)", borderRadius: 999, padding: "7px 14px", cursor: "pointer" }}>End room</button>
    </div>

    <div style={{ position: "relative", zIndex: 2, padding: "14px 22px 0", textAlign: "center" }}>
      <h2 style={{ fontSize: 20, lineHeight: 1.12 }}>Breaking into Product at Big&nbsp;Tech</h2>
    </div>

    {/* on stage */}
    <div style={{ position: "relative", zIndex: 2, flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 20px 0" }}>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "18px 14px", marginBottom: 24 }}>
        {onStageHost.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: 84 }}>
            <div style={{ borderRadius: 999, padding: 3, background: s.talking ? "var(--clay)" : "transparent", boxShadow: s.talking ? "0 0 0 3px color-mix(in oklab, var(--clay) 22%, transparent)" : "none" }}>
              <Avatar name={s.n} size={62} tone={s.tone} />
            </div>
            <p style={{ fontSize: 12.5, fontWeight: 600 }}>{s.n.split(" ")[0]}</p>
            <p style={{ fontSize: 10.5, color: s.host ? "var(--clay)" : "var(--ink-mute)" }}>{s.r}</p>
          </div>
        ))}
      </div>

      {/* requests to speak */}
      <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          {React.cloneElement(I.hand2, { size: 16 })}
          <span style={{ fontSize: 13.5, fontWeight: 700 }}>Requests to speak</span>
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "var(--clay)", background: "color-mix(in oklab, var(--clay) 14%, transparent)", borderRadius: 999, padding: "2px 8px" }}>{stageReqs.length}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {stageReqs.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 0", borderBottom: i < stageReqs.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
              <Avatar name={p.n} size={38} tone={p.tone} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{p.n}</p>
                <Meta>{p.r}</Meta>
              </div>
              <button style={{ width: 34, height: 34, borderRadius: 11, border: "1px solid var(--line)", background: "transparent", color: "var(--ink-mute)", display: "flex", alignItems: "center", justifyContent: "center" }}>{React.cloneElement(I.closed, { size: 15 })}</button>
              <button style={{ width: 34, height: 34, borderRadius: 11, border: "none", background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>{React.cloneElement(I.check, { size: 16 })}</button>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* host controls */}
    <div style={{ position: "relative", zIndex: 2, flex: "none", padding: "16px 22px 34px", display: "flex", alignItems: "center", gap: 12 }}>
      <button style={hostCtrl(true)}>{React.cloneElement(I.mic, { size: 22 })}</button>
      <button style={{ ...hostCtrl(false), flex: 1, gap: 9, width: "auto" }}>{React.cloneElement(I.users, { size: 20 })}<span style={{ fontSize: 15, fontWeight: 600 }}>Invite</span></button>
      <button style={hostCtrl(false)}>{React.cloneElement(I.more, { size: 22 })}</button>
    </div>
  </div>
  );
};
const hostCtrl = (accent) => ({
  height: 54, minWidth: 54, borderRadius: 18, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  border: "1px solid var(--line)",
  background: accent ? "var(--clay)" : "var(--paper)",
  color: accent ? "var(--paper)" : "var(--ink)",
});

// ════════════════════════ 1:1 CALL ════════════════════════
const CallScreen = () => {
  const nav = useNav();
  return (
  <div className="hy" data-palette="dusk" style={{
    position: "relative", width: "100%", height: "100%", overflow: "hidden",
    display: "flex", flexDirection: "column", background: "var(--bg)", fontFamily: "var(--body)",
  }}>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(80% 50% at 50% 30%, color-mix(in oklab, var(--clay) 16%, var(--bg)) 0%, var(--bg) 75%)" }} />

    {/* self PiP */}
    <div style={{ position: "absolute", top: SAFE_TOP, right: 18, width: 92, height: 124, borderRadius: 18, overflow: "hidden", border: "1px solid var(--line)", zIndex: 3, background: "var(--sand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Avatar name="Adam Saleh" size={48} tone="clay" />
    </div>

    <div style={{ position: "relative", zIndex: 2, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: 24 }}>
      <Avatar name="Maya Nasrallah" size={120} tone="clay" />
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 26 }}>Maya Nasrallah</h1>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 4 }}>Sr PM · AWS</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 12, padding: "5px 12px", borderRadius: 999, background: "color-mix(in oklab, var(--clay) 14%, transparent)" }}>
          <span className="hy-livedot" style={{ background: "#3fb98a" }} />
          <span className="mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>04:18</span>
        </div>
      </div>
    </div>

    {/* call controls */}
    <div style={{ position: "relative", zIndex: 2, flex: "none", padding: "16px 28px 38px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <button style={callBtn(false)}>{React.cloneElement(I.mic, { size: 22 })}</button>
      <button style={callBtn(false)}>{React.cloneElement(I.users, { size: 22 })}</button>
      <button onClick={() => nav.back()} style={{ width: 64, height: 64, borderRadius: 999, background: "#d6452f", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(135deg)" }}>
        <Icon d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z" size={26} />
      </button>
      <button style={callBtn(false)}>{React.cloneElement(I.spark, { size: 22 })}</button>
      <button style={callBtn(false)}>{React.cloneElement(I.more, { size: 22 })}</button>
    </div>
  </div>
  );
};
const callBtn = () => ({ width: 50, height: 50, borderRadius: 999, background: "color-mix(in oklab, var(--paper) 70%, transparent)", border: "1px solid var(--line)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" });

// ════════════════════════ FOLLOWERS / FOLLOWING ════════════════════
const followList = [
  { n: "Maya Nasrallah", r: "Sr PM · AWS", tone: "clay", following: true },
  { n: "Rashid Khoury", r: "Eng Mgr · Amazon", tone: "dark", following: true },
  { n: "Jenna Sun", r: "Talent · Shopify", tone: "olive", following: false },
  { n: "Omar Aziz", r: "Data · RBC", tone: "sand", following: true },
  { n: "Priya Shah", r: "Recruiter · Stripe", tone: "clay", following: false },
];

const FollowsScreen = () => {
  const nav = useNav();
  return (
  <DrillScreen title="Maya Nasrallah" eyebrow="">
    <div style={{ display: "flex", gap: 0, marginBottom: 18, background: "var(--cream)", borderRadius: 12, padding: 3 }}>
      {[["Followers", "1.2k", true], ["Following", "318", false]].map(([l, n, on]) => (
        <div key={l} style={{ flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 10, background: on ? "var(--paper)" : "transparent", boxShadow: on ? "var(--shadow-soft)" : "none" }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{l}</span>
          <span style={{ fontSize: 13, color: "var(--ink-mute)", marginLeft: 6 }}>{n}</span>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingBottom: 16 }}>
      {followList.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", borderBottom: i < followList.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
          <div onClick={() => nav.go("publicProfile")} style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, cursor: "pointer", minWidth: 0 }}>
            <Avatar name={p.n} size={44} tone={p.tone} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{p.n}</p>
              <Meta>{p.r}</Meta>
            </div>
          </div>
          <Btn kind={p.following ? "soft" : "primary"} size="md">{p.following ? "Following" : "Follow"}</Btn>
        </div>
      ))}
    </div>
  </DrillScreen>
  );
};

// ════════════════════════ HELP & FEEDBACK ════════════════════════
const helpTopics = [
  "Getting started with rooms",
  "How referrals work",
  "Hosting your first room",
  "Privacy & who can see you",
  "Managing notifications",
];

const HelpScreen = () => (
  <DrillScreen title="Help & feedback" eyebrow="">
    <div style={{ paddingTop: 6, paddingBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "13px 16px", borderRadius: 14, background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-mute)", marginBottom: 24 }}>
        {React.cloneElement(I.search, { size: 17 })}<span style={{ fontSize: 15 }}>Search help articles…</span>
      </div>

      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", color: "var(--ink-mute)", marginBottom: 10, paddingLeft: 2 }}>POPULAR</p>
      <Card pad={0} style={{ overflow: "hidden", marginBottom: 24 }}>
        {helpTopics.map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 11, padding: "14px 15px", borderBottom: i < helpTopics.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
            <span style={{ flex: 1, fontSize: 14.5 }}>{t}</span>
            {React.cloneElement(I.arrow, { size: 15 })}
          </div>
        ))}
      </Card>

      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", color: "var(--ink-mute)", marginBottom: 10, paddingLeft: 2 }}>STILL STUCK?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn kind="soft" size="lg" icon={I.msg} style={{ flex: 1, justifyContent: "center" }}>Contact us</Btn>
        <Btn kind="soft" size="lg" icon={I.spark} style={{ flex: 1, justifyContent: "center" }}>Send feedback</Btn>
      </div>
    </div>
  </DrillScreen>
);

// ════════════════════════ MODAL SHELL ════════════════════════
// A dimmed scrim with a bottom sheet — used for permission/report/reschedule.
const Sheet = ({ children, onClose, peek }) => (
  <div className="hy" style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", fontFamily: "var(--body)" }}>
    {/* faded context behind */}
    <div style={{ position: "absolute", inset: 0, background: "var(--bg)", opacity: 1 }} />
    <div style={{ position: "absolute", inset: 0, background: "rgba(20,12,8,.5)", backdropFilter: "blur(2px)" }} />
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 2,
      background: "var(--paper)", borderRadius: "26px 26px 0 0",
      padding: "12px 24px 34px", boxShadow: "0 -20px 60px -20px rgba(0,0,0,.4)",
    }}>
      <div style={{ width: 38, height: 4, borderRadius: 99, background: "var(--line)", margin: "0 auto 18px" }} />
      {children}
    </div>
  </div>
);

// ── Permission priming ──
const PermissionSheet = () => {
  const nav = useNav();
  return (
  <Sheet>
    <div style={{ textAlign: "center", padding: "4px 0 6px" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: "color-mix(in oklab, var(--clay) 12%, var(--paper))", border: "1px solid color-mix(in oklab, var(--clay) 24%, var(--line))", color: "var(--clay)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
        {React.cloneElement(I.mic, { size: 28 })}
      </div>
      <h2 style={{ fontSize: 23, marginBottom: 10 }}>Let people hear you</h2>
      <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.5, marginBottom: 22, padding: "0 6px" }}>
        Hayy needs your microphone so you can speak when a host invites you up. You stay muted until you choose to talk.
      </p>
      <Btn kind="primary" size="xl" onClick={() => nav.back()} style={{ width: "100%", justifyContent: "center", marginBottom: 8 }}>Allow microphone</Btn>
      <button onClick={() => nav.back()} style={{ width: "100%", padding: "12px 0", fontSize: 15, fontWeight: 600, color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer" }}>Not now</button>
    </div>
  </Sheet>
  );
};

// ── Report & Block ──
const ReportBlockSheet = () => {
  const nav = useNav();
  const opts = [
    { icon: I.closed, label: "Report this conversation", note: "Spam, harassment, or abuse" },
    { icon: I.users, label: "Block Maya Nasrallah", note: "They won't be able to reach you" },
    { icon: I.spark, label: "Mute notifications", note: "" },
  ];
  return (
  <Sheet>
    <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink-mute)", marginBottom: 14 }}>Maya Nasrallah</p>
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {opts.map((o, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 6px", borderBottom: i < opts.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
          <span style={{ color: i < 2 ? "#c0492f" : "var(--ink-soft)", display: "flex" }}>{React.cloneElement(o.icon, { size: 20 })}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: i < 2 ? "#c0492f" : "var(--ink)" }}>{o.label}</p>
            {o.note && <Meta>{o.note}</Meta>}
          </div>
        </div>
      ))}
    </div>
    <Btn kind="soft" size="lg" onClick={() => nav.back()} style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>Cancel</Btn>
  </Sheet>
  );
};

// ── Reschedule / Cancel a booking ──
const RescheduleSheet = () => {
  const nav = useNav();
  return (
  <Sheet>
    <div style={{ textAlign: "center", marginBottom: 18 }}>
      <Avatar name="Maya Nasrallah" size={52} tone="clay" />
      <h2 style={{ fontSize: 20, marginTop: 12 }}>1:1 with Maya</h2>
      <Meta>WED · 10:00 AM · 20 MIN</Meta>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Btn kind="primary" size="lg" icon={I.cal} onClick={() => nav.go("book")} style={{ width: "100%", justifyContent: "center" }}>Reschedule</Btn>
      <button onClick={() => nav.back()} style={{ width: "100%", padding: "13px 0", borderRadius: 14, fontSize: 15, fontWeight: 600, color: "#c0492f", background: "transparent", border: "1px solid var(--line)", cursor: "pointer" }}>Cancel booking</button>
      <button onClick={() => nav.back()} style={{ width: "100%", padding: "11px 0", fontSize: 15, fontWeight: 600, color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer" }}>Keep it</button>
    </div>
  </Sheet>
  );
};

// ════════════════════════ OFFLINE / ERROR ════════════════════════
const OfflineScreen = () => {
  const nav = useNav();
  return (
  <div className="hy" style={{ position: "relative", width: "100%", height: "100%", boxSizing: "border-box", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "var(--bg)", fontFamily: "var(--body)", padding: "0 40px" }}>
    <Wash />
    <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: "var(--cream)", border: "1px solid var(--line)", color: "var(--ink-mute)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
        {React.cloneElement(I.wifiOff, { size: 32 })}
      </div>
      <h1 style={{ fontSize: 26, marginBottom: 10 }}>You're offline</h1>
      <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.5, marginBottom: 26, maxWidth: 260 }}>
        The rooms need a connection. Check your network and we'll pick up right where you left off.
      </p>
      <Btn kind="primary" size="lg" onClick={() => nav.go("home")}>Try again</Btn>
    </div>
  </div>
  );
};

// ════════════════════════ EMPTY SCHEDULE ════════════════════════
const EmptyScheduleScreen = () => {
  const nav = useNav();
  return (
  <DrillScreen title="Your schedule" eyebrow="">
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 70, paddingLeft: 20, paddingRight: 20 }}>
      <div style={{ width: 84, height: 84, borderRadius: 26, background: "var(--cream)", border: "1px solid var(--line)", color: "var(--clay)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
        {React.cloneElement(I.cal, { size: 34 })}
      </div>
      <h2 style={{ fontSize: 23, marginBottom: 10 }}>Nothing booked yet</h2>
      <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.5, marginBottom: 26, maxWidth: 260 }}>
        Reserve a room or book a 1:1 and it'll show up here, ready when you are.
      </p>
      <Btn kind="primary" size="lg" iconRight={I.arrow} onClick={() => nav.go("rooms")}>Browse rooms</Btn>
    </div>
  </DrillScreen>
  );
};

// ════════════════════════ LOADING / SKELETON ════════════════════════
const Skel = ({ w = "100%", h = 14, r = 10, style }) => (
  <div className="hy-skel" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

const LoadingScreen = () => (
  <AppScreen tab="home">
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
      <div>
        <Skel w={90} h={11} />
        <Skel w={150} h={26} r={8} style={{ marginTop: 10 }} />
      </div>
      <Skel w={42} h={42} r={14} />
    </div>
    {/* hero skeleton */}
    <div style={{ border: "1px solid var(--line)", borderRadius: 20, padding: 18, marginBottom: 26 }}>
      <Skel w={110} h={20} r={999} />
      <Skel w="85%" h={20} style={{ marginTop: 14 }} />
      <Skel w="60%" h={20} style={{ marginTop: 8 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
        <Skel w={38} h={38} r={999} />
        <div style={{ flex: 1 }}>
          <Skel w={120} h={13} />
          <Skel w={90} h={11} style={{ marginTop: 6 }} />
        </div>
        <Skel w={90} h={38} r={999} />
      </div>
    </div>
    <Skel w={140} h={14} style={{ marginBottom: 14 }} />
    {[0, 1].map((i) => (
      <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", border: "1px solid var(--line)", borderRadius: 20, padding: 16, marginBottom: 10 }}>
        <Skel w={44} h={44} r={999} />
        <div style={{ flex: 1 }}>
          <Skel w="80%" h={15} />
          <Skel w="45%" h={11} style={{ marginTop: 8 }} />
        </div>
      </div>
    ))}
  </AppScreen>
);

// ════════════════════════ NO RESULTS (search empty) ════════════════
const NoResultsScreen = () => {
  const nav = useNav();
  return (
  <AppScreen tab="rooms">
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26, paddingTop: 4 }}>
      <RoundBtn icon={<Chevron />} onClick={() => nav.back()} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, padding: "11px 14px", borderRadius: 14, background: "var(--paper)", border: "1px solid var(--line)" }}>
        {React.cloneElement(I.search, { size: 17 })}
        <span style={{ fontSize: 15, color: "var(--ink)" }}>staff engineer fintech</span>
        <span style={{ marginLeft: "auto", color: "var(--ink-mute)" }}>{React.cloneElement(I.closed, { size: 15 })}</span>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 50, paddingLeft: 20, paddingRight: 20 }}>
      <div style={{ width: 84, height: 84, borderRadius: 26, background: "var(--cream)", border: "1px solid var(--line)", color: "var(--ink-mute)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
        {React.cloneElement(I.search, { size: 32 })}
      </div>
      <h2 style={{ fontSize: 22, marginBottom: 10 }}>No rooms match that yet</h2>
      <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.5, marginBottom: 24, maxWidth: 270 }}>
        Try a broader topic, or set an alert and we'll ping you when one opens.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
        {["Engineering", "Fintech", "Senior roles"].map((t) => (
          <span key={t} className="hy-pill" style={{ textTransform: "none", letterSpacing: 0, fontSize: 13, padding: "8px 14px" }}>{t}</span>
        ))}
      </div>
      <Btn kind="primary" size="lg" icon={I.bell} onClick={() => nav.go("rooms")}>Alert me for new rooms</Btn>
    </div>
  </AppScreen>
  );
};

// ── Notifications permission priming ──
const NotifPermissionSheet = () => {
  const nav = useNav();
  return (
  <Sheet>
    <div style={{ textAlign: "center", padding: "4px 0 6px" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: "color-mix(in oklab, var(--clay) 12%, var(--paper))", border: "1px solid color-mix(in oklab, var(--clay) 24%, var(--line))", color: "var(--clay)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
        {React.cloneElement(I.bell, { size: 28 })}
      </div>
      <h2 style={{ fontSize: 23, marginBottom: 10 }}>Never miss a room</h2>
      <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.5, marginBottom: 22, padding: "0 6px" }}>
        Get a ping when a room you'd love goes live, when someone invites you to speak, or when a referral moves forward.
      </p>
      <Btn kind="primary" size="xl" onClick={() => nav.back()} style={{ width: "100%", justifyContent: "center", marginBottom: 8 }}>Turn on notifications</Btn>
      <button onClick={() => nav.back()} style={{ width: "100%", padding: "12px 0", fontSize: 15, fontWeight: 600, color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer" }}>Not now</button>
    </div>
  </Sheet>
  );
};

Object.assign(window, {
  SearchResultsScreen, LiveRoomHostScreen, CallScreen, FollowsScreen, HelpScreen,
  PermissionSheet, ReportBlockSheet, RescheduleSheet, OfflineScreen, EmptyScheduleScreen,
  LoadingScreen, NoResultsScreen, NotifPermissionSheet,
});
