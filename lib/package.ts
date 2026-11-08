import "server-only";
import { z } from "zod";
import { sql } from "./db";

/**
 * The video package: one purchase gives 6 months of access to every active video.
 * Stored as the single row in `video_package` (see db/migrations/002_video_package.sql).
 */

export type VideoPackage = {
  title: string;
  description: string;
  /** Price in øre, e.g. 150000 = 1 500 kr. */
  price: number;
  currency: string;
};

/** Price typed by the admin in kroner ("1500", "1 500", "1499,50") → øre. */
export const priceKrSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/\s/g, "").replace(",", "."))
  .pipe(z.string().regex(/^\d+(\.\d{1,2})?$/, "Pris må være et tall, f.eks. 1500 eller 1499,50"))
  .transform((v) => Math.round(Number(v) * 100))
  .pipe(z.number().int().min(300, "Minste pris er 3 kr (Stripe-krav)").max(10_000_000));

export const packageInputSchema = z.object({
  title: z.string().trim().min(2, "Navn må ha minst 2 tegn").max(200),
  description: z.string().trim().max(2000).default(""),
  priceKr: priceKrSchema,
});

export type PackageInput = z.infer<typeof packageInputSchema>;

export async function getVideoPackage(): Promise<VideoPackage> {
  const rows = await sql()<VideoPackage[]>`
    select title, description, price, currency from video_package where id = 1
  `;
  if (!rows[0]) throw new Error("video_package row is missing — run db/migrations/002_video_package.sql");
  return rows[0];
}

export async function updateVideoPackage(input: PackageInput): Promise<void> {
  await sql()`
    update video_package
    set title = ${input.title}, description = ${input.description}, price = ${input.priceKr}, updated_at = now()
    where id = 1
  `;
}
