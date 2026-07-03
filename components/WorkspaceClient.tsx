"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import AppShell from "@/components/AppShell";
import { approveMilestone, requestRevision, resubmitMilestone, submitMilestone } from "@/app/actions";
import type { Milestone, Project, SafeUser } from "@/lib/db";

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

const STATUS_BADGE: Record<Project["status"], { cls: string; label: string }> = {
  proposals: { cls: "badge-accent", label: "Reviewing proposals" },
  "in-progress": { cls: "badge-primary", label: "In Progress" },
  "in-qa": { cls: "badge-warning", label: "In QA" },
  revision: { cls: "badge-warning", label: "Revision" },
  completed: { cls: "badge-success", label: "Completed" },
};

function KanbanCard({ m, project }: { m: Milestone; project: Project }) {
  const border =
    m.state === "in-qa" || m.state === "revision"
      ? "var(--warning)"
      : m.state === "released"
        ? undefined
        : undefined;
  return (
    <div className="kcard" style={border ? { borderColor: border } : undefined}>
      <span className={`badge tiny ${m.state === "released" ? "badge-success" : m.state === "locked" ? "badge-neutral" : "badge-warning"}`}>
        M{m.id}
      </span>
      <b className="small">{m.title.replace(/^M\d+ — /, "")}</b>
      <div className="tiny text-3">{m.state === "released" ? "✓ Released" : m.detail}</div>
      <div className="row between">
        <span className={`avatar sm ${project.avatarClass}`}>{project.developerInitials}</span>
        <span className="tiny text-3">{fmt(m.amount)}</span>
      </div>
    </div>
  );
}

