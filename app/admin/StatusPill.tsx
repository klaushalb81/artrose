import type { StreamVideoStatus } from "@/lib/cloudflare-api";

export default function StatusPill({ status }: { status: StreamVideoStatus | undefined | null }) {
  if (!status) return <span className="pill pill-bad">Video mangler</span>;
  if (status.state === "error") return <span className="pill pill-bad">Feil i video</span>;
  if (!status.readyToStream) return <span className="pill pill-wait">Behandles …</span>;
  if (!status.requireSignedURLs) return <span className="pill pill-bad">Ikke beskyttet</span>;
  return <span className="pill pill-ok">Klar</span>;
}
