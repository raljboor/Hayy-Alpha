// Live Room — two directions, desktop + mobile.
// A: "Stage" — familiar speakers grid + side rail of listeners + caption strip.
// B: "Circle" — novel concentric circles: hosts in middle, on-stage in inner ring, listeners outer.

const LiveTopbar = ({ title = "Breaking into Amazon as a newcomer to Canada", elapsed = "14:32", isMobile }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    padding: isMobile ? "12px 14px" : "16px 28px",
    borderBottom: "1px solid var(--line-soft)", background: "var(--paper)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-soft)", fontSize: 13 }}>
        {I.arrow && <Icon d="m15 18-6-6 6-6" size={18} />}
      </span>
      <LiveTag />
      {!isMobile && (
        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", marginLeft: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 380 }}>
          {title}
        </span>
      )}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span className="mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>{elapsed}</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-soft)" }}>
        {I.users} 28
      </span>
      <span style={{ color: "var(--ink-soft)" }}>{I.more}</span>
    </div>
  </div>
);

const speakers = [
  { n: "Maya Nasrallah", r: "Sr PM · AWS", t: "clay", on: true, host: true },
  { n: "Rashid Khoury", r: "Eng Mgr · Amazon", t: "olive", on: true },
  { n: "Jenna Sun", r: "Talent · Shopify", t: "sand", on: false },
  { n: "Omar Aziz", r: "Data · RBC", t: "dark", on: true },
  { n: "Layla Park", r: "Designer · Figma", t: "clay", on: false },
  { n: "Diego Rivas", r: "PM · Notion", t: "olive", on: false },
];
const listeners = [
  { n: "Amira Hassan", t: "clay", hand: true },
  { n: "Ben Lee", t: "sand" },
  { n: "Carla Mu", t: "olive" },
  { n: "Dev Patel", t: "dark", hand: true },
  { n: "Eli Frey", t: "clay" },
  { n: "Faye Lin", t: "olive" },
  { n: "Gus Ono", t: "sand" },
  { n: "Hina K.", t: "dark" },
  { n: "Ira S.", t: "clay" },
  { n: "Joon B.", t: "olive" },
  { n: "Kira A.", t: "sand" },
  { n: "Liam G.", t: "dark" },
];

