import { cloneElement } from 'react';
import { Wash, SAFE_TOP } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Card, Meta } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

export default function ScheduleDone() {
  const nav = useNav();
  return (
    <div className="hy" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--bg)', fontFamily: 'var(--sans)' }}>
      <Wash />
      <div style={{ position: 'relative', zIndex: 2, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 34px' }}>
        <div style={{ width: 84, height: 84, borderRadius: 999, background: 'var(--clay)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 26, boxShadow: '0 16px 40px -12px color-mix(in oklab, var(--clay) 70%, transparent)' }}>
          {cloneElement(I.check as React.ReactElement, { size: 38 })}
        </div>
        <h1 style={{ fontSize: 30, lineHeight: 1.05, marginBottom: 12 }}>
          Your room is <span className="display-italic">on the calendar.</span>
        </h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 28, maxWidth: 300 }}>
          We'll remind your followers 15 minutes before it starts. Share it to fill more seats.
        </p>
        <Card style={{ width: '100%', textAlign: 'left', marginBottom: 8 }}>
          <Meta>TONIGHT · 7:00 PM</Meta>
          <p style={{ fontSize: 17, fontWeight: 600, marginTop: 6 }}>Breaking into Product at Big Tech</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <Avatar name="Adam Saleh" size={26} tone="clay" />
            <Meta>You're hosting · 2 co-hosts</Meta>
          </div>
        </Card>
      </div>
      <div style={{ position: 'relative', zIndex: 2, flex: 'none', padding: '16px 22px 34px', display: 'flex', gap: 10 }}>
        <Btn kind="soft" size="lg" icon={I.link} style={{ flex: 'none' }}>Share</Btn>
        <Btn kind="primary" size="lg" style={{ flex: 1, justifyContent: 'center' }} onClick={() => nav.go('home')}>Done</Btn>
      </div>
    </div>
  );
}
