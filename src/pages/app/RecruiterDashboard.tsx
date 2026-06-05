import React from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, Btn, Card, Meta } from '@/shared/primitives';

export default function RecruiterDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px 44px', maxWidth: 760 }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>Recruiter dashboard</h1>
      <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 28 }}>Post roles, connect with candidates through rooms.</p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
        <Btn kind="primary" icon={React.cloneElement(I.plus as React.ReactElement<{size?:number}>, { size: 16 })}>Post a role</Btn>
        <Btn kind="soft" icon={React.cloneElement(I.mic as React.ReactElement<{size?:number}>, { size: 16 })} onClick={() => navigate('/app/host')}>Host a room</Btn>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 16 }}>Active roles</p>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>No active roles yet. Post a role to get started.</p>
      </Card>
    </div>
  );
}
