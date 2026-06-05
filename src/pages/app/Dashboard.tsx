import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, LiveTag, Btn, Card, Meta, RoundBtn, Skeleton } from '@/shared/primitives';
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
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRooms()
      .then(setRooms)
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  const liveNow = rooms.filter(r => r.status === 'live');
  const upcoming = rooms.filter(r => r.status === 'upcoming');
  const featured = upcoming[0] ?? liveNow[0];

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';
  const today = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: '32px 44px', maxWidth: 900 }}>
      {/* Greeting */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <p className="mono" style={{ fontSize: 11, letterSpacing: '.12em', color: 'var(--clay)', textTransform: 'uppercase' }}>
            {today}
          </p>
          <h1 style={{ fontSize: 44, marginTop: 6 }}>
            {dayGreeting()}, <span className="display-italic">{firstName}.</span>
          </h1>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 16 }}>
            {liveNow.length > 0 ? `${liveNow.length} room${liveNow.length > 1 ? 's' : ''} live right now.` : 'One room is calling your name today.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <RoundBtn icon={React.cloneElement(I.bell as React.ReactElement<{size?:number}>, { size: 18 })} badge onClick={() => navigate('/app/notifications')} />
          <RoundBtn icon={React.cloneElement(I.search as React.ReactElement<{size?:number}>, { size: 18 })} onClick={() => navigate('/app/search')} />
        </div>
      </div>

      {/* Featured room hero */}
      {loading ? (
        <Skeleton style={{ height: 180, borderRadius: 'var(--radius-xl)', marginBottom: 32 }} />
      ) : featured ? (
        <div className="hy-card" style={{
          padding: 26, borderRadius: 'var(--radius-xl)', marginBottom: 32,
          background: 'linear-gradient(135deg, var(--paper), var(--cream))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            {featured.status === 'live'
              ? <LiveTag>Live now · {featured.attendees} here</LiveTag>
              : <LiveTag>{fmtTime(featured.startsAt)}</LiveTag>}
          </div>
          <h2 style={{ fontSize: 30, lineHeight: 1.05, marginBottom: 10 }}>{featured.title}</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 18 }}>
            {featured.company ? `Hosted at ${featured.company}` : 'Community room'} · {featured.attendees} going
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            <Btn kind="primary" iconRight={React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 16 })}
              onClick={() => navigate(featured.status === 'live' ? `/app/rooms/${featured.id}/live` : `/app/rooms/${featured.id}`)}>
              {featured.status === 'live' ? 'Join live' : 'View room'}
            </Btn>
            <Btn kind="ghost">Remind me</Btn>
          </div>
        </div>
      ) : (
        <div style={{ padding: 26, borderRadius: 'var(--radius-xl)', marginBottom: 32, background: 'var(--cream)', border: '1px solid var(--line)', textAlign: 'center' as const }}>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15 }}>No upcoming rooms yet — check back soon.</p>
        </div>
      )}

      {/* Live now strip */}
      {(loading || liveNow.length > 0) && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span className="hy-livedot" />
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Live now</h3>
            </span>
            <button onClick={() => navigate('/app/rooms')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--clay)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
              {React.cloneElement(I.shuffle as React.ReactElement<{size?:number}>, { size: 14 })} See all
            </button>
          </div>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', marginBottom: 32, paddingBottom: 4 }}>
            {loading
              ? [1, 2, 3].map(i => <Skeleton key={i} style={{ flex: 'none', width: 220, height: 120, borderRadius: 'var(--radius-lg)' }} />)
              : liveNow.map(r => (
                  <Card key={r.id} onClick={() => navigate(`/app/rooms/${r.id}/live`)} pad={14} style={{ flex: 'none', width: 220 }}>
                    <LiveTag>Live</LiveTag>
                    <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.25, margin: '12px 0 14px', minHeight: 38 }}>{r.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={r.company ?? 'Host'} size={26} tone="clay" />
                      <Meta>{r.attendees} listening</Meta>
                    </div>
                  </Card>
                ))}
          </div>
        </>
      )}

      {/* Upcoming */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>Up next for you</h3>
        <button onClick={() => navigate('/app/rooms')} style={{ fontSize: 13, color: 'var(--clay)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>See all</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
        {loading
          ? [1, 2, 3].map(i => <Skeleton key={i} style={{ height: 72, borderRadius: 'var(--radius-lg)' }} />)
          : upcoming.length === 0
            ? <p style={{ color: 'var(--ink-mute)', fontSize: 14, padding: '12px 0' }}>No upcoming rooms scheduled.</p>
            : upcoming.slice(0, 3).map(r => (
                <Card key={r.id} onClick={() => navigate(`/app/rooms/${r.id}`)} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <Avatar name={r.company ?? r.title} size={44} tone="clay" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2, marginBottom: 4 }}>{r.title}</p>
                    <Meta>{r.company ?? r.category}</Meta>
                  </div>
                  <div style={{ textAlign: 'right' as const, flex: 'none' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--clay)' }}>{fmtTime(r.startsAt)}</p>
                    <Meta>{r.attendees} going</Meta>
                  </div>
                </Card>
              ))}
      </div>

      {/* Stats bar — real profile stats */}
      {profile && (
        <div style={{ display: 'flex', gap: 24, padding: '20px 24px', borderRadius: 'var(--radius-lg)', background: 'var(--paper)', border: '1px solid var(--line)' }}>
          {[
            { label: 'Rooms attended', value: '-' },
            { label: 'Warm intros', value: '-' },
            { label: 'Referrals', value: '-' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' as const, flex: 1 }}>
              <p style={{ fontFamily: 'var(--display)', fontSize: 30, lineHeight: 1 }}>{s.value}</p>
              <Meta style={{ display: 'block', marginTop: 4 }}>{s.label}</Meta>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
