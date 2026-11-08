import "server-only";
import { z } from "zod";
import { sql } from "./db";

/**
 * Videos / products.
 *
 * Videos live in the `videos` table (see db/schema.sql). To add a product, insert a
 * row with the Cloudflare Stream UID and a price in the smallest currency unit
 * (øre for NOK). No CMS needed.
 */

export const videoIdSchema = z.uuid();

export type Video = {
  id: string;
  title: string;
  description: string;
  cloudflare_video_uid: string;
  /** Legacy per-video price (øre). Videos are now sold as one package; see lib/package.ts. */
  price: number | null;
  /** ISO 4217 lowercase, e.g. "nok". */
  currency: string;
  active: boolean;
  created_at: Date;
};

export async function listActiveVideos(): Promise<Video[]> {
  const rows = await sql()<Video[]>`
    select id, title, description, cloudflare_video_uid, price, currency, active, created_at
    from videos
    where active = true
    order by created_at asc
  `;
  return rows;
}

export async function getActiveVideo(id: string): Promise<Video | null> {
  const rows = await sql()<Video[]>`
    select id, title, description, cloudflare_video_uid, price, currency, active, created_at
    from videos
    where id = ${id} and active = true
    limit 1
  `;
  return rows[0] ?? null;
}

/** Looks up a video regardless of `active`, for fulfilling already-paid purchases. */
export async function getVideoById(id: string): Promise<Video | null> {
  const rows = await sql()<Video[]>`
    select id, title, description, cloudflare_video_uid, price, currency, active, created_at
    from videos
    where id = ${id}
    limit 1
  `;
  return rows[0] ?? null;
}

export function formatPrice(video: { price: number | null; currency: string }): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: video.currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format((video.price ?? 0) / 100);
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

/** Stream UIDs are 32 lowercase hex characters. */
export const streamUidSchema = z.string().trim().regex(/^[a-f0-9]{32}$/, "Ugyldig Cloudflare video-ID");

export const videoInputSchema = z.object({
  title: z.string().trim().min(2, "Tittel må ha minst 2 tegn").max(200),
  description: z.string().trim().max(2000).default(""),
  active: z.boolean(),
});

export type VideoInput = z.infer<typeof videoInputSchema>;

export async function listAllVideos(): Promise<Video[]> {
  return sql()<Video[]>`
    select id, title, description, cloudflare_video_uid, price, currency, active, created_at
    from videos
    order by created_at asc
  `;
}

export async function createVideo(input: VideoInput & { cloudflareVideoUid: string }): Promise<string> {
  const rows = await sql()<{ id: string }[]>`
    insert into videos (title, description, cloudflare_video_uid, price, currency, active)
    values (${input.title}, ${input.description}, ${input.cloudflareVideoUid}, null, 'nok', ${input.active})
    returning id
  `;
  return rows[0].id;
}

export async function updateVideo(id: string, input: VideoInput): Promise<void> {
  await sql()`
    update videos
    set title = ${input.title}, description = ${input.description}, active = ${input.active}
    where id = ${id}
  `;
}

/**
 * Deletes a video unless an older single-video purchase still points at it.
 * Returns the Stream UID if deleted.
 */
export async function deleteVideo(id: string): Promise<{ deleted: true; uid: string } | { deleted: false }> {
  const rows = await sql()<{ cloudflare_video_uid: string }[]>`
    delete from videos v
    where v.id = ${id}
      and not exists (select 1 from purchases p where p.video_id = v.id)
    returning v.cloudflare_video_uid
  `;
  return rows[0] ? { deleted: true, uid: rows[0].cloudflare_video_uid } : { deleted: false };
}
