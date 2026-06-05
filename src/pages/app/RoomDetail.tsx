import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I, Avatar, LiveTag, Btn, Card, Meta, Stack, Waveform, RoundBtn, Skeleton } from '@/shared/primitives';
import { getRoomById } from '@/lib/api/rooms';
import type { Room } from '@/lib/mockData';

function fmtTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    if (diff < 0 && diff > -3 * 60 * 60 * 1000) return 'Live now';
    if (diff > 0 && diff < 24 * 60 * 60 * 1000) return 'Today ' + d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const tom = new Date(now); tom.setDate(tom.getDate() + 1);
    if (d.toDateString() === tom.toDateString()) return 'Tomorrow ' + d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch { return ''; }
}

export default function RoomDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getRoomById(id)
      .then(r => {
        if (!r) setNotFound(true);
        else setRoom(r);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '32px 44px', maxWidth: 760 }}>
        <Skeleton style={{ width: 40, height: 40, borderRadius: '50%', marginBottom: 24 }} />
        <Skeleton style={{ height: 28, width: '60%', borderRadius: 8, marginBottom: 16 }} />
        <Skeleton style={{ height: 44, width: '80%', borderRadius: 8, marginBottom: 12 }} />
        <Skeleton style={{ height: 80, borderRadius: 'var(--radius-md)', marginBottom: 24 }} />
        <Skeleton style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  if (notFound || !room) {
    return (
      <div style={{ padding: '32px 44px', maxWidth: 760 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clay)', fontWeight: 600, fontSize: 14 }}>← Back</button>
        <p style={{ marginTop: 32, color: 'var(--ink-soft)', fontSize: 16 }}>Room not found.</p>
      </div>
    );
  }

  const isLive = room.status === 'live';

  return (
    <div style={{ padding: '32px 44px', maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <RoundBtn icon={React.cloneElement(I.chevL as React.ReactElement<{size?:number}>, { size: 18 })} onClick={() => navigate(-1)} />
        <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.14em', textTransform: 'uppercase' }}>Room detail</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        {isLive
          ? <LiveTag>Live now · {room.attendees} here</LiveTag>
          : <span className="hy-pill">{fmtTime(room.startsAt)}</span>}
      </div>

      <h1 style={{ fontSize: 36, lineHeight: 1.05, marginBottom: 16 }}>{room.title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Avatar name={room.company ?? room.category} size={44} tone="clay" />
        <div>
          <p style={{ fontSize: 16, fontWeight: 600 }}>{room.company ?? room.category}</p>
          <p style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{room.category} · hosting</p>
        </div>
      </div>

      {room.description && (
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 24 }}>{room.description}</p>
      )}

      {/* Waveform preview */}
      <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', background: 'var(--cream)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <Waveform bars={28} height={28} color="var(--clay)" active={isLive} />
        <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
          {isLive ? '"This is exactly the kind of conversation I needed…"' : 'Room starts ' + fmtTime(room.startsAt).toLowerCase()}
        </p>
      </div>

      {/* Tags */}
      {room.tags && room.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 24 }}>
          {room.tags.map((t, i) => (
            <span key={i} className="hy-pill">{t}</span>
          ))}
        </div>
      )}

      {/* Attendees */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <Stack names={['A', 'B', 'C', 'D']} n={room.attendees} />
        <Meta>{room.attendees} going</Meta>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 12 }}>
        {isLive
          ? <Btn kind="primary" size="lg" iconRight={React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 16 })} onClick={() => navigate(`/app/rooms/${room.id}/live`)}>Join live room</Btn>
          : <>
              <Btn kind="primary" size="lg" iconRight={React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 16 })}>Reserve a seat</Btn>
              <Btn kind="soft" size="lg">Add to calendar</Btn>
            </>
        }
      </div>
    </div>
  );
}
