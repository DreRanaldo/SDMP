/**
 * SDMP data layer — file-backed JSON store with an async mutex.
 *
 * Works anywhere with a writable disk (dev, VPS, Docker volume). On
 * serverless platforms the filesystem is ephemeral — swap this module for a
 * real database (Postgres + Prisma/Drizzle) behind the same exported
 * functions; nothing else in the app touches storage directly.
 */
import { promises as fs } from "fs";
import path from "path";
import { randomUUID, scryptSync, randomBytes } from "crypto";

export type Role = "client" | "developer" | "tester" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  initials: string;
  role: Role;
  passwordHash: string;
  createdAt: string;
}

/** User shape safe to pass to client components (no credentials). */
export type SafeUser = Pick<User, "id" | "email" | "name" | "initials" | "role">;

export type MilestoneState = "locked" | "in-qa" | "revision" | "released";

export interface Milestone {
  id: number;
  title: string;
  amount: number;
  state: MilestoneState;
  detail: string;
}

export type ProjectStatus = "proposals" | "in-progress" | "in-qa" | "revision" | "completed";

export interface Project {
  id: string;
  title: string;
  clientId: string;
  developerName: string;
  developerInitials: string;
  avatarClass: string;
  testerName: string;
  stack: string[];
  status: ProjectStatus;
  visibility: string;
  priority: string;
  dueDate: string;
  proposals: number;
  milestones: Milestone[];
  createdAt: string;
}

export type LedgerType = "deposit" | "release" | "qa-fee" | "refund" | "fee";

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  type: LedgerType;
  amount: number; // positive = into escrow/account, negative = paid out
  status: "Settled" | "Locked";
  invoice: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  text: string;
  time: string;
  code?: string;
  file?: string;
}

export interface AuditEvent {
  id: string;
  at: string;
  text: string;
}

export interface Db {
  users: User[];
  projects: Project[];
  ledger: LedgerEntry[];
  messages: ChatMessage[];
  audit: AuditEvent[];
}

