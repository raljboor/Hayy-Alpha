import { cloneElement } from 'react';
import { DrillScreen, Wash } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Card, Meta } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const invited = [
  { n: 'Dana Liu', s: 'Joined', tone: 'clay' },
  { n: 'Tom Reyes', s: 'Invited', tone: 'dark' },
];

export default function InviteFriendsScreen() {
  return (
    <DrillScreen title="Invite friends" eyebrow="" wash>
      {/* Hero */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 24, marginBottom: 28 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 22,
          background: 'color-mix(in oklab, var(--clay) 14%, var(--paper))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--clay)', marginBottom: 16,
          border: '1px solid color-mix(in oklab, var(--clay) 20%, transparent)',
        }}>
          {cloneElement(I.shake as React.ReactElement, { size: 32 })}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Bring someone in</h2>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', maxWidth: 260, lineHeight: 1.5 }}>
          Hayy grows through people who actually give a damn about each other's careers.
        </p>
      </div>

      {/* Invite link */}
      <Card style={{ marginBottom: 12, border: '1.5px dashed var(--clay)' }}>
        <Meta>YOUR INVITE LINK</Meta>
        <p style={{ fontSize: 16, fontWeight: 600, marginTop: 6, marginBottom: 12 }}>hayy.app/adam</p>
        <Btn kind="soft">Copy</Btn>
      </Card>

      <Btn kind="primary" style={{ width: '100%', marginBottom: 28 }}>Share invite</Btn>

      {/* You've invited */}
      <p className="mono" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 10 }}>
        YOU'VE INVITED
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 32 }}>
        {invited.map((p) => (
          <div key={p.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
            <Avatar name={p.n} size={40} tone={p.tone} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 15 }}>{p.n}</p>
            </div>
            <span style={{
              fontSize: 13, fontWeight: 600,
              color: p.s === 'Joined' ? '#3fb98a' : 'var(--ink-mute)',
            }}>
              {p.s}
            </span>
          </div>
        ))}
      </div>
    </DrillScreen>
  );
}
