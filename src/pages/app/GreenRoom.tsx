import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I, Avatar, Btn } from '@/shared/primitives';
import { getRoomById } from '@/lib/api/rooms';
import type { Room } from '@/lib/mockData';

const INSIDE = [
  { n: 'Amira H', r: 'host', t: 'dark' as const },
  { n: 'Diego R', r: 'co-host', t: 'olive' as const },
  { n: 'Layla P', r: 'speaker', t: 'sand' as const },
  { n: 'Maya N', r: 'listener', t: 'clay' as const },
  { n: 'Han L', r: 'listener', t: 'olive' as const },
  { n: 'Karim R', r: 'listener', t: 'dark' as const },
  { n: 'Yusra A', r: 'listener', t: 'sand' as const },
];

type JoinMode = 'Listener' | 'Hand raised';

export default function GreenRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [joinMode, setJoinMode] = useState<JoinMode>('Listener');

  useEffect(() => {
    if (id) getRoomById(id).then(setRoom).catch(() => null);
  }, [id]);

  return (
    <div style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 56,
      background: 'linear-gradient(180deg, var(--cream), var(--bg))',
      overflow: 'hidden',
    }}>
      <div className="hy-card" style={{
        width: '100%', maxWidth: 560,
        padding: 36, display: 'flex', flexDirection: 'column', gap: 22,
        background: 'var(--paper)', boxShadow: 'var(--shadow-warm)',
      }}>
        {/* Live badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 999,
            background: 'var(--clay)', color: 'var(--paper)',
            fontSize: 11, fontWeight: 600, letterSpacing: '.08em',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 99, background: 'var(--paper)',
              animation: 'hyPulse 1.6s ease-in-out infinite',
            }} />
            LIVE · 23 MIN IN
          </span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '.06em', marginLeft: 'auto' }}>
            {INSIDE.length} INSIDE
          </span>
        </div>

        {/* Room info */}
        <div>
          <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>
            You're about to join
          </p>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 32, fontWeight: 500, lineHeight: 1.1, marginTop: 6 }}>
            {room ? (
              <>
                {room.title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="display-italic">{room.title.split(' ').slice(-1)}</span>
              </>
            ) : (
              <>Newcomer designers <span className="display-italic">Q&A</span></>
            )}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.55 }}>
            Hosted by <b style={{ color: 'var(--ink)' }}>Amira Hassan</b> · with <b style={{ color: 'var(--ink)' }}>Diego Rivas</b>.
            They're talking about portfolio teardowns. You can listen in — or raise your hand to speak.
          </p>
        </div>

        {/* People inside */}
        <div style={{ paddingTop: 18, borderTop: '1px solid var(--line-soft)' }}>
          <p className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            People inside
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
            {INSIDE.map(p => (
              <div key={p.n} title={`${p.n} · ${p.r}`} style={{
                position: 'relative',
                border: p.r === 'host' ? '2px solid var(--clay)' : '2px solid transparent',
                borderRadius: 999, padding: 1,
              }}>
                <Avatar name={p.n} size={36} tone={p.t} />
                {(p.r === 'host' || p.r === 'co-host' || p.r === 'speaker') && (
                  <span style={{
                    position: 'absolute', bottom: -2, right: -2,
                    width: 12, height: 12, borderRadius: 99,
                    background: 'var(--paper)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: 99,
                      background: p.r === 'host' ? 'var(--clay)' : 'var(--olive)',
                    }} />
                  </span>
                )}
              </div>
            ))}
            <span style={{ fontSize: 12, color: 'var(--ink-mute)', marginLeft: 6 }}>+ Maya, Karim know you</span>
          </div>
        </div>

        {/* Mic + role */}
        <div style={{ padding: 14, borderRadius: 14, background: 'var(--cream)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Join as</span>
            <div style={{ display: 'flex', gap: 4, padding: 3, borderRadius: 999, background: 'var(--paper)', border: '1px solid var(--line-soft)' }}>
              {(['Listener', 'Hand raised'] as JoinMode[]).map(r => (
                <span key={r} onClick={() => setJoinMode(r)} style={{
                  padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  background: joinMode === r ? 'var(--ink)' : 'transparent',
                  color: joinMode === r ? 'var(--paper)' : 'var(--ink-mute)',
                  transition: 'all .15s',
                }}>{r}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Microphone</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--olive)', letterSpacing: '.06em' }}>READY · MUTED</span>
              <Btn kind="ghost">Test</Btn>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn kind="ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate(-1)}>Cancel</Btn>
          <Btn kind="primary"
            iconRight={React.cloneElement(I.arrow as React.ReactElement<{ size?: number }>, { size: 14 })}
            style={{ flex: 2, justifyContent: 'center' }}
            onClick={() => navigate(`/app/rooms/${id}/live`)}>
            Slip in quietly
          </Btn>
        </div>

        <p style={{ fontSize: 11, color: 'var(--ink-mute)', lineHeight: 1.5 }}>
          You'll appear as a listener with your name. The host will be notified when you raise your hand.
        </p>
      </div>

      <style>{`@keyframes hyPulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }`}</style>
    </div>
  );
}
