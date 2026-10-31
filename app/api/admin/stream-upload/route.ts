import { isAdmin } from "@/lib/admin-auth";
import { createTusDirectUpload } from "@/lib/cloudflare-api";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/stream-upload  — tus "creation" endpoint for the admin uploader.
 *
 * tus-js-client calls this first. We ask Cloudflare for a one-time upload URL and
 * hand it back in the Location header; the browser then uploads the file directly
 * to Cloudflare. Our function never sees the video bytes (Netlify limits bodies to ~6 MB).
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });

  const uploadLength = request.headers.get("upload-length");
  if (!uploadLength || !/^\d+$/.test(uploadLength)) {
    return new Response("Missing Upload-Length", { status: 400 });
  }

  const name = readTusMetadata(request.headers.get("upload-metadata"), "filename") ?? "video";

  try {
    const { location, uid } = await createTusDirectUpload({ uploadLength, name });
    return new Response(null, {
      status: 201,
      headers: {
        Location: location,
        "Tus-Resumable": "1.0.0",
        "stream-media-id": uid,
        "Access-Control-Expose-Headers": "Location, stream-media-id",
      },
    });
  } catch (error) {
    console.error("[admin upload] failed to create direct upload", error);
    return new Response("Could not start upload", { status: 502 });
  }
}

function readTusMetadata(header: string | null, key: string): string | null {
  if (!header) return null;
  for (const pair of header.split(",")) {
    const [k, v] = pair.trim().split(" ");
    if (k === key && v) {
      try {
        return Buffer.from(v, "base64").toString("utf8");
      } catch {
        return null;
      }
    }
  }
  return null;
}
