// Hayy minimal screens — part 1: Home, Rooms, Live Room.
// Language matches the App Entry: brand wash, big quiet type, one focus.

// Shared: a soft card
const Card = ({ children, style, onClick, pad = 16 }) => (
  <div onClick={onClick} style={{
    background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20,
    padding: pad, ...style,
  }}>{children}</div>
);

const Meta = ({ children }) => (
  <span className="mono" style={{ fontSize: 11, letterSpacing: ".06em", color: "var(--ink-mute)" }}>{children}</span>
);

const Stack = ({ names, n }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    {names.slice(0, 3).map((nm, i) => (
      <span key={i} style={{ marginLeft: i ? -9 : 0, border: "2px solid var(--paper)", borderRadius: 999, display: "inline-flex" }}>
        <Avatar name={nm} size={24} tone={["clay", "olive", "sand", "dark"][i % 4]} />
      </span>
    ))}
    {n > 3 && <span style={{ marginLeft: 7, fontSize: 12, color: "var(--ink-mute)" }}>+{n - 3}</span>}
  </div>
);

// ════════════════════════ HOME ════════════════════════
// "Tonight" — one hero room up top, a quiet list below.
const upcoming = [
  { t: "Breaking into Product at Big Tech", host: "Maya Nasrallah", co: "AWS", time: "7:00 PM", n: 42, tone: "clay" },
  { t: "Design portfolios that get callbacks", host: "Layla Park", co: "Figma", time: "8:30 PM", n: 28, tone: "olive" },
  { t: "New grad → first eng role", host: "Rashid Khoury", co: "Amazon", time: "Tomorrow", n: 61, tone: "dark" },
];

const liveNow = [
  { t: "Portfolio teardowns, live", host: "Layla Park", n: 31, tone: "olive" },
  { t: "Cracking the PM case", host: "Maya Nasrallah", n: 42, tone: "clay" },
  { t: "Bootcamp → backend", host: "Omar Aziz", n: 17, tone: "sand" },
];
const meet = [
  { n: "Jenna Sun", r: "Talent · Shopify", tone: "olive" },
  { n: "Rashid Khoury", r: "Eng Mgr · Amazon", tone: "dark" },
];

const HomeScreen = () => {
  const nav = useNav();
  return (
  <AppScreen tab="home">
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <div>
        <Meta>TUESDAY · MAY 31</Meta>
        <h1 style={{ fontSize: 30, lineHeight: 1.05, marginTop: 6 }}>
          Evening, <span className="display-italic">Adam.</span>
        </h1>
      </div>
      <RoundBtn icon={I.search} onClick={() => nav.go("search")} />
    </div>

    {/* live now strip */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span className="hy-livedot" /><h3 style={{ fontSize: 14, fontWeight: 700 }}>Live now</h3>
      </span>
      <span onClick={() => nav.go("liveRoom")} style={{ fontSize: 13, color: "var(--clay)", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}>
        {React.cloneElement(I.shuffle, { size: 14 })} Shuffle
      </span>
    </div>
    <div style={{ display: "flex", gap: 12, overflowX: "auto", margin: "0 -22px 26px", padding: "0 22px 4px" }}>
      {liveNow.map((r, i) => (
        <Card key={i} onClick={() => nav.go("liveRoom")} pad={14} style={{ flex: "none", width: 198, cursor: "pointer" }}>
          <LiveTag>Live</LiveTag>
          <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.25, margin: "12px 0 14px", minHeight: 38 }}>{r.t}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar name={r.host} size={26} tone={r.tone} />
            <Meta>{r.n} listening</Meta>
          </div>
        </Card>
      ))}
    </div>

    {/* up next — your reserved room */}
    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Up next for you</h3>
    <Card pad={0} onClick={() => nav.go("roomDetail")} style={{ overflow: "hidden", marginBottom: 26, cursor: "pointer" }}>
      <div style={{ padding: "18px 18px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span className="hy-pill" style={{ textTransform: "none", letterSpacing: 0, fontSize: 11, fontWeight: 600, background: "color-mix(in oklab, var(--clay) 12%, var(--paper))", color: "var(--clay)", borderColor: "color-mix(in oklab, var(--clay) 24%, var(--line))" }}>Reserved</span>
          <Meta>TODAY · 7:00 PM · ROOM 04</Meta>
        </div>
        <h2 style={{ fontSize: 23, lineHeight: 1.12, marginBottom: 16 }}>
          Breaking into Product at Big&nbsp;Tech
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <Avatar name="Maya Nasrallah" size={38} tone="clay" />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Maya Nasrallah</p>
            <p style={{ fontSize: 12, color: "var(--ink-mute)" }}>Sr PM · AWS · hosting</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Stack names={["A B", "C D", "E F", "G H"]} n={42} />
            <Meta>42 going</Meta>
          </div>
          <Btn kind="primary" iconRight={I.arrow} onClick={(e) => { e.stopPropagation(); nav.go("greenRoom"); }}>View</Btn>
        </div>
      </div>
    </Card>

    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <h3 style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 600 }}>Later this week</h3>
      <span onClick={() => nav.go("rooms")} style={{ fontSize: 13, color: "var(--clay)", fontWeight: 600, cursor: "pointer" }}>See all</span>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
      {upcoming.slice(1).map((r, i) => (
        <Card key={i} onClick={() => nav.go("roomDetail")} style={{ display: "flex", gap: 14, alignItems: "center", cursor: "pointer" }}>
          <Avatar name={r.host} size={44} tone={r.tone} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2, marginBottom: 4 }}>{r.t}</p>
            <Meta>{r.host} · {r.co}</Meta>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--clay)" }}>{r.time}</p>
            <Meta>{r.n} going</Meta>
          </div>
        </Card>
      ))}
    </div>

    {/* people to meet */}
    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>People to meet</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingBottom: 16 }}>
      {meet.map((p, i) => (
        <div key={i} onClick={() => nav.go("publicProfile")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", cursor: "pointer", borderBottom: i < meet.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
          <Avatar name={p.n} size={44} tone={p.tone} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{p.n}</p>
            <Meta>{p.r}</Meta>
          </div>
          <Btn kind="soft" size="md" onClick={(e) => e.stopPropagation()}>Follow</Btn>
        </div>
      ))}
    </div>
  </AppScreen>
  );
};

