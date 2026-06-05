import React from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, Card, Meta } from '@/shared/primitives';
import { ME } from '@/shared/data';

const sections = [
  {
    title: 'Account',
    items: [
      { label: 'Edit profile', icon: I.users, path: '/app/settings/profile' },
      { label: 'Notifications', icon: I.bell, path: '/app/settings/notifications' },
      { label: 'Privacy', icon: I.lock, path: '/app/settings/privacy' },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Invite friends', icon: I.shake, path: '/app/settings/invite' },
      { label: 'Help & support', icon: I.msg, path: '/app/settings/help' },
    ],
  },
];

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px 44px', maxWidth: 640 }}>
      <h1 style={{ fontSize: 40, marginBottom: 28 }}>Settings</h1>

      {/* Profile summary */}
      <Card style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={ME.name} size={52} tone={ME.avatarTone} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 16, fontWeight: 600 }}>{ME.name}</p>
            <p style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{ME.email}</p>
          </div>
          <button onClick={() => navigate('/app/profile')} style={{ fontSize: 13, color: 'var(--clay)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
            Edit profile
          </button>
        </div>
      </Card>

      {sections.map(sec => (
        <div key={sec.title} style={{ marginBottom: 24 }}>
          <p className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10, paddingLeft: 4 }}>{sec.title}</p>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--paper)' }}>
            {sec.items.map((item, i) => (
              <div
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', cursor: 'pointer',
                  borderBottom: i < sec.items.length - 1 ? '1px solid var(--line-soft)' : 'none',
                  transition: 'background .1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--cream)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ color: 'var(--ink-mute)' }}>
                  {React.cloneElement(item.icon as React.ReactElement<{size?:number}>, { size: 18 })}
                </span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                {React.cloneElement(I.chevR as React.ReactElement<{size?:number;stroke?:number}>, { size: 16, stroke: 1.5 })}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 32 }}>
        <button style={{ fontSize: 14, color: '#c94040', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
