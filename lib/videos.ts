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
  /** Price in the smallest currency unit (e.g. 19900 = 199,00 kr). */
  price: number;
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

export function formatPrice(video: Pick<Video, "price" | "currency">): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: video.currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(video.price / 100);
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

/** Stream UIDs are 32 lowercase hex characters. */
export const streamUidSchema = z.string().trim().regex(/^[a-f0-9]{32}$/, "Ugyldig Cloudflare video-ID");

export const videoInputSchema = z.object({
  title: z.string().trim().min(2, "Tittel må ha minst 2 tegn").max(200),
  description: z.string().trim().max(2000).default(""),
  /** Price in kroner as typed by the admin, e.g. "299" or "299,50". */
  priceKr: z
    .string()
    .trim()
    .transform((v) => v.replace(/\s/g, "").replace(",", "."))
    .pipe(z.string().regex(/^\d+(\.\d{1,2})?$/, "Pris må være et tall, f.eks. 299 eller 299,50"))
    .transform((v) => Math.round(Number(v) * 100))
    .pipe(z.number().int().min(300, "Minste pris er 3 kr (Stripe-krav)").max(10_000_000)),
  active: z.boolean(),
});

export type VideoInput = z.infer<typeof videoInputSchema>;

export type VideoWithStats = Video & { sales: number; revenue: number };

export async function listAllVideosWithStats(): Promise<VideoWithStats[]> {
  return sql()<VideoWithStats[]>`
    select v.id, v.title, v.description, v.cloudflare_video_uid, v.price, v.currency, v.active, v.created_at,
           count(p.id)::int as sales,
           coalesce(sum(case when p.payment_status = 'paid' then v.price else 0 end), 0)::int as revenue
    from videos v
    left join purchases p on p.video_id = v.id
    group by v.id
    order by v.created_at desc
  `;
}

export async function createVideo(input: VideoInput & { cloudflareVideoUid: string }): Promise<string> {
  const rows = await sql()<{ id: string }[]>`
    insert into videos (title, description, cloudflare_video_uid, price, currency, active)
    values (${input.title}, ${input.description}, ${input.cloudflareVideoUid}, ${input.priceKr}, 'nok', ${input.active})
    returning id
  `;
  return rows[0].id;
}

export async function updateVideo(id: string, input: VideoInput): Promise<void> {
  await sql()`
    update videos
    set title = ${input.title}, description = ${input.description}, price = ${input.priceKr}, active = ${input.active}
    where id = ${id}
  `;
}

/** Deletes a product only if nobody has bought it; returns the Stream UID if deleted. */
export async function deleteUnsoldVideo(id: string): Promise<{ deleted: true; uid: string } | { deleted: false }> {
  const rows = await sql()<{ cloudflare_video_uid: string }[]>`
    delete from videos v
    where v.id = ${id}
      and not exists (select 1 from purchases p where p.video_id = v.id)
    returning v.cloudflare_video_uid
  `;
  return rows[0] ? { deleted: true, uid: rows[0].cloudflare_video_uid } : { deleted: false };
}
