import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function Dashboard() {
  return (
    <AppShell
      active="dashboard"
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
          <h1 className="h-xl">Good morning, Andre 👋</h1>
          <p className="text-2">Here&apos;s what&apos;s happening across your projects.</p>
        </div>
        <span className="badge badge-success"><span className="dot pulse" /> All systems normal</span>
      </div>

      <div className="grid g4">
        <div className="card stat"><span className="k">Active Projects</span><span className="v">4</span><span className="d up">▲ 1 this month</span></div>
        <div className="card stat"><span className="k">In Escrow</span><span className="v">$27,500</span><span className="d text-3">across 4 projects</span></div>
        <div className="card stat"><span className="k">Released This Month</span><span className="v">$9,200</span><span className="d up">▲ 18% vs May</span></div>
        <div className="card stat"><span className="k">Avg. Milestone Approval</span><span className="v">1.8 days</span><span className="d up">▼ 0.4 days faster</span></div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="card pad col">
          <div className="row between"><b className="h-md">Active projects</b><Link className="small" style={{ color: "var(--primary)" }} href="/project">View all →</Link></div>
          <div className="col">
            <Link className="card hover pad row" href="/project" style={{ gap: 16 }}>
              <span className="avatar a2">FD</span>
              <div className="flex1">
                <div className="row between"><b>Fintech Dashboard</b><span className="badge badge-warning">In QA</span></div>
                <div className="small text-3">Maya Kim · Milestone 2 of 3 · due Jul 14</div>
                <div className="progress mt-1"><i style={{ width: "66%" }} /></div>
              </div>
            </Link>
            <Link className="card hover pad row" href="/project" style={{ gap: 16 }}>
              <span className="avatar a4">FA</span>
              <div className="flex1">
                <div className="row between"><b>Fitness App (iOS/Android)</b><span className="badge badge-primary">In Progress</span></div>
                <div className="small text-3">Diego Alvarez · Milestone 1 of 4 · due Jul 22</div>
                <div className="progress mt-1"><i style={{ width: "25%" }} /></div>
              </div>
            </Link>
            <Link className="card hover pad row" href="/project" style={{ gap: 16 }}>
              <span className="avatar a3">AI</span>
              <div className="flex1">
                <div className="row between"><b>Support AI Agent</b><span className="badge badge-accent">Reviewing proposals</span></div>
                <div className="small text-3">31 proposals · budget $6,000–$9,500</div>
                <div className="progress mt-1"><i style={{ width: "8%" }} /></div>
              </div>
            </Link>
            <Link className="card hover pad row" href="/project" style={{ gap: 16 }}>
              <span className="avatar a5">MW</span>
              <div className="flex1">
                <div className="row between"><b>Marketing Website</b><span className="badge badge-success">Completed</span></div>
                <div className="small text-3">Delivered Jun 20 · ★ 5.0 review left</div>
                <div className="progress success mt-1"><i style={{ width: "100%" }} /></div>
              </div>
            </Link>
          </div>
        </div>

        <div className="col" style={{ gap: 20 }}>
          <div className="card pad col" style={{ borderColor: "var(--warning)" }}>
            <b className="h-md">⚡ Needs your action</b>
            <div className="col gap-sm">
              <div className="row between card pad" style={{ padding: "12px 14px" }}>
                <div className="small"><b>Approve Milestone 2</b><div className="tiny text-3">Fintech Dashboard · QA passed ✓</div></div>
                <Link className="btn btn-success btn-sm" href="/project">Review</Link>
              </div>
              <div className="row between card pad" style={{ padding: "12px 14px" }}>
                <div className="small"><b>Choose a QA tester</b><div className="tiny text-3">Fitness App · 6 testers available</div></div>
                <Link className="btn btn-secondary btn-sm" href="/browse">Assign</Link>
              </div>
            </div>
          </div>

          <div className="card pad col">
            <div className="row between"><b className="h-md">Messages</b><Link className="small" style={{ color: "var(--primary)" }} href="/messages">Open inbox →</Link></div>
            <Link className="row" href="/messages"><span className="avatar sm a2">MK</span><div className="flex1 small"><b>Maya Kim</b><div className="text-3" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Pushed the charting module — ready for QA 🎉</div></div><span className="tiny text-3">2m</span></Link>
            <Link className="row" href="/messages"><span className="avatar sm a3">RT</span><div className="flex1 small"><b>Rita Torres (QA)</b><div className="text-3" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Found 2 minor bugs in the export flow, report attached</div></div><span className="tiny text-3">1h</span></Link>
            <Link className="row" href="/messages"><span className="avatar sm a4">DA</span><div className="flex1 small"><b>Diego Alvarez</b><div className="text-3" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Daily update: auth + onboarding screens done</div></div><span className="tiny text-3">3h</span></Link>
          </div>

          <div className="card pad col" style={{ background: "var(--grad-brand)", border: 0, color: "#fff" }}>
            <div className="row between"><b>Wallet</b><Link className="tiny" style={{ color: "rgba(255,255,255,.8)" }} href="/wallet">Manage →</Link></div>
            <div>
              <div className="tiny" style={{ color: "rgba(255,255,255,.7)" }}>ESCROW BALANCE</div>
              <div style={{ fontSize: "1.9rem", fontWeight: 800 }}>$27,500.00</div>
            </div>
            <div className="row small" style={{ color: "rgba(255,255,255,.85)" }}><span>🔒 Locked: $23,500</span><span>· Releasable: $4,000</span></div>
          </div>
        </div>
      </div>

      <div className="card pad col">
        <b className="h-md">Recent activity</b>
        <table className="table">
          <thead><tr><th>Event</th><th>Project</th><th>Amount</th><th>When</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>✅ QA report passed (34/34 checks)</td><td>Fintech Dashboard</td><td className="mono">—</td><td>12 min ago</td><td><span className="badge badge-success">Passed</span></td></tr>
            <tr><td>🔒 Escrow funded — Milestone 1</td><td>Fitness App</td><td className="mono">$5,000.00</td><td>Yesterday</td><td><span className="badge badge-primary">Locked</span></td></tr>
            <tr><td>💸 Payment released — Milestone 1</td><td>Fintech Dashboard</td><td className="mono">$4,000.00</td><td>Jun 26</td><td><span className="badge badge-success">Released</span></td></tr>
            <tr><td>📝 New proposal from Amara Okafor</td><td>Support AI Agent</td><td className="mono">$8,200.00</td><td>Jun 25</td><td><span className="badge badge-neutral">Pending</span></td></tr>
            <tr><td>⭐ You rated Maya Kim ★★★★★</td><td>Marketing Website</td><td className="mono">—</td><td>Jun 20</td><td><span className="badge badge-accent">Review</span></td></tr>
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
