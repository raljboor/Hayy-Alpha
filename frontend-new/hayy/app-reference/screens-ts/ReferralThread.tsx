import { cloneElement } from 'react';
import { DrillScreen, RoundBtn } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Card, Meta } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const bubbles = [
  { me: false, txt: 'Loved your question in the room tonight — really sharp framing.', t: '7:48 PM' },
  { me: true, txt: 'Thank you! That means a lot coming from you 🙏', t: '7:49 PM' },
  { me: false, txt: "I'd be happy to put you in touch with our recruiter. Mind if I share your profile?", t: '7:50 PM' },
  { me: true, txt: 'Yes please — that would be amazing.', t: '7:51 PM' },
];

export default function ReferralThread() {
  const nav = useNav();
  return (
    <DrillScreen
      eyebrow="AWS · ONLINE"
      title="Maya Nasrallah"
      action={<RoundBtn icon={cloneElement(I.more as React.ReactElement, { size: 18 })} />}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, padding: '12px 16px', borderRadius: 22, background: 'var(--cream)', border: '1px solid var(--line)', color: 'var(--ink-mute)', fontSize: 14 }}>Message…</div>
          <button style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--clay)', color: 'var(--paper)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            {cloneElement(I.arrow as React.ReactElement, { size: 19 })}
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8, paddingBottom: 12 }}>
        <div style={{ textAlign: 'center' }}><Meta>TODAY</Meta></div>
        <div style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: 'color-mix(in oklab, var(--clay) 10%, var(--paper))', border: '1px solid color-mix(in oklab, var(--clay) 22%, var(--line))', fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 4 }}>
          {cloneElement(I.mic as React.ReactElement, { size: 13 })} You met in <b style={{ color: 'var(--ink)' }}>Room 04</b>
        </div>
        {bubbles.map((b, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: b.me ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '78%' }}>
              <div style={{ padding: '11px 15px', borderRadius: b.me ? '20px 20px 6px 20px' : '20px 20px 20px 6px', background: b.me ? 'var(--clay)' : 'var(--paper)', color: b.me ? 'var(--paper)' : 'var(--ink)', border: b.me ? 'none' : '1px solid var(--line)', fontSize: 14.5, lineHeight: 1.4 }}>{b.txt}</div>
              <p style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 4, textAlign: b.me ? 'right' : 'left', paddingLeft: 4, paddingRight: 4 }}>{b.t}</p>
            </div>
          </div>
        ))}
        <div style={{ alignSelf: 'flex-start', maxWidth: '82%' }}>
          <Card pad={12} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <Avatar name="Adam Saleh" size={38} tone="clay" />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13.5, fontWeight: 600 }}>Adam Saleh</p>
              <Meta>Profile shared</Meta>
            </div>
            {cloneElement(I.arrow as React.ReactElement, { size: 16 })}
          </Card>
        </div>
      </div>
    </DrillScreen>
  );
}
