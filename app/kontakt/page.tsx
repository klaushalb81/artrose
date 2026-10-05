import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SpecBand from "@/components/SpecBand";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Kontakt og bestill time | Artrosefysio",
  description:
    "Bestill time hos Artrosefysio. Telefon, e-post, åpningstider og adresse. Vi svarer samme dag.",
};

const faq = [
  {
    q: "Trenger jeg henvisning fra lege?",
    a: "Nei, du kan bestille time direkte. Har du henvisning fra fastlege eller spesialist tar vi gjerne imot den, men det er ikke et krav.",
    open: true,
  },
  {
    q: "Hvor raskt får jeg time?",
    a: "Som regel innen 1–3 virkedager. Akutte timer kan ofte tilbys samme uke.",
  },
  {
    q: "Kan jeg avbestille uten å betale?",
    a: "Ja, så lenge du gir beskjed minst 24 timer før avtalt time. Senere avbestilling eller uteblivelse belastes etter full takst.",
  },
  {
    q: "Hvilke betalingsmåter tar dere?",
    a: "Vipps, alle vanlige bankkort i klinikken, eller faktura på e-post uten gebyr.",
  },
  {
    q: "Tar dere imot HELFO og frikort?",
    a: "Ja, vi har avtale med HELFO og frikort 2 godtas. Etter at du har nådd egenandelsgrensen er behandling gratis ut kalenderåret.",
  },
];

export default function KontaktPage() {
  return (
    <>
      <PageHero
        crumb="Kontakt"
        eyebrow="Kontakt og bestilling"
        title="Bestill time."
        lede="Send oss noen detaljer, så ringer vi deg samme dag for å avtale tidspunkt. Du kan også ringe direkte."
      />

      <div className="stripe"></div>

      {/* QUICK CONTACT */}
      <SpecBand
        items={[
          { value: "+47 00 00 00 00", label: "Telefon", valueStyle: { fontSize: 24 } },
          { value: "post@artrosefysio.no", label: "E-post", valueStyle: { fontSize: 22 } },
          { value: "Hovedgata 12", label: "Adresse · 0123 Oslo", valueStyle: { fontSize: 22 } },
          { value: "Man–Fre 08–18", label: "Åpningstider", valueStyle: { fontSize: 22 } },
        ]}
      />

      {/* BOOKING FORM + INFO */}
      <section>
        <div className="container">
          <div className="contact-grid">
            {/* FORM */}
            <div>
              <div className="label" style={{ marginBottom: 24 }}>
                <span className="stripe-inline"></span> Bestillingsskjema
              </div>
              <h2 className="display-md" style={{ marginBottom: 16 }}>
                Vi ringer deg samme dag.
              </h2>
              <p className="body" style={{ marginBottom: 32, maxWidth: 560 }}>
                Fyll ut skjemaet så enkelt eller detaljert du vil. Alle felt merket med{" "}
                <span className="text-accent">*</span> er obligatoriske.
              </p>

              <BookingForm />
            </div>

            {/* INFO */}
            <div>
              <div className="label" style={{ marginBottom: 24 }}>
                <span className="stripe-inline"></span> Klinikkinfo
              </div>
              <h2 className="display-md" style={{ marginBottom: 24 }}>
                Slik finner du oss.
              </h2>

              <div className="map-placeholder" style={{ marginBottom: 32 }}>
                <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="currentColor" strokeWidth="0.6" fill="none" strokeOpacity="0.5">
                    {/* Streets grid */}
                    <line x1="0" y1="80" x2="400" y2="80" />
                    <line x1="0" y1="160" x2="400" y2="160" />
                    <line x1="0" y1="240" x2="400" y2="240" />
                    <line x1="0" y1="320" x2="400" y2="320" />
                    <line x1="60" y1="0" x2="60" y2="400" />
                    <line x1="160" y1="0" x2="160" y2="400" />
                    <line x1="240" y1="0" x2="240" y2="400" />
                    <line x1="340" y1="0" x2="340" y2="400" />
                    {/* Diagonal main road */}
                    <line x1="0" y1="400" x2="400" y2="0" strokeWidth="1.2" strokeOpacity="0.7" />
                  </g>
                  {/* Some "buildings" */}
                  <g fill="rgba(255,255,255,0.06)" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.3">
                    <rect x="70" y="90" width="80" height="60" />
                    <rect x="170" y="170" width="60" height="60" />
                    <rect x="250" y="90" width="80" height="60" />
                    <rect x="70" y="250" width="80" height="60" />
                    <rect x="250" y="250" width="80" height="60" />
                  </g>
                  {/* Highlighted block where clinic is */}
                  <rect
                    x="170"
                    y="170"
                    width="60"
                    height="60"
                    fill="rgba(232,0,28,0.12)"
                    stroke="#e8001c"
                    strokeWidth="1"
                  />
                </svg>
                <div className="pin">
                  <div className="dot"></div>
                  <div className="label-pill">Hovedgata 12</div>
                </div>
              </div>

              <div className="contact-info">
                <div className="contact-row">
                  <span className="key">Adresse</span>
                  <span className="val">
                    Hovedgata 12
                    <br />
                    0123 Oslo
                  </span>
                </div>
                <div className="contact-row">
                  <span className="key">Telefon</span>
                  <span className="val">
                    <a href="tel:+4700000000">+47 00 00 00 00</a>
                  </span>
                </div>
                <div className="contact-row">
                  <span className="key">E-post</span>
                  <span className="val">
                    <a href="mailto:post@artrosefysio.no">post@artrosefysio.no</a>
                  </span>
                </div>
                <div className="contact-row">
                  <span className="key">Åpningstider</span>
                  <span className="val">
                    Man–Tor 08:00–18:00
                    <br />
                    Fredag 08:00–16:00
                    <br />
                    Lør–Søn stengt
                  </span>
                </div>
                <div className="contact-row">
                  <span className="key">Transport</span>
                  <span className="val">
                    T-bane: 7 min fra Oslo S
                    <br />
                    Buss 21 og 30 stopper rett utenfor
                    <br />
                    Parkering i Hovedgata P-hus
                  </span>
                </div>
                <div className="contact-row">
                  <span className="key">Tilrettelegging</span>
                  <span className="val">Heistilgang, universell utforming i alle etasjer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="stripe"></div>

      {/* FAQ */}
      <section style={{ background: "var(--surface-soft)" }}>
        <div className="container">
          <div className="faq-grid">
            <div>
              <div className="label" style={{ marginBottom: 24 }}>
                <span className="stripe-inline"></span> Spørsmål
              </div>
              <h2 className="display-lg">Det folk lurer på.</h2>
              <p className="body" style={{ marginTop: 20, maxWidth: 380 }}>
                Ring oss på{" "}
                <a
                  href="tel:+4700000000"
                  style={{ color: "var(--brand-red)", borderBottom: "1px solid currentColor" }}
                >
                  +47 00 00 00 00
                </a>{" "}
                hvis du ikke finner svaret.
              </p>
            </div>
            <div>
              {faq.map((item) => (
                <details className="faq" key={item.q} open={item.open}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
