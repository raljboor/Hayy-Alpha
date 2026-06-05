import React from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, Btn, Card, Meta, LiveTag } from '@/shared/primitives';

const roles = [
  {
    title: 'Product Manager, Developer Tools',
    company: 'Amazon', companyTone: 'clay' as const,
    type: 'Full time', level: 'Mid-level', location: 'Toronto / Remote',
    wayIn: { room: 'Breaking into Product at Big Tech', host: 'Maya Nasrallah', tone: 'clay' as const, live: true },
  },
  {
    title: 'Senior Product Designer',
    company: 'Figma', companyTone: 'sand' as const,
    type: 'Full time', level: 'Senior', location: 'San Francisco / Remote',
    wayIn: { room: 'Design portfolios that get callbacks', host: 'Layla Park', tone: 'sand' as const, live: false },
  },
  {
    title: 'Associate Product Manager',
    company: 'Shopify', companyTone: 'olive' as const,
    type: 'Full time', level: 'Entry / APM', location: 'Ottawa / Remote',
    wayIn: { room: 'How to get an APM role in Canada', host: 'Hana Yusuf', tone: 'clay' as const, live: false },
  },
  {
    title: 'Data Analyst → PM track',
    company: 'RBC', companyTone: 'dark' as const,
    type: 'Full time', level: 'Mid-level', location: 'Toronto',
    wayIn: { room: 'Product, Data & Software careers at RBC', host: 'Omar Aziz', tone: 'olive' as const, live: true },
  },
];

export default function RolesBoard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px 44px', maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Web only</p>
        <h1 style={{ fontSize: 40, marginTop: 6 }}>Roles</h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginTop: 8 }}>
          Every listing has a <em style={{ fontFamily: 'var(--display)', fontStyle: 'italic', color: 'var(--clay)' }}>way in</em> — the room and people who can get you there.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {roles.map((r, i) => (
          <Card key={i} style={{ overflow: 'hidden' }}>
            {/* Role info */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Avatar name={r.company[0]} size={36} tone={r.companyTone} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{r.company}</p>
                    <Meta>{r.location}</Meta>
                  </div>
                </div>
                <h3 style={{ fontSize: 20, lineHeight: 1.2, marginBottom: 10 }}>{r.title}</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="hy-pill">{r.type}</span>
                  <span className="hy-pill">{r.level}</span>
                </div>
              </div>
              <Btn kind="primary" iconRight={React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 15 })}>Apply via Hayy</Btn>
            </div>

            {/* Way in */}
            <div style={{
              padding: '14px 16px', borderRadius: 14, marginTop: 4,
              background: 'color-mix(in oklab, var(--clay) 7%, var(--paper))',
              border: '1px solid color-mix(in oklab, var(--clay) 16%, var(--line))',
            }}>
              <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                Your way in
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={r.wayIn.host} size={38} tone={r.wayIn.tone} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{r.wayIn.host}</p>
                    <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{r.wayIn.room}</p>
                  </div>
                </div>
                {r.wayIn.live
                  ? <Btn kind="primary" icon={React.cloneElement(I.mic as React.ReactElement<{size?:number}>, { size: 15 })} onClick={() => navigate('/app/rooms/r04/live')}>Join live room</Btn>
                  : <Btn kind="soft" onClick={() => navigate('/app/rooms')}>Reserve a seat</Btn>
                }
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
