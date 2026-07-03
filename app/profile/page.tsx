import Link from "next/link";
import MarketingNav from "@/components/MarketingNav";
import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/db";

export default async function Profile() {
  const user = await requireUser();
  const db = await readDb();
  const myProjects = db.projects.filter((p) => p.clientId === user.id);
  const completed = myProjects.filter((p) => p.status === "completed").length;

  return (
    <>
      <MarketingNav />

      <div className="container mt-3 mb-3 col" style={{ gap: 24 }}>
        <div className="cover" />
        <div className="profile-head row wrap between" style={{ gap: 18 }}>
          <div className="row" style={{ gap: 18 }}>
            <span className="avatar-wrap"><span className="avatar xl a2 online" style={{ border: "4px solid var(--bg)" }}>{user.initials}</span></span>
            <div className="col" style={{ gap: 6, paddingTop: 40 }}>
              <div className="row wrap gap-sm">
                <h1 className="h-lg">{user.name}</h1>
                <span className={`badge ${user.role === "admin" ? "badge-danger" : "badge-primary"}`}>{user.role}</span>
              </div>
              <div className="small text-3">{user.email} · {myProjects.length} project{myProjects.length === 1 ? "" : "s"} posted · {completed} completed</div>
            </div>
          </div>
          <div className="row" style={{ paddingTop: 40 }}>
            <Link className="btn btn-secondary" href="/dashboard">Dashboard</Link>
            <Link className="btn btn-primary" href="/post-project">Post a Project</Link>
          </div>
        </div>

        <div className="profile-layout">
          <div className="col" style={{ gap: 24 }}>
            <div className="card pad col">
              <b className="h-md">About</b>
              <p className="small text-3">Add a bio so developers and testers know who they&apos;re working with. Profiles with a photo, bio, and links get more proposals.</p>
              <button className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start" }}>✏️ Edit profile</button>
            </div>

            <div className="card pad col">
              <div className="row between"><b className="h-md">Projects</b><span className="small text-3">{myProjects.length} posted</span></div>
              {myProjects.length === 0 && (
                <p className="small text-3">Nothing here yet — your posted projects and their outcomes build your reputation as a client.</p>
              )}
              {myProjects.map((p) => (
                <Link key={p.id} className="card hover pad row between" href={`/project?id=${p.id}`}>
                  <div className="small"><b>{p.title}</b><div className="tiny text-3">{p.milestones.length} milestones · due {p.dueDate}</div></div>
                  <span className={`badge ${p.status === "completed" ? "badge-success" : "badge-primary"}`}>{p.status}</span>
                </Link>
              ))}
            </div>

            <div className="card pad col">
              <div className="row between"><b className="h-md">Reviews</b><span className="small text-3">none yet</span></div>
              <p className="small text-3">Ratings from developers and testers you&apos;ve worked with appear here after each completed project.</p>
            </div>
          </div>

          <div className="col" style={{ gap: 20 }}>
            <div className="card pad col">
              <div className="row between"><span className="text-3 small">Role</span><b className="small">{user.role}</b></div>
              <div className="row between"><span className="text-3 small">Projects posted</span><b className="small">{myProjects.length}</b></div>
              <div className="row between"><span className="text-3 small">Completed</span><b className="small">{completed}</b></div>
              <div className="row between"><span className="text-3 small">Identity</span><span className="badge badge-neutral">KYC not started</span></div>
              <hr className="divider" />
              <button className="btn btn-primary">Verify identity</button>
            </div>

            <div className="card pad col gap-sm">
              <b className="h-md">Links</b>
              <p className="small text-3">Add GitHub, LinkedIn, or a portfolio site.</p>
              <button className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start" }}>+ Add link</button>
            </div>

            <div className="card pad col gap-sm">
              <b className="h-md">Achievements</b>
              <p className="small text-3">Badges — Verified, Top Rated, Fast Delivery — are earned through completed, QA-verified work.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
