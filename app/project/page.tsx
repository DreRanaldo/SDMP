import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import WorkspaceClient from "@/components/WorkspaceClient";

export default async function ProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const user = await requireUser();
  const { id } = await searchParams;
  const db = await readDb();
  const mine = db.projects.filter((p) => p.clientId === user.id || user.role === "admin");
  const project = mine.find((p) => p.id === id) ?? mine[0];

  if (!project) {
    return (
      <AppShell
        active="projects"
        user={user}
        topbar={<><b>Projects</b><div style={{ flex: 1 }} /></>}
      >
        <div className="card pad center col" style={{ gap: 12, padding: 48 }}>
          <span style={{ fontSize: "2rem" }}>📁</span>
          <h1 className="h-lg">No projects yet</h1>
          <p className="text-2" style={{ maxWidth: "28rem" }}>
            Post your first project to open a workspace — escrow funding, milestones,
            QA verification, and payments all live here.
          </p>
          <Link className="btn btn-primary" href="/post-project">Post a project</Link>
        </div>
      </AppShell>
    );
  }

  return <WorkspaceClient user={user} project={project} />;
}
