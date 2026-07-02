/**
 * Seed data for the SDMP demo build.
 * In production this module is replaced by API/database access
 * (see README — Architecture & next steps).
 */

export type Developer = {
  id: string;
  initials: string;
  avatarClass: string;
  online: boolean;
  name: string;
  title: string;
  location: string;
  responseTime: string;
  projects: number;
  blurb: string;
  skills: string[];
  rating: number;
  reviews: number;
  rate: number;
  badges: { label: string; tone: string }[];
};

export const developers: Developer[] = [
  {
    id: "maya-kim",
    initials: "MK",
    avatarClass: "a2",
    online: true,
    name: "Maya Kim",
    title: "Senior Full-Stack Developer",
    location: "Seoul 🇰🇷",
    responseTime: "~1h",
    projects: 312,
    blurb:
      "Fintech & SaaS specialist. I build dashboards, billing systems, and APIs that scale. 8 years shipping production React + Go.",
    skills: ["React", "Go", "PostgreSQL", "AWS", "Stripe"],
    rating: 5.0,
    reviews: 312,
    rate: 95,
    badges: [
      { label: "✓ Verified", tone: "primary" },
      { label: "🏆 Top Rated", tone: "warning" },
    ],
  },
  {
    id: "diego-alvarez",
    initials: "DA",
    avatarClass: "a4",
    online: true,
    name: "Diego Alvarez",
    title: "Mobile Engineer",
    location: "Bogotá 🇨🇴",
    responseTime: "~30m",
    projects: 208,
    blurb:
      "Cross-platform mobile apps with native polish. Flutter, Swift, Kotlin — health, fitness, and social products.",
    skills: ["Flutter", "Swift", "Kotlin", "Firebase"],
    rating: 4.9,
    reviews: 208,
    rate: 78,
    badges: [
      { label: "✓ Verified", tone: "primary" },
      { label: "⚡ Fast Delivery", tone: "accent" },
    ],
  },
  {
    id: "amara-okafor",
    initials: "AO",
    avatarClass: "a3",
    online: false,
    name: "Amara Okafor",
    title: "ML Engineer",
    location: "Lagos 🇳🇬",
    responseTime: "~2h",
    projects: 164,
    blurb:
      "LLM apps, RAG pipelines, and MLOps. I take AI products from prototype to production with measurable quality.",
    skills: ["Python", "PyTorch", "Claude API", "GCP"],
    rating: 4.9,
    reviews: 164,
    rate: 110,
    badges: [
      { label: "✓ Verified", tone: "primary" },
      { label: "🎓 Expert", tone: "secondary" },
    ],
  },
  {
    id: "jonas-weber",
    initials: "JW",
    avatarClass: "a5",
    online: false,
    name: "Jonas Weber",
    title: "DevOps Engineer",
    location: "Berlin 🇩🇪",
    responseTime: "~3h",
    projects: 141,
    blurb:
      "Kubernetes, CI/CD, and cloud cost optimization. I make deploys boring and infrastructure invisible.",
    skills: ["Kubernetes", "Terraform", "AWS", "GitHub Actions"],
    rating: 4.8,
    reviews: 141,
    rate: 88,
    badges: [{ label: "✓ Verified", tone: "primary" }],
  },
];

export type Milestone = {
  id: number;
  title: string;
  amount: number;
  state: "released" | "in-qa" | "locked";
  detail: string;
};

export const fintechProject = {
  id: "fintech-dashboard",
  name: "Fintech Dashboard · React + Go",
  client: "Andre Grant",
  developer: "Maya Kim",
  tester: "Rita Torres",
  visibility: "Private project",
  stack: ["React", "Go", "PostgreSQL", "AWS"],
  totalEscrow: 12000,
  milestones: [
    {
      id: 1,
      title: "M1 — Auth, accounts & billing",
      amount: 4000,
      state: "released",
      detail: "Delivered Jun 18 · QA passed · Released Jun 26 ✓",
    },
    {
      id: 2,
      title: "M2 — Dashboards, charts & exports",
      amount: 4000,
      state: "in-qa",
      detail: "Submitted Jul 1 · In QA (Rita Torres) · 32/34 checks passed",
    },
    {
      id: 3,
      title: "M3 — Audit logs, import & polish",
      amount: 4000,
      state: "locked",
      detail: "Starts after M2 approval · due Jul 28 · 🔒 locked in escrow",
    },
  ] as Milestone[],
};

export const categories = [
  { icon: "🌐", tint: "var(--primary-soft)", name: "Web Development", experts: "8,204" },
  { icon: "📱", tint: "var(--secondary-soft)", name: "Mobile Apps", experts: "4,110" },
  { icon: "🤖", tint: "var(--accent-soft)", name: "AI & Machine Learning", experts: "2,876" },
  { icon: "☁️", tint: "var(--success-soft)", name: "Cloud & DevOps", experts: "3,450" },
  { icon: "🎮", tint: "var(--warning-soft)", name: "Game Development", experts: "1,932" },
  { icon: "🛡️", tint: "var(--danger-soft)", name: "Cybersecurity", experts: "1,204" },
  { icon: "🎨", tint: "var(--primary-soft)", name: "UI/UX Design", experts: "3,780" },
  { icon: "🧪", tint: "var(--accent-soft)", name: "QA & Testing", experts: "2,140" },
];
