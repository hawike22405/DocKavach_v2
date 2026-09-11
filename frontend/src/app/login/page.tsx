"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, BadgeCheck, Fingerprint, Landmark, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const signIn = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true); setError(null);
    try {
      await signIn(email.trim(), password);
      window.location.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <main className="auth-national-page">
      <div className="auth-national-bg" aria-hidden="true"><div className="auth-orb auth-orb-a" /><div className="auth-orb auth-orb-b" /><div className="auth-tricolor" /></div>
      <section className="auth-shell">
        <div className="auth-showcase">
          <div className="auth-brand"><div className="auth-emblem"><ShieldCheck size={29} /></div><div><strong>DocKavach</strong><small>National Identity Screening</small></div></div>
          <div className="auth-showcase-copy">
            <div className="auth-kicker"><Landmark size={13} /> National operations workspace</div>
            <h1>Identity verification built for <span>clarity.</span></h1>
            <p>A focused screening workspace combining document evidence, OCR, integrity checks and face correspondence into an auditable operator workflow.</p>
            <div className="auth-badges"><span className="auth-badge"><BadgeCheck size={13} /> Evidence-led</span><span className="auth-badge"><Fingerprint size={13} /> Explainable checks</span><span className="auth-badge"><Sparkles size={13} /> Modern interface</span></div>
          </div>
          <div className="auth-showcase-footer"><span>DocKavach // BUILD 2026.09</span><span>Authorized use only</span></div>
        </div>
        <div className="auth-form-panel">
          <div className="auth-form-wrap">
            <div className="auth-topline"><span><LockKeyhole size={11} /> Secure operator access</span><span className="auth-live"><i /> Network ready</span></div>
            <div className="auth-heading"><p className="auth-kicker">Welcome back</p><h2>Sign in to DocKavach</h2><p>Use your registered operator credentials to enter the screening centre.</p></div>
            <form onSubmit={submit} className="auth-form">
              <label className="auth-field"><span>Officer email</span><input className="auth-input" required type="email" autoComplete="email" placeholder="officer@example.gov" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label className="auth-field"><span>Password</span><input className="auth-input" required type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
              {error && <div className="auth-error" role="alert">{error}</div>}
              <button className="auth-submit" type="submit" disabled={loading}><span>{loading ? "VERIFYING SESSION..." : "ENTER SCREENING CENTRE"}</span><ArrowRight size={17} /></button>
            </form>
            <div className="auth-divider"><span>New operator</span></div>
            <Link href="/register" className="auth-secondary">Create an operator account <ArrowRight size={15} /></Link>
            <div className="auth-footer"><span>Session protected</span><span>•</span><span>Audit logging enabled</span></div>
          </div>
        </div>
      </section>
    </main>
  );
}
