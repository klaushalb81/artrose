import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * Customer viewing tokens.
 *
 * The token is the customer's only credential, so it must be unguessable:
 * 32 bytes (256 bits) from the OS CSPRNG, base64url-encoded → 43 characters.
 *
 * The database never stores the raw token in the clear:
 *  - `hashViewingToken`     → SHA-256 hex, used as the lookup key for /watch/[token]
 *  - `encryptViewingToken`  → AES-256-GCM copy, so the success page (and support)
 *                             can show the link again. Needs a separate key.
 *
 * This module is intentionally free of Next.js / env imports so it can be unit tested.
 */

const TOKEN_BYTES = 32;

/** base64url of 32 bytes is always exactly 43 chars from this alphabet. */
export const VIEWING_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function generateViewingToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

export function isValidViewingTokenFormat(token: unknown): token is string {
  return typeof token === "string" && VIEWING_TOKEN_PATTERN.test(token);
}

export function hashViewingToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

/** Encrypt with AES-256-GCM. Output: base64(iv ‖ authTag ‖ ciphertext). */
export function encryptViewingToken(token: string, key: Buffer): string {
  assertKey(key);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString("base64");
}

export function decryptViewingToken(payload: string, key: Buffer): string {
  assertKey(key);
  const buf = Buffer.from(payload, "base64");
  if (buf.length < 12 + 16 + 1) throw new Error("Encrypted token payload is too short");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ciphertext = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

function assertKey(key: Buffer) {
  if (key.length !== 32) throw new Error("Encryption key must be exactly 32 bytes");
}
