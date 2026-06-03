import { AppScreen, ScreenHead, RoundBtn } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Card, Meta } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';
import { cloneElement } from 'react';

const recent = ['product interviews', 'Figma', 'warm intro', 'new grad'];
const topics = [
  { t: 'Product', n: 38 }, { t: 'Engineering', n: 52 }, { t: 'Design', n: 24 },
  { t: 'Data', n: 19 }, { t: 'Recruiting', n: 16 }, { t: 'Fintech', n: 21 },
];
const peopleHits = [
  { n: 'Maya Nasrallah', r: 'Sr PM · AWS', tone: 'clay' },
  { n: 'Layla Park', r: 'Design · Figma', tone: 'olive' },
  { n: 'Omar Aziz', r: 'Data · RBC', tone: 'sand' },
];

export default function Search() {
  const nav = useNav();
  return (
    <AppScreen tab="rooms">
      <ScreenHead eyebrow="DISCOVER" title="Search" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', marginBottom: 24, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 16, color: 'var(--ink-mute)' }}>
        {cloneElement(I.search as React.ReactElement, { size: 18 })}
        <span style={{ fontSize: 15 }}>People, rooms, companies…</span>
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', color: 'var(--ink-mute)', marginBottom: 11 }}>RECENT</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
        {recent.map((r) => (
          <span key={r} className="hy-pill" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            {cloneElement(I.search as React.ReactElement, { size: 13 })}{r}
          </span>
        ))}
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', color: 'var(--ink-mute)', marginBottom: 11 }}>BROWSE TOPICS</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 26 }}>
        {topics.map((t) => (
          <Card key={t.t} pad={14} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{t.t}</span>
            <Meta>{t.n}</Meta>
          </Card>
        ))}
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', color: 'var(--ink-mute)', marginBottom: 11 }}>PEOPLE TO MEET</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 16 }}>
        {peopleHits.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 4px', borderBottom: i < peopleHits.length - 1 ? '1px solid var(--line-soft)' : 'none' }}>
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
