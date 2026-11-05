import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SpecBand from "@/components/SpecBand";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Hva er artrose? — Symptomer, årsaker og behandling | Artrosefysio",
  description:
    "Lær hva artrose er, hvem som rammes, hvordan diagnosen stilles, og hva som faktisk hjelper. Skrevet av en fysioterapeut spesialisert på artrose.",
};

const myths = [
  {
    myth: "«Trening sliter ut leddet enda mer.»",
    fact: "Riktig dosert trening er den mest effektive behandlingen, og bremser sykdomsutviklingen.",
  },
  {
    myth: "«Artrose er bare alderdom — ingenting hjelper.»",
    fact: "86 % av våre pasienter unngår eller utsetter operasjon med riktig oppfølging.",
  },
  {
    myth: "«Smerten må bort før jeg kan trene.»",
    fact: "Trening er en del av smertelindringen — ikke noe du venter til etter.",
  },
];

export default function HvaErArtrosePage() {
  return (
    <>
      <PageHero
        crumb="Hva er artrose"
        eyebrow="Pasientveiledning"
        title="Hva er artrose?"
        lede="Artrose er den vanligste leddsykdommen i Norge — og samtidig en av de mest misforståtte. Her er det du trenger å vite, forklart av en fysioterapeut spesialisert på artrose."
      />

      <div className="stripe"></div>

      {/* SPEC BAND: KEY FACTS */}
      <SpecBand
        items={[
          {
            value: (
              <>
                1<sup>av 4</sup>
              </>
            ),
            label: "Voksne over 45",
          },
          {
            value: (
              <>
                300 000<sup>+</sup>
              </>
            ),
            label: "Nordmenn med artrose",
          },
          { value: "#1", label: "Vanligste leddsykdom" },
          { value: "A", label: "Anbefalt behandling: trening" },
        ]}
      />

      {/* INTRO ARTICLE */}
      <section>
        <div className="container">
          <div className="article">
            <aside>
              <div className="label">
                <span className="stripe-inline"></span> Definisjon
              </div>
              <h2 className="display-md" style={{ marginTop: 24 }}>
                Slitasje er feil ord.
              </h2>
            </aside>
            <div className="article-body">
              <p>
                Artrose er en leddsykdom hvor brusken som dekker endene av knoklene gradvis brytes ned. Dette
                påvirker hele leddet — bein, leddhinne, leddvæske, sener og muskulatur — ikke bare brusken.
              </p>
              <p>
                I lang tid kalte vi dette «slitasjegikt», som om leddet var et bildekk som slet seg ut.{" "}
                <strong>Det er ikke riktig.</strong> Artrose handler ikke om at leddet er «brukt opp» av aktivitet —
                tvert imot er for lite bevegelse en av de største risikofaktorene.
              </p>
              <p>
                Moderne forståelse beskriver artrose som en aktiv prosess hvor kroppens reparasjonsevne ikke holder
                tritt med belastningen. Det betyr også at vi kan påvirke forløpet — gjennom riktig dosert trening,
                vekt og oppfølging.
              </p>

              <div className="callout">
                <span className="label">Viktig</span>
                <p>
                  Artrose er ikke det samme som artritt (leddgikt). Artritt er en betennelsessykdom; artrose er en
                  leddsykdom som først og fremst angår brusken og det omliggende vevet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="stripe"></div>

      {/* SYMPTOMS */}
      <section>
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="stripe-inline"></span> Symptomer
            </div>
            <h2 className="display-lg">Slik kjennes det.</h2>
            <p className="lede">
              Symptomene kommer ofte gradvis over måneder eller år. Noen lever lenge med artrose før de oppsøker
              hjelp.
            </p>
          </div>

          <div className="models-grid">
            <article className="model-card">
              <div className="model-photo">
                <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round">
                    <circle cx="100" cy="120" r="50" />
                    <circle cx="100" cy="120" r="35" strokeOpacity="0.5" />
                    <circle cx="100" cy="120" r="20" strokeOpacity="0.3" />
                    <circle cx="100" cy="120" r="8" fill="#e8001c" stroke="none" />
                    <line x1="100" y1="40" x2="100" y2="60" strokeOpacity="0.4" />
                    <line x1="100" y1="180" x2="100" y2="200" strokeOpacity="0.4" />
                    <line x1="20" y1="120" x2="40" y2="120" strokeOpacity="0.4" />
                    <line x1="160" y1="120" x2="180" y2="120" strokeOpacity="0.4" />
                  </g>
                </svg>
              </div>
              <div className="model-body">
                <span className="model-tag">01</span>
                <h3 className="model-title">Smerte ved bevegelse</h3>
                <p className="model-desc">
                  Som ofte avtar i hvile, men kan komme tilbake etter belastning eller ved enkelte stillinger.
                </p>
              </div>
            </article>

            <article className="model-card">
              <div className="model-photo">
                <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round">
                    <path d="M 60 80 L 60 170" />
                    <path d="M 140 80 L 140 170" />
                    <path d="M 60 125 A 40 40 0 0 0 140 125" strokeDasharray="4 4" />
                    <circle cx="100" cy="125" r="6" fill="#e8001c" stroke="none" />
                    <line x1="60" y1="80" x2="50" y2="60" strokeOpacity="0.6" />
                    <line x1="140" y1="80" x2="150" y2="60" strokeOpacity="0.6" />
                  </g>
                </svg>
              </div>
              <div className="model-body">
                <span className="model-tag">02</span>
                <h3 className="model-title">Stivhet om morgenen</h3>
                <p className="model-desc">
                  Typisk under 30 minutter — leddet løsner gradvis når du kommer i gang med dagen.
                </p>
              </div>
            </article>

            <article className="model-card">
              <div className="model-photo">
                <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round">
                    <ellipse cx="100" cy="125" rx="50" ry="20" />
                    <path d="M 50 125 Q 70 110 100 110 Q 130 110 150 125" strokeDasharray="3 3" />
                    <path d="M 50 125 Q 70 140 100 140 Q 130 140 150 125" strokeDasharray="3 3" />
                    <circle cx="80" cy="115" r="3" fill="#e8001c" stroke="none" />
                    <circle cx="120" cy="135" r="3" fill="#e8001c" stroke="none" />
                  </g>
                </svg>
              </div>
              <div className="model-body">
                <span className="model-tag">03</span>
                <h3 className="model-title">Knirking eller kuling</h3>
                <p className="model-desc">
                  Lyder eller fornemmelser når leddet beveges. Vanlig — og som regel ikke farlig.
                </p>
              </div>
            </article>

            <article className="model-card">
              <div className="model-photo">
                <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round">
                    <path d="M 60 60 A 60 60 0 0 1 140 60" strokeDasharray="4 4" />
                    <path d="M 60 60 L 60 180" />
                    <path d="M 140 60 A 60 90 0 0 1 100 180" />
                    <circle cx="100" cy="180" r="5" fill="#e8001c" stroke="none" />
                    <line x1="100" y1="180" x2="100" y2="200" strokeOpacity="0.5" />
                  </g>
                </svg>
              </div>
              <div className="model-body">
                <span className="model-tag">04</span>
                <h3 className="model-title">Redusert bevegelighet</h3>
                <p className="model-desc">
                  Du kommer ikke like langt i bevegelsen som før — det blir vanskeligere å bøye eller strekke leddet.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div className="stripe"></div>

      {/* CAUSES & RISK FACTORS */}
      <section className="editorial">
        <div className="container">
          <div className="editorial-grid">
            <div className="editorial-art" aria-hidden="true">
              <div className="badge">
                <span className="stripe-inline"></span>
                <span className="label" style={{ fontSize: 11 }}>
                  Risikofaktorer
                </span>
              </div>
              <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <g stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round">
                  {/* Concentric risk rings */}
                  <circle cx="200" cy="250" r="40" />
                  <circle cx="200" cy="250" r="80" strokeOpacity="0.7" />
                  <circle cx="200" cy="250" r="120" strokeOpacity="0.5" />
                  <circle cx="200" cy="250" r="160" strokeOpacity="0.3" />
                  <circle cx="200" cy="250" r="20" fill="#e8001c" stroke="none" />
                  {/* Risk markers on rings */}
                  <circle cx="200" cy="170" r="5" strokeOpacity="0.9" />
                  <circle cx="280" cy="250" r="5" strokeOpacity="0.9" />
                  <circle cx="200" cy="330" r="5" strokeOpacity="0.9" />
                  <circle cx="120" cy="250" r="5" strokeOpacity="0.9" />
                </g>
                <g fontFamily="monospace" fontSize="9" fill="rgba(255,255,255,0.55)" letterSpacing="1.5">
                  <text x="180" y="155">
                    ALDER
                  </text>
                  <text x="290" y="254">
                    VEKT
                  </text>
                  <text x="155" y="358">
                    SKADE
                  </text>
                  <text x="65" y="254">
                    ARV
                  </text>
                </g>
              </svg>
            </div>

            <div>
              <div className="label" style={{ marginBottom: 24 }}>
                <span className="stripe-inline"></span> Årsaker
              </div>
              <h2 className="display-lg" style={{ marginBottom: 24 }}>
                Hvem rammes?
              </h2>
              <p className="body" style={{ fontSize: 18, maxWidth: 520 }}>
                Artrose har sjelden én enkelt årsak. Det er som regel en kombinasjon av flere faktorer som over tid
                påvirker leddet.
              </p>

              <ol className="editorial-points">
                <li>Alder — risikoen øker gradvis fra 45-årsalderen</li>
                <li>Tidligere leddskade eller operasjon</li>
                <li>Overvekt — særlig for kne og hofte</li>
                <li>Genetikk og familiehistorikk</li>
                <li>Visse yrker med langvarig høy belastning</li>
                <li>Lav muskelstyrke rundt leddet</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <div className="stripe"></div>

      {/* DIAGNOSIS */}
      <section>
        <div className="container">
          <div className="article">
            <aside>
              <div className="label">
                <span className="stripe-inline"></span> Diagnose
              </div>
              <h2 className="display-md" style={{ marginTop: 24 }}>
                Hvordan stilles diagnosen?
              </h2>
            </aside>
            <div className="article-body">
              <p>
                Diagnosen artrose stilles primært klinisk — det vil si gjennom samtale og undersøkelse, ikke
                nødvendigvis ved hjelp av bilder. Symptomene dine, hvordan leddet beveger seg og hva du klarer i
                hverdagen, er ofte tilstrekkelig.
              </p>
              <p>
                Røntgen kan vise endringer i leddet, men{" "}
                <strong>røntgenfunn samsvarer ofte dårlig med smerter.</strong> Mange med tydelige funn på røntgen
                har lite plager, og motsatt. Derfor er den kliniske vurderingen viktigst.
              </p>
              <p>
                MR-undersøkelse brukes sjeldent i diagnostikk av artrose, men kan være aktuelt hvis det er mistanke
                om annen tilstand i tillegg.
              </p>

              <h3>Forskjellen på artrose og artritt</h3>
              <ul>
                <li>
                  <strong>Artrose</strong> — gradvis nedbrytning av brusk og leddvev. Smerter forverres ved
                  belastning, lindres i hvile.
                </li>
                <li>
                  <strong>Artritt (leddgikt)</strong> — betennelsessykdom i leddet. Smerter og stivhet er ofte verst
                  i ro og om morgenen, og kan vare i timer.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MYTHS */}
      <section className="editorial">
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="stripe-inline"></span> Myter vs. fakta
            </div>
            <h2 className="display-lg">Det folk tror — og det som faktisk stemmer.</h2>
          </div>

          <div className="magazine-grid">
            {myths.map((item) => (
              <article className="mag-card" key={item.myth}>
                <span className="label" style={{ color: "var(--brand-red)" }}>
                  Myte
                </span>
                <blockquote style={{ fontSize: 17 }}>{item.myth}</blockquote>
                <div className="who">
                  <span className="name" style={{ color: "var(--brand-red)" }}>
                    Fakta
                  </span>
                  <span className="ref" style={{ color: "var(--body-strong)", fontSize: 14, fontWeight: 300 }}>
                    {item.fact}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        label="Neste steg"
        title="Tror du at du har artrose?"
        lede="Få en grundig vurdering av en spesialist — og en tydelig plan videre."
        secondary={
          <Link href="/slik-virker-det" className="btn">
            Se behandlingen
          </Link>
        }
      />
    </>
  );
}
