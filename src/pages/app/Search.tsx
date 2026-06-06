import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, LiveTag, Btn, Pill, Skeleton } from '@/shared/primitives';
import { useAuthContext } from '@/context/AuthContext';
import { getSuggestedProfiles, type SuggestedProfile } from '@/lib/api/profiles';
import { getRooms } from '@/lib/api/rooms';
import type { Room } from '@/lib/mockData';

const TOPICS = ['Newcomer · Canada', 'Product · Fintech', 'Design systems', 'Resume teardown', 'MENA founders', 'Operations roles'];
const RECENT_SEARCHES = ['fintech newcomer', 'stripe sr pm', 'design systems mentor', 'amazon hiring'];

function fmtWhen(iso: string, status: string): string {
  if (status === 'live') return 'NOW';
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.round((d.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    if (diff === 0) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (diff === 1) return 'Tomorrow';
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  } catch { return ''; }
}

export default function Search() {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [query, setQuery] = useState('');
  const [people, setPeople] = useState<SuggestedProfile[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interests = [...(profile?.skills ?? []), ...(profile?.target_roles ?? [])];
    Promise.all([
      getSuggestedProfiles({ interests, selfId: profile?.id ?? null, limit: 6 }),
      getRooms(),
    ]).then(([p, r]) => {
      setPeople(p);
      setRooms(r);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [profile]);

  const lowerQ = query.toLowerCase();
  const filteredPeople = people.filter(p =>
    !query || p.full_name.toLowerCase().includes(lowerQ) || (p.headline ?? '').toLowerCase().includes(lowerQ)
  );
  const filteredRooms = rooms.filter(r =>
    !query || r.title.toLowerCase().includes(lowerQ) || (r.category ?? '').toLowerCase().includes(lowerQ)
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '32px 48px 18px', borderBottom: '1px solid var(--line-soft)', flex: 'none' }}>
        <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Discover</p>
        <h1 style={{ fontSize: 42, marginTop: 6, lineHeight: 1.05 }}>
          Find the <span className="display-italic">right</span> room, person, or thread.
        </h1>
        <div style={{
          marginTop: 18, padding: '14px 18px', borderRadius: 16,
          background: 'var(--paper)', border: '1.5px solid var(--clay)',
          display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow-soft)',
        }}>
          <span style={{ color: 'var(--clay)', flex: 'none' }}>
            {React.cloneElement(I.search as React.ReactElement<{ size?: number }>, { size: 18 })}
          </span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="stripe payments referral"
            style={{ flex: 1, fontSize: 16, color: 'var(--ink)', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--sans)' }}
          />
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', padding: '3px 8px', borderRadius: 6, background: 'var(--cream)', flex: 'none' }}>⌘K</span>
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-mute)' }}>
          <span style={{ color: 'var(--clay)', fontWeight: 500 }}>{filteredPeople.length + filteredRooms.length} results</span> across people, rooms, and topics.
        </p>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 48px 40px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
        {/* Left: people + rooms */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 style={{ fontSize: 22 }}>People · {filteredPeople.length}</h2>
            <span className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.06em', cursor: 'pointer' }}>SEE ALL →</span>
          </div>

          {loading ? (
            [1, 2, 3].map(i => <Skeleton key={i} style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />)
          ) : filteredPeople.slice(0, 3).map(p => (
            <div key={p.id} className="hy-card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
              <Avatar name={p.full_name} size={44} tone="clay" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{p.full_name}</p>
                  {p.role_type === 'open' && (
                    <Pill style={{ background: 'var(--cream)', color: 'var(--olive)' }}>Open to chat</Pill>
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 2 }}>{p.headline ?? p.role_type}</p>
                {p.shared_tokens.length > 0 && (
                  <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', marginTop: 6, letterSpacing: '.06em' }}>
                    ↳ {p.shared_tokens.slice(0, 3).join(' · ').toUpperCase()}
                  </p>
                )}
              </div>
              <Btn kind="soft" onClick={() => navigate(`/app/profile/${p.id}`)}>View</Btn>
            </div>
          ))}

          <div style={{ marginTop: 8 }}>
            <h2 style={{ fontSize: 22 }}>Rooms · {filteredRooms.length}</h2>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {loading ? (
                [1, 2, 3].map(i => <Skeleton key={i} style={{ height: 60, borderRadius: 'var(--radius-lg)' }} />)
              ) : filteredRooms.slice(0, 5).map(r => (
                <div key={r.id} style={{
                  padding: 14, borderRadius: 14, background: 'var(--paper)', border: '1px solid var(--line-soft)',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div className="mono" style={{
                    fontSize: 11, color: r.status === 'live' ? 'var(--clay)' : 'var(--ink)',
                    fontWeight: 600, width: 64, flex: 'none',
                  }}>
                    {fmtWhen(r.startsAt, r.status ?? '')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const }}>
                      {r.status === 'live' && <LiveTag>Live</LiveTag>}
                      <p style={{ fontFamily: 'var(--display)', fontSize: 16, fontWeight: 500 }}>{r.title}</p>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 2 }}>
                      {r.company ?? r.category} · {r.category}
                    </p>
                  </div>
                  <Btn kind={r.status === 'live' ? 'primary' : 'soft'}
                    onClick={() => navigate(r.status === 'live' ? `/app/rooms/${r.id}/live` : `/app/rooms/${r.id}`)}>
                    {r.status === 'live' ? 'Join' : 'RSVP'}
                  </Btn>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right rail */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <div className="hy-card" style={{ padding: 18 }}>
            <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Topics</p>
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
              {TOPICS.map(t => (
                <button key={t} onClick={() => setQuery(t)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                  <Pill>{t}</Pill>
                </button>
              ))}
            </div>
          </div>

          <div className="hy-card" style={{ padding: 18 }}>
            <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Recent searches</p>
            <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {RECENT_SEARCHES.map(q => (
                <li key={q} style={{ fontSize: 13, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                  onClick={() => setQuery(q)}>
                  <span style={{ color: 'var(--ink-mute)' }}>
                    {React.cloneElement(I.search as React.ReactElement<{ size?: number }>, { size: 12 })}
                  </span>
                  {q}
                </li>
              ))}
            </ul>
          </div>

          <div style={{
            padding: 18, borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--clay), hsl(14 60% 38%))',
            color: 'var(--paper)', boxShadow: 'var(--shadow-warm)',
          }}>
            <p className="mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(255,255,255,.85)' }}>Tip</p>
            <p style={{ fontFamily: 'var(--display)', fontSize: 18, marginTop: 8, lineHeight: 1.3 }}>
              Try natural sentences — <i>"who can intro me to a PM at Stripe"</i>.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
