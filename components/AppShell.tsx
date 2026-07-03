import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { logout } from "@/app/actions";
import type { SafeUser } from "@/lib/db";

export type NavKey =
  | "dashboard"
  | "projects"
  | "messages"
  | "wallet"
  | "browse"
  | "none";

function SideLink({
  href,
  active,
  children,
  badge,
  badgeTone = "neutral",
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
  badge?: string;
  badgeTone?: "primary" | "danger" | "neutral";
}) {
  return (
    <Link className={`side-link${active ? " active" : ""}`} href={href}>
      {children}
      {badge && <span className={`badge badge-${badgeTone}`}>{badge}</span>}
    </Link>
  );
}

export default function AppShell({
  active,
  topbar,
  children,
  user,
  flush = false,
}: {
  active: NavKey;
  topbar: React.ReactNode;
  children: React.ReactNode;
  user?: SafeUser;
  /** Render children without the padded .content wrapper (full-bleed views like chat). */
  flush?: boolean;
}) {
  return (
    <div className="app">
      <aside className="sidebar">
        <Link className="side-brand" href="/">
          <span className="logo-mark">S</span> SDMP
        </Link>
        <div className="side-label">Workspace</div>
        <SideLink href="/dashboard" active={active === "dashboard"}>📊 Dashboard</SideLink>
        <SideLink href="/project" active={active === "projects"} badge="4" badgeTone="primary">📁 Projects</SideLink>
        <SideLink href="/messages" active={active === "messages"} badge="3" badgeTone="danger">💬 Messages</SideLink>
        <SideLink href="/dashboard" badge="9">🔔 Notifications</SideLink>
        <SideLink href="/dashboard">📅 Calendar</SideLink>
        <SideLink href="/dashboard">✅ Tasks</SideLink>
        <div className="side-label">Finance</div>
        <SideLink href="/wallet" active={active === "wallet"}>👛 Wallet &amp; Escrow</SideLink>
        <SideLink href="/wallet">🧾 Invoices</SideLink>
        <div className="side-label">Talent</div>
        <SideLink href="/browse" active={active === "browse"}>🔍 Find Developers</SideLink>
        <SideLink href="/browse">🧪 Find Testers</SideLink>
        <SideLink href="/profile">⭐ Reviews</SideLink>
        <div style={{ flex: 1 }} />
        {user?.role === "admin" && <SideLink href="/admin">🛠️ Admin Panel</SideLink>}
        <SideLink href="/dashboard">⚙️ Settings</SideLink>
        {user && (
          <form action={logout}>
            <button className="side-link" style={{ width: "100%" }} type="submit">
              🚪 Log out
            </button>
          </form>
        )}
      </aside>

      <div className="main">
        <div className="topbar">
          {topbar}
          <ThemeToggle />
          <Link className="btn btn-primary btn-sm" href="/post-project">
            + New Project
          </Link>
          <span className="avatar-wrap" title={user ? `${user.name} (${user.email})` : undefined}>
            <span className="avatar a5 online">{user?.initials ?? "??"}</span>
          </span>
        </div>
        {flush ? children : <div className="content">{children}</div>}
      </div>
    </div>
  );
}
