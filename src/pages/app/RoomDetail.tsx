import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I, Avatar, LiveTag, Btn, Card, Meta, Stack, Waveform, RoundBtn } from '@/shared/primitives';
import { ROOMS, PEOPLE } from '@/shared/data';

export default function RoomDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const room = ROOMS.find(r => r.id === id) ?? ROOMS.find(r => r.id === 'r04')!;

  const speakers = [
    { name: 'Maya Nasrallah', role: 'Host · Sr PM, AWS', tone: 'clay' as const },
    { name: 'Rashid Khoury',  role: 'Eng Mgr · Amazon', tone: 'dark' as const },
    { name: 'Jenna Sun',      role: 'Talent · Shopify',  tone: 'olive' as const },
  ];

  return (
    <div style={{ padding: '32px 44px', maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <RoundBtn icon={React.cloneElement(I.chevL as React.ReactElement<{size?:number}>, { size: 18 })} onClick={() => navigate(-1)} />
        <div>
          <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.14em', textTransform: 'uppercase' }}>Room detail</p>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        {room.live ? <LiveTag>Live now · {room.attendees} here</LiveTag> : (
          <span className="hy-pill">
            {React.cloneElement(I.cal as React.ReactElement<{size?:number}>, { size: 12 })} {room.time}
          </span>
        )}
      </div>

      <h1 style={{ fontSize: 36, lineHeight: 1.05, marginBottom: 16 }}>{room.title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Avatar name={room.host} size={44} tone={room.hostTone} />
        <div>
          <p style={{ fontSize: 16, fontWeight: 600 }}>{room.host}</p>
          <p style={{ fontSize: 13, color: 'var(--ink-mute)' }}>Sr PM · {room.hostRole} · hosting</p>
        </div>
      </div>

      {/* Waveform preview */}
      <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', background: 'var(--cream)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <Waveform bars={28} height={28} color="var(--clay)" active={room.live} />
        <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
          {room.live ? '"This is exactly the kind of conversation I needed…"' : 'Room starts ' + room.time.toLowerCase()}
        </p>
      </div>

      {/* Speakers */}
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>On stage</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {speakers.map((s, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={s.name} size={44} tone={s.tone} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</p>
              <p style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{s.role}</p>
            </div>
            {i === 0 && (
              <span style={{ padding: '4px 10px', borderRadius: 999, background: 'color-mix(in oklab, var(--clay) 12%, var(--paper))', color: 'var(--clay)', fontSize: 11, fontWeight: 600 }}>Host</span>
            )}
          </Card>
        ))}
      </div>

      {/* Attendees */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <Stack names={['Adam S', 'Layla P', 'Omar A', 'Diego R']} n={room.attendees} />
        <Meta>{room.attendees} going</Meta>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 12 }}>
        {room.live
          ? <Btn kind="primary" size="lg" iconRight={React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 16 })} onClick={() => navigate(`/app/rooms/${room.id}/live`)}>Join live room</Btn>
          : <>
              <Btn kind="primary" size="lg" iconRight={React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 16 })} onClick={() => navigate('/app/rooms/green')}>Reserve a seat</Btn>
              <Btn kind="soft" size="lg">Add to calendar</Btn>
            </>
        }
      </div>
    </div>
  );
}
