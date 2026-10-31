import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { formatPrice, listActiveVideos } from "@/lib/videos";

export const metadata: Metadata = {
  title: "Treningsvideoer | Artrosefysio",
  description: "Kjøp tilgang til treningsvideoer for kne- og hofteartrose. Ingen innlogging — du får en personlig lenke som virker i 6 måneder.",
};

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  ugyldig: "Vi fant ikke videoen du valgte. Prøv igjen.",
  betaling: "Noe gikk galt da vi skulle starte betalingen. Prøv igjen om et øyeblikk.",
};

export default async function VideoerPage({ searchParams }: PageProps<"/videoer">) {
  const { feil } = await searchParams;
  const errorMessage = typeof feil === "string" ? errorMessages[feil] : undefined;
  const videos = await listActiveVideos();

  return (
    <>
      <PageHero
        crumb="Videoer"
        eyebrow="Treningsvideoer"
        title="Tren hjemme."
        lede="Velg en video og betal med kort. Etterpå får du en personlig lenke som du kan åpne så mange ganger du vil i 6 måneder — uten innlogging eller passord."
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

          {videos.length === 0 ? (
            <p className="body" style={{ fontSize: 18 }}>
              Ingen videoer er tilgjengelige akkurat nå. Kom gjerne tilbake senere.
            </p>
          ) : (
            <div className={videos.length <= 2 ? "models-grid models-grid-2" : "models-grid"}>
              {videos.map((video) => (
                <article className="model-card" key={video.id}>
                  <div className="model-body" style={{ padding: "32px 28px 36px" }}>
                    <span className="model-tag">{formatPrice(video)} · 6 måneders tilgang</span>
                    <h2 className="model-title">{video.title}</h2>
                    <p className="model-desc" style={{ flexGrow: 1 }}>
                      {video.description}
                    </p>
                    <form action="/api/checkout" method="POST" style={{ marginTop: 8 }}>
                      <input type="hidden" name="videoId" value={video.id} />
                      <button type="submit" className="btn btn-filled" style={{ width: "100%" }}>
                        Kjøp <span className="arrow">→</span>
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="callout" style={{ marginTop: 64 }}>
            <span className="label">Slik fungerer det</span>
            <p>
              1. Klikk «Kjøp» og betal trygt med kort. 2. Du kommer rett tilbake hit og får lenken til videoen din.
              3. Lagre lenken (bokmerke eller e-post til deg selv) — den virker i 6 måneder.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
