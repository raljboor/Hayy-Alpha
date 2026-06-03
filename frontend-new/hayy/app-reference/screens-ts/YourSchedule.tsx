import { DrillScreen } from '@/components/hayy/AppShell';
import { Avatar, Card, Meta } from '@/components/hayy/HayyPrimitives';

const schedule = [
  { group: 'TODAY', items: [
    { t: 'Breaking into Product at Big Tech', host: 'Maya Nasrallah', time: '7:00 PM', role: 'Reserved', tone: 'clay', soon: true },
  ] },
  { group: 'TOMORROW', items: [
    { t: '1:1 with Maya Nasrallah', host: '20 min call', time: '10:00 AM', role: 'Booked', tone: 'clay' },
    { t: 'Design portfolios that get callbacks', host: 'Layla Park', time: '8:30 PM', role: 'Reserved', tone: 'olive' },
  ] },
  { group: 'THIS WEEK', items: [
    { t: 'New grad → first eng role', host: 'Rashid Khoury', time: 'Thu', role: 'Hosting', tone: 'dark' },
  ] },
];

export default function YourSchedule() {
  return (
    <DrillScreen title="Your schedule" eyebrow="">
      <div style={{ paddingTop: 8, paddingBottom: 16 }}>
        {schedule.map((sec) => (
          <div key={sec.group} style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', color: 'var(--ink-mute)', marginBottom: 11, paddingLeft: 2 }}>{sec.group}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sec.items.map((it, i) => (
                <Card key={i} style={{ display: 'flex', gap: 13, alignItems: 'center', borderColor: it.soon ? 'color-mix(in oklab, var(--clay) 28%, var(--line))' : 'var(--line)' }}>
                  <div style={{ textAlign: 'center', flex: 'none', width: 54 }}>
                    <div style={{ fontFamily: 'var(--display)', fontSize: 16, lineHeight: 1.1, color: it.soon ? 'var(--clay)' : 'var(--ink)' }}>{it.time}</div>
                  </div>
                  <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--line-soft)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.2 }}>{it.t}</p>
                    <Meta>{it.host}</Meta>
                  </div>
                  <span style={{ flex: 'none', fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 999, background: it.role === 'Hosting' ? 'var(--clay)' : 'var(--cream)', color: it.role === 'Hosting' ? 'var(--paper)' : 'var(--ink-soft)', border: it.role === 'Hosting' ? 'none' : '1px solid var(--line)' }}>{it.role}</span>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DrillScreen>
  );
}