// ════════════════════════ ROOMS (browse) ════════════════════════
const cats = ["For you", "Live now", "Product", "Engineering", "Design", "Data"];
const roomsList = [
  { t: "How we hire designers at Figma", host: "Layla Park", co: "Figma", n: 28, live: true, justNow: true, tone: "olive" },
  { t: "Cracking the PM case interview", host: "Maya Nasrallah", co: "AWS", n: 42, live: true, tone: "clay" },
  { t: "From bootcamp to backend at RBC", host: "Omar Aziz", co: "RBC", n: 17, live: false, when: "7:30 PM", tone: "sand" },
  { t: "Referrals, honestly: what works", host: "Priya Shah", co: "Stripe", n: 53, live: false, when: "Tomorrow", tone: "dark" },
];

const RoomsScreen = () => {
  const nav = useNav();
  return (
  <AppScreen tab="home">
    <ScreenHead eyebrow="DISCOVER" title="Rooms" leading={<RoundBtn icon={<Chevron />} onClick={() => nav.back()} />} trailing={
      <div style={{ display: "flex", gap: 8 }}>
        <RoundBtn icon={I.search} onClick={() => nav.go("search")} />
        <RoundBtn icon={React.cloneElement(I.plus, { size: 18 })} onClick={() => nav.go("schedule")} />
      </div>
    } />
    <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 4, marginLeft: -2 }}>
      {cats.map((c, i) => (
        <span key={c} className="hy-pill" style={{
          flex: "none", padding: "8px 15px", fontSize: 13, letterSpacing: 0, textTransform: "none",
          background: i === 0 ? "var(--clay)" : "var(--paper)",
          color: i === 0 ? "var(--paper)" : "var(--ink-soft)",
          border: i === 0 ? "none" : "1px solid var(--line)",
        }}>{c}</span>
      ))}
    </div>

    {/* shuffle — drop straight into a live room, hop until one clicks */}
    <Card onClick={() => nav.go("liveRoom")} style={{
      display: "flex", alignItems: "center", gap: 13, marginBottom: 18, cursor: "pointer",
      background: "color-mix(in oklab, var(--clay) 9%, var(--paper))", borderColor: "color-mix(in oklab, var(--clay) 22%, var(--line))",
    }}>
      <span style={{ width: 42, height: 42, borderRadius: 13, background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        {React.cloneElement(I.shuffle, { size: 19 })}
      </span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14.5, fontWeight: 600 }}>Shuffle me in</p>
        <Meta>9 rooms live · hop until one clicks</Meta>
      </div>
      {React.cloneElement(I.arrow, { size: 18 })}
    </Card>

    <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 16 }}>
      {roomsList.map((r, i) => (
        <Card key={i} onClick={() => nav.go("roomDetail")} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            {r.live
              ? <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><LiveTag>Live</LiveTag>{r.justNow && <Meta>JUST STARTED</Meta>}</span>
              : <Meta>{(r.when || "SOON").toUpperCase()}</Meta>}
            <Stack names={["A B", "C D", "E F", "G H"]} n={r.n} />
          </div>
          <h3 style={{ fontSize: 18, lineHeight: 1.15, marginBottom: 14 }}>{r.t}</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Avatar name={r.host} size={30} tone={r.tone} />
              <Meta>{r.host} · {r.co}</Meta>
            </div>
            {r.live
              ? <Btn kind="primary" icon={I.mic} onClick={(e) => { e.stopPropagation(); nav.go("liveRoom"); }}>Join</Btn>
              : <Btn kind="soft" onClick={(e) => e.stopPropagation()}>Remind me</Btn>}
          </div>
        </Card>
      ))}
    </div>
  </AppScreen>
  );
};

