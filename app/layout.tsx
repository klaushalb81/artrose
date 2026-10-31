import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HideOnAdmin from "@/components/HideOnAdmin";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Artrosefysio — Spesialisert fysioterapi ved artrose",
  description:
    "Artrosefysio leverer målrettet treningsbehandling og fysioterapi for artrose i kne og hofte. Mindre smerter. Mer bevegelse.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nb" className={inter.variable}>
      <body>
        <HideOnAdmin>
          <SiteHeader />
        </HideOnAdmin>
        {children}
        <HideOnAdmin>
          <SiteFooter />
        </HideOnAdmin>
      </body>
    </html>
  );
}
