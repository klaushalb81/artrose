"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/om", label: "Om oss" },
  { href: "/hva-er-artrose", label: "Hva er artrose" },
  { href: "/slik-virker-det", label: "Slik virker det" },
  { href: "/priser", label: "Priser" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-brand">
          <span className="stripe-mark"></span> Artrosefysio
        </Link>
        <nav className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "nav-link active" : "nav-link"}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="nav-icon" aria-label="Søk">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <Link href="/kontakt" className="btn btn-filled">
            Bestill time
          </Link>
        </div>
      </div>
    </header>
  );
}
