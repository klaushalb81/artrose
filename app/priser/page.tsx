import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Priser | Artrosefysio",
  description:
    "Treningsvideoer med 6 måneders tilgang, online konsultasjon via Zoom og konsultasjon på klinikken i Tønsberg.",
};

type Offer = {
  tag: string;
  name: string;
  desc: string;
  price: string;
  note: string;
  href: string;
  cta: string;
  featured?: boolean;
};

const offers: Offer[] = [
  {
    tag: "Treningsvideoer",
    name: "Videoprogram",
    desc: "Tren hjemme når det passer deg. Du får en personlig lenke til videoene — ingen innlogging eller passord.",
    price: "1 500 kr",
    note: "6 måneders tilgang",
    href: "/videoer",
    cta: "Kjøp tilgang",
    featured: true,
  },
  {
    tag: "Online",
    name: "Online konsultasjon",
    desc: "Konsultasjon med fysioterapeut over Zoom, uansett hvor du bor.",
    price: "1 500 kr",
    note: "45 min · Zoom",
    href: "/kontakt",
    cta: "Bestill",
  },
  {
    tag: "Klinikk",
    name: "Konsultasjon på klinikken",
    desc: "Hos Sterk Kropp, Teglhageveien 29, 3125 Tønsberg.",
    price: "830 kr",
    note: "30 min · Tønsberg",
    href: "/kontakt",
    cta: "Bestill",
  },
];

export default function PriserPage() {
  return (
    <>
      <PageHero
        crumb="Priser"
        eyebrow="Priser"
        title="Priser."
        lede="Tren hjemme med videoprogrammet, eller møt fysioterapeuten online eller på klinikken i Tønsberg."
      />

      <div className="stripe"></div>

      {/* PRICE TABLE */}
      <section>
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="stripe-inline"></span> Priser
            </div>
            <h2 className="display-lg">Velg det som passer deg.</h2>
          </div>

          <div className="offer-grid">
            {offers.map((offer) => (
              <article className={offer.featured ? "offer-card featured" : "offer-card"} key={offer.name}>
                <span className="model-tag">{offer.tag}</span>
                <h3 className="offer-name">{offer.name}</h3>
                <p className="offer-desc">{offer.desc}</p>
                <div className="offer-price">
                  {offer.price}
                  <small>{offer.note}</small>
                </div>
                <Link href={offer.href} className={offer.featured ? "btn btn-filled" : "btn"}>
                  {offer.cta} <span className="arrow">→</span>
                </Link>
              </article>
            ))}
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
                <li>Har du henvisning, ta den gjerne med</li>
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
        lede="Kjøp tilgang til treningsvideoene, eller bestill en konsultasjon online eller i Tønsberg."
        secondary={
          <Link href="/videoer" className="btn">
            Se videoene
          </Link>
        }
      />
    </>
  );
}
