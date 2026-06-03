import { DrillScreen } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Card, Meta } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const days = [['Mon', '2'], ['Tue', '3'], ['Wed', '4'], ['Thu', '5'], ['Fri', '6']];
const slots = ['9:00', '9:30', '10:00', '11:00', '1:30', '2:00', '3:00', '4:30'];

export default function BookOneOnOne() {
  const nav = useNav();
  return (
    <DrillScreen
      title="Book a 1:1"
      eyebrow="WITH MAYA NASRALLAH"
      footer={<Btn kind="primary" size="xl" iconRight={I.arrow} onClick={() => nav.go('scheduled')} style={{ width: '100%', justifyContent: 'center' }}>Confirm · Wed 10:00 AM</Btn>}
    >
      <div style={{ paddingTop: 10, paddingBottom: 12 }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <Avatar name="Maya Nasrallah" size={46} tone="clay" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Maya Nasrallah</p>
            <Meta>Sr PM · AWS · 20 min call</Meta>
          </div>
        </Card>

        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', color: 'var(--ink-mute)', marginBottom: 12 }}>PICK A DAY</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {days.map(([d, n], i) => {
            const on = i === 2;
            return (
              <div key={d} style={{ flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 14, cursor: 'pointer', background: on ? 'var(--clay)' : 'var(--paper)', color: on ? 'var(--paper)' : 'var(--ink)', border: on ? 'none' : '1px solid var(--line)' }}>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{d}</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 20, marginTop: 2 }}>{n}</div>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', color: 'var(--ink-mute)', marginBottom: 12 }}>AVAILABLE TIMES</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {slots.map((t, i) => {
            const on = i === 2;
            return (
              <div key={t} style={{ padding: '13px 0', textAlign: 'center', borderRadius: 13, fontSize: 15, fontWeight: 600, cursor: 'pointer', background: on ? 'color-mix(in oklab, var(--clay) 12%, var(--paper))' : 'var(--paper)', color: on ? 'var(--clay)' : 'var(--ink)', border: on ? '1.5px solid var(--clay)' : '1px solid var(--line)' }}>
                {t} {i < 4 ? 'AM' : 'PM'}
              </div>
            );
          })}
        </div>
      </div>
    </DrillScreen>
  );
}
