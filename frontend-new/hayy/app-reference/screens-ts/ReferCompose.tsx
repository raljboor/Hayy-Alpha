import { cloneElement } from 'react';
import { DrillScreen } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Card, Field, HayyInput } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

export default function ReferComposeScreen() {
  const { go } = useNav();

  return (
    <DrillScreen
      title="Refer someone"
      eyebrow="WARM INTRO"
      footer={
        <Btn kind="primary" icon={cloneElement(I.shake as React.ReactElement, { size: 16 })} onClick={() => go('referrals')}>
          Send referral
        </Btn>
      }
    >
      <div style={{ paddingBottom: 32 }}>
        <Field label="Who are you referring?">
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name="Adam Saleh" size={40} tone="clay" />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 15 }}>Adam Saleh</p>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Aspiring PM · Toronto</p>
              </div>
              <span style={{ color: '#3fb98a' }}>{cloneElement(I.check as React.ReactElement, { size: 18 })}</span>
            </div>
          </Card>
        </Field>

        <Field label="For which role / team?">
          <HayyInput placeholder="e.g. APM, AWS" />
        </Field>

        <Field label="To whom?">
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name="Sarah Chen" size={40} tone="olive" />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 15 }}>Sarah Chen</p>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Recruiter · AWS</p>
              </div>
              <span style={{ color: '#3fb98a' }}>{cloneElement(I.check as React.ReactElement, { size: 18 })}</span>
            </div>
          </Card>
        </Field>

        <Field label="Add a note">
          <div style={{
            padding: '12px 16px', borderRadius: 14, background: 'var(--paper)',
            border: '1px solid var(--line)', fontSize: 15, color: 'var(--ink-mute)',
            minHeight: 110, lineHeight: 1.55,
          }}>
            Adam is a strong candidate — 2 years in growth with a sharp product sense. He'd be a great fit for your APM pipeline…
          </div>
        </Field>
      </div>
    </DrillScreen>
  );
}
