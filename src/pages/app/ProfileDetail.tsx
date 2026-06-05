import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I, Avatar, Btn, Card, Meta, Pill, RoundBtn, Skeleton } from '@/shared/primitives';
import { getProfile } from '@/lib/api/profiles';
import type { UserProfile } from '@/types/models';

export default function ProfileDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProfile(id)
      .then(p => {
        if (!p) setNotFound(true);
        else setProfile(p);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '32px 44px', maxWidth: 720 }}>
        <Skeleton style={{ width: 40, height: 40, borderRadius: '50%', marginBottom: 24 }} />
        <Skeleton style={{ height: 160, borderRadius: 'var(--radius-lg)', marginBottom: 16 }} />
        <Skeleton style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div style={{ padding: '32px 44px', maxWidth: 720 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clay)', fontWeight: 600, fontSize: 14 }}>← Back</button>
        <p style={{ marginTop: 32, color: 'var(--ink-soft)', fontSize: 16 }}>Profile not found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 44px', maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <RoundBtn icon={React.cloneElement(I.chevL as React.ReactElement<{size?:number}>, { size: 18 })} onClick={() => navigate(-1)} />
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <Avatar name={profile.full_name ?? '?'} size={68} tone="clay" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' as const }}>
              <h2 style={{ fontSize: 22 }}>{profile.full_name}</h2>
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
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Btn kind="primary" style={{ flex: 1, justifyContent: 'center' }}>Request intro</Btn>
          <Btn kind="soft">Follow</Btn>
        </div>
      </Card>

      {profile.bio && (
        <Card style={{ marginBottom: 14 }}>
          <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>About</p>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{profile.bio}</p>
        </Card>
      )}

      {(profile.target_roles?.length ?? 0) > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Looking for</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
            {profile.target_roles!.map((t, i) => <Pill key={i} kind="topic">{t}</Pill>)}
          </div>
        </Card>
      )}

      {(profile.skills?.length ?? 0) > 0 && (
        <Card>
          <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Skills</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
            {profile.skills!.map((s, i) => <Pill key={i} kind="topic">{s}</Pill>)}
          </div>
        </Card>
      )}
    </div>
  );
}
