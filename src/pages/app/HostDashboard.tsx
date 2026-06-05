import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, Btn, Card, Meta } from '@/shared/primitives';
import { ME } from '@/shared/data';

export default function HostDashboard() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'now' | 'schedule'>('now');

  return (
    <div style={{ padding: '32px 44px', maxWidth: 640 }}>
      <div style={{ marginBottom: 32 }}>
        <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Start</p>
        <h1 style={{ fontSize: 40, marginTop: 6 }}>Create a room</h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginTop: 8 }}>
          Careers grow in conversation. Start one.
        </p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {(['now', 'schedule'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 600,
            border: mode === m ? 'none' : '1px solid var(--line)',
            background: mode === m ? 'var(--clay)' : 'var(--paper)',
            color: mode === m ? 'var(--paper)' : 'var(--ink-soft)', cursor: 'pointer',
          }}>
            {m === 'now' ? '⚡ Start now' : '📅 Schedule'}
          </button>
        ))}
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--ink-soft)' }}>Room title</label>
          <input
            placeholder="e.g. Breaking into Product at Big Tech"
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14,
              border: '1px solid var(--line)', background: 'var(--paper)', color: 'var(--ink)', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--clay)'}
            onBlur={e => e.target.style.borderColor = 'var(--line)'}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--ink-soft)' }}>Topic</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Product', 'Engineering', 'Design', 'Data', 'Hiring', 'Careers'].map(t => (
              <button key={t} style={{
                padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                border: '1px solid var(--line)', background: 'var(--paper)',
                color: 'var(--ink-soft)', cursor: 'pointer',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {mode === 'schedule' && (
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--ink-soft)' }}>Date & time</label>
            <input type="datetime-local" style={{
              width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14,
              border: '1px solid var(--line)', background: 'var(--paper)', color: 'var(--ink)', outline: 'none',
            }} />
          </div>
        )}

        <Btn kind="primary" size="lg" style={{ marginTop: 8, justifyContent: 'center' }}
          icon={React.cloneElement(I.mic as React.ReactElement<{size?:number}>, { size: 18 })}>
          {mode === 'now' ? 'Go live' : 'Schedule room'}
        </Btn>
      </div>

      {/* Your rooms */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Your upcoming rooms</h3>
        <Card style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={ME.name} size={44} tone={ME.avatarTone} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Growth → Product, figuring it out together</p>
            <Meta>Tue Jun 9 · You're hosting</Meta>
          </div>
          <button style={{ fontSize: 13, color: 'var(--clay)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
        </Card>
      </div>
    </div>
  );
}
