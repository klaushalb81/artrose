import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin | Artrosefysio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const loggedIn = await isAdmin();

  return (
    <div className="admin">
      <header className="admin-bar">
        <div className="container admin-bar-inner">
          <Link href="/admin" className="nav-brand">
            <span className="stripe-mark"></span> Artrosefysio <span className="admin-badge">Admin</span>
          </Link>
          {loggedIn && (
            <nav className="admin-nav">
              <Link href="/admin">Videopakken</Link>
              <Link href="/admin/salg">Salg</Link>
              <Link href="/videoer" target="_blank">
                Se butikken ↗
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="admin-link-btn">
                  Logg ut
                </button>
              </form>
            </nav>
          )}
        </div>
      </header>
      <main className="container admin-main">{children}</main>
    </div>
  );
}
