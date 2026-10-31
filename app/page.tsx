import Link from "next/link";
import SpecBand from "@/components/SpecBand";
import CtaBand from "@/components/CtaBand";

export default function Home() {
  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-art" aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lg1" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g stroke="url(#lg1)" strokeWidth="1" fill="none">
              <path d="M 900 100 Q 1100 300 950 500 T 1200 800" />
              <path d="M 850 50  Q 1050 280 900 480 T 1150 780" />
              <path d="M 800 0   Q 1000 260 850 460 T 1100 760" />
            </g>
            <g stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.45" fill="none">
              <path d="M 1080 150 C 1100 240, 1080 330, 1110 420 C 1140 500, 1120 580, 1150 660 C 1170 720, 1160 780, 1180 860" />
              <path d="M 1140 150 C 1160 240, 1140 330, 1170 420 C 1200 500, 1180 580, 1210 660 C 1230 720, 1220 780, 1240 860" />
              <circle cx="1140" cy="450" r="22" strokeOpacity="0.9" />
              <circle cx="1140" cy="450" r="36" strokeOpacity="0.4" />
              <circle cx="1140" cy="450" r="56" strokeOpacity="0.2" />
            </g>
            <g stroke="#ffffff" strokeOpacity="0.4" strokeWidth="0.8">
              <line x1="1140" y1="450" x2="1280" y2="450" />
              <line x1="1280" y1="450" x2="1290" y2="450" />
            </g>
            <text x="1290" y="446" fill="#ffffff" fillOpacity="0.5" fontFamily="monospace" fontSize="11" letterSpacing="2">
              ART. GENU
            </text>
            <text x="1290" y="462" fill="#e8001c" fillOpacity="0.9" fontFamily="monospace" fontSize="10" letterSpacing="1.5">
              FOKUSPUNKT
            </text>
            <g stroke="#ffffff" strokeOpacity="0.06" strokeWidth="0.5">
              <line x1="0" y1="225" x2="1440" y2="225" />
              <line x1="0" y1="450" x2="1440" y2="450" />
              <line x1="0" y1="675" x2="1440" y2="675" />
              <line x1="360" y1="0" x2="360" y2="900" />
              <line x1="720" y1="0" x2="720" y2="900" />
              <line x1="1080" y1="0" x2="1080" y2="900" />
            </g>
          </svg>
        </div>

        <div className="hero-vignette"></div>

        <div className="container hero-content">
          <div className="hero-eyebrow">
            <span className="stripe-inline"></span>
            <span className="label label-muted">Spesialisert fysioterapi</span>
          </div>
          <h1 className="display-xl hero-title">
            Mindre smerter.
            <br />
            <span className="accent">Mer bevegelse.</span>
          </h1>
          <p className="hero-sub">
            Et målrettet treningsbasert behandlingsforløp for deg med artrose i kne eller hofte — utviklet etter
            nasjonale retningslinjer og levert med presisjon.
          </p>
          <div className="hero-cta">
            <Link href="/kontakt" className="btn btn-filled">
              Bestill time <span className="arrow">→</span>
            </Link>
          </div>
        </div>

        <div className="hero-meta">
          <span className="caption">Klinikk Tønsberg</span>
          <span className="ratio">Etabl. 2026</span>
        </div>
      </section>

      <div className="stripe"></div>

      {/* ===================== SPEC BAND ===================== */}
      <SpecBand
        items={[
          {
            value: (
              <>
                12<sup>+ år</sup>
              </>
            ),
            label: "Klinisk erfaring",
          },
          { value: "1 400", label: "Pasienter behandlet" },
          {
            value: (
              <>
                4,9<sup>/ 5</sup>
              </>
            ),
            label: "Snittvurdering",
          },
          {
            value: (
              <>
                86<sup>%</sup>
              </>
            ),
            label: "Får bedring av plagene",
          },
        ]}
      />

      {/* ===================== TREATMENTS ===================== */}
      <section id="behandlinger">
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="stripe-inline"></span> Behandlinger
            </div>
            <h2 className="display-lg">
              Spesialisert
              <br />
              oppfølging
              <br />
              for kne og hofte.
            </h2>
            <p className="lede">
              Hele klinikkens fokus er artrose. Velg den kroppsdelen som plager deg — vi har et målrettet program
              for hver.
            </p>
          </div>

          <div className="models-grid models-grid-2">
            <article className="model-card">
              <div className="model-photo">
                <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round">
                    <path d="M 80 30 C 85 60, 80 90, 90 120" />
                    <path d="M 120 30 C 115 60, 120 90, 110 120" />
                    <ellipse cx="100" cy="135" rx="28" ry="14" />
                    <ellipse cx="100" cy="135" rx="20" ry="9" strokeOpacity="0.5" />
                    <path d="M 88 150 C 92 180, 88 210, 95 240" />
                    <path d="M 112 150 C 108 180, 112 210, 105 240" />
                    <circle cx="100" cy="130" r="6" fill="#e8001c" stroke="none" />
                    <line x1="100" y1="100" x2="100" y2="170" strokeOpacity="0.3" />
                    <line x1="60" y1="135" x2="140" y2="135" strokeOpacity="0.3" />
                  </g>
                </svg>
              </div>
              <div className="model-body">
                <span className="model-tag">01 / Kne</span>
                <h3 className="model-title">Kneartrose</h3>
                <p className="model-desc">
                  Strukturert treningsprogram, smertelindring og funksjonsforbedring — før og etter eventuell protese.
                </p>
                <Link href="/slik-virker-det" className="text-link">
                  Se programmet
                </Link>
              </div>
            </article>

            <article className="model-card">
              <div className="model-photo">
                <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round">
                    <path d="M 30 80 Q 100 50 170 80 Q 160 130 100 130 Q 40 130 30 80 Z" />
                    <circle cx="55" cy="105" r="14" />
                    <circle cx="145" cy="105" r="14" />
                    <circle cx="145" cy="105" r="6" fill="#e8001c" stroke="none" />
                    <path d="M 50 120 C 45 160, 55 200, 50 240" />
                    <path d="M 150 120 C 155 160, 145 200, 150 240" />
                    <line x1="145" y1="60" x2="145" y2="150" strokeOpacity="0.3" />
                    <line x1="100" y1="105" x2="190" y2="105" strokeOpacity="0.3" />
                  </g>
                </svg>
              </div>
              <div className="model-body">
                <span className="model-tag">02 / Hofte</span>
                <h3 className="model-title">Hofteartrose</h3>
                <p className="model-desc">
                  Reduser smerter ved gange og bedre bevegelighet med målrettet styrke- og bevegelsestrening.
                </p>
                <Link href="/slik-virker-det" className="text-link">
                  Se programmet
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div className="stripe"></div>

      {/* ===================== APPROACH ===================== */}
      <section id="tilnaerming">
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="stripe-inline"></span> Slik jobber vi
            </div>
            <h2 className="display-lg">
              En tydelig plan.
              <br />
              Fra første time.
            </h2>
            <p className="lede">
              Du trenger ikke gjette deg fram. Vi setter opp en behandlingsløype basert på undersøkelse, mål og
              hverdagen din.
            </p>
          </div>
        </div>
        <div className="container">
          <div className="steps-grid">
            <div className="step">
              <div className="num">
                01<span className="accent">.</span>
              </div>
              <h3>Informasjon</h3>
              <p>Grundig informasjon om din lidelse.</p>
            </div>
            <div className="step">
              <div className="num">
                02<span className="accent">.</span>
              </div>
              <h3>Øvelser</h3>
              <p>Gode øvelser tilpasset ditt nivå.</p>
            </div>
            <div className="step">
              <div className="num">
                03<span className="accent">.</span>
              </div>
              <p>Tren når det passer deg, og ha oppfølging ved behov.</p>
            </div>
          </div>
          <div style={{ marginTop: 48 }}>
            <Link href="/slik-virker-det" className="text-link">
              Les mer om programmet
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== EDITORIAL / OM OSS ===================== */}
      <section id="om" className="editorial">
        <div className="container">
          <div className="editorial-grid">
            <div className="editorial-art" aria-hidden="true">
              <div className="badge">
                <span className="stripe-inline"></span>
                <span className="label" style={{ fontSize: 11 }}>
                  Klinikken
                </span>
              </div>
              <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <g stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round">
                  <circle cx="200" cy="120" r="28" />
                  <path d="M 200 150 L 200 280" />
                  <path d="M 200 180 L 130 230" />
                  <path d="M 200 180 L 270 220" />
                  <path d="M 200 280 L 150 400" />
                  <path d="M 200 280 L 250 400" />
                  <path d="M 130 230 A 100 100 0 0 0 80 320" strokeDasharray="3 5" />
                  <path d="M 270 220 A 100 100 0 0 1 320 320" strokeDasharray="3 5" />
                  <circle cx="200" cy="280" r="10" fill="#e8001c" stroke="none" />
                  <g strokeOpacity="0.1" strokeWidth="0.5">
                    <line x1="0" y1="125" x2="400" y2="125" />
                    <line x1="0" y1="250" x2="400" y2="250" />
                    <line x1="0" y1="375" x2="400" y2="375" />
                    <line x1="100" y1="0" x2="100" y2="500" />
                    <line x1="200" y1="0" x2="200" y2="500" />
                    <line x1="300" y1="0" x2="300" y2="500" />
                  </g>
                </g>
              </svg>
            </div>

            <div>
              <div className="label" style={{ marginBottom: 24 }}>
                <span className="stripe-inline"></span> Om Artrosefysio
              </div>
              <h2 className="display-lg" style={{ marginBottom: 24 }}>
                Artrose-spesialister.
                <br />
                Ikke generell fysio.
              </h2>
              <p className="body" style={{ fontSize: 18, maxWidth: 520 }}>
                Vi er et team av fysioterapeuter som har spesialisert oss på artrose gjennom tusenvis av
                konsultasjoner. Det betyr trygghet for deg — og behandling som faktisk virker.
              </p>

              <ol className="editorial-points">
                <li>Sertifiserte AktivA-instruktører</li>
                <li>Manuellterapi og treningsbehandling under ett tak</li>
                <li>Korte ventetider og direkteoppgjør med HELFO</li>
              </ol>

              <Link href="/om" className="text-link">
                Møt Artrosefysio
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="stripe"></div>

      {/* ===================== TESTIMONIALS ===================== */}
      <section>
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="stripe-inline"></span> Pasienter
            </div>
            <h2 className="display-lg">
              Resultater.
              <br />
              Ikke løfter.
            </h2>
          </div>

          <div className="magazine-grid">
            <article className="mag-card">
              <div className="stars">★★★★★</div>
              <blockquote>
                &quot;Etter åtte uker hos Artrosefysio gikk jeg fra å vegre meg for trapper, til å gå fjelltur
                igjen.&quot;
              </blockquote>
              <div className="who">
                <span className="name">Marit, 64</span>
                <span className="ref">Kneartrose · 8 ukers forløp</span>
              </div>
            </article>
            <article className="mag-card">
              <div className="stars">★★★★★</div>
              <blockquote>
                &quot;Profesjonelle, vennlige og veldig kunnskapsrike. Endelig en fysioterapeut som faktisk forstår
                artrose.&quot;
              </blockquote>
              <div className="who">
                <span className="name">Linda S., 52</span>
                <span className="ref">Kneartrose · 6 ukers forløp</span>
              </div>
            </article>
            <article className="mag-card">
              <div className="stars">★★★★★</div>
              <blockquote>
                &quot;Jeg slapp operasjonen jeg fryktet. Smertene er nesten borte og jeg er tilbake på jobb i full
                stilling.&quot;
              </blockquote>
              <div className="who">
                <span className="name">Kjell O., 58</span>
                <span className="ref">Hofteartrose · 12 ukers forløp</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ===================== CTA BAND ===================== */}
      <CtaBand
        id="kontakt-cta"
        extended
        label="Kontakt"
        title="Klar for færre smerter og mer bevegelse?"
        lede="Bestill en uforpliktende vurderingstime. Vi ringer deg samme dag for å avtale tidspunkt som passer."
        secondary={
          <a href="mailto:artrosefysio@gmail.com" className="btn">
            Send e-post
          </a>
        }
      />
    </>
  );
}
