import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I, Avatar, Btn, Pill, Waveform, Skeleton } from '@/shared/primitives';
import { getProfile } from '@/lib/api/profiles';
import type { UserProfile } from '@/types/models';

type Tone = 'clay' | 'olive' | 'sand' | 'dark';

const HELPS = [
  { l: 'Coffee chat (30 min)', d: '3 / month · Wed, Fri, Sun', primary: true },
  { l: 'Resume review', d: 'Async · same-week reply' },
  { l: 'Portfolio review', d: '60 min · for designers only' },
  { l: 'Mock interview', d: '60 min · product design rounds' },
];

const VOUCHES = [
  { who: 'Diego Rivas', role: 'PM at Notion · referred Mar 2024', tone: 'olive' as Tone,
    q: "This person is the reason I got my Shopify interview. They didn't just refer me — they rehearsed answers with me on a Sunday." },
  { who: 'Sara Mahmoud', role: 'Eng at Shopify · referred Apr 2024', tone: 'sand' as Tone,
    q: "I'd been job-searching for nine months. One coffee chat reframed how I told my story. Offer in three weeks." },
];

const MUTUALS: { n: string; t: Tone }[] = [
  { n: 'Maya N', t: 'clay' }, { n: 'Rashid K', t: 'olive' }, { n: 'Layla P', t: 'sand' }, { n: 'Sara M', t: 'dark' },
];

