import { cloneElement } from 'react';
import { SAFE_TOP, RoundBtn, Chevron } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Meta, Stack } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

export default function GreenRoom() {
  const nav = useNav();
  return (
    <div className="hy" data-palette="dusk" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--bg)', fontFamily: 'var(--sans)' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(90% 50% at 50% 18%, color-mix(in oklab, var(--clay) 18%, var(--bg)) 0%, var(--bg) 70%)' }} />

      <div style={{ position: 'relative', zIndex: 2, paddingTop: SAFE_TOP - 8, padding: `${SAFE_TOP - 8}px 16px 0` }}>
        <RoundBtn icon={<Chevron />} onClick={() => nav.back()} />
      </div>

      <div style={{ position: 'relative', zIndex: 2, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 30px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <span className="hy-livedot" /><Meta>STARTING IN 02:14</Meta>
        </div>
        <h1 style={{ fontSize: 28, lineHeight: 1.1, marginBottom: 14 }}>Breaking into Product at Big&nbsp;Tech</h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 30, maxWidth: 300 }}>
          Maya opens the room shortly. Set yourself up before you walk in.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 26 }}>
          <Avatar name="Maya Nasrallah" size={72} tone="clay" />
          <div>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Maya Nasrallah · hosting</p>
            <Meta>Sr PM · AWS</Meta>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Stack names={['A B', 'C D', 'E F', 'G H']} n={42} />
          <Meta>41 others waiting</Meta>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, flex: 'none', padding: '16px 22px 34px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 16, background: 'var(--paper)', border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {cloneElement(I.micOff as React.ReactElement, { size: 18 })}
            <span style={{ fontSize: 14, fontWeight: 500 }}>Join muted</span>
          </div>
          <span style={{ width: 42, height: 24, borderRadius: 999, background: 'var(--clay)', position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, borderRadius: 999, background: '#fff' }} />
          </span>
        </div>
        <Btn kind="primary" size="xl" iconRight={I.arrow} onClick={() => nav.go('liveRoom')} style={{ justifyContent: 'center' }}>Enter room</Btn>
      </div>
    </div>
  );
}
