"use client";

import Link from "next/link";
import { useState } from "react";
import MarketingNav from "@/components/MarketingNav";
import { developers } from "@/lib/data";

const tabs = ["👩‍💻 Developers", "🧪 QA Testers", "🎨 Designers", "🧭 Project Managers", "⚙️ DevOps", "📁 Projects"];

export default function Browse() {
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");

  const results = developers.filter(
    (d) =>
      !query ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.skills.some((s) => s.toLowerCase().includes(query.toLowerCase())) ||
      d.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <MarketingNav />

      <div className="container mt-3 mb-3 col" style={{ gap: 20 }}>
        <div className="search-bar">
          🔍
          <input
            placeholder="Search developers, testers, or projects… (e.g. “React fintech”)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary btn-sm">Search</button>
        </div>

        <div className="row wrap gap-sm">
          {tabs.map((t, i) => (
            <button key={t} className={`chip${i === tab ? " active" : ""}`} onClick={() => setTab(i)}>
              {t}
            </button>
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
              <select className="input" defaultValue="★ 4.5+"><option>Any</option><option>★ 4.0+</option><option>★ 4.5+</option><option>★ 4.9+</option></select>
            </div>
            <div className="field"><label>Experience</label>
              <select className="input" defaultValue="3–7 years"><option>Any</option><option>1–3 years</option><option>3–7 years</option><option>7+ years</option></select>
            </div>
            <div className="field"><label>Availability</label>
              <select className="input" defaultValue="Available now"><option>Available now</option><option>Within 2 weeks</option><option>Any</option></select>
            </div>
            <label className="row small gap-sm"><input type="checkbox" defaultChecked /> Verified only</label>
            <label className="row small gap-sm"><input type="checkbox" /> Top Rated only</label>
            <button className="btn btn-primary">Apply filters</button>
            <button className="btn btn-ghost btn-sm">Reset</button>
          </aside>

          {/* Results */}
          <div className="col" style={{ gap: 16 }}>
            <div className="row between">
              <span className="small text-2"><b>{results.length ? "1,284" : "0"}</b> developers match your search</span>
              <select className="input" style={{ width: "auto", padding: "7px 12px" }} defaultValue="Best match">
                <option>Best match</option><option>Highest rated</option><option>Lowest rate</option><option>Most projects</option>
              </select>
            </div>

            {results.map((d) => (
              <div key={d.id} className="card hover pad result">
                <span className="avatar-wrap"><span className={`avatar lg ${d.avatarClass}${d.online ? " online" : ""}`}>{d.initials}</span></span>
                <div className="col" style={{ gap: 6 }}>
                  <div className="row wrap gap-sm">
                    <b>{d.name}</b>
                    {d.badges.map((b) => <span key={b.label} className={`badge badge-${b.tone}`}>{b.label}</span>)}
                  </div>
                  <div className="small text-3">{d.title} · {d.location} · responds in {d.responseTime} · {d.projects} projects</div>
                  <p className="small text-2">{d.blurb}</p>
                  <div className="row wrap gap-sm">{d.skills.map((s) => <span key={s} className="badge badge-neutral">{s}</span>)}</div>
                </div>
                <div className="col center" style={{ gap: 8 }}>
                  <div className="stars">{"★★★★★".slice(0, Math.round(d.rating))}{d.rating < 4.85 ? "☆" : ""} {d.rating.toFixed(1)}</div>
                  <b style={{ fontSize: "1.2rem" }}>${d.rate}/hr</b>
                  <Link className="btn btn-primary btn-sm" href="/profile">View Profile</Link>
                  <button className="btn btn-secondary btn-sm">Invite</button>
                </div>
              </div>
            ))}

            <div className="row" style={{ justifyContent: "center", gap: 8 }}>
              <button className="btn btn-secondary btn-sm">←</button>
              <button className="btn btn-primary btn-sm">1</button>
              <button className="btn btn-ghost btn-sm">2</button>
              <button className="btn btn-ghost btn-sm">3</button>
              <span className="text-3">…</span>
              <button className="btn btn-ghost btn-sm">128</button>
              <button className="btn btn-secondary btn-sm">→</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
