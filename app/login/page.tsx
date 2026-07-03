"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { login, register } from "@/app/actions";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    startTransition(async () => {
      const res =
        mode === "login" ? await login(email, password) : await register(name, email, password);
      if (res?.error) setError(res.error);
      // On success the action redirects to /dashboard.
    });
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
          <h1 className="h-lg">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="small text-3">
            {mode === "login" ? "Log in to hire, build, or test software." : "Free to join — hire, work, or test."}
          </p>
        </div>

        <form className="col" style={{ gap: 12 }} onSubmit={submit}>
          {mode === "register" && (
            <div className="field">
              <label>Full name</label>
              <input className="input" placeholder="Ada Lovelace" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              className="input"
              type="password"
              placeholder={mode === "register" ? "8+ characters" : "••••••••"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="badge badge-danger" style={{ padding: "8px 12px", justifyContent: "center" }}>
              {error}
            </div>
          )}
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="row between small">
          <a className="text-2" href="#">Forgot password?</a>
          <span className="text-3">🔐 Sessions are signed &amp; HTTP-only</span>
        </div>
        <p className="center tiny text-3">The first account created on this platform becomes its admin.</p>
        <p className="center tiny text-3">
          {mode === "login" ? (
            <>No account?{" "}
              <button style={{ color: "var(--primary)", fontWeight: 600 }} onClick={() => { setMode("register"); setError(null); }}>
                Create one free
              </button>
            </>
          ) : (
            <>Already registered?{" "}
              <button style={{ color: "var(--primary)", fontWeight: 600 }} onClick={() => { setMode("login"); setError(null); }}>
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
