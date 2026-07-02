import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function MarketingNav() {
  return (
    <nav className="nav glass">
      <div className="container nav-inner">
        <Link className="brand" href="/">
          <span className="logo-mark">S</span> SDMP
        </Link>
        <div className="nav-links flex1">
          <Link href="/browse">Find Talent</Link>
          <Link href="/browse">Find Work</Link>
          <Link href="/browse">Browse Projects</Link>
          <Link href="/#how">How It Works</Link>
          <Link href="/#pricing">Pricing</Link>
        </div>
        <ThemeToggle />
        <Link className="btn btn-ghost" href="/login">
          Log in
        </Link>
        <Link className="btn btn-primary" href="/login">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
