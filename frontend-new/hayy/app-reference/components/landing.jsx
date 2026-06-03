// Hayy — Hero landing pages that flow directly into the app layout.
// Two desktop directions + a mobile flow. Each is ONE continuous scroll:
// editorial hero → how-it-works → social proof → a transition zone → the
// REAL app layout (DashboardA / LiveRoomB), full-bleed, no fake screenshot.
//
//   Daybreak  — warm throughout; the page rises into the Home dashboard.
//   Nightfall — warm hero that dims to dusk and lands you inside tonight's room.

// ──────────────────────────────────────────────────────────────────
// Shared chrome
// ──────────────────────────────────────────────────────────────────
const LandNav = ({ isMobile, onDark = false }) => (
  <header style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: isMobile ? "20px 22px" : "26px 64px",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      <span style={{
        width: 28, height: 28, color: "var(--clay)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg viewBox="0 0 64 64" width="28" height="28" fill="currentColor" aria-label="Hayy">
          <rect x="12" y="9" width="9" height="46" rx="2.2" />
          <rect x="43" y="9" width="9" height="46" rx="2.2" />
          <circle cx="32" cy="32" r="7" />
        </svg>
      </span>
      <span style={{ fontFamily: "var(--display)", fontSize: 21, fontWeight: 500, letterSpacing: "0.2em" }}>HAYY</span>
    </div>
    {!isMobile && (
      <nav style={{ display: "flex", gap: 30, fontSize: 14, color: "var(--ink-soft)" }}>
        <span>Rooms</span><span>Hosts</span><span>For recruiters</span><span>Stories</span>
      </nav>
    )}
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {!isMobile && <Btn kind="ghost">Sign in</Btn>}
      <Btn kind="primary">Join Hayy</Btn>
    </div>
  </header>
);

const SectionLabel = ({ children, color = "var(--clay)" }) => (
  <span className="mono" style={{
    fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color,
    display: "inline-flex", alignItems: "center", gap: 8,
  }}>{children}</span>
);

const onStage = [
  "Maya Nasrallah · Sr PM, AWS",
  "Rashid Khoury · Eng Mgr, Amazon",
  "Jenna Sun · Talent, Shopify",
  "Omar Aziz · Data, RBC",
  "Layla Park · Design, Figma",
  "Priya Shah · Recruiter, Stripe",
];

// ──────────────────────────────────────────────────────────────────
// HERO (shared editorial roster hero — minor variant via `tone`)
// ──────────────────────────────────────────────────────────────────
const LandHero = ({ isMobile, kicker, headline, sub }) => (
  <section className="hy-bg-hero" style={{
    minHeight: isMobile ? "auto" : 760, display: "flex", flexDirection: "column",
    paddingBottom: isMobile ? 28 : 56,
  }}>
    <LandNav isMobile={isMobile} />
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
      padding: isMobile ? "16px 22px 0" : "0 64px", position: "relative",
    }}>
      <div style={{ marginBottom: isMobile ? 16 : 26 }}>
        <SectionLabel><span className="hy-livedot" />{kicker}</SectionLabel>
      </div>
      <h1 style={{
        fontSize: isMobile ? 46 : 104, lineHeight: 0.94, letterSpacing: "-0.04em",
        fontWeight: 500, maxWidth: 1040,
      }}>{headline}</h1>
      <p style={{
        marginTop: isMobile ? 18 : 26, fontSize: isMobile ? 16 : 20, color: "var(--ink-soft)",
        maxWidth: 540, lineHeight: 1.5,
      }}>{sub}</p>
      <div style={{ marginTop: isMobile ? 22 : 34, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Btn kind="primary" size={isMobile ? "lg" : "xl"} iconRight={I.arrow}>Reserve a seat</Btn>
        <Btn kind="soft" size={isMobile ? "lg" : "xl"} icon={I.spark}>See who's hosting</Btn>
      </div>

      {/* On-stage roster */}
      <div style={{
        marginTop: isMobile ? 30 : 54, display: "flex", flexWrap: "wrap", gap: "10px 20px",
        maxWidth: 920, fontSize: 13, color: "var(--ink-soft)", alignItems: "center",
      }}>
        <SectionLabel>On stage tonight</SectionLabel>
        {(isMobile ? onStage.slice(0, 4) : onStage).map((n, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Avatar name={n} size={22} tone={["clay", "olive", "sand", "dark"][i % 4]} />
            {n}
          </span>
        ))}
      </div>

      {!isMobile && (
        <div style={{
          position: "absolute", right: 64, bottom: 0, display: "flex", gap: 26, textAlign: "right",
        }}>
          {[["412", "MEMBERS"], ["38", "COMPANIES"], ["61", "WARM INTROS"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "var(--display)", fontSize: 40, lineHeight: 1 }}>{n}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".12em" }}>{l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────
// HOW IT WORKS — three editorial steps
// ──────────────────────────────────────────────────────────────────
const steps = [
  { n: "01", t: "Drop into a room", b: "Join a live conversation with people already inside the companies you're aiming for. No résumé blast. No cold DMs.", icon: I.mic },
  { n: "02", t: "Get warm", b: "Ask a question, share your story, raise a hand. Hosts remember the people who show up — that's how a stranger becomes a contact.", icon: I.hand2 },
  { n: "03", t: "Ask for the referral", b: "When the moment's right, request the intro. A referral born from a real conversation is one that actually lands.", icon: I.shake },
];

const HowItWorks = ({ isMobile }) => (
  <section style={{ padding: isMobile ? "44px 22px" : "96px 64px", background: "var(--bg)" }}>
    <div style={{ maxWidth: 560, marginBottom: isMobile ? 28 : 52 }}>
      <SectionLabel>How Hayy works</SectionLabel>
      <h2 style={{ fontSize: isMobile ? 30 : 46, marginTop: 14, lineHeight: 1.02 }}>
        Three rooms between a stranger and a <span className="display-italic">yes.</span>
      </h2>
    </div>
    <div style={{
      display: "grid", gap: isMobile ? 12 : 24,
      gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    }}>
      {steps.map((s) => (
        <div key={s.n} className="hy-card" style={{ padding: isMobile ? 22 : 30, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{
              width: 44, height: 44, borderRadius: 14, background: "var(--cream)",
              border: "1px solid var(--line)", display: "flex", alignItems: "center",
              justifyContent: "center", color: "var(--clay)",
            }}>{s.icon}</span>
            <span style={{ fontFamily: "var(--display)", fontSize: 34, color: "var(--line)" }}>{s.n}</span>
          </div>
          <h3 style={{ fontSize: 23 }}>{s.t}</h3>
          <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>{s.b}</p>
        </div>
      ))}
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────
// PROOF — quote + companies + counters
// ──────────────────────────────────────────────────────────────────
const companies = ["Amazon", "Shopify", "RBC", "Figma", "Stripe", "Notion", "Wealthsimple", "Cohere"];

const Proof = ({ isMobile }) => (
  <section style={{
    padding: isMobile ? "44px 22px" : "84px 64px", background: "var(--cream)",
    borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)",
  }}>
    <div style={{
      display: "grid", gap: isMobile ? 28 : 56,
      gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", alignItems: "center",
    }}>
      <div>
        <SectionLabel>Hayy diaries №07</SectionLabel>
        <h2 style={{ fontSize: isMobile ? 28 : 44, marginTop: 16, lineHeight: 1.06, maxWidth: 640 }}>
          "I joined Shopify two weeks after my <span className="display-italic">first Hayy room.</span>"
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 22 }}>
          <Avatar name="Sara M" size={40} tone="olive" />
          <div>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Sara M.</p>
            <p style={{ fontSize: 12, color: "var(--ink-mute)" }}>Product Designer · joined Mar '26</p>
          </div>
        </div>
      </div>
      <div>
        <SectionLabel color="var(--ink-mute)">Where members landed</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {companies.map((c) => (
            <span key={c} className="hy-pill" style={{ textTransform: "none", letterSpacing: 0, fontSize: 13, padding: "7px 14px" }}>{c}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 28, marginTop: 28 }}>
          {[["412", "members"], ["38", "companies"], ["61", "warm intros"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "var(--display)", fontSize: 30, lineHeight: 1 }}>{n}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".1em", marginTop: 4 }}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────
// TRANSITION ZONE — the bridge from marketing into the live product
// ──────────────────────────────────────────────────────────────────
const Bridge = ({ isMobile, label, headline, sub, dark = false }) => (
  <section style={{
    padding: isMobile ? "48px 22px 26px" : "104px 64px 0",
    textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center",
    background: dark
      ? "linear-gradient(180deg, var(--bg) 0%, var(--dusk-bg) 100%)"
      : "var(--bg)",
  }}>
    <SectionLabel>{label}</SectionLabel>
    <h2 style={{
      fontSize: isMobile ? 30 : 52, marginTop: 18, lineHeight: 1.0, maxWidth: 820,
      color: dark ? "var(--dusk-ink)" : "var(--ink)",
    }}>{headline}</h2>
    <p style={{
      marginTop: 16, fontSize: isMobile ? 15 : 18, color: dark ? "var(--dusk-ink-soft)" : "var(--ink-soft)",
      maxWidth: 540, lineHeight: 1.5,
    }}>{sub}</p>
    <span style={{
      marginTop: isMobile ? 26 : 40, marginBottom: isMobile ? 4 : -2, color: dark ? "var(--dusk-clay)" : "var(--clay)",
      display: "inline-flex",
    }}>
      <Icon d="M12 5v14M19 12l-7 7-7-7" size={26} />
    </span>
  </section>
);

// The full-bleed app slab — the actual app layout rising into view.
const AppSlab = ({ children, height, isMobile, dark = false }) => (
  <section style={{
    padding: isMobile ? "16px 14px 0" : "36px 56px 0",
    background: dark
      ? "var(--dusk-bg)"
      : "linear-gradient(180deg, var(--bg) 0%, color-mix(in oklab, var(--clay) 8%, var(--bg)) 100%)",
  }}>
    <div style={{
      height, borderRadius: "20px 20px 0 0", overflow: "hidden",
      border: "1px solid var(--line)", borderBottom: "none",
      boxShadow: dark ? "0 -30px 90px -30px rgba(0,0,0,.6)" : "var(--shadow-warm)",
    }}>
      {children}
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────
// FOOTER
// ──────────────────────────────────────────────────────────────────
const LandFooter = ({ isMobile, dark = false }) => (
  <footer style={{
    padding: isMobile ? "48px 22px 36px" : "80px 64px 48px",
    background: dark ? "var(--dusk-paper)" : "var(--ink)",
    color: dark ? "var(--dusk-ink)" : "var(--paper)",
  }}>
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "flex-end",
      gap: 24, flexDirection: isMobile ? "column" : "row",
    }}>
      <div>
        <SectionLabel color={dark ? "var(--dusk-clay)" : "var(--clay-2)"}>Your seat is open</SectionLabel>
        <h2 style={{ fontSize: isMobile ? 36 : 64, marginTop: 14, lineHeight: 0.98, color: "inherit" }}>
          Careers grow<br /><span style={{ fontStyle: "italic", color: dark ? "var(--dusk-clay)" : "var(--clay-2)" }}>in conversation.</span>
        </h2>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Btn kind="primary" size="xl" iconRight={I.arrow}>Reserve a seat</Btn>
      </div>
    </div>
    <div style={{
      marginTop: isMobile ? 36 : 56, paddingTop: 24,
      borderTop: `1px solid ${dark ? "var(--dusk-line)" : "rgba(255,255,255,.15)"}`,
      display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
      fontSize: 13, color: dark ? "var(--dusk-ink-mute)" : "rgba(255,255,255,.6)",
    }}>
      <span style={{ fontFamily: "var(--display)", letterSpacing: ".2em", fontSize: 15 }}>HAYY</span>
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
        <span>Rooms</span><span>Hosts</span><span>For recruiters</span><span>Stories</span><span>Privacy</span>
      </div>
      <span className="mono" style={{ fontSize: 11 }}>© 2026 Hayy</span>
    </div>
  </footer>
);

// ══════════════════════════════════════════════════════════════════
// OPTION A — DAYBREAK · warm scroll that becomes the Home dashboard
// ══════════════════════════════════════════════════════════════════
const LandingDaybreak = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <div className="hy" style={{ width: "100%", background: "var(--bg)" }}>
      <LandHero
        isMobile={isMobile}
        kicker="Tonight at 7pm · Room 04 · 4 rooms live now"
        headline={<>You're <span className="display-italic">two&nbsp;rooms</span> away<br />from the conversation that<br />changes <span style={{ borderBottom: "3px solid var(--clay)", paddingBottom: 4 }}>everything.</span></>}
        sub="Hayy is a live community where you meet the people inside the companies you care about — not their inboxes. Drop in, get warm, then ask for the referral."
      />
      <HowItWorks isMobile={isMobile} />
      <Proof isMobile={isMobile} />
      <Bridge
        isMobile={isMobile}
        label="And then ↓"
        headline={<>Tomorrow morning, this is <span className="display-italic">waiting for you.</span></>}
        sub="Every room you join, every hand you raise, every yes — it all lands here, in your Hayy. This isn't a screenshot. It's the app."
      />
      <AppSlab isMobile={isMobile} height={isMobile ? 720 : 820}>
        <DashboardA device={device} />
      </AppSlab>
      <LandFooter isMobile={isMobile} />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// OPTION B — NIGHTFALL · warm hero dims into tonight's dusk live room
// ══════════════════════════════════════════════════════════════════
const LandingNightfall = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <div className="hy" style={{ width: "100%", background: "var(--bg)" }}>
      <LandHero
        isMobile={isMobile}
        kicker="The rooms open at dusk · Tonight 7pm"
        headline={<>The best <span className="display-italic">introductions</span><br />happen after <span style={{ borderBottom: "3px solid var(--clay)", paddingBottom: 4 }}>hours.</span></>}
        sub="When the workday ends, Hayy's rooms light up. Real people, inside real companies, talking openly — and you have a seat at the table."
      />
      <HowItWorks isMobile={isMobile} />
      {/* dusk wrapper for the bridge + app + footer */}
      <div data-palette="dusk">
        <Bridge
          isMobile={isMobile}
          dark
          label="The lights come down ↓"
          headline={<>Step inside <span style={{ fontStyle: "italic", color: "var(--dusk-clay)" }}>tonight's room.</span></>}
          sub="No screenshot, no demo. This is the live room you'd walk into — host in the center, the people who can help you on the stage around them."
        />
        <AppSlab isMobile={isMobile} height={isMobile ? 720 : 820} dark>
          <LiveRoomB device={device} />
        </AppSlab>
        <LandFooter isMobile={isMobile} dark />
      </div>
    </div>
  );
};

Object.assign(window, { LandingDaybreak, LandingNightfall });
