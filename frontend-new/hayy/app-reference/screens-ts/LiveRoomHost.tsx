import { cloneElement, useState } from 'react';
import { Wash, SAFE_TOP } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Meta, Waveform } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const speakers = [
  { name: 'Adam Saleh', role: 'Host', speaking: true, muted: false, tone: 'clay' },
  { name: 'Maya Nasrallah', role: 'Co-host', speaking: false, muted: false, tone: 'clay' },
  { name: 'Rashid Khoury', role: 'Guest', speaking: false, muted: true, tone: 'dark' },
];

const requests = [
  { name: 'Layla Park', role: 'APM · Figma', tone: 'olive' },
  { name: 'Omar Aziz', role: 'Data · RBC', tone: 'sand' },
];

export default function LiveRoomHost() {
  const nav = useNav();
  const [muted, setMuted] = useState(false);
  const [tab, setTab] = useState<'speakers' | 'requests'>('speakers');

  return (
    <div
      className="hy"
      data-palette="dusk"
      style={{
        position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg)', fontFamily: 'var(--sans)', color: 'var(--ink)',
      }}
    >
      <Wash />

      {/* Header */}
      <div style={{
        position: 'relative', zIndex: 2,
        paddingTop: SAFE_TOP, padding: `${SAFE_TOP}px 20px 0`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span className="hy-pill hy-pill-live">LIVE</span>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>
          Breaking into Product at Big Tech
        </span>
        <button
          onClick={() => nav.go('recap')}
          style={{
            background: '#c0392b', color: '#fff', border: 'none', borderRadius: 10,
            padding: '7px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          End
        </button>
      </div>

      {/* Stats bar */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', gap: 16, padding: '10px 20px 0',
      }}>
        <Meta>42 listening</Meta>
        <Meta>·</Meta>
        <Meta>9 spoke</Meta>
        <Meta>·</Meta>
        <Meta>38 MIN</Meta>
      </div>

      {/* Tab toggle */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', gap: 4, padding: '14px 20px 0',
      }}>
        {(['speakers', 'requests'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', border: 'none',
              background: tab === t ? 'var(--clay)' : 'color-mix(in oklab, var(--ink) 10%, transparent)',
              color: tab === t ? 'var(--paper)' : 'var(--ink-soft)',
            }}
          >
            {t === 'speakers' ? `Speakers (${speakers.length})` : `Requests (${requests.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2, flex: 1, minHeight: 0,
        overflowY: 'auto', padding: '16px 20px',
      }}>
        {tab === 'speakers' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {speakers.map((s) => (
              <div
                key={s.name}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 16,
                  background: s.speaking
                    ? 'color-mix(in oklab, var(--clay) 14%, var(--paper))'
                    : 'color-mix(in oklab, var(--ink) 6%, transparent)',
                  border: s.speaking ? '1.5px solid color-mix(in oklab, var(--clay) 30%, transparent)' : '1px solid transparent',
                }}
              >
                <div style={{ position: 'relative', flex: 'none' }}>
                  <Avatar name={s.name} size={46} tone={s.tone} />
                  {s.speaking && (
                    <span style={{
                      position: 'absolute', bottom: -2, right: -2,
                      background: 'var(--clay)', borderRadius: 999,
                      width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {cloneElement(I.mic as React.ReactElement, { size: 9, color: 'white' })}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</p>
                  <Meta>{s.role}</Meta>
                </div>
                {s.speaking && <Waveform />}
                {s.muted && (
                  <span style={{ color: 'var(--ink-mute)', opacity: 0.5 }}>
                    {cloneElement(I.micOff as React.ReactElement, { size: 18 })}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {requests.map((r) => (
              <div
                key={r.name}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 16,
                  background: 'color-mix(in oklab, var(--ink) 6%, transparent)',
                }}
              >
                <Avatar name={r.name} size={46} tone={r.tone} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 15 }}>{r.name}</p>
                  <Meta>{r.role}</Meta>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn kind="primary" size="md">Admit</Btn>
                  <Btn kind="soft" size="md">Decline</Btn>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '16px 22px 42px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
      }}>
        {/* Mute toggle */}
        <button
          onClick={() => setMuted(!muted)}
          style={{
            width: 60, height: 60, borderRadius: 999, border: 'none', cursor: 'pointer',
            background: muted
              ? 'color-mix(in oklab, var(--ink) 14%, transparent)'
              : 'var(--clay)',
            color: muted ? 'var(--ink-mute)' : 'var(--paper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: muted ? 'none' : '0 8px 24px -8px color-mix(in oklab, var(--clay) 60%, transparent)',
          }}
        >
          {muted
            ? cloneElement(I.micOff as React.ReactElement, { size: 24 })
            : cloneElement(I.mic as React.ReactElement, { size: 24 })}
        </button>

        {/* Share */}
        <button style={{
          width: 52, height: 52, borderRadius: 999, border: '1px solid var(--line)',
          background: 'color-mix(in oklab, var(--ink) 6%, transparent)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)',
        }}>
          {cloneElement(I.link as React.ReactElement, { size: 20 })}
        </button>

        {/* More */}
        <button style={{
          width: 52, height: 52, borderRadius: 999, border: '1px solid var(--line)',
          background: 'color-mix(in oklab, var(--ink) 6%, transparent)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)',
        }}>
          {cloneElement(I.more as React.ReactElement, { size: 20 })}
        </button>
      </div>
    </div>
  );
}
