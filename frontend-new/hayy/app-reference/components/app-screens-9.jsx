// Hayy minimal screens — part 9: the outcome / feedback loop + iOS push states.
//
// Feedback loop: people tell Hayy what happened to a warm intro — interviewed,
// offer, landed, or didn't work out. Closes the loop that proves the product works.
//   · OutcomeStepper   — the milestone timeline (shared)
// , · WinsScreen        — "Your journey": pursuits + community wins + give-back
//   · UpdateOutcomeSheet— manual milestone update + visibility
//   · OutcomeNudgeSheet — the gentle auto check-in
//   · LandedCelebration — the emotional peak when you land it
//   · GiveBackSheet     — the flywheel: hires return as hosts
//
// Push: LockScreen, PushBanner, NotifCenter — iOS notification states.
// (NotifPermissionSheet already lives in app-screens-7.)

// ── Outcome model ──────────────────────────────────────────────────
const OUTCOME_STAGES = [
  { key: "intro",     label: "Warm intro made",   icon: I.shake, hint: "Maya sent it to the hiring manager" },
  { key: "talking",   label: "In conversation",   icon: I.msg,   hint: "Recruiter replied — screening call" },
  { key: "interview", label: "Interviewing",      icon: I.cal,   hint: "First round booked" },
  { key: "final",     label: "Final round",       icon: I.bolt,  hint: "Onsite / panel" },
  { key: "offer",     label: "Got an offer",      icon: I.spark, hint: "Negotiating now" },
  { key: "landed",    label: "Landed the job",    icon: I.brief, hint: "You're in" },
];

const VIS_OPTS = [
  { key: "private", label: "Private",       note: "Only you and Maya" },
  { key: "win",     label: "Share as a win", note: "Celebrate it in the rooms that helped" },
  { key: "stats",   label: "Anonymous",     note: "Counts toward Hayy's community stats" },
];

// Vertical milestone timeline. `current` = index reached (0-based).
const OutcomeStepper = ({ current = 2, compact = false }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    {OUTCOME_STAGES.map((s, i) => {
      const done = i < current, here = i === current, future = i > current;
      const last = i === OUTCOME_STAGES.length - 1;
      return (
        <div key={s.key} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
          {/* rail */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none" }}>
            <span style={{
              width: here ? 30 : 26, height: here ? 30 : 26, borderRadius: 999, flex: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: done ? "var(--clay)" : here ? "var(--clay)" : "var(--cream)",
              color: (done || here) ? "var(--paper)" : "var(--ink-mute)",
              border: future ? "1.5px solid var(--line)" : "none",
              boxShadow: here ? "0 0 0 5px color-mix(in oklab, var(--clay) 18%, transparent)" : "none",
            }}>
              {done ? React.cloneElement(I.check, { size: 14 }) : React.cloneElement(s.icon, { size: here ? 15 : 13 })}
            </span>
            {!last && <span style={{ width: 2, flex: 1, minHeight: compact ? 18 : 26, background: i < current ? "var(--clay)" : "var(--line)", marginTop: 2, marginBottom: 2 }} />}
          </div>
          {/* label */}
          <div style={{ flex: 1, paddingBottom: last ? 0 : (compact ? 12 : 16), paddingTop: here ? 3 : 4 }}>
            <p style={{ fontSize: 14.5, fontWeight: here ? 700 : done ? 600 : 500, color: future ? "var(--ink-mute)" : "var(--ink)" }}>
              {s.label}{here && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: "var(--clay)", background: "color-mix(in oklab, var(--clay) 13%, transparent)", padding: "2px 8px", borderRadius: 999 }}>NOW</span>}
            </p>
            {(here || (done && !compact && i === current - 1)) && <Meta>{s.hint}</Meta>}
          </div>
        </div>
      );
    })}
  </div>
);

// ════════════════════════ WINS — "Your journey" ════════════════════
const communityWins = [
  { who: "Omar Aziz", role: "Data → PM · RBC", t: "clay", note: "Came back to host", icon: I.mic },
  { who: "Sara Mahmoud", role: "PM · Shopify", t: "olive", note: "Got the offer", icon: I.spark },
  { who: "Dana Liu", role: "Design · Figma", t: "sand", note: "Final round", icon: I.bolt },
];

