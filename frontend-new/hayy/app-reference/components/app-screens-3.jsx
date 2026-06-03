// Hayy minimal screens — part 3: Search, DM Thread, Public Profile, Green Room.
// Same language: brand wash, quiet type, one focus. Uses Card/Meta/Stack +
// DrillScreen/Chevron from the shell.

// ════════════════════════ SEARCH / DISCOVER ════════════════════════
const recent = ["product interviews", "Figma", "warm intro", "new grad"];
const topics = [
  { t: "Product", n: 38 }, { t: "Engineering", n: 52 }, { t: "Design", n: 24 },
  { t: "Data", n: 19 }, { t: "Recruiting", n: 16 }, { t: "Fintech", n: 21 },
];
const peopleHits = [
  { n: "Maya Nasrallah", r: "Sr PM · AWS", tone: "clay" },
  { n: "Layla Park", r: "Design · Figma", tone: "olive" },
  { n: "Omar Aziz", r: "Data · RBC", tone: "sand" },
];

const SearchScreen = () => (
  <AppScreen tab="rooms">
    <ScreenHead eyebrow="DISCOVER" title="Search" />
    {/* search field */}
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", marginBottom: 24,
      background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16,
      color: "var(--ink-mute)",
    }}>
      {React.cloneElement(I.search, { size: 18 })}
      <span style={{ fontSize: 15 }}>People, rooms, companies…</span>
    </div>

    <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-mute)", marginBottom: 11 }}>RECENT</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
      {recent.map((r) => (
        <span key={r} className="hy-pill" style={{ textTransform: "none", letterSpacing: 0, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 7 }}>
          {React.cloneElement(I.search, { size: 13 })}{r}
        </span>
      ))}
    </div>

    <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-mute)", marginBottom: 11 }}>BROWSE TOPICS</p>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 26 }}>
      {topics.map((t) => (
        <Card key={t.t} pad={14} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{t.t}</span>
          <Meta>{t.n}</Meta>
        </Card>
      ))}
    </div>

    <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-mute)", marginBottom: 11 }}>PEOPLE TO MEET</p>
    <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingBottom: 16 }}>
      {peopleHits.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", borderBottom: i < peopleHits.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
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

// ════════════════════════ DM THREAD (open conversation) ════════════
const bubbles = [
  { me: false, txt: "Loved your question in the room tonight — really sharp framing.", t: "7:48 PM" },
  { me: true, txt: "Thank you! That means a lot coming from you 🙏", t: "7:49 PM" },
  { me: false, txt: "I'd be happy to put you in touch with our recruiter. Mind if I share your profile?", t: "7:50 PM" },
  { me: true, txt: "Yes please — that would be amazing.", t: "7:51 PM" },
];

const ThreadScreen = () => (
  <DrillScreen
    eyebrow="AWS · ONLINE"
    title="Maya Nasrallah"
    action={<RoundBtn icon={React.cloneElement(I.more, { size: 18 })} />}
    footer={
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, padding: "12px 16px", borderRadius: 22, background: "var(--cream)", border: "1px solid var(--line)", color: "var(--ink-mute)", fontSize: 14 }}>Message…</div>
        <button style={{ width: 44, height: 44, borderRadius: 999, background: "var(--clay)", color: "var(--paper)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          {React.cloneElement(I.arrow, { size: 19 })}
        </button>
      </div>
    }>
    <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 8, paddingBottom: 12 }}>
      <div style={{ textAlign: "center" }}><Meta>TODAY</Meta></div>

      {/* referral context chip */}
      <div style={{ alignSelf: "center", display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "color-mix(in oklab, var(--clay) 10%, var(--paper))", border: "1px solid color-mix(in oklab, var(--clay) 22%, var(--line))", fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 4 }}>
        {React.cloneElement(I.mic, { size: 13 })} You met in <b style={{ color: "var(--ink)" }}>Room 04</b>
      </div>

      {bubbles.map((b, i) => (
        <div key={i} style={{ display: "flex", justifyContent: b.me ? "flex-end" : "flex-start" }}>
          <div style={{ maxWidth: "78%" }}>
            <div style={{
              padding: "11px 15px", borderRadius: b.me ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
              background: b.me ? "var(--clay)" : "var(--paper)",
              color: b.me ? "var(--paper)" : "var(--ink)",
              border: b.me ? "none" : "1px solid var(--line)",
              fontSize: 14.5, lineHeight: 1.4,
            }}>{b.txt}</div>
            <p style={{ fontSize: 10.5, color: "var(--ink-mute)", marginTop: 4, textAlign: b.me ? "right" : "left", paddingLeft: 4, paddingRight: 4 }}>{b.t}</p>
          </div>
        </div>
      ))}

      {/* shared-profile inline card */}
      <div style={{ alignSelf: "flex-start", maxWidth: "82%" }}>
        <Card pad={12} style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Avatar name="Adam Saleh" size={38} tone="clay" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13.5, fontWeight: 600 }}>Adam Saleh</p>
            <Meta>Profile shared</Meta>
          </div>
          {React.cloneElement(I.arrow, { size: 16 })}
        </Card>
      </div>
    </div>
  </DrillScreen>
);

// ════════════════════════ PUBLIC PROFILE (bookable) ════════════════
const hostRooms = [
  { t: "Breaking into Product at Big Tech", n: 42, when: "Tonight 7PM", live: true },
  { t: "PM case interviews, unpacked", n: 31, when: "Thu", live: false },
];

