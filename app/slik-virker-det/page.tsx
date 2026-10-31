import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import PageHero from "@/components/PageHero";
import SpecBand from "@/components/SpecBand";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Slik virker det — Behandlingsforløp ved Artrosefysio",
  description:
    "Slik foregår behandlingen hos Artrosefysio: undersøkelse, individuell plan, treningsbasert behandling og oppfølging — fra første time til resultat.",
};

const stepNumberStyle: CSSProperties = {
  fontSize: 96,
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: -2,
};

export default function SlikVirkerDetPage() {
  return (
    <>
      <PageHero
        crumb="Slik virker det"
        eyebrow="Behandlingsforløpet"
        title="Slik virker det."
        lede="Et tydelig forløp i tre faser, basert på det som faktisk virker mot artrose — og levert med presisjon fra første time til siste oppfølging."
      />

      <div className="stripe"></div>

      {/* SPEC: TIDSLINJE */}
      <SpecBand
        columns={3}
        compact
        items={[
          {
            value: (
              <>
                6–12<sup>uker</sup>
              </>
            ),
            label: "Typisk forløp",
          },
          {
            value: (
              <>
                1–3<sup>/uke</sup>
              </>
            ),
            label: "Anbefalt frekvens",
          },
          { value: "Evidensbasert metode" },
        ]}
      />

      {/* THE 3 STEPS DEEP */}
      <section>
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="stripe-inline"></span> Programmet
            </div>
            <h2 className="display-lg">Tre faser. Ett mål.</h2>
            <p className="lede">Mindre smerter og bedre funksjon i hverdagen din. Slik kommer du dit:</p>
          </div>
        </div>

        {/* STEG 01 */}
        <div className="container">
          <div className="article" style={{ marginBottom: 80 }}>
            <aside>
              <div style={stepNumberStyle}>
                01<span className="text-accent">.</span>
              </div>
              <h2 className="display-md" style={{ marginTop: 24 }}>
                Grundig Informasjon.
              </h2>
            </aside>
            <div className="article-body">
              <h3 style={{ marginTop: 0 }}>Informasjon om din diagnose og hva som påvirker plagene.</h3>
              <p>
                Du vil få en bedre forståelse om hvordan du skal forholde deg til dine plager og hva du kan
                forvente.
              </p>
            </div>
          </div>
        </div>

        <div className="stripe"></div>

        {/* STEG 02 */}
        <div className="container" style={{ paddingTop: 96 }}>
          <div className="article" style={{ marginBottom: 80 }}>
            <aside>
              <div style={stepNumberStyle}>
                02<span className="text-accent">.</span>
              </div>
              <div className="label" style={{ marginTop: 16 }}>
                Behandling
              </div>
              <h2 className="display-md" style={{ marginTop: 24 }}>
                Øvelser på ditt nivå - der du er i dag
              </h2>
            </aside>
            <div className="article-body">
              <p>
                Behandlingsforløpet bygger på tre hovedkomponenter, satt sammen etter hva som passer din diagnose,
                din kropp og din hverdag.
              </p>
              <h3>Treningsbasert behandling (kjernen)</h3>
              <ul>
                <li>Spesifikke styrke- og bevegelighetsøvelser for det affiserte leddet</li>
                <li>Gradvis progresjon — vi starter der du er i dag</li>
                <li>Hjelp til å komme i gang når smertene er for høye til å trene</li>
              </ul>
              <h3>Veiledning og kunnskap</h3>
              <ul>
                <li>Forklaring på hva som skjer i leddet — og hva trening gjør</li>
                <li>Råd om aktivitet, søvn, vekt og smertehåndtering</li>
                <li>Praktiske tilpasninger i jobb og hverdag</li>
              </ul>
              <div className="callout">
                <span className="label">Forskningsbasert</span>
                <p>
                  Vi følger AktivA-programmet — det norske, evidensbaserte rammeverket for artrosebehandling,
                  anbefalt av Helsedirektoratet.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="stripe"></div>

        {/* STEG 03 */}
        <div className="container" style={{ paddingTop: 96 }}>
          <div className="article">
            <aside>
              <div style={stepNumberStyle}>
                03<span className="text-accent">.</span>
              </div>
              <div className="label" style={{ marginTop: 16 }}>
                Oppfølging
              </div>
            </aside>
            <div className="article-body">
              <h3 style={{ marginTop: 0 }}>Hva du får underveis</h3>
              <ul>
                <li>Justering av program ettersom du blir sterkere</li>
                <li>Hjemmeprogram som vokser med deg</li>
                <li>Tilgang til veiledning også mellom timene</li>
                <li>Mulighet for online konsultasjon eller besøk i klinikken</li>
              </ul>
              <h3>Etter forløpet</h3>
              <ul>
                <li>Et selvstendig program du kan vedlikeholde alene</li>
                <li>Anbefaling om eventuelle vedlikeholdstimer</li>
                <li>Åpen dør hvis ting endrer seg igjen</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="stripe"></div>

      {/* TIMELINE EDITORIAL */}
      <section className="editorial">
        <div className="container">
          <div className="editorial-grid">
            <div>
              <div className="label" style={{ marginBottom: 24 }}>
                <span className="stripe-inline"></span> Tidslinje
              </div>
              <h2 className="display-lg" style={{ marginBottom: 24 }}>
                Hva kan du forvente — og når?
              </h2>
              <p className="body" style={{ fontSize: 18, maxWidth: 520 }}>
                Hver kropp er forskjellig, men forskningen og våre egne data gir et klart bilde av når du kan
                forvente endringer.
              </p>

              <ol className="editorial-points">
                <li>Uke 1–2 — Du forstår tilstanden og er i gang med programmet</li>
                <li>Uke 3–4 — Første målbare endringer i styrke og bevegelighet</li>
                <li>Uke 6–8 — Tydelig reduksjon i smerter for de fleste</li>
                <li>Uke 8–12 — Funksjonell forbedring i hverdagsaktiviteter</li>
                <li>3 mnd+ — Varig effekt med vedlikeholdstrening</li>
              </ol>
            </div>

            <div className="editorial-art" aria-hidden="true">
              <div className="badge">
                <span className="stripe-inline"></span>
                <span className="label" style={{ fontSize: 11 }}>
                  Progresjon
                </span>
              </div>
              <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <g stroke="currentColor" strokeWidth="0.8" fill="none" strokeOpacity="0.3">
                  <line x1="50" y1="100" x2="350" y2="100" />
                  <line x1="50" y1="200" x2="350" y2="200" />
                  <line x1="50" y1="300" x2="350" y2="300" />
                  <line x1="50" y1="400" x2="350" y2="400" />
                  <line x1="50" y1="50" x2="50" y2="450" />
                </g>
                {/* Pain curve descending */}
                <path d="M 50 130 Q 120 150 180 230 T 350 380" stroke="#e8001c" strokeWidth="2" fill="none" />
                {/* Function curve ascending */}
                <path
                  d="M 50 380 Q 120 360 180 280 T 350 130"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeOpacity="0.85"
                />
                {/* Markers */}
                <circle cx="50" cy="130" r="5" fill="#e8001c" stroke="none" />
                <circle cx="350" cy="380" r="5" fill="#e8001c" stroke="none" />
                <circle cx="50" cy="380" r="5" fill="currentColor" stroke="none" />
                <circle cx="350" cy="130" r="5" fill="currentColor" stroke="none" />
                <g fontFamily="monospace" fontSize="9" fill="rgba(255,255,255,0.55)" letterSpacing="1.5">
                  <text x="50" y="470">
                    UKE 1
                  </text>
                  <text x="200" y="470">
                    UKE 6
                  </text>
                  <text x="320" y="470">
                    UKE 12
                  </text>
                  <text x="270" y="125" fill="rgba(255,255,255,0.7)">
                    FUNKSJON ↑
                  </text>
                  <text x="240" y="395" fill="#e8001c">
                    SMERTE ↓
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <div className="stripe"></div>

      {/* WHAT WE EXPECT FROM YOU */}
      <section>
        <div className="container">
          <div className="article">
            <aside>
              <div className="label">
                <span className="stripe-inline"></span> Forventninger
              </div>
              <h2 className="display-md" style={{ marginTop: 24 }}>
                Hva forventer vi av deg?
              </h2>
            </aside>
            <div className="article-body">
              <p>For at programmet skal virke, må du være med. Det er ikke vanskelig — men det krever litt fra deg:</p>
              <ul>
                <li>Gjør hjemmeøvelsene 3–5 dager i uka, 15–20 minutter per økt</li>
                <li>Ha tålmodighet — varige endringer tar uker, ikke dager</li>
              </ul>
              <p>
                Til gjengjeld lover vi: en tydelig plan, profesjonell oppfølging, og en behandling som er forankret i
                den beste forskningen vi har.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        label="Kom i gang"
        title="Klar til å starte?"
        lede="Bestill første konsultasjon — vi tar deg gjennom programmet steg for steg."
        secondary={
          <Link href="/priser" className="btn">
            Se priser
          </Link>
        }
      />
    </>
  );
}
