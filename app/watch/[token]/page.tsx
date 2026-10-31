import type { Metadata } from "next";
import Link from "next/link";
import { createStreamSignedToken, streamIframeUrl } from "@/lib/cloudflare-stream";
import { env } from "@/lib/env";
import { formatDateNb } from "@/lib/format";
import { resolveViewingAccess } from "@/lib/purchases";

export const metadata: Metadata = {
  title: "Din video | Artrosefysio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * /watch/[token]
 *
 * The token in the URL is the customer's credential. We hash it, look the purchase
 * up, verify it's paid and unexpired, then mint a short-lived Cloudflare Stream
 * token server-side. The browser only ever sees that short-lived token — never the
 * video UID, never any API credential.
 */
export default async function WatchPage({ params }: PageProps<"/watch/[token]">) {
  const { token } = await params;
  const access = await resolveViewingAccess(token);

  if (access.status === "invalid") {
    return <Message title="Videolenken er ikke gyldig." text="Sjekk at du har kopiert hele lenken fra bekreftelsen din. Hvis du mener dette er feil, send oss en e-post på artrosefysio@gmail.com." />;
  }

  if (access.status === "expired") {
    return (
      <Message
        title="Tilgangen til videoen har utløpt."
        text="Lenken din var gyldig i 6 måneder fra kjøpet. Du kan kjøpe ny tilgang hvis du vil fortsette å trene med videoen."
        action={
          <Link href="/videoer" className="btn btn-filled">
            Se videoene <span className="arrow">→</span>
          </Link>
        }
      />
    );
  }

  const { CLOUDFLARE_STREAM_CUSTOMER_CODE, CLOUDFLARE_STREAM_SIGNING_KEY_ID, CLOUDFLARE_STREAM_SIGNING_KEY_PEM } = env();
  const streamToken = createStreamSignedToken({
    videoUid: access.video.cloudflare_video_uid,
    key: { id: CLOUDFLARE_STREAM_SIGNING_KEY_ID, pemBase64: CLOUDFLARE_STREAM_SIGNING_KEY_PEM },
  });
  const playerUrl = streamIframeUrl(CLOUDFLARE_STREAM_CUSTOMER_CODE, streamToken);

  return (
    <section>
      <div className="container" style={{ maxWidth: 1100 }}>
        <div className="hero-eyebrow">
          <span className="stripe-inline"></span>
          <span className="label label-muted">Din video</span>
        </div>
        <h1 className="display-md" style={{ marginBottom: 32 }}>
          {access.video.title}
        </h1>

        <div className="video-player">
          <iframe
            src={playerUrl}
            title={access.video.title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>

        <p className="caption" style={{ marginTop: 24 }}>
          Lenken din virker til og med {formatDateNb(access.expiresAt)}. Lagre den som bokmerke for å komme tilbake.
          Hvis videoen stopper etter lang tid, er det nok å laste siden på nytt.
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
