import { cloneElement } from 'react';
import { AppScreen, ScreenHead, TabBar } from '@/components/hayy/AppShell';
import { I, Avatar, HayyMark } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const THREADS = [
  { n: 'Maya Nasrallah', co: 'AWS', msg: "Loved your question tonight — let's talk referral.", t: '2m', unread: 2, tone: 'clay', on: true },
  { n: 'Layla Park', co: 'Figma', msg: 'Sending your portfolio to our recruiter 🤝', t: '1h', unread: 0, tone: 'olive' },
  { n: 'Hayy', co: 'Team', msg: 'Your seat for Room 04 is confirmed.', t: '3h', unread: 0, tone: 'dark', system: true },
  { n: 'Omar Aziz', co: 'RBC', msg: 'Happy to do a warm intro to the hiring mgr.', t: 'Yesterday', unread: 0, tone: 'sand' },
  { n: 'Priya Shah', co: 'Stripe', msg: 'You: Thank you — that means a lot.', t: 'Mon', unread: 0, tone: 'clay' },
] as const;

export default function Messages() {
  const nav = useNav();

  return (
    <AppScreen tab="inbox">
      <ScreenHead eyebrow="WARM INTROS" title="Inbox" />

      {/* Referrals banner */}
      <div style={{ padding: '0 20px 16px' }}>
        <button
          onClick={() => nav.go('referrals')}
          style={{
            width: '100%',
            background: 'var(--clay)',
            border: 'none',
            borderRadius: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 16px',
            textAlign: 'left',
          }}
        >
          <span style={{ color: 'var(--paper)', display: 'flex', alignItems: 'center' }}>
            {cloneElement(I.shake as React.ReactElement, { size: 22 })}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 14, color: 'var(--paper)' }}>
              2 referrals in motion
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--paper)', opacity: 0.75 }}>
              Track your warm intros
            </div>
          </div>
          <span style={{ color: 'var(--paper)', opacity: 0.8, display: 'flex', alignItems: 'center' }}>
            {cloneElement(I.arrow as React.ReactElement, { size: 16 })}
          </span>
        </button>
      </div>

      {/* Thread list */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '0 20px 100px' }}>
        {THREADS.map((thread, idx) => (
          <button
            key={idx}
            onClick={() => nav.go('thread')}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: idx < THREADS.length - 1 ? '1px solid var(--line-soft)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 0',
              textAlign: 'left',
            }}
          >
            {/* Avatar or system icon */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {(thread as any).system ? (
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'var(--ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HayyMark size={0.4} />
                </div>
              ) : (
                <Avatar name={thread.n} tone={thread.tone as any} size={44} />
              )}
              {(thread as any).on && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 1,
                    right: 1,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#22c55e',
                    border: '2px solid var(--paper)',
                  }}
                />
              )}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 14,
                    fontWeight: thread.unread > 0 ? 700 : 500,
                    color: 'var(--ink)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {thread.n}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 12,
                    color: 'var(--ink-mute)',
                    flexShrink: 0,
                  }}
                >
                  {thread.t}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 }}>
                <span
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 13,
                    color: thread.unread > 0 ? 'var(--ink)' : 'var(--ink-soft)',
                    fontWeight: thread.unread > 0 ? 600 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                >
                  {thread.msg}
                </span>
                {thread.unread > 0 && (
                  <span
                    style={{
                      flexShrink: 0,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'var(--clay)',
                      color: 'var(--paper)',
                      fontFamily: 'var(--sans)',
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {thread.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <TabBar tab="inbox" />
    </AppScreen>
  );
}
