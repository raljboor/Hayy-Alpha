import { cloneElement } from 'react';
import { DrillScreen } from '@/components/hayy/AppShell';
import { I, Btn, Card } from '@/components/hayy/HayyPrimitives';

const topics = [
  'Getting started with rooms',
  'How referrals work',
  'Hosting your first room',
  'Privacy & who can see you',
  'Managing notifications',
];

export default function HelpScreen() {
  return (
    <DrillScreen title="Help & feedback" eyebrow="">
      {/* Search box */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', marginBottom: 24,
        background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 14,
        color: 'var(--ink-mute)',
      }}>
        {cloneElement(I.search as React.ReactElement, { size: 17 })}
        <span style={{ fontSize: 15 }}>Search help articles…</span>
      </div>

      <p className="mono" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 8 }}>
        POPULAR
      </p>

      <Card pad={0} style={{ marginBottom: 24 }}>
        {topics.map((topic, i) => (
          <div key={topic} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 16px',
            borderBottom: i < topics.length - 1 ? '1px solid var(--line)' : 'none',
            cursor: 'pointer',
          }}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>{topic}</span>
            {cloneElement(I.arrow as React.ReactElement, { size: 16 })}
          </div>
        ))}
      </Card>

      <p className="mono" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 12 }}>
        STILL STUCK?
      </p>

      <div style={{ display: 'flex', gap: 10, paddingBottom: 32 }}>
        <Btn kind="soft" icon={cloneElement(I.msg as React.ReactElement, { size: 16 })}>Contact us</Btn>
        <Btn kind="soft" icon={cloneElement(I.spark as React.ReactElement, { size: 16 })}>Send feedback</Btn>
      </div>
    </DrillScreen>
  );
}
