import React from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, Card, Meta } from '@/shared/primitives';

const notifs = [
  { icon: 'shake', from: 'Maya Nasrallah', tone: 'clay' as const, text: 'accepted your referral request', detail: 'PM · AWS', time: '2h', action: 'View referral' },
  { icon: 'bell',  from: 'Hayy',           tone: 'clay' as const, text: '"Breaking into Product at Big Tech" starts in 30 min', time: '30m', action: 'Join room' },
  { icon: 'users', from: 'Hana Yusuf',     tone: 'clay' as const, text: 'started following you', time: '1d', action: null },
  { icon: 'heart', from: 'Omar Aziz',      tone: 'olive' as const, text: 'landed a PM role at RBC 🎉', time: '2d', action: 'See journey' },
  { icon: 'msg',   from: 'Jenna Sun',      tone: 'olive' as const, text: 'sent you a message', time: '3d', action: 'Reply' },
];

export default function Notifications() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px 44px', maxWidth: 720 }}>
      <h1 style={{ fontSize: 40, marginBottom: 28 }}>Activity</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {notifs.map((n, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0',
            borderBottom: i < notifs.length - 1 ? '1px solid var(--line-soft)' : 'none',
          }}>
            <Avatar name={n.from} size={44} tone={n.tone} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, lineHeight: 1.45 }}>
                <strong>{n.from}</strong> {n.text}
                {n.detail && <span style={{ color: 'var(--ink-mute)' }}> · {n.detail}</span>}
              </p>
              <Meta style={{ display: 'block', marginTop: 4 }}>{n.time} ago</Meta>
              {n.action && (
                <button style={{ marginTop: 8, fontSize: 13, color: 'var(--clay)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {n.action} →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
