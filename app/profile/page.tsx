import Link from "next/link";
import MarketingNav from "@/components/MarketingNav";

export default function Profile() {
  return (
    <>
      <MarketingNav />

      <div className="container mt-3 mb-3 col" style={{ gap: 24 }}>
        <div className="cover" />
        <div className="profile-head row wrap between" style={{ gap: 18 }}>
          <div className="row" style={{ gap: 18 }}>
            <span className="avatar-wrap"><span className="avatar xl a2 online" style={{ border: "4px solid var(--bg)" }}>MK</span></span>
            <div className="col" style={{ gap: 6, paddingTop: 40 }}>
              <div className="row wrap gap-sm">
                <h1 className="h-lg">Maya Kim</h1>
                <span className="badge badge-primary">✓ Verified Developer</span>
                <span className="badge badge-warning">🏆 Top Rated</span>
                <span className="badge badge-accent">⚡ Fast Delivery</span>
              </div>
              <div className="small text-3">Senior Full-Stack Developer · Seoul, South Korea 🇰🇷 · Member since 2021 · Lv. 42 ⭐ 18,240 XP</div>
            </div>
          </div>
          <div className="row" style={{ paddingTop: 40 }}>
            <Link className="btn btn-secondary" href="/messages">💬 Message</Link>
            <Link className="btn btn-primary" href="/post-project">Invite to Project</Link>
          </div>
        </div>

        <div className="profile-layout">
          <div className="col" style={{ gap: 24 }}>
            <div className="card pad col">
              <b className="h-md">About</b>
              <p className="small text-2">Fintech &amp; SaaS specialist with 8 years of production experience. I design and ship dashboards, billing systems, and high-throughput APIs — React on the front, Go on the back, PostgreSQL underneath. I work milestone-first: clear scope, daily updates, demo every Friday.</p>
              <div className="row wrap gap-sm">
                {["React", "TypeScript", "Go", "PostgreSQL", "AWS", "Stripe", "GraphQL", "Docker", "Kubernetes"].map((s) => (
                  <span key={s} className="badge badge-neutral">{s}</span>
                ))}
              </div>
            </div>

            <div className="card pad col">
              <b className="h-md">Skills</b>
              <div className="col gap-sm">
                {[["React / TS", 96], ["Go", 92], ["PostgreSQL", 88], ["AWS / DevOps", 80], ["UI/UX", 72]].map(([name, score]) => (
                  <div key={name as string} className="skillbar">
                    <span>{name}</span>
                    <div className="progress"><i style={{ width: `${score}%` }} /></div>
                    <b className="small">{score}</b>
                  </div>
                ))}
              </div>
              <div className="tiny text-3">Verified via SDMP skill assessments · last updated Jun 2026</div>
            </div>

            <div className="card pad col">
              <div className="row between"><b className="h-md">Portfolio</b><span className="small text-3">24 projects</span></div>
              <div className="grid g3">
                <div className="card hover port"><div className="thumb" style={{ background: "linear-gradient(135deg,#2563EB,#06B6D4)" }}>📊</div><div style={{ padding: 12 }}><b className="small">Finlytics Dashboard</b><div className="tiny text-3">React · Go · 2025</div></div></div>
                <div className="card hover port"><div className="thumb" style={{ background: "linear-gradient(135deg,#4F46E5,#EC4899)" }}>💳</div><div style={{ padding: 12 }}><b className="small">PayFlow Billing</b><div className="tiny text-3">Stripe · Go · 2025</div></div></div>
                <div className="card hover port"><div className="thumb" style={{ background: "linear-gradient(135deg,#10B981,#06B6D4)" }}>🏦</div><div style={{ padding: 12 }}><b className="small">NeoBank Mobile Web</b><div className="tiny text-3">React · GraphQL · 2024</div></div></div>
              </div>
            </div>

            <div className="card pad col">
              <div className="row between"><b className="h-md">Reviews</b><div className="stars">★★★★★ 5.0 · 312 reviews</div></div>
              <div className="col">
                <div className="card pad col gap-sm">
                  <div className="row between"><div className="row"><span className="avatar sm a5">JL</span><div className="small"><b>James Liu</b> · Finlytics</div></div><div className="stars small">★★★★★</div></div>
                  <p className="small text-2">&ldquo;Maya delivered every milestone early and QA passed first try on two of three. Communication was flawless — daily updates, Friday demos, zero surprises.&rdquo;</p>
                  <span className="tiny text-3">Fintech Dashboard · $12,000 · Jun 2026</span>
                </div>
                <div className="card pad col gap-sm">
                  <div className="row between"><div className="row"><span className="avatar sm a4">SP</span><div className="small"><b>Sara Patel</b> · Healthloop</div></div><div className="stars small">★★★★★</div></div>
                  <p className="small text-2">&ldquo;Rebuilt our billing stack with zero downtime. Wrote docs our whole team still uses. Hire her before someone else does.&rdquo;</p>
                  <span className="tiny text-3">PayFlow Billing · $18,500 · Mar 2026</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col" style={{ gap: 20 }}>
            <div className="card pad col">
              <div className="row between"><span className="text-3 small">Hourly rate</span><b style={{ fontSize: "1.4rem" }}>$95/hr</b></div>
              <div className="row between"><span className="text-3 small">Availability</span><span className="badge badge-success"><span className="dot" /> Available now</span></div>
              <div className="row between"><span className="text-3 small">Response time</span><b className="small">~1 hour</b></div>
              <div className="row between"><span className="text-3 small">Completed projects</span><b className="small">312</b></div>
              <div className="row between"><span className="text-3 small">On-time delivery</span><b className="small up">98%</b></div>
              <div className="row between"><span className="text-3 small">QA first-pass rate</span><b className="small up">91%</b></div>
              <hr className="divider" />
              <Link className="btn btn-primary" href="/post-project">Invite to Project</Link>
              <Link className="btn btn-secondary" href="/messages">💬 Message</Link>
            </div>

            <div className="card pad col gap-sm">
              <b className="h-md">Links</b>
              <a className="row small text-2" href="#">🐙 github.com/mayakim <span className="badge badge-neutral" style={{ marginLeft: "auto" }}>2.1k ★</span></a>
              <a className="row small text-2" href="#">💼 linkedin.com/in/mayakim</a>
              <a className="row small text-2" href="#">📄 Resume.pdf</a>
            </div>

            <div className="card pad col gap-sm">
              <b className="h-md">Certificates</b>
              <div className="row small text-2">🎓 AWS Solutions Architect — Pro</div>
              <div className="row small text-2">🎓 CKA: Certified Kubernetes Admin</div>
              <div className="row small text-2">🎓 SDMP Expert Assessment — Top 1%</div>
            </div>

            <div className="card pad col gap-sm">
              <b className="h-md">Achievements</b>
              <div className="row wrap gap-sm">
                <span className="badge badge-warning">🏆 Top Rated 2025</span>
                <span className="badge badge-accent">⚡ 50 on-time streak</span>
                <span className="badge badge-secondary">🥇 #3 leaderboard KR</span>
                <span className="badge badge-success">💯 100 five-star reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