const WinsScreen = () => {
  const nav = useNav();
  return (
  <DrillScreen
    title="Your journey"
    eyebrow="OUTCOMES"
    footer={<Btn kind="primary" size="xl" iconRight={I.arrow} onClick={() => nav.go("updateOutcome")} style={{ width: "100%", justifyContent: "center" }}>Update a pursuit</Btn>}>
    <div style={{ paddingTop: 6, paddingBottom: 14 }}>

      {/* stat strip */}
      <Card style={{ display: "flex", justifyContent: "space-around", padding: "16px 0", marginBottom: 22 }}>
        {[["2", "PURSUITS"], ["4", "INTERVIEWS"], ["1", "FINAL ROUND"]].map(([n, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--display)", fontSize: 26, lineHeight: 1, color: "var(--clay)" }}>{n}</div>
            <Meta>{l}</Meta>
          </div>
        ))}
      </Card>

      {/* in motion */}
      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-mute)", marginBottom: 12 }}>IN MOTION</p>

      <Card style={{ marginBottom: 12, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
          <Avatar name="Maya Nasrallah" size={40} tone="clay" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Product Manager · AWS</p>
            <Meta>via Maya Nasrallah</Meta>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--clay)", background: "color-mix(in oklab, var(--clay) 12%, transparent)", padding: "4px 10px", borderRadius: 999 }}>FINAL ROUND</span>
        </div>
        <OutcomeStepper current={3} compact />
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <Btn kind="primary" size="md" onClick={() => nav.go("updateOutcome")} style={{ flex: 1, justifyContent: "center" }}>Update status</Btn>
          <Btn kind="soft" size="md" icon={I.msg} onClick={() => nav.go("thread")}>Message Maya</Btn>
        </div>
      </Card>

      <Card style={{ marginBottom: 26, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Avatar name="Layla Park" size={40} tone="olive" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 600 }}>APM · Figma</p>
            <Meta>via Layla Park · Interviewing</Meta>
          </div>
          <Btn kind="soft" size="md" onClick={() => nav.go("updateOutcome")}>Update</Btn>
        </div>
      </Card>

      {/* community wins — proof + flywheel */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-mute)" }}>WINS THIS WEEK</p>
        <Meta>61 intros · 23 hires</Meta>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, paddingBottom: 8 }}>
        {communityWins.map((w, i) => (
          <Card key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", flex: "none" }}>
              <Avatar name={w.who} size={40} tone={w.t} />
              <span style={{ position: "absolute", bottom: -3, right: -3, width: 20, height: 20, borderRadius: 99, background: "var(--clay)", color: "var(--paper)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>{React.cloneElement(w.icon, { size: 10 })}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14.5, fontWeight: 600 }}>{w.who}</p>
              <Meta>{w.role}</Meta>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--clay)" }}>{w.note}</span>
          </Card>
        ))}
      </div>
    </div>
  </DrillScreen>
  );
};

