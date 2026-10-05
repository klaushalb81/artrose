import Link from "next/link";

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
                <Link href="/om">Om oss</Link>
              </li>
              <li>
                <Link href="/om#team">Teamet</Link>
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
                <a href="tel:+4700000000">+47 00 00 00 00</a>
              </li>
              <li>
                <a href="mailto:post@artrosefysio.no">post@artrosefysio.no</a>
              </li>
              <li>Hovedgata 12, 0123 Oslo</li>
              <li>Man–Fre 08:00–18:00</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="caption">© {year} Artrosefysio AS · Org. 000 000 000</span>
          <span className="caption">
            <a href="#">Personvern</a> · <a href="#">Cookies</a> · NO
          </span>
        </div>
      </div>
    </footer>
  );
}
