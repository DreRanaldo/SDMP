import Link from "next/link";
import MarketingNav from "@/components/MarketingNav";
import { categories } from "@/lib/data";

export default function Landing() {
  return (
    <>
      <MarketingNav />

      {/* Hero */}
      <header className="hero">
        <div className="hero-bg">
          <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
        </div>
        <div className="container hero-grid">
          <div className="col" style={{ gap: 22 }}>
            <span className="badge badge-accent fade-up"><span className="dot pulse" /> Now in public launch</span>
            <h1 className="h-display fade-up d1">
              Find Expert Developers.<br />
              <span className="grad-text">Build Amazing Software.</span>
            </h1>
            <p className="text-2 fade-up d2" style={{ fontSize: "1.12rem", maxWidth: "34rem" }}>
              SDMP connects businesses with vetted developers, designers, and QA testers —
              protected by milestone-based escrow, integrated testing, and real-time collaboration.
            </p>
            <div className="row wrap fade-up d3">
              <Link className="btn btn-primary btn-lg" href="/browse">Hire Developers</Link>
              <Link className="btn btn-secondary btn-lg" href="/browse">Find Work</Link>
              <Link className="btn btn-ghost btn-lg" href="/browse">Browse Projects →</Link>
            </div>
          </div>

          <div className="col fade-up d2" style={{ gap: 16 }}>
            <div className="card glass pad float" style={{ borderRadius: "var(--r-xl)" }}>
              <div className="row between mb-2">
                <div className="row">
                  <span className="avatar a2">MK</span>
                  <div><b>Maya Kim</b><div className="small text-3">Full-Stack · Verified ✓</div></div>
                </div>
                <span className="badge badge-success"><span className="dot" /> Milestone 2 approved</span>
              </div>
              <div className="col gap-sm">
                <div className="row between small"><span className="text-2">Fintech Dashboard · React + Go</span><b>$12,000</b></div>
                <div className="progress"><i style={{ width: "66%" }} /></div>
                <div className="row between tiny text-3"><span>2 of 3 milestones released</span><span>66%</span></div>
              </div>
              <hr className="divider mt-2 mb-2" />
              <div className="row between">
                <span className="small text-2">🔒 $4,000 held in escrow</span>
                <button className="btn btn-primary btn-sm">Release Payment</button>
              </div>
            </div>
            <div className="card glass pad" style={{ borderRadius: "var(--r-xl)", marginLeft: 48 }}>
              <div className="row">
                <span className="avatar a3 sm">QA</span>
                <div className="flex1"><b className="small">QA Report · Passed</b><div className="tiny text-3">Tester verified 34/34 acceptance checks</div></div>
                <span className="badge badge-success">PASS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="container mt-4">
        <div className="row between mb-3">
          <div><h2 className="h-xl">Browse by category</h2><p className="text-2">Every discipline of software development, in one place.</p></div>
          <Link className="btn btn-secondary" href="/browse">All categories →</Link>
        </div>
        <div className="grid g4">
          {categories.map((c) => (
            <Link key={c.name} className="card hover cat-card" href="/browse">
              <span className="cat-icon" style={{ background: c.tint }}>{c.icon}</span>
              <b>{c.name}</b>
              <span className="small text-3">Browse specialists →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container mt-4" id="how">
        <div className="center mb-3">
          <h2 className="h-xl">How SDMP works</h2>
          <p className="text-2">From idea to shipped software — with QA and escrow at every step.</p>
        </div>
        <div className="grid g4">
          <div className="card pad col hover"><span className="step-num">1</span><b>Post your project</b><p className="small text-2">Describe your build — budget, deadline, tech stack, and requirements. Our AI estimator suggests scope and pricing.</p></div>
          <div className="card pad col hover"><span className="step-num">2</span><b>Hire &amp; fund escrow</b><p className="small text-2">Compare proposals, hire the best fit, and deposit funds into SDMP escrow. Money is locked — never released early.</p></div>
          <div className="card pad col hover"><span className="step-num">3</span><b>Build &amp; verify</b><p className="small text-2">Track milestones on a Kanban workspace with Git integration. Independent QA testers verify every deliverable.</p></div>
          <div className="card pad col hover"><span className="step-num">4</span><b>Approve &amp; release</b><p className="small text-2">When QA passes and you approve, escrow releases automatically. Developer and tester are paid instantly.</p></div>
        </div>
      </section>

      {/* Escrow protection */}
      <section className="container mt-4">
        <div className="card glass" style={{ borderRadius: "var(--r-xl)", padding: 44, position: "relative", overflow: "hidden" }}>
          <div className="hero-bg"><div className="blob b2" style={{ opacity: 0.18 }} /></div>
          <div className="grid g2" style={{ position: "relative", alignItems: "center" }}>
            <div className="col" style={{ gap: 14 }}>
              <span className="badge badge-success">🔒 Escrow Protection</span>
              <h2 className="h-xl">Your money moves only when the work is right.</h2>
              <p className="text-2">Clients deposit the full amount up front, but funds stay locked with SDMP. Payments release milestone by milestone — only after QA verification and your approval. Disputes go to human arbitration with full audit logs.</p>
              <div className="row wrap gap-sm">
                <span className="chip">Milestone releases</span><span className="chip">Partial releases</span><span className="chip">Refunds</span><span className="chip">Chargebacks</span><span className="chip">Dispute resolution</span>
              </div>
            </div>
            <div className="col">
              <div className="steps">
                <div className="step done"><span className="pt">✓</span><div><b className="small">Client funds escrow</b><div className="tiny text-3">$12,000 deposited &amp; locked</div></div></div>
                <div className="step done"><span className="pt">✓</span><div><b className="small">Milestone 1 delivered</b><div className="tiny text-3">QA passed · $4,000 released</div></div></div>
                <div className="step now"><span className="pt">3</span><div><b className="small">Milestone 2 in QA</b><div className="tiny text-3">Tester running acceptance checks</div></div></div>
                <div className="step"><span className="pt">4</span><div><b className="small">Final approval</b><div className="tiny text-3">Remaining $8,000 releases automatically</div></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mt-4" id="pricing">
        <div className="center mb-3"><h2 className="h-xl">Simple, transparent pricing</h2><p className="text-2">Free to join. Pay only when work gets done.</p></div>
        <div className="grid g3">
          <div className="card price-card hover">
            <div><b className="h-lg">Starter</b><p className="small text-3">For individuals &amp; first projects</p></div>
            <div><span className="h-display" style={{ fontSize: "2.6rem" }}>Free</span></div>
            <ul className="small text-2 col gap-sm" style={{ listStyle: "none" }}>
              <li>✓ Post unlimited projects</li><li>✓ 10% service fee</li><li>✓ Escrow protection</li><li>✓ Standard support</li>
            </ul>
            <Link className="btn btn-secondary" href="/login">Get started</Link>
          </div>
          <div className="card price-card featured">
            <span className="badge badge-primary" style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)" }}>Most Popular</span>
            <div><b className="h-lg">Pro</b><p className="small text-3">For growing teams &amp; freelancers</p></div>
            <div><span className="h-display" style={{ fontSize: "2.6rem" }}>$29</span><span className="text-3">/mo</span></div>
            <ul className="small text-2 col gap-sm" style={{ listStyle: "none" }}>
              <li>✓ 5% service fee</li><li>✓ Featured listings</li><li>✓ AI project estimator &amp; code review</li><li>✓ Advanced analytics</li><li>✓ Priority support</li>
            </ul>
            <Link className="btn btn-primary" href="/login">Start free trial</Link>
          </div>
          <div className="card price-card hover">
            <div><b className="h-lg">Enterprise</b><p className="small text-3">For companies at scale</p></div>
            <div><span className="h-display" style={{ fontSize: "2.6rem" }}>Custom</span></div>
            <ul className="small text-2 col gap-sm" style={{ listStyle: "none" }}>
              <li>✓ Custom fees &amp; SLAs</li><li>✓ Dedicated talent pods</li><li>✓ SSO, audit logs, compliance</li><li>✓ Global payroll &amp; invoicing</li><li>✓ Dedicated account manager</li>
            </ul>
            <Link className="btn btn-secondary" href="/login">Contact sales</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mt-4" style={{ maxWidth: 820 }}>
        <div className="center mb-3"><h2 className="h-xl">Frequently asked questions</h2></div>
        <div className="col">
          <details className="card faq-item"><summary>How does escrow protect me?</summary><p className="small text-2 mt-1">Your deposit is held by SDMP — not the developer. Funds release only per milestone, after independent QA verification and your explicit approval. If anything goes wrong, our dispute team can refund or partially release.</p></details>
          <details className="card faq-item"><summary>Who are the QA testers?</summary><p className="small text-2 mt-1">Independent, vetted QA professionals on SDMP. When a developer submits a milestone, the project enters Testing automatically; you pick a tester or let SDMP auto-assign. They deliver bug reports, screenshots, videos, and a pass/fail verdict.</p></details>
          <details className="card faq-item"><summary>How do developers get paid?</summary><p className="small text-2 mt-1">Instantly on milestone approval — via Stripe, PayPal, Wise, bank transfer, or crypto (where available), in multiple currencies with invoices and tax reports.</p></details>
          <details className="card faq-item"><summary>What does SDMP charge?</summary><p className="small text-2 mt-1">A platform service fee per transaction (10% Starter, 5% Pro), plus optional subscriptions, featured listings, and enterprise plans. Joining and browsing are free.</p></details>
          <details className="card faq-item"><summary>Is my data secure?</summary><p className="small text-2 mt-1">Yes — encrypted messaging, KYC identity verification, two-factor authentication, fraud detection, GDPR compliance, and full audit logs.</p></details>
        </div>
      </section>

      {/* CTA */}
      <section className="container mt-4 mb-3">
        <div className="center card pad" style={{ borderRadius: "var(--r-xl)", padding: "56px 24px", background: "var(--grad-brand)", border: 0 }}>
          <h2 className="h-xl" style={{ color: "#fff" }}>Ready to build something amazing?</h2>
          <p style={{ color: "rgba(255,255,255,.85)", maxWidth: "32rem", margin: "10px auto 24px" }}>Be among the first clients, developers, and testers shipping software the safe way.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link className="btn btn-lg" style={{ background: "#fff", color: "var(--primary)" }} href="/browse">Hire Developers</Link>
            <Link className="btn btn-lg" style={{ border: "1.5px solid rgba(255,255,255,.6)", color: "#fff" }} href="/browse">Find Work</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container" style={{ padding: "48px 24px 32px" }}>
          <div className="grid g4">
            <div className="col gap-sm">
              <Link className="brand" href="/"><span className="logo-mark">S</span> SDMP</Link>
              <p className="small text-3">The software development marketplace with escrow-backed payments and integrated QA.</p>
            </div>
            <div className="col gap-sm small"><b>Platform</b><Link className="text-2" href="/browse">Find Developers</Link><Link className="text-2" href="/browse">Find Testers</Link><Link className="text-2" href="/browse">Browse Projects</Link><Link className="text-2" href="/#pricing">Pricing</Link></div>
            <div className="col gap-sm small"><b>Company</b><a className="text-2" href="#">About</a><a className="text-2" href="#">Careers</a><a className="text-2" href="#">Blog</a><a className="text-2" href="#">Press</a></div>
            <div className="col gap-sm small"><b>Legal &amp; Support</b><a className="text-2" href="#">Help Center</a><a className="text-2" href="#">Trust &amp; Safety</a><a className="text-2" href="#">Terms</a><a className="text-2" href="#">Privacy · GDPR</a></div>
          </div>
          <hr className="divider mt-3 mb-2" />
          <div className="row between small text-3"><span>© 2026 SDMP Inc. All rights reserved.</span><span>🌐 English · USD</span></div>
        </div>
      </footer>
    </>
  );
}
