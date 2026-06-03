import { cloneElement } from 'react';
import { AppScreen, RoundBtn } from '@/components/hayy/AppShell';
import { I, Avatar, LiveTag, Btn, Card, Meta, Stack } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const liveNow = [
  { t: 'Portfolio teardowns, live', host: 'Layla Park', n: 31, tone: 'olive' },
  { t: 'Cracking the PM case', host: 'Maya Nasrallah', n: 42, tone: 'clay' },
  { t: 'Bootcamp → backend', host: 'Omar Aziz', n: 17, tone: 'sand' },
];

const upcoming = [
  { t: 'Design portfolios that get callbacks', host: 'Layla Park', co: 'Figma', time: '8:30 PM', n: 28, tone: 'olive' },
  { t: 'New grad → first eng role', host: 'Rashid Khoury', co: 'Amazon', time: 'Tomorrow', n: 61, tone: 'dark' },
];

const meet = [
  { n: 'Jenna Sun', r: 'Talent · Shopify', tone: 'olive' },
  { n: 'Rashid Khoury', r: 'Eng Mgr · Amazon', tone: 'dark' },
];

export default function Dashboard() {
  const nav = useNav();
  return (
    <AppScreen tab="home">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <Meta>TUESDAY · MAY 31</Meta>
          <h1 style={{ fontSize: 30, lineHeight: 1.05, marginTop: 6 }}>
            Evening, <span className="display-italic">Adam.</span>
          </h1>
        </div>
        <RoundBtn icon={cloneElement(I.search as React.ReactElement, { size: 18 })} onClick={() => nav.go('search')} />
      </div>

      {/* live now strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span className="hy-livedot" />
          <h3 style={{ fontSize: 14, fontWeight: 700 }}>Live now</h3>
        </span>
        <span onClick={() => nav.go('liveRoom')} style={{ fontSize: 13, color: 'var(--clay)', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          {cloneElement(I.shuffle as React.ReactElement, { size: 14 })} Shuffle
        </span>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '0 -22px 26px', padding: '0 22px 4px' }}>
        {liveNow.map((r, i) => (
          <Card key={i} onClick={() => nav.go('liveRoom')} pad={14} style={{ flex: 'none', width: 198, cursor: 'pointer' }}>
            <LiveTag>Live</LiveTag>
            <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.25, margin: '12px 0 14px', minHeight: 38 }}>{r.t}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar name={r.host} size={26} tone={r.tone} />
              <Meta>{r.n} listening</Meta>
            </div>
          </Card>
        ))}
      </div>

      {/* up next — reserved room */}
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Up next for you</h3>
      <Card pad={0} onClick={() => nav.go('roomDetail')} style={{ overflow: 'hidden', marginBottom: 26, cursor: 'pointer' }}>
        <div style={{ padding: '18px 18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span className="hy-pill" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11, fontWeight: 600, background: 'color-mix(in oklab, var(--clay) 12%, var(--paper))', color: 'var(--clay)', borderColor: 'color-mix(in oklab, var(--clay) 24%, var(--line))' }}>Reserved</span>
            <Meta>TODAY · 7:00 PM · ROOM 04</Meta>
          </div>
          <h2 style={{ fontSize: 23, lineHeight: 1.12, marginBottom: 16 }}>Breaking into Product at Big&nbsp;Tech</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <Avatar name="Maya Nasrallah" size={38} tone="clay" />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>Maya Nasrallah</p>
              <p style={{ fontSize: 12, color: 'var(--ink-mute)' }}>Sr PM · AWS · hosting</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Stack names={['A B', 'C D', 'E F', 'G H']} n={42} />
              <Meta>42 going</Meta>
            </div>
            <Btn kind="primary" iconRight={I.arrow} onClick={(e) => { e.stopPropagation(); nav.go('greenRoom'); }}>View</Btn>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, color: 'var(--ink-soft)', fontWeight: 600 }}>Later this week</h3>
        <span onClick={() => nav.go('rooms')} style={{ fontSize: 13, color: 'var(--clay)', fontWeight: 600, cursor: 'pointer' }}>See all</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
        {upcoming.map((r, i) => (
          <Card key={i} onClick={() => nav.go('roomDetail')} style={{ display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer' }}>
            <Avatar name={r.host} size={44} tone={r.tone} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2, marginBottom: 4 }}>{r.t}</p>
              <Meta>{r.host} · {r.co}</Meta>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--clay)' }}>{r.time}</p>
              <Meta>{r.n} going</Meta>
            </div>
          </Card>
        ))}
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>People to meet</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 16 }}>
        {meet.map((p, i) => (
          <div key={i} onClick={() => nav.go('publicProfile')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 4px', cursor: 'pointer', borderBottom: i < meet.length - 1 ? '1px solid var(--line-soft)' : 'none' }}>
            <Avatar name={p.n} size={44} tone={p.tone} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{p.n}</p>
              <Meta>{p.r}</Meta>
            </div>
            <Btn kind="soft" size="md" onClick={(e) => e.stopPropagation()}>Follow</Btn>
          </div>
        ))}
      </div>
    </AppScreen>
  );
}