// ════════════════════════ UPDATE OUTCOME (manual) ══════════════════
const UpdateOutcomeSheet = () => {
  const nav = useNav();
  const [pick, setPick] = React.useState(3);
  const [vis, setVis] = React.useState("private");
  const landing = pick === OUTCOME_STAGES.length - 1;
  return (
  <Sheet>
    <div style={{ paddingBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
        <Avatar name="Maya Nasrallah" size={40} tone="clay" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 19 }}>Where are you with this?</h2>
          <Meta>Product Manager · AWS · via Maya</Meta>
        </div>
      </div>

      {/* tappable stages */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
        {OUTCOME_STAGES.map((s, i) => {
          const on = i === pick;
          return (
            <button key={s.key} onClick={() => setPick(i)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14,
              background: on ? "color-mix(in oklab, var(--clay) 10%, var(--paper))" : "var(--paper)",
              border: "1.5px solid " + (on ? "var(--clay)" : "var(--line)"),
              cursor: "pointer", font: "inherit", textAlign: "left", width: "100%",
            }}>
              <span style={{ width: 30, height: 30, borderRadius: 10, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: on ? "var(--clay)" : "var(--cream)", color: on ? "var(--paper)" : "var(--ink-mute)" }}>{React.cloneElement(s.icon, { size: 15 })}</span>
              <span style={{ flex: 1, fontSize: 14.5, fontWeight: on ? 700 : 500 }}>{s.label}</span>
              {on && React.cloneElement(I.check, { size: 18, color: "var(--clay)" })}
            </button>
          );
        })}
      </div>

      {/* visibility */}
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-mute)", marginBottom: 8 }}>WHO SEES THIS</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
        {VIS_OPTS.map(v => {
          const on = v.key === vis;
          return (
            <button key={v.key} onClick={() => setVis(v.key)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12,
              background: "var(--paper)", border: "1px solid " + (on ? "var(--clay)" : "var(--line-soft)"),
              cursor: "pointer", font: "inherit", textAlign: "left", width: "100%",
            }}>
              <span style={{ width: 20, height: 20, borderRadius: 999, flex: "none", border: on ? "6px solid var(--clay)" : "2px solid var(--line)" }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{v.label}</p>
                <Meta>{v.note}</Meta>
              </div>
            </button>
          );
        })}
      </div>

      <Btn kind="primary" size="xl" iconRight={landing ? I.spark : I.check}
        onClick={() => nav.go(landing ? "landed" : "wins")}
        style={{ width: "100%", justifyContent: "center", marginBottom: 8 }}>
        {landing ? "I landed it!" : "Save update"}
      </Btn>
      <button onClick={() => nav.back()} style={{ width: "100%", padding: "10px 0", fontSize: 15, fontWeight: 600, color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
    </div>
  </Sheet>
  );
};

// ════════════════════════ AUTO NUDGE (gentle check-in) ═════════════
const OutcomeNudgeSheet = () => {
  const nav = useNav();
  const quick = [
    { l: "Still going", go: "wins" },
    { l: "Got an interview", go: "wins" },
    { l: "Got an offer", go: "wins" },
    { l: "I landed it!", go: "landed", primary: true },
    { l: "Didn't work out", go: "wins", muted: true },
  ];
  return (
  <Sheet>
    <div style={{ textAlign: "center", padding: "4px 0 6px" }}>
      <Avatar name="Maya Nasrallah" size={56} tone="clay" />
      <h2 style={{ fontSize: 22, marginTop: 14, marginBottom: 8 }}>How did it go with Maya?</h2>
      <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.5, marginBottom: 22, padding: "0 8px" }}>
        She introduced you at AWS two weeks ago. A quick update helps Maya — and helps us know what's working.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {quick.map(q => (
          <button key={q.l} onClick={() => nav.go(q.go)} style={{
            padding: "14px 16px", borderRadius: 14, cursor: "pointer", font: "inherit", fontSize: 15, fontWeight: 600,
            background: q.primary ? "var(--clay)" : "var(--paper)",
            color: q.primary ? "var(--paper)" : q.muted ? "var(--ink-mute)" : "var(--ink)",
            border: q.primary ? "none" : "1px solid var(--line)",
          }}>{q.l}</button>
        ))}
      </div>
      <button onClick={() => nav.back()} style={{ width: "100%", padding: "14px 0 4px", fontSize: 14, fontWeight: 600, color: "var(--ink-mute)", background: "none", border: "none", cursor: "pointer" }}>Remind me later</button>
    </div>
  </Sheet>
  );
};

