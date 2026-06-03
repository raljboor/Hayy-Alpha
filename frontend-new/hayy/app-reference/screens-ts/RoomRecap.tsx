import { cloneElement } from 'react';
import { DrillScreen, RoundBtn } from '@/components/hayy/AppShell';
import { I, Icon, Avatar, Btn, Card, Meta } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const recapClips = [
  { t: 'On telling a product story', who: 'Maya', len: '0:42' },
  { t: 'The one question to always ask', who: 'Rashid', len: '1:05' },
];

export default function RoomRecap() {
  const nav = useNav();
  return (
    <DrillScreen
      title="Recap"
      eyebrow="ROOM 04 · ENDED"
      action={<RoundBtn icon={cloneElement(I.link as React.ReactElement, { size: 16 })} />}
      wash
      footer={<Btn kind="primary" size="xl" icon={I.shake} onClick={() => nav.go('thread')} style={{ width: '100%', justifyContent: 'center' }}>Follow up with 3 people</Btn>}
    >
      <div style={{ paddingTop: 8, paddingBottom: 12 }}>
        <h1 style={{ fontSize: 26, lineHeight: 1.1, marginBottom: 8 }}>Breaking into Product at Big&nbsp;Tech</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <Meta>58 MIN</Meta><Meta>·</Meta><Meta>42 ATTENDED</Meta><Meta>·</Meta><Meta>9 SPOKE</Meta>
        </div>

        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', color: 'var(--ink-mute)', marginBottom: 12 }}>PEOPLE YOU MET</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 26 }}>
          {[['Maya Nasrallah', 'Sr PM · AWS', 'clay'], ['Rashid Khoury', 'Eng Mgr · Amazon', 'dark'], ['Jenna Sun', 'Talent · Shopify', 'olive']].map(([n, r, t], i) => (
            <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={n} size={40} tone={t} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14.5, fontWeight: 600 }}>{n}</p>
                <Meta>{r}</Meta>
              </div>
              <Btn kind="soft" size="md" icon={I.msg} onClick={() => nav.go('thread')}>Say hi</Btn>
            </Card>
          ))}
        </div>

        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', color: 'var(--ink-mute)', marginBottom: 12 }}>HIGHLIGHTS</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingBottom: 8 }}>
          {recapClips.map((c, i) => (
            <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--clay)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                <Icon d="M8 5v14l11-7z" size={16} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{c.t}</p>
                <Meta>{c.who}</Meta>
              </div>
              <Meta>{c.len}</Meta>
            </Card>
          ))}
        </div>
      </div>
    </DrillScreen>
  );
}
