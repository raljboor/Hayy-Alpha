import React from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, LiveTag, Btn, Card, Meta, RoundBtn } from '@/shared/primitives';
import { ME, LIVE_NOW, UPCOMING, FEATURED_ROOM } from '@/shared/data';

const peopleToMeet = [
  { name: 'Jenna Sun',     role: 'Talent · Shopify',    tone: 'olive' as const },
  { name: 'Rashid Khoury', role: 'Eng Mgr · Amazon',    tone: 'dark'  as const },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px 44px', maxWidth: 900 }}>
      {/* Greeting */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <p className="mono" style={{ fontSize: 11, letterSpacing: '.12em', color: 'var(--clay)', textTransform: 'uppercase' }}>
            Tuesday · May 31
          </p>
          <h1 style={{ fontSize: 44, marginTop: 6 }}>
            Evening, <span className="display-italic">Adam.</span>
          </h1>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 16 }}>
            One room is calling your name today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <RoundBtn icon={React.cloneElement(I.bell as React.ReactElement<{size?:number}>, { size: 18 })} badge onClick={() => navigate('/app/notifications')} />
          <RoundBtn icon={React.cloneElement(I.search as React.ReactElement<{size?:number}>, { size: 18 })} onClick={() => navigate('/app/search')} />
        </div>
      </div>

      {/* Featured room hero */}
      <div className="hy-card" style={{
        padding: 26, borderRadius: 'var(--radius-xl)', marginBottom: 32,
        background: 'linear-gradient(135deg, var(--paper), var(--cream))',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <LiveTag>Tonight · 7:00 PM</LiveTag>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>ROOM 04</span>
        </div>
        <h2 style={{ fontSize: 30, lineHeight: 1.05, marginBottom: 10 }}>{FEATURED_ROOM.title}</h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 18 }}>
          Hosted by Maya N. · 3 referral hosts on stage · Match: 92%
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <Btn kind="primary" iconRight={React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 16 })} onClick={() => navigate('/app/rooms/r04')}>Join the room</Btn>
          <Btn kind="ghost">Remind me</Btn>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { n: 'Maya N.', r: 'Sr PM, AWS', tone: 'clay' as const },
            { n: 'Rashid K.', r: 'Eng Mgr', tone: 'dark' as const },
            { n: 'Jenna S.', r: 'Recruiter', tone: 'sand' as const },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 12, background: 'var(--paper)', border: '1px solid var(--line)' }}>
              <Avatar name={p.n} size={32} tone={p.tone} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{p.n}</p>
                <p style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{p.r}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live now strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span className="hy-livedot" />
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Live now</h3>
        </span>
        <button onClick={() => navigate('/app/rooms/r02/live')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--clay)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
          {React.cloneElement(I.shuffle as React.ReactElement<{size?:number}>, { size: 14 })} Shuffle
        </button>
      </div>
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', marginBottom: 32, paddingBottom: 4 }}>
        {LIVE_NOW.map(r => (
          <Card key={r.id} onClick={() => navigate(`/app/rooms/${r.id}/live`)} pad={14} style={{ flex: 'none', width: 220 }}>
            <LiveTag>Live</LiveTag>
            <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.25, margin: '12px 0 14px', minHeight: 38 }}>{r.title}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar name={r.host} size={26} tone={r.hostTone} />
              <Meta>{r.attendees} listening</Meta>
            </div>
          </Card>
        ))}
      </div>

      {/* Upcoming */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>Up next for you</h3>
        <button onClick={() => navigate('/app/rooms')} style={{ fontSize: 13, color: 'var(--clay)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>See all</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
        {UPCOMING.slice(0, 3).map(r => (
          <Card key={r.id} onClick={() => navigate(`/app/rooms/${r.id}`)} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar name={r.host} size={44} tone={r.hostTone} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2, marginBottom: 4 }}>{r.title}</p>
              <Meta>{r.host} · {r.hostRole}</Meta>
            </div>
            <div style={{ textAlign: 'right', flex: 'none' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--clay)' }}>{r.time}</p>
              <Meta>{r.attendees} going</Meta>
            </div>
          </Card>
        ))}
      </div>

      {/* People to meet */}
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>People to meet</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 36 }}>
        {peopleToMeet.map((p, i) => (
          <div key={i} onClick={() => navigate('/app/profile/maya')} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', cursor: 'pointer',
            borderBottom: i < peopleToMeet.length - 1 ? '1px solid var(--line-soft)' : 'none',
          }}>
            <Avatar name={p.name} size={44} tone={p.tone} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</p>
              <Meta>{p.role}</Meta>
            </div>
            <Btn kind="soft" onClick={e => e.stopPropagation()}>Follow</Btn>
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 24, padding: '20px 24px', borderRadius: 'var(--radius-lg)', background: 'var(--paper)', border: '1px solid var(--line)' }}>
        {[
          { label: 'Rooms attended', value: ME.stats.rooms },
          { label: 'Warm intros', value: ME.stats.intros },
          { label: 'Referrals', value: ME.stats.referrals },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ fontFamily: 'var(--display)', fontSize: 30, lineHeight: 1 }}>{s.value}</p>
            <Meta style={{ display: 'block', marginTop: 4 }}>{s.label}</Meta>
          </div>
        ))}
      </div>
    </div>
  );
}
