// Profile redesigns — two directions inspired by read.cv/Calendly and LinkedIn/Polywork/Geneva.
// Replaces the original story-led Profile in the canvas. Reuses Sidebar/MobileTopbar/MobileTabbar/primitives.

// Shared bits ─────────────────────────────────────────────────────
const PStat = ({ n, l, accent }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <p style={{ fontFamily: "var(--display)", fontSize: 28, lineHeight: 1, fontWeight: 500, color: accent || "var(--ink)" }}>{n}</p>
    <p className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".08em", textTransform: "uppercase" }}>{l}</p>
  </div>
);

// ──────────────────────────────────────────────────────────────────
// A. "The vouch" — read.cv × Calendly. Single column, ask is the spine.
// ──────────────────────────────────────────────────────────────────
const ProfileVouch = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const path = [
    { y: "2024 —", role: "Senior Product Designer", co: "Wealthsimple" },
    { y: "2021–24", role: "Product Designer", co: "Shopify · Toronto" },
    { y: "2018–21", role: "Product Designer", co: "Fawry · Cairo" },
    { y: "2016–18", role: "Visual Designer", co: "Independent" },
  ];
  const helps = [
    { l: "Coffee chat (30 min)", d: "3 / month · Wed, Fri, Sun", primary: true },
    { l: "Resume review", d: "Async · same-week reply" },
    { l: "Portfolio review", d: "60 min · for designers only" },
    { l: "Mock interview", d: "60 min · product design rounds" },
  ];
  const rooms = [
    { t: "Newcomer designers Q&A", when: "Bi-weekly · Thu 7pm", attendees: 47, role: "Host" },
    { t: "Breaking into Amazon as a newcomer", when: "Tue Apr 29", attendees: 34, role: "Co-host" },
    { t: "Designing your way into Figma", when: "Apr 12", attendees: 28, role: "Speaker" },
  ];

  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Profile" />}

      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {isMobile && <div style={{ padding: "18px 18px 0" }}><MobileTopbar /></div>}

        <div style={{
          flex: 1, overflow: "hidden",
          padding: isMobile ? "16px 22px 22px" : "56px 96px 48px",
          maxWidth: isMobile ? "100%" : 760, width: "100%", margin: "0 auto",
          display: "flex", flexDirection: "column", gap: isMobile ? 26 : 44,
        }}>

          {/* Identity — quiet, type-led */}
          <header style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ position: "relative" }}>
                <Avatar name="Amira Hassan" size={isMobile ? 56 : 64} tone="dark" />
                <span style={{
                  position: "absolute", bottom: -2, right: -2, width: 14, height: 14, borderRadius: 99,
                  background: "var(--olive)", border: "3px solid var(--bg)",
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ fontSize: isMobile ? 28 : 36, lineHeight: 1.05 }}>Amira Hassan</h1>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 4 }}>
                  Senior Product Designer · Wealthsimple · Toronto
                </p>
              </div>
            </div>

            <p style={{
              fontFamily: "var(--display)",
              fontSize: isMobile ? 22 : 28, lineHeight: 1.3, fontWeight: 400,
              color: "var(--ink)", maxWidth: 600,
            }}>
              I'm here because I rebuilt my career from scratch in a new country —
              and I want to make that path shorter for the next person.
            </p>

            {/* Status pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 10px 5px 8px", borderRadius: 999,
                background: "var(--cream)", border: "1px solid var(--olive)",
                fontSize: 12, fontWeight: 500, color: "var(--olive)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--olive)" }} />
                Open to coffee chats
              </span>
              <span style={{
                padding: "5px 10px", borderRadius: 999, background: "transparent",
                border: "1px solid var(--line)", fontSize: 12, fontWeight: 500, color: "var(--ink-soft)",
              }}>Refers from MENA & Canada</span>
              <span style={{
                padding: "5px 10px", borderRadius: 999, background: "transparent",
                border: "1px solid var(--line)", fontSize: 12, fontWeight: 500, color: "var(--ink-soft)",
              }}>Hosts every 2 weeks</span>
            </div>
          </header>

          {/* Quiet stat row — proof, not a flex */}
          <div style={{
            display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: isMobile ? 16 : 28,
            paddingTop: 22, paddingBottom: 22,
            borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)",
          }}>
            <PStat n="61" l="Warm intros made" accent="var(--clay)" />
            <PStat n="12" l="Rooms hosted · 6mo" />
            <PStat n="98%" l="Replies within a week" />
            <PStat n="3" l="Years on Hayy" />
          </div>

          {/* THE ASK — the most prominent block */}
          <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>
                Ask me for
              </p>
              <h2 style={{ fontSize: isMobile ? 22 : 26, marginTop: 6 }}>
                What you can <span className="display-italic">actually</span> book.
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {helps.map(h => (
                <div key={h.l} style={{
                  padding: isMobile ? 14 : 18,
                  borderRadius: 14,
                  background: h.primary ? "var(--paper)" : "transparent",
                  border: "1px solid " + (h.primary ? "var(--clay)" : "var(--line-soft)"),
                  boxShadow: h.primary ? "var(--shadow-soft)" : "none",
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>{h.l}</p>
                    <p style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 4 }}>{h.d}</p>
                  </div>
                  <Btn kind={h.primary ? "primary" : "soft"} size="md" iconRight={I.arrow}>Book</Btn>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "var(--ink-mute)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "var(--olive)" }}>{I.lock}</span>
              Replies in 3.4 days on average. You'll never be auto-routed.
            </p>
          </section>

          {/* Path */}
          <section style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <h2 style={{ fontSize: isMobile ? 22 : 26 }}>The path here</h2>
            <div>
              {path.map((r, i) => (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "84px 1fr" : "120px 1fr",
                  gap: isMobile ? 12 : 24,
                  padding: "14px 0",
                  borderTop: i === 0 ? "1px solid var(--line-soft)" : "1px dashed var(--line-soft)",
                }}>
                  <p className="mono" style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em", paddingTop: 3 }}>{r.y}</p>
                  <p style={{ fontFamily: "var(--display)", fontSize: 17, fontWeight: 500 }}>
                    {r.role} <span style={{ color: "var(--ink-mute)", fontWeight: 400 }}>· {r.co}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Rooms — what she hosts */}
          <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={{ fontSize: isMobile ? 22 : 26 }}>Rooms I host</h2>
              <span className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".06em" }}>SEE ALL ·  12 →</span>
            </div>
            <div>
              {rooms.map((r, i) => (
                <div key={r.t} style={{
                  display: "grid", gridTemplateColumns: isMobile ? "1fr auto" : "1fr 200px auto",
                  gap: 14, alignItems: "center",
                  padding: "16px 0",
                  borderTop: i === 0 ? "1px solid var(--line-soft)" : "1px dashed var(--line-soft)",
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Pill style={{ background: r.role === "Host" ? "var(--clay)" : "var(--cream)",
                        color: r.role === "Host" ? "var(--paper)" : "var(--ink-soft)", borderColor: "transparent" }}>{r.role}</Pill>
                    </div>
                    <p style={{ fontFamily: "var(--display)", fontSize: 17, fontWeight: 500, marginTop: 6, lineHeight: 1.2 }}>{r.t}</p>
                    {isMobile && <p className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 4, letterSpacing: ".06em" }}>{r.when} · {r.attendees} attended</p>}
                  </div>
                  {!isMobile && <p className="mono" style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em" }}>{r.when}</p>}
                  {!isMobile && <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>{r.attendees} attended</span>}
                </div>
              ))}
            </div>
          </section>

          {/* Vouches */}
          <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h2 style={{ fontSize: isMobile ? 22 : 26 }}>Vouches</h2>
            {[
              { who: "Diego Rivas", role: "PM at Notion · referred Mar 2024", t: "olive",
                q: "Amira's the reason I got my Shopify interview. She didn't just refer me — she rehearsed answers with me on a Sunday." },
              { who: "Sara Mahmoud", role: "Eng at Shopify · referred Apr 2024", t: "sand",
                q: "I'd been job-searching for nine months. One coffee chat with Amira reframed how I told my story. Offer in three weeks." },
            ].map(v => (
              <div key={v.who} style={{
                padding: 18, borderRadius: 14, background: "var(--cream)", border: "1px solid var(--line-soft)",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                <p style={{ fontFamily: "var(--display)", fontSize: 16, fontStyle: "italic", lineHeight: 1.45 }}>
                  "{v.q}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={v.who} size={28} tone={v.t} />
                  <p style={{ fontSize: 12, color: "var(--ink-mute)" }}>
                    <b style={{ color: "var(--ink)" }}>{v.who}</b> · {v.role}
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* Mutuals */}
          <section style={{
            display: "flex", alignItems: "center", gap: 14,
            paddingTop: 22, borderTop: "1px solid var(--line-soft)",
          }}>
            <div style={{ display: "flex" }}>
              {[{ n: "Maya N", t: "clay" }, { n: "Rashid K", t: "olive" }, { n: "Layla P", t: "sand" }, { n: "Sara M", t: "dark" }].map((p, i) => (
                <div key={p.n} style={{ marginLeft: i === 0 ? 0 : -8, border: "2px solid var(--bg)", borderRadius: 999 }}>
                  <Avatar name={p.n} size={30} tone={p.t} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>
              <b style={{ color: "var(--ink)" }}>4 mutual connections</b> · including Maya, Rashid, Layla, and 1 more
            </p>
          </section>
        </div>

        {/* Sticky bottom bar — the always-available CTA */}
        <div style={{
          padding: isMobile ? "12px 18px" : "16px 96px",
          borderTop: "1px solid var(--line-soft)", background: "var(--paper)",
          display: "flex", gap: 8,
          maxWidth: isMobile ? "100%" : 1000, width: "100%", margin: "0 auto",
        }}>
          <Btn kind="primary" size={isMobile ? "md" : "lg"} icon={I.shake} style={{ flex: 1, justifyContent: "center" }}>Request a referral</Btn>
          <Btn kind="soft" size={isMobile ? "md" : "lg"} icon={I.cal} style={{ flex: 1, justifyContent: "center" }}>Book a chat</Btn>
          {!isMobile && <Btn kind="ghost" size="lg" icon={I.msg}>Message</Btn>}
        </div>
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// B. "The roster" — LinkedIn × Polywork × Geneva. Header card + tabbed body.
// Default tab is Rooms (Hayy is rooms-first), not About.
// ──────────────────────────────────────────────────────────────────
const ProfileRoster = ({ device = "desktop", mode = "viewer" }) => {
  const isMobile = device === "mobile";
  const isOwner = mode === "owner";
  const tabs = isOwner
    ? ["Rooms · 12", "Path", "Referrals · 61", "Vouches · 8", "About", "Insights"]
    : ["Rooms · 12", "Path", "Referrals · 61", "Vouches · 8", "About"];
  const recentRooms = [
    { t: "Newcomer designers Q&A", role: "Host", when: "Thu Apr 24", attendees: 12, mins: 52,
      quote: "Amira's portfolio teardown made the whole room rethink IA.", saidBy: "Layla P." },
    { t: "Breaking into Amazon as a newcomer", role: "Co-host", when: "Tue Apr 29", attendees: 34, mins: 47,
      quote: "She rehearsed answers with me on a Sunday. Best 30 mins of my year.", saidBy: "Diego R." },
    { t: "Designing your way into Figma", role: "Speaker", when: "Apr 12", attendees: 28, mins: 64 },
    { t: "Late-night portfolio teardown", role: "Host", when: "Apr 5", attendees: 9, mins: 72 },
  ];

  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Profile" />}

      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {isMobile && <div style={{ padding: "18px 18px 0" }}><MobileTopbar /></div>}

        {/* Header card — banner-feel without an image */}
        <div style={{
          padding: isMobile ? "0 18px" : "24px 48px 0",
        }}>
          <div className="hy-card" style={{
            padding: 0, overflow: "hidden", borderRadius: "var(--radius-xl)",
          }}>
            {/* warm wash band */}
            <div style={{
              height: isMobile ? 80 : 110,
              background:
                "radial-gradient(ellipse at 80% 60%, hsl(28 55% 86% / .8), transparent 55%)," +
                "radial-gradient(ellipse at 0% 40%, hsl(12 50% 80% / .55), transparent 60%)," +
                "var(--cream)",
              borderBottom: "1px solid var(--line-soft)",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: 14, right: 16,
                display: "flex", alignItems: "center", gap: 8,
                padding: "5px 10px 5px 8px", borderRadius: 999,
                background: "var(--paper)", border: "1px solid var(--olive)",
                fontSize: 12, fontWeight: 500, color: "var(--olive)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--olive)" }} />
                Open to coffee chats
                {isOwner && <span style={{ color: "var(--ink-mute)", fontSize: 11 }}>· edit</span>}
              </div>
              {isOwner && (
                <div style={{
                  position: "absolute", top: 14, left: 16,
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "5px 10px", borderRadius: 999,
                  background: "var(--ink)", color: "var(--paper)",
                  fontSize: 11, fontWeight: 500, letterSpacing: ".04em",
                }}>
                  This is how you appear to others
                </div>
              )}
            </div>

            <div style={{
              padding: isMobile ? "0 18px 18px" : "0 28px 24px",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "auto 1fr auto",
              gap: isMobile ? 14 : 24,
              alignItems: "flex-end",
            }}>
              <div style={{ marginTop: isMobile ? -34 : -42 }}>
                <div style={{ display: "inline-block", borderRadius: 999, border: "4px solid var(--paper)" }}>
                  <Avatar name="Amira Hassan" size={isMobile ? 76 : 96} tone="dark" />
                </div>
              </div>

              <div style={{ minWidth: 0, paddingTop: isMobile ? 0 : 18 }}>
                <h1 style={{ fontSize: isMobile ? 26 : 34, lineHeight: 1.05 }}>Amira Hassan</h1>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 4 }}>
                  Senior Product Designer · Wealthsimple · Toronto, Canada
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {[
                    { l: "Host", clay: true },
                    { l: "Mentor" },
                    { l: "Refers · MENA + Canada" },
                    { l: "3 yrs on Hayy" },
                  ].map(b => (
                    <span key={b.l} style={{
                      padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500,
                      background: b.clay ? "var(--clay)" : "transparent",
                      color: b.clay ? "var(--paper)" : "var(--ink-soft)",
                      border: "1px solid " + (b.clay ? "transparent" : "var(--line)"),
                    }}>{b.l}</span>
                  ))}
                </div>
              </div>

              <div style={{
                paddingTop: isMobile ? 4 : 18,
                display: "flex", gap: 8, flexWrap: "wrap",
                justifyContent: isMobile ? "stretch" : "flex-end",
              }}>
                {isOwner ? (
                  isMobile ? (
                    <>
                      <Btn kind="primary" size="md" style={{ flex: 1, justifyContent: "center" }}>Edit profile</Btn>
                      <Btn kind="soft" size="md" style={{ flex: 1, justifyContent: "center" }}>Share</Btn>
                    </>
                  ) : (
                    <>
                      <Btn kind="ghost" size="md">Preview as visitor</Btn>
                      <Btn kind="soft" size="md">Share profile</Btn>
                      <Btn kind="primary" size="md">Edit profile</Btn>
                    </>
                  )
                ) : isMobile ? (
                  <>
                    <Btn kind="primary" size="md" icon={I.shake} style={{ flex: 1, justifyContent: "center" }}>Refer me</Btn>
                    <Btn kind="soft" size="md" icon={I.msg} style={{ flex: 1, justifyContent: "center" }}>Message</Btn>
                  </>
                ) : (
                  <>
                    <Btn kind="ghost" size="md">Save</Btn>
                    <Btn kind="soft" size="md" icon={I.msg}>Message</Btn>
                    <Btn kind="primary" size="md" icon={I.shake}>Request a referral</Btn>
                  </>
                )}
              </div>
            </div>

            {/* Stat strip across the bottom of the card */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
              padding: isMobile ? "14px 18px" : "16px 28px",
              borderTop: "1px solid var(--line-soft)", background: "var(--cream)",
              gap: isMobile ? 8 : 0,
            }}>
              {(isOwner ? [
                { n: "7", l: "Pending requests", c: "var(--clay)" },
                { n: "61", l: "Warm intros" },
                { n: "2", l: "Drafts" },
                { n: "312", l: "Profile views · 30d" },
              ] : [
                { n: "61", l: "Warm intros", c: "var(--clay)" },
                { n: "12", l: "Rooms hosted" },
                { n: "8", l: "Vouches" },
                { n: "3.4d", l: "Avg reply" },
              ]).map((s, i) => (
                <div key={s.l} style={{
                  display: "flex", flexDirection: "column", gap: 2, alignItems: isMobile ? "flex-start" : "flex-start",
                  padding: isMobile ? "0" : "0 4px",
                  borderLeft: !isMobile && i > 0 ? "1px solid var(--line-soft)" : "none",
                  paddingLeft: !isMobile && i > 0 ? 18 : 0,
                }}>
                  <p style={{ fontFamily: "var(--display)", fontSize: isMobile ? 20 : 24, lineHeight: 1, fontWeight: 500, color: s.c || "var(--ink)" }}>{s.n}</p>
                  <p className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".08em", textTransform: "uppercase" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          padding: isMobile ? "16px 18px 0" : "20px 48px 0",
          borderBottom: "1px solid var(--line-soft)",
          display: "flex", gap: 4, overflowX: "auto",
        }}>
          {tabs.map((t, i) => (
            <div key={t} style={{
              padding: "12px 14px",
              fontSize: 13, fontWeight: 500,
              color: i === 0 ? "var(--ink)" : "var(--ink-mute)",
              borderBottom: "2px solid " + (i === 0 ? "var(--clay)" : "transparent"),
              whiteSpace: "nowrap", flex: "none",
              marginBottom: -1,
            }}>{t}</div>
          ))}
        </div>

        {/* Body — Rooms tab content */}
        <div style={{ flex: 1, overflow: "hidden",
          padding: isMobile ? "16px 18px" : "24px 48px 28px",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: isMobile ? 22 : 36 }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>Activity</p>
                <h2 style={{ fontSize: 24, marginTop: 4 }}>Recent rooms</h2>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <span style={{ padding: "5px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500, background: "var(--ink)", color: "var(--paper)" }}>All</span>
                <span style={{ padding: "5px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500, color: "var(--ink-mute)", border: "1px solid var(--line)" }}>Hosted</span>
                <span style={{ padding: "5px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500, color: "var(--ink-mute)", border: "1px solid var(--line)" }}>Spoken in</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recentRooms.map((r, i) => (
                <article key={r.t} className="hy-card" style={{
                  padding: isMobile ? 16 : 20,
                  display: "flex", flexDirection: "column", gap: 12,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <Pill style={{ background: r.role === "Host" ? "var(--clay)" : "var(--cream)",
                      color: r.role === "Host" ? "var(--paper)" : "var(--ink-soft)", borderColor: "transparent" }}>{r.role}</Pill>
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".06em" }}>{r.when.toUpperCase()}</span>
                    <span style={{ width: 3, height: 3, borderRadius: 99, background: "var(--ink-mute)" }} />
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".06em" }}>{r.attendees} ATTENDED</span>
                    <span style={{ width: 3, height: 3, borderRadius: 99, background: "var(--ink-mute)" }} />
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".06em" }}>{r.mins} MIN</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--display)", fontSize: 20, fontWeight: 500, lineHeight: 1.2 }}>{r.t}</h3>

                  {r.quote && (
                    <blockquote style={{
                      paddingLeft: 14, borderLeft: "2px solid var(--clay)",
                      fontFamily: "var(--display)", fontStyle: "italic", fontSize: 14,
                      color: "var(--ink-soft)", lineHeight: 1.5,
                    }}>
                      "{r.quote}"
                      <p style={{ marginTop: 6, fontSize: 11, color: "var(--ink-mute)", fontStyle: "normal" }}>— Quoted in recap by {r.saidBy}</p>
                    </blockquote>
                  )}

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Btn kind="soft" size="md">View recap</Btn>
                    {r.role === "Host" && <Btn kind="ghost" size="md">Listen back</Btn>}
                    {isOwner && r.role === "Host" && <Btn kind="ghost" size="md">Edit recap</Btn>}
                    {isOwner && <span className="mono" style={{ marginLeft: "auto", fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".06em" }}>{r.attendees * 4} VIEWS</span>}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right rail */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            {isOwner && (
              <div className="hy-card" style={{ padding: 18, background: "var(--paper)", border: "1px solid var(--clay)" }}>
                <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>Today · needs you</p>
                <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { l: "3 referral requests", d: "Oldest 2d ago" },
                    { l: "1 unread message", d: "From Diego R." },
                    { l: "Recap due", d: "Newcomer Q&A · Apr 24" },
                  ].map(t => (
                    <li key={t.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 8, borderBottom: "1px dashed var(--line-soft)" }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{t.l}</span>
                      <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".06em" }}>{t.d.toUpperCase()}</span>
                    </li>
                  ))}
                </ul>
                <Btn kind="primary" size="md" iconRight={I.arrow} style={{ marginTop: 14, width: "100%", justifyContent: "center" }}>Open inbox</Btn>
              </div>
            )}
            {/* Ask block */}
            <div className="hy-card" style={{ padding: 18, background: "var(--cream)" }}>
              <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>{isOwner ? "Your offers" : "Ask me for"}</p>
              <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { l: "Coffee chat", d: "3 / month" },
                  { l: "Resume review", d: "Async, same week" },
                  { l: "Portfolio review", d: "Designers only" },
                  { l: "Mock interview", d: "PD rounds" },
                ].map(h => (
                  <li key={h.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline",
                    paddingBottom: 8, borderBottom: "1px dashed var(--line-soft)" }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{h.l}</span>
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".06em" }}>{h.d.toUpperCase()}</span>
                  </li>
                ))}
              </ul>
              <Btn kind={isOwner ? "soft" : "primary"} size="md" iconRight={I.arrow} style={{ marginTop: 14, width: "100%", justifyContent: "center" }}>{isOwner ? "Edit offers" : "Book one"}</Btn>
            </div>

            {/* Signature room */}
            <div className="hy-card" style={{
              padding: 18,
              background: "linear-gradient(135deg, var(--clay), var(--clay-2))",
              color: "var(--paper)", borderColor: "transparent",
              boxShadow: "var(--shadow-warm)",
            }}>
              <p className="mono" style={{ fontSize: 10, opacity: .85, letterSpacing: ".12em", textTransform: "uppercase" }}>Signature room · every 2 weeks</p>
              <h3 style={{ fontFamily: "var(--display)", fontSize: 20, marginTop: 6, lineHeight: 1.2, fontWeight: 500 }}>
                Newcomer designers Q&A
              </h3>
              <p style={{ marginTop: 8, fontSize: 12, opacity: .92, lineHeight: 1.5 }}>
                A recurring open room for designers who've moved countries. No slides — just questions you'd ask a friend.
              </p>
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 11, opacity: .9 }}>NEXT · THU MAY 8 · 7PM</span>
                <Btn kind="soft" size="md" style={{ background: "var(--paper)", color: "var(--ink)", borderColor: "transparent" }}>RSVP</Btn>
              </div>
            </div>

            {/* Mutuals (viewer) / Reach (owner) */}
            <div className="hy-card" style={{ padding: 18 }}>
              <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>{isOwner ? "This week's reach" : "You both know"}</p>
              {isOwner ? (
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { l: "Profile views", v: "312 ↗ +18%" },
                    { l: "Booking clicks", v: "47 ↗ +9%" },
                    { l: "New referral asks", v: "3 · Pending", c: "var(--clay)" },
                  ].map(r => (
                    <div key={r.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 13 }}>{r.l}</span>
                      <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: r.c || "var(--ink)" }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex" }}>
                    {[{ n: "Maya N", t: "clay" }, { n: "Rashid K", t: "olive" }, { n: "Layla P", t: "sand" }, { n: "Sara M", t: "dark" }].map((p, i) => (
                      <div key={p.n} style={{ marginLeft: i === 0 ? 0 : -8, border: "2px solid var(--paper)", borderRadius: 999 }}>
                        <Avatar name={p.n} size={30} tone={p.t} />
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                    <b style={{ color: "var(--ink)" }}>4 mutual</b> · including Maya, Rashid
                  </p>
                </div>
              )}
            </div>

            {/* Quiet privacy line */}
            <p style={{ fontSize: 11, color: "var(--ink-mute)", display: "flex", gap: 6, alignItems: "center", lineHeight: 1.5 }}>
              <span style={{ color: "var(--olive)" }}>{I.lock}</span>
              {isOwner ? "Visitors only see published recaps and your public stats." : "Amira sees exactly what you'd send before deciding to reply."}
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
};

Object.assign(window, { ProfileVouch, ProfileRoster });
