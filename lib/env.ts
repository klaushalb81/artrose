import "server-only";
import { z } from "zod";

/**
 * Server-side environment variables.
 *
 * Everything in here is secret or server-only. Nothing from this module may be
 * imported into a Client Component (the "server-only" import enforces that at
 * build time).
 */
const schema = z.object({
  // Public URL of the site, used to build Stripe redirect URLs and viewing links.
  SITE_URL: z.url(),

  // Postgres connection string (Supabase: use the *transaction pooler* URL).
  DATABASE_URL: z.string().min(1),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),

  // Cloudflare Stream
  CLOUDFLARE_STREAM_CUSTOMER_CODE: z.string().min(1),
  CLOUDFLARE_STREAM_SIGNING_KEY_ID: z.string().min(1),
  // Base64-encoded PEM private key, exactly as returned by the Stream "keys" API.
  CLOUDFLARE_STREAM_SIGNING_KEY_PEM: z.string().min(1),

  // 32 random bytes, base64-encoded. Encrypts the stored copy of viewing tokens.
  VIEWING_TOKEN_ENCRYPTION_KEY: z
    .string()
    .refine((v) => Buffer.from(v, "base64").length === 32, {
      message: "must be 32 bytes, base64-encoded (openssl rand -base64 32)",
    }),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

/**
 * Extra variables needed only by the admin dashboard. Kept separate so the public
 * shop keeps working even if these are missing.
 */
const adminSchema = z.object({
  // Password for /admin. Use a long random passphrase.
  ADMIN_PASSWORD: z.string().min(12, { message: "must be at least 12 characters" }),
  // Cloudflare API access, used by the admin to upload videos and read their status.
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_API_TOKEN: z.string().min(1),
});

export type AdminEnv = z.infer<typeof adminSchema>;
let adminCached: AdminEnv | undefined;

export function adminEnv(): AdminEnv {
  if (adminCached) return adminCached;
  const result = adminSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid or missing admin environment variables:\n${missing}`);
  }
  adminCached = result.data;
  return adminCached;
}

/**
 * Optional: e-mail sending via Gmail (artrosefys@gmail.com) with a Google
 * "app password". If either is missing, the site works but sends no e-mail.
 */
const emailSchema = z.object({
  GMAIL_USER: z.email(),
  // 16 characters from https://myaccount.google.com/apppasswords (spaces allowed)
  GMAIL_APP_PASSWORD: z.string().transform((v) => v.replace(/\s/g, "")).pipe(z.string().min(16)),
});

export type EmailEnv = z.infer<typeof emailSchema>;

/** Returns the Gmail settings, or null if e-mail isn't configured. */
export function emailEnv(): EmailEnv | null {
  const result = emailSchema.safeParse(process.env);
  return result.success ? result.data : null;
}

/** Parse and cache env vars on first use (so `next build` doesn't need them). */
export function env(): Env {
  if (cached) return cached;
  const result = schema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid or missing environment variables:\n${missing}`);
  }
  cached = result.data;
  return cached;
}