const SpeakerTile = ({ s, size = 92 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
    <div style={{ position: "relative" }}>
      <Avatar name={s.n} size={size} tone={s.t} />
      {s.on && <span style={{
        position: "absolute", inset: -5, borderRadius: "50%",
        border: "2px solid var(--clay)",
      }} />}
      {s.host && <span style={{
        position: "absolute", top: -2, right: -2,
        background: "var(--clay)", color: "var(--paper)",
        borderRadius: 999, padding: "2px 7px", fontSize: 9, fontWeight: 600,
        letterSpacing: ".05em", textTransform: "uppercase",
        border: "2px solid var(--paper)",
      }}>Host</span>}
      {!s.on && <span style={{
        position: "absolute", bottom: -2, right: -2, width: 22, height: 22,
        borderRadius: 999, background: "var(--paper)", border: "1px solid var(--line)",
        display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-mute)",
      }}>{I.micOff}</span>}
      {s.on && <span style={{
        position: "absolute", bottom: -2, right: -2, width: 22, height: 22,
        borderRadius: 999, background: "var(--paper)", border: "1px solid var(--line)",
        display: "flex", alignItems: "center", justifyContent: "center", color: "var(--clay)",
      }}><Waveform bars={3} height={10} color="var(--clay)" /></span>}
    </div>
    <div style={{ textAlign: "center", maxWidth: size + 30 }}>
      <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>{s.n.split(" ")[0]} {s.n.split(" ")[1]?.[0]}.</p>
      <p style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 1, lineHeight: 1.2 }}>{s.r}</p>
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────────
// LIVE ROOM A — Stage
// ──────────────────────────────────────────────────────────────────
const LiveRoomA = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <div className="hy" style={{ width: "100%", height: "100%", background: "var(--bg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <LiveTopbar isMobile={isMobile} />

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 280px", overflow: "hidden", minHeight: 0 }}>
        <main style={{ padding: isMobile ? 18 : 28, overflow: "hidden", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase" }}>On stage</p>
            <h2 style={{ fontSize: isMobile ? 22 : 26, marginTop: 4 }}>
              "How do I turn a referral into a real interview?"
            </h2>
          </div>

          <div style={{
            display: "grid", gap: isMobile ? 16 : 24,
            gridTemplateColumns: `repeat(${isMobile ? 3 : 3}, 1fr)`,
            justifyItems: "center", padding: isMobile ? "8px 0" : "12px 0",
          }}>
            {speakers.slice(0, isMobile ? 3 : 6).map(s => (
              <SpeakerTile key={s.n} s={s} size={isMobile ? 64 : 92} />
            ))}
          </div>

          {/* Caption strip */}
          <div className="hy-card" style={{
            padding: 16, display: "flex", gap: 14, alignItems: "center",
            background: "var(--cream)", borderColor: "var(--line-soft)",
          }}>
            <Avatar name="Maya N." size={36} tone="clay" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>Maya N. · speaking</p>
              <p style={{ fontSize: 14, marginTop: 2 }}>
                …the trick is making the host want to be your <span style={{ color: "var(--clay)", fontWeight: 500 }}>second</span> introduction, not your first.
              </p>
            </div>
            <Waveform bars={14} height={22} color="var(--clay)" />
          </div>

          {/* Listener row */}
          {!isMobile && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <p className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".12em", textTransform: "uppercase" }}>22 Listening · 2 raised hands</p>
                <span style={{ fontSize: 12, color: "var(--clay)", fontWeight: 500 }}>Invite to stage</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {listeners.slice(0, 11).map(l => (
                  <div key={l.n} style={{ position: "relative" }}>
                    <Avatar name={l.n} size={42} tone={l.t} />
                    {l.hand && <span style={{
                      position: "absolute", bottom: -3, right: -3, width: 22, height: 22,
                      borderRadius: 999, background: "var(--spotlight)", border: "2px solid var(--paper)",
                      display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)",
                    }}>{I.hand}</span>}
                  </div>
                ))}
                <span style={{
                  width: 42, height: 42, borderRadius: 999, background: "var(--paper)", border: "1px dashed var(--line)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--ink-mute)",
                }}>+11</span>
              </div>
            </div>
          )}

          {/* Footer controls */}
          <div style={{
            marginTop: "auto", display: "flex", justifyContent: "center",
            gap: 10, padding: 10, background: "var(--paper)", borderRadius: 999,
            border: "1px solid var(--line)", boxShadow: "var(--shadow-soft)",
            alignSelf: "center",
          }}>
            <ControlBtn icon={I.hand} label="Raise" />
            <ControlBtn icon={I.heart} label="React" />
            <ControlBtn icon={I.shake} label="Refer me" highlight />
            <ControlBtn icon={I.msg} label="Chat" />
            <ControlBtn icon={I.closed} label="Leave" danger />
          </div>
        </main>

        {!isMobile && (
          <aside style={{ borderLeft: "1px solid var(--line-soft)", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--paper)" }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--line-soft)" }}>
              <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase" }}>Side conversation</p>
            </div>
            <div style={{ flex: 1, overflow: "hidden", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { n: "Carla M.", t: "Carla", c: "olive", m: "Maya — what should the first message after the room say?" },
                { n: "Maya N.", c: "clay", m: "Carla — I usually say 'thank you for what you said about X' first." },
                { n: "Dev P.", c: "dark", m: "Raised my hand 🤚" },
                { n: "Amira H.", c: "clay", m: "This is exactly what I needed today." },
              ].map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8 }}>
                  <Avatar name={m.n} size={26} tone={m.c} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>{m.n}</p>
                    <p style={{ fontSize: 13, marginTop: 2 }}>{m.m}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 12, borderTop: "1px solid var(--line-soft)" }}>
              <div style={{
                background: "var(--cream)", borderRadius: 999, padding: "8px 14px",
                fontSize: 12, color: "var(--ink-mute)",
              }}>Message the room…</div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

const ControlBtn = ({ icon, label, highlight, danger }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
    padding: "8px 14px", borderRadius: 999,
    background: highlight ? "var(--clay)" : danger ? "rgba(220,60,60,.08)" : "transparent",
    color: highlight ? "var(--paper)" : danger ? "hsl(0 65% 45%)" : "var(--ink-soft)",
    cursor: "pointer", minWidth: 64,
  }}>
    {icon}
    <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
  </div>
);