// ════════════════════════ LANDED — the celebration ═════════════════
const LandedCelebration = () => {
  const nav = useNav();
  const confetti = [
    { l: "8%",  t: "12%", c: "var(--clay)", r: 3 }, { l: "22%", t: "7%",  c: "var(--olive)", r: 4 },
    { l: "78%", t: "9%",  c: "var(--clay)", r: 4 }, { l: "90%", t: "16%", c: "var(--sand, #d8a25e)", r: 3 },
    { l: "14%", t: "26%", c: "var(--olive)", r: 3 }, { l: "84%", t: "28%", c: "var(--clay)", r: 4 },
    { l: "50%", t: "5%",  c: "var(--sand, #d8a25e)", r: 3 }, { l: "64%", t: "20%", c: "var(--olive)", r: 3 },
  ];
  return (
  <div className="hy" style={{
    position: "relative", width: "100%", height: "100%", overflow: "hidden",
    display: "flex", flexDirection: "column", fontFamily: "var(--body)",
    background: "radial-gradient(120% 70% at 50% 0%, color-mix(in oklab, var(--clay) 22%, var(--bg)) 0%, var(--bg) 62%)",
  }}>
    {confetti.map((c, i) => (
      <span key={i} style={{ position: "absolute", left: c.l, top: c.t, width: c.r * 2, height: c.r * 2, borderRadius: c.r, background: c.c, opacity: .9 }} />
    ))}
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingTop: SAFE_TOP + 14, padding: `${SAFE_TOP + 14}px 26px 0`, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <div style={{ width: 88, height: 88, borderRadius: 28, background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 44px -12px color-mix(in oklab, var(--clay) 70%, transparent)", marginBottom: 22 }}>
        {React.cloneElement(I.brief, { size: 40 })}
      </div>
      <p className="mono" style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--clay)", marginBottom: 10 }}>You did it</p>
      <h1 style={{ fontSize: 34, lineHeight: 1.04, marginBottom: 12 }}>You're in. <span className="display-italic">Welcome to product.</span></h1>
      <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.55, maxWidth: 320, marginBottom: 22 }}>
        Product Manager at <b style={{ color: "var(--ink)" }}>AWS</b> — the role you came to Hayy for. It started with one warm intro from Maya.
      </p>

      <Card style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, marginBottom: 14, textAlign: "left" }}>
        <Avatar name="Maya Nasrallah" size={44} tone="clay" />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14.5, fontWeight: 600 }}>Thank Maya</p>
          <Meta>She'll see her intro landed</Meta>
        </div>
        <Btn kind="soft" size="md" icon={I.heart} onClick={() => nav.go("thread")}>Thank</Btn>
      </Card>
    </div>

    <div style={{ position: "relative", zIndex: 2, flex: "none", padding: "14px 22px 34px", display: "flex", flexDirection: "column", gap: 9, borderTop: "1px solid var(--line-soft)", background: "color-mix(in oklab, var(--paper) 88%, transparent)", backdropFilter: "blur(10px)" }}>
      <Btn kind="primary" size="xl" iconRight={I.shake} onClick={() => nav.go("giveBack")} style={{ width: "100%", justifyContent: "center" }}>Pay it forward</Btn>
      <button onClick={() => nav.go("wins")} style={{ width: "100%", padding: "8px 0", fontSize: 15, fontWeight: 600, color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer" }}>Share my win</button>
    </div>
  </div>
  );
};

// ════════════════════════ GIVE BACK — the flywheel ═════════════════
const GiveBackSheet = () => {
  const nav = useNav();
  const opts = [
    { icon: I.mic,   label: "Host a room", note: "Tell newcomers how you broke in", go: "schedule" },
    { icon: I.shake, label: "Open to referrals", note: "Refer the next person at AWS", go: "wins" },
    { icon: I.users, label: "Become a mentor", note: "Take coffee chats from seekers", go: "wins" },
  ];
  return (
  <Sheet>
    <div style={{ padding: "2px 0 4px" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>You got the warm intro.<br /><span className="display-italic">Be one.</span></h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5, padding: "0 6px" }}>
          Every hire who comes back makes the next intro warmer. Here's how to give back.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {opts.map(o => (
          <button key={o.label} onClick={() => nav.go(o.go)} style={{
            display: "flex", alignItems: "center", gap: 13, padding: "14px 16px", borderRadius: 16,
            background: "var(--paper)", border: "1px solid var(--line)", cursor: "pointer", font: "inherit", textAlign: "left", width: "100%",
          }}>
            <span style={{ width: 42, height: 42, borderRadius: 13, flex: "none", background: "color-mix(in oklab, var(--clay) 12%, var(--paper))", color: "var(--clay)", display: "flex", alignItems: "center", justifyContent: "center" }}>{React.cloneElement(o.icon, { size: 19 })}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{o.label}</p>
              <Meta>{o.note}</Meta>
            </div>
            {React.cloneElement(I.arrow, { size: 17 })}
          </button>
        ))}
      </div>
      <button onClick={() => nav.go("home")} style={{ width: "100%", padding: "10px 0", fontSize: 15, fontWeight: 600, color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer" }}>Maybe later</button>
    </div>
  </Sheet>
  );
};

