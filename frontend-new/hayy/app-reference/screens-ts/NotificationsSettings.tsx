import { DrillScreen } from '@/components/hayy/AppShell';
import { Card, Toggle } from '@/components/hayy/HayyPrimitives';

const groups = [
  {
    label: 'ROOMS',
    rows: [
      ['Room reminders', true],
      ['New rooms from people you follow', true],
      ['Room starting soon', false],
    ],
  },
  {
    label: 'INTROS & REFERRALS',
    rows: [
      ['New messages', true],
      ['Referral updates', true],
      ['Intro requests', true],
    ],
  },
  {
    label: 'SOCIAL',
    rows: [
      ['New followers', false],
      ['Reactions to your questions', true],
    ],
  },
] as const;

export default function NotificationsSettingsScreen() {
  return (
    <DrillScreen title="Notifications" eyebrow="">
      {groups.map((group) => (
        <div key={group.label} style={{ marginBottom: 24 }}>
          <p className="mono" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 8 }}>
            {group.label}
          </p>
          <Card pad={0}>
            {group.rows.map(([label, on], i) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 16px',
                borderBottom: i < group.rows.length - 1 ? '1px solid var(--line)' : 'none',
              }}>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{label}</span>
                <Toggle on={on} />
              </div>
            ))}
          </Card>
        </div>
      ))}
      <div style={{ paddingBottom: 32 }} />
    </DrillScreen>
  );
}
