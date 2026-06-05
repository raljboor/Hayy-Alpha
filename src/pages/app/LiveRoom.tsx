import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, LiveTag, Meta, Waveform, FloatingComments, RoundBtn } from '@/shared/primitives';
import { Icon } from '@/shared/primitives';

const speakers = [
  { n: 'Maya Nasrallah', r: 'Host · AWS', tone: 'clay' as const, big: true, talking: true },
  { n: 'Rashid Khoury',  r: 'Amazon', tone: 'dark' as const },
  { n: 'Jenna Sun',      r: 'Shopify', tone: 'olive' as const, talking: true },
  { n: 'Omar Aziz',      r: 'RBC', tone: 'sand' as const },
  { n: 'Priya Shah',     r: 'Stripe', tone: 'clay' as const },
];

const SpeakerBubble = ({ s, size }: { s: typeof speakers[0]; size: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: size + 18 }}>
    <div style={{
      position: 'relative', borderRadius: 999,
      padding: 3,
      background: s.talking ? 'var(--clay)' : 'transparent',
      boxShadow: s.talking ? '0 0 0 3px color-mix(in oklab, var(--clay) 22%, transparent)' : 'none',
      transition: 'all .3s',
    }}>
      <Avatar name={s.n} size={size} tone={s.tone} />
      {s.r.startsWith('Host') && (
        <span style={{
          position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 999,
          background: 'var(--clay)', color: 'var(--paper)', border: '2px solid var(--bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {React.cloneElement(I.mic as React.ReactElement<{size?:number}>, { size: 11 })}
        </span>
      )}
    </div>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.1, color: 'var(--ink)' }}>{s.n.split(' ')[0]}</p>
      <p style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{s.r}</p>
    </div>
  </div>
);

const ctrlStyle = (accent: boolean): React.CSSProperties => ({
  height: 54, minWidth: 54, borderRadius: 18, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '1px solid var(--line)',
  background: accent ? 'var(--clay)' : 'var(--paper)',
  color: accent ? 'var(--paper)' : 'var(--ink)',
});

export default function LiveRoom() {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);
  const [msg, setMsg] = useState('');

  return (
    <div className="hy" data-palette="dusk" style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', background: 'var(--bg)', fontFamily: 'var(--body)',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(90% 50% at 50% 22%, color-mix(in oklab, var(--clay) 20%, var(--bg)) 0%, var(--bg) 70%)',
      }} />

      {/* Top bar */}
      <div style={{
        position: 'relative', zIndex: 2, paddingTop: 24, paddingLeft: 20, paddingRight: 20, paddingBottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => navigate(-1)} style={{
          width: 42, height: 42, borderRadius: 14, background: 'rgba(255,255,255,.08)', border: '1px solid var(--line)',
          color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          {React.cloneElement(I.chevL as React.ReactElement<{size?:number}>, { size: 18 })}
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span className="hy-livedot" />
            <Meta style={{ color: 'var(--ink-mute)' }}>LIVE · 42 HERE</Meta>
          </div>
        </div>
        <button onClick={() => navigate('/app/rooms/r02/live')} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: 999,
          background: 'color-mix(in oklab, var(--clay) 18%, transparent)', border: '1px solid color-mix(in oklab, var(--clay) 40%, transparent)',
          color: 'var(--clay)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
        }}>
          {React.cloneElement(I.shuffle as React.ReactElement<{size?:number}>, { size: 14 })}Next
        </button>
      </div>

      {/* Room title */}
      <div style={{ position: 'relative', zIndex: 2, padding: '16px 24px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, lineHeight: 1.12 }}>Breaking into Product at Big&nbsp;Tech</h2>
      </div>

      {/* Stage */}
      <div style={{
        position: 'relative', zIndex: 2, flex: 1, minHeight: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: 20,
      }}>
        <SpeakerBubble s={speakers[0]} size={92} />
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px 14px', maxWidth: 320 }}>
          {speakers.slice(1).map((s, i) => <SpeakerBubble key={i} s={s} size={58} />)}
        </div>
        <Meta style={{ color: 'var(--ink-mute)' }}>+ 37 listening</Meta>
      </div>

      {/* Floating comments */}
      <FloatingComments />

      {/* Chat input */}
      <div style={{ position: 'relative', zIndex: 4, flex: 'none', padding: '0 22px 10px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 16px',
          borderRadius: 999, background: 'color-mix(in oklab, var(--paper) 70%, transparent)',
          border: '1px solid var(--line)', backdropFilter: 'blur(8px)', color: 'var(--ink-mute)',
        }}>
          {React.cloneElement(I.msg as React.ReactElement<{size?:number}>, { size: 16 })}
          <input
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="Say something…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'var(--ink)', caretColor: 'var(--clay)' }}
          />
          <span style={{ color: 'var(--clay)' }}>
            {React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 16 })}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        position: 'relative', zIndex: 2, flex: 'none', padding: '4px 22px 34px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <button onClick={() => setMuted(!muted)} style={ctrlStyle(false)}>
          {muted
            ? React.cloneElement(I.micOff as React.ReactElement<{size?:number}>, { size: 22 })
            : React.cloneElement(I.mic as React.ReactElement<{size?:number}>, { size: 22 })}
        </button>
        <button style={{ ...ctrlStyle(false), flex: 1, gap: 9, width: 'auto' }}>
          {React.cloneElement(I.hand2 as React.ReactElement<{size?:number}>, { size: 20 })}
          <span style={{ fontSize: 15, fontWeight: 600 }}>Raise hand</span>
        </button>
        <button style={ctrlStyle(true)}>
          {React.cloneElement(I.heart as React.ReactElement<{size?:number}>, { size: 22 })}
        </button>
      </div>
    </div>
  );
}
