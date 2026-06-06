import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, Btn, Pill } from '@/shared/primitives';
import { useAuthContext } from '@/context/AuthContext';
import { createRoom } from '@/lib/api/rooms';

const FORMAT_OPTS = [
  { l: 'Open audio', d: 'Anyone can speak' },
  { l: 'Hosted Q&A', d: 'Hands raised only' },
  { l: 'Closed circle', d: 'RSVP-only' },
];

const TAG_OPTS = ['Newcomers', 'Tech', 'Product', 'MENA community', 'Toronto', 'Operations', 'Design', 'Finance'];

const COHOST_SUGGESTIONS: { n: string; tone: 'clay' | 'olive' | 'sand' | 'dark' }[] = [
  { n: 'Rashid K.', tone: 'olive' },
  { n: 'Maya N.', tone: 'clay' },
];

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{label}</span>
    {children}
    {hint && <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{hint}</span>}
  </label>
);

export default function HostDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [formatIdx, setFormatIdx] = useState(0);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>(['Newcomers', 'Tech']);
  const [saving, setSaving] = useState(false);

  const toggleTag = (t: string) => setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSchedule = async () => {
    if (!title.trim() || !profile) return;
    setSaving(true);
    try {
      const startTime = date && time
        ? new Date(`${date}T${time}`).toISOString()
        : new Date(Date.now() + 3_600_000).toISOString();
      await createRoom({
        title: title.trim(),
        description: description.trim(),
        host_id: profile.id,
        category: tags[0] ?? 'General',
        start_time: startTime,
        status: 'upcoming',
        room_type: formatIdx === 1 ? 'qa' : 'open',
      });
      navigate('/app/rooms');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '28px 48px 18px', borderBottom: '1px solid var(--line-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' as const, flex: 'none' }}>
        <div>
          <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>New room</p>
          <h1 style={{ fontSize: 38, marginTop: 6 }}>Host a <span className="display-italic">conversation</span>.</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn kind="ghost" onClick={() => navigate('/app/rooms')}>Discard</Btn>
          <Btn kind="primary" onClick={handleSchedule} disabled={saving || !title.trim()}
            iconRight={React.cloneElement(I.arrow as React.ReactElement<{ size?: number }>, { size: 14 })}>
            {saving ? 'Scheduling…' : 'Schedule room'}
          </Btn>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 48px 40px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40 }}>
        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
          <Field label="Room title">
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Breaking into Amazon as a newcomer"
              style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--paper)', fontSize: 14, color: 'var(--ink)', outline: 'none' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--clay)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--line)'} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Date">
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--paper)', fontSize: 14, color: 'var(--ink)', outline: 'none' }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--clay)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--line)'} />
            </Field>
            <Field label="Time">
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--paper)', fontSize: 14, color: 'var(--ink)', outline: 'none' }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--clay)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--line)'} />
            </Field>
          </div>

          <Field label="Format">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {FORMAT_OPTS.map((o, i) => (
                <div key={o.l} onClick={() => setFormatIdx(i)} style={{
                  padding: 12, borderRadius: 12, cursor: 'pointer', background: 'var(--paper)',
                  border: '1.5px solid ' + (formatIdx === i ? 'var(--clay)' : 'var(--line)'),
                  boxShadow: formatIdx === i ? 'var(--shadow-soft)' : 'none',
                }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{o.l}</p>
                  <p style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>{o.d}</p>
                </div>
              ))}
            </div>
          </Field>

          <Field label="What's it about?" hint="Two sentences. Be honest about who'd benefit.">
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder="A small, honest room for engineers and PMs new to Canada who want to land at Amazon."
              style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--paper)', fontSize: 14, color: 'var(--ink)', lineHeight: 1.55, resize: 'vertical' as const, outline: 'none', fontFamily: 'var(--sans)' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--clay)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--line)'} />
          </Field>

          <Field label="Co-hosts">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, padding: 8, borderRadius: 12, border: '1px solid var(--line)', background: 'var(--paper)' }}>
              {COHOST_SUGGESTIONS.map(p => (
                <span key={p.n} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 4px', borderRadius: 999, background: 'var(--cream)' }}>
                  <Avatar name={p.n} size={22} tone={p.tone} />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{p.n}</span>
                  <span style={{ color: 'var(--ink-mute)', fontSize: 14 }}>×</span>
                </span>
              ))}
              <span style={{ fontSize: 13, color: 'var(--ink-mute)', padding: '6px 8px' }}>+ Add a co-host</span>
            </div>
          </Field>

          <Field label="Who should this reach?">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
              {TAG_OPTS.map(t => (
                <button key={t} onClick={() => toggleTag(t)} style={{
                  padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  background: tags.includes(t) ? 'var(--clay)' : 'transparent',
                  color: tags.includes(t) ? 'var(--paper)' : 'var(--ink-soft)',
                  border: '1px solid ' + (tags.includes(t) ? 'var(--clay)' : 'var(--line)'),
                }}>
                  {tags.includes(t) && '✓ '}{t}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* Preview */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>How it'll look</p>
          <div className="hy-card" style={{ padding: 22, borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-warm)' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Pill kind="topic">{date ? new Date(date + 'T00:00').toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) : 'Tonight'}</Pill>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{time || '7:00 PM'} EST</span>
            </div>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 24, marginTop: 12, lineHeight: 1.2, fontWeight: 500 }}>
              {title || 'Your room title will appear here'}
            </h3>
            <p style={{ marginTop: 10, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
              {description || 'Your description will appear here.'}
            </p>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex' }}>
                {[{ n: profile?.full_name ?? 'You', t: 'dark' as const }, ...COHOST_SUGGESTIONS.map(p => ({ n: p.n, t: p.tone }))].map((p, i) => (
                  <div key={i} style={{ marginLeft: i === 0 ? 0 : -8, border: '2px solid var(--paper)', borderRadius: 999 }}>
                    <Avatar name={p.n} size={30} tone={p.t} />
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>You + {COHOST_SUGGESTIONS.length} co-hosts</p>
            </div>
            {tags.length > 0 && (
              <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                {tags.slice(0, 3).map(t => <Pill key={t}>{t}</Pill>)}
              </div>
            )}
          </div>

          <div className="hy-card" style={{ padding: 16 }}>
            <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Estimated reach</p>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <p style={{ fontFamily: 'var(--display)', fontSize: 32, lineHeight: 1, color: 'var(--clay)', fontWeight: 500 }}>~{Math.max(50, tags.length * 80 + 50)}</p>
              <p style={{ fontSize: 12, color: 'var(--ink-mute)' }}>members will see this in their brief</p>
            </div>
            <p style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
              Based on your tags. We never push rooms to people they didn't ask to hear from.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
