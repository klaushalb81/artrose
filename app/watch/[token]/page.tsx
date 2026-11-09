import type { Metadata } from "next";
import Link from "next/link";
import { createStreamSignedToken, streamIframeUrl } from "@/lib/cloudflare-stream";
import { env } from "@/lib/env";
import { formatDateNb } from "@/lib/format";
import { getVideoPackage } from "@/lib/package";
import { resolveViewingAccess } from "@/lib/purchases";
import { listActiveVideos } from "@/lib/videos";

export const metadata: Metadata = {
  title: "Din video | Artrosefysio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * /watch/[token]
 *
 * The token in the URL is the customer's credential. We hash it, look the purchase
 * up, verify it's paid and unexpired, then list every active video in the package
 * and mint a short-lived Cloudflare Stream token for the one being watched (?v=<id>). The browser only ever sees that short-lived token — never the
 * video UID, never any API credential.
 */
export default async function WatchPage({ params, searchParams }: PageProps<"/watch/[token]">) {
  const { token } = await params;
  const { v } = await searchParams;
  const access = await resolveViewingAccess(token);

  if (access.status === "invalid") {
    return <Message title="Videolenken er ikke gyldig." text="Sjekk at du har kopiert hele lenken fra bekreftelsen din. Hvis du mener dette er feil, send oss en e-post på artrosefys@gmail.com." />;
  }

  if (access.status === "expired") {
    return (
      <Message
        title="Tilgangen til videoene har utløpt."
        text="Lenken din var gyldig i 6 måneder fra kjøpet. Du kan kjøpe ny tilgang hvis du vil fortsette å trene med videoene."
        action={
          <Link href="/videoer" className="btn btn-filled">
            Se videoene <span className="arrow">→</span>
          </Link>
        }
      />
    );
  }

  const [pkg, videos] = await Promise.all([getVideoPackage(), listActiveVideos()]);
  if (videos.length === 0) {
    return (
      <Message
        title="Videoene kommer snart."
        text="Lenken din er gyldig, men ingen videoer er lagt ut akkurat nå. Prøv igjen senere med den samme lenken."
      />
    );
  }

  const current = videos.find((video) => video.id === v) ?? videos[0];

  const { CLOUDFLARE_STREAM_CUSTOMER_CODE, CLOUDFLARE_STREAM_SIGNING_KEY_ID, CLOUDFLARE_STREAM_SIGNING_KEY_PEM } = env();
  const streamToken = createStreamSignedToken({
    videoUid: current.cloudflare_video_uid,
    key: { id: CLOUDFLARE_STREAM_SIGNING_KEY_ID, pemBase64: CLOUDFLARE_STREAM_SIGNING_KEY_PEM },
  });
  const playerUrl = streamIframeUrl(CLOUDFLARE_STREAM_CUSTOMER_CODE, streamToken);

  return (
    <section>
      <div className="container" style={{ maxWidth: 1100 }}>
        <div className="hero-eyebrow">
          <span className="stripe-inline"></span>
          <span className="label label-muted">{pkg.title}</span>
        </div>
        <h1 className="display-md" style={{ marginBottom: 32 }}>
          {current.title}
        </h1>

        <div className="video-player">
          <iframe
            key={current.id}
            src={playerUrl}
            title={current.title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
        {current.description && (
          <p className="body" style={{ marginTop: 24, maxWidth: 760 }}>
            {current.description}
          </p>
        )}

        {videos.length > 1 && (
          <div style={{ marginTop: 48 }}>
            <span className="label label-muted">Alle videoene ({videos.length})</span>
            <ol className="package-videos">
              {videos.map((video) => (
                <li key={video.id} className={video.id === current.id ? "current" : undefined}>
                  <Link href={`/watch/${token}?v=${video.id}`} scroll={false}>
                    <strong>{video.title}</strong>
                    {video.description && <span>{video.description}</span>}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}

        <p className="caption" style={{ marginTop: 32 }}>
          Lenken din gir tilgang til alle videoene til og med {formatDateNb(access.expiresAt)}. Lagre den som bokmerke
          for å komme tilbake. Hvis en video stopper etter lang tid, er det nok å laste siden på nytt.
        </p>
      </div>
    </section>
  );
}

function Message({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <section>
      <div className="container" style={{ maxWidth: 760 }}>
        <h1 className="display-lg" style={{ marginBottom: 24 }}>
          {title}
        </h1>
        <p className="body" style={{ fontSize: 18, marginBottom: action ? 32 : 0 }}>
          {text}
        </p>
        {action}
      </div>
    </section>
  );
}