const DATA_DIR = process.env.SDMP_DATA_DIR || path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function seed(): Db {
  const now = new Date().toISOString();
  const andre: User = {
    id: "u-andre",
    email: "andre@demo.sdmp",
    name: "Andre Grant",
    initials: "AG",
    role: "client",
    passwordHash: hashPassword("demo1234"),
    createdAt: now,
  };
  const admin: User = {
    id: "u-admin",
    email: "admin@demo.sdmp",
    name: "SDMP Admin",
    initials: "AD",
    role: "admin",
    passwordHash: hashPassword("admin1234"),
    createdAt: now,
  };
  const maya: User = {
    id: "u-maya",
    email: "maya@demo.sdmp",
    name: "Maya Kim",
    initials: "MK",
    role: "developer",
    passwordHash: hashPassword("demo1234"),
    createdAt: now,
  };

  return {
    users: [andre, admin, maya],
    projects: [
      {
        id: "fintech-dashboard",
        title: "Fintech Dashboard · React + Go",
        clientId: andre.id,
        developerName: "Maya Kim",
        developerInitials: "MK",
        avatarClass: "a2",
        testerName: "Rita Torres",
        stack: ["React", "Go", "PostgreSQL", "AWS"],
        status: "in-qa",
        visibility: "Private project",
        priority: "High",
        dueDate: "Jul 14",
        proposals: 18,
        createdAt: now,
        milestones: [
          { id: 1, title: "M1 — Auth, accounts & billing", amount: 4000, state: "released", detail: "Delivered Jun 18 · QA passed · Released Jun 26 ✓" },
          { id: 2, title: "M2 — Dashboards, charts & exports", amount: 4000, state: "in-qa", detail: "Submitted Jul 1 · In QA (Rita Torres) · 32/34 checks passed" },
          { id: 3, title: "M3 — Audit logs, import & polish", amount: 4000, state: "locked", detail: "Starts after M2 approval · due Jul 28 · 🔒 locked in escrow" },
        ],
      },
      {
        id: "fitness-app",
        title: "Fitness App (iOS/Android)",
        clientId: andre.id,
        developerName: "Diego Alvarez",
        developerInitials: "DA",
        avatarClass: "a4",
        testerName: "Unassigned",
        stack: ["Flutter", "HealthKit", "GraphQL"],
        status: "in-progress",
        visibility: "Public",
        priority: "Normal",
        dueDate: "Jul 22",
        proposals: 22,
        createdAt: now,
        milestones: [
          { id: 1, title: "M1 — Auth & onboarding", amount: 5000, state: "locked", detail: "In progress · due Jul 22" },
          { id: 2, title: "M2 — Tracking & wearable sync", amount: 7000, state: "locked", detail: "🔒 locked in escrow" },
          { id: 3, title: "M3 — Social challenges", amount: 3500, state: "locked", detail: "🔒 locked in escrow" },
          { id: 4, title: "M4 — Polish & release", amount: 2500, state: "locked", detail: "🔒 locked in escrow" },
        ],
      },
      {
        id: "support-ai-agent",
        title: "Support AI Agent",
        clientId: andre.id,
        developerName: "Unassigned",
        developerInitials: "AI",
        avatarClass: "a3",
        testerName: "Unassigned",
        stack: ["Python", "Claude API", "PostgreSQL"],
        status: "proposals",
        visibility: "Public",
        priority: "High",
        dueDate: "Aug 15",
        proposals: 31,
        createdAt: now,
        milestones: [
          { id: 1, title: "M1 — Ingestion + RAG pipeline", amount: 3200, state: "locked", detail: "Awaiting hire" },
          { id: 2, title: "M2 — Chat UI + handoff", amount: 3200, state: "locked", detail: "🔒 locked in escrow" },
          { id: 3, title: "M3 — Analytics console + hardening", amount: 3100, state: "locked", detail: "🔒 locked in escrow" },
        ],
      },
      {
        id: "marketing-website",
        title: "Marketing Website",
        clientId: andre.id,
        developerName: "Maya Kim",
        developerInitials: "MK",
        avatarClass: "a5",
        testerName: "Rita Torres",
        stack: ["Next.js", "Tailwind"],
        status: "completed",
        visibility: "Private project",
        priority: "Normal",
        dueDate: "Jun 20",
        proposals: 9,
        createdAt: now,
        milestones: [
          { id: 1, title: "M1 — Design & build", amount: 3250, state: "released", detail: "Released Jun 12 ✓" },
          { id: 2, title: "M2 — CMS & launch", amount: 3250, state: "released", detail: "Released Jun 20 ✓ · ★ 5.0 review left" },
        ],
      },
    ],
    ledger: [
      { id: "tx-1026", date: "Jun 18", description: "Platform service fee (5% · Pro plan)", type: "fee", amount: -162.5, status: "Settled", invoice: "INV-1026" },
      { id: "tx-1027", date: "Jun 20", description: "Escrow release · Marketing Website final → Maya Kim", type: "release", amount: -3250, status: "Settled", invoice: "INV-1027" },
      { id: "tx-1031", date: "Jun 24", description: "Refund · cancelled Chrome extension project", type: "refund", amount: 1200, status: "Settled", invoice: "INV-1031" },
      { id: "tx-1039", date: "Jun 30", description: "Escrow deposit · Fitness App (full amount)", type: "deposit", amount: 18000, status: "Locked", invoice: "INV-1039" },
      { id: "tx-1042", date: "Jul 01", description: "Escrow release · Fintech Dashboard M1 → Maya Kim", type: "release", amount: -4000, status: "Settled", invoice: "INV-1042" },
      { id: "tx-1043", date: "Jul 01", description: "QA fee · Fintech Dashboard M1 → Rita Torres", type: "qa-fee", amount: -320, status: "Settled", invoice: "INV-1043" },
    ],
    messages: [
      { id: randomUUID(), senderId: "u-maya", senderName: "Maya Kim", senderInitials: "MK", time: "9:14 AM", text: "Morning Andre! The real-time chart streaming is in. WebSocket layer pushes deltas every 500ms with backpressure handling." },
      { id: randomUUID(), senderId: "u-maya", senderName: "Maya Kim", senderInitials: "MK", time: "9:15 AM", text: "Here's the subscription hook if you want a peek:", code: "const usePriceStream = (symbol: string) =>\n  useSubscription(PRICE_STREAM, {\n    variables: { symbol },\n    onData: ({ data }) => buffer.push(data),\n  });" },
      { id: randomUUID(), senderId: "u-andre", senderName: "Andre Grant", senderInitials: "AG", time: "9:22 AM · Read ✓✓", text: "This looks great! 🔥 How does it behave on flaky connections?" },
      { id: randomUUID(), senderId: "u-maya", senderName: "Maya Kim", senderInitials: "MK", time: "9:24 AM", text: "Auto-reconnect with exponential backoff, and the buffer replays missed deltas. Rita can hammer it in QA — I added a network-throttle test case to the checklist." },
      { id: randomUUID(), senderId: "u-maya", senderName: "Maya Kim", senderInitials: "MK", time: "9:26 AM", text: "Friday demo recording — full walkthrough of M2", file: "milestone-2-demo.mp4 (38 MB)" },
    ],
    audit: [
      { id: randomUUID(), at: "13:40", text: "admin.rt ban user spam_4412 (ToS 4.2)" },
      { id: randomUUID(), at: "13:47", text: "system flag payment pi_9f2… (velocity)" },
      { id: randomUUID(), at: "13:51", text: "admin.jd verify user jonas.weber" },
      { id: randomUUID(), at: "13:58", text: "system release $4,000 → maya.kim" },
      { id: randomUUID(), at: "14:02", text: "admin.rt freeze escrow DSP-3041" },
    ],
  };
}

// ---- store ----

let queue: Promise<unknown> = Promise.resolve();

/** Serialize all read-modify-write cycles through a single promise chain. */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = queue.then(fn, fn);
  queue = next.catch(() => {});
  return next;
}

async function load(): Promise<Db> {
  try {
    return JSON.parse(await fs.readFile(DB_FILE, "utf8")) as Db;
  } catch {
    const db = seed();
    await save(db);
    return db;
  }
}

async function save(db: Db): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = DB_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(db, null, 2));
  await fs.rename(tmp, DB_FILE);
}

export function readDb(): Promise<Db> {
  return withLock(load);
}

export function updateDb<T>(mutate: (db: Db) => T | Promise<T>): Promise<T> {
  return withLock(async () => {
    const db = await load();
    const result = await mutate(db);
    await save(db);
    return result;
  });
}

export function toSafeUser(u: User): SafeUser {
  return { id: u.id, email: u.email, name: u.name, initials: u.initials, role: u.role };
}

export const uuid = randomUUID;
