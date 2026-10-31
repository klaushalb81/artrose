import { createPrivateKey, createPublicKey, sign, verify, type KeyObject } from "node:crypto";

/**
 * Cloudflare Stream signed tokens.
 *
 * Videos are configured with "require signed URLs", so the plain video UID cannot be
 * played. Instead we mint a short-lived RS256 JWT, signed with a Stream signing key
 * that only the server knows, and hand the player that token instead of the UID.
 *
 * Reference: https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/
 *
 * This module is intentionally free of Next.js / env imports so it can be unit tested.
 */

/** How long a playback token stays valid. Must exceed the longest video + some slack. */
export const STREAM_TOKEN_TTL_SECONDS = 2 * 60 * 60; // 2 hours

export type StreamSigningKey = {
  /** Key id returned by the Stream "keys" API. */
  id: string;
  /** Base64-encoded PEM private key, exactly as returned by the Stream "keys" API. */
  pemBase64: string;
};

type SignOptions = {
  videoUid: string;
  key: StreamSigningKey;
  /** Seconds the token is valid for. Defaults to STREAM_TOKEN_TTL_SECONDS. */
  ttlSeconds?: number;
  /** Current time, injectable for tests. */
  now?: Date;
};

export function createStreamSignedToken({ videoUid, key, ttlSeconds, now }: SignOptions): string {
  if (!videoUid) throw new Error("videoUid is required");
  const ttl = ttlSeconds ?? STREAM_TOKEN_TTL_SECONDS;
  const nowSeconds = Math.floor((now ?? new Date()).getTime() / 1000);

  const header = { alg: "RS256", kid: key.id };
  const payload = {
    sub: videoUid,
    kid: key.id,
    exp: nowSeconds + ttl,
    nbf: nowSeconds - 60, // small clock-skew allowance
  };

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signature = sign("RSA-SHA256", Buffer.from(signingInput), privateKeyFrom(key));
  return `${signingInput}.${signature.toString("base64url")}`;
}

/** Player embed URL for a signed token (never for a raw video UID). */
export function streamIframeUrl(customerCode: string, signedToken: string): string {
  return `https://customer-${customerCode}.cloudflarestream.com/${signedToken}/iframe`;
}

/** Used by tests to confirm tokens are well-formed and correctly signed. */
export function verifyStreamSignedToken(
  token: string,
  key: StreamSigningKey,
): { header: Record<string, unknown>; payload: Record<string, unknown> } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const publicKey = createPublicKey(privateKeyFrom(key));
  const ok = verify("RSA-SHA256", Buffer.from(`${h}.${p}`), publicKey, Buffer.from(s, "base64url"));
  if (!ok) return null;
  return {
    header: JSON.parse(Buffer.from(h, "base64url").toString("utf8")),
    payload: JSON.parse(Buffer.from(p, "base64url").toString("utf8")),
  };
}

function privateKeyFrom(key: StreamSigningKey): KeyObject {
  const pem = Buffer.from(key.pemBase64, "base64").toString("utf8");
  if (!pem.includes("PRIVATE KEY")) {
    throw new Error("CLOUDFLARE_STREAM_SIGNING_KEY_PEM does not look like a base64-encoded PEM private key");
  }
  return createPrivateKey(pem);
}

function base64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}
