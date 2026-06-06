import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Btn, Pill } from '@/shared/primitives';
import { useAuthContext } from '@/context/AuthContext';
import { updateProfile } from '@/lib/api/profiles';

const HELP_OPTIONS = [
  { key: 'coffee', l: 'Coffee chats', d: '3 / month · 30 min' },
  { key: 'resume', l: 'Resume reviews', d: 'Same week response' },
  { key: 'portfolio', l: 'Portfolio reviews', d: 'For designers only' },
  { key: 'mock', l: 'Mock interviews', d: 'Product design rounds' },
  { key: 'speaking', l: 'Speaking on rooms', d: 'Anything newcomer-related' },
];

const Switch = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <span onClick={onToggle} style={{
    width: 36, height: 22, borderRadius: 99, padding: 2, flex: 'none',
    background: on ? 'var(--clay)' : 'var(--line)',
    display: 'inline-flex', alignItems: 'center', justifyContent: on ? 'flex-end' : 'flex-start',
    transition: 'all .2s', cursor: 'pointer',
  }}>
    <span style={{ width: 18, height: 18, borderRadius: 99, background: 'var(--paper)', boxShadow: '0 1px 3px rgba(0,0,0,.15)' }} />
  </span>
);

const inputStyle: React.CSSProperties = {
  padding: '12px 14px', borderRadius: 12, border: '1px solid var(--line)',
  background: 'var(--paper)', fontSize: 14, color: 'var(--ink)', outline: 'none',
  fontFamily: 'var(--sans)',
};

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
    {children}
  </span>
);

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { profile } = useAuthContext();

  const [fullName, setFullName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [quote, setQuote] = useState('');
  const [bio, setBio] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [helps, setHelps] = useState<Record<string, boolean>>({
    coffee: true, resume: true, portfolio: true, mock: true, speaking: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? '');
    setPronouns((profile as Record<string, unknown>).pronouns as string ?? '');
    setHeadline(profile.headline ?? '');
    setLocation(profile.location ?? '');
    setBio(profile.bio ?? '');
    setTags(profile.skills ?? []);
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateProfile(profile.id, {
        full_name: fullName.trim(),
        headline: headline.trim(),
        location: location.trim(),
        bio: bio.trim(),
        skills: tags,
      });
      navigate('/app/profile');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t));
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--clay)');
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--line)');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '28px 48px 18px', borderBottom: '1px solid var(--line-soft)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' as const, flex: 'none',
      }}>
        <div>
          <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Edit profile</p>
          <h1 style={{ fontSize: 38, marginTop: 6 }}>How others <span className="display-italic">meet</span> you on Hayy.</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn kind="ghost" onClick={() => navigate('/app/profile')}>View public profile</Btn>
          <Btn kind="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Btn>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 48px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Identity */}
        <section style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40 }}>
          <div>
            <h2 style={{ fontSize: 20, lineHeight: 1.1 }}>Identity</h2>
            <p style={{ marginTop: 6, fontSize: 12, color: 'var(--ink-mute)' }}>Your name, photo, and the line under your face.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Avatar name={fullName || 'You'} size={64} tone="dark" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Btn kind="soft">Upload new</Btn>
                <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>JPG or PNG · max 4MB</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <FieldLabel>Display name</FieldLabel>
                <input value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <FieldLabel>Pronouns</FieldLabel>
                <input value={pronouns} onChange={e => setPronouns(e.target.value)} placeholder="she / her" style={inputStyle} onFocus={focus} onBlur={blur} />
              </label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <FieldLabel>Headline</FieldLabel>
                <input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Senior Product Designer" style={inputStyle} onFocus={focus} onBlur={blur} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <FieldLabel>Location</FieldLabel>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Toronto, Canada" style={inputStyle} onFocus={focus} onBlur={blur} />
              </label>
            </div>
          </div>
        </section>

        {/* Your story */}
        <section style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40, paddingTop: 22, borderTop: '1px solid var(--line-soft)' }}>
          <div>
            <h2 style={{ fontSize: 20, lineHeight: 1.1 }}>Your story</h2>
            <p style={{ marginTop: 6, fontSize: 12, color: 'var(--ink-mute)' }}>The opening line and a short bio. Stays editorial.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <FieldLabel>Quote (one line)</FieldLabel>
              <input value={quote} onChange={e => setQuote(e.target.value)}
                placeholder='"I rebuilt my career from scratch in a new country…"'
                style={{ ...inputStyle, fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 16 }}
                onFocus={focus} onBlur={blur} />
              <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>What you'd want a stranger to read first.</span>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <FieldLabel>Bio</FieldLabel>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
                style={{ ...inputStyle, lineHeight: 1.6, resize: 'vertical' as const }}
                onFocus={focus} onBlur={blur} />
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <FieldLabel>Tags</FieldLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, padding: 8, borderRadius: 12, border: '1px solid var(--line)', background: 'var(--paper)' }}>
                {tags.map(t => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Pill>{t} <span style={{ marginLeft: 4, color: 'var(--ink-mute)', cursor: 'pointer' }} onClick={() => removeTag(t)}>×</span></Pill>
                  </span>
                ))}
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                  placeholder="+ Add"
                  style={{ border: 'none', outline: 'none', fontSize: 13, color: 'var(--ink-mute)', background: 'transparent', padding: '4px 8px', minWidth: 60 }} />
              </div>
            </div>
          </div>
        </section>

        {/* What you'll help with */}
        <section style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40, paddingTop: 22, borderTop: '1px solid var(--line-soft)' }}>
          <div>
            <h2 style={{ fontSize: 20, lineHeight: 1.1 }}>What you'll help with</h2>
            <p style={{ marginTop: 6, fontSize: 12, color: 'var(--ink-mute)' }}>What others can ask of you. Be specific.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {HELP_OPTIONS.map(o => (
              <div key={o.key} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12,
                background: 'var(--paper)', border: '1px solid var(--line-soft)',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{o.l}</p>
                  <p style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 2 }}>{o.d}</p>
                </div>
                <Switch on={helps[o.key]} onToggle={() => setHelps(prev => ({ ...prev, [o.key]: !prev[o.key] }))} />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
