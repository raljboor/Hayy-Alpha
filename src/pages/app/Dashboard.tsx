import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, LiveTag, Btn, Skeleton, Waveform } from '@/shared/primitives';
import { useAuthContext } from '@/context/AuthContext';
import { getRooms } from '@/lib/api/rooms';
import type { Room } from '@/lib/mockData';

function fmtTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    if (diff < 0 && diff > -3 * 60 * 60 * 1000) return 'Live';
    if (diff > 0 && diff < 12 * 60 * 60 * 1000) {
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  } catch { return ''; }
}

function dayGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const DonutPct = ({ pct = 60, size = 72 }: { pct?: number; size?: number }) => {
  const stroke = 8, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flex: 'none' }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--line)" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--clay)" strokeWidth={stroke} fill="none"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="54%" textAnchor="middle" fontFamily="var(--display)" fontSize="16" fill="var(--ink)">
        {pct}
      </text>
    </svg>
  );
};

const MOCK_SPEAKERS = [
  { n: 'Maya N.', r: 'Sr PM, AWS', tone: 'clay' as const },
  { n: 'Rashid K.', r: 'Eng Mgr', tone: 'olive' as const },
  { n: 'Jenna S.', r: 'Recruiter', tone: 'sand' as const },
];

const ACTIVITY = [
  { dot: 'var(--clay)', text: 'Maya N. accepted your coffee request', sub: 'Replied in 4h · says yes to chats most weeks', time: '12m ago' },
  { dot: 'var(--olive)', text: 'You spoke in Product Builders Room', sub: 'Got 3 follow-ups · 2 became messages', time: '2h ago' },
  { dot: 'var(--ink)', text: "Rashid K. wrote: 'Send me your resume'", sub: 'Eng Mgr · Amazon · responding now', time: 'Yesterday' },
  { dot: 'var(--clay)', text: 'New room you\'d like is scheduled', sub: 'RBC × New Grads · Friday 6pm', time: '2d' },
];

