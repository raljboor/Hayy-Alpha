import { cloneElement } from 'react';
import { DrillScreen } from '@/components/hayy/AppShell';
import { I, Avatar, Card, Meta } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const rooms = [
  { t: 'Referrals, honestly: what works', host: 'Priya Shah', co: 'Stripe', when: 'Thu 6PM', tone: 'clay' },
  { t: 'From bootcamp to backend', host: 'Omar Aziz', co: 'RBC', when: 'Sat 11AM', tone: 'sand' },
  { t: 'Negotiating your first offer', host: 'Jenna Sun', co: 'Shopify', when: 'Next wk', tone: 'olive' },
];

export default function SavedRoomsScreen() {
  return (
    <DrillScreen title="Saved rooms" eyebrow="">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 32 }}>
        {rooms.map((r) => (
          <Card key={r.t}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Avatar name={r.host} size={44} tone={r.tone} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.35, marginBottom: 4 }}>{r.t}</p>
                <Meta>{r.host} · {r.co}</Meta>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 'none', color: 'var(--clay)' }}>
                {cloneElement(I.spark as React.ReactElement, { size: 14 })}
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--clay)' }}>{r.when}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DrillScreen>
  );
}
