import { cloneElement } from 'react';
import { AppScreen, ScreenHead, TabBar } from '@/components/hayy/AppShell';
import { I, Avatar, LiveTag, Btn, Card, Meta } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const CATEGORIES = ['For you', 'Live now', 'Product', 'Engineering', 'Design', 'Data'];

const ROOMS = [
  { t: 'How we hire designers at Figma', host: 'Layla Park', co: 'Figma', n: 28, live: true, justNow: true, tone: 'olive' },
  { t: 'Cracking the PM case interview', host: 'Maya Nasrallah', co: 'AWS', n: 42, live: true, tone: 'clay' },
  { t: 'From bootcamp to backend at RBC', host: 'Omar Aziz', co: 'RBC', n: 17, live: false, when: '7:30 PM', tone: 'sand' },
  { t: 'Referrals, honestly: what works', host: 'Priya Shah', co: 'Stripe', n: 53, live: false, when: 'Tomorrow', tone: 'dark' },
] as const;

export default function RoomsList() {
  const nav = useNav();

  return (
    <AppScreen tab="home">
      <ScreenHead eyebrow="DISCOVER" title="Rooms" />

      {/* Category pills */}
      <div
        style={{
          overflowX: 'auto',
          display: 'flex',
          gap: 8,
          padding: '0 20px 16px',
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: 99,
              border: `1.5px solid ${i === 0 ? 'var(--ink)' : 'var(--line)'}`,
              background: i === 0 ? 'var(--ink)' : 'transparent',
              color: i === 0 ? 'var(--paper)' : 'var(--ink)',
              fontFamily: 'var(--sans)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Shuffle card */}
      <div style={{ padding: '0 20px 12px' }}>
        <button
          onClick={() => nav.go('liveRoom')}
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
            {cloneElement(I.shuffle as React.ReactElement, { size: 22 })}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 14, color: 'var(--paper)' }}>
              Shuffle into a room
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--paper)', opacity: 0.7 }}>
              Drop into something relevant
            </div>
          </div>
          <span style={{ color: 'var(--paper)', opacity: 0.8, display: 'flex', alignItems: 'center' }}>
            {cloneElement(I.arrow as React.ReactElement, { size: 16 })}
          </span>
        </button>
      </div>

      {/* Room list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 20px 100px' }}>
        {ROOMS.map((room, idx) => (
          <Card key={idx} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Avatar name={room.host} tone={room.tone as any} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--display)',
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--ink)',
                    lineHeight: 1.3,
                    marginBottom: 2,
                  }}
                >
                  {room.t}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-soft)' }}>
                  {room.host} · {room.co}
                </div>
              </div>
              {room.live && (
                <div style={{ flexShrink: 0 }}>
                  <LiveTag justNow={'justNow' in room ? (room as any).justNow : false} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Meta
                icon={cloneElement(I.users as React.ReactElement, { size: 13 })}
                label={`${room.n} in room${'when' in room && !room.live ? ` · ${(room as any).when}` : ''}`}
              />
              {room.live ? (
                <Btn
                  kind="primary"
                  icon={cloneElement(I.mic as React.ReactElement, { size: 14 })}
                  label="Join"
                  onPress={() => nav.go('liveRoom')}
                />
              ) : (
                <Btn kind="soft" label="Remind me" onPress={() => {}} />
              )}
            </div>
          </Card>
        ))}
      </div>

      <TabBar tab="home" />
    </AppScreen>
  );
}
