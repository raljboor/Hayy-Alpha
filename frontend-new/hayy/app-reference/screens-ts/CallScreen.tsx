import { cloneElement } from 'react';
import { SAFE_TOP } from '@/components/hayy/AppShell';
import { I, Icon, Avatar } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

export default function CallScreen() {
  const nav = useNav();
  return (
    <div className="hy" data-palette="dusk" style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', background: 'var(--bg)', fontFamily: 'var(--sans)',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(80% 50% at 50% 30%, color-mix(in oklab, var(--clay) 16%, var(--bg)) 0%, var(--bg) 75%)' }} />

      {/* self PiP */}
      <div style={{ position: 'absolute', top: SAFE_TOP, right: 18, width: 92, height: 124, borderRadius: 18, overflow: 'hidden', border: '1px solid var(--line)', zIndex: 3, background: 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Avatar name="Adam Saleh" size={48} tone="clay" />
      </div>

      <div style={{ position: 'relative', zIndex: 2, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 }}>
        <Avatar name="Maya Nasrallah" size={120} tone="clay" />
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 26 }}>Maya Nasrallah</h1>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 4 }}>Sr PM · AWS</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 12, padding: '5px 12px', borderRadius: 999, background: 'color-mix(in oklab, var(--clay) 14%, transparent)' }}>
            <span className="hy-livedot" style={{ background: '#3fb98a' }} />
            <span className="mono" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>04:18</span>
          </div>
        </div>
      </div>

      {/* call controls */}
      <div style={{ position: 'relative', zIndex: 2, flex: 'none', padding: '16px 28px 38px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* mic */}
        <button style={{ width: 50, height: 50, borderRadius: 999, background: 'color-mix(in oklab, var(--paper) 70%, transparent)', border: '1px solid var(--line)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {cloneElement(I.mic as React.ReactElement, { size: 22 })}
        </button>
        {/* users */}
        <button style={{ width: 50, height: 50, borderRadius: 999, background: 'color-mix(in oklab, var(--paper) 70%, transparent)', border: '1px solid var(--line)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {cloneElement(I.users as React.ReactElement, { size: 22 })}
        </button>
        {/* hang up */}
        <button onClick={() => nav.back()} style={{ width: 64, height: 64, borderRadius: 999, background: '#d6452f', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(135deg)', cursor: 'pointer' }}>
          <Icon d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z" size={26} />
        </button>
        {/* spark */}
        <button style={{ width: 50, height: 50, borderRadius: 999, background: 'color-mix(in oklab, var(--paper) 70%, transparent)', border: '1px solid var(--line)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {cloneElement(I.spark as React.ReactElement, { size: 22 })}
        </button>
        {/* more */}
        <button style={{ width: 50, height: 50, borderRadius: 999, background: 'color-mix(in oklab, var(--paper) 70%, transparent)', border: '1px solid var(--line)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {cloneElement(I.more as React.ReactElement, { size: 22 })}
        </button>
      </div>
    </div>
  );
}
