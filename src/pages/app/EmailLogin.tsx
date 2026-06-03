import { cloneElement } from 'react';
import { RoundBtn, Wash, SAFE_TOP, Chevron } from '@/components/hayy/AppShell';
import { I, Btn, HayyMark } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

export default function EmailLogin() {
  const nav = useNav();
  return (
    <div className="hy" style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', background: 'var(--bg)', fontFamily: 'var(--sans)',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(140% 70% at 50% -10%, color-mix(in oklab, var(--clay) 12%, var(--bg)) 0%, var(--bg) 50%)' }} />
      <div style={{ position: 'relative', zIndex: 2, paddingTop: SAFE_TOP - 8, padding: `${SAFE_TOP - 8}px 16px 0` }}>
        <RoundBtn icon={<Chevron />} onClick={() => nav.back()} />
      </div>
      <div style={{ position: 'relative', zIndex: 2, flex: 1, minHeight: 0, overflowY: 'auto', padding: '26px 28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: 18, background: 'var(--paper)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 26, boxShadow: '0 14px 40px -16px rgba(80,40,20,.3)' }}>
          <HayyMark size={0.46} />
        </div>
        <h1 style={{ fontSize: 28, textAlign: 'center', lineHeight: 1.1, marginBottom: 10 }}>What's your email?</h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', textAlign: 'center', marginBottom: 30, maxWidth: 280 }}>
          We'll send a 6-digit code. No passwords to remember.
        </p>
        <div style={{ width: '100%', padding: '16px 18px', borderRadius: 14, background: 'var(--paper)', border: '1.5px solid var(--clay)', fontSize: 17, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--ink)' }}>adam@</span>
          <span style={{ width: 2, height: 22, background: 'var(--clay)', display: 'inline-block' }} />
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 16, textAlign: 'center' }}>By continuing you agree to our Terms & Privacy.</p>
      </div>
      <div style={{ position: 'relative', zIndex: 2, flex: 'none', padding: '16px 28px 34px' }}>
        <Btn kind="primary" size="xl" iconRight={I.arrow} onClick={() => nav.go('verify')} style={{ width: '100%', justifyContent: 'center' }}>Continue</Btn>
      </div>
    </div>
  );
}
