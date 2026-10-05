import Link from "next/link";
import type { ReactNode } from "react";

type PageHeroProps = {
  crumb: string;
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
};

export default function PageHero({ crumb, eyebrow, title, lede }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg"></div>
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Hjem</Link>
          <span className="sep">/</span>
          <span>{crumb}</span>
        </nav>
        <div className="hero-eyebrow">
          <span className="stripe-inline"></span>
          <span className="label label-muted">{eyebrow}</span>
        </div>
        <h1 className="display-xl">{title}</h1>
        <p className="lede">{lede}</p>
      </div>
    </section>
  );
}
