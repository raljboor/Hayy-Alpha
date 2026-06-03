import { cloneElement } from 'react';
import { SAFE_TOP, RoundBtn, Chevron } from '@/components/hayy/AppShell';
import { I, Avatar, Meta } from '@/components/hayy/HayyPrimitives';

const stageSpeakers = [
  { n: 'Maya Nasrallah', r: 'Host · AWS', tone: 'clay', you: false, talking: false },
  { n: 'You', r: 'Speaking', tone: 'olive', you: true, talking: true },
  { n: 'Rashid Khoury', r: 'Amazon', tone: 'dark', you: false, talking: false },
];

export default function LiveRoomSpeaking() {
  return (
    <div className="hy" data-palette="dusk" style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', background: 'var(--bg)', fontFamily: 'var(--sans)',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(90% 50% at 50% 24%, color-mix(in oklab, var(--clay) 22%, var(--bg)) 0%, var(--bg) 70%)' }} />

      <div style={{ position: 'relative', zIndex: 2, paddingTop: SAFE_TOP, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <RoundBtn icon={<Chevron />} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span className="hy-livedot" /><Meta>LIVE · 42 HERE</Meta></div>
        <RoundBtn icon={cloneElement(I.more as React.ReactElement, { size: 18 })} />
      </div>

      {/* "you're on" banner */}
      <div style={{ position: 'relative', zIndex: 2, margin: '16px 22px 0', padding: '12px 16px', borderRadius: 14, background: 'color-mix(in oklab, var(--clay) 18%, var(--bg))', border: '1px solid color-mix(in oklab, var(--clay) 40%, transparent)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 30, height: 30, borderRadius: 10, background: 'var(--clay)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{cloneElement(I.mic as React.ReactElement, { size: 15 })}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600 }}>You're on stage</p>
          <Meta>Maya invited you up — go ahead</Meta>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '22px 18px', maxWidth: 320 }}>
          {stageSpeakers.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 92 }}>
              <div style={{ position: 'relative', borderRadius: 999, padding: 3, background: s.talking ? 'var(--clay)' : 'transparent', boxShadow: s.talking ? '0 0 0 4px color-mix(in oklab, var(--clay) 24%, transparent)' : 'none' }}>
                <Avatar name={s.n} size={s.you ? 84 : 64} tone={s.tone} />
                {(s.you || s.r.startsWith('Host')) && (
                  <span style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 999, background: 'var(--clay)', color: 'var(--paper)', border: '2px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cloneElement(I.mic as React.ReactElement, { size: 12 })}</span>
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{s.n.split(' ')[0]}</p>
                <p style={{ fontSize: 11, color: s.you ? 'var(--clay)' : 'var(--ink-mute)', fontWeight: s.you ? 600 : 400 }}>{s.r}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, flex: 'none', padding: '16px 22px 34px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ height: 54, flex: 1, borderRadius: 18, background: 'var(--clay)', color: 'var(--paper)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          {cloneElement(I.mic as React.ReactElement, { size: 20 })}Mic on
        </button>
        <button style={{ height: 54, minWidth: 54, borderRadius: 18, background: 'var(--paper)', color: 'var(--ink)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{cloneElement(I.hand2 as React.ReactElement, { size: 22 })}</button>
        <button style={{ height: 54, minWidth: 54, borderRadius: 18, background: 'var(--paper)', color: 'var(--ink)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{cloneElement(I.heart as React.ReactElement, { size: 22 })}</button>
      </div>
    </div>
  );
}
