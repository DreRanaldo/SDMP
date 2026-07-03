/**
 * SDMP data layer.
 *
 * Backend is chosen automatically:
 *  - DATABASE_URL / POSTGRES_URL set  → Postgres (durable; use in production).
 *    State lives in a single JSONB document row, mutated inside a
 *    SELECT … FOR UPDATE transaction so concurrent writes serialize safely.
 *  - otherwise                        → file-backed JSON store for local dev.
 *    If the working directory is read-only (serverless preview without a
 *    database attached) it falls back to the OS temp dir so the app degrades
 *    to ephemeral storage instead of crashing.
 *
 * The store starts EMPTY — no demo accounts or seed projects. The first
 * registered user becomes the platform admin (see app/actions.ts).
 */
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { randomUUID, scryptSync, randomBytes } from "crypto";
import { Pool } from "pg";

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
  /** User whose wallet this entry belongs to (the paying client). */
  ownerId: string;
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

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function emptyDb(): Db {
  return { users: [], projects: [], ledger: [], messages: [], audit: [] };
}

// ---------------------------------------------------------------- backends

interface Store {
  read(): Promise<Db>;
  update<T>(mutate: (db: Db) => T | Promise<T>): Promise<T>;
}

// ---- Postgres (production) ----

class PostgresStore implements Store {
  private pool: Pool;
  private ready: Promise<void> | null = null;

  constructor(url: string) {
    const local = /localhost|127\.0\.0\.1/.test(url);
    this.pool = new Pool({
      connectionString: url,
      max: 3,
      ssl: local ? undefined : { rejectUnauthorized: false },
    });
  }

  private init(): Promise<void> {
    if (!this.ready) {
      this.ready = (async () => {
        await this.pool.query(
          "CREATE TABLE IF NOT EXISTS sdmp_store (id TEXT PRIMARY KEY, data JSONB NOT NULL)",
        );
        await this.pool.query(
          "INSERT INTO sdmp_store (id, data) VALUES ('db', $1) ON CONFLICT (id) DO NOTHING",
          [emptyDb()],
        );
      })();
      // Allow a retry on transient startup failure instead of caching the rejection.
      this.ready.catch(() => { this.ready = null; });
    }
    return this.ready;
  }

  async read(): Promise<Db> {
    await this.init();
    const r = await this.pool.query("SELECT data FROM sdmp_store WHERE id = 'db'");
    return (r.rows[0]?.data as Db) ?? emptyDb();
  }

  async update<T>(mutate: (db: Db) => T | Promise<T>): Promise<T> {
    await this.init();
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const r = await client.query("SELECT data FROM sdmp_store WHERE id = 'db' FOR UPDATE");
      const db: Db = (r.rows[0]?.data as Db) ?? emptyDb();
      const result = await mutate(db);
      await client.query("UPDATE sdmp_store SET data = $1 WHERE id = 'db'", [db]);
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK").catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  }
}

// ---- File-backed JSON (local dev / no-database fallback) ----

class FileStore implements Store {
  private queue: Promise<unknown> = Promise.resolve();
  private dir: string | null = null;

  private async ensureDir(): Promise<string> {
    if (this.dir) return this.dir;
    const candidates = [
      process.env.SDMP_DATA_DIR,
      path.join(process.cwd(), ".data"),
      path.join(os.tmpdir(), "sdmp-data"),
    ].filter(Boolean) as string[];
    for (const dir of candidates) {
      try {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, ".write-test"), "ok");
        await fs.rm(path.join(dir, ".write-test"), { force: true });
        this.dir = dir;
        return dir;
      } catch {
        // read-only location (e.g. serverless bundle) — try the next candidate
      }
    }
    throw new Error("SDMP: no writable data directory found. Set DATABASE_URL or SDMP_DATA_DIR.");
  }

  private withLock<T>(fn: () => Promise<T>): Promise<T> {
    const next = this.queue.then(fn, fn);
    this.queue = next.catch(() => {});
    return next;
  }

  private async load(): Promise<Db> {
    const dir = await this.ensureDir();
    try {
      return JSON.parse(await fs.readFile(path.join(dir, "db.json"), "utf8")) as Db;
    } catch {
      const db = emptyDb();
      await this.save(db);
      return db;
    }
  }

  private async save(db: Db): Promise<void> {
    const dir = await this.ensureDir();
    const file = path.join(dir, "db.json");
    await fs.writeFile(file + ".tmp", JSON.stringify(db, null, 2));
    await fs.rename(file + ".tmp", file);
  }

  read(): Promise<Db> {
    return this.withLock(() => this.load());
  }

  update<T>(mutate: (db: Db) => T | Promise<T>): Promise<T> {
    return this.withLock(async () => {
      const db = await this.load();
      const result = await mutate(db);
      await this.save(db);
      return result;
    });
  }
}

// ---------------------------------------------------------------- selection

const PG_URL =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;

declare global {
  // eslint-disable-next-line no-var
  var __sdmpStore: Store | undefined;
}

function getStore(): Store {
  if (!globalThis.__sdmpStore) {
    globalThis.__sdmpStore = PG_URL ? new PostgresStore(PG_URL) : new FileStore();
  }
  return globalThis.__sdmpStore;
}

export function readDb(): Promise<Db> {
  return getStore().read();
}

export function updateDb<T>(mutate: (db: Db) => T | Promise<T>): Promise<T> {
  return getStore().update(mutate);
}

export function toSafeUser(u: User): SafeUser {
  return { id: u.id, email: u.email, name: u.name, initials: u.initials, role: u.role };
}

export const uuid = randomUUID;
