"use server";

/**
 * Server actions — the app's write API. Every mutation flows through here:
 * auth, project creation, the escrow state machine, and messaging.
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  requireUser,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import {
  hashPassword,
  readDb,
  toSafeUser,
  updateDb,
  uuid,
  type Milestone,
  type Project,
} from "@/lib/db";

export type ActionResult = { error?: string };

const QA_FEE_RATE = 0.08;

function money(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

function nowClock(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function today(): string {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

// ---------- Auth ----------

export async function login(email: string, password: string): Promise<ActionResult> {
  const db = await readDb();
  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Invalid email or password." };
  }
  await setSessionCookie(user.id);
  redirect("/dashboard");
}

export async function register(name: string, email: string, password: string): Promise<ActionResult> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanName || !cleanEmail.includes("@") || password.length < 8) {
    return { error: "Enter your name, a valid email, and a password of 8+ characters." };
  }
  const created = await updateDb((db) => {
    if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return null;
    }
    const initials = cleanName
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const user = {
      id: `u-${uuid()}`,
      email: cleanEmail,
      name: cleanName,
      initials: initials || "U",
      role: "client" as const,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    db.audit.push({ id: uuid(), at: nowClock(), text: `system register user ${cleanEmail}` });
    return toSafeUser(user);
  });
  if (!created) return { error: "An account with that email already exists." };
  await setSessionCookie(created.id);
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}

// ---------- Projects & escrow state machine ----------

export async function createProject(input: {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  stack: string[];
  visibility: string;
  priority: string;
}): Promise<{ id?: string } & ActionResult> {
  const user = await requireUser();
  const title = input.title.trim();
  const budget = Math.round(Number(input.budget));
  if (!title) return { error: "Project title is required." };
  if (!Number.isFinite(budget) || budget < 100) return { error: "Budget must be at least $100." };

  const id = `p-${uuid().slice(0, 8)}`;
  const thirds = [Math.round(budget / 3), Math.round(budget / 3), budget - 2 * Math.round(budget / 3)];
  const milestones: Milestone[] = [
    { id: 1, title: "M1 — Foundation & core setup", amount: thirds[0], state: "locked", detail: "Awaiting hire" },
    { id: 2, title: "M2 — Main feature build", amount: thirds[1], state: "locked", detail: "🔒 locked in escrow" },
    { id: 3, title: "M3 — QA hardening & launch", amount: thirds[2], state: "locked", detail: "🔒 locked in escrow" },
  ];
  const project: Project = {
    id,
    title,
    clientId: user.id,
    developerName: "Unassigned",
    developerInitials: title.slice(0, 2).toUpperCase(),
    avatarClass: "a3",
    testerName: "Unassigned",
    stack: input.stack.length ? input.stack : ["TBD"],
    status: "proposals",
    visibility: input.visibility,
    priority: input.priority,
    dueDate: input.deadline || "TBD",
    proposals: 0,
    milestones,
    createdAt: new Date().toISOString(),
  };

  await updateDb((db) => {
    db.projects.unshift(project);
    db.ledger.push({
      id: `tx-${uuid().slice(0, 6)}`,
      date: today(),
      description: `Escrow deposit · ${title} (full amount)`,
      type: "deposit",
      amount: budget,
      status: "Locked",
      invoice: `INV-${1050 + db.ledger.length}`,
    });
    db.audit.push({ id: uuid(), at: nowClock(), text: `system escrow deposit ${money(budget)} · ${title}` });
  });

  revalidatePath("/dashboard");
  revalidatePath("/wallet");
  revalidatePath("/admin");
  return { id };
}

export async function approveMilestone(projectId: string, milestoneId: number): Promise<ActionResult> {
  const user = await requireUser();
  const result = await updateDb((db): ActionResult => {
    const project = db.projects.find((p) => p.id === projectId);
    if (!project) return { error: "Project not found." };
    if (project.clientId !== user.id && user.role !== "admin") {
      return { error: "Only the project's client can approve milestones." };
    }
    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return { error: "Milestone not found." };
    if (milestone.state !== "in-qa") {
      return { error: `Milestone is ${milestone.state} — only milestones in QA can be approved.` };
    }

    milestone.state = "released";
    milestone.detail = `Approved ${today()} · escrow released automatically ✓`;

    const qaFee = Math.round(milestone.amount * QA_FEE_RATE);
    db.ledger.push(
      {
        id: `tx-${uuid().slice(0, 6)}`,
        date: today(),
        description: `Escrow release · ${project.title} ${milestone.title.split(" — ")[0]} → ${project.developerName}`,
        type: "release",
        amount: -milestone.amount,
        status: "Settled",
        invoice: `INV-${1050 + db.ledger.length}`,
      },
      {
        id: `tx-${uuid().slice(0, 6)}`,
        date: today(),
        description: `QA fee · ${project.title} ${milestone.title.split(" — ")[0]} → ${project.testerName}`,
        type: "qa-fee",
        amount: -qaFee,
        status: "Settled",
        invoice: `INV-${1051 + db.ledger.length}`,
      },
    );
    db.audit.push({
      id: uuid(),
      at: nowClock(),
      text: `system release ${money(milestone.amount)} → ${project.developerName.toLowerCase().replace(/\s+/g, ".")}`,
    });

    project.status = project.milestones.every((m) => m.state === "released") ? "completed" : "in-progress";
    return {};
  });

  revalidatePath("/project");
  revalidatePath("/dashboard");
  revalidatePath("/wallet");
  revalidatePath("/admin");
  return result;
}

export async function requestRevision(projectId: string, milestoneId: number): Promise<ActionResult> {
  const user = await requireUser();
  const result = await updateDb((db): ActionResult => {
    const project = db.projects.find((p) => p.id === projectId);
    if (!project) return { error: "Project not found." };
    if (project.clientId !== user.id && user.role !== "admin") {
      return { error: "Only the project's client can request revisions." };
    }
    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return { error: "Milestone not found." };
    if (milestone.state !== "in-qa") {
      return { error: `Milestone is ${milestone.state} — only milestones in QA can be sent back.` };
    }
    milestone.state = "revision";
    milestone.detail = `Revision requested ${today()} · developer notified · QA will re-verify`;
    project.status = "revision";
    db.audit.push({ id: uuid(), at: nowClock(), text: `client revision requested · ${project.title} M${milestoneId}` });
    return {};
  });

  revalidatePath("/project");
  revalidatePath("/dashboard");
  return result;
}

/** Developer resubmits after a revision (demo: exposed as a button on the workspace). */
export async function resubmitMilestone(projectId: string, milestoneId: number): Promise<ActionResult> {
  await requireUser();
  const result = await updateDb((db): ActionResult => {
    const project = db.projects.find((p) => p.id === projectId);
    const milestone = project?.milestones.find((m) => m.id === milestoneId);
    if (!project || !milestone) return { error: "Milestone not found." };
    if (milestone.state !== "revision") return { error: "Only milestones in revision can be resubmitted." };
    milestone.state = "in-qa";
    milestone.detail = `Resubmitted ${today()} · In QA (${project.testerName})`;
    project.status = "in-qa";
    db.audit.push({ id: uuid(), at: nowClock(), text: `developer resubmit · ${project.title} M${milestoneId} → QA` });
    return {};
  });
  revalidatePath("/project");
  revalidatePath("/dashboard");
  return result;
}

// ---------- Messaging ----------

export async function sendMessage(text: string): Promise<ActionResult> {
  const user = await requireUser();
  const clean = text.trim();
  if (!clean) return { error: "Message is empty." };
  if (clean.length > 4000) return { error: "Message is too long (4000 characters max)." };
  await updateDb((db) => {
    db.messages.push({
      id: uuid(),
      senderId: user.id,
      senderName: user.name,
      senderInitials: user.initials,
      text: clean,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) + " · Sent ✓",
    });
  });
  revalidatePath("/messages");
  return {};
}
