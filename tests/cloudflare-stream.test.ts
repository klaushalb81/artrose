import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { describe, it } from "node:test";
import {
  STREAM_TOKEN_TTL_SECONDS,
  createStreamSignedToken,
  streamIframeUrl,
  verifyStreamSignedToken,
} from "../lib/cloudflare-stream.ts";

// Simulates what Cloudflare's "create signing key" API returns: a key id and a
// base64-encoded PEM private key.
function fakeSigningKey() {
  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  return { id: "test-key-id-123", pemBase64: Buffer.from(pem).toString("base64") };
}

describe("Cloudflare Stream signed token", () => {
  const key = fakeSigningKey();
  const videoUid = "5d5bc37ffcf54c9b82e996823bffbb81";

  it("produces a correctly signed RS256 JWT for the video", () => {
    const now = new Date("2026-10-08T10:00:00Z");
    const token = createStreamSignedToken({ videoUid, key, now });

    const parsed = verifyStreamSignedToken(token, key);
    assert.ok(parsed, "signature must verify with the key's public half");
    assert.equal(parsed.header.alg, "RS256");
    assert.equal(parsed.header.kid, key.id);
    assert.equal(parsed.payload.sub, videoUid);
    assert.equal(parsed.payload.kid, key.id);
  });

  it("is short-lived", () => {
    const now = new Date("2026-10-08T10:00:00Z");
    const token = createStreamSignedToken({ videoUid, key, now });
    const { payload } = verifyStreamSignedToken(token, key)!;
    const nowSeconds = Math.floor(now.getTime() / 1000);
    assert.equal(payload.exp, nowSeconds + STREAM_TOKEN_TTL_SECONDS);
    assert.ok((payload.exp as number) - nowSeconds <= 24 * 60 * 60, "must expire within a day");
    assert.ok((payload.nbf as number) <= nowSeconds);
  });

  it("honours a custom ttl", () => {
    const now = new Date();
    const token = createStreamSignedToken({ videoUid, key, now, ttlSeconds: 60 });
    const { payload } = verifyStreamSignedToken(token, key)!;
    assert.equal(payload.exp, Math.floor(now.getTime() / 1000) + 60);
  });

  it("rejects tokens signed with a different key", () => {
    const token = createStreamSignedToken({ videoUid, key });
    assert.equal(verifyStreamSignedToken(token, fakeSigningKey()), null);
  });

  it("rejects a tampered token", () => {
    const token = createStreamSignedToken({ videoUid, key });
    const [h, , s] = token.split(".");
    const otherPayload = Buffer.from(JSON.stringify({ sub: "another-video", kid: key.id, exp: 9999999999 })).toString(
      "base64url",
    );
    assert.equal(verifyStreamSignedToken(`${h}.${otherPayload}.${s}`, key), null);
  });

  it("fails loudly on a malformed PEM instead of producing a bad token", () => {
    assert.throws(() => createStreamSignedToken({ videoUid, key: { id: "k", pemBase64: Buffer.from("nope").toString("base64") } }));
  });

  it("embeds via the signed token, never via the raw UID", () => {
    const token = createStreamSignedToken({ videoUid, key });
    const url = streamIframeUrl("abc123", token);
    assert.equal(url, `https://customer-abc123.cloudflarestream.com/${token}/iframe`);
    assert.ok(!url.includes(videoUid));
  });
});
