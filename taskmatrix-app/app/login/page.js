"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/lib/supabase";
import useAuthStore from "@/store/authStore";

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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.replace(redirect);
    }
  }, [user, loading, router, searchParams]);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "Must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      showToast("Welcome back! Redirecting…", "success");
      // AuthProvider picks up the session change → sets user → useEffect above redirects
    } catch (err) {
      const msg = err.message?.includes("Invalid login credentials")
        ? "Invalid email or password. Please try again."
        : err.message?.includes("Email not confirmed")
          ? "Please confirm your email before logging in."
          : err.message || "Login failed. Please try again.";
      showToast(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      // Page will redirect to Google — loading state stays until redirect
    } catch (err) {
      showToast("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-ring" />
      </div>
    );
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
            <div className="brand-logo-icon">
              <GridIcon />
            </div>
            <span className="brand-logo-text">TaskMatrix</span>
          </div>
          <h2 className="brand-headline">
            Your Projects,{" "}
            <span className="accent">
              Perfectly
              <br />
              Orchestrated.
            </span>
          </h2>
          <p className="brand-description">
            Experience the art of focused work. A digital sanctuary where
            complex workflows become elegant symphonies.
          </p>
          <div className="brand-stats">
            <div className="brand-stat">
              <div className="brand-stat-value">99%</div>
              <div className="brand-stat-label">Efficiency Lift</div>
            </div>
            <div className="brand-stat">
              <div className="brand-stat-value">12k+</div>
              <div className="brand-stat-label">Curators</div>
            </div>
          </div>
        </aside>

        {/* ── Right form panel ── */}
        <main className="auth-form-panel">
          <div className="auth-form-box">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Enter your credentials to access your workspace.
            </p>

            {/* Google */}
            <button
              type="button"
              id="google-signin-btn"
              className="google-btn"
              onClick={handleGoogle}
              disabled={googleLoading || submitting}
              aria-label="Sign in with Google"
            >
              {googleLoading ? (
                <span
                  className="spinner"
                  style={{
                    borderColor: "rgba(0,0,0,.2)",
                    borderTopColor: "#333",
                  }}
                />
              ) : (
                <GoogleLogo />
              )}
              {googleLoading ? "Redirecting to Google…" : "Sign in with Google"}
            </button>

            <div className="divider">or continue with</div>

            <form
              onSubmit={handleLogin}
              noValidate
              aria-label="Email login form"
            >
              {/* Email */}
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">
                  Work Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  className={`form-input${errors.email ? " error" : ""}`}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: "" }));
                  }}
                  autoComplete="email"
                  required
                />
                {errors.email && (
                  <p className="form-error" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="login-password" className="form-label">
                    Password
                  </label>
                  <a href="#" className="forgot-link" id="forgot-password-link">
                    Forgot password?
                  </a>
                </div>
                <div className="input-wrapper">
                  <input
                    id="login-password"
                    type={showPw ? "text" : "password"}
                    className={`form-input${errors.password ? " error" : ""}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((p) => ({ ...p, password: "" }));
                    }}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="input-suffix-btn"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    id="toggle-password-btn"
                  >
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p className="form-error" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="checkbox-row">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember-me" className="checkbox-label">
                  Keep me logged in for 30 days
                </label>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className="btn-primary"
                disabled={submitting || googleLoading}
              >
                {submitting ? (
                  <>
                    <span className="spinner" /> Logging in…
                  </>
                ) : (
                  "Log In →"
                )}
              </button>
            </form>

            <p className="auth-switch">
              New to TaskMatrix?
              <Link id="go-to-register" href="/register">
                {" "}
                Create an account
              </Link>
            </p>

            <footer className="auth-footer">
              <div className="auth-footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
              <span className="auth-footer-copy">© 2026 TaskMatrix Corp</span>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="loading-screen">
          <div className="loading-ring" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
