import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { I, Avatar, Btn, Pill } from '@/shared/primitives';
import { useAuthContext } from '@/context/AuthContext';
import { getSuggestedProfiles, type SuggestedProfile } from '@/lib/api/profiles';
import { createReferralRequest } from '@/lib/api/referrals';

const inputStyle: React.CSSProperties = {
  padding: '12px 14px', borderRadius: 12, border: '1px solid var(--line)',
  background: 'var(--paper)', fontSize: 14, color: 'var(--ink)', outline: 'none',
  fontFamily: 'var(--sans)',
};

const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  (e.currentTarget.style.borderColor = 'var(--clay)');
const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  (e.currentTarget.style.borderColor = 'var(--line)');

export default function ReferCompose() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { profile } = useAuthContext();

  const [suggestions, setSuggestions] = useState<SuggestedProfile[]>([]);
  const [recipient, setRecipient] = useState<SuggestedProfile | null>(null);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const interests = [...(profile.skills ?? []), ...(profile.target_roles ?? [])];
    getSuggestedProfiles({ interests, selfId: profile.id, limit: 4 })
      .then(setSuggestions)
      .catch(() => []);
  }, [profile]);

  useEffect(() => {
    const hostId = params.get('host');
    if (hostId && suggestions.length > 0) {
      const found = suggestions.find(s => s.id === hostId);
      if (found) setRecipient(found);
    }
  }, [params, suggestions]);

  const handleSend = async () => {
    if (!profile || !recipient || !company.trim() || !role.trim() || !message.trim()) return;
    setSending(true);
    try {
      await createReferralRequest({
        requester_id: profile.id,
        host_id: recipient.id,
        target_company: company.trim(),
        target_role: role.trim(),
        request_type: 'referral',
        message: message.trim(),
      });
      navigate('/app/referrals');
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '28px 48px 18px', borderBottom: '1px solid var(--line-soft)', flex: 'none' }}>
        <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>New referral request</p>
        <h1 style={{ fontSize: 38, marginTop: 6 }}>Ask for a <span className="display-italic">warm</span> intro.</h1>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 48px 40px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40 }}>
        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>

          {/* Recipient picker */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
              Who would you like to be referred to?
            </span>
            {recipient ? (
              <div style={{
                padding: '10px 14px', borderRadius: 12, border: '1.5px solid var(--clay)',
                background: 'var(--paper)', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Avatar name={recipient.full_name} size={30} tone="clay" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{recipient.full_name}</p>
                  <p style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{recipient.headline ?? recipient.role_type}</p>
                </div>
                <span style={{ color: 'var(--ink-mute)', fontSize: 14, cursor: 'pointer' }} onClick={() => setRecipient(null)}>×</span>
              </div>
            ) : (
              <div style={{
                padding: '10px 14px', borderRadius: 12, border: '1px solid var(--line)',
                background: 'var(--paper)', display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <p style={{ fontSize: 13, color: 'var(--ink-mute)' }}>Select from suggestions →</p>
                {suggestions.slice(0, 3).map(s => (
                  <div key={s.id} onClick={() => setRecipient(s)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 10,
                    cursor: 'pointer', background: 'var(--cream)',
                  }}>
                    <Avatar name={s.full_name} size={28} tone="clay" />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{s.full_name}</p>
                      <p style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{s.headline ?? s.role_type}</p>
                    </div>
                    <Pill style={{ background: 'transparent' }}>Select</Pill>
                  </div>
                ))}
              </div>
            )}
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Company</span>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Stripe" style={inputStyle} onFocus={focus} onBlur={blur} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Role you're targeting</span>
              <input value={role} onChange={e => setRole(e.target.value)} placeholder="Sr PM, Payments" style={inputStyle} onFocus={focus} onBlur={blur} />
            </label>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Why this role, in your words</span>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
              placeholder="Eight years in fintech, last four building merchant tools…"
              style={{ ...inputStyle, lineHeight: 1.6, minHeight: 110, resize: 'vertical' as const }}
              onFocus={focus} onBlur={blur} />
            <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>What {recipient?.full_name ?? 'they'} can paste straight into a Slack DM. Keep it 3 lines.</span>
          </label>

          {/* Attach row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Attach</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, background: 'var(--cream)', border: '1px solid var(--line-soft)' }}>
                <span style={{ fontSize: 14 }}>📄</span>
                <span style={{ fontSize: 12 }}>Resume.pdf</span>
                <span style={{ color: 'var(--ink-mute)', fontSize: 12, cursor: 'pointer' }}>×</span>
              </span>
              <span style={{ padding: '8px 12px', borderRadius: 10, border: '1px dashed var(--line)', fontSize: 12, color: 'var(--ink-mute)', cursor: 'pointer' }}>
                + Portfolio link
              </span>
            </div>
          </div>

          {/* Privacy note */}
          <div style={{ padding: 14, borderRadius: 12, background: 'var(--cream)', border: '1px solid var(--line-soft)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--olive)', flex: 'none', marginTop: 2 }}>
              {React.cloneElement(I.lock as React.ReactElement<{ size?: number }>, { size: 14 })}
            </span>
            <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
              {recipient?.full_name ?? 'They'} get to decide. They'll see this note and your profile — nothing else from your account.
              You can withdraw the request anytime before they reply.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="ghost" onClick={() => navigate(-1)}>Save draft</Btn>
            <Btn kind="primary"
              iconRight={React.cloneElement(I.shake as React.ReactElement<{ size?: number }>, { size: 14 })}
              disabled={sending || !recipient || !company.trim() || !role.trim() || !message.trim()}
              onClick={handleSend}>
              {sending ? 'Sending…' : `Send to ${recipient?.full_name?.split(' ')[0] ?? '…'}`}
            </Btn>
          </div>
        </div>

        {/* Right: suggestions */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <p className="mono" style={{ fontSize: 11, color: 'var(--clay)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Other warm paths</p>
          {suggestions.filter(s => s.id !== recipient?.id).slice(0, 3).map(s => (
            <div key={s.id} className="hy-card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={s.full_name} size={36} tone="clay" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{s.full_name}</p>
                <p style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{s.headline ?? s.role_type}</p>
                {s.shared_tokens.length > 0 && (
                  <p className="mono" style={{ fontSize: 10, color: 'var(--clay)', marginTop: 4, letterSpacing: '.06em' }}>
                    ↳ {s.shared_tokens.slice(0, 2).join(' · ').toUpperCase()}
                  </p>
                )}
              </div>
              <Btn kind="soft" onClick={() => setRecipient(s)}>Switch</Btn>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
