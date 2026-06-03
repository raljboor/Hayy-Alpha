import { useState, useEffect, cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { SAFE_TOP, RoundBtn, Chevron } from '@/components/hayy/AppShell';
import { I, Icon, Avatar, Meta } from '@/components/hayy/HayyPrimitives';

const speakers = [
  { n: 'Maya Nasrallah', r: 'Host · AWS', tone: 'clay', big: true, talking: true },
  { n: 'Rashid Khoury', r: 'Amazon', tone: 'dark', talking: false },
  { n: 'Jenna Sun', r: 'Shopify', tone: 'olive', talking: true },
  { n: 'Omar Aziz', r: 'RBC', tone: 'sand', talking: false },
  { n: 'Priya Shah', r: 'Stripe', tone: 'clay', talking: false },
];

const liveComments = [
  { n: 'Dana', t: 'this is so helpful 🙌', tone: 'olive' },
  { n: 'Tom', t: 'how junior is too junior?', tone: 'dark' },
  { n: 'Priya', t: '+1 to the portfolio point', tone: 'clay' },
  { n: 'Sam', t: 'following!', tone: 'sand' },
];

const SpeakerBubble = ({ s, size }: { s: typeof speakers[0]; size: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: size + 18 }}>
    <div style={{ position: 'relative', borderRadius: 999, padding: 3, background: s.talking ? 'var(--clay)' : 'transparent', boxShadow: s.talking ? '0 0 0 3px color-mix(in oklab, var(--clay) 22%, transparent)' : 'none' }}>
      <Avatar name={s.n} size={size} tone={s.tone} />
      {s.r.startsWith('Host') && (
        <span style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 999, background: 'var(--clay)', color: 'var(--paper)', border: '2px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {cloneElement(I.mic as React.ReactElement, { size: 11 })}
        </span>
      )}
    </div>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.1 }}>{s.n.split(' ')[0]}</p>
      <p style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{s.r}</p>
    </div>
  </div>
);

const FloatingComments = () => {
  const [items, setItems] = useState<Array<{ n: string; t: string; tone: string; id: number }>>([]);
  useEffect(() => {
    let id = 0;
    const push = () => setItems((prev) => [...prev, { ...liveComments[id % liveComments.length], id: id++ }].slice(-3));
    push();
    const t = setInterval(push, 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: 'absolute', left: 16, right: 64, bottom: 150, zIndex: 3, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'flex-end', WebkitMaskImage: 'linear-gradient(to top, #000 55%, transparent)', maskImage: 'linear-gradient(to top, #000 55%, transparent)' }}>
      {items.map((c) => (
        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', maxWidth: '100%', animation: 'hy-rise-in .45s cubic-bezier(.4,0,.2,1)' }}>
          <Avatar name={c.n} size={26} tone={c.tone} />
          <div style={{ background: 'color-mix(in oklab, var(--paper) 78%, transparent)', border: '1px solid var(--line-soft)', backdropFilter: 'blur(8px)', borderRadius: 14, padding: '7px 12px', display: 'flex', gap: 7, alignItems: 'baseline' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--clay)' }}>{c.n}</span>
            <span style={{ fontSize: 13.5, color: 'var(--ink)' }}>{c.t}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const ctrlStyle = (accent: boolean): React.CSSProperties => ({
  height: 54, minWidth: 54, borderRadius: 18, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '1px solid var(--line)',
  background: accent ? 'var(--clay)' : 'var(--paper)',
  color: accent ? 'var(--paper)' : 'var(--ink)',
});

export default function LiveRoom() {
  const navigate = useNavigate();
  return (
    <div className="hy" data-palette="dusk" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--bg)', fontFamily: 'var(--sans)' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(90% 50% at 50% 22%, color-mix(in oklab, var(--clay) 20%, var(--bg)) 0%, var(--bg) 70%)' }} />
      <div style={{ position: 'relative', zIndex: 2, paddingTop: SAFE_TOP, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <RoundBtn icon={<Icon d="M15 18l-6-6 6-6" size={18} />} onClick={() => navigate(-1)} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <span className="hy-livedot" /><Meta>LIVE · 42 HERE</Meta>
        </div>
        <button onClick={() => navigate('/app/rooms/r2/live')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: 999, background: 'color-mix(in oklab, var(--clay) 18%, transparent)', border: '1px solid color-mix(in oklab, var(--clay) 40%, transparent)', color: 'var(--clay)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
          {cloneElement(I.shuffle as React.ReactElement, { size: 14 })}Next
        </button>
      </div>
      <div style={{ position: 'relative', zIndex: 2, padding: '16px 24px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, lineHeight: 1.12 }}>Breaking into Product at Big&nbsp;Tech</h2>
      </div>
      <div style={{ position: 'relative', zIndex: 2, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: 20 }}>
        <SpeakerBubble s={speakers[0]} size={92} />
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px 14px', maxWidth: 320 }}>
          {speakers.slice(1).map((s, i) => <SpeakerBubble key={i} s={s} size={58} />)}
        </div>
        <Meta>+ 37 listening</Meta>
      </div>
      <FloatingComments />
      <div style={{ position: 'relative', zIndex: 4, flex: 'none', padding: '0 22px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 16px', borderRadius: 999, background: 'color-mix(in oklab, var(--paper) 70%, transparent)', border: '1px solid var(--line)', backdropFilter: 'blur(8px)', color: 'var(--ink-mute)' }}>
          {cloneElement(I.msg as React.ReactElement, { size: 16 })}
          <span style={{ fontSize: 14, flex: 1 }}>Say something…</span>
          <span style={{ color: 'var(--clay)' }}>{cloneElement(I.arrow as React.ReactElement, { size: 16 })}</span>
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 2, flex: 'none', padding: '4px 22px 34px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <button style={ctrlStyle(false)}>{cloneElement(I.micOff as React.ReactElement, { size: 22 })}</button>
        <button style={{ ...ctrlStyle(false), flex: 1, gap: 9, width: 'auto' }}>
          {cloneElement(I.hand2 as React.ReactElement, { size: 20 })}<span style={{ fontSize: 15, fontWeight: 600 }}>Raise hand</span>
        </button>
        <button style={ctrlStyle(true)}>{cloneElement(I.heart as React.ReactElement, { size: 22 })}</button>
      </div>
    </div>
  );
}
