import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { requireRole } from "@/lib/auth";
import { readDb } from "@/lib/db";

const sparkHeights = [34, 41, 38, 52, 47, 58, 55, 64, 61, 72, 69, 78, 83, 90];

export default async function Admin() {
  const user = await requireRole("admin");
  const db = await readDb();
  const audit = [...db.audit].slice(-5).reverse();
  return (
    <div className="app">
      <aside className="sidebar">
        <Link className="side-brand" href="/">
          <span className="logo-mark" style={{ background: "linear-gradient(135deg,#EF4444,#F59E0B)" }}>S</span> SDMP <span className="badge badge-danger">Admin</span>
        </Link>
        <div className="side-label">Overview</div>
        <a className="side-link active" href="#">📈 Dashboard</a>
        <a className="side-link" href="#">👥 Users</a>
        <a className="side-link" href="#">📁 Projects</a>
        <div className="side-label">Finance</div>
        <a className="side-link" href="#">🔒 Escrow <span className="badge badge-primary">$4.2M</span></a>
        <a className="side-link" href="#">💳 Transactions</a>
        <a className="side-link" href="#">💰 Revenue</a>
        <div className="side-label">Trust &amp; Safety</div>
        <a className="side-link" href="#">⚖️ Disputes <span className="badge badge-danger">7</span></a>
        <a className="side-link" href="#">🪪 Verifications <span className="badge badge-warning">23</span></a>
        <a className="side-link" href="#">🚩 Reports <span className="badge badge-warning">12</span></a>
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
          <select className="input" style={{ width: "auto", padding: "7px 12px" }} defaultValue="Last 30 days">
            <option>Last 30 days</option><option>Quarter</option><option>Year</option>
          </select>
          <span className="avatar a3" title={user.email}>{user.initials}</span>
        </div>

        <div className="content">
          <div className="grid g4">
            <div className="card stat"><span className="k">Platform Revenue</span><span className="v">$412K</span><span className="d up">▲ 12.4% MoM</span></div>
            <div className="card stat"><span className="k">Escrow Under Management</span><span className="v">$4.21M</span><span className="d up">▲ 8.1% MoM</span></div>
            <div className="card stat"><span className="k">Active Users</span><span className="v">61,204</span><span className="d up">▲ 2,180 new</span></div>
            <div className="card stat"><span className="k">Open Disputes</span><span className="v">7</span><span className="d down">▲ 2 vs last week</span></div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
            <div className="card pad col">
              <div className="row between">
                <b className="h-md">Revenue &amp; escrow flow</b>
                <div className="row gap-sm tiny text-3"><span className="badge badge-primary">Service fees</span><span className="badge badge-accent">Subscriptions</span></div>
              </div>
              <div className="spark">
                {sparkHeights.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}
              </div>
              <div className="row between tiny text-3"><span>Jun 18</span><span>Jun 25</span><span>Jul 2</span></div>
              <hr className="divider" />
              <div className="grid g3">
                <div><div className="tiny text-3">GMV (30d)</div><b>$8.6M</b></div>
                <div><div className="tiny text-3">Avg. take rate</div><b>6.2%</b></div>
                <div><div className="tiny text-3">Refund rate</div><b className="up">0.8%</b></div>
              </div>
            </div>

            <div className="card pad col">
              <div className="row between"><b className="h-md">Verification queue</b><span className="badge badge-warning">23 pending</span></div>
              {[
                { i: "JW", c: "a5", n: "Jonas Weber", d: "KYC + GitHub · DevOps" },
                { i: "LN", c: "a4", n: "Lina Novak", d: "KYC + Portfolio · UI/UX" },
                { i: "KP", c: "a2", n: "Kofi Prempeh", d: "KYC docs resubmitted · QA" },
              ].map((v) => (
                <div key={v.n} className="card pad row between" style={{ padding: "12px 14px" }}>
                  <div className="row"><span className={`avatar sm ${v.c}`}>{v.i}</span><div className="small"><b>{v.n}</b><div className="tiny text-3">{v.d}</div></div></div>
                  <div className="row gap-sm"><button className="btn btn-success btn-sm">Approve</button><button className="btn btn-danger btn-sm">Reject</button></div>
                </div>
              ))}
              <a className="small center" style={{ color: "var(--primary)" }} href="#">View all →</a>
            </div>
          </div>

          <div className="card pad col">
            <div className="row between"><b className="h-md">⚖️ Active disputes</b><span className="small text-3">SLA: first response &lt; 4h</span></div>
            <table className="table">
              <thead><tr><th>Case</th><th>Project</th><th>Parties</th><th>Escrow at stake</th><th>Age</th><th>Status</th><th></th></tr></thead>
              <tbody>
                <tr>
                  <td className="mono">DSP-3041</td><td>NFT Marketplace API</td><td className="small">TechNova ↔ R. Silva</td><td className="mono">$7,500</td><td>2d</td>
                  <td><span className="badge badge-danger">Escalated</span></td>
                  <td className="row gap-sm"><button className="btn btn-secondary btn-sm">Review</button><button className="btn btn-danger btn-sm">Freeze funds</button></td>
                </tr>
                <tr>
                  <td className="mono">DSP-3038</td><td>Inventory ERP Module</td><td className="small">Grayline ↔ P. Mehta</td><td className="mono">$3,200</td><td>1d</td>
                  <td><span className="badge badge-warning">Evidence review</span></td>
                  <td className="row gap-sm"><button className="btn btn-secondary btn-sm">Review</button><button className="btn btn-success btn-sm">Propose split</button></td>
                </tr>
                <tr>
                  <td className="mono">DSP-3036</td><td>Shopify Theme Rework</td><td className="small">Bloom &amp; Co ↔ T. Zhao</td><td className="mono">$980</td><td>6h</td>
                  <td><span className="badge badge-primary">Mediation</span></td>
                  <td className="row gap-sm"><button className="btn btn-secondary btn-sm">Review</button><button className="btn btn-success btn-sm">Release</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid g3">
            <div className="card pad col gap-sm">
              <b className="h-md">🛡️ Fraud signals (24h)</b>
              <div className="row between small"><span className="text-2">Blocked payment attempts</span><b>14</b></div>
              <div className="row between small"><span className="text-2">Duplicate-identity flags</span><b>3</b></div>
              <div className="row between small"><span className="text-2">Off-platform payment hints</span><b>9</b></div>
              <div className="progress warning"><i style={{ width: "22%" }} /></div>
              <span className="tiny text-3">Risk index 22/100 — normal range</span>
            </div>
            <div className="card pad col gap-sm">
              <b className="h-md">🧪 QA network health</b>
              <div className="row between small"><span className="text-2">Active testers</span><b>2,140</b></div>
              <div className="row between small"><span className="text-2">Avg. turnaround</span><b>11.4h</b></div>
              <div className="row between small"><span className="text-2">Tester accuracy</span><b className="up">97.2%</b></div>
              <div className="progress success"><i style={{ width: "97%" }} /></div>
              <span className="tiny text-3">First-pass approval rate 84%</span>
            </div>
            <div className="card pad col gap-sm">
              <b className="h-md">📋 Audit log (live)</b>
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
