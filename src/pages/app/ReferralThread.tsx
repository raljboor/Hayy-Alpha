import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I, Avatar, Btn, Card, Meta, RoundBtn } from '@/shared/primitives';

const messages = [
  { from: 'Adam Saleh', tone: 'clay' as const, text: "Hi Maya, I'd love to be referred for the PM role at AWS. I've been in growth for 2 years and I'm making the move to product.", time: '2d ago', self: true },
  { from: 'Maya Nasrallah', tone: 'clay' as const, text: "Love the background Adam! Growth → PM is a natural path. I'll need your resume and a short note on why AWS specifically.", time: '1d ago', self: false },
  { from: 'Adam Saleh', tone: 'clay' as const, text: 'Attaching my resume. For AWS — I love that you build tools used by millions. The PM role on the developer platform team is exactly what I want to work on.', time: '20h ago', self: true },
  { from: 'Maya Nasrallah', tone: 'clay' as const, text: "Perfect. I've submitted your referral. You should hear back within 2 weeks. Good luck! 🎉", time: '18h ago', self: false },
];

export default function ReferralThread() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');

  return (
    <div style={{ padding: '32px 44px', maxWidth: 680 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <RoundBtn icon={React.cloneElement(I.chevL as React.ReactElement<{size?:number}>, { size: 18 })} onClick={() => navigate(-1)} />
        <div>
          <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.14em', textTransform: 'uppercase' }}>Referral thread</p>
          <h2 style={{ fontSize: 20, marginTop: 2 }}>PM · AWS via Maya Nasrallah</h2>
        </div>
      </div>

      <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'color-mix(in oklab, var(--clay) 8%, var(--paper))', border: '1px solid color-mix(in oklab, var(--clay) 18%, var(--line))', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--clay)', color: 'var(--paper)', fontSize: 12, fontWeight: 700 }}>Final round</span>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>You've made it to final round interviews 🎉</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, flexDirection: m.self ? 'row-reverse' : 'row' }}>
            <Avatar name={m.from} size={36} tone={m.tone} />
            <div style={{ maxWidth: '70%' }}>
              <div style={{
                padding: '12px 16px', borderRadius: m.self ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                background: m.self ? 'var(--clay)' : 'var(--paper)',
                color: m.self ? 'var(--paper)' : 'var(--ink)',
                border: m.self ? 'none' : '1px solid var(--line)',
              }}>
                <p style={{ fontSize: 14, lineHeight: 1.5 }}>{m.text}</p>
              </div>
              <Meta style={{ display: 'block', marginTop: 4, textAlign: m.self ? 'right' : 'left' }}>{m.time}</Meta>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <textarea
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Send a message…"
          rows={2}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: 12, fontSize: 14, resize: 'none',
            border: '1px solid var(--line)', background: 'var(--paper)', color: 'var(--ink)', outline: 'none', fontFamily: 'var(--body)',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--clay)'}
          onBlur={e => e.target.style.borderColor = 'var(--line)'}
        />
        <Btn kind="primary" iconRight={React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 16 })}>Send</Btn>
      </div>
    </div>
  );
}
