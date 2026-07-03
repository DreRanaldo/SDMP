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
  const project =
    db.projects.find((p) => p.id === id) ??
    db.projects.find((p) => p.clientId === user.id) ??
    db.projects[0];

  return <WorkspaceClient user={user} project={project} />;
}
