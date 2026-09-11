"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, BadgeCheck, Fingerprint, Landmark, LockKeyhole, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterPage() {
  const createAccount = useAuthStore((state) => state.register);
  const [name, setName] = useState(""); const [badgeId, setBadgeId] = useState("");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError(null);
    try { await createAccount(name.trim(), email.trim(), password, badgeId.trim()); window.location.replace("/"); }
    catch (err) { setError(err instanceof Error ? err.message : "Registration failed"); }
    finally { setLoading(false); }
  };

  return (
    <main className="auth-national-page">
      <div className="auth-national-bg" aria-hidden="true"><div className="auth-orb auth-orb-a" /><div className="auth-orb auth-orb-b" /><div className="auth-tricolor" /></div>
      <section className="auth-shell">
        <div className="auth-showcase">
          <div className="auth-brand"><div className="auth-emblem"><ShieldCheck size={29} /></div><div><strong>CT-OS</strong><small>National Identity Screening</small></div></div>
          <div className="auth-showcase-copy">
            <div className="auth-kicker"><Landmark size={13} /> Operator provisioning</div>
            <h1>One secure account. <span>One clear workflow.</span></h1>
            <p>Create an operator profile for the CT-OS screening centre. Your account is used to authenticate screening requests and associate audit records with the authorized operator.</p>
            <div className="auth-badges"><span className="auth-badge"><BadgeCheck size={13} /> Auditable</span><span className="auth-badge"><Fingerprint size={13} /> Secure session</span><span className="auth-badge"><Sparkles size={13} /> Professional UI</span></div>
          </div>
          <div className="auth-showcase-footer"><span>CT-OS // BUILD 2026.09</span><span>Authorized use only</span></div>
        </div>
        <div className="auth-form-panel">
          <div className="auth-form-wrap">
            <div className="auth-topline"><span><LockKeyhole size={11} /> Secure operator registration</span><span className="auth-live"><i /> Ready</span></div>
            <div className="auth-heading"><p className="auth-kicker"><UserPlus size={13} /> New operator</p><h2>Create your account</h2><p>Register your operator details to access the screening centre.</p></div>
            <form onSubmit={submit} className="auth-form">
              <div className="auth-two-col">
                <label className="auth-field"><span>Officer name</span><input className="auth-input" required autoComplete="name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} /></label>
                <label className="auth-field"><span>Badge ID <em>optional</em></span><input className="auth-input" placeholder="e.g. SSB-1042" value={badgeId} onChange={(e) => setBadgeId(e.target.value)} /></label>
              </div>
              <label className="auth-field"><span>Officer email</span><input className="auth-input" required type="email" autoComplete="email" placeholder="officer@example.gov" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label className="auth-field"><span>Password</span><input className="auth-input" required minLength={12} type="password" autoComplete="new-password" placeholder="Minimum 12 characters" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
              {error && <div className="auth-error" role="alert">{error}</div>}
              <button className="auth-submit" type="submit" disabled={loading}><span>{loading ? "CREATING ACCOUNT..." : "CREATE OPERATOR ACCOUNT"}</span><ArrowRight size={17} /></button>
            </form>
            <div className="auth-divider"><span>Already registered</span></div>
            <Link href="/login" className="auth-secondary">Return to sign in <ArrowRight size={15} /></Link>
            <div className="auth-footer"><span>Session protected</span><span>•</span><span>Audit logging enabled</span></div>
          </div>
        </div>
      </section>
    </main>
  );
}
