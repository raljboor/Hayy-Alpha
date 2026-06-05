import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, LiveTag, Btn, Card, Meta, Stack } from '@/shared/primitives';
import { ROOMS } from '@/shared/data';

const CATS = ['For you', 'Live now', 'Product', 'Engineering', 'Design', 'Data'];

export default function RoomsList() {
  const navigate = useNavigate();
  const [activecat, setActiveCat] = useState('For you');

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
            border: activecat === c ? 'none' : '1px solid var(--line)',
            background: activecat === c ? 'var(--clay)' : 'var(--paper)',
            color: activecat === c ? 'var(--paper)' : 'var(--ink-soft)', cursor: 'pointer',
          }}>{c}</button>
        ))}
      </div>

      {/* Shuffle card */}
      <Card onClick={() => navigate('/app/rooms/r02/live')} style={{
        display: 'flex', alignItems: 'center', gap: 13, marginBottom: 20,
        background: 'color-mix(in oklab, var(--clay) 9%, var(--paper))',
        borderColor: 'color-mix(in oklab, var(--clay) 22%, var(--line))',
      }}>
        <span style={{ width: 42, height: 42, borderRadius: 13, background: 'var(--clay)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          {React.cloneElement(I.shuffle as React.ReactElement<{size?:number}>, { size: 19 })}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14.5, fontWeight: 600 }}>Shuffle me in</p>
          <Meta>9 rooms live · hop until one clicks</Meta>
        </div>
        {React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 18, stroke: 1.6 })}
      </Card>

      {/* Room list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ROOMS.map(r => (
          <Card key={r.id} onClick={() => navigate(r.live ? `/app/rooms/${r.id}/live` : `/app/rooms/${r.id}`)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              {r.live
                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    <LiveTag>Live</LiveTag>
                    {r.justStarted && <Meta>Just started</Meta>}
                  </span>
                : <Meta>{r.time}</Meta>}
              <Stack names={[r.host, 'Adam S', 'Layla P', 'Omar A']} n={r.attendees} />
            </div>
            <h3 style={{ fontSize: 18, lineHeight: 1.15, marginBottom: 14 }}>{r.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Avatar name={r.host} size={30} tone={r.hostTone} />
                <Meta>{r.host} · {r.hostRole}</Meta>
              </div>
              {r.live
                ? <Btn kind="primary" icon={React.cloneElement(I.mic as React.ReactElement<{size?:number}>, { size: 15 })} onClick={e => { e.stopPropagation(); navigate(`/app/rooms/${r.id}/live`); }}>Join</Btn>
                : <Btn kind="soft" onClick={e => e.stopPropagation()}>Remind me</Btn>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
