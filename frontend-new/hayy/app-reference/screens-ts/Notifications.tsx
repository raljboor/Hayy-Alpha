import { cloneElement } from 'react';
import { AppScreen, ScreenHead, TabBar } from '@/components/hayy/AppShell';
import { I, Avatar, Btn } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const ACTIVITIES = [
  { who: 'Maya Nasrallah', act: 'invited you to speak in', obj: 'Room 04', t: '2m', tone: 'clay', icon: I.mic, accent: true },
  { who: 'Layla Park', act: 'wants to connect you with a recruiter', obj: '', t: '1h', tone: 'olive', icon: I.shake, accent: true },
  { who: 'Jenna Sun', act: 'reacted to your question', obj: '', t: '3h', tone: 'dark', icon: I.heart },
  { who: 'Omar Aziz', act: 'started following you', obj: '', t: '5h', tone: 'sand', icon: I.users },
  { who: 'Rashid Khoury', act: 'is hosting', obj: 'New grad → first eng role', t: 'Yesterday', tone: 'clay', icon: I.mic },
] as const;

export default function Notifications() {
  const nav = useNav();

  return (
    <AppScreen tab="activity">
      <ScreenHead eyebrow="ACTIVITY" title="Recent" />

      {/* Section header */}
      <div
        style={{
          padding: '0 20px 8px',
          fontFamily: 'var(--sans)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: 'var(--ink-mute)',
          textTransform: 'uppercase' as const,
        }}
      >
        TODAY
      </div>

      {/* Activity items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 20px 100px' }}>
        {ACTIVITIES.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 14,
              background: (item as any).accent
                ? 'color-mix(in srgb, var(--clay) 8%, var(--paper))'
                : 'var(--paper)',
              border: (item as any).accent
                ? '1.5px solid color-mix(in srgb, var(--clay) 20%, transparent)'
                : '1.5px solid var(--line-soft)',
            }}
          >
            {/* Avatar with icon badge */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Avatar name={item.who} tone={item.tone as any} size={44} />
              <span
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: (item as any).accent ? 'var(--clay)' : 'var(--ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--paper)',
                  color: 'var(--paper)',
                }}
              >
                {cloneElement(item.icon as React.ReactElement, { size: 10 })}
              </span>
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 13,
                  color: 'var(--ink)',
                  lineHeight: 1.4,
                }}
              >
                <span style={{ fontWeight: 700 }}>{item.who}</span>
                {' '}
                <span style={{ fontWeight: 400 }}>{item.act}</span>
                {item.obj && (
                  <>
                    {' '}
                    <span style={{ fontWeight: 600 }}>{item.obj}</span>
                  </>
                )}
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  color: 'var(--ink-mute)',
                  marginTop: 2,
                }}
              >
                {item.t}
              </div>
            </div>

            {/* CTA for accent rows */}
            {(item as any).accent && (
              <div style={{ flexShrink: 0 }}>
                {idx === 0 ? (
                  <Btn kind="primary" label="Accept" onPress={() => nav.go('liveRoom')} />
                ) : (
                  <Btn kind="primary" label="View" onPress={() => nav.go('referrals')} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <TabBar tab="activity" />
    </AppScreen>
  );
}
