// Landing Hero — two directions, desktop + mobile.
// A: "Live now" hero — shows an actual live room card front-and-center.
// B: "Roster" hero — names of the people you'd meet, type-led.

const HeroA = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <div className="hy hy-bg-hero" style={{
      width: "100%", height: "100%", padding: isMobile ? 20 : 56,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <HeroNav isMobile={isMobile} />

      <div style={{
        flex: 1, display: "grid", gap: isMobile ? 24 : 56,
        gridTemplateColumns: isMobile ? "1fr" : "1.05fr 1fr", alignItems: "center",
        marginTop: isMobile ? 20 : 40,
      }}>
        <div>
          <span className="hy-pill" style={{ marginBottom: isMobile ? 16 : 22 }}>
            <span className="hy-livedot" /> 4 rooms live now
          </span>
          <h1 style={{
            fontSize: isMobile ? 44 : 84, fontWeight: 500, lineHeight: 0.98,
            letterSpacing: "-0.035em",
          }}>
            Careers grow<br />
            <span className="display-italic">in conversation.</span>
          </h1>
          <p style={{
            marginTop: isMobile ? 16 : 24, fontSize: isMobile ? 16 : 19,
            color: "var(--ink-soft)", maxWidth: 480, lineHeight: 1.5,
          }}>
            Hayy is a live community where you meet the people inside companies
            you care about — not their inboxes. Drop into a room, get warm,
            then ask for the referral.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: isMobile ? 22 : 32, flexWrap: "wrap" }}>
            <Btn kind="primary" size={isMobile ? "lg" : "xl"} iconRight={I.arrow}>Join the next room</Btn>
            <Btn kind="soft" size={isMobile ? "lg" : "xl"}>Become a host</Btn>
          </div>
          <div style={{
            display: "flex", gap: isMobile ? 14 : 22, marginTop: isMobile ? 22 : 36,
            alignItems: "center", flexWrap: "wrap",
          }}>
            <div style={{ display: "flex" }}>
              {["AB", "MN", "RK", "JS"].map((n, i) => (
                <span key={i} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                  <Avatar name={n} size={isMobile ? 28 : 34}
                    tone={["clay", "olive", "sand", "dark"][i]} />
                </span>
              ))}
            </div>
            <div className="mono" style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.4 }}>
              412 members joined<br />from 38 companies this week
            </div>
          </div>
        </div>

        {!isMobile && <LiveRoomPreview />}
      </div>

      {isMobile && <div style={{ marginTop: 24 }}><LiveRoomPreview compact /></div>}
    </div>
  );
};

const HeroNav = ({ isMobile }) => (
  <header style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    paddingBottom: isMobile ? 0 : 8,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{
        width: 30, height: 30, borderRadius: 10, background: "var(--clay)",
        color: "var(--paper)", display: "inline-flex", alignItems: "center",
        justifyContent: "center", fontFamily: "var(--display)", fontWeight: 600, fontSize: 18,
        fontStyle: "italic",
      }}>h</span>
      <span style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 500 }}>Hayy</span>
    </div>
    {!isMobile && (
      <nav style={{ display: "flex", gap: 28, fontSize: 14, color: "var(--ink-soft)" }}>
        <span>Rooms</span><span>Hosts</span><span>For recruiters</span><span>Stories</span>
      </nav>
    )}
    <div style={{ display: "flex", gap: 8 }}>
      {!isMobile && <Btn kind="ghost">Sign in</Btn>}
      <Btn kind="primary">Join Hayy</Btn>
    </div>
  </header>
);

