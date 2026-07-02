"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { fintechProject, type Milestone } from "@/lib/data";

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

export default function ProjectWorkspace() {
  const [milestones, setMilestones] = useState<Milestone[]>(fintechProject.milestones);
  const [revisionRequested, setRevisionRequested] = useState(false);

  const released = useMemo(
    () => milestones.filter((m) => m.state === "released").reduce((s, m) => s + m.amount, 0),
    [milestones],
  );
  const locked = fintechProject.totalEscrow - released;
  const inQa = milestones.some((m) => m.state === "in-qa");

  function approve(id: number) {
    setMilestones((ms) =>
      ms.map((m) =>
        m.id === id
          ? { ...m, state: "released", detail: "Approved just now · escrow released automatically ✓" }
          : m,
      ),
    );
    setRevisionRequested(false);
  }

  function requestRevision(id: number) {
    setMilestones((ms) =>
      ms.map((m) =>
        m.id === id ? { ...m, detail: "Revision requested · developer notified · QA will re-verify" } : m,
      ),
    );
    setRevisionRequested(true);
  }

  return (
    <AppShell
      active="projects"
      topbar={
        <>
          <Link className="small text-3" href="/dashboard">Projects /</Link>
          <b>Fintech Dashboard</b>
          <span className={`badge ${inQa ? "badge-warning" : "badge-success"}`}>{inQa ? "In QA" : "On track"}</span>
          <div style={{ flex: 1 }} />
          <button className="btn btn-secondary btn-sm">🎥 Start call</button>
        </>
      }
    >
      {/* Project header */}
      <div className="card pad">
        <div className="row between wrap" style={{ gap: 18 }}>
          <div className="row" style={{ gap: 16 }}>
            <span className="avatar lg a2">FD</span>
            <div>
              <b className="h-lg">{fintechProject.name}</b>
              <div className="small text-3">
                Client: {fintechProject.client} · Developer: {fintechProject.developer} · QA: {fintechProject.tester} · {fintechProject.visibility}
              </div>
              <div className="row gap-sm mt-1 wrap">
                {fintechProject.stack.map((s) => <span key={s} className="badge badge-neutral">{s}</span>)}
                <span className="badge badge-neutral">Figma ↗</span>
                <span className="badge badge-neutral">repo: acme/fintech-dash ↗</span>
              </div>
            </div>
          </div>
          <div className="col center" style={{ gap: 4 }}>
            <div className="tiny text-3">ESCROW</div>
            <b style={{ fontSize: "1.5rem" }}>{fmt(fintechProject.totalEscrow)}</b>
            <span className="badge badge-success">{fmt(released)} released · {fmt(locked)} locked 🔒</span>
          </div>
        </div>
        <div className="tabs mt-3">
          <span className="tab active">Board</span><span className="tab">Timeline</span><span className="tab">Milestones</span><span className="tab">Files</span><span className="tab">QA Reports</span><span className="tab">Commits</span><span className="tab">Settings</span>
        </div>
      </div>

      {/* Kanban */}
      <div className="kanban hide-scroll">
        <div className="kcol">
          <div className="kcol-head"><span className="dot" style={{ color: "var(--text-3)" }} /> Backlog <span className="text-3">· 2</span></div>
          <div className="kcard"><span className="badge badge-neutral tiny">SDMP-24</span><b className="small">Multi-currency support</b><div className="row between"><span className="avatar sm a2">MK</span><span className="tiny text-3">M3</span></div></div>
          <div className="kcard"><span className="badge badge-neutral tiny">SDMP-25</span><b className="small">CSV bulk import</b><div className="row between"><span className="avatar sm a2">MK</span><span className="tiny text-3">M3</span></div></div>
        </div>
        <div className="kcol">
          <div className="kcol-head"><span className="dot" style={{ color: "var(--primary)" }} /> To Do <span className="text-3">· 1</span></div>
          <div className="kcard"><span className="badge badge-primary tiny">SDMP-22</span><b className="small">Audit log viewer</b><div className="row between"><span className="avatar sm a2">MK</span><span className="tiny text-3">M3</span></div></div>
        </div>
        <div className="kcol">
          <div className="kcol-head"><span className="dot" style={{ color: "var(--secondary)" }} /> Doing <span className="text-3">· 1</span></div>
          <div className="kcard" style={{ borderColor: "var(--secondary)" }}><span className="badge badge-secondary tiny">SDMP-19</span><b className="small">Real-time chart streaming</b><div className="progress"><i style={{ width: "60%" }} /></div><div className="row between"><span className="avatar sm a2">MK</span><span className="tiny text-3">M2 · due Jul 10</span></div></div>
        </div>
        <div className="kcol">
          <div className="kcol-head"><span className="dot" style={{ color: "var(--warning)" }} /> Testing <span className="text-3">· 2</span></div>
          <div className="kcard" style={{ borderColor: "var(--warning)" }}><span className="badge badge-warning tiny">SDMP-17</span><b className="small">Export to PDF/Excel</b><div className="tiny text-3">🧪 2 minor bugs reported</div><div className="row between"><span className="avatar sm a3">RT</span><span className="tiny text-3">M2</span></div></div>
          <div className="kcard" style={{ borderColor: "var(--warning)" }}><span className="badge badge-warning tiny">SDMP-18</span><b className="small">Role-based dashboards</b><div className="tiny text-3">🧪 QA in progress…</div><div className="row between"><span className="avatar sm a3">RT</span><span className="tiny text-3">M2</span></div></div>
        </div>
        <div className="kcol">
          <div className="kcol-head"><span className="dot" style={{ color: "var(--success)" }} /> Completed <span className="text-3">· 3</span></div>
          <div className="kcard"><span className="badge badge-success tiny">SDMP-11</span><b className="small">Auth + 2FA</b><div className="tiny text-3">✓ QA passed · M1</div></div>
          <div className="kcard"><span className="badge badge-success tiny">SDMP-12</span><b className="small">Account overview screens</b><div className="tiny text-3">✓ QA passed · M1</div></div>
          <div className="kcard"><span className="badge badge-success tiny">SDMP-14</span><b className="small">Stripe billing integration</b><div className="tiny text-3">✓ QA passed · M1</div></div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        {/* Milestones */}
        <div className="card pad col">
          <div className="row between">
            <b className="h-md">Milestones &amp; escrow</b>
            <span className="small text-3">{milestones.length} milestones · {fmt(fintechProject.totalEscrow)} total</span>
          </div>
          <div className="steps mt-1">
            {milestones.map((m) => (
              <div key={m.id} className={`step ${m.state === "released" ? "done" : m.state === "in-qa" ? "now" : ""}`}>
                <span className="pt">{m.state === "released" ? "✓" : m.id}</span>
                <div className="flex1">
                  <div className="row between"><b className="small">{m.title}</b><b className="small">{fmt(m.amount)}</b></div>
                  <div className="tiny text-3">{m.detail}</div>
                  {m.state === "in-qa" && (
                    <div className="row gap-sm mt-1">
                      <button className="btn btn-success btn-sm" onClick={() => approve(m.id)}>Approve &amp; release</button>
                      <button className="btn btn-danger btn-sm" onClick={() => requestRevision(m.id)}>Request revision</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {revisionRequested && (
            <div className="card pad row between" style={{ padding: "12px 14px", borderColor: "var(--warning)" }}>
              <span className="small">📝 Revision requested — Maya Kim has been notified. Funds stay locked until QA re-verifies.</span>
            </div>
          )}
          {!inQa && !revisionRequested && (
            <div className="card pad row between" style={{ padding: "12px 14px", borderColor: "var(--success)" }}>
              <span className="small">✅ Milestone approved — {fmt(4000)} released to Maya Kim, QA fee paid to Rita Torres automatically.</span>
            </div>
          )}
        </div>

        <div className="col" style={{ gap: 20 }}>
          {/* QA report */}
          <div className="card pad col">
            <div className="row between"><b className="h-md">Latest QA report</b><span className="badge badge-warning">2 issues</span></div>
            <div className="row"><span className="avatar sm a3">RT</span><div className="small"><b>Rita Torres</b> · QA Specialist ★ 4.9<div className="tiny text-3">Submitted 1h ago · 32/34 acceptance checks passed</div></div></div>
            <div className="col gap-sm">
              <div className="card pad row between" style={{ padding: "10px 14px" }}><span className="small">🐛 PDF export clips long table rows</span><span className="badge badge-warning">Minor</span></div>
              <div className="card pad row between" style={{ padding: "10px 14px" }}><span className="small">🐛 Excel export: date locale mismatch</span><span className="badge badge-warning">Minor</span></div>
              <div className="card pad row between" style={{ padding: "10px 14px" }}><span className="small">📹 Full test session recording (14:32)</span><button className="btn btn-secondary btn-sm">Watch</button></div>
            </div>
            <div className="row between small"><span className="text-3">Performance score</span><b className="up">96 / 100</b></div>
            <div className="progress success"><i style={{ width: "96%" }} /></div>
          </div>

          {/* Commits */}
          <div className="card pad col">
            <div className="row between"><b className="h-md">Recent commits</b><span className="badge badge-neutral">GitHub ↗</span></div>
            <div className="commit"><code>b3f19c2</code><span className="flex1">fix: pdf export row clipping</span><span className="tiny text-3">10m</span></div>
            <div className="commit"><code>a97d044</code><span className="flex1">feat: streaming chart websocket layer</span><span className="tiny text-3">2h</span></div>
            <div className="commit"><code>7c21e8b</code><span className="flex1">feat: role-based dashboard routing</span><span className="tiny text-3">1d</span></div>
            <div className="commit"><code>52aa9f1</code><span className="flex1">chore: bump go 1.24, react 19</span><span className="tiny text-3">2d</span></div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