export default function WorkspaceClient({ user, project }: { user: SafeUser; project: Project }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const total = project.milestones.reduce((s, m) => s + m.amount, 0);
  const released = project.milestones.filter((m) => m.state === "released").reduce((s, m) => s + m.amount, 0);
  const locked = total - released;
  const badge = STATUS_BADGE[project.status];
  const inQa = project.milestones.filter((m) => m.state === "in-qa" || m.state === "revision");
  const todo = project.milestones.filter((m) => m.state === "locked");
  const done = project.milestones.filter((m) => m.state === "released");
  const anyInQa = inQa.some((m) => m.state === "in-qa");

  function run(action: () => Promise<{ error?: string }>, successNotice: string) {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const res = await action();
      if (res?.error) setError(res.error);
      else setNotice(successNotice);
      router.refresh();
    });
  }

  return (
    <AppShell
      active="projects"
      user={user}
      topbar={
        <>
          <Link className="small text-3" href="/dashboard">Projects /</Link>
          <b>{project.title.split(" · ")[0]}</b>
          <span className={`badge ${badge.cls}`}>{badge.label}</span>
          <div style={{ flex: 1 }} />
          <button className="btn btn-secondary btn-sm">🎥 Start call</button>
        </>
      }
    >
      {/* Project header */}
      <div className="card pad">
        <div className="row between wrap" style={{ gap: 18 }}>
          <div className="row" style={{ gap: 16 }}>
            <span className={`avatar lg ${project.avatarClass}`}>{project.developerInitials}</span>
            <div>
              <b className="h-lg">{project.title}</b>
              <div className="small text-3">
                Developer: {project.developerName} · QA: {project.testerName} · {project.visibility} · due {project.dueDate}
              </div>
              <div className="row gap-sm mt-1 wrap">
                {project.stack.map((s) => <span key={s} className="badge badge-neutral">{s}</span>)}
              </div>
            </div>
          </div>
          <div className="col center" style={{ gap: 4 }}>
            <div className="tiny text-3">ESCROW</div>
            <b style={{ fontSize: "1.5rem" }}>{fmt(total)}</b>
            <span className="badge badge-success">{fmt(released)} released · {fmt(locked)} locked 🔒</span>
          </div>
        </div>
        <div className="tabs mt-3">
          <span className="tab active">Board</span><span className="tab">Timeline</span><span className="tab">Milestones</span><span className="tab">Files</span><span className="tab">QA Reports</span><span className="tab">Commits</span><span className="tab">Settings</span>
        </div>
      </div>

      {/* Kanban — derived from milestone states */}
      <div className="kanban hide-scroll">
        <div className="kcol">
          <div className="kcol-head"><span className="dot" style={{ color: "var(--text-3)" }} /> Backlog <span className="text-3">· 0</span></div>
          <div className="tiny text-3" style={{ padding: "6px 8px" }}>Tasks land here as the team breaks milestones down.</div>
        </div>
        <div className="kcol">
          <div className="kcol-head"><span className="dot" style={{ color: "var(--primary)" }} /> To Do <span className="text-3">· {todo.length}</span></div>
          {todo.map((m) => <KanbanCard key={m.id} m={m} project={project} />)}
        </div>
        <div className="kcol">
          <div className="kcol-head"><span className="dot" style={{ color: "var(--secondary)" }} /> Doing <span className="text-3">· 0</span></div>
        </div>
        <div className="kcol">
          <div className="kcol-head"><span className="dot" style={{ color: "var(--warning)" }} /> Testing <span className="text-3">· {inQa.length}</span></div>
          {inQa.map((m) => <KanbanCard key={m.id} m={m} project={project} />)}
        </div>
        <div className="kcol">
          <div className="kcol-head"><span className="dot" style={{ color: "var(--success)" }} /> Completed <span className="text-3">· {done.length}</span></div>
          {done.map((m) => <KanbanCard key={m.id} m={m} project={project} />)}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        {/* Milestones — the live escrow state machine */}
        <div className="card pad col">
          <div className="row between">
            <b className="h-md">Milestones &amp; escrow</b>
            <span className="small text-3">{project.milestones.length} milestones · {fmt(total)} total</span>
          </div>
          <div className="steps mt-1">
            {project.milestones.map((m, idx) => {
              const earlierReleased = project.milestones.slice(0, idx).every((x) => x.state === "released");
              return (
                <div key={m.id} className={`step ${m.state === "released" ? "done" : m.state === "in-qa" || m.state === "revision" ? "now" : ""}`}>
                  <span className="pt">{m.state === "released" ? "✓" : m.id}</span>
                  <div className="flex1">
                    <div className="row between"><b className="small">{m.title}</b><b className="small">{fmt(m.amount)}</b></div>
                    <div className="tiny text-3">{m.detail}</div>
                    {m.state === "in-qa" && (
                      <div className="row gap-sm mt-1">
                        <button className="btn btn-success btn-sm" disabled={pending}
                          onClick={() => run(() => approveMilestone(project.id, m.id), `Milestone approved — ${fmt(m.amount)} released, QA fee paid automatically.`)}>
                          {pending ? "Releasing…" : "Approve & release"}
                        </button>
                        <button className="btn btn-danger btn-sm" disabled={pending}
                          onClick={() => run(() => requestRevision(project.id, m.id), "Revision requested — developer notified. Funds stay locked until QA re-verifies.")}>
                          Request revision
                        </button>
                      </div>
                    )}
                    {m.state === "revision" && (
                      <div className="row gap-sm mt-1">
                        <button className="btn btn-secondary btn-sm" disabled={pending}
                          onClick={() => run(() => resubmitMilestone(project.id, m.id), "Resubmitted — back in QA for re-verification.")}>
                          Developer resubmit → QA
                        </button>
                      </div>
                    )}
                    {m.state === "locked" && earlierReleased && (
                      <div className="row gap-sm mt-1">
                        <button className="btn btn-secondary btn-sm" disabled={pending}
                          onClick={() => run(() => submitMilestone(project.id, m.id), "Milestone submitted — now in QA awaiting verification.")}>
                          Developer submit → QA
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {error && (
            <div className="card pad row" style={{ padding: "12px 14px", borderColor: "var(--danger)" }}>
              <span className="small" style={{ color: "var(--danger)" }}>⚠️ {error}</span>
            </div>
          )}
          {notice && !error && (
            <div className="card pad row" style={{ padding: "12px 14px", borderColor: "var(--success)" }}>
              <span className="small">✅ {notice}</span>
            </div>
          )}
        </div>

        <div className="col" style={{ gap: 20 }}>
          <div className="card pad col">
            <div className="row between"><b className="h-md">QA reports</b><span className={`badge ${anyInQa ? "badge-warning" : "badge-neutral"}`}>{anyInQa ? "In progress" : "None yet"}</span></div>
            {anyInQa ? (
              <p className="small text-2">🧪 QA verification is in progress. The tester&apos;s report — acceptance checks, bug list, recordings, and a pass/fail verdict — appears here when submitted.</p>
            ) : (
              <p className="small text-3">Reports appear here when a milestone enters QA. Every milestone is verified by an independent tester before escrow releases.</p>
            )}
          </div>

          <div className="card pad col">
            <div className="row between"><b className="h-md">Repository</b><span className="badge badge-neutral">Not connected</span></div>
            <p className="small text-3">Connect GitHub, GitLab, or Bitbucket to see commits, branches, and PRs alongside milestones.</p>
            <button className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start" }}>🐙 Connect repository</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
