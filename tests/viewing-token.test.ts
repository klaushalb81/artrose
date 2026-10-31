import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { describe, it } from "node:test";
import {
  decryptViewingToken,
  encryptViewingToken,
  generateViewingToken,
  hashViewingToken,
  isValidViewingTokenFormat,
} from "../lib/viewing-token.ts";

describe("viewing token generation", () => {
  it("is 43 base64url characters (256 bits of entropy)", () => {
    const token = generateViewingToken();
    assert.match(token, /^[A-Za-z0-9_-]{43}$/);
    assert.equal(Buffer.from(token, "base64url").length, 32);
  });

  it("never repeats", () => {
    const seen = new Set(Array.from({ length: 2000 }, generateViewingToken));
    assert.equal(seen.size, 2000);
  });

  it("rejects anything that is not a token", () => {
    for (const bad of [
      "",
      "abc",
      "550e8400-e29b-41d4-a716-446655440000", // a UUID is not acceptable as a token
      "1",
      String(Date.now()),
      generateViewingToken().slice(0, 42),
      generateViewingToken() + "x",
      generateViewingToken().replace(/./, "+"), // wrong alphabet
      null,
      undefined,
      42,
    ]) {
      assert.equal(isValidViewingTokenFormat(bad), false, `should reject ${String(bad)}`);
    }
    assert.equal(isValidViewingTokenFormat(generateViewingToken()), true);
  });
});

describe("viewing token hashing", () => {
  it("is deterministic and not reversible by shape", () => {
    const token = generateViewingToken();
    const a = hashViewingToken(token);
    const b = hashViewingToken(token);
    assert.equal(a, b);
    assert.match(a, /^[0-9a-f]{64}$/);
    assert.notEqual(a, token);
  });

  it("differs for different tokens", () => {
    assert.notEqual(hashViewingToken(generateViewingToken()), hashViewingToken(generateViewingToken()));
  });
});

describe("viewing token encryption", () => {
  const key = randomBytes(32);

  it("round-trips", () => {
    const token = generateViewingToken();
    const payload = encryptViewingToken(token, key);
    assert.notEqual(payload, token);
    assert.equal(decryptViewingToken(payload, key), token);
  });

  it("uses a fresh IV every time", () => {
    const token = generateViewingToken();
    assert.notEqual(encryptViewingToken(token, key), encryptViewingToken(token, key));
  });

  it("fails on a tampered payload or wrong key", () => {
    const payload = encryptViewingToken(generateViewingToken(), key);
    const tampered = Buffer.from(payload, "base64");
    tampered[tampered.length - 1] ^= 0xff;
    assert.throws(() => decryptViewingToken(tampered.toString("base64"), key));
    assert.throws(() => decryptViewingToken(payload, randomBytes(32)));
  });

  it("refuses keys that are not 32 bytes", () => {
    assert.throws(() => encryptViewingToken("x", randomBytes(16)));
  });
});
