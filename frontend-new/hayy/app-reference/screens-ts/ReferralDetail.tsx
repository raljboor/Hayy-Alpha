import { cloneElement } from 'react';
import { DrillScreen, RoundBtn } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Meta } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const timeline = [
  { t: 'Referral sent', who: 'Maya → Sarah Chen', when: 'Mon 8:12 PM', done: true, accent: false },
  { t: 'Recruiter reviewing', who: 'Sarah opened your profile', when: 'Tue 9:40 AM', done: true, accent: false },
  { t: 'Replied', who: '"Let\'s set up a call"', when: 'Tue 2:15 PM', done: true, accent: true },
  { t: 'Call booked', who: 'Thu, 10:00 AM', when: 'Upcoming', done: false, accent: false },
];

export default function ReferralDetailScreen() {
  const { go } = useNav();

  return (
    <DrillScreen
      title="Referral"
      eyebrow="IN MOTION"
      action={<RoundBtn icon={cloneElement(I.more as React.ReactElement, { size: 18 })} />}
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn kind="primary" onClick={() => go('updateOutcome')}>Update status</Btn>
          <Btn kind="soft" icon={cloneElement(I.msg as React.ReactElement, { size: 16 })}>Message</Btn>
        </div>
      }
    >
      {/* Connection display */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <Avatar name="Adam Saleh" size={52} tone="clay" />
          <span style={{
            width: 36, height: 36, borderRadius: 999,
            background: 'color-mix(in oklab, var(--clay) 16%, var(--paper))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--clay)', border: '1px solid color-mix(in oklab, var(--clay) 20%, transparent)',
          }}>
            {cloneElement(I.shake as React.ReactElement, { size: 18 })}
          </span>
          <Avatar name="Sarah Chen" size={52} tone="olive" />
        </div>
        <Meta>APM · AWS · via Maya Nasrallah</Meta>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 28, paddingBottom: 32 }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 9, top: 8, bottom: 20,
          width: 2, background: 'var(--line)',
        }} />

        {timeline.map((step, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: 24 }}>
            {/* Dot */}
            <span style={{
              position: 'absolute', left: -23, top: 2,
              width: 18, height: 18, borderRadius: 999,
              background: step.done ? 'var(--clay)' : 'var(--paper)',
              border: step.done ? 'none' : '2px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--paper)',
              zIndex: 1,
            }}>
              {step.done && cloneElement(I.check as React.ReactElement, { size: 10 })}
            </span>

            <p style={{
              fontWeight: 600, fontSize: 15,
              color: step.accent ? 'var(--clay)' : 'var(--ink)',
              marginBottom: 2,
            }}>
              {step.t}
            </p>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 1 }}>{step.who}</p>
            <p style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{step.when}</p>
          </div>
        ))}
      </div>
    </DrillScreen>
  );
}
