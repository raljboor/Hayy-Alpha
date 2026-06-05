import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, Btn, Card, Meta, Pill, RoundBtn, Skeleton } from '@/shared/primitives';
import { useAuthContext } from '@/context/AuthContext';
import { getSuggestedProfiles, type SuggestedProfile } from '@/lib/api/profiles';

export default function Profile() {
  const navigate = useNavigate();
  const { profile, userId } = useAuthContext();
  const [suggested, setSuggested] = useState<SuggestedProfile[]>([]);

  useEffect(() => {
    if (!userId) return;
    getSuggestedProfiles({
      interests: profile?.target_roles ?? profile?.skills ?? [],
      selfId: userId,
      limit: 2,
    })
      .then(setSuggested)
      .catch(() => setSuggested([]));
  }, [userId, profile]);

  if (!profile) {
    return (
      <div style={{ padding: '32px 44px', maxWidth: 720 }}>
        <Skeleton style={{ height: 160, borderRadius: 'var(--radius-lg)', marginBottom: 16 }} />
        <Skeleton style={{ height: 100, borderRadius: 'var(--radius-lg)', marginBottom: 16 }} />
        <Skeleton style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  const displayName = profile.full_name ?? 'You';
  const initials = displayName;
  const lookingFor: string[] = profile.target_roles ?? [];

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
          <Avatar name={initials} size={68} tone="clay" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' as const }}>
              <h2 style={{ fontSize: 22 }}>{displayName}</h2>
              {profile.pronouns && <Meta>{profile.pronouns}</Meta>}
            </div>
            {profile.headline && <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 4 }}>{profile.headline}</p>}
            {profile.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                {React.cloneElement(I.pin as React.ReactElement<{size?:number}>, { size: 13 })}
                <Meta>{profile.location}</Meta>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 0, marginTop: 20, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
          {[
            { value: '—', label: 'rooms' },
            { value: '—', label: 'warm intros' },
            { value: '—', label: 'referrals' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' as const, borderRight: i < 2 ? '1px solid var(--line-soft)' : 'none', padding: '0 8px' }}>
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
      {profile.bio && (
        <Card style={{ marginBottom: 14 }}>
          <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>About</p>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{profile.bio}</p>
        </Card>
      )}

      {/* Looking for */}
      {lookingFor.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Looking for</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
            {lookingFor.map((t, i) => (
              <Pill key={i} kind="topic">{t}</Pill>
            ))}
          </div>
        </Card>
      )}

      {/* Suggested connections */}
      {suggested.length > 0 && (
        <Card>
          <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Suggested — connect with</p>
          {suggested.map((s, i) => (
            <div key={s.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                paddingBottom: i < suggested.length - 1 ? 14 : 0,
                marginBottom: i < suggested.length - 1 ? 14 : 0,
                borderBottom: i < suggested.length - 1 ? '1px solid var(--line-soft)' : 'none',
              }}
              onClick={() => navigate(`/app/profile/${s.id}`)}
            >
              <Avatar name={s.full_name} size={44} tone="clay" />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{s.full_name}</p>
                <p style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{s.headline ?? s.role_type}</p>
              </div>
              {React.cloneElement(I.chevR as React.ReactElement<{size?:number}>, { size: 18, stroke: 1.5 })}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
