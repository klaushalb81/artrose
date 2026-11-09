import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getVideoPackage } from "@/lib/package";
import { formatPrice, listActiveVideos } from "@/lib/videos";

export const metadata: Metadata = {
  title: "Treningsvideoer | Artrosefysio",
  description:
    "Kjøp 6 måneders tilgang til alle treningsvideoene for artrose. Ingen innlogging — du får en personlig lenke.",
};

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  ugyldig: "Noe gikk galt. Prøv igjen.",
  ingen: "Videoene er ikke tilgjengelige for kjøp akkurat nå. Prøv igjen senere.",
  betaling: "Noe gikk galt da vi skulle starte betalingen. Prøv igjen om et øyeblikk.",
};

export default async function VideoerPage({ searchParams }: PageProps<"/videoer">) {
  const { feil } = await searchParams;
  const errorMessage = typeof feil === "string" ? errorMessages[feil] : undefined;
  const [pkg, videos] = await Promise.all([getVideoPackage(), listActiveVideos()]);

  return (
    <>
      <PageHero
        crumb="Videoer"
        eyebrow="Treningsvideoer"
        title="Tren hjemme."
        lede="Én betaling gir deg tilgang til alle treningsvideoene i 6 måneder. Du får en personlig lenke som du kan åpne så mange ganger du vil — uten innlogging eller passord."
      />

      <div className="stripe"></div>

      <section>
        <div className="container">
          {errorMessage && (
            <div className="callout" style={{ marginTop: 0, marginBottom: 48 }}>
              <span className="label">Obs</span>
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="package">
            <div className="package-buy">
              <span className="model-tag">Videopakke · 6 måneders tilgang</span>
              <h2 className="offer-name" style={{ fontSize: 28 }}>
                {pkg.title}
              </h2>
              {pkg.description && <p className="offer-desc">{pkg.description}</p>}
              <div className="offer-price">
                {formatPrice(pkg)}
                <small>
                  {videos.length > 0
                    ? `${videos.length} ${videos.length === 1 ? "video" : "videoer"} · 6 måneder`
                    : "6 måneder"}
                </small>
              </div>
              {videos.length > 0 ? (
                <form action="/api/checkout" method="POST">
                  <button type="submit" className="btn btn-filled" style={{ width: "100%" }}>
                    Kjøp tilgang <span className="arrow">→</span>
                  </button>
                </form>
              ) : (
                <p className="caption">Videoene kommer snart. Kom gjerne tilbake senere.</p>
              )}
            </div>

            <div className="package-list">
              <span className="label label-muted">Dette får du tilgang til</span>
              <p className="body" style={{ marginTop: 16, fontSize: 18, maxWidth: 560 }}>
                Tilgang til alle øvelsene du trenger, samt informasjon om dine plager. Alle øvelser kommer med forslag
                til progresjons- og regresjonsøvelser, avhengig av hva som passer deg.
              </p>
            </div>
          </div>

          <div className="callout" style={{ marginTop: 64 }}>
            <span className="label">Slik fungerer det</span>
            <ol className="callout-steps">
              <li>Klikk «Kjøp tilgang» og betal trygt med kort.</li>
              <li>Du kommer rett tilbake hit og får din personlige lenke.</li>
              <li>
                Lagre lenken (bokmerke eller e-post til deg selv) — den gir tilgang til alle videoene i 6 måneder, også
                nye videoer som legges ut i perioden.
              </li>
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
