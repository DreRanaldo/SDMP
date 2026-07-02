import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function Wallet() {
  return (
    <AppShell
      active="wallet"
      topbar={
        <>
          <b>Wallet &amp; Escrow</b>
          <div style={{ flex: 1 }} />
          <button className="btn btn-secondary btn-sm">Withdraw</button>
        </>
      }
    >
      <div className="grid g4">
        <div className="card stat" style={{ background: "var(--grad-brand)", border: 0, color: "#fff" }}>
          <span className="k" style={{ color: "rgba(255,255,255,.7)" }}>Total Balance</span>
          <span className="v">$31,742.50</span>
          <span className="d" style={{ color: "rgba(255,255,255,.85)" }}>USD · multi-currency enabled</span>
        </div>
        <div className="card stat"><span className="k">🔒 Locked in Escrow</span><span className="v">$23,500</span><span className="d text-3">4 active projects</span></div>
        <div className="card stat"><span className="k">Releasable</span><span className="v" style={{ color: "var(--success)" }}>$4,000</span><span className="d text-3">pending your approval</span></div>
        <div className="card stat"><span className="k">Available</span><span className="v">$4,242.50</span><span className="d text-3">withdraw anytime</span></div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="card pad col">
          <b className="h-md">Escrow by project</b>
          <table className="table">
            <thead><tr><th>Project</th><th>Total</th><th>Released</th><th>Locked</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td><b>Fintech Dashboard</b><div className="tiny text-3">Maya Kim</div></td><td className="mono">$12,000</td><td className="mono up">$8,000</td><td className="mono">$4,000</td><td><span className="badge badge-warning">M2 in QA</span></td></tr>
              <tr><td><b>Fitness App</b><div className="tiny text-3">Diego Alvarez</div></td><td className="mono">$18,000</td><td className="mono up">$0</td><td className="mono">$18,000</td><td><span className="badge badge-primary">M1 active</span></td></tr>
              <tr><td><b>Support AI Agent</b><div className="tiny text-3">Unassigned</div></td><td className="mono">$1,500</td><td className="mono up">$0</td><td className="mono">$1,500</td><td><span className="badge badge-neutral">Deposit hold</span></td></tr>
              <tr><td><b>Marketing Website</b><div className="tiny text-3">Maya Kim</div></td><td className="mono">$6,500</td><td className="mono up">$6,500</td><td className="mono">$0</td><td><span className="badge badge-success">Complete</span></td></tr>
            </tbody>
          </table>
        </div>

        <div className="col" style={{ gap: 20 }}>
          <div className="card pad col gap-sm">
            <div className="row between"><b className="h-md">Payment methods</b><button className="btn btn-ghost btn-sm">+ Add</button></div>
            <div className="card pad row between" style={{ padding: "12px 14px" }}><span className="small">💳 Visa •••• 4242</span><span className="badge badge-primary">Default</span></div>
            <div className="card pad row between" style={{ padding: "12px 14px" }}><span className="small">🅿️ PayPal · andre@…</span><span className="badge badge-neutral">Linked</span></div>
            <div className="card pad row between" style={{ padding: "12px 14px" }}><span className="small">🏦 Bank transfer (ACH)</span><span className="badge badge-neutral">Linked</span></div>
            <div className="card pad row between" style={{ padding: "12px 14px" }}><span className="small">🌍 Wise · USD/EUR/KRW</span><span className="badge badge-neutral">Linked</span></div>
            <div className="card pad row between" style={{ padding: "12px 14px" }}><span className="small">₿ Crypto (USDC)</span><button className="btn btn-secondary btn-sm">Enable</button></div>
          </div>
          <div className="card pad col gap-sm" style={{ borderColor: "var(--success)" }}>
            <b className="h-md">🔒 Escrow protection</b>
            <p className="small text-2">Funds are held by SDMP and release only on milestone approval after QA verification. Disputes are handled by human arbitration with full audit logs.</p>
            <Link className="small" style={{ color: "var(--primary)" }} href="/#how">How escrow works →</Link>
          </div>
        </div>
      </div>

      <div className="card pad col">
        <div className="row between">
          <b className="h-md">Transaction history</b>
          <div className="row gap-sm"><button className="btn btn-secondary btn-sm">Export CSV</button><button className="btn btn-secondary btn-sm">Tax report</button></div>
        </div>
        <table className="table">
          <thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th><th>Status</th><th>Invoice</th></tr></thead>
          <tbody>
            <tr><td className="mono">Jul 01</td><td>Escrow release · Fintech Dashboard M1 → Maya Kim</td><td><span className="badge badge-success">Release</span></td><td className="mono">-$4,000.00</td><td><span className="badge badge-success">Settled</span></td><td><a style={{ color: "var(--primary)" }} href="#">INV-1042</a></td></tr>
            <tr><td className="mono">Jul 01</td><td>QA fee · Fintech Dashboard M1 → Rita Torres</td><td><span className="badge badge-accent">QA payout</span></td><td className="mono">-$320.00</td><td><span className="badge badge-success">Settled</span></td><td><a style={{ color: "var(--primary)" }} href="#">INV-1043</a></td></tr>
            <tr><td className="mono">Jun 30</td><td>Escrow deposit · Fitness App (full amount)</td><td><span className="badge badge-primary">Deposit</span></td><td className="mono">+$18,000.00</td><td><span className="badge badge-primary">Locked</span></td><td><a style={{ color: "var(--primary)" }} href="#">INV-1039</a></td></tr>
            <tr><td className="mono">Jun 24</td><td>Refund · cancelled Chrome extension project</td><td><span className="badge badge-warning">Refund</span></td><td className="mono">+$1,200.00</td><td><span className="badge badge-success">Settled</span></td><td><a style={{ color: "var(--primary)" }} href="#">INV-1031</a></td></tr>
            <tr><td className="mono">Jun 20</td><td>Escrow release · Marketing Website final → Maya Kim</td><td><span className="badge badge-success">Release</span></td><td className="mono">-$3,250.00</td><td><span className="badge badge-success">Settled</span></td><td><a style={{ color: "var(--primary)" }} href="#">INV-1027</a></td></tr>
            <tr><td className="mono">Jun 18</td><td>Platform service fee (5% · Pro plan)</td><td><span className="badge badge-neutral">Fee</span></td><td className="mono">-$162.50</td><td><span className="badge badge-success">Settled</span></td><td><a style={{ color: "var(--primary)" }} href="#">INV-1026</a></td></tr>
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
