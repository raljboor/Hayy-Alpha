import { cloneElement } from 'react';
import { AppScreen, ScreenHead, RoundBtn, TabBar } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Card, Meta, Stack, HayyMark } from '@/components/hayy/HayyPrimitives';
import { RichProfileBody, MY_PROFILE } from '@/components/hayy/RichProfileBody';
import { useNav } from '@/hooks/useNav';

const STATS = [
  { n: 18, l: 'ROOMS' },
  { n: 6, l: 'INTROS' },
  { n: 3, l: 'REFERRALS' },
  { n: 214, l: 'FOLLOWERS', clickable: true },
] as const;

const MENU = [
  { icon: I.spark, label: 'Your journey', sub: 'Outcomes', route: 'wins' },
  { icon: I.cal, label: 'Your schedule', sub: '2 upcoming', route: 'scheduleYours' },
  { icon: I.shake, label: 'Referrals', sub: '3 active', route: 'referrals' },
  { icon: I.spark, label: 'Saved rooms', sub: '', route: 'saved' },
  { icon: I.users, label: 'Invite friends', sub: '', route: 'invite' },
] as const;

const DONUT_PCTS = 0.7;
const R = 22;
const CIRC = 2 * Math.PI * R;

export default function Profile() {
  const nav = useNav();

  return (
    <AppScreen tab="you">
      {/* Top action row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '4px 20px 12px' }}>
        <RoundBtn icon={cloneElement(I.link as React.ReactElement, { size: 18 })} onPress={() => nav.go('invite')} />
        <RoundBtn icon={cloneElement(I.gear as React.ReactElement, { size: 18 })} onPress={() => nav.go('settings')} />
      </div>

      {/* Identity */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          padding: '0 20px 20px',
        }}
      >
        <Avatar name="Adam Saleh" size={92} tone="clay" />
        <h1
          style={{
            fontFamily: 'var(--display)',
            fontSize: 27,
            fontWeight: 700,
            color: 'var(--ink)',
            margin: '8px 0 0',
            textAlign: 'center',
          }}
        >
          Adam Saleh
        </h1>
        <div
          style={{
            fontFamily: 'var(--sans)',
            fontSize: 14,
            color: 'var(--ink-soft)',
            textAlign: 'center',
          }}
        >
          Aspiring PM · ex-Growth
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontFamily: 'var(--sans)',
            fontSize: 13,
            color: 'var(--ink-mute)',
          }}
        >
          {cloneElement(I.pin as React.ReactElement, { size: 13 })}
          <span>Toronto, Canada</span>
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <Btn kind="primary" label="Edit profile" onPress={() => nav.go('editProfile')} />
          <Btn
            kind="soft"
            icon={cloneElement(I.link as React.ReactElement, { size: 14 })}
            label="Share"
            onPress={() => nav.go('invite')}
          />
        </div>
      </div>

      {/* Stats card */}
      <div style={{ padding: '0 20px 16px' }}>
        <Card style={{ padding: '14px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {STATS.map((s, i) => (
              <button
                key={s.l}
                disabled={!s.clickable}
                onClick={() => s.clickable && nav.go('follows')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderRight: i < STATS.length - 1 ? '1px solid var(--line-soft)' : 'none',
                  cursor: s.clickable ? 'pointer' : 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  padding: '6px 4px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--display)',
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'var(--ink)',
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--ink-mute)',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  {s.l}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Profile completion donut */}
      <div style={{ padding: '0 20px 16px' }}>
        <button
          onClick={() => nav.go('editProfile')}
          style={{
            width: '100%',
            background: 'var(--cream)',
            border: '1.5px solid var(--line-soft)',
            borderRadius: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 16px',
            textAlign: 'left',
          }}
        >
          <svg width={52} height={52} viewBox="0 0 52 52" style={{ flexShrink: 0 }}>
            <circle
              cx={26}
              cy={26}
              r={R}
              fill="none"
              stroke="var(--line)"
              strokeWidth={4}
            />
            <circle
              cx={26}
              cy={26}
              r={R}
              fill="none"
              stroke="var(--clay)"
              strokeWidth={4}
              strokeDasharray={`${CIRC * DONUT_PCTS} ${CIRC * (1 - DONUT_PCTS)}`}
              strokeDashoffset={CIRC * 0.25}
              strokeLinecap="round"
            />
            <text
              x={26}
              y={26}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 11,
                fontWeight: 700,
                fill: 'var(--ink)',
              }}
            >
              70%
            </text>
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>
              Complete your profile
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
              Add a bio and your goals to stand out
            </div>
          </div>
          <span style={{ color: 'var(--ink-mute)', display: 'flex', alignItems: 'center' }}>
            {cloneElement(I.arrow as React.ReactElement, { size: 16 })}
          </span>
        </button>
      </div>

      {/* Rich profile body */}
      <div style={{ padding: '0 20px 16px' }}>
        <RichProfileBody profile={MY_PROFILE} />
      </div>

      {/* Menu items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 20px 100px' }}>
        {MENU.map((item) => (
          <button
            key={item.label}
            onClick={() => nav.go(item.route as any)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '13px 0',
              borderBottom: '1px solid var(--line-soft)',
              textAlign: 'left',
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
              {cloneElement(item.icon as React.ReactElement, { size: 18 })}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                {item.label}
              </div>
              {item.sub ? (
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-mute)', marginTop: 1 }}>
                  {item.sub}
                </div>
              ) : null}
            </div>
            <span style={{ color: 'var(--ink-mute)', display: 'flex', alignItems: 'center' }}>
              {cloneElement(I.arrow as React.ReactElement, { size: 16 })}
            </span>
          </button>
        ))}
      </div>

      <TabBar tab="you" />
    </AppScreen>
  );
}