function profilePct(profile: Record<string, unknown> | null): number {
  if (!profile) return 0;
  let score = 0;
  if (profile.full_name) score += 15;
  if (profile.headline) score += 15;
  if (profile.bio) score += 20;
  if (profile.location) score += 15;
  if (Array.isArray(profile.skills) && (profile.skills as unknown[]).length > 0) score += 15;
  if (profile.avatar_url) score += 20;
  return score;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRooms().then(setRooms).catch(() => setRooms([])).finally(() => setLoading(false));
  }, []);

  const liveNow = rooms.filter(r => r.status === 'live');
  const upcoming = rooms.filter(r => r.status === 'upcoming');
  const featured = upcoming[0] ?? liveNow[0];
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';
  const today = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  const pct = profilePct(profile as Record<string, unknown> | null);

  return (
    <div style={{ padding: '32px 44px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Greeting */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p className="mono" style={{ fontSize: 11, letterSpacing: '.12em', color: 'var(--clay)', textTransform: 'uppercase' }}>
            {today}
          </p>
          <h1 style={{ fontSize: 44, marginTop: 6 }}>
            {dayGreeting()}, <span className="display-italic">{firstName}.</span>
          </h1>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 16 }}>
            {liveNow.length > 0
              ? `${liveNow.length} room${liveNow.length > 1 ? 's' : ''} live right now.`
              : 'One room is calling your name today.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <button onClick={() => navigate('/app/notifications')} style={{
            position: 'relative', width: 42, height: 42, borderRadius: 14,
            background: 'var(--paper)', border: '1px solid var(--line)',
            color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            {React.cloneElement(I.bell as React.ReactElement<{ size?: number }>, { size: 18 })}
            <span style={{ position: 'absolute', top: 9, right: 9, width: 7, height: 7, borderRadius: 99, background: 'var(--clay)', border: '1.5px solid var(--paper)' }} />
          </button>
          <button onClick={() => navigate('/app/search')} style={{
            width: 42, height: 42, borderRadius: 14,
            background: 'var(--paper)', border: '1px solid var(--line)',
            color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            {React.cloneElement(I.search as React.ReactElement<{ size?: number }>, { size: 18 })}
          </button>
        </div>
      </div>

      {/* Featured room hero */}
      {loading ? (
        <Skeleton style={{ height: 180, borderRadius: 'var(--radius-xl)' }} />
      ) : featured ? (
        <div className="hy-card" style={{
          padding: 26, borderRadius: 'var(--radius-xl)',
          display: 'grid', gridTemplateColumns: '1fr 240px', gap: 24, alignItems: 'center',
          background: 'linear-gradient(135deg, var(--paper), var(--cream))',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {featured.status === 'live'
                ? <LiveTag>Live now · {featured.attendees} here</LiveTag>
                : <LiveTag>{fmtTime(featured.startsAt)}</LiveTag>}
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>
                {featured.category?.toUpperCase()}
              </span>
            </div>
            <h2 style={{ fontSize: 30, marginTop: 12, lineHeight: 1.05 }}>{featured.title}</h2>
            <p style={{ marginTop: 10, color: 'var(--ink-soft)', fontSize: 14 }}>
              {featured.company ? `Hosted at ${featured.company}` : 'Community room'} · {featured.attendees} going
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' as const }}>
              <Btn kind="primary" iconRight={React.cloneElement(I.arrow as React.ReactElement<{ size?: number }>, { size: 16 })}
                onClick={() => navigate(featured.status === 'live' ? `/app/rooms/${featured.id}/live` : `/app/rooms/${featured.id}`)}>
                {featured.status === 'live' ? 'Join the room' : 'View room'}
              </Btn>
              <Btn kind="ghost">Remind me</Btn>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MOCK_SPEAKERS.map(p => (
              <div key={p.n} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 14, background: 'var(--paper)', border: '1px solid var(--line-soft)',
              }}>
                <Avatar name={p.n} size={32} tone={p.tone} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 500 }}>{p.n}</p>
                  <p style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{p.r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: 26, borderRadius: 'var(--radius-xl)', background: 'var(--cream)', border: '1px solid var(--line)', textAlign: 'center' as const }}>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15 }}>No upcoming rooms yet — check back soon.</p>
        </div>
      )}

      {/* Two-column section */}
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.4fr 1fr', minHeight: 360 }}>
        {/* Left: warm activity timeline */}
        <div className="hy-card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <h3 style={{ fontSize: 20 }}>Your warm activity</h3>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>LAST 7 DAYS</span>
          </div>

          <div style={{ position: 'relative', paddingLeft: 22 }}>
            <span style={{ position: 'absolute', top: 6, bottom: 6, left: 6, width: 1, background: 'var(--line)' }} />
            {ACTIVITY.map((e, i) => (
              <div key={i} style={{ position: 'relative', paddingBottom: 16 }}>
                <span style={{
                  position: 'absolute', left: -22, top: 4, width: 13, height: 13, borderRadius: 999,
                  background: e.dot, border: '2px solid var(--paper)',
                  boxShadow: `0 0 0 1px ${e.dot}`,
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{e.text}</p>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', flex: 'none' }}>{e.time}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>{e.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: profile + streak */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Profile completion donut */}
          <div className="hy-card" style={{ padding: 22, background: 'var(--cream)' }}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              <DonutPct pct={pct} />
              <div>
                <p className="mono" style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--clay)', textTransform: 'uppercase' }}>Profile</p>
                <p style={{ fontFamily: 'var(--display)', fontSize: 24, marginTop: 2 }}>{pct}% warm</p>
                <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                  {pct < 80 ? 'Add a 30s video intro — hosts say yes 3× more.' : 'Great profile! Keep attending rooms.'}
                </p>
              </div>
            </div>
            <button className="hy-btn hy-btn-soft" onClick={() => navigate('/app/profile')} style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}>
              Complete profile
            </button>
          </div>

          {/* Streak card */}
          <div className="hy-card" style={{ padding: 22, background: 'var(--clay)', color: 'var(--paper)', borderColor: 'transparent', flex: 1 }}>
            <p className="mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', opacity: .85 }}>Founding</p>
            <p style={{ fontFamily: 'var(--display)', fontSize: 20, marginTop: 6, lineHeight: 1.2 }}>
              You're in the top 8% of helpful members this month.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 6, alignItems: 'center' }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} style={{
                  flex: 1, height: 22, borderRadius: 5,
                  background: i < 5 ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.18)',
                }} />
              ))}
              <span className="mono" style={{ fontSize: 11, marginLeft: 4 }}>5/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
