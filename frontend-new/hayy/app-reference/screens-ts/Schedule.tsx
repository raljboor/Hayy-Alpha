import { useState, cloneElement } from 'react';
import { DrillScreen } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Card, Meta, Field, HayyInput } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

export default function Schedule() {
  const nav = useNav();
  const [when, setWhen] = useState<'now' | 'later'>('now');
  const now = when === 'now';

  return (
    <DrillScreen
      title="Start a room"
      eyebrow="HOST"
      footer={
        now
          ? <Btn kind="primary" size="xl" icon={I.mic} onClick={() => nav.go('hostRoom')} style={{ width: '100%', justifyContent: 'center' }}>Go live now</Btn>
          : <Btn kind="primary" size="xl" iconRight={I.arrow} onClick={() => nav.go('scheduled')} style={{ width: '100%', justifyContent: 'center' }}>Schedule room</Btn>
      }
    >
      <div style={{ paddingTop: 10, paddingBottom: 12 }}>
        <div style={{ display: 'flex', gap: 0, marginBottom: 20, background: 'var(--cream)', borderRadius: 12, padding: 3 }}>
          {([['now', 'Start now'], ['later', 'Schedule']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setWhen(v)} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'var(--sans)', background: when === v ? 'var(--paper)' : 'transparent', color: when === v ? 'var(--ink)' : 'var(--ink-soft)', boxShadow: when === v ? 'var(--shadow-soft)' : 'none' }}>{l}</button>
          ))}
        </div>

        <Field label="Title"><HayyInput big placeholder="What's the conversation?" /></Field>
        <Field label="Topic">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Product', 'Engineering', 'Design', 'Data', 'Recruiting'].map((t, i) => (
              <span key={t} className="hy-pill" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 13, background: i === 0 ? 'var(--clay)' : 'var(--paper)', color: i === 0 ? 'var(--paper)' : 'var(--ink-soft)', border: i === 0 ? 'none' : '1px solid var(--line)' }}>{t}</span>
            ))}
          </div>
        </Field>

        {now ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 16px', borderRadius: 14, background: 'color-mix(in oklab, var(--clay) 8%, var(--paper))', border: '1px solid color-mix(in oklab, var(--clay) 22%, var(--line))', marginBottom: 16 }}>
            <span className="hy-livedot" />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600 }}>Opens the moment you go live</p>
              <Meta>Followers get pinged it just started</Meta>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}><Field label="Date"><HayyInput value="Tonight" /></Field></div>
            <div style={{ flex: 1 }}><Field label="Time"><HayyInput value="7:00 PM" /></Field></div>
          </div>
        )}

        <Field label="Co-hosts">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {['Rashid K', 'Jenna S'].map((n, i) => (
              <Avatar key={i} name={n} size={38} tone={['dark', 'olive'][i]} />
            ))}
            <span style={{ width: 38, height: 38, borderRadius: 999, border: '1.5px dashed var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-mute)' }}>
              {cloneElement(I.plus as React.ReactElement, { size: 16 })}
            </span>
          </div>
        </Field>
      </div>
    </DrillScreen>
  );
}
