import { DrillScreen } from '@/components/hayy/AppShell';
import { Card, Toggle } from '@/components/hayy/HayyPrimitives';

const visibility = [
  ['Show me in search', true],
  ['Let hosts see I\'m in a room', true],
  ['Open to referrals', true],
  ['Show my company', false],
] as const;

const messaging = [
  ['Everyone', false],
  ['People from my rooms', true],
  ['Connections only', false],
] as const;

export default function PrivacyScreen() {
  return (
    <DrillScreen title="Privacy" eyebrow="">
      <p className="mono" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 8 }}>
        VISIBILITY
      </p>
      <Card pad={0} style={{ marginBottom: 20 }}>
        {visibility.map(([label, on], i) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 16px',
            borderBottom: i < visibility.length - 1 ? '1px solid var(--line)' : 'none',
          }}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>{label}</span>
            <Toggle on={on} />
          </div>
        ))}
      </Card>

      <p className="mono" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 8 }}>
        WHO CAN MESSAGE YOU
      </p>
      <Card pad={0} style={{ marginBottom: 20 }}>
        {messaging.map(([label, active], i) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 16px',
            borderBottom: i < messaging.length - 1 ? '1px solid var(--line)' : 'none',
          }}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>{label}</span>
            <span style={{
              width: 20, height: 20, borderRadius: 999, flex: 'none',
              border: active ? '6px solid var(--clay)' : '2px solid var(--ink-mute)',
            }} />
          </div>
        ))}
      </Card>

      {/* Plain list */}
      <Card pad={0} style={{ marginBottom: 32 }}>
        {[
          { label: 'Blocked accounts', color: 'var(--ink)' },
          { label: 'Download my data', color: 'var(--ink)' },
          { label: 'Delete account', color: '#c0492f' },
        ].map(({ label, color }, i) => (
          <div key={label} style={{
            padding: '15px 16px', fontSize: 15, fontWeight: 500,
            color,
            borderBottom: i < 2 ? '1px solid var(--line)' : 'none',
            cursor: 'pointer',
          }}>
            {label}
          </div>
        ))}
      </Card>
    </DrillScreen>
  );
}