const PublicProfileScreen = () => {
  const nav = useNav();
  const [following, setFollowing] = React.useState(false);
  return (
  <DrillScreen
    eyebrow=""
    title=""
    action={<RoundBtn icon={React.cloneElement(I.more, { size: 18 })} onClick={() => nav.go("report")} />}
    wash
    footer={
      <div style={{ display: "flex", gap: 10 }}>
        <Btn kind="soft" size="lg" icon={I.shake} onClick={() => nav.go("requestIntro")} style={{ flex: 1, justifyContent: "center" }}>Request referral</Btn>
        <Btn kind="primary" size="lg" iconRight={I.cal} onClick={() => nav.go("book")} style={{ flex: 1, justifyContent: "center" }}>Book a 1:1</Btn>
      </div>
    }>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 8, marginBottom: 18 }}>
      <Avatar name="Maya Nasrallah" size={88} tone="clay" />
      <h1 style={{ fontSize: 26, marginTop: 14 }}>Maya Nasrallah</h1>
      <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 4 }}>Sr Product Manager · AWS</p>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 12, padding: "6px 12px", borderRadius: 999, background: "color-mix(in oklab, var(--clay) 9%, var(--paper))", border: "1px solid color-mix(in oklab, var(--clay) 20%, var(--line))" }}>
        {React.cloneElement(I.shake, { size: 14 })}<span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--clay)" }}>Open to referrals</span>
      </div>

      {/* follow + message */}
      <div style={{ display: "flex", gap: 9, marginTop: 18, width: "100%" }}>
        <Btn kind={following ? "soft" : "primary"} size="lg"
          icon={following ? I.check : I.plus}
          onClick={() => setFollowing((f) => !f)}
          style={{ flex: 1, justifyContent: "center" }}>{following ? "Following" : "Follow"}</Btn>
        <Btn kind="soft" size="lg" icon={I.msg} onClick={() => nav.go("thread")} style={{ flex: 1, justifyContent: "center" }}>Message</Btn>
      </div>
    </div>

    <Card style={{ display: "flex", justifyContent: "space-around", marginBottom: 20, padding: "15px 0" }}>
      {[["68", "ROOMS HOSTED"], ["1.2k", "FOLLOWERS"], ["24", "REFERRED"]].map(([n, l]) => (
        <div key={l} onClick={() => l === "FOLLOWERS" && nav.go("follows")} style={{ textAlign: "center", cursor: l === "FOLLOWERS" ? "pointer" : "default" }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 24, lineHeight: 1 }}>{n}</div>
          <Meta>{l}</Meta>
        </div>
      ))}
    </Card>

    <RichProfileBody data={MAYA_PROFILE} />

    <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-mute)", marginBottom: 12 }}>HOSTING NEXT</p>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 16 }}>
      {hostRooms.map((r, i) => (
        <Card key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            {r.live ? <LiveTag>Live</LiveTag> : <Meta>{r.when}</Meta>}
            <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2, marginTop: 8 }}>{r.t}</p>
          </div>
          <Btn kind={r.live ? "primary" : "soft"} size="md" onClick={() => nav.go("greenRoom")}>{r.live ? "Join" : "Remind"}</Btn>
        </Card>
      ))}
    </div>
  </DrillScreen>
  );
};

// ════════════════════════ GREEN ROOM (pre-room lobby) ════════════════
const GreenRoomScreen = () => {
  const nav = useNav();
  return (
  <div className="hy" data-palette="dusk" style={{
    position: "relative", width: "100%", height: "100%", overflow: "hidden",
    display: "flex", flexDirection: "column", background: "var(--bg)", fontFamily: "var(--body)",
  }}>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(90% 50% at 50% 18%, color-mix(in oklab, var(--clay) 18%, var(--bg)) 0%, var(--bg) 70%)" }} />

    <div style={{ position: "relative", zIndex: 2, paddingTop: SAFE_TOP - 8, padding: `${SAFE_TOP - 8}px 16px 0` }}>
      <RoundBtn icon={<Chevron />} onClick={() => nav.back()} />
    </div>

    <div style={{ position: "relative", zIndex: 2, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 30px" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <span className="hy-livedot" /><Meta>STARTING IN 02:14</Meta>
      </div>
      <h1 style={{ fontSize: 28, lineHeight: 1.1, marginBottom: 14 }}>Breaking into Product at Big&nbsp;Tech</h1>
      <p style={{ fontSize: 15, color: "var(--ink-soft)", marginBottom: 30, maxWidth: 300 }}>
        Maya opens the room shortly. Set yourself up before you walk in.
      </p>

      {/* host */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 26 }}>
        <Avatar name="Maya Nasrallah" size={72} tone="clay" />
        <div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>Maya Nasrallah · hosting</p>
          <Meta>Sr PM · AWS</Meta>
        </div>
      </div>

      {/* who's waiting */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Stack names={["A B", "C D", "E F", "G H"]} n={42} />
        <Meta>41 others waiting</Meta>
      </div>
    </div>

    {/* mic check + enter */}
    <div style={{ position: "relative", zIndex: 2, flex: "none", padding: "16px 22px 34px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 16, background: "var(--paper)", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {React.cloneElement(I.micOff, { size: 18 })}<span style={{ fontSize: 14, fontWeight: 500 }}>Join muted</span>
        </div>
        <span style={{ width: 42, height: 24, borderRadius: 999, background: "var(--clay)", position: "relative" }}>
          <span style={{ position: "absolute", top: 2, right: 2, width: 20, height: 20, borderRadius: 999, background: "#fff" }} />
        </span>
      </div>
      <Btn kind="primary" size="xl" iconRight={I.arrow} onClick={() => nav.go("liveRoom")} style={{ justifyContent: "center" }}>Enter room</Btn>
    </div>
  </div>
  );
};

Object.assign(window, { SearchScreen, ThreadScreen, PublicProfileScreen, GreenRoomScreen });
