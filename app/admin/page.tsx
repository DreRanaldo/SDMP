import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { requireRole } from "@/lib/auth";
import { readDb } from "@/lib/db";

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

export default async function Admin() {
  const user = await requireRole("admin");
  const db = await readDb();
  const audit = [...db.audit].slice(-8).reverse();

  const escrowUnderMgmt = db.projects
    .flatMap((p) => p.milestones)
    .filter((m) => m.state !== "released")
    .reduce((s, m) => s + m.amount, 0);
  const platformRevenue = db.ledger
    .filter((t) => t.type === "fee" || t.type === "qa-fee")
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const gmv = db.ledger.filter((t) => t.type === "deposit").reduce((s, t) => s + t.amount, 0);
  const releasedTotal = db.ledger.filter((t) => t.type === "release").reduce((s, t) => s + Math.abs(t.amount), 0);
  const inQaCount = db.projects.flatMap((p) => p.milestones).filter((m) => m.state === "in-qa").length;

  return (
    <div className="app">
      <aside className="sidebar">
        <Link className="side-brand" href="/">
          <span className="logo-mark" style={{ background: "linear-gradient(135deg,#EF4444,#F59E0B)" }}>S</span> SDMP <span className="badge badge-danger">Admin</span>
        </Link>
        <div className="side-label">Overview</div>
        <a className="side-link active" href="#">📈 Dashboard</a>
        <a className="side-link" href="#">👥 Users <span className="badge badge-neutral">{db.users.length}</span></a>
        <a className="side-link" href="#">📁 Projects <span className="badge badge-neutral">{db.projects.length}</span></a>
        <div className="side-label">Finance</div>
        <a className="side-link" href="#">🔒 Escrow <span className="badge badge-primary">{fmt(escrowUnderMgmt)}</span></a>
        <a className="side-link" href="#">💳 Transactions <span className="badge badge-neutral">{db.ledger.length}</span></a>
        <a className="side-link" href="#">💰 Revenue</a>
        <div className="side-label">Trust &amp; Safety</div>
        <a className="side-link" href="#">⚖️ Disputes <span className="badge badge-neutral">0</span></a>
        <a className="side-link" href="#">🪪 Verifications <span className="badge badge-neutral">0</span></a>
        <a className="side-link" href="#">🚩 Reports <span className="badge badge-neutral">0</span></a>
        <a className="side-link" href="#">🛡️ Fraud detection</a>
        <a className="side-link" href="#">🧹 Moderation</a>
        <div className="side-label">Growth</div>
        <a className="side-link" href="#">⭐ Featured listings</a>
        <a className="side-link" href="#">📊 Analytics</a>
        <div style={{ flex: 1 }} />
        <Link className="side-link" href="/dashboard">← Exit admin</Link>
      </aside>

      <div className="main">
        <div className="topbar">
          <b>Platform Overview</b>
          <span className="badge badge-success"><span className="dot pulse" /> Live</span>
          <div style={{ flex: 1 }} />
          <ThemeToggle />
          <span className="avatar a3" title={user.email}>{user.initials}</span>
        </div>

        <div className="content">
          <div className="grid g4">
            <div className="card stat"><span className="k">Platform Revenue</span><span className="v">{fmt(platformRevenue)}</span><span className="d text-3">fees + QA payouts</span></div>
            <div className="card stat"><span className="k">Escrow Under Management</span><span className="v">{fmt(escrowUnderMgmt)}</span><span className="d text-3">locked across projects</span></div>
            <div className="card stat"><span className="k">Users</span><span className="v">{db.users.length}</span><span className="d text-3">{db.projects.length} projects</span></div>
            <div className="card stat"><span className="k">Milestones in QA</span><span className="v">{inQaCount}</span><span className="d text-3">0 open disputes</span></div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
            <div className="card pad col">
              <b className="h-md">Escrow flow</b>
              <div className="grid g3">
                <div><div className="tiny text-3">DEPOSITED (GMV)</div><b>{fmt(gmv)}</b></div>
                <div><div className="tiny text-3">RELEASED</div><b>{fmt(releasedTotal)}</b></div>
                <div><div className="tiny text-3">HELD</div><b>{fmt(escrowUnderMgmt)}</b></div>
              </div>
              <div className="progress mt-1"><i style={{ width: gmv ? `${Math.min(100, Math.round((releasedTotal / gmv) * 100))}%` : "0%" }} /></div>
              <span className="tiny text-3">{gmv ? `${Math.round((releasedTotal / gmv) * 100)}% of deposited funds released after QA + approval` : "Charts populate as escrow moves through the platform."}</span>
            </div>

            <div className="card pad col">
              <div className="row between"><b className="h-md">Verification queue</b><span className="badge badge-neutral">0 pending</span></div>
              <p className="small text-3">KYC requests appear here when developers and testers submit identity documents for the Verified badge.</p>
            </div>
          </div>

          <div className="card pad col">
            <div className="row between"><b className="h-md">👥 Users</b><span className="small text-3">newest first</span></div>
            <table className="table">
              <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
              <tbody>
                {[...db.users].reverse().map((u) => (
                  <tr key={u.id}>
                    <td><b>{u.name}</b></td>
                    <td className="mono">{u.email}</td>
                    <td><span className={`badge ${u.role === "admin" ? "badge-danger" : "badge-primary"}`}>{u.role}</span></td>
                    <td className="mono">{new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid g3">
            <div className="card pad col gap-sm">
              <b className="h-md">⚖️ Disputes</b>
              <p className="small text-3">No active disputes. Escrow arbitration cases appear here with freeze, split, and release controls.</p>
            </div>
            <div className="card pad col gap-sm">
              <b className="h-md">🛡️ Fraud signals (24h)</b>
              <div className="row between small"><span className="text-2">Blocked payment attempts</span><b>0</b></div>
              <div className="row between small"><span className="text-2">Duplicate-identity flags</span><b>0</b></div>
              <div className="progress success"><i style={{ width: "2%" }} /></div>
              <span className="tiny text-3">Risk index nominal</span>
            </div>
            <div className="card pad col gap-sm">
              <b className="h-md">📋 Audit log (live)</b>
              {audit.length === 0 && <p className="tiny text-3">Every registration, escrow movement, and admin action lands here.</p>}
              {audit.map((e) => (
                <div key={e.id} className="tiny mono text-2">{e.at} {e.text}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
