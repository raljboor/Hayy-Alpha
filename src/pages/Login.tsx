import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Btn, HayyMark } from '@/shared/primitives';
import { useAuthContext } from '@/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      navigate('/app/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
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
          <p style={{ fontFamily: 'var(--display)', fontSize: 28, marginTop: 12, fontStyle: 'italic', color: 'var(--clay)' }}>
            Welcome back.
          </p>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 6 }}>
            You're two rooms from your next yes.
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
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14, border: '1px solid var(--line)', background: 'var(--paper)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--clay)'}
              onBlur={e => e.target.style.borderColor = 'var(--line)'}
            />
          </div>

          <Btn kind="primary" size="lg" type="submit" disabled={loading} style={{ justifyContent: 'center', marginTop: 4 }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Btn>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--ink-soft)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--clay)', fontWeight: 600 }}>Join Hayy</Link>
        </p>
      </div>
    </div>
  );
}