// ════════════════════════ LIVE ROOM ════════════════════════
// Minimal "stage": host centered, speakers ring, your controls float at the base.
const speakers = [
  { n: "Maya Nasrallah", r: "Host · AWS", tone: "clay", big: true, talking: true },
  { n: "Rashid Khoury", r: "Amazon", tone: "dark" },
  { n: "Jenna Sun", r: "Shopify", tone: "olive", talking: true },
  { n: "Omar Aziz", r: "RBC", tone: "sand" },
  { n: "Priya Shah", r: "Stripe", tone: "clay" },
];

const SpeakerBubble = ({ s, size }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: size + 18 }}>
    <div style={{
      position: "relative", borderRadius: 999,
      padding: 3, background: s.talking ? "var(--clay)" : "transparent",
      boxShadow: s.talking ? "0 0 0 3px color-mix(in oklab, var(--clay) 22%, transparent)" : "none",
      transition: "all .3s",
    }}>
      <Avatar name={s.n} size={size} tone={s.tone} />
      {s.r.startsWith("Host") && (
        <span style={{
          position: "absolute", bottom: -2, right: -2, width: 22, height: 22, borderRadius: 999,
          background: "var(--clay)", color: "var(--paper)", border: "2px solid var(--bg)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{React.cloneElement(I.mic, { size: 11 })}</span>
      )}
    </div>
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.1 }}>{s.n.split(" ")[0]}</p>
      <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>{s.r}</p>
    </div>
  </div>
);

