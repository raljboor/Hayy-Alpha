import { cloneElement } from 'react';
import { DrillScreen } from '@/components/hayy/AppShell';
import { I, Avatar, Btn, Card, Field, HayyInput } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const skills = ['Product strategy', 'Growth', 'SQL', 'User research'];
const interests = ['Product', 'Fintech', 'New grad'];

const expRows = [
  { mono: 'LU', tone: 'clay', title: 'Growth Marketing Lead', sub: 'Lumen · 2023 — Now' },
  { mono: 'BR', tone: 'olive', title: 'Marketing Associate', sub: 'Brightwave · 2021 — 2023' },
];

export default function EditProfileScreen() {
  return (
    <DrillScreen
      title="Edit profile"
      eyebrow=""
      action={<span style={{ fontSize: 15, fontWeight: 600, color: 'var(--clay)' }}>Save</span>}
    >
      {/* Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28, marginTop: 8 }}>
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <Avatar name="Adam Saleh" size={88} tone="clay" />
          <span style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 28, height: 28, borderRadius: 999,
            background: 'var(--clay)', color: 'var(--paper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg)',
          }}>
            {cloneElement(I.plus as React.ReactElement, { size: 14 })}
          </span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--clay)' }}>Change photo</span>
      </div>

      {/* Basic fields */}
      <Field label="Name">
        <HayyInput value="Adam Saleh" />
      </Field>
      <Field label="Headline">
        <HayyInput value="Aspiring PM · ex-Growth" />
      </Field>
      <Field label="About">
        <div style={{
          padding: '12px 16px', borderRadius: 14, background: 'var(--paper)',
          border: '1px solid var(--line)', fontSize: 15, color: 'var(--ink)',
          minHeight: 90, lineHeight: 1.55,
        }}>
          2 years in growth marketing — now making the leap into product. I care about how people find jobs, grow in their careers, and the systems that make or break that.
        </div>
      </Field>

      {/* Experience */}
      <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 8, letterSpacing: '.01em' }}>Experience</p>
      <Card pad={0} style={{ marginBottom: 16, overflow: 'hidden' }}>
        {expRows.map((row, i) => (
          <div key={row.mono} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
            borderBottom: i < expRows.length - 1 ? '1px solid var(--line)' : 'none',
          }}>
            <span style={{
              width: 36, height: 36, borderRadius: 10, flex: 'none',
              background: `color-mix(in oklab, var(--${row.tone}) 16%, var(--paper))`,
              color: `var(--${row.tone})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
            }}>{row.mono}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{row.title}</p>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{row.sub}</p>
            </div>
            {cloneElement(I.arrow as React.ReactElement, { size: 16 })}
          </div>
        ))}
        <button style={{
          width: '100%', padding: '14px 16px', border: 'none', background: 'none',
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          borderTop: '1.5px dashed color-mix(in oklab, var(--clay) 30%, var(--line))',
          color: 'var(--clay)', fontWeight: 600, fontSize: 14,
        }}>
          {cloneElement(I.plus as React.ReactElement, { size: 16 })}
          Add experience
        </button>
      </Card>

      {/* Education */}
      <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 8, letterSpacing: '.01em' }}>Education</p>
      <Card pad={0} style={{ marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
          <span style={{
            width: 36, height: 36, borderRadius: 10, flex: 'none',
            background: 'color-mix(in oklab, var(--dark) 16%, var(--paper))',
            color: 'var(--dark)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700,
          }}>UT</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14 }}>BCom, Marketing</p>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>University of Toronto · 2017 — 2021</p>
          </div>
        </div>
        <button style={{
          width: '100%', padding: '14px 16px', border: 'none', background: 'none',
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          borderTop: '1.5px dashed color-mix(in oklab, var(--clay) 30%, var(--line))',
          color: 'var(--clay)', fontWeight: 600, fontSize: 14,
        }}>
          {cloneElement(I.plus as React.ReactElement, { size: 16 })}
          Add education
        </button>
      </Card>

      {/* Skills */}
      <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 8, letterSpacing: '.01em' }}>Skills</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {skills.map((s) => (
          <span key={s} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 999,
            background: 'var(--paper)', border: '1px solid var(--line)',
            fontSize: 13, fontWeight: 500,
          }}>
            {s}
            {cloneElement(I.closed as React.ReactElement, { size: 13 })}
          </span>
        ))}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 12px', borderRadius: 999,
          border: '1.5px dashed color-mix(in oklab, var(--clay) 40%, var(--line))',
          fontSize: 13, fontWeight: 600, color: 'var(--clay)', cursor: 'pointer',
        }}>
          {cloneElement(I.plus as React.ReactElement, { size: 13 })}
          Add
        </span>
      </div>

      {/* Interests */}
      <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 8, letterSpacing: '.01em' }}>Interests</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
        {interests.map((s) => (
          <span key={s} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 999,
            background: 'var(--paper)', border: '1px solid var(--line)',
            fontSize: 13, fontWeight: 500,
          }}>
            {s}
            {cloneElement(I.closed as React.ReactElement, { size: 13 })}
          </span>
        ))}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 12px', borderRadius: 999,
          border: '1.5px dashed color-mix(in oklab, var(--clay) 40%, var(--line))',
          fontSize: 13, fontWeight: 600, color: 'var(--clay)', cursor: 'pointer',
        }}>
          {cloneElement(I.plus as React.ReactElement, { size: 13 })}
          Add
        </span>
      </div>
    </DrillScreen>
  );
}
