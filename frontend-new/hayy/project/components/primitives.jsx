// Shared Hayy primitives — icons, avatars, pills, buttons.
// All artboard-scoped: assumes ancestor with class "hy" + data-palette/data-density.

const Icon = ({ d, size = 16, stroke = 1.6, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    style={{ flex: "none" }}>
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);

const I = {
  arrow: <Icon d="M5 12h14M13 5l7 7-7 7" />,
  mic:   <Icon d={<><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" /></>} />,
  micOff:<Icon d={<><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M5 10a7 7 0 0 0 10.71 5.95M19 10a7 7 0 0 1-.11 1.23M12 19v2M8 23h8M2 2l20 20"/></>} />,
  hand:  <Icon d="M7 11V5a2 2 0 1 1 4 0v6M11 11V3a2 2 0 1 1 4 0v8M15 11V5a2 2 0 1 1 4 0v8a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8 2 2 0 1 1 4 0" />,
  spark: <Icon d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />,
  hand2: <Icon d="M9 12V5a2 2 0 0 1 4 0v6M13 11V3a2 2 0 0 1 4 0v8M17 12V8a2 2 0 0 1 4 0v8a6 6 0 0 1-6 6h-3a8 8 0 0 1-8-8 2 2 0 0 1 4 0" />,
  users: <Icon d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
  bell:  <Icon d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0" />,
  msg:   <Icon d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9 8.5 8.5 0 0 1 8.5 8.5z" />,
  cal:   <Icon d={<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>} />,
  shake: <Icon d="m11 17 2 2a1 1 0 1 0 3-3M14 14l2.5 2.5a1 1 0 1 0 3-3M17 11l1.5 1.5a1 1 0 1 0 3-3l-3.5-3.5a4 4 0 0 0-5.66 0L11 8M3 9l3.5 3.5a4 4 0 0 0 5.66 0L14 11" />,
  home:  <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4v-7H10v7H6a2 2 0 0 1-2-2z" />,
  search:<Icon d={<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>} />,
  check: <Icon d="M20 6 9 17l-5-5" />,
  dot:   <Icon d={<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>} />,
  more:  <Icon d={<><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></>} />,
  plus:  <Icon d="M12 5v14M5 12h14" />,
  reactN:<Icon d="M14 2v6h6M21 9v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z" />,
  heart: <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  closed:<Icon d="M18 6 6 18M6 6l12 12" />,
  link:  <Icon d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
  lock:  <Icon d={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>} />,
};

const Avatar = ({ name = "AB", size = 36, tone = "clay" }) => {
  const initials = name.split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase();
  const fontSize = Math.round(size * 0.36);
  return (
    <span className={`hy-avatar ${tone}`} style={{ width: size, height: size, fontSize }}>
      {initials}
    </span>
  );
};

const LiveTag = ({ children = "Live" }) => (
  <span className="hy-pill hy-pill-live">
    <span style={{ width: 6, height: 6, borderRadius: 999, background: "white" }} />
    {children}
  </span>
);

const Btn = ({ kind = "primary", size = "md", children, icon, iconRight, style, onClick }) => {
  const cls = `hy-btn hy-btn-${kind}` + (size === "lg" ? " hy-btn-lg" : size === "xl" ? " hy-btn-xl" : "");
  return (
    <button className={cls} style={style} onClick={onClick}>
      {icon}{children}{iconRight}
    </button>
  );
};

const Pill = ({ children, kind, style }) => (
  <span className={`hy-pill${kind ? " hy-pill-" + kind : ""}`} style={style}>{children}</span>
);

// Generic image placeholder
const ImgPh = ({ label = "image", style }) => (
  <div className="hy-img-ph" style={{ borderRadius: "var(--radius-md)", ...style }}>{label}</div>
);

// Wave / waveform svg for live audio
const Waveform = ({ bars = 18, height = 18, active = true, color = "currentColor" }) => {
  const heights = React.useMemo(
    () => Array.from({ length: bars }, (_, i) => 0.3 + Math.abs(Math.sin(i * 1.7)) * 0.7),
    [bars]
  );
  return (
    <span style={{ display: "inline-flex", gap: 2, alignItems: "center", height }}>
      {heights.map((h, i) => (
        <span key={i} style={{
          width: 2, height: `${h * 100}%`, background: color, borderRadius: 2,
          opacity: active ? 1 : .35,
          animation: active ? `hy-bar 1.${(i*3)%9}s ease-in-out ${i*0.05}s infinite alternate` : "none",
          transformOrigin: "center",
        }} />
      ))}
      <style>{`@keyframes hy-bar { from { transform: scaleY(.4) } to { transform: scaleY(1) } }`}</style>
    </span>
  );
};

Object.assign(window, { I, Icon, Avatar, LiveTag, Btn, Pill, ImgPh, Waveform });
