import { cloneElement } from 'react';
import { DrillScreen } from '@/components/hayy/AppShell';
import { I, Btn } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

export default function EmptySchedule() {
  const nav = useNav();
  return (
    <DrillScreen title="Your schedule" eyebrow="">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 70, paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ width: 84, height: 84, borderRadius: 26, background: 'var(--cream)', border: '1px solid var(--line)', color: 'var(--clay)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          {cloneElement(I.cal as React.ReactElement, { size: 34 })}
        </div>
        <h2 style={{ fontSize: 23, marginBottom: 10 }}>Nothing booked yet</h2>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 26, maxWidth: 260 }}>
          Reserve a room or book a 1:1 and it'll show up here, ready when you are.
        </p>
        <Btn kind="primary" size="lg" iconRight={I.arrow} onClick={() => nav.go('rooms')}>Browse rooms</Btn>
      </div>
    </DrillScreen>
  );
}