// ════════════════════════ PUSH — shared notification card ══════════
const PushCard = ({ title, body, time = "now", accent = false, big = false }) => (
  <div style={{
    background: "rgba(255,255,255,.82)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    borderRadius: 22, padding: "12px 14px", display: "flex", gap: 11, alignItems: "flex-start",
    boxShadow: "0 8px 26px -10px rgba(40,25,15,.4)", border: "1px solid rgba(255,255,255,.5)",
  }}>
    <span style={{ width: 38, height: 38, borderRadius: 10, flex: "none", background: accent ? "var(--clay)" : "var(--ink)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <HayyMark size={0.34} color="var(--paper)" />
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1714" }}>{title}</p>
        <span style={{ fontSize: 11, color: "#7a7065", flex: "none" }}>{time}</span>
      </div>
      <p style={{ fontSize: 13, color: "#3a342e", lineHeight: 1.35, marginTop: 2, ...(big ? {} : { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }) }}>{body}</p>
    </div>
  </div>
);

// ── LOCK SCREEN — clock + stacked notifications ──
const LockScreen = () => {
  const nav = useNav();
  return (
  <div className="hy" style={{
    position: "relative", width: "100%", height: "100%", overflow: "hidden", fontFamily: "var(--body)",
    background: "linear-gradient(180deg, #efe2d2 0%, #e3cdb4 38%, #c98f63 100%)",
    display: "flex", flexDirection: "column",
  }}>
    {/* clock */}
    <div style={{ paddingTop: SAFE_TOP + 18, textAlign: "center", color: "#3a2c20" }}>
      <p style={{ fontSize: 15, fontWeight: 600, letterSpacing: ".02em", opacity: .85 }}>Tuesday, May 31</p>
      <p style={{ fontFamily: "var(--display)", fontSize: 86, lineHeight: .96, fontWeight: 500, letterSpacing: "-.02em", marginTop: 2 }}>9:41</p>
    </div>

    {/* notifications */}
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 9, padding: "0 12px 14px" }}>
      <p className="mono" style={{ fontSize: 10, letterSpacing: ".1em", color: "#5a4636", textTransform: "uppercase", paddingLeft: 8, marginBottom: 2 }}>Notification Center</p>
      <div onClick={() => nav.go("landed")} style={{ cursor: "pointer" }}>
        <PushCard accent big title="Maya Nasrallah · referral accepted" body="“I just sent your profile to the hiring manager at AWS — they want to talk this week.” 🎉" time="2m ago" />
      </div>
      <PushCard accent title="Room 04 starts in 5 min" body="Breaking into Product at Big Tech — you RSVP'd. Tap to join." time="5m ago" />
      <PushCard title="Omar landed a PM role at RBC" body="A room you were in helped. Say congrats — he's hosting next week." time="1h ago" />
    </div>

    {/* home indicator handled by device; hint */}
    <div style={{ textAlign: "center", paddingBottom: 22, color: "#4a392c" }}>
      <p style={{ fontSize: 12.5, fontWeight: 600, opacity: .8 }}>Swipe up to open · tap a card</p>
    </div>
  </div>
  );
};

