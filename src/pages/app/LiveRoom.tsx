import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, LiveTag, Waveform } from '@/shared/primitives';

type Tone = 'clay' | 'olive' | 'sand' | 'dark';

const SPEAKERS: { n: string; r: string; tone: Tone; on: boolean; host?: boolean }[] = [
  { n: 'Maya Nasrallah', r: 'Sr PM · AWS', tone: 'clay', on: true, host: true },
  { n: 'Rashid Khoury', r: 'Eng Mgr · Amazon', tone: 'olive', on: true },
  { n: 'Jenna Sun', r: 'Talent · Shopify', tone: 'sand', on: false },
  { n: 'Omar Aziz', r: 'Data · RBC', tone: 'dark', on: true },
  { n: 'Layla Park', r: 'Designer · Figma', tone: 'clay', on: false },
  { n: 'Diego Rivas', r: 'PM · Notion', tone: 'olive', on: false },
];

const LISTENERS: { n: string; tone: Tone; hand?: boolean }[] = [
  { n: 'Amira Hassan', tone: 'clay', hand: true },
  { n: 'Ben Lee', tone: 'sand' },
  { n: 'Carla Mu', tone: 'olive' },
  { n: 'Dev Patel', tone: 'dark', hand: true },
  { n: 'Eli Frey', tone: 'clay' },
  { n: 'Faye Lin', tone: 'olive' },
  { n: 'Gus Ono', tone: 'sand' },
  { n: 'Hina K.', tone: 'dark' },
];

const CHAT: { n: string; tone: Tone; m: string }[] = [
  { n: 'Carla M.', tone: 'olive', m: 'Maya — what should the first message after the room say?' },
  { n: 'Maya N.', tone: 'clay', m: "I usually say 'thank you for what you said about X' first." },
  { n: 'Dev P.', tone: 'dark', m: 'Raised my hand 🤚' },
  { n: 'Amira H.', tone: 'clay', m: 'This is exactly what I needed today.' },
];

const SpeakerTile = ({ s, size = 92 }: { s: typeof SPEAKERS[0]; size?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    <div style={{ position: 'relative' }}>
      <Avatar name={s.n} size={size} tone={s.tone} />
      {s.on && (
        <span style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: '2px solid var(--clay)', pointerEvents: 'none' }} />
      )}
      {s.host && (
        <span style={{
          position: 'absolute', top: -2, right: -2,
          background: 'var(--clay)', color: 'var(--paper)',
          borderRadius: 999, padding: '2px 7px', fontSize: 9, fontWeight: 600,
          letterSpacing: '.05em', textTransform: 'uppercase' as const,
          border: '2px solid var(--paper)',
        }}>Host</span>
      )}
      {s.on ? (
        <span style={{
          position: 'absolute', bottom: -2, right: -2, width: 22, height: 22,
          borderRadius: 999, background: 'var(--paper)', border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Waveform bars={3} height={10} color="var(--clay)" />
        </span>
      ) : (
        <span style={{
          position: 'absolute', bottom: -2, right: -2, width: 22, height: 22,
          borderRadius: 999, background: 'var(--paper)', border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-mute)',
        }}>
          {React.cloneElement(I.micOff as React.ReactElement<{ size?: number }>, { size: 11 })}
        </span>
      )}
    </div>
    <div style={{ textAlign: 'center' as const, maxWidth: size + 30 }}>
      <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>
        {s.n.split(' ')[0]} {s.n.split(' ')[1]?.[0]}.
      </p>
      <p style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 1, lineHeight: 1.2 }}>{s.r}</p>
    </div>
  </div>
);

const ControlBtn = ({ icon, label, highlight, danger, onClick }: {
  icon: React.ReactNode; label: string; highlight?: boolean; danger?: boolean; onClick?: () => void;
}) => (
  <div onClick={onClick} style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    padding: '8px 14px', borderRadius: 999,
    background: highlight ? 'var(--clay)' : danger ? 'hsl(0 65% 45% / .08)' : 'transparent',
    color: highlight ? 'var(--paper)' : danger ? 'hsl(0 65% 45%)' : 'var(--ink-soft)',
    cursor: 'pointer', minWidth: 64, userSelect: 'none' as const,
  }}>
    {icon}
    <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
  </div>
);

