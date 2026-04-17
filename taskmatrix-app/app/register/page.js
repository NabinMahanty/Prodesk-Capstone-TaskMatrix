'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import useAuthStore from '@/store/authStore';

// ── Icons ────────────────────────────────────────────────────────────────────
function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= score ? colors[score] : '#e5e7eb', transition: 'background 0.2s' }} />
        ))}
      </div>
      <span style={{ fontSize: '0.75rem', color: colors[score], fontWeight: 500 }}>{labels[score]}</span>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = 'Full name is required.';
    if (!email) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 6) e.password = 'Must be at least 6 characters.';
    if (!confirmPw) e.confirmPw = 'Please confirm your password.';
    else if (password !== confirmPw) e.confirmPw = 'Passwords do not match.';
    if (!terms) e.terms = 'You must accept the terms.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName.trim() },
          // After email confirmation, user lands back on the dashboard
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      showToast(
        '✅ Account created! Check your email to confirm, then log in.',
        'success'
      );
      setTimeout(() => router.replace('/login'), 3000);
    } catch (err) {
      const msg =
        err.message?.includes('already registered') || err.message?.includes('already been registered')
          ? 'An account with this email already exists.'
          : err.message || 'Registration failed. Please try again.';
      showToast(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch {
      showToast('Google sign-up failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="loading-ring" /></div>;
  }

  return (
    <>
      {toast && (
        <div className="toast-container" role="alert" aria-live="polite">
          <div className={`toast ${toast.type}`}>{toast.msg}</div>
        </div>
      )}

      <div className="auth-layout">
        {/* ── Left brand panel ── */}
        <aside className="auth-brand-panel" aria-hidden="true">
          <div className="brand-logo">
            <div className="brand-logo-icon"><GridIcon /></div>
            <span className="brand-logo-text">TaskMatrix</span>
          </div>
          <h2 className="brand-headline">
            Join Thousands of<br />
            <span className="accent">Productive Teams.</span>
          </h2>
          <p className="brand-description">
            Create your free TaskMatrix account and start orchestrating your
            projects with clarity, speed, and elegance.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              'Free forever, no credit card required',
              'Unlimited projects & tasks',
              'Collaborate with your entire team',
              'Enterprise-grade security',
            ].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(59,232,160,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckIcon />
                </span>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,.8)' }}>{f}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Right form panel ── */}
        <main className="auth-form-panel">
          <div className="auth-form-box">
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Start managing projects like a pro — it&apos;s free.</p>

            <button
              type="button"
              id="google-signup-btn"
              className="google-btn"
              onClick={handleGoogle}
              disabled={googleLoading || submitting}
              aria-label="Sign up with Google"
            >
              {googleLoading
                ? <span className="spinner" style={{ borderColor: 'rgba(0,0,0,.2)', borderTopColor: '#333' }} />
                : <GoogleLogo />}
              {googleLoading ? 'Redirecting to Google…' : 'Sign up with Google'}
            </button>

            <div className="divider">or register with email</div>

            <form onSubmit={handleRegister} noValidate aria-label="Registration form">
              {/* Full name */}
              <div className="form-group">
                <label htmlFor="reg-name" className="form-label">Full Name</label>
                <input
                  id="reg-name"
                  type="text"
                  className={`form-input${errors.fullName ? ' error' : ''}`}
                  placeholder="Julian Casablancas"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: '' })); }}
                  autoComplete="name"
                  required
                />
                {errors.fullName && <p className="form-error" role="alert">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="reg-email" className="form-label">Work Email</label>
                <input
                  id="reg-email"
                  type="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                  autoComplete="email"
                  required
                />
                {errors.email && <p className="form-error" role="alert">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="reg-password" className="form-label">Password</label>
                <div className="input-wrapper">
                  <input
                    id="reg-password"
                    type={showPw ? 'text' : 'password'}
                    className={`form-input${errors.password ? ' error' : ''}`}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" className="input-suffix-btn" id="toggle-pw-reg" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide' : 'Show'}>
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <PasswordStrength password={password} />
                {errors.password && <p className="form-error" role="alert">{errors.password}</p>}
              </div>

              {/* Confirm */}
              <div className="form-group">
                <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className={`form-input${errors.confirmPw ? ' error' : ''}`}
                    placeholder="Repeat your password"
                    value={confirmPw}
                    onChange={(e) => { setConfirmPw(e.target.value); setErrors((p) => ({ ...p, confirmPw: '' })); }}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" className="input-suffix-btn" id="toggle-confirm-reg" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? 'Hide' : 'Show'}>
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.confirmPw && <p className="form-error" role="alert">{errors.confirmPw}</p>}
              </div>

              {/* Terms */}
              <div className="checkbox-row" style={{ marginBottom: errors.terms ? '0.5rem' : '1.5rem' }}>
                <input id="terms" type="checkbox" checked={terms} onChange={(e) => { setTerms(e.target.checked); setErrors((p) => ({ ...p, terms: '' })); }} />
                <label htmlFor="terms" className="checkbox-label">
                  I agree to the{' '}
                  <a href="#" style={{ color: 'var(--brand-blue)', fontWeight: 500 }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" style={{ color: 'var(--brand-blue)', fontWeight: 500 }}>Privacy Policy</a>
                </label>
              </div>
              {errors.terms && <p className="form-error" style={{ marginBottom: '1rem' }} role="alert">{errors.terms}</p>}

              <button id="register-submit-btn" type="submit" className="btn-primary" disabled={submitting || googleLoading}>
                {submitting ? <><span className="spinner" /> Creating account…</> : 'Create Account →'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?
              <Link id="go-to-login" href="/login"> Sign in</Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
