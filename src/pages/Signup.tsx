import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Btn, HayyMark } from '@/shared/primitives';
import { useAuthContext } from '@/context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signUp(email, password);
      navigate('/onboarding');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hy" data-palette="dawn" style={{
      minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
          <HayyMark size={40} color="var(--clay)" />
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 28, marginTop: 12, fontStyle: 'italic', color: 'var(--clay)' }}>
            Join the community.
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 6, textAlign: 'center' }}>
            Meet the people inside the companies you care about.
          </p>
        </div>

        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: '#fdf1f1', border: '1px solid #f5c6c6', color: '#c94040', fontSize: 13 }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@example.com"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14, border: '1px solid var(--line)', background: 'var(--paper)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--clay)'}
              onBlur={e => e.target.style.borderColor = 'var(--line)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
              placeholder="At least 8 characters"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14, border: '1px solid var(--line)', background: 'var(--paper)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--clay)'}
              onBlur={e => e.target.style.borderColor = 'var(--line)'}
            />
          </div>

          <Btn kind="primary" size="lg" type="submit" disabled={loading} style={{ justifyContent: 'center', marginTop: 4 }}>
            {loading ? 'Creating account…' : 'Create account'}
          </Btn>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-mute)', marginTop: 14, lineHeight: 1.5 }}>
          By joining, you agree to our Terms and Privacy Policy.
        </p>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--ink-soft)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--clay)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
