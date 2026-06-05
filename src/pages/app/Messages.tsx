import React, { useState } from 'react';
import { I, Avatar, Meta, Card } from '@/shared/primitives';
import { PEOPLE } from '@/shared/data';

const threads = [
  { from: 'Maya Nasrallah', tone: 'clay' as const, role: 'Sr PM · AWS', preview: 'Happy to connect — drop me a time that works.', time: '2h', unread: true },
  { from: 'Rashid Khoury', tone: 'dark' as const, role: 'Eng Mgr · Amazon', preview: "Let me know when you're ready to practice.", time: '1d', unread: false },
  { from: 'Hana Yusuf', tone: 'clay' as const, role: 'Group PM · Shopify', preview: 'Got your referral request — looks great!', time: '2d', unread: true },
  { from: 'Jenna Sun', tone: 'olive' as const, role: 'Talent · Shopify', preview: 'We should jump on a quick call.', time: '3d', unread: false },
];

export default function Messages() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div style={{ padding: '32px 44px', maxWidth: 720 }}>
      <div style={{ marginBottom: 28 }}>
        <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase' }}>2 unread</p>
        <h1 style={{ fontSize: 40, marginTop: 6 }}>Inbox</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {threads.map((t, i) => (
          <div
            key={i}
            onClick={() => setSelected(i)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 16, cursor: 'pointer',
              background: selected === i ? 'var(--cream)' : t.unread ? 'color-mix(in oklab, var(--clay) 5%, var(--paper))' : 'transparent',
              border: selected === i ? '1px solid var(--line)' : '1px solid transparent',
            }}
          >
            <div style={{ position: 'relative', flex: 'none' }}>
              <Avatar name={t.from} size={44} tone={t.tone} />
              {t.unread && <span style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRadius: 999, background: 'var(--clay)', border: '2px solid var(--bg)' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 2 }}>
                <p style={{ fontSize: 15, fontWeight: t.unread ? 700 : 500 }}>{t.from}</p>
                <Meta>{t.time}</Meta>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.preview}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state hint */}
      {threads.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontFamily: 'var(--display)', fontSize: 24, marginBottom: 12 }}>No messages yet</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Join a room to start conversations.</p>
        </div>
      )}
    </div>
  );
}
