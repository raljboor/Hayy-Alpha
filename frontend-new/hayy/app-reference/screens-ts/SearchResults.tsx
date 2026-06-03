import { cloneElement } from 'react';
import { AppScreen, RoundBtn, Chevron } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Card, Meta, LiveTag } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const resultTabs = ['All', 'Rooms', 'People', 'Companies'];

const resRooms = [
  { t: 'Cracking the PM case interview', host: 'Maya Nasrallah', live: true, n: 42, tone: 'clay' },
  { t: 'How we hire designers at Figma', host: 'Layla Park', live: false, n: 28, tone: 'olive' },
];

const resPeople = [
  { n: 'Maya Nasrallah', r: 'Sr PM · AWS', tone: 'clay' },
  { n: 'Priya Shah', r: 'Recruiter · Stripe', tone: 'dark' },
];

export default function SearchResults() {
  const nav = useNav();
  return (
    <AppScreen tab="rooms">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingTop: 4 }}>
        <RoundBtn icon={<Chevron />} onClick={() => nav.back()} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px', borderRadius: 14, background: 'var(--paper)', border: '1px solid var(--line)' }}>
          {cloneElement(I.search as React.ReactElement, { size: 17 })}
          <span style={{ fontSize: 15, color: 'var(--ink)' }}>product</span>
          <span style={{ marginLeft: 'auto', color: 'var(--ink-mute)', fontSize: 13 }}>✕</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 22, paddingBottom: 2 }}>
        {resultTabs.map((c, i) => (
          <span key={c} className="hy-pill" style={{
            flex: 'none', padding: '7px 14px', fontSize: 13, letterSpacing: 0, textTransform: 'none',
            background: i === 0 ? 'var(--clay)' : 'var(--paper)',
            color: i === 0 ? 'var(--paper)' : 'var(--ink-soft)',
            border: i === 0 ? 'none' : '1px solid var(--line)',
          }}>{c}</span>
        ))}
      </div>

      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', color: 'var(--ink-mute)', marginBottom: 11 }}>ROOMS</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {resRooms.map((r, i) => (
          <Card key={i} onClick={() => nav.go('roomDetail')} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <Avatar name={r.host} size={42} tone={r.tone} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.2 }}>{r.t}</p>
              <Meta>{r.host} · {r.n} going</Meta>
            </div>
            {r.live ? <LiveTag>Live</LiveTag> : <Meta>TONIGHT</Meta>}
          </Card>
        ))}
      </div>

      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', color: 'var(--ink-mute)', marginBottom: 11 }}>PEOPLE</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 16 }}>
        {resPeople.map((p, i) => (
          <div key={i} onClick={() => nav.go('publicProfile')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 4px', cursor: 'pointer', borderBottom: i < resPeople.length - 1 ? '1px solid var(--line-soft)' : 'none' }}>
            <Avatar name={p.n} size={42} tone={p.tone} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{p.n}</p>
              <Meta>{p.r}</Meta>
            </div>
            <Btn kind="soft" size="md">Follow</Btn>
          </div>
        ))}
      </div>
    </AppScreen>
  );
}
