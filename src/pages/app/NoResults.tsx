import { cloneElement } from 'react';
import { AppScreen, RoundBtn, Chevron } from '@/components/hayy/AppShell';
import { I, Btn } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

export default function NoResults() {
  const nav = useNav();
  return (
    <AppScreen tab="rooms">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26, paddingTop: 4 }}>
        <RoundBtn icon={<Chevron />} onClick={() => nav.back()} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px', borderRadius: 14, background: 'var(--paper)', border: '1px solid var(--line)' }}>
          {cloneElement(I.search as React.ReactElement, { size: 17 })}
          <span style={{ fontSize: 15, color: 'var(--ink)' }}>staff engineer fintech</span>
          <span style={{ marginLeft: 'auto', color: 'var(--ink-mute)' }}>{cloneElement(I.closed as React.ReactElement, { size: 15 })}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 50, paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ width: 84, height: 84, borderRadius: 26, background: 'var(--cream)', border: '1px solid var(--line)', color: 'var(--ink-mute)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          {cloneElement(I.search as React.ReactElement, { size: 32 })}
        </div>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>No rooms match that yet</h2>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 24, maxWidth: 270 }}>
          Try a broader topic, or set an alert and we'll ping you when one opens.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
          {['Engineering', 'Fintech', 'Senior roles'].map((t) => (
            <span key={t} className="hy-pill" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 13, padding: '8px 14px' }}>{t}</span>
          ))}
        </div>
        <Btn kind="primary" size="lg" icon={I.bell} onClick={() => nav.go('rooms')}>Alert me for new rooms</Btn>
      </div>
    </AppScreen>
  );
}
