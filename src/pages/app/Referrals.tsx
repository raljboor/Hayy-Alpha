import React from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, Btn, Card, Meta, Pill } from '@/shared/primitives';

const referrals = [
  {
    id: 'ref1', type: 'sent', to: 'Hana Yusuf', toRole: 'Group PM · Shopify', toTone: 'clay' as const,
    role: 'Product Manager · Shopify', stage: 'Final round', stageColor: '#d4724a',
    via: 'Maya Nasrallah', viaTone: 'clay' as const,
  },
  {
    id: 'ref2', type: 'sent', to: 'Hana Yusuf', toRole: 'Group PM · Shopify', toTone: 'clay' as const,
    role: 'APM · Figma', stage: 'Interviewing', stageColor: '#6b7a4a',
    via: 'Layla Park', viaTone: 'sand' as const,
  },
  {
    id: 'ref3', type: 'received', to: 'Diego Rivas', toRole: 'PM · Notion', toTone: 'dark' as const,
    role: 'Product Manager', stage: 'Requested', stageColor: 'var(--ink-mute)',
    via: 'Adam Saleh', viaTone: 'clay' as const,
  },
];

export default function Referrals() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px 44px', maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase' }}>4 new</p>
          <h1 style={{ fontSize: 40, marginTop: 6 }}>Referrals</h1>
        </div>
        <Btn kind="primary" icon={React.cloneElement(I.plus as React.ReactElement<{size?:number}>, { size: 16 })}>Request referral</Btn>
      </div>

      {/* Pursuits */}
      <p className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Your pursuits</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {referrals.filter(r => r.type === 'sent').map(r => (
          <Card key={r.id} onClick={() => navigate(`/app/referrals/${r.id}`)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={r.to} size={40} tone={r.toTone} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{r.to}</p>
                  <p style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{r.toRole}</p>
                </div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: 999, background: 'color-mix(in oklab, var(--clay) 12%, var(--paper))', color: r.stageColor, fontSize: 12, fontWeight: 700 }}>
                {r.stage}
              </span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 8 }}>
              {r.role}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Meta>Via</Meta>
              <Avatar name={r.via} size={20} tone={r.viaTone} />
              <Meta>{r.via}</Meta>
            </div>
          </Card>
        ))}
      </div>

      {/* Received requests */}
      <p className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Requests for you</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {referrals.filter(r => r.type === 'received').map(r => (
          <Card key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar name={r.to} size={44} tone={r.toTone} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{r.to}</p>
              <p style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{r.toRole}</p>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>Requesting referral for: {r.role}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn kind="primary">Refer</Btn>
              <Btn kind="ghost">Pass</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
