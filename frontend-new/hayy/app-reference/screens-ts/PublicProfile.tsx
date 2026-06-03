import { useState, cloneElement } from 'react';
import { DrillScreen, RoundBtn } from '@/components/hayy/AppShell';
import { I, Avatar, LiveTag, Btn, Card, Meta } from '@/components/hayy/HayyPrimitives';
import { RichProfileBody, MAYA_PROFILE } from '@/components/hayy/RichProfileBody';
import { useNav } from '@/hooks/useNav';

const hostRooms = [
  { t: 'Breaking into Product at Big Tech', n: 42, when: 'Tonight 7PM', live: true },
  { t: 'PM case interviews, unpacked', n: 31, when: 'Thu', live: false },
];

export default function PublicProfile() {
  const nav = useNav();
  const [following, setFollowing] = useState(false);

  return (
    <DrillScreen
      eyebrow=""
      title=""
      action={<RoundBtn icon={cloneElement(I.more as React.ReactElement, { size: 18 })} onClick={() => nav.go('report')} />}
      wash
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn kind="soft" size="lg" icon={I.shake} onClick={() => nav.go('requestIntro')} style={{ flex: 1, justifyContent: 'center' }}>Request referral</Btn>
          <Btn kind="primary" size="lg" iconRight={I.cal} onClick={() => nav.go('book')} style={{ flex: 1, justifyContent: 'center' }}>Book a 1:1</Btn>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 8, marginBottom: 18 }}>
        <Avatar name="Maya Nasrallah" size={88} tone="clay" />
        <h1 style={{ fontSize: 26, marginTop: 14 }}>Maya Nasrallah</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 4 }}>Sr Product Manager · AWS</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 12, padding: '6px 12px', borderRadius: 999, background: 'color-mix(in oklab, var(--clay) 9%, var(--paper))', border: '1px solid color-mix(in oklab, var(--clay) 20%, var(--line))' }}>
          {cloneElement(I.shake as React.ReactElement, { size: 14 })}
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--clay)' }}>Open to referrals</span>
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 18, width: '100%' }}>
          <Btn
            kind={following ? 'soft' : 'primary'}
            size="lg"
            icon={following ? I.check : I.plus}
            onClick={() => setFollowing((f) => !f)}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {following ? 'Following' : 'Follow'}
          </Btn>
          <Btn kind="soft" size="lg" icon={I.msg} onClick={() => nav.go('thread')} style={{ flex: 1, justifyContent: 'center' }}>Message</Btn>
        </div>
      </div>

      <Card style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20, padding: '15px 0' }}>
        {[['68', 'ROOMS HOSTED'], ['1.2k', 'FOLLOWERS'], ['24', 'REFERRED']].map(([n, l]) => (
          <div key={l} onClick={() => l === 'FOLLOWERS' && nav.go('follows')} style={{ textAlign: 'center', cursor: l === 'FOLLOWERS' ? 'pointer' : 'default' }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 24, lineHeight: 1 }}>{n}</div>
            <Meta>{l}</Meta>
          </div>
        ))}
      </Card>

      <RichProfileBody data={MAYA_PROFILE} />

      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', color: 'var(--ink-mute)', marginBottom: 12 }}>HOSTING NEXT</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
        {hostRooms.map((r, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              {r.live ? <LiveTag>Live</LiveTag> : <Meta>{r.when}</Meta>}
              <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2, marginTop: 8 }}>{r.t}</p>
            </div>
            <Btn kind={r.live ? 'primary' : 'soft'} size="md" onClick={() => nav.go('greenRoom')}>{r.live ? 'Join' : 'Remind'}</Btn>
          </Card>
        ))}
      </div>
    </DrillScreen>
  );
}
