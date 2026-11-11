"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/om", label: "Om Artrosefysio" },
  { href: "/hva-er-artrose", label: "Hva er artrose" },
  { href: "/slik-virker-det", label: "Slik virker det" },
  { href: "/priser", label: "Priser" },
  { href: "/videoer", label: "Program" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the phone menu with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-brand" onClick={close}>
          <span className="stripe-mark"></span> Artrosefysio
        </Link>
        <nav className="nav-links" aria-label="Hovedmeny">
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
          <Link href="/kontakt" className="btn btn-filled nav-cta" onClick={close}>
            Bestill time
          </Link>
          <button
            type="button"
            className="nav-icon nav-toggle"
            aria-label={open ? "Lukk meny" : "Åpne meny"}
            aria-expanded={open}
            aria-controls="mobilmeny"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobilmeny" className="mobile-menu" aria-label="Meny">
          <div className="container">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className={pathname === link.href ? "mobile-link active" : "mobile-link"}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/kontakt" onClick={close} className="mobile-link">
              Bestill time
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
