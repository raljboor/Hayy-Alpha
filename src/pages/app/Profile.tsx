import React from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, Btn, Card, Meta, Pill, RoundBtn } from '@/shared/primitives';
import { ME, MAYA } from '@/shared/data';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px 44px', maxWidth: 720 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ fontSize: 36 }}>You</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn kind="soft" icon={React.cloneElement(I.gear as React.ReactElement<{size?:number}>, { size: 16 })} onClick={() => navigate('/app/settings')}>Settings</Btn>
        </div>
      </div>

      {/* Profile card */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <Avatar name={ME.name} size={68} tone={ME.avatarTone} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 22 }}>{ME.name}</h2>
              <Meta>{ME.pronouns}</Meta>
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 4 }}>{ME.headline}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              {React.cloneElement(I.pin as React.ReactElement<{size?:number}>, { size: 13 })}
              <Meta>{ME.location}</Meta>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 0, marginTop: 20, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
          {[
            { value: ME.stats.rooms, label: 'rooms' },
            { value: ME.stats.intros, label: 'warm intros' },
            { value: ME.stats.referrals, label: 'referrals' },
            { value: ME.stats.followers, label: 'followers' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 3 ? '1px solid var(--line-soft)' : 'none', padding: '0 8px' }}>
              <p style={{ fontFamily: 'var(--display)', fontSize: 24, lineHeight: 1 }}>{s.value}</p>
              <Meta style={{ display: 'block', marginTop: 4 }}>{s.label}</Meta>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Btn kind="soft" style={{ flex: 1, justifyContent: 'center' }}>Edit profile</Btn>
          <Btn kind="soft" icon={React.cloneElement(I.link as React.ReactElement<{size?:number}>, { size: 15 })}>Share</Btn>
        </div>
      </Card>

      {/* Bio */}
      <Card style={{ marginBottom: 14 }}>
        <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>About</p>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{ME.bio}</p>
      </Card>

      {/* Looking for */}
      <Card style={{ marginBottom: 14 }}>
        <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Looking for</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ME.lookingFor.map((t, i) => (
            <Pill key={i} kind="topic">{t}</Pill>
          ))}
        </div>
      </Card>

      {/* Experience */}
      <Card style={{ marginBottom: 14 }}>
        <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Experience</p>
        {[
          { title: 'Growth Marketing Lead', company: 'Lumen', period: '2023–Now' },
          { title: 'Marketing Associate',   company: 'Brightwave', period: '2021–23' },
        ].map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i === 0 ? 14 : 0, borderBottom: i === 0 ? '1px solid var(--line-soft)' : 'none', marginBottom: i === 0 ? 14 : 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              {React.cloneElement(I.brief as React.ReactElement<{size?:number}>, { size: 16 })}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{e.title}</p>
              <p style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{e.company} · {e.period}</p>
            </div>
          </div>
        ))}
      </Card>

      {/* Featured profile link */}
      <Card style={{ marginBottom: 0 }}>
        <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Suggested — connect with</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/app/profile/maya')}>
          <Avatar name={MAYA.name} size={44} tone={MAYA.avatarTone} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{MAYA.name}</p>
            <p style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{MAYA.headline}</p>
          </div>
          {React.cloneElement(I.chevR as React.ReactElement<{size?:number}>, { size: 18, stroke: 1.5 })}
        </div>
      </Card>
    </div>
  );
}
