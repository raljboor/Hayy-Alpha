import { cloneElement } from 'react';
import { DrillScreen } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Card, Field, HayyInput } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

export default function RequestIntroScreen() {
  const { go } = useNav();

  return (
    <DrillScreen
      title="Ask for an intro"
      eyebrow="WARM INTRO"
      footer={
        <Btn kind="primary" icon={cloneElement(I.shake as React.ReactElement, { size: 16 })} onClick={() => go('referrals')}>
          Send request
        </Btn>
      }
    >
      <div style={{ paddingBottom: 32 }}>
        <Field label="Who do you want to meet?">
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

        <Field label="Ask through">
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name="Maya Nasrallah" size={40} tone="clay" />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 15 }}>Maya Nasrallah</p>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Knows Sarah · 4 mutual</p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#3fb98a' }}>Strong</span>
            </div>
          </Card>
        </Field>

        <Field label="What's the ask?">
          <HayyInput placeholder="e.g. 15 min about the APM role" />
        </Field>

        <Field label="Why you?">
          <div style={{
            padding: '12px 16px', borderRadius: 14, background: 'var(--paper)',
            border: '1px solid var(--line)', fontSize: 15, color: 'var(--ink-mute)',
            minHeight: 110, lineHeight: 1.55,
          }}>
            I've spent 2 years in growth marketing and I'm making a deliberate move into product. Sarah's work at AWS on developer tooling caught my attention and I'd love to learn more about the team…
          </div>
        </Field>
      </div>
    </DrillScreen>
  );
}
