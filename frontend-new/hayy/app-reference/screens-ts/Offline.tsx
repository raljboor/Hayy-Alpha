import { Wash } from '@/components/hayy/AppShell';
import { I, Btn } from '@/components/hayy/HayyPrimitives';
import { cloneElement } from 'react';
import { useNav } from '@/hooks/useNav';

export default function Offline() {
  const nav = useNav();
  return (
    <div className="hy" style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', background: 'var(--bg)', fontFamily: 'var(--sans)', padding: '0 40px', boxSizing: 'border-box',
    }}>
      <Wash />
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--cream)', border: '1px solid var(--line)', color: 'var(--ink-mute)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          {cloneElement(I.wifiOff as React.ReactElement, { size: 32 })}
        </div>
        <h1 style={{ fontSize: 26, marginBottom: 10 }}>You're offline</h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 26, maxWidth: 260 }}>
          The rooms need a connection. Check your network and we'll pick up right where you left off.
        </p>
        <Btn kind="primary" size="lg" onClick={() => nav.go('home')}>Try again</Btn>
      </div>
    </div>
  );
}
