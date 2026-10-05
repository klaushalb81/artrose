import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SpecBand from "@/components/SpecBand";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Priser — Egenandeler og behandlingstyper | Artrosefysio",
  description:
    "Oversikt over egenandeler, takster og behandlingstyper hos Artrosefysio. HELFO-avtale og direkteoppgjør. Frikort godtas.",
};

const prices = [
  {
    name: "Førstegangsundersøkelse",
    desc: "Grundig kartlegging, undersøkelse og oppstart av plan",
    duration: "60 min",
    price: "230 kr",
    note: "Egenandel",
  },
  {
    name: "Oppfølgingstime",
    desc: "Behandling, veiledet trening og justering av program",
    duration: "30 min",
    price: "160 kr",
    note: "Egenandel",
  },
  {
    name: "Lengre oppfølging",
    desc: "Kombinasjon av manuell behandling og trening",
    duration: "45 min",
    price: "200 kr",
    note: "Egenandel",
  },
  {
    name: "AktivA-treningsgruppe",
    desc: "Veiledet trening i smågruppe — 12 økter over 6 uker",
    duration: "60 min × 12",
    price: "1 920 kr",
    note: "Hele forløpet",
  },
  {
    name: "Re-vurdering",
    desc: "Måling av progresjon og oppdatert plan",
    duration: "30 min",
    price: "160 kr",
    note: "Egenandel",
  },
  {
    name: "Hjemmebesøk",
    desc: "Behandling i hjemmet ved sterkt nedsatt funksjon",
    duration: "45 min",
    price: "350 kr",
    note: "Egenandel + reise",
  },
];

