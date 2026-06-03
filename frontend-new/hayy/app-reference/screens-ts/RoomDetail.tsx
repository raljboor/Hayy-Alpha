import { cloneElement } from 'react';
import { DrillScreen, Wash } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Card, Meta, Stack } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const SPEAKERS = [
  { name: 'Maya Nasrallah', role: 'Host · Sr PM', co: 'AWS', tone: 'clay', mic: true },
  { name: 'Rashid Khoury', role: 'Eng Mgr', co: 'Amazon', tone: 'dark', mic: false },
  { name: 'Jenna Sun', role: 'Talent', co: 'Shopify', tone: 'olive', mic: false },
] as const;

export default function RoomDetail() {
  const nav = useNav();

  return (
    <DrillScreen eyebrow="ROOM 04" title="Tonight, 7:00 PM">
      <Wash
        footer={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              gap: 12,
            }}
          >
            <div>
              <Meta
                icon={cloneElement(I.users as React.ReactElement, { size: 13 })}
                label="42 GOING"
              />
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  color: 'var(--ink-soft)',
                  marginTop: 3,
                }}
              >
                Starts in 2h 14m
              </div>
            </div>
            <Btn
              kind="primary"
              label="Reserve seat"
              onPress={() => nav.go('greenRoom')}
            />
          </div>
        }
      >
        {/* Topic pills */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 20px' }}>
          {['Product', 'Interviews'].map((tag) => (
            <span
              key={tag}
              style={{
                padding: '5px 12px',
                borderRadius: 99,
                border: '1.5px solid var(--line)',
                fontFamily: 'var(--sans)',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--ink-soft)',
                background: 'transparent',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Room title */}
        <div style={{ padding: '0 20px 12px' }}>
          <h1
            style={{
              fontFamily: 'var(--display)',
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Breaking into Product at Big Tech
          </h1>
        </div>

        {/* Description */}
        <div style={{ padding: '0 20px 24px' }}>
          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 14,
              color: 'var(--ink-soft)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Join three insiders — a Sr. PM, an Eng Manager, and a Talent partner — for a
            no-fluff breakdown of how Big Tech really hires into Product. We'll cover the PM
            interview loop, what stands out in a resume, and how to turn a room conversation
            into a warm referral.
          </p>
        </div>

        {/* ON STAGE section */}
        <div style={{ padding: '0 20px 24px' }}>
          <div
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--ink-mute)',
              textTransform: 'uppercase' as const,
              marginBottom: 14,
            }}
          >
            ON STAGE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SPEAKERS.map((speaker) => (
              <div
                key={speaker.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar name={speaker.name} size={48} tone={speaker.tone as any} />
                  {speaker.mic && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'var(--clay)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--paper)',
                        color: 'var(--paper)',
                      }}
                    >
                      {cloneElement(I.mic as React.ReactElement, { size: 10 })}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--ink)',
                    }}
                  >
                    {speaker.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 12,
                      color: 'var(--ink-soft)',
                      marginTop: 1,
                    }}
                  >
                    {speaker.role} · {speaker.co}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendee card */}
        <div style={{ padding: '0 20px 32px' }}>
          <Card style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Stack>
              {['Sara', 'Tom', 'Other'].map((name) => (
                <Avatar key={name} name={name} size={32} tone="sand" />
              ))}
            </Stack>
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 13,
                  color: 'var(--ink)',
                }}
              >
                <strong>Sara, Tom &amp; 40 others</strong>
                {' '}
                <span style={{ color: 'var(--ink-soft)' }}>have reserved a seat</span>
              </span>
            </div>
          </Card>
        </div>
      </Wash>
    </DrillScreen>
  );
}
