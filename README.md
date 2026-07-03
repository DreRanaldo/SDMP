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

**Vercel (recommended — one step):**

```bash
npx vercel         # or connect the GitHub repo at vercel.com/new
```

Set `SDMP_SECRET` (any long random string) in production. Note: on serverless
hosts the demo's JSON store is ephemeral — fine for previews; see Architecture.

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
| `/browse` | Talent search — role tabs, live text filter, advanced filter rail |
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
- **Register** creates a working client account with an empty dashboard

Demo accounts (seeded on first run):

| Account | Email | Password |
|---|---|---|
| Client | `andre@demo.sdmp` | `demo1234` |
| Admin | `admin@demo.sdmp` | `admin1234` |

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

**Storage:** the JSON store works anywhere with a writable disk (dev, VPS,
Docker volume — set `SDMP_DATA_DIR` to relocate it). On serverless platforms
the filesystem is ephemeral, so state resets on cold starts; swap `lib/db.ts`
for Postgres (Prisma/Drizzle) behind the same exported functions when you
outgrow it.

**Environment variables:**

| Var | Purpose |
|---|---|
| `SDMP_SECRET` | HMAC key for session cookies — **set this in production** |
| `SDMP_DATA_DIR` | Data directory (default `./.data`) |

## 🚧 Remaining production work

1. **Real database** — Postgres behind `lib/db.ts`'s interface (serverless-safe).
2. **OAuth + 2FA** — Auth.js/Clerk for Google/GitHub/Microsoft/Apple + TOTP.
3. **Payments** — Stripe Connect: real deposits/transfers driven by the same
   state machine, webhooks reconciling the ledger.
4. **Real-time** — WebSockets (or Pusher/Ably) for chat, presence, typing
   indicators, and notifications.
5. **Integrations** — GitHub/GitLab/Bitbucket commit feeds, Figma embeds,
   WebRTC calls/screen share.

## 📄 License

Proprietary — © 2026 SDMP.
