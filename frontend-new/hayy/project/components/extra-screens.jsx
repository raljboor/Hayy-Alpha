// Tier 1+2 — Auth, Notifications, DM, Search, Schedule, Recap, Refer, ProfileEdit, Settings
// Re-uses Sidebar / MobileTopbar / MobileTabbar / primitives from earlier scripts.

// Small shared bits ───────────────────────────────────────────────
const SectionLabel = ({ children, color = "var(--clay)" }) => (
  <p className="mono" style={{ fontSize: 11, color, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>{children}</p>
);
const Field = ({ label, children, hint }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".1em", textTransform: "uppercase" }}>{label}</span>
    {children}
    {hint && <span style={{ fontSize: 11, color: "var(--ink-mute)" }}>{hint}</span>}
  </label>
);
const Input = ({ value, placeholder, mono, style }) => (
  <div className={mono ? "mono" : ""} style={{
    padding: "12px 14px", borderRadius: 12, border: "1px solid var(--line)",
    background: "var(--paper)", fontSize: 14, color: value ? "var(--ink)" : "var(--ink-mute)",
    ...style,
  }}>{value || placeholder}</div>
);
const Switch = ({ on }) => (
  <span style={{
    width: 36, height: 22, borderRadius: 99, padding: 2, flex: "none",
    background: on ? "var(--clay)" : "var(--line)",
    display: "inline-flex", alignItems: "center", justifyContent: on ? "flex-end" : "flex-start",
    transition: "all .2s",
  }}>
    <span style={{ width: 18, height: 18, borderRadius: 99, background: "var(--paper)", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
  </span>
);

// ──────────────────────────────────────────────────────────────────
// 1. AUTH — Sign in / Sign up. Editorial left, form right.
// ──────────────────────────────────────────────────────────────────
const Auth = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <div className="hy hy-bg-hero" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden" }}>
      {!isMobile && (
        <aside style={{
          width: "44%", padding: "48px 56px", display: "flex", flexDirection: "column",
          justifyContent: "space-between", borderRight: "1px solid var(--line-soft)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 28, height: 28, borderRadius: 10, background: "var(--clay)", color: "var(--paper)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--display)", fontStyle: "italic", fontWeight: 600, fontSize: 17 }}>h</span>
            <span style={{ fontFamily: "var(--display)", fontSize: 19 }}>Hayy</span>
          </div>

          <div>
            <SectionLabel>An invite-only network</SectionLabel>
            <h1 style={{ fontSize: 56, marginTop: 14, lineHeight: 1.0 }}>
              Where the next <span className="display-italic">conversation</span><br />becomes the next chapter.
            </h1>
            <p style={{ marginTop: 18, fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 440 }}>
              Hayy connects newcomers and operators in MENA & North America through small, honest rooms. Members refer 8× more often than they apply.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex" }}>
              {["clay", "olive", "sand", "dark"].map((t, i) => (
                <div key={i} style={{ marginLeft: i === 0 ? 0 : -10, border: "2px solid var(--paper)", borderRadius: 999 }}>
                  <Avatar name={["Maya N", "Rashid K", "Layla P", "Sara M"][i]} size={36} tone={t} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>1,247 members</span> · 312 rooms hosted this month
            </p>
          </div>
        </aside>
      )}

      <main style={{
        flex: 1, padding: isMobile ? "32px 22px" : "56px 64px",
        display: "flex", flexDirection: "column", justifyContent: isMobile ? "flex-start" : "center",
        gap: 22, overflow: "hidden",
      }}>
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ width: 28, height: 28, borderRadius: 10, background: "var(--clay)", color: "var(--paper)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--display)", fontStyle: "italic", fontWeight: 600, fontSize: 17 }}>h</span>
            <span style={{ fontFamily: "var(--display)", fontSize: 19 }}>Hayy</span>
          </div>
        )}

        <div style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <SectionLabel>Welcome back</SectionLabel>
            <h2 style={{ fontSize: isMobile ? 32 : 38, marginTop: 8, lineHeight: 1.1 }}>
              Sign in to <span className="display-italic">Hayy.</span>
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Email">
              <Input value="amira@hayy.community" mono />
            </Field>
            <Field label="Password">
              <Input value="••••••••••••" />
            </Field>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-soft)" }}>
                <span style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid var(--clay)",
                  background: "var(--clay)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--paper)" }}>{I.check}</span>
                Keep me signed in
              </label>
              <span style={{ fontSize: 13, color: "var(--clay)", fontWeight: 500 }}>Forgot?</span>
            </div>
          </div>

          <Btn kind="primary" size="lg" iconRight={I.arrow} style={{ justifyContent: "center", width: "100%" }}>Continue</Btn>

          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--ink-mute)", fontSize: 11 }}>
            <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
            <span className="mono" style={{ letterSpacing: ".12em", textTransform: "uppercase" }}>or</span>
            <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Btn kind="soft" size="lg" style={{ justifyContent: "center", width: "100%" }}>Continue with Google</Btn>
            <Btn kind="soft" size="lg" style={{ justifyContent: "center", width: "100%" }}>Use a magic link</Btn>
          </div>

          <p style={{ fontSize: 13, color: "var(--ink-soft)", textAlign: "center", marginTop: 4 }}>
            New here? <span style={{ color: "var(--clay)", fontWeight: 500 }}>Request an invite →</span>
          </p>
        </div>
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// 2. NOTIFICATIONS — editorial inbox, grouped by recency.
// ──────────────────────────────────────────────────────────────────
const Notifications = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const groups = [
    { label: "Today", date: "Tue · Apr 29", items: [
      { kind: "referral", who: "Maya Nasrallah", t: "clay", title: "accepted your referral request", body: "She'll intro you to a Sr PM at Stripe this week.", time: "12 min ago", action: "Open thread" },
      { kind: "room", who: "Rashid Khoury", t: "olive", title: "is hosting in 30 min", body: "Product, Data & Software Career Room — you RSVP'd.", time: "1h ago", action: "Join now", live: true },
      { kind: "mention", who: "Layla Park", t: "sand", title: "mentioned you in a recap", body: "\"Amira's portfolio teardown made the whole room rethink IA.\"", time: "3h ago", action: "Read recap" },
    ]},
    { label: "Yesterday", date: "Mon · Apr 28", items: [
      { kind: "msg", who: "Diego Rivas", t: "dark", title: "sent you a message", body: "\"Thank you again — onboarding starts Monday.\"", time: "Yesterday, 6pm", action: "Reply" },
      { kind: "referral", who: "Priya Shah", t: "olive", title: "asked you for a warm intro", body: "Wants to connect with someone at Wealthsimple.", time: "Yesterday, 2pm", action: "Decide" },
    ]},
    { label: "This week", date: "Apr 24 — 27", items: [
      { kind: "room", who: "You", t: "clay", title: "hosted Newcomer designers Q&A", body: "12 attended · 3 follow-up referrals queued.", time: "Thu · Apr 24", action: "View recap" },
    ]},
  ];
  const kindLabel = { referral: "Referral", room: "Room", mention: "Mention", msg: "Message" };
  const filters = ["All", "Mentions", "Referrals", "Rooms", "Messages"];

  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Notifications" />}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

        <div style={{ padding: isMobile ? "18px 18px 12px" : "28px 48px 18px", borderBottom: "1px solid var(--line-soft)",
          display: "flex", flexDirection: "column", gap: 14 }}>
          {isMobile && <MobileTopbar />}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
            <div>
              <SectionLabel>Inbox</SectionLabel>
              <h1 style={{ fontSize: isMobile ? 30 : 42, marginTop: 6 }}>
                <span style={{ color: "var(--clay)" }}>6</span> things <span className="display-italic">need you</span>.
              </h1>
            </div>
            <Btn kind="ghost" size="md">Mark all read</Btn>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {filters.map((f, i) => (
              <button key={f} style={{
                padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500,
                background: i === 0 ? "var(--ink)" : "transparent",
                color: i === 0 ? "var(--paper)" : "var(--ink-soft)",
                border: "1px solid " + (i === 0 ? "var(--ink)" : "var(--line)"),
              }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflow: "hidden", padding: isMobile ? "12px 18px" : "16px 48px 24px" }}>
          {groups.map(g => (
            <section key={g.label} style={{
              display: "grid", gridTemplateColumns: isMobile ? "1fr" : "140px 1fr",
              gap: isMobile ? 10 : 28, paddingTop: 16, paddingBottom: 4,
              borderTop: "1px solid var(--line-soft)", marginTop: 8,
            }}>
              <div>
                <h2 style={{ fontSize: isMobile ? 18 : 22, lineHeight: 1.1 }}>{g.label}</h2>
                <p className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 4, letterSpacing: ".08em", textTransform: "uppercase" }}>{g.date}</p>
              </div>
              <div>
                {g.items.map((it, i) => (
                  <article key={i} style={{
                    display: "grid", gridTemplateColumns: isMobile ? "auto 1fr" : "auto 1fr auto",
                    gap: isMobile ? 12 : 18, alignItems: "center",
                    padding: isMobile ? "12px 0" : "14px 0",
                    borderTop: i === 0 ? "0" : "1px dashed var(--line-soft)",
                  }}>
                    <Avatar name={it.who} size={isMobile ? 38 : 44} tone={it.t} />
                    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <Pill style={{ background: "var(--cream)" }}>{kindLabel[it.kind]}</Pill>
                        {it.live && <LiveTag>Live</LiveTag>}
                        <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)" }}>{it.time}</span>
                      </div>
                      <p style={{ fontSize: isMobile ? 14 : 15 }}>
                        <span style={{ fontWeight: 600 }}>{it.who}</span>{" "}
                        <span style={{ color: "var(--ink-soft)" }}>{it.title}</span>
                      </p>
                      <p style={{ fontSize: 13, color: "var(--ink-mute)", lineHeight: 1.5 }}>{it.body}</p>
                      {isMobile && (
                        <div style={{ marginTop: 6 }}>
                          <Btn kind={it.live ? "primary" : "soft"} size="md">{it.action}</Btn>
                        </div>
                      )}
                    </div>
                    {!isMobile && <Btn kind={it.live ? "primary" : "soft"} size="md" iconRight={it.live ? I.arrow : undefined}>{it.action}</Btn>}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {isMobile && <div style={{ padding: "0 18px 12px" }}><MobileTabbar /></div>}
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// 3. DM THREAD — conversation list + open thread.
// ──────────────────────────────────────────────────────────────────
const Messages = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const convos = [
    { who: "Maya Nasrallah", role: "Sr PM · AWS", t: "clay", last: "I can intro you Thursday — does 4pm work?", time: "12m", unread: 2, active: true },
    { who: "Diego Rivas", role: "PM · Notion", t: "dark", last: "Thank you again — onboarding starts Mon.", time: "Yest", unread: 0 },
    { who: "Priya Shah", role: "Recruiter · Stripe", t: "olive", last: "Your resume looks great. One question—", time: "Mon", unread: 1 },
    { who: "Layla Park", role: "Designer · Figma", t: "sand", last: "Recap clip is up. You came across so calm.", time: "Apr 24", unread: 0 },
    { who: "Sara Mahmoud", role: "Eng · Shopify", t: "dark", last: "Drinks on me when I land in TO 🇨🇦", time: "Apr 22", unread: 0 },
  ];
  const messages = [
    { who: "Maya", t: "clay", side: "them", text: "Hey Amira — saw your referral request. Tell me a bit about what you're looking for at Stripe?", time: "Tue · 9:14am" },
    { who: "Amira", t: "dark", side: "me", text: "Thank you for getting back so fast! I'm targeting Sr PM, Payments — ideally on the merchant side. 8 yrs at Wealthsimple/Shopify, mostly fintech.", time: "Tue · 9:21am" },
    { who: "Maya", t: "clay", side: "them", text: "Perfect — I work directly with the hiring manager there. Send me your resume + a 3-line note I can paste.", time: "Tue · 9:24am" },
    { who: "Amira", t: "dark", side: "me", text: "On it. Also — would a quick coffee chat first make this easier? I want to be sure I pitch myself the way you'd want to vouch for.", time: "Tue · 9:26am" },
    { who: "Maya", t: "clay", side: "them", text: "I love that you asked. Yes. I can intro you Thursday — does 4pm work?", time: "Tue · 9:28am" },
  ];

  // On mobile, show only the open thread.
  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Messages" />}

      {!isMobile && (
        <aside style={{
          width: 320, borderRight: "1px solid var(--line)", background: "var(--paper)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid var(--line-soft)" }}>
            <SectionLabel>Conversations</SectionLabel>
            <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 12, background: "var(--cream)",
              display: "flex", alignItems: "center", gap: 8, color: "var(--ink-mute)", fontSize: 13 }}>
              {I.search}<span>Search messages</span>
            </div>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            {convos.map(c => (
              <div key={c.who} style={{
                padding: "14px 18px", display: "flex", gap: 12, alignItems: "center",
                background: c.active ? "var(--cream)" : "transparent",
                borderLeft: c.active ? "2px solid var(--clay)" : "2px solid transparent",
                cursor: "pointer",
              }}>
                <Avatar name={c.who} size={40} tone={c.t} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{c.who}</p>
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)" }}>{c.time}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 1 }}>{c.role}</p>
                  <p style={{ fontSize: 12, color: c.unread ? "var(--ink)" : "var(--ink-soft)",
                    fontWeight: c.unread ? 500 : 400,
                    marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last}</p>
                </div>
                {c.unread > 0 && (
                  <span className="mono" style={{ fontSize: 10, padding: "2px 7px", borderRadius: 999,
                    background: "var(--clay)", color: "var(--paper)", flex: "none" }}>{c.unread}</span>
                )}
              </div>
            ))}
          </div>
        </aside>
      )}

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)" }}>
        {/* Thread header */}
        <div style={{
          padding: isMobile ? "16px 18px" : "20px 28px",
          borderBottom: "1px solid var(--line-soft)",
          display: "flex", alignItems: "center", gap: 14, background: "var(--paper)",
        }}>
          {isMobile && <span style={{ color: "var(--ink-soft)", fontSize: 18 }}>‹</span>}
          <Avatar name="Maya Nasrallah" size={isMobile ? 38 : 42} tone="clay" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--display)", fontSize: isMobile ? 18 : 20, fontWeight: 500 }}>Maya Nasrallah</p>
            <p style={{ fontSize: 11, color: "var(--olive)", marginTop: 1, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--olive)" }} />
              Online · Sr PM at AWS
            </p>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", gap: 6 }}>
              <Btn kind="soft" size="md" icon={I.cal}>Schedule</Btn>
              <Btn kind="ghost" size="md">{I.more}</Btn>
            </div>
          )}
          {isMobile && <Btn kind="ghost" size="md">{I.more}</Btn>}
        </div>

        {/* Thread context strip */}
        <div style={{
          padding: isMobile ? "10px 18px" : "10px 28px",
          background: "var(--cream)", borderBottom: "1px solid var(--line-soft)",
          display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--ink-soft)",
        }}>
          <span style={{ color: "var(--clay)" }}>{I.shake}</span>
          <span>This thread is about a referral to <b style={{ color: "var(--ink)" }}>Stripe · Sr PM, Payments</b></span>
          {!isMobile && <span style={{ marginLeft: "auto", color: "var(--clay)", fontWeight: 500 }}>View context →</span>}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: "hidden", padding: isMobile ? "16px 18px" : "20px 28px",
          display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column",
              alignItems: m.side === "me" ? "flex-end" : "flex-start",
              gap: 4,
            }}>
              <div style={{
                maxWidth: "78%",
                padding: "12px 16px", borderRadius: 18,
                background: m.side === "me" ? "var(--clay)" : "var(--paper)",
                color: m.side === "me" ? "var(--paper)" : "var(--ink)",
                border: m.side === "me" ? "none" : "1px solid var(--line-soft)",
                borderBottomRightRadius: m.side === "me" ? 6 : 18,
                borderBottomLeftRadius: m.side === "me" ? 18 : 6,
                fontSize: 14, lineHeight: 1.5,
              }}>{m.text}</div>
              <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", padding: "0 6px" }}>{m.time}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <Avatar name="Maya" size={22} tone="clay" />
            <span style={{ display: "inline-flex", gap: 3, alignItems: "center", padding: "8px 12px", borderRadius: 14,
              background: "var(--paper)", border: "1px solid var(--line-soft)" }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--ink-mute)", animation: "hy-bar .9s infinite alternate" }} />
              <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--ink-mute)", animation: "hy-bar .9s infinite alternate .15s" }} />
              <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--ink-mute)", animation: "hy-bar .9s infinite alternate .3s" }} />
            </span>
            <span style={{ fontSize: 11, color: "var(--ink-mute)" }}>Maya is typing…</span>
          </div>
        </div>

        {/* Composer */}
        <div style={{
          padding: isMobile ? "12px 14px 14px" : "16px 28px 22px",
          borderTop: "1px solid var(--line-soft)", background: "var(--paper)",
          display: "flex", gap: 10, alignItems: "flex-end",
        }}>
          <div style={{
            flex: 1, padding: "10px 14px", borderRadius: 18,
            background: "var(--cream)", border: "1px solid var(--line)",
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <p style={{ fontSize: 14, color: "var(--ink)" }}>Thursday at 4 works perfectly. Sending the resume + note now.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ink-mute)" }}>
              <span style={{ fontSize: 12 }}>📎</span>
              <span style={{ fontSize: 12 }}>Resume_Amira_2026.pdf</span>
            </div>
          </div>
          <Btn kind="primary" size="md" iconRight={I.arrow}>Send</Btn>
        </div>
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// 4. SEARCH / DISCOVER — editorial, three lanes (people, rooms, topics)
// ──────────────────────────────────────────────────────────────────
const Search = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const people = [
    { who: "Maya Nasrallah", role: "Sr PM · AWS", t: "clay", reason: "4 mutuals · hosts Stripe AMA", open: true },
    { who: "Rashid Khoury", role: "Eng Manager · Amazon", t: "olive", reason: "Refers from your home country", open: true },
    { who: "Layla Park", role: "Designer · Figma", t: "sand", reason: "Same role · same city", open: false },
  ];
  const rooms = [
    { t: "Breaking into Amazon", host: "Maya N.", when: "Tonight", live: true, tag: "Tech" },
    { t: "Stripe recruiter AMA", host: "Priya S.", when: "Wed 12pm", live: false, tag: "Tech" },
    { t: "Career Access for Newcomers", host: "Layla P.", when: "Sat 11am", live: false, tag: "Newcomers" },
  ];
  const topics = ["Newcomer · Canada", "Product · Fintech", "Design systems", "Resume teardown", "MENA founders", "Operations roles"];

  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Search" />}

      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: isMobile ? "18px 18px 12px" : "32px 48px 18px", borderBottom: "1px solid var(--line-soft)" }}>
          {isMobile && <MobileTopbar />}
          <SectionLabel>Discover</SectionLabel>
          <h1 style={{ fontSize: isMobile ? 30 : 42, marginTop: 6, lineHeight: 1.05 }}>
            Find the <span className="display-italic">right</span> room, person, or thread.
          </h1>
          <div style={{
            marginTop: 18, padding: "14px 18px", borderRadius: 16,
            background: "var(--paper)", border: "1.5px solid var(--clay)",
            display: "flex", alignItems: "center", gap: 12, boxShadow: "var(--shadow-soft)",
          }}>
            <span style={{ color: "var(--clay)" }}>{I.search}</span>
            <span style={{ flex: 1, fontSize: 16, color: "var(--ink)" }}>stripe payments referral</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)", padding: "3px 8px",
              borderRadius: 6, background: "var(--cream)" }}>⌘K</span>
          </div>
          <p style={{ marginTop: 10, fontSize: 12, color: "var(--ink-mute)" }}>
            <span style={{ color: "var(--clay)", fontWeight: 500 }}>17 results</span> across people, rooms, and topics.
          </p>
        </div>

        <div style={{ flex: 1, overflow: "hidden", padding: isMobile ? "16px 18px" : "20px 48px 28px",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: isMobile ? 18 : 32 }}>

          {/* People */}
          <section style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={{ fontSize: 22 }}>People · 6</h2>
              <span className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".06em" }}>SEE ALL →</span>
            </div>
            {people.map(p => (
              <div key={p.who} className="hy-card" style={{
                padding: 16, display: "flex", gap: 14, alignItems: "center",
              }}>
                <Avatar name={p.who} size={44} tone={p.t} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{p.who}</p>
                    {p.open && <Pill style={{ background: "var(--cream)", color: "var(--olive)" }}>Open to chat</Pill>}
                  </div>
                  <p style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>{p.role}</p>
                  <p className="mono" style={{ fontSize: 10, color: "var(--clay)", marginTop: 6, letterSpacing: ".06em" }}>
                    ↳ {p.reason.toUpperCase()}
                  </p>
                </div>
                <Btn kind="soft" size="md">View</Btn>
              </div>
            ))}

            <div style={{ marginTop: 8 }}>
              <h2 style={{ fontSize: 22 }}>Rooms · 8</h2>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                {rooms.map(r => (
                  <div key={r.t} style={{
                    padding: 14, borderRadius: 14, background: "var(--paper)", border: "1px solid var(--line-soft)",
                    display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <div className="mono" style={{ fontSize: 11, color: r.live ? "var(--clay)" : "var(--ink)",
                      fontWeight: 600, width: 60, flex: "none" }}>
                      {r.live ? "NOW" : r.when.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {r.live && <LiveTag>Live</LiveTag>}
                        <p style={{ fontFamily: "var(--display)", fontSize: 16, fontWeight: 500 }}>{r.t}</p>
                      </div>
                      <p style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>{r.host} · {r.tag}</p>
                    </div>
                    <Btn kind={r.live ? "primary" : "soft"} size="md">{r.live ? "Join" : "RSVP"}</Btn>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right — topics, recents, helper */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            <div className="hy-card" style={{ padding: 18 }}>
              <SectionLabel>Topics</SectionLabel>
              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {topics.map(t => <Pill key={t}>{t}</Pill>)}
              </div>
            </div>

            <div className="hy-card" style={{ padding: 18 }}>
              <SectionLabel>Recent searches</SectionLabel>
              <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {["fintech newcomer", "stripe sr pm", "design systems mentor", "amazon hiring"].map(q => (
                  <li key={q} style={{ fontSize: 13, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--ink-mute)" }}>{I.search}</span>{q}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              padding: 18, borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, var(--clay), var(--clay-2))",
              color: "var(--paper)", boxShadow: "var(--shadow-warm)",
            }}>
              <SectionLabel color="rgba(255,255,255,.85)">Tip</SectionLabel>
              <p style={{ fontFamily: "var(--display)", fontSize: 18, marginTop: 8, lineHeight: 1.3 }}>
                Try natural sentences — <i>"who can intro me to a PM at Stripe"</i>.
              </p>
            </div>
          </aside>
        </div>

        {isMobile && <div style={{ padding: "0 18px 12px" }}><MobileTabbar /></div>}
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// 5. SCHEDULE A ROOM — form-led, with live preview card.
// ──────────────────────────────────────────────────────────────────
const ScheduleRoom = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Rooms" />}

      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: isMobile ? "18px 18px 12px" : "28px 48px 18px",
          borderBottom: "1px solid var(--line-soft)",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          {isMobile && <MobileTopbar />}
          <div>
            <SectionLabel>New room</SectionLabel>
            <h1 style={{ fontSize: isMobile ? 28 : 38, marginTop: 6 }}>
              Host a <span className="display-italic">conversation</span>.
            </h1>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn kind="ghost" size="md">Save draft</Btn>
              <Btn kind="primary" size="md" iconRight={I.arrow}>Schedule room</Btn>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflow: "hidden", padding: isMobile ? "18px 18px" : "24px 48px 28px",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", gap: isMobile ? 22 : 40 }}>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
            <Field label="Room title">
              <Input value="Breaking into Amazon as a newcomer" />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Date">
                <Input value="Tue · Apr 29, 2026" />
              </Field>
              <Field label="Time">
                <Input value="7:00pm — 8:15pm EST" />
              </Field>
            </div>

            <Field label="Format">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { l: "Open audio", d: "Anyone can speak", on: true },
                  { l: "Hosted Q&A", d: "Hands raised only", on: false },
                  { l: "Closed circle", d: "RSVP-only", on: false },
                ].map(o => (
                  <div key={o.l} style={{
                    padding: 12, borderRadius: 12,
                    background: "var(--paper)",
                    border: "1.5px solid " + (o.on ? "var(--clay)" : "var(--line)"),
                    boxShadow: o.on ? "var(--shadow-soft)" : "none",
                  }}>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{o.l}</p>
                    <p style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 4 }}>{o.d}</p>
                  </div>
                ))}
              </div>
            </Field>

            <Field label="What's it about?" hint="Two sentences. Be honest about who'd benefit.">
              <div style={{
                padding: "12px 14px", borderRadius: 12, border: "1px solid var(--line)",
                background: "var(--paper)", fontSize: 14, color: "var(--ink)",
                lineHeight: 1.55, minHeight: 80,
              }}>
                A small, honest room for engineers and PMs new to Canada who want to land at Amazon. We'll cover the realistic timeline and what to skip.
              </div>
            </Field>

            <Field label="Co-hosts">
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "8px 8px",
                borderRadius: 12, border: "1px solid var(--line)", background: "var(--paper)" }}>
                {[{ n: "Rashid K.", t: "olive" }, { n: "Maya N.", t: "clay" }].map(p => (
                  <span key={p.n} style={{ display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "4px 10px 4px 4px", borderRadius: 999, background: "var(--cream)" }}>
                    <Avatar name={p.n} size={22} tone={p.t} />
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{p.n}</span>
                    <span style={{ color: "var(--ink-mute)", fontSize: 14, paddingRight: 4 }}>×</span>
                  </span>
                ))}
                <span style={{ fontSize: 13, color: "var(--ink-mute)", padding: "6px 8px" }}>+ Add a co-host</span>
              </div>
            </Field>

            <Field label="Who should this reach?">
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { l: "Newcomers", on: true },
                  { l: "Tech", on: true },
                  { l: "Product", on: false },
                  { l: "MENA community", on: true },
                  { l: "Toronto", on: false },
                  { l: "Operations", on: false },
                ].map(o => (
                  <span key={o.l} style={{
                    padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500,
                    background: o.on ? "var(--clay)" : "transparent",
                    color: o.on ? "var(--paper)" : "var(--ink-soft)",
                    border: "1px solid " + (o.on ? "var(--clay)" : "var(--line)"),
                  }}>{o.on && "✓ "}{o.l}</span>
                ))}
              </div>
            </Field>

            {isMobile && (
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <Btn kind="soft" size="md" style={{ flex: 1, justifyContent: "center" }}>Save draft</Btn>
                <Btn kind="primary" size="md" iconRight={I.arrow} style={{ flex: 1, justifyContent: "center" }}>Schedule</Btn>
              </div>
            )}
          </div>

          {/* Preview */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
            <SectionLabel>How it'll look</SectionLabel>

            <div className="hy-card" style={{ padding: 22, borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-warm)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Pill kind="clay">Tonight</Pill>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)" }}>7:00 — 8:15PM</span>
              </div>
              <h3 style={{ fontFamily: "var(--display)", fontSize: 24, marginTop: 12, lineHeight: 1.2, fontWeight: 500 }}>
                Breaking into Amazon as a newcomer
              </h3>
              <p style={{ marginTop: 10, fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                A small, honest room for engineers and PMs new to Canada who want to land at Amazon.
              </p>
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex" }}>
                  {[{ n: "Amira H", t: "dark" }, { n: "Rashid K", t: "olive" }, { n: "Maya N", t: "clay" }].map((p, i) => (
                    <div key={p.n} style={{ marginLeft: i === 0 ? 0 : -8, border: "2px solid var(--paper)", borderRadius: 999 }}>
                      <Avatar name={p.n} size={30} tone={p.t} />
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>You + 2 co-hosts</p>
              </div>
              <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Newcomers", "Tech", "MENA community"].map(t => <Pill key={t}>{t}</Pill>)}
              </div>
            </div>

            <div className="hy-card" style={{ padding: 16 }}>
              <SectionLabel>Estimated reach</SectionLabel>
              <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", gap: 14 }}>
                <p style={{ fontFamily: "var(--display)", fontSize: 32, lineHeight: 1, color: "var(--clay)", fontWeight: 500 }}>~340</p>
                <p style={{ fontSize: 12, color: "var(--ink-mute)" }}>members will see this in their brief</p>
              </div>
              <p style={{ marginTop: 10, fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                Based on your tags. We never push rooms to people they didn't ask to hear from.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// 6. POST-ROOM RECAP — editorial summary after a live room ended.
// ──────────────────────────────────────────────────────────────────
const RoomRecap = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const clips = [
    { t: "On the realistic timeline", who: "Maya N.", dur: "1:24", q: "It took me 14 months. Anyone telling you 3 is selling something." },
    { t: "Skip the cover letter — almost always", who: "Rashid K.", dur: "0:48", q: "If a referral exists, the cover letter is noise. Spend that time on STAR stories." },
    { t: "Newcomer salary anchor", who: "Maya N.", dur: "2:11", q: "Anchor your number on Toronto market — not your last role's currency." },
  ];
  const followups = [
    { who: "Amira → Rashid K.", t: "olive", what: "Resume review", status: "Scheduled" },
    { who: "Diego → Maya N.", t: "clay", what: "Coffee chat", status: "Awaiting reply" },
    { who: "Sara → Layla P.", t: "sand", what: "Portfolio session", status: "Scheduled" },
  ];

  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Rooms" />}

      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Header strip */}
        <div style={{
          padding: isMobile ? "18px 18px 18px" : "32px 48px 26px",
          background: "var(--paper)", borderBottom: "1px solid var(--line-soft)",
        }}>
          {isMobile && <MobileTopbar />}
          <SectionLabel>Recap · Tue Apr 29 · 47 min</SectionLabel>
          <h1 style={{ fontSize: isMobile ? 28 : 44, marginTop: 6, lineHeight: 1.05 }}>
            Breaking into Amazon as a <span className="display-italic">newcomer</span>.
          </h1>
          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex" }}>
                {[{ n: "Maya N", t: "clay" }, { n: "Rashid K", t: "olive" }, { n: "Amira H", t: "dark" }].map((p, i) => (
                  <div key={p.n} style={{ marginLeft: i === 0 ? 0 : -8, border: "2px solid var(--paper)", borderRadius: 999 }}>
                    <Avatar name={p.n} size={28} tone={p.t} />
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Hosted by Maya, Rashid, Amira</span>
            </div>
            <span style={{ width: 1, height: 16, background: "var(--line)" }} />
            <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>
              <b style={{ color: "var(--ink)" }}>34</b> attended · <b style={{ color: "var(--clay)" }}>3</b> follow-ups
            </span>
          </div>
        </div>

        <div style={{ flex: 1, overflow: "hidden", padding: isMobile ? "18px 18px" : "24px 48px 28px",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: isMobile ? 22 : 40 }}>

          {/* Left — clips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
            <section>
              <SectionLabel>What we'll remember</SectionLabel>
              <p style={{ marginTop: 8, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 600 }}>
                Three moments worth saving. Tap any clip to listen back, share to a thread, or pull a quote.
              </p>
              <div style={{ marginTop: 18, display: "flex", flexDirection: "column" }}>
                {clips.map((c, i) => (
                  <article key={c.t} style={{
                    padding: "18px 0",
                    borderTop: i === 0 ? "1px solid var(--line-soft)" : "1px dashed var(--line-soft)",
                    display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", gap: 16, alignItems: "start",
                  }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".06em" }}>{`CLIP 0${i+1}`}</span>
                        <span style={{ width: 4, height: 4, borderRadius: 99, background: "var(--ink-mute)" }} />
                        <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)" }}>{c.dur}</span>
                      </div>
                      <h3 style={{ fontFamily: "var(--display)", fontSize: isMobile ? 18 : 22, fontWeight: 500, marginTop: 6, lineHeight: 1.2 }}>{c.t}</h3>
                      <blockquote style={{
                        marginTop: 10, paddingLeft: 14, borderLeft: "2px solid var(--clay)",
                        fontFamily: "var(--display)", fontStyle: "italic", fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.5,
                      }}>"{c.q}"</blockquote>
                      <p style={{ marginTop: 8, fontSize: 12, color: "var(--ink-mute)" }}>— {c.who}</p>
                    </div>
                    <div style={{
                      width: isMobile ? "100%" : 180, height: 64, borderRadius: 14,
                      background: "var(--cream)", border: "1px solid var(--line-soft)",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 14px",
                    }}>
                      <span style={{ width: 32, height: 32, borderRadius: 999, background: "var(--clay)", color: "var(--paper)",
                        display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>▶</span>
                      <Waveform bars={isMobile ? 24 : 14} height={22} active={false} color="var(--ink-mute)" />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Right — sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            <div className="hy-card" style={{ padding: 18, background: "var(--cream)" }}>
              <SectionLabel>Follow-ups · the wins</SectionLabel>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column" }}>
                {followups.map((f, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 0",
                    borderTop: i === 0 ? "0" : "1px dashed var(--line-soft)",
                  }}>
                    <Avatar name={f.who.split(" ")[0]} size={28} tone={f.t} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 500 }}>{f.who}</p>
                      <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>{f.what}</p>
                    </div>
                    <span className="mono" style={{ fontSize: 10, color: f.status === "Scheduled" ? "var(--olive)" : "var(--ink-mute)",
                      letterSpacing: ".06em", textTransform: "uppercase" }}>{f.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hy-card" style={{ padding: 18 }}>
              <SectionLabel>Mentioned in the room</SectionLabel>
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Amazon Day-1", "STAR stories", "Toronto salary anchor", "Newcomer mortgage", "AWS Sr PM", "Cover letters"].map(t => <Pill key={t}>{t}</Pill>)}
              </div>
            </div>

            <div style={{
              padding: 18, borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, var(--clay), var(--clay-2))",
              color: "var(--paper)", boxShadow: "var(--shadow-warm)",
            }}>
              <SectionLabel color="rgba(255,255,255,.85)">Replay</SectionLabel>
              <p style={{ marginTop: 8, fontFamily: "var(--display)", fontSize: 18, lineHeight: 1.3 }}>
                Listen to the full 47 min — or skim from the transcript.
              </p>
              <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                <Btn kind="soft" size="md" style={{ background: "var(--paper)", color: "var(--ink)", borderColor: "transparent" }}>Play full</Btn>
                <Btn kind="ghost" size="md" style={{ color: "var(--paper)" }}>Transcript</Btn>
              </div>
            </div>
          </aside>
        </div>

        {isMobile && <div style={{ padding: "0 18px 12px" }}><MobileTabbar /></div>}
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// 7. REFER SOMEONE — compose form. Pick contact + role + write note.
// ──────────────────────────────────────────────────────────────────
const ReferCompose = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const suggestions = [
    { who: "Maya Nasrallah", role: "Sr PM · AWS", t: "clay", reason: "Hires for Amazon Toronto · 4 mutuals" },
    { who: "Priya Shah", role: "Recruiter · Stripe", t: "olive", reason: "Open to refers · same room last week" },
    { who: "Rashid Khoury", role: "Eng Manager · Amazon", t: "olive", reason: "Was once a newcomer too" },
  ];
  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Referrals" />}

      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: isMobile ? "18px 18px 12px" : "28px 48px 18px",
          borderBottom: "1px solid var(--line-soft)" }}>
          {isMobile && <MobileTopbar />}
          <SectionLabel>New referral request</SectionLabel>
          <h1 style={{ fontSize: isMobile ? 28 : 38, marginTop: 6 }}>
            Ask for a <span className="display-italic">warm</span> intro.
          </h1>
        </div>

        <div style={{ flex: 1, overflow: "hidden", padding: isMobile ? "18px 18px" : "24px 48px 28px",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", gap: isMobile ? 22 : 40 }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
            <Field label="Who would you like to be referred to?">
              <div style={{ padding: "10px 14px", borderRadius: 12, border: "1.5px solid var(--clay)",
                background: "var(--paper)", display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name="Maya Nasrallah" size={30} tone="clay" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>Maya Nasrallah</p>
                  <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>Sr PM · AWS · Toronto</p>
                </div>
                <span style={{ color: "var(--ink-mute)", fontSize: 14 }}>×</span>
              </div>
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Company">
                <Input value="Stripe" />
              </Field>
              <Field label="Role you're targeting">
                <Input value="Sr PM, Payments" />
              </Field>
            </div>

            <Field label="Why this role, in your words" hint="What Maya can paste straight into a Slack DM. Keep it 3 lines.">
              <div style={{
                padding: "14px 16px", borderRadius: 12, border: "1px solid var(--line)",
                background: "var(--paper)", fontSize: 14, color: "var(--ink)",
                lineHeight: 1.6, minHeight: 110,
              }}>
                Eight years in fintech, last four building merchant tools at Shopify and Wealthsimple. I want to go deeper on payments infra and Stripe is the obvious team. I'd love 20 min with the hiring manager — even just to understand the bar.
              </div>
            </Field>

            <Field label="Attach">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "8px 12px", borderRadius: 10, background: "var(--cream)", border: "1px solid var(--line-soft)" }}>
                  <span style={{ fontSize: 14 }}>📄</span>
                  <span style={{ fontSize: 12 }}>Resume_Amira_2026.pdf</span>
                  <span style={{ color: "var(--ink-mute)", fontSize: 12 }}>×</span>
                </span>
                <span style={{ padding: "8px 12px", borderRadius: 10, border: "1px dashed var(--line)",
                  fontSize: 12, color: "var(--ink-mute)" }}>+ Portfolio link</span>
              </div>
            </Field>

            <div style={{ padding: 14, borderRadius: 12, background: "var(--cream)",
              border: "1px solid var(--line-soft)", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ color: "var(--olive)", flex: "none", marginTop: 2 }}>{I.lock}</span>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                Maya gets to decide. She'll see this note and your profile — nothing else from your account.
                You can withdraw the request anytime before she replies.
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <Btn kind="ghost" size="lg">Save draft</Btn>
              <Btn kind="primary" size="lg" iconRight={I.shake}>Send to Maya</Btn>
            </div>
          </div>

          {/* Right — suggestions */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
            <SectionLabel>Other warm paths to Stripe</SectionLabel>
            {suggestions.map(s => (
              <div key={s.who} className="hy-card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={s.who} size={36} tone={s.t} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{s.who}</p>
                  <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>{s.role}</p>
                  <p className="mono" style={{ fontSize: 10, color: "var(--clay)", marginTop: 4, letterSpacing: ".06em" }}>↳ {s.reason.toUpperCase()}</p>
                </div>
                <Btn kind="soft" size="md">Switch</Btn>
              </div>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// 8. PROFILE EDIT — settings counterpart to the public profile.
// ──────────────────────────────────────────────────────────────────
const ProfileEdit = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Profile" />}

      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: isMobile ? "18px 18px 12px" : "28px 48px 18px",
          borderBottom: "1px solid var(--line-soft)",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          {isMobile && <MobileTopbar />}
          <div>
            <SectionLabel>Edit profile</SectionLabel>
            <h1 style={{ fontSize: isMobile ? 28 : 38, marginTop: 6 }}>
              How others <span className="display-italic">meet</span> you on Hayy.
            </h1>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn kind="ghost" size="md">View public profile</Btn>
              <Btn kind="primary" size="md">Save changes</Btn>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflow: "hidden", padding: isMobile ? "18px 18px" : "24px 48px 28px",
          display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Identity */}
          <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "200px 1fr", gap: isMobile ? 14 : 40 }}>
            <div>
              <h2 style={{ fontSize: 20, lineHeight: 1.1 }}>Identity</h2>
              <p style={{ marginTop: 6, fontSize: 12, color: "var(--ink-mute)" }}>Your name, photo, and the line under your face.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar name="Amira Hassan" size={64} tone="dark" />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Btn kind="soft" size="md">Upload new</Btn>
                  <span style={{ fontSize: 11, color: "var(--ink-mute)" }}>JPG or PNG · max 4MB</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <Field label="Display name"><Input value="Amira Hassan" /></Field>
                <Field label="Pronouns"><Input value="she / her" /></Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <Field label="Headline"><Input value="Senior Product Designer" /></Field>
                <Field label="Location"><Input value="Toronto, Canada" /></Field>
              </div>
            </div>
          </section>

          <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "200px 1fr", gap: isMobile ? 14 : 40,
            paddingTop: 22, borderTop: "1px solid var(--line-soft)" }}>
            <div>
              <h2 style={{ fontSize: 20, lineHeight: 1.1 }}>Your story</h2>
              <p style={{ marginTop: 6, fontSize: 12, color: "var(--ink-mute)" }}>The opening line and a short bio. Stays editorial.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Quote (one line)" hint="What you'd want a stranger to read first.">
                <div style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid var(--line)",
                  background: "var(--paper)", fontFamily: "var(--display)", fontStyle: "italic",
                  fontSize: 16, color: "var(--ink)", lineHeight: 1.45 }}>
                  "I rebuilt my career from scratch in a new country — and I want to make that path shorter for the next person."
                </div>
              </Field>
              <Field label="Bio">
                <div style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid var(--line)",
                  background: "var(--paper)", fontSize: 14, color: "var(--ink)", lineHeight: 1.6, minHeight: 100 }}>
                  Eight years designing for fintech and SaaS, in Cairo and Toronto. I care about quiet, considered tools — and about the moment someone realises they belong in a room.
                </div>
              </Field>
              <Field label="Tags">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "8px",
                  borderRadius: 12, border: "1px solid var(--line)", background: "var(--paper)" }}>
                  {["Product design", "Design systems", "Newcomer to CA", "MENA community", "Mentorship", "Fintech"].map(t => (
                    <Pill key={t}>{t} <span style={{ marginLeft: 4, color: "var(--ink-mute)" }}>×</span></Pill>
                  ))}
                  <span style={{ fontSize: 13, color: "var(--ink-mute)", padding: "4px 8px" }}>+ Add</span>
                </div>
              </Field>
            </div>
          </section>

          <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "200px 1fr", gap: isMobile ? 14 : 40,
            paddingTop: 22, borderTop: "1px solid var(--line-soft)" }}>
            <div>
              <h2 style={{ fontSize: 20, lineHeight: 1.1 }}>What you'll help with</h2>
              <p style={{ marginTop: 6, fontSize: 12, color: "var(--ink-mute)" }}>What others can ask of you. Be specific.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { l: "Coffee chats", d: "3 / month · 30 min", on: true },
                { l: "Resume reviews", d: "Same week response", on: true },
                { l: "Portfolio reviews", d: "For designers only", on: true },
                { l: "Mock interviews", d: "Product design rounds", on: true },
                { l: "Speaking on rooms", d: "Anything newcomer-related", on: false },
              ].map(o => (
                <div key={o.l} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12,
                  background: "var(--paper)", border: "1px solid var(--line-soft)",
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{o.l}</p>
                    <p style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>{o.d}</p>
                  </div>
                  <Switch on={o.on} />
                </div>
              ))}
            </div>
          </section>

          {isMobile && (
            <Btn kind="primary" size="lg" style={{ width: "100%", justifyContent: "center" }}>Save changes</Btn>
          )}
        </div>
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// 9. SETTINGS — left tabs, right content. Notifications shown.
// ──────────────────────────────────────────────────────────────────
const Settings = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const tabs = [
    { l: "Account", icon: I.users },
    { l: "Notifications", icon: I.bell, active: true },
    { l: "Privacy & visibility", icon: I.lock },
    { l: "Connected accounts", icon: I.link },
    { l: "Membership", icon: I.spark },
    { l: "Danger zone", icon: I.closed },
  ];
  const channels = [
    { l: "Live room starts you RSVP'd to", d: "5 min before · push + email", push: true, email: true },
    { l: "Someone wants to refer you", d: "Always email — never miss a warm intro", push: true, email: true },
    { l: "Reply to your message", d: "From people you've already met", push: true, email: false },
    { l: "Mentions in recaps", d: "When someone quotes you in a clip", push: true, email: false },
    { l: "Weekly brief", d: "Sunday digest of next week's rooms", push: false, email: true },
    { l: "New members from your network", d: "Mutuals only", push: false, email: false },
  ];

  return (
    <div className="hy" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!isMobile && <Sidebar active="Settings" />}

      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: isMobile ? "18px 18px 12px" : "28px 48px 18px",
          borderBottom: "1px solid var(--line-soft)" }}>
          {isMobile && <MobileTopbar />}
          <SectionLabel>Settings</SectionLabel>
          <h1 style={{ fontSize: isMobile ? 28 : 38, marginTop: 6 }}>
            How Hayy <span className="display-italic">behaves</span> for you.
          </h1>
        </div>

        <div style={{ flex: 1, overflow: "hidden", padding: isMobile ? "18px 18px" : "24px 48px 28px",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "240px 1fr", gap: isMobile ? 18 : 40 }}>

          {/* Tabs */}
          <nav style={{ display: "flex", flexDirection: isMobile ? "row" : "column",
            gap: 4, overflowX: isMobile ? "auto" : "visible", flexWrap: isMobile ? "nowrap" : "wrap" }}>
            {tabs.map(t => (
              <div key={t.l} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 12, fontSize: 13, fontWeight: 500,
                background: t.active ? "var(--clay)" : "transparent",
                color: t.active ? "var(--paper)" : "var(--ink-soft)",
                whiteSpace: "nowrap", flex: "none",
              }}>
                {t.icon}<span>{t.l}</span>
              </div>
            ))}
          </nav>

          {/* Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
            <div>
              <h2 style={{ fontSize: 22 }}>Notifications</h2>
              <p style={{ marginTop: 6, fontSize: 13, color: "var(--ink-soft)", maxWidth: 540, lineHeight: 1.55 }}>
                The only Hayy rule about notifications: never push something you didn't ask to hear about. Tune everything below to your real life.
              </p>
            </div>

            <div className="hy-card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{
                display: "grid", gridTemplateColumns: isMobile ? "1fr 60px 60px" : "1fr 100px 100px",
                padding: "12px 18px", background: "var(--cream)",
                borderBottom: "1px solid var(--line-soft)",
                fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-mute)",
                letterSpacing: ".1em", textTransform: "uppercase",
              }}>
                <span>Event</span>
                <span style={{ textAlign: "center" }}>Push</span>
                <span style={{ textAlign: "center" }}>Email</span>
              </div>
              {channels.map((c, i) => (
                <div key={c.l} style={{
                  display: "grid", gridTemplateColumns: isMobile ? "1fr 60px 60px" : "1fr 100px 100px",
                  padding: "16px 18px", alignItems: "center",
                  borderTop: i === 0 ? "0" : "1px solid var(--line-soft)",
                }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{c.l}</p>
                    <p style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>{c.d}</p>
                  </div>
                  <div style={{ textAlign: "center" }}><Switch on={c.push} /></div>
                  <div style={{ textAlign: "center" }}><Switch on={c.email} /></div>
                </div>
              ))}
            </div>

            <div style={{ padding: 18, borderRadius: 16, background: "var(--cream)", border: "1px solid var(--line-soft)",
              display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ color: "var(--olive)", flex: "none" }}>{I.bell}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>Quiet hours</p>
                <p style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>Mon–Fri · 9pm — 7am · Toronto time</p>
              </div>
              <Btn kind="soft" size="md">Edit</Btn>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

Object.assign(window, { Auth, Notifications, Messages, Search, ScheduleRoom, RoomRecap, ReferCompose, ProfileEdit, Settings });
