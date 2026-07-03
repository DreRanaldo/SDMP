"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import AppShell from "@/components/AppShell";
import { createProject } from "@/app/actions";
import type { SafeUser } from "@/lib/db";

const STEPS = ["Basics", "Details & budget", "Milestones", "Review & fund escrow"];
const STACK = ["Python", "Claude API", "PostgreSQL", "Next.js", "React", "Go", "Flutter", "AWS"];

export default function PostProjectClient({ user }: { user: SafeUser }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("Customer-Support AI Agent");
  const [description, setDescription] = useState(
    "RAG-powered chatbot over our product docs with human-handoff, conversation analytics, and a small admin console. Must integrate with our existing Postgres + Next.js stack.",
  );
  const [budget, setBudget] = useState("9500");
  const [deadline, setDeadline] = useState("Aug 15");
  const [visibility, setVisibility] = useState("Public");
  const [priority, setPriority] = useState("High");
  const [stack, setStack] = useState<string[]>(["Python", "Claude API", "PostgreSQL", "Next.js"]);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggleStack(s: string) {
    setStack((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await createProject({
        title,
        description,
        budget: Number(budget.replace(/[^0-9.]/g, "")),
        deadline,
        stack,
        visibility,
        priority,
      });
      if (res?.error) setError(res.error);
      else setCreatedId(res.id ?? null);
    });
  }

  const budgetNumber = Number(budget.replace(/[^0-9.]/g, "")) || 0;

  return (
    <AppShell
      active="projects"
      user={user}
      topbar={
        <>
          <Link className="small text-3" href="/dashboard">Projects /</Link>
          <b>New Project</b>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost btn-sm">Save draft</button>
        </>
      }
    >
      <div className="wizard col" style={{ gap: 24 }}>
        <div>
          <h1 className="h-xl">Post a project</h1>
          <p className="text-2">Tell us what you&apos;re building. Our AI estimator will suggest scope, budget, and matching developers.</p>
        </div>

        <div className="wsteps">
          {STEPS.map((s, i) => (
            <div key={s} className={`wstep ${createdId || i < step ? "done" : i === step ? "now" : ""}`}>
              <i />{i + 1} · {s}{createdId || i < step ? " ✓" : ""}
            </div>
          ))}
        </div>

        {createdId ? (
          <div className="card pad col center" style={{ gap: 14, padding: 48, borderColor: "var(--success)" }}>
            <span style={{ fontSize: "2.4rem" }}>🔒✅</span>
            <h2 className="h-lg">Project posted &amp; escrow funded</h2>
            <p className="text-2" style={{ maxWidth: "30rem" }}>
              ${budgetNumber.toLocaleString("en-US")} is now locked in SDMP escrow for <b>{title}</b>.
              Your project is live — matching developers are being notified, and proposals will
              appear on your dashboard.
            </p>
            <div className="row">
              <Link className="btn btn-primary" href="/dashboard">Go to dashboard</Link>
              <Link className="btn btn-secondary" href={`/project?id=${createdId}`}>Open workspace</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="card pad col" style={{ gap: 18 }}>
              <div className="field"><label>Project title</label><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
              <div className="field">
                <label>Description</label>
                <textarea className="input" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid g2">
                <div className="field"><label>Budget (USD, funds escrow)</label><input className="input" value={budget} onChange={(e) => setBudget(e.target.value)} /></div>
                <div className="field"><label>Deadline</label><input className="input" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></div>
              </div>
              <div className="field">
                <label>Tech stack</label>
                <div className="row wrap gap-sm">
                  {STACK.map((s) => (
                    <button key={s} type="button" className={`chip${stack.includes(s) ? " active" : ""}`} onClick={() => toggleStack(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid g2">
                <div className="field"><label>Repository (optional)</label><input className="input" placeholder="github.com/acme/support-agent" /></div>
                <div className="field"><label>Figma links (optional)</label><input className="input" placeholder="figma.com/file/…" /></div>
              </div>
              <div className="field">
                <label>Attachments</label>
                <div className="drop">📎 Drag &amp; drop requirements, specs, or wireframes<br /><span className="tiny">PDF, DOCX, PNG, ZIP · up to 100 MB</span></div>
              </div>
              <div className="grid g2">
                <div className="field"><label>Priority</label>
                  <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option>Normal</option><option>High</option><option>Urgent</option>
                  </select>
                </div>
                <div className="field"><label>QA testing</label>
                  <select className="input" defaultValue="Required — auto-assign tester">
                    <option>Required — auto-assign tester</option><option>Required — I&apos;ll choose a tester</option><option>Optional</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Visibility</label>
                <div className="vis">
                  {[
                    ["Public", "🌐 Public", "Any developer can apply"],
                    ["Private", "🔒 Private", "Hidden from search"],
                    ["Invite only", "✉️ Invite only", "Only invited devs see it"],
                  ].map(([value, label, hint]) => (
                    <label key={value}>
                      <input type="radio" name="vis" checked={visibility === value} onChange={() => setVisibility(value)} />
                      <b className="small">{label}</b><span className="tiny text-3">{hint}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="card glass pad col gap-sm" style={{ borderColor: "var(--accent)" }}>
              <div className="row between"><b className="h-md">✨ AI Project Estimator</b><span className="badge badge-accent">Beta</span></div>
              <div className="grid g3">
                <div><div className="tiny text-3">SUGGESTED BUDGET</div><b>${Math.round(budgetNumber * 0.82).toLocaleString()} – ${Math.round(budgetNumber * 0.97).toLocaleString()}</b></div>
                <div><div className="tiny text-3">PREDICTED TIMELINE</div><b>5–7 weeks</b></div>
                <div><div className="tiny text-3">RISK ANALYSIS</div><b className="up">Low · well-scoped</b></div>
              </div>
              <p className="small text-2">
                Suggested milestones: ① Foundation &amp; core setup ② Main feature build ③ QA hardening &amp; launch —
                escrow splits your budget across all three automatically.
              </p>
            </div>

            {error && (
              <div className="card pad row" style={{ padding: "12px 14px", borderColor: "var(--danger)" }}>
                <span className="small" style={{ color: "var(--danger)" }}>⚠️ {error}</span>
              </div>
            )}

            <div className="row between">
              <button className="btn btn-secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={pending}>← Back</button>
              <button className="btn btn-primary btn-lg" onClick={next} disabled={pending}>
                {pending ? "Funding escrow…" : step === STEPS.length - 1 ? "Fund escrow & post →" : `Continue to ${STEPS[step + 1].toLowerCase()} →`}
              </button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
