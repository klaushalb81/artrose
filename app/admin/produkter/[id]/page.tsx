import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getStreamVideo, type StreamVideoStatus } from "@/lib/cloudflare-api";
import { createStreamSignedToken, streamIframeUrl } from "@/lib/cloudflare-stream";
import { env } from "@/lib/env";
import { getVideoById, videoIdSchema } from "@/lib/videos";
import { deleteProductAction } from "../../actions";
import StatusPill from "../../StatusPill";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/produkter/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { lagret, feil } = await searchParams;
  if (!videoIdSchema.safeParse(id).success) notFound();

  const video = await getVideoById(id);
  if (!video) notFound();

  let status: StreamVideoStatus | null = null;
  try {
    status = await getStreamVideo(video.cloudflare_video_uid);
  } catch (error) {
    console.error("[admin] could not read Cloudflare status", error);
  }

  let playerUrl: string | null = null;
  if (status?.readyToStream) {
    const e = env();
    const token = createStreamSignedToken({
      videoUid: video.cloudflare_video_uid,
      key: { id: e.CLOUDFLARE_STREAM_SIGNING_KEY_ID, pemBase64: e.CLOUDFLARE_STREAM_SIGNING_KEY_PEM },
    });
    playerUrl = streamIframeUrl(e.CLOUDFLARE_STREAM_CUSTOMER_CODE, token);
  }

  return (
    <>
      <p className="caption" style={{ marginBottom: 16 }}>
        <Link href="/admin">← Videopakken</Link>
      </p>
      <div className="admin-head">
        <div>
          <h1 className="display-sm">{video.title}</h1>
          <p className="caption" style={{ marginTop: 8 }}>
            {video.active ? "Synlig for kundene" : "Skjult for kundene"} · <StatusPill status={status} />
          </p>
        </div>
      </div>

      {lagret && <p className="admin-ok">Videoen er lagt til i pakken.</p>}
      {feil === "solgt" && (
        <p className="admin-error">Videoen hører til et tidligere enkeltkjøp og kan ikke slettes. Skjul den i stedet.</p>
      )}

      <div className="admin-columns">
        <EditProductForm
          video={{
            id: video.id,
            title: video.title,
            description: video.description,
            active: video.active,
          }}
        />

        <div>
          <span className="label label-muted">Forhåndsvisning</span>
          {playerUrl ? (
            <div className="video-player" style={{ marginTop: 12 }}>
              <iframe src={playerUrl} title={video.title} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
            </div>
          ) : (
            <p className="body" style={{ marginTop: 12 }}>
              {status
                ? status.state === "error"
                  ? `Cloudflare kunne ikke behandle videoen: ${status.errorMessage ?? "ukjent feil"}`
                  : "Videoen behandles fortsatt av Cloudflare. Last siden på nytt om litt."
                : "Fant ikke videoen hos Cloudflare."}
            </p>
          )}
          <p className="caption" style={{ marginTop: 12 }}>
            Cloudflare video-ID: <code>{video.cloudflare_video_uid}</code>
          </p>

          <form action={deleteProductAction} style={{ marginTop: 32 }}>
            <input type="hidden" name="id" value={video.id} />
            <button type="submit" className="admin-link-btn admin-danger">
              Slett videoen permanent
            </button>
            <p className="caption" style={{ marginTop: 8 }}>
              Kundene mister tilgang til denne videoen. Vil du bare ta den bort en stund, fjern haken for «Synlig for
              kundene» i stedet.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
