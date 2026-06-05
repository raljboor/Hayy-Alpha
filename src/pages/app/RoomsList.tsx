import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, LiveTag, Btn, Skeleton } from '@/shared/primitives';
import { getRooms } from '@/lib/api/rooms';
import type { Room } from '@/lib/mockData';

const FILTERS = ['All', 'Tech', 'Operations', 'Finance', 'Newcomers', 'Product', 'Design'];

type DayGroup = { label: string; date: string; items: Room[] };

function groupByDay(rooms: Room[]): DayGroup[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart); tomorrowStart.setDate(todayStart.getDate() + 1);
  const dayAfterStart = new Date(todayStart); dayAfterStart.setDate(todayStart.getDate() + 2);

  const map = new Map<string, DayGroup>();

  const sortedRooms = [...rooms].sort((a, b) => {
    const aIsLive = a.status === 'live' ? 0 : 1;
    const bIsLive = b.status === 'live' ? 0 : 1;
    if (aIsLive !== bIsLive) return aIsLive - bIsLive;
    return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  });

  for (const room of sortedRooms) {
    let d: Date;
    try { d = new Date(room.startsAt); } catch { continue; }
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const key = dayStart.toISOString();

    if (!map.has(key)) {
      const diff = Math.round((dayStart.getTime() - todayStart.getTime()) / (24 * 60 * 60 * 1000));
      let label: string;
      if (room.status === 'live' || diff === 0) {
        label = 'Tonight';
      } else if (diff === 1) {
        label = 'Tomorrow';
      } else if (diff >= 2 && diff <= 6) {
        label = d.toLocaleDateString([], { weekday: 'long' });
      } else {
        label = 'This weekend';
      }
      const date = d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      map.set(key, { label, date, items: [] });
    }
    map.get(key)!.items.push(room);
  }

  return Array.from(map.values());
}

function fmtTime(iso: string, status: string): string {
  if (status === 'live') return 'Now';
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch { return ''; }
}

export default function RoomsList() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRooms().then(setRooms).catch(() => setRooms([])).finally(() => setLoading(false));
  }, []);

  const filtered = rooms.filter(r => {
    if (activeFilter === 'All') return true;
    return r.category?.toLowerCase() === activeFilter.toLowerCase();
  });

  const days = loading ? [] : groupByDay(filtered);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Sticky header */}
      <div style={{
        padding: '28px 48px 20px',
        borderBottom: '1px solid var(--line-soft)',
        display: 'flex', flexDirection: 'column', gap: 16,
        flex: 'none',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' as const, gap: 12 }}>
          <div>
            <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
              The agenda
            </p>
            <h1 style={{ fontSize: 42, marginTop: 6, lineHeight: 1.05 }}>
              What's <span className="display-italic">happening</span> next.
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => navigate('/app/search')} className="hy-btn hy-btn-ghost" style={{ gap: 6 }}>
              {React.cloneElement(I.search as React.ReactElement<{ size?: number }>, { size: 16 })} Search
            </button>
            <button onClick={() => navigate('/app/host')} className="hy-btn hy-btn-soft" style={{ gap: 6 }}>
              {React.cloneElement(I.plus as React.ReactElement<{ size?: number }>, { size: 16 })} Propose a room
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
          {FILTERS.map((f, i) => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: activeFilter === f ? 'var(--ink)' : 'transparent',
              color: activeFilter === f ? 'var(--paper)' : 'var(--ink-soft)',
              border: '1px solid ' + (activeFilter === f ? 'var(--ink)' : 'var(--line)'),
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Scrollable timeline */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 48px 40px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1, 2, 3, 4].map(i => <Skeleton key={i} style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />)}
          </div>
        ) : days.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center' as const }}>
            <p style={{ color: 'var(--ink-mute)', fontSize: 15 }}>No rooms scheduled in this category.</p>
          </div>
        ) : (
          days.map((day, di) => (
            <section key={di} style={{
              display: 'grid', gridTemplateColumns: '180px 1fr', gap: 28,
              paddingTop: 18, paddingBottom: 4,
              borderTop: '1px solid var(--line-soft)',
              marginTop: di === 0 ? 6 : 0,
            }}>
              {/* Date column — sticky */}
              <div style={{ position: 'sticky', top: 0, alignSelf: 'start', paddingTop: 2 }}>
                <h2 style={{ fontSize: 28, lineHeight: 1.1 }}>{day.label}</h2>
                <p className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  {day.date}
                </p>
              </div>

              {/* Items column */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {day.items.map((room, ri) => (
                  <article key={room.id} style={{
                    display: 'grid', gridTemplateColumns: '92px 1fr auto',
                    gap: 20, alignItems: 'center',
                    padding: '18px 0',
                    borderTop: ri === 0 ? '0' : '1px dashed var(--line-soft)',
                  }}>
                    {/* Time + category */}
                    <div>
                      <p className="mono" style={{
                        fontSize: 13, fontWeight: 600, letterSpacing: '.02em',
                        color: room.status === 'live' ? 'var(--clay)' : 'var(--ink)',
                      }}>
                        {fmtTime(room.startsAt, room.status ?? '')}
                      </p>
                      <p className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 3, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                        {room.category}
                      </p>
                    </div>

                    {/* Content */}
                    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
                        {room.status === 'live' && <LiveTag>Live · {room.attendees} here</LiveTag>}
                        <h3 style={{
                          fontFamily: 'var(--display)', fontSize: 22, fontWeight: 500, lineHeight: 1.15,
                        }}>{room.title}</h3>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-soft)', fontSize: 12 }}>
                        <Avatar name={room.company ?? room.category ?? 'Host'} size={22} tone="clay" />
                        <span>
                          {room.company ?? room.category}
                          <span style={{ color: 'var(--ink-mute)' }}> · {room.attendees} going</span>
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div style={{ flex: 'none' }}>
                      {room.status === 'live' ? (
                        <Btn kind="primary"
                          iconRight={React.cloneElement(I.arrow as React.ReactElement<{ size?: number }>, { size: 14 })}
                          onClick={() => navigate(`/app/rooms/${room.id}/live`)}>
                          Join now
                        </Btn>
                      ) : (
                        <Btn kind="soft" onClick={() => navigate(`/app/rooms/${room.id}`)}>
                          RSVP
                        </Btn>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