// ── PUSH BANNER — slides over an app screen ──
const PushBanner = () => {
  const nav = useNav();
  return (
  <div className="hy" style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", fontFamily: "var(--body)", background: "var(--bg)" }}>
    <Wash />
    {/* faint app behind */}
    <div style={{ position: "absolute", inset: 0, opacity: .5, filter: "blur(1px)" }}>
      <div style={{ paddingTop: SAFE_TOP + 8, padding: `${SAFE_TOP + 8}px 22px 0` }}>
        <p className="mono" style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--clay)" }}>TONIGHT</p>
        <h1 style={{ fontSize: 32, lineHeight: 1.04, marginTop: 7 }}>Good evening, <span className="display-italic">Adam.</span></h1>
        <Card style={{ marginTop: 20, height: 150 }} />
        <Card style={{ marginTop: 12, height: 90 }} />
      </div>
    </div>
    {/* banner */}
    <div style={{ position: "absolute", top: SAFE_TOP - 8, left: 10, right: 10, zIndex: 5, animation: "hySlideDown .5s cubic-bezier(.2,.8,.2,1)" }}
      onClick={() => nav.go("speaking")}>
      <PushCard accent title="Maya invited you to speak" body="Room 04 · Breaking into Product at Big Tech — she just raised your hand. Tap to step up." time="now" />
    </div>
    <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, textAlign: "center" }}>
      <p style={{ fontSize: 12.5, color: "var(--ink-mute)", fontWeight: 600 }}>Banner · tap to open, swipe up to dismiss</p>
    </div>
    <style>{`@keyframes hySlideDown { from { transform: translateY(-130%); opacity: 0 } to { transform: none; opacity: 1 } }`}</style>
  </div>
  );
};

// ── NOTIFICATION CENTER — grouped, pulled down ──
const NotifCenter = () => {
  const nav = useNav();
  return (
  <div className="hy" style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", fontFamily: "var(--body)",
    background: "linear-gradient(180deg, #d9c2a8 0%, #c99f78 100%)" }}>
    <div style={{ flex: 1, overflowY: "auto", height: "100%", paddingTop: SAFE_TOP + 6, padding: `${SAFE_TOP + 6}px 12px 28px` }}>
      <div style={{ textAlign: "center", marginBottom: 16, color: "#3a2c20" }}>
        <p style={{ fontFamily: "var(--display)", fontSize: 40, lineHeight: 1, fontWeight: 500 }}>9:41</p>
        <p style={{ fontSize: 13, fontWeight: 600, opacity: .85, marginTop: 2 }}>Tuesday, May 31</p>
      </div>

      {/* grouped Hayy stack */}
      <div style={{ position: "relative", marginBottom: 14 }}>
        <div style={{ position: "absolute", left: 10, right: 10, top: 10, height: 40, borderRadius: 22, background: "rgba(255,255,255,.45)", filter: "blur(.3px)" }} />
        <div style={{ position: "absolute", left: 5, right: 5, top: 5, height: 44, borderRadius: 22, background: "rgba(255,255,255,.62)" }} />
        <div style={{ position: "relative" }}>
          <PushCard accent big title="Maya Nasrallah · referral accepted" body="“Sent your profile to the hiring manager at AWS — they want to talk this week.”" time="2m" />
        </div>
        <div onClick={() => nav.go("activity")} style={{ textAlign: "center", marginTop: 7, cursor: "pointer" }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#4a392c" }}>Hayy · 4 more notifications ⌄</span>
        </div>
      </div>

      <p className="mono" style={{ fontSize: 10, letterSpacing: ".1em", color: "#5a4636", textTransform: "uppercase", paddingLeft: 10, marginBottom: 8 }}>Earlier today</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <PushCard title="Room 04 starts in 5 min" body="Breaking into Product at Big Tech — you RSVP'd." time="5m" />
        <PushCard title="Layla Park reacted to your question" body="“That scoping question was sharp.”" time="1h" />
        <PushCard title="Omar landed a PM role at RBC" body="A room you were in helped — say congrats." time="1h" />
      </div>
    </div>
  </div>
  );
};

Object.assign(window, {
  OUTCOME_STAGES, OutcomeStepper, WinsScreen, UpdateOutcomeSheet, OutcomeNudgeSheet,
  LandedCelebration, GiveBackSheet, PushCard, LockScreen, PushBanner, NotifCenter,
});
