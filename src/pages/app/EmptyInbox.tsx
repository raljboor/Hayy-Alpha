import { cloneElement } from 'react';
import { AppScreen, ScreenHead, RoundBtn } from '@/components/hayy/AppShell';
import { I, Btn } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

export default function EmptyInbox() {
  const nav = useNav();
  return (
    <AppScreen tab="inbox">
      <ScreenHead eyebrow="WARM INTROS" title="Inbox" trailing={<RoundBtn icon={cloneElement(I.search as React.ReactElement, { size: 18 })} onClick={() => nav.go('search')} />} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 70, paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ width: 84, height: 84, borderRadius: 26, background: 'var(--cream)', border: '1px solid var(--line)', color: 'var(--clay)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          {cloneElement(I.msg as React.ReactElement, { size: 34 })}
        </div>
        <h2 style={{ fontSize: 23, marginBottom: 10 }}>No intros yet</h2>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 26, maxWidth: 260 }}>
          Conversations start in the rooms. Drop into one tonight — the warm intros follow.
        </p>
        <Btn kind="primary" size="lg" iconRight={I.arrow} onClick={() => nav.go('rooms')}>Find a room</Btn>
      </div>
    </AppScreen>
  );
}
