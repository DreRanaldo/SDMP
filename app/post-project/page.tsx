"use client";

import Link from "next/link";
import { useState } from "react";
import AppShell from "@/components/AppShell";

const STEPS = ["Basics", "Details & budget", "Milestones", "Review & fund escrow"];
const STACK = ["Python", "Claude API", "PostgreSQL", "Next.js", "React", "Go", "Flutter", "AWS"];

export default function PostProject() {
  const [step, setStep] = useState(1); // 0-indexed; start on "Details & budget" like the design
  const [stack, setStack] = useState<string[]>(["Python", "Claude API", "PostgreSQL", "Next.js"]);
  const [submitted, setSubmitted] = useState(false);

  function toggleStack(s: string) {
    setStack((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setSubmitted(true);
  }

  return (
    <AppShell
      active="projects"
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
            <div key={s} className={`wstep ${i < step ? "done" : i === step ? "now" : ""}`}>
              <i />{i + 1} · {s}{i < step ? " ✓" : ""}
            </div>
          ))}
        </div>

        {submitted ? (
          <div className="card pad col center" style={{ gap: 14, padding: 48, borderColor: "var(--success)" }}>
            <span style={{ fontSize: "2.4rem" }}>🔒✅</span>
            <h2 className="h-lg">Project posted &amp; escrow funded</h2>
            <p className="text-2" style={{ maxWidth: "30rem" }}>
              $9,500 is now locked in SDMP escrow. Your project is live — matching developers are being notified,
              and proposals will appear on your dashboard.
            </p>
            <div className="row">
              <Link className="btn btn-primary" href="/dashboard">Go to dashboard</Link>
              <Link className="btn btn-secondary" href="/browse">Invite developers</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="card pad col" style={{ gap: 18 }}>
              <div className="field"><label>Project title</label><input className="input" defaultValue="Customer-Support AI Agent" /></div>
              <div className="field">
                <label>Description</label>
                <textarea className="input" rows={4} defaultValue="RAG-powered chatbot over our product docs with human-handoff, conversation analytics, and a small admin console. Must integrate with our existing Postgres + Next.js stack." />
              </div>
              <div className="grid g2">
                <div className="field"><label>Budget range (USD)</label><div className="row gap-sm"><input className="input" defaultValue="$6,000" /><input className="input" defaultValue="$9,500" /></div></div>
                <div className="field"><label>Deadline</label><input className="input" defaultValue="August 15, 2026" /></div>
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
                  <select className="input" defaultValue="High"><option>Normal</option><option>High</option><option>Urgent</option></select>
                </div>
                <div className="field"><label>QA testing</label>
                  <select className="input" defaultValue="Required — auto-assign tester"><option>Required — auto-assign tester</option><option>Required — I&apos;ll choose a tester</option><option>Optional</option></select>
                </div>
              </div>
              <div className="field">
                <label>Visibility</label>
                <div className="vis">
                  <label><input type="radio" name="vis" defaultChecked /><b className="small">🌐 Public</b><span className="tiny text-3">Any developer can apply</span></label>
                  <label><input type="radio" name="vis" /><b className="small">🔒 Private</b><span className="tiny text-3">Hidden from search</span></label>
                  <label><input type="radio" name="vis" /><b className="small">✉️ Invite only</b><span className="tiny text-3">Only invited devs see it</span></label>
                </div>
              </div>
            </div>

            <div className="card glass pad col gap-sm" style={{ borderColor: "var(--accent)" }}>
              <div className="row between"><b className="h-md">✨ AI Project Estimator</b><span className="badge badge-accent">Beta</span></div>
              <div className="grid g3">
                <div><div className="tiny text-3">SUGGESTED BUDGET</div><b>$7,800 – $9,200</b></div>
                <div><div className="tiny text-3">PREDICTED TIMELINE</div><b>5–7 weeks</b></div>
                <div><div className="tiny text-3">RISK ANALYSIS</div><b className="up">Low · well-scoped</b></div>
              </div>
              <p className="small text-2">
                Suggested milestones: ① Ingestion + RAG pipeline ② Chat UI + handoff ③ Analytics console + hardening.
                12 strong developer matches found — top match: <b>Amara Okafor (98%)</b>.
              </p>
            </div>

            <div className="row between">
              <button className="btn btn-secondary" onClick={() => setStep(Math.max(0, step - 1))}>← Back</button>
              <button className="btn btn-primary btn-lg" onClick={next}>
                {step === STEPS.length - 1 ? "Fund escrow & post →" : `Continue to ${STEPS[step + 1].toLowerCase()} →`}
              </button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
