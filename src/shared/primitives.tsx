import React, { useMemo, useEffect, useState } from 'react';

// ── Icon / I ───────────────────────────────────────────────────────────────
interface IconProps {
  d?: React.ReactNode;
  size?: number;
  stroke?: number;
  fill?: string;
}

export const Icon = ({ d, size = 16, stroke = 1.6, fill = 'none' }: IconProps) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    style={{ flex: 'none' }}
  >
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

export const I = {
  arrow:   <Icon d="M5 12h14M13 5l7 7-7 7" />,
  mic:     <Icon d={<><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" /></>} />,
  micOff:  <Icon d={<><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M5 10a7 7 0 0 0 10.71 5.95M19 10a7 7 0 0 1-.11 1.23M12 19v2M8 23h8M2 2l20 20"/></>} />,
  hand:    <Icon d="M7 11V5a2 2 0 1 1 4 0v6M11 11V3a2 2 0 1 1 4 0v8M15 11V5a2 2 0 1 1 4 0v8a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8 2 2 0 1 1 4 0" />,
  spark:   <Icon d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />,
  hand2:   <Icon d={<><path d="M18 11V6a2 2 0 0 0-4 0"/><path d="M14 10V4a2 2 0 0 0-4 0v2"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></>} />,
  users:   <Icon d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
  bell:    <Icon d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0" />,
  msg:     <Icon d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9 8.5 8.5 0 0 1 8.5 8.5z" />,
  cal:     <Icon d={<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>} />,
  shake:   <Icon d={<><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25H21"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></>} />,
  home:    <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4v-7H10v7H6a2 2 0 0 1-2-2z" />,
  search:  <Icon d={<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>} />,
  check:   <Icon d="M20 6 9 17l-5-5" />,
  dot:     <Icon d={<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>} />,
  more:    <Icon d={<><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></>} />,
  plus:    <Icon d="M12 5v14M5 12h14" />,
  heart:   <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  closed:  <Icon d="M18 6 6 18M6 6l12 12" />,
  link:    <Icon d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
  lock:    <Icon d={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>} />,
  shuffle: <Icon d={<><path d="M18 4l3 3-3 3"/><path d="M18 20l3-3-3-3"/><path d="M3 7h3.5a4 4 0 0 1 3.3 1.8l4.4 6.4a4 4 0 0 0 3.3 1.8H21"/><path d="M3 17h3.5a4 4 0 0 0 3.3-1.8l.7-1M21 7h-3.2a4 4 0 0 0-3.3 1.8l-.7 1"/></>} />,
  skip:    <Icon d={<><path d="M5 4l10 8-10 8z"/><path d="M19 5v14"/></>} />,
  gear:    <Icon d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>} />,
  wifiOff: <Icon d={<><path d="M2 2l20 20"/><path d="M8.5 16.4a5 5 0 0 1 7 0"/><path d="M5 12.9a10 10 0 0 1 5.2-2.7"/><path d="M19 12.9a10 10 0 0 0-3.4-2.3"/><path d="M2 8.8a16 16 0 0 1 4.6-2.8M22 8.8a16 16 0 0 0-9.5-2.7"/><path d="M12 20h.01"/></>} />,
  bolt:    <Icon d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />,
  pin:     <Icon d={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>} />,
  brief:   <Icon d={<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>} />,
  cap:     <Icon d={<><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2 2 6 2s6-1 6-2v-5"/></>} />,
  chevL:   <Icon d="M15 18l-6-6 6-6" />,
  chevR:   <Icon d="M9 18l6-6-6-6" />,
  reactN:  <Icon d="M14 2v6h6M21 9v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z" />,
};

// ── Avatar ─────────────────────────────────────────────────────────────────
type Tone = 'clay' | 'olive' | 'sand' | 'dark';

interface AvatarProps {
  name?: string;
  size?: number;
  tone?: Tone;
  style?: React.CSSProperties;
}

export const Avatar = ({ name = 'AB', size = 36, tone = 'clay', style }: AvatarProps) => {
  const initials = name.split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  const fontSize = Math.round(size * 0.36);
  return (
    <span
      className={`hy-avatar ${tone}`}
      style={{ width: size, height: size, fontSize, ...style }}
    >
      {initials}
    </span>
  );
};

// ── LiveTag ────────────────────────────────────────────────────────────────
export const LiveTag = ({ children = 'Live' }: { children?: React.ReactNode }) => (
  <span className="hy-pill hy-pill-live" style={{ textTransform: 'none', letterSpacing: 0, gap: 6 }}>
    <span style={{ width: 6, height: 6, borderRadius: 999, background: 'white', flex: 'none' }} />
    {children}
  </span>
);

// ── Btn ────────────────────────────────────────────────────────────────────
type BtnKind = 'primary' | 'soft' | 'ghost';
type BtnSize = 'md' | 'lg' | 'xl';

interface BtnProps {
  kind?: BtnKind;
  size?: BtnSize;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Btn = ({ kind = 'primary', size = 'md', children, icon, iconRight, style, onClick, disabled, type = 'button' }: BtnProps) => {
  const cls = `hy-btn hy-btn-${kind}${size === 'lg' ? ' hy-btn-lg' : size === 'xl' ? ' hy-btn-xl' : ''}`;
  return (
    <button className={cls} style={style} onClick={onClick} disabled={disabled} type={type}>
      {icon}{children}{iconRight}
    </button>
  );
};

// ── Pill ───────────────────────────────────────────────────────────────────
interface PillProps {
  children?: React.ReactNode;
  kind?: 'live' | 'topic' | 'status';
  style?: React.CSSProperties;
}

export const Pill = ({ children, kind, style }: PillProps) => (
  <span className={`hy-pill${kind ? ` hy-pill-${kind}` : ''}`} style={style}>{children}</span>
);

// ── ImgPh ──────────────────────────────────────────────────────────────────
export const ImgPh = ({ label = 'image', style }: { label?: string; style?: React.CSSProperties }) => (
  <div className="hy-img-ph" style={{ borderRadius: 'var(--radius-md)', ...style }}>{label}</div>
);

// ── Waveform ───────────────────────────────────────────────────────────────
interface WaveformProps {
  bars?: number;
  height?: number;
  active?: boolean;
  color?: string;
}

export const Waveform = ({ bars = 18, height = 18, active = true, color = 'currentColor' }: WaveformProps) => {
  const heights = useMemo(
    () => Array.from({ length: bars }, (_, i) => 0.3 + Math.abs(Math.sin(i * 1.7)) * 0.7),
    [bars]
  );
  return (
    <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center', height }}>
      {heights.map((h, i) => (
        <span key={i} style={{
          width: 2, height: `${h * 100}%`, background: color, borderRadius: 2,
          opacity: active ? 1 : 0.35,
          animation: active ? `hy-bar 1.${(i * 3) % 9}s ease-in-out ${i * 0.05}s infinite alternate` : 'none',
          transformOrigin: 'center',
        }} />
      ))}
    </span>
  );
};

// ── Stack (overlapping avatars) ────────────────────────────────────────────
const tones: Tone[] = ['clay', 'olive', 'sand', 'dark'];

export const Stack = ({ names, n }: { names: string[]; n: number }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {names.slice(0, 3).map((nm, i) => (
      <span key={i} style={{ marginLeft: i ? -9 : 0, border: '2px solid var(--paper)', borderRadius: 999, display: 'inline-flex' }}>
        <Avatar name={nm} size={24} tone={tones[i % 4]} />
      </span>
    ))}
    {n > 3 && <span style={{ marginLeft: 7, fontSize: 12, color: 'var(--ink-mute)' }}>+{n - 3}</span>}
  </div>
);

// ── Meta (mono label) ──────────────────────────────────────────────────────
export const Meta = ({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) => (
  <span className="mono" style={{ fontSize: 11, letterSpacing: '.06em', color: 'var(--ink-mute)', ...style }}>{children}</span>
);

// ── Card ───────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  pad?: number;
}

export const Card = ({ children, style, onClick, pad = 16 }: CardProps) => (
  <div
    onClick={onClick}
    style={{
      background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 20,
      padding: pad, cursor: onClick ? 'pointer' : undefined, ...style,
    }}
  >
    {children}
  </div>
);

// ── RoundBtn ───────────────────────────────────────────────────────────────
export const RoundBtn = ({ icon, badge, onClick }: { icon: React.ReactNode; badge?: boolean; onClick?: () => void }) => (
  <button onClick={onClick} style={{
    position: 'relative', width: 42, height: 42, borderRadius: 14, flex: 'none',
    background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink-soft)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  }}>
    {icon}
    {badge && <span style={{ position: 'absolute', top: 9, right: 9, width: 7, height: 7, borderRadius: 99, background: 'var(--clay)', border: '1.5px solid var(--paper)' }} />}
  </button>
);

// ── Skeleton ───────────────────────────────────────────────────────────────
export const Skeleton = ({ style }: { style?: React.CSSProperties }) => (
  <div className="hy-skeleton" style={{ height: 16, ...style }} />
);

// ── FloatingComments (live room) ───────────────────────────────────────────
const liveComments = [
  { n: 'Dana', t: 'this is so helpful 🙌', tone: 'olive' as Tone },
  { n: 'Tom', t: 'how junior is too junior?', tone: 'dark' as Tone },
  { n: 'Priya', t: '+1 to the portfolio point', tone: 'clay' as Tone },
  { n: 'Sam', t: 'following!', tone: 'sand' as Tone },
  { n: 'Lea', t: 'what about non-CS grads?', tone: 'olive' as Tone },
  { n: 'Ravi', t: '🔥🔥', tone: 'dark' as Tone },
  { n: 'Mia', t: 'can you share that resource?', tone: 'clay' as Tone },
  { n: 'Joe', t: 'raising my hand next', tone: 'sand' as Tone },
];

interface CommentItem { n: string; t: string; tone: Tone; id: number }

export const FloatingComments = () => {
  const [items, setItems] = useState<CommentItem[]>([]);
  useEffect(() => {
    let id = 0;
    const push = () => setItems(prev => [...prev, { ...liveComments[id % liveComments.length], id: id++ }].slice(-3));
    push();
    const t = setInterval(push, 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      position: 'absolute', left: 16, right: 64, bottom: 150, zIndex: 3, pointerEvents: 'none',
      display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'flex-end',
      WebkitMaskImage: 'linear-gradient(to top, #000 55%, transparent)',
      maskImage: 'linear-gradient(to top, #000 55%, transparent)',
    }}>
      {items.map(c => (
        <div key={c.id} style={{
          display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
          maxWidth: '100%', animation: 'hy-rise-in .45s cubic-bezier(.4,0,.2,1)',
        }}>
          <Avatar name={c.n} size={26} tone={c.tone} />
          <div style={{
            background: 'color-mix(in oklab, var(--paper) 78%, transparent)',
            border: '1px solid var(--line-soft)', backdropFilter: 'blur(8px)',
            borderRadius: 14, padding: '7px 12px', display: 'flex', gap: 7, alignItems: 'baseline',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--clay)' }}>{c.n}</span>
            <span style={{ fontSize: 13.5, color: 'var(--ink)' }}>{c.t}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── HayyLogo ───────────────────────────────────────────────────────────────
export const HayyMark = ({ size = 28, color = 'var(--clay)' }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill={color} aria-label="Hayy">
    <rect x="12" y="9"  width="9" height="46" rx="2.2" />
    <rect x="43" y="9"  width="9" height="46" rx="2.2" />
    <circle cx="32" cy="32" r="7" />
  </svg>
);

export const HayyWordmark = ({ size = 22 }: { size?: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <HayyMark size={size + 2} />
    <span style={{ fontFamily: 'var(--display)', fontSize: size, fontWeight: 500, letterSpacing: '0.12em' }}>HAYY</span>
  </div>
);
