import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Btn, Pill, Waveform } from '@/shared/primitives';
import { getRoomById } from '@/lib/api/rooms';
import type { Room } from '@/lib/mockData';

const CLIPS = [
  { t: 'On the realistic timeline', who: 'Maya N.', dur: '1:24', q: 'It took me 14 months. Anyone telling you 3 is selling something.' },
  { t: 'Skip the cover letter — almost always', who: 'Rashid K.', dur: '0:48', q: 'If a referral exists, the cover letter is noise. Spend that time on STAR stories.' },
  { t: 'Newcomer salary anchor', who: 'Maya N.', dur: '2:11', q: 'Anchor your number on Toronto market — not your last role\'s currency.' },
];

const FOLLOWUPS = [
  { who: 'Amira → Rashid K.', t: 'olive' as const, what: 'Resume review', status: 'Scheduled' },
  { who: 'Diego → Maya N.', t: 'clay' as const, what: 'Coffee chat', status: 'Awaiting reply' },
  { who: 'Sara → Layla P.', t: 'sand' as const, what: 'Portfolio session', status: 'Scheduled' },
];

const MENTIONS = ['Amazon Day-1', 'STAR stories', 'Toronto salary anchor', 'Newcomer mortgage', 'AWS Sr PM', 'Cover letters'];

const HOSTS = [
  { n: 'Maya N', t: 'clay' as const },
  { n: 'Rashid K', t: 'olive' as const },
  { n: 'Amira H', t: 'dark' as const },
];

export default function Recap() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (id) getRoomById(id).then(setRoom).catch(() => null);
  }, [id]);

  const title = room?.title ?? 'Breaking into Amazon as a newcomer';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header strip */}
      <div style={{ padding: '32px 48px 26px', background: 'var(--paper)', borderBottom: '1px solid var(--line-soft)', flex: 'none' }}>
        <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>
          Recap · Tue Apr 29 · 47 min
        </p>
        <h1 style={{ fontSize: 44, marginTop: 6, lineHeight: 1.05 }}>
          {title.split(' ').slice(0, -2).join(' ')}{' '}
          <span className="display-italic">{title.split(' ').slice(-2).join(' ')}</span>.
        </h1>
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap' as const, gap: 14, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
              {HOSTS.map((p, i) => (
                <div key={p.n} style={{ marginLeft: i === 0 ? 0 : -8, border: '2px solid var(--paper)', borderRadius: 999 }}>
                  <Avatar name={p.n} size={28} tone={p.t} />
                </div>
              ))}
            </div>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Hosted by Maya, Rashid, Amira</span>
          </div>
          <span style={{ width: 1, height: 16, background: 'var(--line)' }} />
          <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
            <b style={{ color: 'var(--ink)' }}>34</b> attended ·{' '}
            <b style={{ color: 'var(--clay)' }}>3</b> follow-ups
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 48px 40px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 40 }}>
        {/* Left: clips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
          <section>
            <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>What we'll remember</p>
            <p style={{ marginTop: 8, fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 600 }}>
              Three moments worth saving. Tap any clip to listen back, share to a thread, or pull a quote.
            </p>
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column' }}>
              {CLIPS.map((c, i) => (
                <article key={c.t} style={{
                  padding: '18px 0',
                  borderTop: i === 0 ? '1px solid var(--line-soft)' : '1px dashed var(--line-soft)',
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.06em' }}>{`CLIP 0${i + 1}`}</span>
                      <span style={{ width: 4, height: 4, borderRadius: 99, background: 'var(--ink-mute)' }} />
                      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{c.dur}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 500, marginTop: 6, lineHeight: 1.2 }}>{c.t}</h3>
                    <blockquote style={{
                      marginTop: 10, paddingLeft: 14, borderLeft: '2px solid var(--clay)',
                      fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5,
                      margin: '10px 0 0',
                    }}>"{c.q}"</blockquote>
                    <p style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-mute)' }}>— {c.who}</p>
                  </div>
                  <div style={{
                    width: 180, height: 64, borderRadius: 14,
                    background: 'var(--cream)', border: '1px solid var(--line-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 14px',
                  }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: 999, background: 'var(--clay)', color: 'var(--paper)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontSize: 12,
                    }}>▶</span>
                    <Waveform bars={14} height={22} active={false} color="var(--ink-mute)" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Right: sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <div className="hy-card" style={{ padding: 18, background: 'var(--cream)' }}>
            <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Follow-ups · the wins</p>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column' }}>
              {FOLLOWUPS.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 0',
                  borderTop: i === 0 ? '0' : '1px dashed var(--line-soft)',
                }}>
                  <Avatar name={f.who.split(' ')[0]} size={28} tone={f.t} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 500 }}>{f.who}</p>
                    <p style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{f.what}</p>
                  </div>
                  <span className="mono" style={{
                    fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase',
                    color: f.status === 'Scheduled' ? 'var(--olive)' : 'var(--ink-mute)',
                  }}>{f.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hy-card" style={{ padding: 18 }}>
            <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Mentioned in the room</p>
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
              {MENTIONS.map(t => <Pill key={t}>{t}</Pill>)}
            </div>
          </div>

          <div style={{
            padding: 18, borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--clay), hsl(14 60% 38%))',
            color: 'var(--paper)', boxShadow: 'var(--shadow-warm)',
          }}>
            <p className="mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(255,255,255,.85)' }}>Replay</p>
            <p style={{ marginTop: 8, fontFamily: 'var(--display)', fontSize: 18, lineHeight: 1.3 }}>
              Listen to the full 47 min — or skim from the transcript.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <Btn kind="soft" style={{ background: 'var(--paper)', color: 'var(--ink)', borderColor: 'transparent' }}>Play full</Btn>
              <Btn kind="ghost" style={{ color: 'var(--paper)' }}>Transcript</Btn>
            </div>
          </div>

          <Btn kind="ghost" onClick={() => navigate('/app/rooms')}>← Back to rooms</Btn>
        </aside>
      </div>
    </div>
  );
}
