import Link from "next/link";
import { BUSINESS } from "@/lib/business";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="nav-brand">
              <span className="stripe-mark"></span> Artrosefysio
            </Link>
            <p>Spesialisert fysioterapi for deg med artrose i kne eller hofte.</p>
            <div style={{ marginTop: 8 }}>
              <div className="stripe" style={{ width: 80 }}></div>
            </div>
          </div>
          <div className="foot-col">
            <h4>Behandling</h4>
            <ul>
              <li>
                <Link href="/hva-er-artrose">Hva er artrose</Link>
              </li>
              <li>
                <Link href="/slik-virker-det">Slik virker det</Link>
              </li>
              <li>
                <Link href="/priser">Priser</Link>
              </li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Klinikken</h4>
            <ul>
              <li>
                <Link href="/om">Om Artrosefysio</Link>
              </li>
              <li>
                <Link href="/kontakt">Bestill time</Link>
              </li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Kontakt</h4>
            <ul>
              <li>
                <a href="mailto:artrosefys@gmail.com">artrosefys@gmail.com</a>
              </li>
              <li>Sterk Kropp</li>
              <li>Teglhageveien 29, 3125 Tønsberg</li>
              <li>Man, ons, fre 06:30–16:00</li>
              <li>Tir, tor 06:30–19:00</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="caption">
            © {year} {BUSINESS.legalName} · Org.nr. {BUSINESS.orgNumber}
          </span>
          <span className="caption">
            <Link href="/salgsbetingelser">Salgsbetingelser</Link> · <Link href="/personvern">Personvern</Link> ·{" "}
            <Link href="/personvern#informasjonskapsler">Cookies</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
