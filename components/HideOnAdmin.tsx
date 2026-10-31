"use client";

import { usePathname } from "next/navigation";

/** Hides the public site chrome (header/footer) inside /admin. */
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
