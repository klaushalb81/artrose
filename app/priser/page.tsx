import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Priser og behandlingstyper | Artrosefysio",
  description:
    "Oversikt over priser og behandlingstyper hos Artrosefysio.",
};

const prices = [
  {
    name: "Førstegangsundersøkelse",
    desc: "Grundig kartlegging, undersøkelse og oppstart av plan",
    duration: "60 min",
    price: "230 kr",
    note: "",
  },
  {
    name: "Oppfølgingstime",
    desc: "Behandling, veiledet trening og justering av program",
    duration: "30 min",
    price: "160 kr",
    note: "",
  },
  {
    name: "Lengre oppfølging",
    desc: "Kombinasjon av manuell behandling og trening",
    duration: "45 min",
    price: "200 kr",
    note: "",
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
    note: "",
  },
  {
    name: "Hjemmebesøk",
    desc: "Behandling i hjemmet ved sterkt nedsatt funksjon",
    duration: "45 min",
    price: "350 kr",
    note: "+ reise",
  },
];

export default function PriserPage() {
  return (
    <>
      <PageHero
        crumb="Priser"
        eyebrow="Priser og takster"
        title="Priser."
        lede="Oversikt over behandlingstyper og priser. Ingen skjulte tillegg."
      />

      <div className="stripe"></div>

      {/* PRICE TABLE */}
      <section>
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="stripe-inline"></span> Priser
            </div>
            <h2 className="display-lg">Behandlingstyper.</h2>
          </div>

          <div className="price-table">
            <div className="price-row head">
              <div>Behandling</div>
              <div>Varighet</div>
              <div style={{ textAlign: "right" }}>Pris</div>
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
                  {row.note && <small>{row.note}</small>}
                </div>
              </div>
            ))}
          </div>

          <p className="caption" style={{ marginTop: 24 }}>
            Endelig pris bekreftes ved bestilling.
          </p>
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
                  Send oss en e-post på artrosefysio@gmail.com. Vi svarer på alle praktiske spørsmål før du
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
          <a href="mailto:artrosefysio@gmail.com" className="btn">
            Send e-post
          </a>
        }
      />
    </>
  );
}
