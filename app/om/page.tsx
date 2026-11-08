import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SpecBand from "@/components/SpecBand";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Om Artrosefysio — Fysioterapeut Klaus Halbakken",
  description:
    "Artrosefysio er en spesialisert fysioterapiklinikk dedikert til behandling av artrose. Møt fysioterapeuten, lær om klinikken og verdiene våre.",
};

type TeamMember = {
  tag: string;
  name: string;
  desc: string;
  dot: { cx: number; cy: number };
  photo?: string;
};

const team: TeamMember[] = [
  {
    tag: "Fysioterapeut",
    name: "Klaus Halbakken",
    desc:
      "Utdannet ved PH Metropol i København i 2015. Jobbet på klinikk i Danmark med GLAD-konseptet (Godt Liv med Artrose i Danmark) over flere år. Etter at jeg flyttet tilbake til Norge, tok jeg kurs hos AktivA, som jeg har jobbet med siden.",
    dot: { cx: 135, cy: 80 },
    photo: "/klaus-halbakken.jpg",
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
                <div className={member.photo ? "model-photo has-photo" : "model-photo"}>
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={`${member.tag} ${member.name}`}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                      style={{ objectFit: "cover", objectPosition: "center 30%" }}
                    />
                  ) : (
                  <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round">
                      <circle cx="100" cy="90" r="32" />
                      <path d="M 60 200 Q 100 150 140 200 L 140 250 L 60 250 Z" />
                      <line x1="100" y1="40" x2="100" y2="250" strokeOpacity="0.15" />
                      <line x1="40" y1="125" x2="160" y2="125" strokeOpacity="0.15" />
                      <circle cx={member.dot.cx} cy={member.dot.cy} r="4" fill="#e8001c" stroke="none" />
                    </g>
                  </svg>
                  )}
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

      {/* ===================== KLINIKKEN: ADRESSE ===================== */}
      <section className="editorial">
        <div className="container">
          <div className="label" style={{ marginBottom: 24 }}>
            <span className="stripe-inline"></span> Klinikken
          </div>
          <h2 className="display-lg" style={{ marginBottom: 24 }}>
            Her finner du oss.
          </h2>
          <p className="body" style={{ fontSize: 18 }}>
            Sterk Kropp
            <br />
            Teglhageveien 29
            <br />
            3125 Tønsberg
          </p>
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
              Autorisert fysioterapeut, sertifisert i artroseprogrammene i både Danmark og Norge.
            </p>
          </div>

          <div className="magazine-grid">
            <article className="mag-card">
              <span className="label">01 / Fysioterapeut</span>
              <blockquote style={{ fontSize: 17 }}>
                Autorisert fysioterapeut.
              </blockquote>
            </article>
            <article className="mag-card">
              <span className="label">02 / GLAD</span>
              <blockquote style={{ fontSize: 17 }}>
                Sertifisert i GLAD — Godt liv med artrose i Danmark.
              </blockquote>
            </article>
            <article className="mag-card">
              <span className="label">03 / AktivA</span>
              <blockquote style={{ fontSize: 17 }}>
                Sertifisert i AktivA — det norske programmet for artrosebehandling.
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