const LiveRoomPreview = ({ compact = false }) => (
  <div className="hy-card" style={{
    padding: compact ? 18 : 24, borderRadius: "var(--radius-xl)",
    boxShadow: "var(--shadow-warm)", position: "relative",
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <LiveTag>Live · 18 listening</LiveTag>
      <span className="mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>ROOM 04</span>
    </div>
    <h3 style={{ fontSize: compact ? 22 : 28, marginTop: 14, lineHeight: 1.1 }}>
      Breaking into Amazon as<br />a newcomer to Canada
    </h3>
    <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 8 }}>
      Hosted by Maya · 3 referral hosts on stage
    </p>

    <div style={{
      marginTop: 18, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14,
    }}>
      {[
        { n: "Maya N.", r: "Sr PM · AWS", on: true, t: "clay" },
        { n: "Rashid K.", r: "Eng Mgr · Amazon", on: true, t: "olive" },
        { n: "Jenna S.", r: "Recruiter", on: false, t: "sand" },
        { n: "Omar A.", r: "Listener", on: false, t: "dark" },
      ].map((p, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Avatar name={p.n} size={52} tone={p.t} />
            {p.on && <span style={{
              position: "absolute", inset: -4, borderRadius: "50%",
              border: "2px solid var(--clay)",
            }} />}
            {p.on && <span style={{
              position: "absolute", bottom: -2, right: -2, width: 18, height: 18,
              borderRadius: 999, background: "var(--paper)", border: "1px solid var(--line)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--clay)",
            }}><Waveform bars={3} height={8} color="var(--clay)" /></span>}
          </div>
          <p style={{ fontSize: 11, marginTop: 6, fontWeight: 500 }}>{p.n.split(" ")[0]}</p>
          <p style={{ fontSize: 10, color: "var(--ink-mute)" }}>{p.r}</p>
        </div>
      ))}
    </div>

    <div style={{
      marginTop: 18, padding: "12px 14px", borderRadius: "var(--radius-md)",
      background: "var(--cream)", display: "flex", alignItems: "center", gap: 12,
    }}>
      <Waveform bars={20} height={22} color="var(--clay)" />
      <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
        "I joined Amazon two years ago through a Hayy room…"
      </span>
    </div>

    <div style={{
      marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div className="mono" style={{ fontSize: 11, color: "var(--ink-mute)" }}>
        Started 14 min ago · ends in ~30
      </div>
      <Btn kind="primary" iconRight={I.arrow}>Tap to join</Btn>
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────────
// HERO B — Type-led roster hero. No hero card. Names of the room.
// ──────────────────────────────────────────────────────────────────
const HeroB = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const names = [
    "Maya Nasrallah · Sr PM, AWS",
    "Rashid Khoury · Eng Mgr, Amazon",
    "Jenna Sun · Talent, Shopify",
    "Omar Aziz · Data, RBC",
    "Layla Park · Design, Figma",
    "Ben Tanaka · Founder",
    "Priya Shah · Recruiter, Stripe",
    "Diego Rivas · PM, Notion",
  ];
  return (
    <div className="hy" style={{
      width: "100%", height: "100%", padding: isMobile ? 20 : 56, background: "var(--bg)",
      display: "flex", flexDirection: "column", overflow: "hidden", position: "relative",
    }}>
      <HeroNav isMobile={isMobile} />

      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        marginTop: isMobile ? 24 : 0,
      }}>
        <div className="mono" style={{
          fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase",
          color: "var(--clay)", display: "flex", alignItems: "center", gap: 8,
          marginBottom: isMobile ? 16 : 28,
        }}>
          <span className="hy-livedot" />
          Tonight at 7pm · Room 04
        </div>
        <h1 style={{
          fontSize: isMobile ? 48 : 112, lineHeight: 0.92, letterSpacing: "-0.04em",
          fontWeight: 500, maxWidth: 1100,
        }}>
          You're <span className="display-italic">two&nbsp;rooms</span> away<br />
          from the conversation<br />
          that changes <span style={{ borderBottom: "3px solid var(--clay)", paddingBottom: 4 }}>everything.</span>
        </h1>

        <div style={{
          marginTop: isMobile ? 22 : 36, display: "flex", gap: 10, flexWrap: "wrap",
        }}>
          <Btn kind="primary" size={isMobile ? "lg" : "xl"} iconRight={I.arrow}>
            Reserve a seat
          </Btn>
          <Btn kind="soft" size={isMobile ? "lg" : "xl"} icon={I.spark}>
            See who's hosting
          </Btn>
        </div>

        {!isMobile && (
          <div style={{
            marginTop: 56, display: "flex", flexWrap: "wrap", gap: "8px 18px",
            maxWidth: 900, fontSize: 13, color: "var(--ink-soft)",
          }}>
            <span className="mono" style={{ color: "var(--clay)", fontSize: 11, letterSpacing: ".1em", width: "100%" }}>
              ON STAGE TONIGHT —
            </span>
            {names.map((n, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Avatar name={n} size={22} tone={["clay", "olive", "sand", "dark"][i % 4]} />
                {n}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* corner micro-stat */}
      {!isMobile && (
        <div style={{
          position: "absolute", right: 56, bottom: 40, display: "flex", gap: 24,
          alignItems: "flex-end", textAlign: "right",
        }}>
          <div>
            <div style={{ fontFamily: "var(--display)", fontSize: 38, lineHeight: 1 }}>412</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".1em" }}>MEMBERS</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--display)", fontSize: 38, lineHeight: 1 }}>38</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".1em" }}>COMPANIES</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--display)", fontSize: 38, lineHeight: 1 }}>61</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".1em" }}>WARM&nbsp;INTROS</div>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { HeroA, HeroB });