export default function ProfileDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProfile(id)
      .then(p => { if (!p) setNotFound(true); else setProfile(p); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ padding: '32px 48px', maxWidth: 760 }}>
      {[180, 80, 120, 200].map((h, i) => <Skeleton key={i} style={{ height: h, borderRadius: 'var(--radius-lg)', marginBottom: 16 }} />)}
    </div>
  );

  if (notFound || !profile) return (
    <div style={{ padding: '32px 48px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clay)', fontWeight: 600, fontSize: 14 }}>← Back</button>
      <p style={{ marginTop: 32, color: 'var(--ink-soft)' }}>Profile not found.</p>
    </div>
  );

  const path = [
    { y: '2024 —', role: profile.headline ?? 'Current role', co: profile.location ?? 'Current company' },
    { y: '2021–24', role: 'Product Designer', co: 'Previous company' },
    { y: '2018–21', role: 'Product Designer', co: 'Earlier role' },
  ];

  const rooms = [
    { t: 'Newcomer Q&A', when: 'Bi-weekly · Thu 7pm', attendees: 47, role: 'Host' },
    { t: 'Breaking into Big Tech', when: 'Tue Apr 29', attendees: 34, role: 'Co-host' },
    { t: 'Portfolio teardown', when: 'Apr 12', attendees: 28, role: 'Speaker' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{
          padding: '56px 96px 120px', maxWidth: 760, width: '100%', margin: '0 auto',
          display: 'flex', flexDirection: 'column', gap: 44,
        }}>
          {/* Identity */}
          <header style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative' }}>
                <Avatar name={profile.full_name ?? '?'} size={64} tone="dark" />
                <span style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: 99, background: 'var(--olive)', border: '3px solid var(--bg)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ fontSize: 36, lineHeight: 1.05 }}>{profile.full_name}</h1>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 4 }}>
                  {[profile.headline, profile.location].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>

            {profile.bio && (
              <p style={{ fontFamily: 'var(--display)', fontSize: 26, lineHeight: 1.3, fontWeight: 400, color: 'var(--ink)', maxWidth: 600 }}>
                {profile.bio}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 8px', borderRadius: 999, background: 'var(--cream)', border: '1px solid var(--olive)', fontSize: 12, fontWeight: 500, color: 'var(--olive)' }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--olive)' }} />
                Open to coffee chats
              </span>
              <span style={{ padding: '5px 10px', borderRadius: 999, background: 'transparent', border: '1px solid var(--line)', fontSize: 12, fontWeight: 500, color: 'var(--ink-soft)' }}>
                Refers within network
              </span>
              <span style={{ padding: '5px 10px', borderRadius: 999, background: 'transparent', border: '1px solid var(--line)', fontSize: 12, fontWeight: 500, color: 'var(--ink-soft)' }}>
                Hosts every 2 weeks
              </span>
            </div>
          </header>

          {/* Stat row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, paddingTop: 22, paddingBottom: 22, borderTop: '1px solid var(--line-soft)', borderBottom: '1px solid var(--line-soft)' }}>
            {[
              { n: '61', l: 'Warm intros made', accent: 'var(--clay)' },
              { n: '12', l: 'Rooms hosted · 6mo', accent: undefined },
              { n: '98%', l: 'Replies within a week', accent: undefined },
              { n: '3', l: 'Years on Hayy', accent: undefined },
            ].map(s => (
              <div key={s.l} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{ fontFamily: 'var(--display)', fontSize: 28, lineHeight: 1, fontWeight: 500, color: s.accent ?? 'var(--ink)' }}>{s.n}</p>
                <p className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{s.l}</p>
              </div>
            ))}
          </div>

          {/* Ask me for */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Ask me for</p>
              <h2 style={{ fontSize: 26, marginTop: 6 }}>What you can <span className="display-italic">actually</span> book.</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {HELPS.map(h => (
                <div key={h.l} style={{
                  padding: 18, borderRadius: 14,
                  background: h.primary ? 'var(--paper)' : 'transparent',
                  border: '1px solid ' + (h.primary ? 'var(--clay)' : 'var(--line-soft)'),
                  boxShadow: h.primary ? 'var(--shadow-soft)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>{h.l}</p>
                    <p style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 4 }}>{h.d}</p>
                  </div>
                  <Btn kind={h.primary ? 'primary' : 'soft'} iconRight={React.cloneElement(I.arrow as React.ReactElement<{ size?: number }>, { size: 14 })}>Book</Btn>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-mute)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--olive)' }}>{React.cloneElement(I.lock as React.ReactElement<{ size?: number }>, { size: 14 })}</span>
              Replies in 3.4 days on average. You'll never be auto-routed.
            </p>
          </section>

          {/* The path here */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2 style={{ fontSize: 26 }}>The path here</h2>
            <div>
              {path.map((r, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24,
                  padding: '14px 0',
                  borderTop: i === 0 ? '1px solid var(--line-soft)' : '1px dashed var(--line-soft)',
                }}>
                  <p className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '.06em', paddingTop: 3 }}>{r.y}</p>
                  <p style={{ fontFamily: 'var(--display)', fontSize: 17, fontWeight: 500 }}>
                    {r.role} <span style={{ color: 'var(--ink-mute)', fontWeight: 400 }}>· {r.co}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Rooms I host */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={{ fontSize: 26 }}>Rooms I host</h2>
              <span className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.06em', cursor: 'pointer' }}>SEE ALL · 12 →</span>
            </div>
            <div>
              {rooms.map((r, i) => (
                <div key={r.t} style={{
                  display: 'grid', gridTemplateColumns: '1fr 200px auto', gap: 14, alignItems: 'center',
                  padding: '16px 0',
                  borderTop: i === 0 ? '1px solid var(--line-soft)' : '1px dashed var(--line-soft)',
                }}>
                  <div>
                    <Pill style={{ background: r.role === 'Host' ? 'var(--clay)' : 'var(--cream)', color: r.role === 'Host' ? 'var(--paper)' : 'var(--ink-soft)', borderColor: 'transparent' }}>{r.role}</Pill>
                    <p style={{ fontFamily: 'var(--display)', fontSize: 17, fontWeight: 500, marginTop: 6, lineHeight: 1.2 }}>{r.t}</p>
                  </div>
                  <p className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '.06em' }}>{r.when}</p>
                  <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{r.attendees} attended</span>
                </div>
              ))}
            </div>
          </section>

          {/* Vouches */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 26 }}>Vouches</h2>
            {VOUCHES.map(v => (
              <div key={v.who} style={{ padding: 18, borderRadius: 14, background: 'var(--cream)', border: '1px solid var(--line-soft)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontFamily: 'var(--display)', fontSize: 16, fontStyle: 'italic', lineHeight: 1.45 }}>"{v.q}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={v.who} size={28} tone={v.tone} />
                  <p style={{ fontSize: 12, color: 'var(--ink-mute)' }}>
                    <b style={{ color: 'var(--ink)' }}>{v.who}</b> · {v.role}
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* Mutuals */}
          <section style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 22, borderTop: '1px solid var(--line-soft)' }}>
            <div style={{ display: 'flex' }}>
              {MUTUALS.map((p, i) => (
                <div key={p.n} style={{ marginLeft: i === 0 ? 0 : -8, border: '2px solid var(--bg)', borderRadius: 999 }}>
                  <Avatar name={p.n} size={30} tone={p.t} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              <b style={{ color: 'var(--ink)' }}>4 mutual connections</b> · including Maya, Rashid, Layla, and 1 more
            </p>
          </section>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div style={{ padding: '16px 96px', borderTop: '1px solid var(--line-soft)', background: 'var(--paper)', display: 'flex', gap: 8, flex: 'none' }}>
        <Btn kind="primary" size="lg" icon={React.cloneElement(I.shake as React.ReactElement<{ size?: number }>, { size: 16 })} style={{ flex: 1, justifyContent: 'center' }}>Request a referral</Btn>
        <Btn kind="soft" size="lg" icon={React.cloneElement(I.cal as React.ReactElement<{ size?: number }>, { size: 16 })} style={{ flex: 1, justifyContent: 'center' }}>Book a chat</Btn>
        <Btn kind="ghost" size="lg" icon={React.cloneElement(I.msg as React.ReactElement<{ size?: number }>, { size: 16 })} onClick={() => navigate('/app/messages')}>Message</Btn>
      </div>
    </div>
  );
}
