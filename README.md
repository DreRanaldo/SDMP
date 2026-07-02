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

No environment variables are required for the demo build.

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

## 🏗️ Architecture & next steps

This is the **launchable demo build**: every screen and interaction runs on seeded
data from `lib/data.ts`, with client-side state for the interactive flows
(milestone approval, chat, project wizard). To take it to production:

1. **Database & API** — replace `lib/data.ts` with a data layer (PostgreSQL +
   Prisma/Drizzle) exposed through route handlers or server actions.
2. **Auth** — swap the demo login for Auth.js/Clerk with the same OAuth
   providers plus TOTP 2FA; gate app routes with middleware.
3. **Payments/escrow** — Stripe Connect: deposits into a platform balance
   (double-entry ledger), transfers on milestone approval, webhooks driving the
   escrow state machine (Funded → In QA → Client Review → Released / Dispute).
4. **Real-time** — WebSockets (or Pusher/Ably) for chat, presence, typing
   indicators, and notifications.
5. **Integrations** — GitHub/GitLab/Bitbucket OAuth apps for commit feeds,
   Figma embeds, WebRTC for calls/screen share.

## 📄 License

Proprietary — © 2026 SDMP.
