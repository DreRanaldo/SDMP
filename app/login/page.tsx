"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  function signIn(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    // Demo auth: replace with a real identity provider (see README).
    setTimeout(() => router.push("/dashboard"), 400);
  }

  return (
    <div className="auth-wrap">
      <div className="hero-bg"><div className="blob b1" /><div className="blob b2" /></div>
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 2 }}><ThemeToggle /></div>

      <div className="card glass auth-card col" style={{ gap: 18 }}>
        <Link className="brand" href="/" style={{ justifyContent: "center" }}>
          <span className="logo-mark">S</span> SDMP
        </Link>
        <div className="center">
          <h1 className="h-lg">Welcome back</h1>
          <p className="small text-3">Log in to hire, build, or test software.</p>
        </div>

        <div className="col gap-sm">
          <button className="oauth-btn" onClick={() => signIn()}>🔵 Continue with Google</button>
          <button className="oauth-btn" onClick={() => signIn()}>🐙 Continue with GitHub</button>
          <button className="oauth-btn" onClick={() => signIn()}>🪟 Continue with Microsoft</button>
          <button className="oauth-btn" onClick={() => signIn()}> Continue with Apple</button>
        </div>

        <div className="row" style={{ gap: 10 }}>
          <hr className="divider flex1" /><span className="tiny text-3">OR</span><hr className="divider flex1" />
        </div>

        <form className="col" style={{ gap: 12 }} onSubmit={signIn}>
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="row between small">
          <a className="text-2" href="#">Forgot password?</a>
          <span className="text-3">🔐 2FA enabled</span>
        </div>
        <p className="center tiny text-3">
          No account? <Link style={{ color: "var(--primary)" }} href="/dashboard">Create one free</Link> — hire, work, or test.
        </p>
      </div>
    </div>
  );
}
