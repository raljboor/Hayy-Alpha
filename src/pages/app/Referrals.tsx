import { cloneElement } from 'react';
import { AppScreen, ScreenHead, RoundBtn } from '@/components/hayy/AppShell';
import { I, Avatar, Card, Meta } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const lanes = [
  { s: 'In motion', c: 'var(--clay)', items: [
    { who: 'Maya Nasrallah', role: 'APM · AWS', via: 'via Maya', tone: 'clay', step: 'Recruiter reviewing' },
    { who: 'Tom Reyes', role: 'SWE · Shopify', via: 'via Layla', tone: 'dark', step: 'Intro sent' },
  ] },
  { s: 'Replied', c: '#3fb98a', items: [
    { who: 'Dana Liu', role: 'Design · Figma', via: 'via Priya', tone: 'clay', step: 'Call booked Thu' },
  ] },
  { s: 'Landed', c: 'var(--ink-mute)', items: [
    { who: 'You', role: 'joined Stripe', via: 'via Omar', tone: 'sand', step: "Mar '26" },
  ] },
];

export default function Referrals() {
  const nav = useNav();
  return (
    <AppScreen tab="you">
      <ScreenHead eyebrow="PIPELINE" title="Referrals" trailing={<RoundBtn icon={cloneElement(I.plus as React.ReactElement, { size: 18 })} onClick={() => nav.go('refer')} />} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingBottom: 16 }}>
        {lanes.map((lane) => (
          <div key={lane.s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: lane.c }} />
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.04em' }}>{lane.s}</span>
              <Meta>{lane.items.length}</Meta>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {lane.items.map((it, i) => (
                <Card key={i} onClick={() => nav.go('referralDetail')} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <Avatar name={it.who} size={42} tone={it.tone} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>{it.who}</p>
                    <Meta>{it.role} · {it.via}</Meta>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: lane.c }}>{it.step}</span>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppScreen>
  );
}
