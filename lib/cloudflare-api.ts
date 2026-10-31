import "server-only";
import { adminEnv } from "./env";

/**
 * Cloudflare Stream management API — admin only.
 * The public site never calls this; it only signs playback tokens.
 */

export type StreamVideoStatus = {
  uid: string;
  readyToStream: boolean;
  /** "pendingupload" | "downloading" | "queued" | "inprogress" | "ready" | "error" */
  state: string;
  durationSeconds: number | null;
  requireSignedURLs: boolean;
  errorMessage: string | null;
};

function base(): string {
  return `https://api.cloudflare.com/client/v4/accounts/${adminEnv().CLOUDFLARE_ACCOUNT_ID}/stream`;
}

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${adminEnv().CLOUDFLARE_API_TOKEN}` };
}

/**
 * Starts a resumable (tus) direct upload. The browser then sends the file straight
 * to Cloudflare, so large videos never pass through our Netlify functions.
 * The video is created with "require signed URLs" switched on from the start.
 */
export async function createTusDirectUpload(input: {
  uploadLength: string;
  name: string;
}): Promise<{ location: string; uid: string }> {
  const metadata = [
    `name ${Buffer.from(input.name.slice(0, 200) || "video").toString("base64")}`,
    "requiresignedurls",
  ].join(",");

  const response = await fetch(`${base()}?direct_user=true`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Tus-Resumable": "1.0.0",
      "Upload-Length": input.uploadLength,
      "Upload-Metadata": metadata,
    },
  });

  const location = response.headers.get("location");
  const uid = response.headers.get("stream-media-id");
  if (!response.ok || !location || !uid) {
    const text = await response.text().catch(() => "");
    throw new Error(`Cloudflare upload init failed (${response.status}): ${text.slice(0, 500)}`);
  }
  return { location, uid };
}

type CfVideo = {
  uid: string;
  readyToStream: boolean;
  duration: number;
  requireSignedURLs: boolean;
  status?: { state?: string; errorReasonText?: string };
};

function toStatus(v: CfVideo): StreamVideoStatus {
  return {
    uid: v.uid,
    readyToStream: v.readyToStream,
    state: v.status?.state ?? "unknown",
    durationSeconds: v.duration > 0 ? v.duration : null,
    requireSignedURLs: v.requireSignedURLs,
    errorMessage: v.status?.errorReasonText || null,
  };
}

export async function getStreamVideo(uid: string): Promise<StreamVideoStatus | null> {
  const response = await fetch(`${base()}/${encodeURIComponent(uid)}`, { headers: authHeaders(), cache: "no-store" });
  if (response.status === 404) return null;
  const json = (await response.json()) as { success: boolean; result: CfVideo };
  if (!response.ok || !json.success) throw new Error(`Cloudflare API error (${response.status})`);
  return toStatus(json.result);
}

/** Status for many videos at once; videos Cloudflare doesn't know are left out. */
export async function getStreamVideos(uids: string[]): Promise<Map<string, StreamVideoStatus>> {
  const results = await Promise.allSettled(uids.map((uid) => getStreamVideo(uid)));
  const map = new Map<string, StreamVideoStatus>();
  for (const r of results) if (r.status === "fulfilled" && r.value) map.set(r.value.uid, r.value);
  return map;
}

/** Makes sure a (possibly manually uploaded) video can only be played with our signed tokens. */
export async function requireSignedUrls(uid: string): Promise<void> {
  const response = await fetch(`${base()}/${encodeURIComponent(uid)}`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ uid, requireSignedURLs: true }),
  });
  if (!response.ok) throw new Error(`Could not enable signed URLs for ${uid} (${response.status})`);
}

export async function deleteStreamVideo(uid: string): Promise<void> {
  const response = await fetch(`${base()}/${encodeURIComponent(uid)}`, { method: "DELETE", headers: authHeaders() });
  if (!response.ok && response.status !== 404) throw new Error(`Could not delete video ${uid} (${response.status})`);
}
