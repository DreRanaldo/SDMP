# SDMP — Software Dev Marketplace

**Find Expert Developers. Build Amazing Software.**

SDMP connects businesses, entrepreneurs, startups, and individuals with software
developers, UI/UX designers, QA testers, project managers, and DevOps engineers —
built around **milestone-based escrow payments** and **independent QA verification**.

Built with **Next.js 15 + React 19 + TypeScript**, a custom design system
(light + dark mode, glassmorphism accents, brand gradients), and zero runtime
dependencies beyond React — deployable anywhere Next.js runs.

---

## 🚀 Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm start          # serves the production build on :3000
```

## 📦 Deploy

**Vercel (recommended):**

1. Import the repo at **vercel.com/new** (or `npx vercel`).
2. In the project: **Storage → Create Database → Postgres (Neon)** and connect
   it — this injects `DATABASE_URL` automatically. Any other hosted Postgres
   (Neon, Supabase, RDS) works too: just set `DATABASE_URL` yourself.
3. **Settings → Environment Variables:** add `SDMP_SECRET` = a long random
   string (e.g. `openssl rand -hex 32`).
4. Redeploy, open the site, and **register the first account — it becomes
   the platform admin.**

Without a database attached the app still runs (it falls back to ephemeral
temp-dir storage) but accounts and projects reset on cold starts — attach
Postgres before inviting real users.

**Netlify:** connect the repo, build command `npm run build` (the Next.js runtime is auto-detected).

**Docker / any VPS:**

```bash
npm ci && npm run build
npm start          # behind nginx/caddy, or use PORT=8080 npm start
```

## 🗺️ Screens

| Route | Screen |
|---|---|
| `/` | Landing — hero, categories, featured developers, trending projects, how-it-works, escrow explainer, pricing, FAQ |
| `/login` | Auth — email + OAuth (Google/GitHub/Microsoft/Apple), 2FA hint |
| `/dashboard` | Client dashboard — stats, active projects, action items, wallet snapshot, activity feed |
| `/post-project` | 4-step project wizard with AI estimator, visibility, QA mode, escrow funding |
| `/browse` | Talent search — lists real registered members, filter rail |
| `/profile` | Developer profile — skills, portfolio, reviews, certificates, achievements |
| `/project` | Project workspace — Kanban board, **interactive milestone approval → escrow release**, QA report, commits |
| `/messages` | Real-time-style chat — threads, code snippets, typing indicator, milestone cards, **send messages** |
| `/wallet` | Wallet & escrow — balances, escrow by project, payment methods, transactions |
| `/admin` | Admin panel — revenue KPIs, verification queue, disputes, fraud signals, audit log |

Every page has a 🌙/☀️ theme toggle; the preference persists across pages and reloads.

## 🎨 Design system

Defined in `app/globals.css` (tokens → components → page styles):

- **Brand:** Primary `#2563EB` · Secondary `#4F46E5` · Accent `#06B6D4` · Success `#10B981` · Warning `#F59E0B` · Danger `#EF4444`
- **Backgrounds:** `#FFFFFF` (light) · `#0F172A` (dark) — switched via `[data-theme]` on `<html>`, no flash on load
- Rounded corners, brand gradients, glassmorphism (`backdrop-filter`), smooth animations, fully responsive

The full product/design specification (user types, flows, escrow state machine,
feature catalog) lives in the companion design package:
`DreRanaldo/Hellodre` → `sdmp-design/SPEC.md`.

## 🔐 Auth & accounts

Real session auth is built in — no external identity provider required:

- **Passwords** hashed with scrypt (Node `crypto`), verified in constant time
- **Sessions** are HMAC-signed, HTTP-only, `SameSite=Lax` cookies (7-day TTL)
- **Middleware** bounces unauthenticated requests off all app routes
- **Roles** (`client` / `developer` / `tester` / `admin`) — the admin panel is
  role-gated server-side via `requireRole("admin")`

There is **no seed data**. The database starts empty and **the first account
registered becomes the platform admin** — register yours immediately after
deploying.

## 🏗️ Architecture

```
app/actions.ts      server actions — the write API (auth, projects, escrow, chat)
lib/auth.ts         scrypt hashing + signed session cookies + route guards
lib/db.ts           data layer: file-backed JSON store behind a repository API
middleware.ts       edge gate for app routes
components/*Client  interactive views calling server actions
```

**The escrow state machine runs server-side** in `app/actions.ts`:
`locked → in-qa → released` (approve) or `in-qa → revision → in-qa` (revise →
resubmit). Every transition validates ownership, writes double-entry-style
ledger rows (release + QA fee), and appends to the audit log shown in the
admin panel. State persists in `.data/db.json` — approvals, new projects, and
chat messages survive restarts.

**Storage** is selected automatically by `lib/db.ts`:

- **`DATABASE_URL` set → Postgres.** Durable, serverless-safe. The schema
  (a single JSONB document table) is created automatically on first request;
  writes run inside `SELECT … FOR UPDATE` transactions.
- **No `DATABASE_URL` → JSON file store** for local dev (`./.data`, or
  `SDMP_DATA_DIR`). If the working directory is read-only (a serverless
  deploy without a database) it falls back to the OS temp dir, so the site
  keeps working with ephemeral storage instead of crashing.

**Environment variables:**

| Var | Purpose |
|---|---|
| `SDMP_SECRET` | HMAC key for session cookies — **required in production** |
| `DATABASE_URL` | Postgres connection string — **required for durable data** |
| `SDMP_DATA_DIR` | Local JSON store directory (dev only, default `./.data`) |

## 🚧 Remaining production work

1. **OAuth + 2FA** — Auth.js/Clerk for Google/GitHub/Microsoft/Apple + TOTP.
2. **Payments** — Stripe Connect: real deposits/transfers driven by the same
   state machine, webhooks reconciling the ledger.
3. **Real-time** — WebSockets (or Pusher/Ably) for chat, presence, typing
   indicators, and notifications.
4. **Integrations** — GitHub/GitLab/Bitbucket commit feeds, Figma embeds,
   WebRTC calls/screen share.
5. **Marketplace depth** — public developer/tester profiles with skills and
   rates, proposals & hiring flow, per-project chat threads, notifications.

## 📄 License

Proprietary — © 2026 SDMP.
