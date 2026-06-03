import { cloneElement } from 'react';
import { DrillScreen } from '@/components/hayy/AppShell';
import { I, Avatar, Toggle } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

type SettingRow = {
  label: string;
  note?: string;
  route?: string;
};

const ACCOUNT: SettingRow[] = [
  { label: 'Edit profile', route: 'editProfile' },
  { label: 'Notifications', note: 'On', route: 'notifs' },
  { label: 'Privacy', route: 'privacy' },
];

const PREFERENCES: SettingRow[] = [
  { label: 'Audio & video' },
  { label: 'Interests', note: '6' },
  { label: 'Referral settings' },
];

const SUPPORT: SettingRow[] = [
  { label: 'Help & feedback', route: 'help' },
  { label: 'Invite friends', route: 'invite' },
];

export default function Settings() {
  const nav = useNav();

  return (
    <DrillScreen title="Settings" eyebrow="">
      {/* Identity card */}
      <div style={{ padding: '0 20px 20px' }}>
        <button
          onClick={() => nav.go('editProfile')}
          style={{
            width: '100%',
            background: 'var(--paper)',
            border: '1.5px solid var(--line-soft)',
            borderRadius: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 16px',
            textAlign: 'left',
          }}
        >
          <Avatar name="Adam Saleh" size={52} tone="clay" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--ink)',
              }}
            >
              Adam Saleh
            </div>
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 13,
                color: 'var(--ink-mute)',
                marginTop: 2,
              }}
            >
              adam@hayy.app
            </div>
          </div>
          <span style={{ color: 'var(--ink-mute)', display: 'flex', alignItems: 'center' }}>
            {cloneElement(I.arrow as React.ReactElement, { size: 16 })}
          </span>
        </button>
      </div>

      {/* Room reminders toggle card */}
      <div style={{ padding: '0 20px 20px' }}>
        <div
          style={{
            background: 'var(--paper)',
            border: '1.5px solid var(--line-soft)',
            borderRadius: 16,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'var(--clay)',
            }}
          >
            {cloneElement(I.bell as React.ReactElement, { size: 18 })}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--ink)',
              }}
            >
              Room reminders
            </div>
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 12,
                color: 'var(--ink-mute)',
                marginTop: 2,
              }}
            >
              15 min before start
            </div>
          </div>
          <Toggle on={true} onChange={() => {}} />
        </div>
      </div>

      {/* Setting groups */}
      {[
        { title: 'ACCOUNT', rows: ACCOUNT },
        { title: 'PREFERENCES', rows: PREFERENCES },
        { title: 'SUPPORT', rows: SUPPORT },
      ].map((group) => (
        <div key={group.title} style={{ padding: '0 20px 20px' }}>
          <div
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--ink-mute)',
              textTransform: 'uppercase' as const,
              marginBottom: 8,
              paddingLeft: 4,
            }}
          >
            {group.title}
          </div>
          <div
            style={{
              background: 'var(--paper)',
              border: '1.5px solid var(--line-soft)',
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            {group.rows.map((row, i) => (
              <button
                key={row.label}
                onClick={() => row.route && nav.go(row.route as any)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: i < group.rows.length - 1 ? '1px solid var(--line-soft)' : 'none',
                  cursor: row.route ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    flex: 1,
                    fontFamily: 'var(--sans)',
                    fontSize: 14,
                    fontWeight: 400,
                    color: 'var(--ink)',
                  }}
                >
                  {row.label}
                </span>
                {row.note && (
                  <span
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 13,
                      color: 'var(--ink-mute)',
                    }}
                  >
                    {row.note}
                  </span>
                )}
                {row.route && (
                  <span style={{ color: 'var(--ink-mute)', display: 'flex', alignItems: 'center' }}>
                    {cloneElement(I.arrow as React.ReactElement, { size: 16 })}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Sign out */}
      <div style={{ padding: '0 20px 8px', display: 'flex', justifyContent: 'center' }}>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--clay)',
            padding: '10px 0',
          }}
        >
          Sign out
        </button>
      </div>

      {/* Version */}
      <div
        style={{
          padding: '4px 20px 60px',
          textAlign: 'center',
          fontFamily: 'var(--sans)',
          fontSize: 12,
          color: 'var(--ink-mute)',
        }}
      >
        Hayy v2.4.0
      </div>
    </DrillScreen>
  );
}
