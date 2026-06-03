import { cloneElement } from 'react';
import { DrillScreen, RoundBtn } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Card, Meta } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const fromRooms = [
  { n: 'Maya Nasrallah', r: 'Sr PM · AWS', tone: 'clay' },
  { n: 'Rashid Khoury', r: 'Eng Mgr · Amazon', tone: 'dark' },
  { n: 'Jenna Sun', r: 'Talent · Shopify', tone: 'olive' },
];

const suggestions = [
  { n: 'Omar Aziz', r: 'Data · RBC', tone: 'sand' },
  { n: 'Layla Park', r: 'APM · Figma', tone: 'clay' },
];

export default function ConnectionsScreen() {
  const { go } = useNav();

  return (
    <DrillScreen
      title="Your network"
      eyebrow=""
      action={<RoundBtn icon={cloneElement(I.search as React.ReactElement, { size: 18 })} onClick={() => go('search')} />}
    >
      {/* Stats */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          {[['128', 'CONNECTIONS'], ['61', 'WARM INTROS'], ['12', 'COMPANIES']].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 32, color: 'var(--clay)', lineHeight: 1 }}>{num}</div>
              <Meta>{label}</Meta>
            </div>
          ))}
        </div>
      </Card>

      <p className="mono" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 10 }}>
        FROM YOUR ROOMS
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
        {fromRooms.map((p) => (
          <div key={p.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
            <Avatar name={p.n} size={44} tone={p.tone} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 15 }}>{p.n}</p>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{p.r}</p>
            </div>
            <Btn kind="soft" icon={cloneElement(I.msg as React.ReactElement, { size: 15 })} onClick={() => go('thread')}>
              Message
            </Btn>
          </div>
        ))}
      </div>

      <p className="mono" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 10 }}>
        PEOPLE YOU MAY KNOW
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 32 }}>
        {suggestions.map((p) => (
          <div key={p.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
            <Avatar name={p.n} size={44} tone={p.tone} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 15 }}>{p.n}</p>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{p.r}</p>
            </div>
            <Btn kind="soft" icon={cloneElement(I.plus as React.ReactElement, { size: 15 })}>
              Connect
            </Btn>
          </div>
        ))}
      </div>
    </DrillScreen>
  );
}
