import MarketingNav from "@/components/MarketingNav";
import { readDb } from "@/lib/db";

// Reads the live member list — must render per-request, not at build time.
export const dynamic = "force-dynamic";

const ROLE_BADGE: Record<string, string> = {
  admin: "badge-danger",
  developer: "badge-primary",
  tester: "badge-accent",
  client: "badge-neutral",
};

export default async function Browse() {
  const db = await readDb();
  const members = [...db.users].reverse();

  return (
    <>
      <MarketingNav />

      <div className="container mt-3 mb-3 col" style={{ gap: 20 }}>
        <div className="search-bar">
          🔍
          <input placeholder="Search developers, testers, or projects…" />
          <button className="btn btn-primary btn-sm">Search</button>
        </div>

        <div className="row wrap gap-sm">
          {["👩‍💻 Developers", "🧪 QA Testers", "🎨 Designers", "🧭 Project Managers", "⚙️ DevOps", "📁 Projects"].map((t, i) => (
            <span key={t} className={`chip${i === 0 ? " active" : ""}`}>{t}</span>
          ))}
        </div>

        <div className="browse-layout">
          {/* Filters */}
          <aside className="filters card pad col">
            <b className="h-md">Filters</b>
            <div className="field"><label>Languages &amp; frameworks</label><input className="input" placeholder="React, Go, Python…" /></div>
            <div className="field">
              <label>Hourly rate</label>
              <div className="row gap-sm"><input className="input" placeholder="$ Min" /><input className="input" placeholder="$ Max" /></div>
            </div>
            <div className="field"><label>Country</label>
              <select className="input" defaultValue="Anywhere"><option>Anywhere</option><option>United States</option><option>Europe</option><option>Asia-Pacific</option><option>Latin America</option><option>Africa</option></select>
            </div>
            <div className="field"><label>Minimum rating</label>
              <select className="input" defaultValue="Any"><option>Any</option><option>★ 4.0+</option><option>★ 4.5+</option><option>★ 4.9+</option></select>
            </div>
            <div className="field"><label>Availability</label>
              <select className="input" defaultValue="Any"><option>Any</option><option>Available now</option><option>Within 2 weeks</option></select>
            </div>
            <label className="row small gap-sm"><input type="checkbox" /> Verified only</label>
            <label className="row small gap-sm"><input type="checkbox" /> Top Rated only</label>
            <button className="btn btn-primary">Apply filters</button>
          </aside>

          {/* Results — real registered members */}
          <div className="col" style={{ gap: 16 }}>
            <div className="row between">
              <span className="small text-2"><b>{members.length}</b> member{members.length === 1 ? "" : "s"} on the platform</span>
              <select className="input" style={{ width: "auto", padding: "7px 12px" }} defaultValue="Newest">
                <option>Newest</option><option>Highest rated</option><option>Most projects</option>
              </select>
            </div>

            {members.length === 0 && (
              <div className="card pad center col" style={{ gap: 12, padding: 48 }}>
                <span style={{ fontSize: "2rem" }}>🌱</span>
                <b className="h-md">The marketplace is brand new</b>
                <p className="small text-3" style={{ maxWidth: "30rem" }}>
                  No members yet — be the first. Create an account to post projects, offer your
                  development skills, or join as a QA tester.
                </p>
                <a className="btn btn-primary" href="/login">Join SDMP</a>
              </div>
            )}

            {members.map((m, i) => (
              <div key={m.id} className="card hover pad result">
                <span className="avatar-wrap"><span className={`avatar lg a${(i % 5) + 1}`}>{m.initials}</span></span>
                <div className="col" style={{ gap: 6 }}>
                  <div className="row wrap gap-sm">
                    <b>{m.name}</b>
                    <span className={`badge ${ROLE_BADGE[m.role] ?? "badge-neutral"}`}>{m.role}</span>
                  </div>
                  <div className="small text-3">
                    Member since {new Date(m.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </div>
                  <p className="small text-2">Profile details — skills, portfolio, rates, and reviews — appear as members build out their pages.</p>
                </div>
                <div className="col center" style={{ gap: 8 }}>
                  <a className="btn btn-secondary btn-sm" href="/messages">Message</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