export default function PriserPage() {
  return (
    <>
      <PageHero
        crumb="Priser"
        eyebrow="Priser og takster"
        title="Priser."
        lede="Vi har avtale med HELFO og følger gjeldende egenandeler. Frikort godtas. Ingen skjulte tillegg."
      />

      <div className="stripe"></div>

      {/* KEY FACTS */}
      <SpecBand
        items={[
          { value: "JA", label: "HELFO-avtale" },
          { value: "JA", label: "Frikort godtas" },
          {
            value: (
              <>
                3 110<sup>kr</sup>
              </>
            ),
            label: "Frikorttak (2026)",
          },
          {
            value: (
              <>
                0<sup>kr</sup>
              </>
            ),
            label: "Bestillingsgebyr",
          },
        ]}
      />

      {/* PRICE TABLE */}
      <section>
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="stripe-inline"></span> Egenandeler
            </div>
            <h2 className="display-lg">Behandlingstyper.</h2>
            <p className="lede">
              Alle priser er egenandeler etter takstene fra HELFO. Det fulle honoraret dekkes av oss og staten.
            </p>
          </div>

          <div className="price-table">
            <div className="price-row head">
              <div>Behandling</div>
              <div>Varighet</div>
              <div style={{ textAlign: "right" }}>Egenandel</div>
            </div>
            {prices.map((row) => (
              <div className="price-row" key={row.name}>
                <div className="name">
                  {row.name}
                  <span className="desc">{row.desc}</span>
                </div>
                <div className="duration">{row.duration}</div>
                <div className="price">
                  {row.price}
                  <small>{row.note}</small>
                </div>
              </div>
            ))}
          </div>

          <p className="caption" style={{ marginTop: 24 }}>
            Priser er veiledende egenandeler etter HELFO-takster gjeldende fra januar 2026. Endelig pris bekreftes
            ved bestilling. Endringer i nasjonale takster kan forekomme.
          </p>
        </div>
      </section>

      <div className="stripe"></div>

      {/* HELFO + FRIKORT EDITORIAL */}
      <section className="editorial">
        <div className="container">
          <div className="editorial-grid">
            <div>
              <div className="label" style={{ marginBottom: 24 }}>
                <span className="stripe-inline"></span> HELFO og frikort
              </div>
              <h2 className="display-lg" style={{ marginBottom: 24 }}>
                Slik fungerer det.
              </h2>
              <p className="body" style={{ fontSize: 18, maxWidth: 520 }}>
                Vi har avtale med HELFO og gjør oppgjøret direkte — du betaler kun egenandelen. Når du har nådd
                frikort­grensen, er resten av året gratis.
              </p>

              <ol className="editorial-points">
                <li>Du betaler egenandel etter HELFOs takster — som vist over</li>
                <li>Vi rapporterer egenandelen automatisk til HELFO</li>
                <li>Frikort 2 utstedes automatisk når du har betalt 3 110 kr (2026)</li>
                <li>Etter frikort: alle våre behandlinger er gratis ut kalenderåret</li>
                <li>Barn under 16 år: behandling er fritatt egenandel</li>
              </ol>

              <Link href="/kontakt" className="text-link">
                Spør oss om frikort
              </Link>
            </div>

            <div className="editorial-art" aria-hidden="true">
              <div className="badge">
                <span className="stripe-inline"></span>
                <span className="label" style={{ fontSize: 11 }}>
                  Kostnad over tid
                </span>
              </div>
              <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <g stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" fill="none">
                  <line x1="50" y1="100" x2="350" y2="100" />
                  <line x1="50" y1="200" x2="350" y2="200" />
                  <line x1="50" y1="300" x2="350" y2="300" />
                  <line x1="50" y1="400" x2="350" y2="400" />
                  <line x1="50" y1="50" x2="50" y2="450" />
                </g>
                {/* Cumulative cost stepping up to frikort cap, then flat */}
                <path
                  d="M 50 400 L 100 380 L 100 360 L 150 340 L 150 320 L 200 300 L 200 280 L 250 260 L 250 240 L 300 220 L 300 200 L 350 200"
                  stroke="#e8001c"
                  strokeWidth="2"
                  fill="none"
                />
                <line
                  x1="50"
                  y1="200"
                  x2="350"
                  y2="200"
                  stroke="#e8001c"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                  strokeOpacity="0.5"
                />
                <circle cx="300" cy="200" r="6" fill="#e8001c" stroke="none" />
                <g fontFamily="monospace" fontSize="9" fill="rgba(255,255,255,0.55)" letterSpacing="1.5">
                  <text x="50" y="470">
                    JAN
                  </text>
                  <text x="180" y="470">
                    JUN
                  </text>
                  <text x="320" y="470">
                    DES
                  </text>
                  <text x="305" y="190" fill="#e8001c">
                    FRIKORT NÅDD
                  </text>
                  <text x="170" y="220" fill="rgba(255,255,255,0.7)">
                    3 110 KR
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <div className="stripe"></div>

      {/* AVBESTILLING / BETALING */}
      <section>
        <div className="container">
          <div className="article">
            <aside>
              <div className="label">
                <span className="stripe-inline"></span> Praktisk
              </div>
              <h2 className="display-md" style={{ marginTop: 24 }}>
                Avbestilling og betaling.
              </h2>
            </aside>
            <div className="article-body">
              <h3>Betalingsmåter</h3>
              <ul>
                <li>Vipps</li>
                <li>Kortbetaling i klinikken (alle vanlige kort)</li>
                <li>Faktura på e-post (uten gebyr)</li>
              </ul>

              <h3>Avbestilling</h3>
              <ul>
                <li>Avbestilling senest 24 timer før timen — uten kostnad</li>
                <li>Senere avbestilling eller uteblivelse: full takst belastes</li>
                <li>Akutt sykdom: gi oss beskjed, så finner vi en løsning</li>
              </ul>

              <h3>Henvisning</h3>
              <ul>
                <li>Du trenger ikke henvisning fra lege for å starte hos oss</li>
                <li>Har du henvisning, ta den gjerne med — vi rapporterer til fastlegen din</li>
              </ul>

              <div className="callout">
                <span className="label">Spørsmål om priser?</span>
                <p>
                  Ring oss på +47 00 00 00 00 eller send en e-post. Vi svarer på alle praktiske spørsmål før du
                  bestiller.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        label="Bestill"
        title="Klar til å starte?"
        lede="Bestill første konsultasjon i dag — vi finner en time som passer."
        secondary={
          <a href="tel:+4700000000" className="btn">
            +47 00 00 00 00
          </a>
        }
      />
    </>
  );
}
