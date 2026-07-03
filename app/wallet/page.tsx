import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import { readDb, type LedgerType, type Project } from "@/lib/db";

const fmt = (n: number) =>
  "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0 });

const TYPE_BADGE: Record<LedgerType, { cls: string; label: string }> = {
  deposit: { cls: "badge-primary", label: "Deposit" },
  release: { cls: "badge-success", label: "Release" },
  "qa-fee": { cls: "badge-accent", label: "QA payout" },
  refund: { cls: "badge-warning", label: "Refund" },
  fee: { cls: "badge-neutral", label: "Fee" },
};

const PROJECT_STATUS: Record<Project["status"], { cls: string; label: string }> = {
  proposals: { cls: "badge-neutral", label: "Deposit hold" },
  "in-progress": { cls: "badge-primary", label: "Active" },
  "in-qa": { cls: "badge-warning", label: "In QA" },
  revision: { cls: "badge-warning", label: "Revision" },
  completed: { cls: "badge-success", label: "Complete" },
};

export default async function Wallet() {
  const user = await requireUser();
  const db = await readDb();
  const projects = db.projects.filter((p) => p.clientId === user.id || user.role === "admin");
  const ledger = db.ledger.filter((t) => t.ownerId === user.id || user.role === "admin");

  const releasable = projects
    .flatMap((p) => p.milestones)
    .filter((m) => m.state === "in-qa")
    .reduce((s, m) => s + m.amount, 0);
  const locked = projects
    .flatMap((p) => p.milestones)
    .filter((m) => m.state !== "released")
    .reduce((s, m) => s + m.amount, 0) - releasable;
  const available = ledger.filter((t) => t.type === "refund").reduce((s2, t) => s2 + t.amount, 0);
  const total = locked + releasable + available;

  return (
    <AppShell
      active="wallet"
      user={user}
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
          <span className="v">{fmt(total)}</span>
          <span className="d" style={{ color: "rgba(255,255,255,.85)" }}>USD · multi-currency enabled</span>
        </div>
        <div className="card stat"><span className="k">🔒 Locked in Escrow</span><span className="v">{fmt(locked)}</span><span className="d text-3">{projects.filter((p) => p.status !== "completed").length} active projects</span></div>
        <div className="card stat"><span className="k">Releasable</span><span className="v" style={{ color: "var(--success)" }}>{fmt(releasable)}</span><span className="d text-3">pending your approval</span></div>
        <div className="card stat"><span className="k">Available</span><span className="v">{fmt(available)}</span><span className="d text-3">withdraw anytime</span></div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="card pad col">
          <b className="h-md">Escrow by project</b>
          <table className="table">
            <thead><tr><th>Project</th><th>Total</th><th>Released</th><th>Locked</th><th>Status</th></tr></thead>
            <tbody>
              {projects.length === 0 && (
                <tr><td colSpan={5} className="text-3">No escrow yet — funds appear here when you post a project.</td></tr>
              )}
              {projects.map((p) => {
                const totalP = p.milestones.reduce((s, m) => s + m.amount, 0);
                const releasedP = p.milestones.filter((m) => m.state === "released").reduce((s, m) => s + m.amount, 0);
                const badge = PROJECT_STATUS[p.status];
                return (
                  <tr key={p.id}>
                    <td><b>{p.title.split(" · ")[0]}</b><div className="tiny text-3">{p.developerName}</div></td>
                    <td className="mono">{fmt(totalP)}</td>
                    <td className="mono up">{fmt(releasedP)}</td>
                    <td className="mono">{fmt(totalP - releasedP)}</td>
                    <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="col" style={{ gap: 20 }}>
          <div className="card pad col gap-sm">
            <div className="row between"><b className="h-md">Payment methods</b><button className="btn btn-ghost btn-sm">+ Add</button></div>
            <p className="small text-3">No payment methods yet. Add a card, bank account, PayPal, Wise, or crypto wallet to fund escrow and withdraw earnings.</p>
            <button className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start" }}>💳 Add payment method</button>
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
            {ledger.length === 0 && (
              <tr><td colSpan={6} className="text-3">No transactions yet.</td></tr>
            )}
            {[...ledger].reverse().map((t) => {
              const badge = TYPE_BADGE[t.type];
              return (
                <tr key={t.id}>
                  <td className="mono">{t.date}</td>
                  <td>{t.description}</td>
                  <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                  <td className="mono">{t.amount < 0 ? "-" : "+"}{fmt(t.amount)}</td>
                  <td><span className={`badge ${t.status === "Locked" ? "badge-primary" : "badge-success"}`}>{t.status}</span></td>
                  <td><a style={{ color: "var(--primary)" }} href="#">{t.invoice}</a></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