export default function LiveRoom() {
  const navigate = useNavigate();
  const [chatMsg, setChatMsg] = useState('');
  const [handRaised, setHandRaised] = useState(false);

  return (
    <div className="hy" data-palette="dusk" style={{
      width: '100%', height: '100%', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', background: 'var(--bg)',
    }}>
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        padding: '16px 28px', borderBottom: '1px solid var(--line-soft)', background: 'var(--paper)',
        flex: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button onClick={() => navigate(-1)} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 34, height: 34, borderRadius: 10, flex: 'none',
            background: 'var(--cream)', border: '1px solid var(--line)',
            color: 'var(--ink-soft)', cursor: 'pointer',
          }}>
            {React.cloneElement(I.chevL as React.ReactElement<{ size?: number }>, { size: 16 })}
          </button>
          <LiveTag />
          <span style={{
            fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginLeft: 4,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, maxWidth: 380,
          }}>
            Breaking into Amazon as a newcomer to Canada
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 'none' }}>
          <span className="mono" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>14:32</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-soft)' }}>
            {React.cloneElement(I.users as React.ReactElement<{ size?: number }>, { size: 14 })} 28
          </span>
        </div>
      </div>

      {/* Body: main + side rail */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', overflow: 'hidden', minHeight: 0 }}>
        {/* Main stage */}
        <main style={{ padding: 28, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
              On stage
            </p>
            <h2 style={{ fontSize: 26, marginTop: 4 }}>
              "How do I turn a referral into a real interview?"
            </h2>
          </div>

          {/* Speaker grid 3 × 2 */}
          <div style={{
            display: 'grid', gap: 24, gridTemplateColumns: 'repeat(3, 1fr)',
            justifyItems: 'center', padding: '12px 0',
          }}>
            {SPEAKERS.map(s => <SpeakerTile key={s.n} s={s} size={92} />)}
          </div>

          {/* Caption strip */}
          <div className="hy-card" style={{
            padding: 16, display: 'flex', gap: 14, alignItems: 'center',
            background: 'var(--cream)', borderColor: 'var(--line-soft)',
          }}>
            <Avatar name="Maya N." size={36} tone="clay" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Maya N. · speaking</p>
              <p style={{ fontSize: 14, marginTop: 2 }}>
                …the trick is making the host want to be your{' '}
                <span style={{ color: 'var(--clay)', fontWeight: 500 }}>second</span> introduction, not your first.
              </p>
            </div>
            <Waveform bars={14} height={22} color="var(--clay)" />
          </div>

          {/* Listener row */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <p className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
                22 Listening · 2 raised hands
              </p>
              <span style={{ fontSize: 12, color: 'var(--clay)', fontWeight: 500, cursor: 'pointer' }}>Invite to stage</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 12 }}>
              {LISTENERS.map(l => (
                <div key={l.n} style={{ position: 'relative' }}>
                  <Avatar name={l.n} size={42} tone={l.tone} />
                  {l.hand && (
                    <span style={{
                      position: 'absolute', bottom: -3, right: -3, width: 22, height: 22,
                      borderRadius: 999, background: 'var(--spotlight)', border: '2px solid var(--paper)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {React.cloneElement(I.hand as React.ReactElement<{ size?: number }>, { size: 10 })}
                    </span>
                  )}
                </div>
              ))}
              <span style={{
                width: 42, height: 42, borderRadius: 999, background: 'var(--paper)',
                border: '1px dashed var(--line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: 'var(--ink-mute)',
              }}>+14</span>
            </div>
          </div>

          {/* Controls bar */}
          <div style={{
            marginTop: 'auto', display: 'flex', justifyContent: 'center',
            gap: 10, padding: 10, background: 'var(--paper)', borderRadius: 999,
            border: '1px solid var(--line)', boxShadow: 'var(--shadow-soft)',
            alignSelf: 'center',
          }}>
            <ControlBtn
              icon={React.cloneElement(I.hand as React.ReactElement<{ size?: number }>, { size: 18 })}
              label="Raise"
              highlight={handRaised}
              onClick={() => setHandRaised(h => !h)}
            />
            <ControlBtn
              icon={React.cloneElement(I.heart as React.ReactElement<{ size?: number }>, { size: 18 })}
              label="React"
            />
            <ControlBtn
              icon={React.cloneElement(I.shake as React.ReactElement<{ size?: number }>, { size: 18 })}
              label="Refer me"
              highlight
            />
            <ControlBtn
              icon={React.cloneElement(I.msg as React.ReactElement<{ size?: number }>, { size: 18 })}
              label="Chat"
            />
            <ControlBtn
              icon={React.cloneElement(I.closed as React.ReactElement<{ size?: number }>, { size: 18 })}
              label="Leave"
              danger
              onClick={() => navigate(-1)}
            />
          </div>
        </main>

        {/* Side conversation rail */}
        <aside style={{
          borderLeft: '1px solid var(--line-soft)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', background: 'var(--paper)',
        }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line-soft)', flex: 'none' }}>
            <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
              Side conversation
            </p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CHAT.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <Avatar name={m.n} size={26} tone={m.tone} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{m.n}</p>
                  <p style={{ fontSize: 13, marginTop: 2 }}>{m.m}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid var(--line-soft)', flex: 'none' }}>
            <input
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              placeholder="Message the room…"
              style={{
                width: '100%', background: 'var(--cream)', borderRadius: 999,
                padding: '8px 14px', fontSize: 12, color: 'var(--ink)',
                border: 'none', outline: 'none',
              }}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
