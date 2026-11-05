import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SpecBand from "@/components/SpecBand";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Om Artrosefysio — Fysioterapeut Klaus Halbakken",
  description:
    "Artrosefysio er en spesialisert fysioterapiklinikk dedikert til behandling av artrose. Møt fysioterapeuten, lær om klinikken og verdiene våre.",
};

const team = [
  {
    tag: "Fysioterapeut",
    name: "Klaus Halbakken",
    desc: "Fysioterapeut som har spesialisert seg på artrose gjennom utdannelse.",
    dot: { cx: 135, cy: 80 },
  },
];

export default function OmPage() {
  return (
    <>
      <PageHero
        crumb="Om Artrosefysio"
        eyebrow="Klinikken"
        title="Om Artrosefysio."
        lede="Artrosefysio er en klinikk med ett tydelig oppdrag: å levere Norges mest spesialiserte fysioterapi for deg med artrose."
      />

      <div className="stripe"></div>

      <SpecBand
        columns={3}
        items={[
          { value: "2026", label: "Etablert" },
          { value: "Øvelser", label: "du kan gjøre på egenhånd når det passer deg." },
          { value: "Online", label: "Mulighet for onlinekonsultasjon eller på klinikk" },
        ]}
      />

      {/* ===================== STORY / EDITORIAL ===================== */}
      <section>
        <div className="container">
          <div className="article">
            <aside>
              <div className="label">
                <span className="stripe-inline"></span> Vår historie
              </div>
              <h2 className="display-md" style={{ marginTop: 24 }}>
                En klinikk bygget rundt artrose.
              </h2>
            </aside>
            <div className="article-body">
              <p>
                Artrosefysio ble grunnlagt i 2026 inspirert av tilgangen til trening av artrosepasienter i Danmark.
              </p>
              <p>
                Vi vet at forskningen forteller oss at trening gjør gode ting for kne og hofteartrose. Riktig dosert
                trening, kombinert med kunnskap og oppfølging, har den best dokumenterte effekten på artrosesmerter
                — og kan i mange tilfeller utsette eller forhindre kirurgi helt.
              </p>
              <p>
                Artrosefysio er ikke et sted hvor{" "}
                <strong>artrose er ett av mange tilbud — det er hele spesialiteten.</strong> Sertifisert i
                AktivA-programmet og det danske alternativet, GLAD, gjør at du er i trygge hender med dine
                leddplager.
              </p>

              <div className="callout">
                <span className="label">Vårt løfte</span>
                <p>
                  Du skal vite hva som feiler deg, hva som hjelper, og hvor lang tid det vil ta. Ingen vage svar,
                  ingen passive konsultasjoner.
                </p>
              </div>

              <h3>Verdiene som styrer oss</h3>
              <ul>
                <li>
                  <strong>Faglig presisjon.</strong> All behandling er forankret i nasjonale retningslinjer og
                  oppdatert forskning.
                </li>
                <li>
                  <strong>Tydelig kommunikasjon.</strong> Du får en plan du forstår, med enkle øvelser til ditt nivå.
                </li>
                <li>
                  <strong>Aktiv pasient.</strong> Trening — ikke passive teknikker — er kjernen i forløpet ditt.
                </li>
                <li>
                  <strong>Vedvarende effekt.</strong> Vi gir deg verktøy som varer lenger enn behandlingen.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="stripe"></div>

      {/* ===================== TEAM ===================== */}
      <section id="team">
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="stripe-inline"></span> Om Artrosefysio
            </div>
            <h2 className="display-lg">Møt fysioterapeuten.</h2>
            <p className="lede">
              Hos Artrosefysio møter du Klaus Halbakken — fra første time til siste oppfølging.
            </p>
          </div>

          <div className="models-grid models-grid-2">
            {team.map((member) => (
              <article className="model-card" key={member.name}>
                <div className="model-photo">
                  <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round">
                      <circle cx="100" cy="90" r="32" />
                      <path d="M 60 200 Q 100 150 140 200 L 140 250 L 60 250 Z" />
                      <line x1="100" y1="40" x2="100" y2="250" strokeOpacity="0.15" />
                      <line x1="40" y1="125" x2="160" y2="125" strokeOpacity="0.15" />
                      <circle cx={member.dot.cx} cy={member.dot.cy} r="4" fill="#e8001c" stroke="none" />
                    </g>
                  </svg>
                </div>
                <div className="model-body">
                  <span className="model-tag">{member.tag}</span>
                  <h3 className="model-title">{member.name}</h3>
                  <p className="model-desc">{member.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== EDITORIAL: KLINIKKEN ===================== */}
      <section className="editorial">
        <div className="container">
          <div className="editorial-grid">
            <div>
              <div className="label" style={{ marginBottom: 24 }}>
                <span className="stripe-inline"></span> Klinikken
              </div>
              <h2 className="display-lg" style={{ marginBottom: 24 }}>
                Bygget for trening, ikke kun behandling.
              </h2>
              <p className="body" style={{ fontSize: 18, maxWidth: 520 }}>
                Klinikken vår på 320 m² er innredet med plass for både undersøkelse, manuell behandling og veiledet
                trening. Du møter samme terapeut gjennom hele forløpet — fra første time til siste oppfølging.
              </p>

              <ol className="editorial-points">
                <li>Egne behandlingsrom med ro og diskresjon</li>
                <li>Treningssal med utstyr tilpasset alle nivå</li>
                <li>Kort vei fra Oslo S — under 10 min med t-bane</li>
                <li>Universell utforming og heistilgang i alle etasjer</li>
              </ol>
            </div>

            <div className="editorial-art" aria-hidden="true">
              <div className="badge">
                <span className="stripe-inline"></span>
                <span className="label" style={{ fontSize: 11 }}>
                  Lokaler
                </span>
              </div>
              <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <g stroke="currentColor" strokeWidth="1.2" fill="none">
                  {/* Floor plan */}
                  <rect x="40" y="40" width="320" height="420" />
                  <line x1="40" y1="200" x2="220" y2="200" />
                  <line x1="220" y1="40" x2="220" y2="320" />
                  <line x1="220" y1="320" x2="360" y2="320" />
                  <line x1="120" y1="200" x2="120" y2="460" />
                  {/* Room labels */}
                  <circle cx="280" cy="180" r="6" fill="#e8001c" stroke="none" />
                </g>
                <g fontFamily="monospace" fontSize="10" fill="rgba(255,255,255,0.5)" letterSpacing="1.5">
                  <text x="60" y="120">
                    BEHANDLINGSROM 1
                  </text>
                  <text x="60" y="260">
                    BEHANDLINGSROM 2
                  </text>
                  <text x="240" y="180">
                    TRENINGSSAL
                  </text>
                  <text x="240" y="380">
                    RESEPSJON
                  </text>
                  <text x="140" y="380">
                    VENTEROM
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <div className="stripe"></div>

      {/* ===================== CERTS ===================== */}
      <section>
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="stripe-inline"></span> Sertifiseringer
            </div>
            <h2 className="display-lg">Faglig forankring.</h2>
            <p className="lede">
              Vi følger nasjonale og internasjonale standarder, og holder kompetansen oppdatert kontinuerlig.
            </p>
          </div>

          <div className="magazine-grid">
            <article className="mag-card">
              <span className="label">01 / Helsedirektoratet</span>
              <blockquote style={{ fontSize: 17 }}>
                All behandling følger Helsedirektoratets nasjonale retningslinjer for artrose.
              </blockquote>
            </article>
            <article className="mag-card">
              <span className="label">02 / AktivA-programmet</span>
              <blockquote style={{ fontSize: 17 }}>
                Sertifisert i AktivA — det norske programmet for artrosebehandling.
              </blockquote>
            </article>
            <article className="mag-card">
              <span className="label">03 / NFF</span>
              <blockquote style={{ fontSize: 17 }}>
                Medlemskap i Norsk Fysioterapeutforbund og forpliktelse til etiske retningslinjer.
              </blockquote>
            </article>
          </div>
        </div>
      </section>

      <CtaBand
        label="Klar?"
        title="Møt fysioterapeuten personlig."
        lede="Bestill en uforpliktende vurderingstime og bli kjent med fysioterapeuten din."
        secondary={
          <Link href="/hva-er-artrose" className="btn">
            Lær mer om artrose
          </Link>
        }
      />
    </>
  );
}
