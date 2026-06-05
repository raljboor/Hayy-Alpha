import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, LiveTag, Btn, Card, Meta, Stack, Skeleton } from '@/shared/primitives';
import { getRooms } from '@/lib/api/rooms';
import type { Room } from '@/lib/mockData';

const CATS = ['All', 'Live now', 'Product', 'Engineering', 'Design', 'Data'];

function fmtTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    if (diff < 0 && diff > -3 * 60 * 60 * 1000) return 'Live';
    if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
      return 'Today ' + d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    const tom = new Date(now); tom.setDate(tom.getDate() + 1);
    if (d.toDateString() === tom.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  } catch { return ''; }
}

export default function RoomsList() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('All');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRooms()
      .then(setRooms)
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = rooms.filter(r => {
    if (activeCat === 'All') return true;
    if (activeCat === 'Live now') return r.status === 'live';
    return r.category?.toLowerCase() === activeCat.toLowerCase();
  });

  const firstLive = rooms.find(r => r.status === 'live');

  return (
    <div style={{ padding: '32px 44px', maxWidth: 840 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p className="mono" style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--clay)', textTransform: 'uppercase' }}>Discover</p>
          <h1 style={{ fontSize: 40, marginTop: 6 }}>Rooms</h1>
        </div>
        <button onClick={() => navigate('/app/host')} className="hy-btn hy-btn-soft">
          {React.cloneElement(I.plus as React.ReactElement<{size?:number;stroke?:number}>, { size: 16, stroke: 2 })} Start a room
        </button>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 4 }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{
            flex: 'none', padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
            border: activeCat === c ? 'none' : '1px solid var(--line)',
            background: activeCat === c ? 'var(--clay)' : 'var(--paper)',
            color: activeCat === c ? 'var(--paper)' : 'var(--ink-soft)', cursor: 'pointer',
          }}>{c}</button>
        ))}
      </div>

      {/* Shuffle card */}
      {firstLive && (
        <Card onClick={() => navigate(`/app/rooms/${firstLive.id}/live`)} style={{
          display: 'flex', alignItems: 'center', gap: 13, marginBottom: 20,
          background: 'color-mix(in oklab, var(--clay) 9%, var(--paper))',
          borderColor: 'color-mix(in oklab, var(--clay) 22%, var(--line))',
        }}>
          <span style={{ width: 42, height: 42, borderRadius: 13, background: 'var(--clay)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            {React.cloneElement(I.shuffle as React.ReactElement<{size?:number}>, { size: 19 })}
          </span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14.5, fontWeight: 600 }}>Shuffle me in</p>
            <Meta>{rooms.filter(r => r.status === 'live').length} rooms live · hop until one clicks</Meta>
          </div>
          {React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 18, stroke: 1.6 })}
        </Card>
      )}

      {/* Room list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {loading
          ? [1, 2, 3, 4].map(i => <Skeleton key={i} style={{ height: 110, borderRadius: 'var(--radius-lg)' }} />)
          : filtered.length === 0
            ? (
              <div style={{ padding: '40px 0', textAlign: 'center' as const }}>
                <p style={{ color: 'var(--ink-mute)', fontSize: 15 }}>No rooms in this category yet.</p>
              </div>
            )
            : filtered.map(r => (
              <Card key={r.id} onClick={() => navigate(r.status === 'live' ? `/app/rooms/${r.id}/live` : `/app/rooms/${r.id}`)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  {r.status === 'live'
                    ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                        <LiveTag>Live</LiveTag>
                      </span>
                    : <Meta>{fmtTime(r.startsAt)}</Meta>}
                  <Stack names={['A', 'B', 'C', 'D']} n={r.attendees} />
                </div>
                <h3 style={{ fontSize: 18, lineHeight: 1.15, marginBottom: 14 }}>{r.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <Avatar name={r.company ?? r.category} size={30} tone="clay" />
                    <Meta>{r.company ?? r.category}</Meta>
                  </div>
                  {r.status === 'live'
                    ? <Btn kind="primary" icon={React.cloneElement(I.mic as React.ReactElement<{size?:number}>, { size: 15 })} onClick={e => { e.stopPropagation(); navigate(`/app/rooms/${r.id}/live`); }}>Join</Btn>
                    : <Btn kind="soft" onClick={e => e.stopPropagation()}>Remind me</Btn>}
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
}
