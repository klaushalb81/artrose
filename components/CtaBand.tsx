import Link from "next/link";
import type { ReactNode } from "react";

type CtaBandProps = {
  id?: string;
  label: string;
  title: ReactNode;
  lede: ReactNode;
  /** Secondary button rendered next to "Bestill time". */
  secondary: ReactNode;
  /** The homepage uses a denser set of background curves. */
  extended?: boolean;
};

export default function CtaBand({ id, label, title, lede, secondary, extended }: CtaBandProps) {
  return (
    <section id={id} className="cta-band">
      <div className="cta-bg" aria-hidden="true">
        <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g stroke="currentColor" strokeWidth="0.8" fill="none" strokeOpacity="0.6">
            <path d="M 0 300 Q 360 200 720 300 T 1440 300" />
            <path d="M 0 320 Q 360 220 720 320 T 1440 320" />
            <path d="M 0 340 Q 360 240 720 340 T 1440 340" />
            {extended && (
              <>
                <path d="M 0 360 Q 360 260 720 360 T 1440 360" />
                <path d="M 0 280 Q 360 180 720 280 T 1440 280" />
                <path d="M 0 260 Q 360 160 720 260 T 1440 260" />
              </>
            )}
          </g>
          <g stroke="#e8001c" strokeWidth="1.4" fill="none" strokeOpacity="0.8">
            <path d="M 0 310 Q 360 210 720 310 T 1440 310" />
          </g>
        </svg>
      </div>

      <div className="container">
        <div className="label" style={{ marginBottom: 32 }}>
          <span className="stripe-inline"></span> {label}
        </div>
        <h2 className="display-lg">{title}</h2>
        <p className="lede">{lede}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          <Link href="/kontakt" className="btn btn-filled">
            Bestill time <span className="arrow">→</span>
          </Link>
          {secondary}
        </div>
      </div>
    </section>
  );
}
