import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import { readDb, type Project } from "@/lib/db";

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

const STATUS_BADGE: Record<Project["status"], { cls: string; label: string }> = {
  proposals: { cls: "badge-accent", label: "Reviewing proposals" },
  "in-progress": { cls: "badge-primary", label: "In Progress" },
  "in-qa": { cls: "badge-warning", label: "In QA" },
  revision: { cls: "badge-warning", label: "Revision" },
  completed: { cls: "badge-success", label: "Completed" },
};

export default async function Dashboard() {
  const user = await requireUser();
  const db = await readDb();
  const projects = db.projects.filter((p) => p.clientId === user.id || user.role === "admin");

  const active = projects.filter((p) => p.status !== "completed");
  const lockedTotal = projects
    .flatMap((p) => p.milestones)
    .filter((m) => m.state !== "released")
    .reduce((s, m) => s + m.amount, 0);
  const releasedTotal = db.ledger
    .filter((t) => t.type === "release")
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const needsApproval = projects.flatMap((p) =>
    p.milestones.filter((m) => m.state === "in-qa").map((m) => ({ project: p, milestone: m })),
  );
  const inRevision = projects.flatMap((p) =>
    p.milestones.filter((m) => m.state === "revision").map((m) => ({ project: p, milestone: m })),
  );

  return (
    <AppShell
      active="dashboard"
      user={user}
      topbar={
        <>
          <div className="search-bar flex1" style={{ maxWidth: 440, padding: "8px 16px" }}>
            🔍 <input placeholder="Search projects, developers, messages…" />
          </div>
          <div style={{ flex: 1 }} />
        </>
      }
    >
      <div className="row between">
        <div>
          <h1 className="h-xl">Good morning, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-2">Here&apos;s what&apos;s happening across your projects.</p>
        </div>
        <span className="badge badge-success"><span className="dot pulse" /> All systems normal</span>
      </div>

      <div className="grid g4">
        <div className="card stat"><span className="k">Active Projects</span><span className="v">{active.length}</span><span className="d text-3">{projects.length} total</span></div>
        <div className="card stat"><span className="k">In Escrow</span><span className="v">{fmt(lockedTotal)}</span><span className="d text-3">across {active.length} projects</span></div>
        <div className="card stat"><span className="k">Released All-Time</span><span className="v">{fmt(releasedTotal)}</span><span className="d up">▲ escrow verified</span></div>
        <div className="card stat"><span className="k">Awaiting Your Approval</span><span className="v">{needsApproval.length}</span><span className="d text-3">milestones in QA</span></div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="card pad col">
          <div className="row between"><b className="h-md">Active projects</b><Link className="small" style={{ color: "var(--primary)" }} href="/post-project">+ Post a project</Link></div>
          <div className="col">
            {projects.length === 0 && (
              <div className="card pad center col" style={{ gap: 10, padding: 36 }}>
                <span style={{ fontSize: "1.8rem" }}>📁</span>
                <b>No projects yet</b>
                <p className="small text-3">Post your first project and fund escrow to get matched with developers.</p>
                <Link className="btn btn-primary btn-sm" href="/post-project">Post a project</Link>
              </div>
            )}
            {projects.map((p) => {
              const total = p.milestones.reduce((s, m) => s + m.amount, 0);
              const released = p.milestones.filter((m) => m.state === "released").reduce((s, m) => s + m.amount, 0);
              const pct = total ? Math.round((released / total) * 100) : 0;
              const badge = STATUS_BADGE[p.status];
              const releasedCount = p.milestones.filter((m) => m.state === "released").length;
              return (
                <Link key={p.id} className="card hover pad row" href={`/project?id=${p.id}`} style={{ gap: 16 }}>
                  <span className={`avatar ${p.avatarClass}`}>{p.developerInitials}</span>
                  <div className="flex1">
                    <div className="row between"><b>{p.title}</b><span className={`badge ${badge.cls}`}>{badge.label}</span></div>
                    <div className="small text-3">
                      {p.developerName} · Milestone {Math.min(releasedCount + 1, p.milestones.length)} of {p.milestones.length} · due {p.dueDate}
                    </div>
                    <div className={`progress mt-1${p.status === "completed" ? " success" : ""}`}><i style={{ width: `${pct}%` }} /></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="col" style={{ gap: 20 }}>
          <div className="card pad col" style={{ borderColor: "var(--warning)" }}>
            <b className="h-md">⚡ Needs your action</b>
            <div className="col gap-sm">
              {needsApproval.length === 0 && inRevision.length === 0 && (
                <p className="small text-3">Nothing waiting on you — all milestones are moving. 🎉</p>
              )}
              {needsApproval.map(({ project, milestone }) => (
                <div key={project.id + milestone.id} className="row between card pad" style={{ padding: "12px 14px" }}>
                  <div className="small"><b>Approve {milestone.title.split(" — ")[0]}</b><div className="tiny text-3">{project.title} · QA passed ✓</div></div>
                  <Link className="btn btn-success btn-sm" href={`/project?id=${project.id}`}>Review</Link>
                </div>
              ))}
              {inRevision.map(({ project, milestone }) => (
                <div key={project.id + milestone.id} className="row between card pad" style={{ padding: "12px 14px" }}>
                  <div className="small"><b>{milestone.title.split(" — ")[0]} in revision</b><div className="tiny text-3">{project.title} · developer notified</div></div>
                  <Link className="btn btn-secondary btn-sm" href={`/project?id=${project.id}`}>Track</Link>
                </div>
              ))}
            </div>
          </div>

          <div className="card pad col">
            <div className="row between"><b className="h-md">Messages</b><Link className="small" style={{ color: "var(--primary)" }} href="/messages">Open inbox →</Link></div>
            {db.messages.slice(-3).reverse().map((m) => (
              <Link key={m.id} className="row" href="/messages">
                <span className="avatar sm a2">{m.senderInitials}</span>
                <div className="flex1 small">
                  <b>{m.senderName}</b>
                  <div className="text-3" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.text}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="card pad col" style={{ background: "var(--grad-brand)", border: 0, color: "#fff" }}>
            <div className="row between"><b>Wallet</b><Link className="tiny" style={{ color: "rgba(255,255,255,.8)" }} href="/wallet">Manage →</Link></div>
            <div>
              <div className="tiny" style={{ color: "rgba(255,255,255,.7)" }}>ESCROW BALANCE</div>
              <div style={{ fontSize: "1.9rem", fontWeight: 800 }}>{fmt(lockedTotal)}</div>
            </div>
            <div className="row small" style={{ color: "rgba(255,255,255,.85)" }}>
              <span>🔒 Locked: {fmt(lockedTotal - needsApproval.reduce((s, n) => s + n.milestone.amount, 0))}</span>
              <span>· Releasable: {fmt(needsApproval.reduce((s, n) => s + n.milestone.amount, 0))}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card pad col">
        <b className="h-md">Recent activity</b>
        <table className="table">
          <thead><tr><th>Date</th><th>Event</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {db.ledger.slice(-6).reverse().map((t) => (
              <tr key={t.id}>
                <td className="mono">{t.date}</td>
                <td>{t.description}</td>
                <td className="mono">{t.amount < 0 ? "-" : "+"}{fmt(Math.abs(t.amount))}</td>
                <td><span className={`badge ${t.status === "Locked" ? "badge-primary" : "badge-success"}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
