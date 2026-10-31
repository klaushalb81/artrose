import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stateless admin session cookie: "<expiresAtSeconds>.<hmac>".
 *
 * The HMAC key is derived from the admin password and the server's encryption key,
 * so changing ADMIN_PASSWORD logs every admin session out automatically.
 *
 * Intentionally free of Next.js / env imports so it can be unit tested.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 hours

export function deriveSessionKey(adminPassword: string, serverSecret: string): Buffer {
  return createHmac("sha256", serverSecret).update(`admin-session-v1:${adminPassword}`).digest();
}

export function createSessionValue(key: Buffer, now: Date = new Date(), ttlSeconds = ADMIN_SESSION_TTL_SECONDS): string {
  const exp = Math.floor(now.getTime() / 1000) + ttlSeconds;
  return `${exp}.${mac(key, String(exp))}`;
}

export function verifySessionValue(key: Buffer, value: string | undefined | null, now: Date = new Date()): boolean {
  if (!value) return false;
  const match = /^(\d{1,12})\.([A-Za-z0-9_-]{43})$/.exec(value);
  if (!match) return false;
  const [, exp, signature] = match;
  if (!safeEqual(signature, mac(key, exp))) return false;
  return Number(exp) > Math.floor(now.getTime() / 1000);
}

/** Constant-time password comparison (hashes first so lengths always match). */
export function passwordMatches(candidate: string, expected: string): boolean {
  const a = createHmac("sha256", "pw").update(candidate).digest();
  const b = createHmac("sha256", "pw").update(expected).digest();
  return timingSafeEqual(a, b);
}

function mac(key: Buffer, data: string): string {
  return createHmac("sha256", key).update(data).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}