// ──────────────────────────────────────────────────────────────────
// LIVE ROOM B — Circle (novel concentric layout)
// ──────────────────────────────────────────────────────────────────
const LiveRoomB = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  const W = isMobile ? 360 : 720;
  const H = isMobile ? 360 : 520;
  const cx = W / 2;
  const cy = H / 2 + (isMobile ? -10 : -20);
  return (
    <div className="hy" style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      overflow: "hidden",
      background: "radial-gradient(ellipse at center, var(--cream) 0%, var(--bg) 70%)",
    }}>
      <LiveTopbar isMobile={isMobile} />

      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Title strip */}
        <div style={{ padding: isMobile ? "14px 18px 0" : "18px 28px 0", textAlign: "center" }}>
          <p className="mono" style={{ fontSize: 10, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            The circle · 28 in the room
          </p>
          <h2 style={{ fontSize: isMobile ? 18 : 22, marginTop: 4, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            "How do I turn a referral into a real interview?"
          </h2>
        </div>

        {/* Concentric stage */}
        <div style={{
          flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }} preserveAspectRatio="xMidYMid meet">
            {/* Concentric rings */}
            {[isMobile ? 60 : 90, isMobile ? 110 : 170, isMobile ? 160 : 250].map((r, i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeDasharray="2 5" opacity={.7 - i * .15} />
            ))}
            {/* Center label */}
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10"
              fontFamily="var(--mono)" fill="var(--ink-mute)" letterSpacing=".12em">
              STAGE
            </text>
          </svg>

          <div style={{ position: "relative", width: W, height: H, maxWidth: "100%" }}>
            {/* Center: host */}
            <Orbit cx={cx} cy={cy} r={0} count={1} items={[speakers[0]]} size={isMobile ? 70 : 90} kind="host" />
            {/* Inner ring: on-stage */}
            <Orbit cx={cx} cy={cy} r={isMobile ? 110 : 170} count={5} items={speakers.slice(1, 6)} size={isMobile ? 48 : 66} kind="speaker" />
            {/* Outer ring: listeners */}
            <Orbit cx={cx} cy={cy} r={isMobile ? 160 : 250} count={10} items={listeners.slice(0, 10)} size={isMobile ? 32 : 42} kind="listener" />
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: isMobile ? "12px 14px" : "16px 28px",
          borderTop: "1px solid var(--line-soft)", background: "var(--paper)",
          gap: 12,
        }}>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <Avatar name="Maya N." size={32} tone="clay" />
              <div>
                <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>Maya is speaking</p>
                <p style={{ fontSize: 13, fontWeight: 500 }}>"…make the host want to be your second intro."</p>
              </div>
              <Waveform bars={14} height={18} color="var(--clay)" />
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <CircleCtl icon={I.hand} />
            <CircleCtl icon={I.heart} />
            <CircleCtl icon={I.shake} highlight label={isMobile ? null : "Refer me"} />
            <CircleCtl icon={I.msg} />
            <CircleCtl icon={I.closed} danger />
          </div>
        </div>
      </div>
    </div>
  );
};

const CircleCtl = ({ icon, highlight, danger, label }) => (
  <button style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: label ? "10px 16px" : 10, borderRadius: 999,
    background: highlight ? "var(--clay)" : "var(--cream)",
    color: highlight ? "var(--paper)" : danger ? "hsl(0 65% 45%)" : "var(--ink)",
    border: "1px solid " + (highlight ? "transparent" : "var(--line)"),
    fontSize: 13, fontWeight: 500, cursor: "pointer",
  }}>{icon}{label}</button>
);

// Place items around a ring
const Orbit = ({ cx, cy, r, count, items, size, kind }) => (
  <>
    {items.map((it, i) => {
      const angle = r === 0 ? 0 : (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const isHost = kind === "host";
      const isSpeaker = kind === "speaker";
      const speaking = it.on;
      return (
        <div key={i} style={{
          position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        }}>
          <div style={{ position: "relative" }}>
            <Avatar name={it.n} size={size} tone={it.t} />
            {(isHost || (isSpeaker && speaking)) && (
              <span style={{
                position: "absolute", inset: -4, borderRadius: "50%",
                border: `${isHost ? 3 : 2}px solid var(--clay)`,
                animation: speaking || isHost ? "hy-pulse-ring 2s ease-out infinite" : "none",
              }} />
            )}
            {isHost && (
              <span style={{
                position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)",
                background: "var(--clay)", color: "var(--paper)",
                fontSize: 9, fontWeight: 600, padding: "2px 8px",
                borderRadius: 999, letterSpacing: ".06em", textTransform: "uppercase",
                border: "2px solid var(--paper)",
              }}>Host</span>
            )}
            {it.hand && (
              <span style={{
                position: "absolute", bottom: -3, right: -3, width: 18, height: 18,
                borderRadius: 999, background: "var(--spotlight)", border: "2px solid var(--paper)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)",
              }}><Icon d="M7 11V5a2 2 0 1 1 4 0v6M11 11V3a2 2 0 1 1 4 0v8M15 11V5a2 2 0 1 1 4 0v8a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8 2 2 0 1 1 4 0" size={10} /></span>
            )}
          </div>
          {kind !== "listener" && (
            <span style={{ fontSize: 10, fontWeight: 500, whiteSpace: "nowrap" }}>{it.n.split(" ")[0]}</span>
          )}
        </div>
      );
    })}
    <style>{`@keyframes hy-pulse-ring {
      0% { box-shadow: 0 0 0 0 hsl(12 60% 45% / .4); }
      100% { box-shadow: 0 0 0 14px hsl(12 60% 45% / 0); }
    }`}</style>
  </>
);

Object.assign(window, { LiveRoomA, LiveRoomB });
