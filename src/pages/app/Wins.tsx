import { cloneElement } from 'react';
import { DrillScreen, RoundBtn } from '@/components/hayy/AppShell';
import { I, Icon, Avatar, Btn, Card, Meta } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const STAGES = ['Applied', 'Recruiter screen', 'Interviews', 'Final round', 'Offer', 'Decision'];

export default function WinsScreen() {
  const { go } = useNav();

  const wins = [
    { who: 'Omar Aziz', role: 'Data → PM · RBC', t: 'clay', note: 'Came back to host', iconKey: 'mic' },
    { who: 'Sara Mahmoud', role: 'PM · Shopify', t: 'olive', note: 'Got the offer', iconKey: 'spark' },
    { who: 'Dana Liu', role: 'Design · Figma', t: 'sand', note: 'Final round', iconKey: 'bolt' },
  ];

  return (
    <DrillScreen
      title="Your journey"
      eyebrow="OUTCOMES"
      footer={
        <Btn kind="primary" onClick={() => go('updateOutcome')}>Update a pursuit</Btn>
      }
    >
      {/* Stats card */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          {[['2', 'PURSUITS'], ['4', 'INTERVIEWS'], ['1', 'FINAL ROUND']].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 32, color: 'var(--clay)', lineHeight: 1 }}>{num}</div>
              <Meta>{label}</Meta>
            </div>
          ))}
        </div>
      </Card>

      {/* IN MOTION */}
      <p className="mono" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 10 }}>
        IN MOTION
      </p>

      {/* Maya card */}
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Avatar name="Maya Nasrallah" size={40} tone="clay" />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: 15 }}>Product Manager · AWS</p>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>via Maya Nasrallah</p>
          </div>
          <span style={{ background: 'color-mix(in oklab, var(--clay) 14%, var(--paper))', color: 'var(--clay)', fontSize: 10, fontWeight: 700, letterSpacing: '.1em', padding: '4px 8px', borderRadius: 8 }}>
            FINAL ROUND
          </span>
        </div>

        {/* Outcome stepper */}
        <div style={{ marginBottom: 14 }}>
          {STAGES.map((stage, i) => {
            const done = i < 3;
            return (
              <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{
                  width: 10, height: 10, borderRadius: 999, flex: 'none',
                  background: done ? 'var(--clay)' : 'var(--line)',
                  border: done ? 'none' : '1.5px solid var(--ink-mute)',
                }} />
                <span style={{ fontSize: 13, color: done ? 'var(--ink)' : 'var(--ink-mute)', fontWeight: done ? 500 : 400 }}>
                  {stage}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Btn kind="primary" onClick={() => go('updateOutcome')}>Update status</Btn>
          <Btn kind="soft" icon={cloneElement(I.msg as React.ReactElement, { size: 16 })} onClick={() => go('thread')}>
            Message Maya
          </Btn>
        </div>
      </Card>

      {/* Layla card */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name="Layla Park" size={40} tone="olive" />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: 15 }}>APM · Figma</p>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>via Layla Park · Interviewing</p>
          </div>
          <Btn kind="soft" onClick={() => go('updateOutcome')}>Update</Btn>
        </div>
      </Card>

      {/* WINS THIS WEEK */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <p className="mono" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
          WINS THIS WEEK
        </p>
        <Meta>61 intros · 23 hires</Meta>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 32 }}>
        {wins.map((w) => (
          <Card key={w.who}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <Avatar name={w.who} size={44} tone={w.t} />
                <span style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 20, height: 20, borderRadius: 999,
                  background: 'color-mix(in oklab, var(--clay) 16%, var(--paper))',
                  border: '1.5px solid var(--paper)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--clay)',
                }}>
                  {cloneElement(I[w.iconKey] as React.ReactElement, { size: 11 })}
                </span>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{w.who}</p>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{w.role}</p>
                <p style={{ fontSize: 12, color: 'var(--clay)', marginTop: 2 }}>{w.note}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DrillScreen>
  );
}