const LiveRoomScreen = () => {
  const nav = useNav();
  return (
  <div className="hy" data-palette="dusk" style={{
    position: "relative", width: "100%", height: "100%", overflow: "hidden",
    display: "flex", flexDirection: "column", background: "var(--bg)", fontFamily: "var(--body)",
  }}>
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      background: "radial-gradient(90% 50% at 50% 22%, color-mix(in oklab, var(--clay) 20%, var(--bg)) 0%, var(--bg) 70%)",
    }} />

    {/* top bar */}
    <div style={{
      position: "relative", zIndex: 2, paddingTop: SAFE_TOP, paddingLeft: 20, paddingRight: 20,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <RoundBtn icon={<Icon d="M15 18l-6-6 6-6" size={18} />} onClick={() => nav.go("recap")} />
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <span className="hy-livedot" /><Meta>LIVE · 42 HERE</Meta>
        </div>
      </div>
      <button onClick={() => nav.go("nextRoom")} style={{
        display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 13px", borderRadius: 999,
        background: "color-mix(in oklab, var(--clay) 18%, transparent)", border: "1px solid color-mix(in oklab, var(--clay) 40%, transparent)",
        color: "var(--clay)", fontSize: 12.5, fontWeight: 700, cursor: "pointer",
      }}>
        {React.cloneElement(I.shuffle, { size: 14 })}Next
      </button>
    </div>

    {/* title */}
    <div style={{ position: "relative", zIndex: 2, padding: "16px 24px 0", textAlign: "center" }}>
      <h2 style={{ fontSize: 22, lineHeight: 1.12 }}>Breaking into Product at Big&nbsp;Tech</h2>
    </div>

    {/* stage */}
    <div style={{
      position: "relative", zIndex: 2, flex: 1, minHeight: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, padding: 20,
    }}>
      <SpeakerBubble s={speakers[0]} size={92} />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px 14px", maxWidth: 320 }}>
        {speakers.slice(1).map((s, i) => <SpeakerBubble key={i} s={s} size={58} />)}
      </div>
      <Meta>+ 37 listening</Meta>
    </div>

    {/* floating live chat — rises from the bottom, fades as it goes */}
    <FloatingComments />

    {/* comment input — for people who'd rather type than talk */}
    <div style={{ position: "relative", zIndex: 4, flex: "none", padding: "0 22px 10px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 16px",
        borderRadius: 999, background: "color-mix(in oklab, var(--paper) 70%, transparent)",
        border: "1px solid var(--line)", backdropFilter: "blur(8px)", color: "var(--ink-mute)",
      }}>
        {React.cloneElement(I.msg, { size: 16 })}
        <span style={{ fontSize: 14, flex: 1 }}>Say something…</span>
        <span style={{ color: "var(--clay)" }}>{React.cloneElement(I.arrow, { size: 16 })}</span>
      </div>
    </div>

    {/* controls */}
    <div style={{
      position: "relative", zIndex: 2, flex: "none", padding: "4px 22px 34px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    }}>
      <button style={ctrlStyle(false)}>{React.cloneElement(I.micOff, { size: 22 })}</button>
      <button style={{ ...ctrlStyle(false), flex: 1, gap: 9, width: "auto" }}>
        {React.cloneElement(I.hand2, { size: 20 })}<span style={{ fontSize: 15, fontWeight: 600 }}>Raise hand</span>
      </button>
      <button style={ctrlStyle(true)}>{React.cloneElement(I.heart, { size: 22 })}</button>
    </div>
  </div>
  );
};

const ctrlStyle = (accent) => ({
  height: 54, minWidth: 54, borderRadius: 18, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  border: "1px solid var(--line)",
  background: accent ? "var(--clay)" : "var(--paper)",
  color: accent ? "var(--paper)" : "var(--ink)",
});

// Ephemeral live chat — comments rise from the bottom and fade as they go,
// for people who'd rather type than speak. Never takes its own layout space.
const liveComments = [
  { n: "Dana", t: "this is so helpful \uD83D\uDE4C", tone: "olive" },
  { n: "Tom", t: "how junior is too junior?", tone: "dark" },
  { n: "Priya", t: "+1 to the portfolio point", tone: "clay" },
  { n: "Sam", t: "following!", tone: "sand" },
  { n: "Lea", t: "what about non-CS grads?", tone: "olive" },
  { n: "Ravi", t: "\uD83D\uDD25\uD83D\uDD25", tone: "dark" },
  { n: "Mia", t: "can you share that resource?", tone: "clay" },
  { n: "Joe", t: "raising my hand next", tone: "sand" },
];

const FloatingComments = () => {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    let id = 0;
    const push = () => setItems((prev) => [...prev, { ...liveComments[id % liveComments.length], id: id++ }].slice(-3));
    push();
    const t = setInterval(push, 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      position: "absolute", left: 16, right: 64, bottom: 150, zIndex: 3, pointerEvents: "none",
      display: "flex", flexDirection: "column", gap: 8, justifyContent: "flex-end",
      WebkitMaskImage: "linear-gradient(to top, #000 55%, transparent)",
      maskImage: "linear-gradient(to top, #000 55%, transparent)",
    }}>
      {items.map((c) => (
        <div key={c.id} style={{
          display: "flex", alignItems: "center", gap: 8, alignSelf: "flex-start",
          maxWidth: "100%", animation: "hy-rise-in .45s cubic-bezier(.4,0,.2,1)",
        }}>
          <Avatar name={c.n} size={26} tone={c.tone} />
          <div style={{
            background: "color-mix(in oklab, var(--paper) 78%, transparent)",
            border: "1px solid var(--line-soft)", backdropFilter: "blur(8px)",
            borderRadius: 14, padding: "7px 12px", display: "flex", gap: 7, alignItems: "baseline",
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--clay)" }}>{c.n}</span>
            <span style={{ fontSize: 13.5, color: "var(--ink)" }}>{c.t}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

Object.assign(window, { HomeScreen, RoomsScreen, LiveRoomScreen, FloatingComments, Card, Meta, Stack });
