import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createSessionValue,
  deriveSessionKey,
  passwordMatches,
  verifySessionValue,
} from "../lib/admin-session.ts";

const key = deriveSessionKey("correct horse battery staple", "server-secret");
const now = new Date("2026-11-01T10:00:00Z");

describe("admin session cookie", () => {
  it("accepts a freshly created session", () => {
    assert.equal(verifySessionValue(key, createSessionValue(key, now), now), true);
  });

  it("rejects an expired session", () => {
    const value = createSessionValue(key, now, 60);
    assert.equal(verifySessionValue(key, value, new Date(now.getTime() + 61_000)), false);
  });

  it("rejects a tampered expiry", () => {
    const [exp, sig] = createSessionValue(key, now).split(".");
    assert.equal(verifySessionValue(key, `${Number(exp) + 999999}.${sig}`, now), false);
  });

  it("is invalidated when the admin password changes", () => {
    const value = createSessionValue(key, now);
    const newKey = deriveSessionKey("a different password", "server-secret");
    assert.equal(verifySessionValue(newKey, value, now), false);
  });

  it("rejects garbage and missing values", () => {
    for (const v of [undefined, null, "", "abc", "1.2", "999999999999.xxx"]) {
      assert.equal(verifySessionValue(key, v as string, now), false, String(v));
    }
  });
});

describe("password comparison", () => {
  it("matches only the exact password", () => {
    assert.equal(passwordMatches("secret-password-1", "secret-password-1"), true);
    assert.equal(passwordMatches("secret-password-2", "secret-password-1"), false);
    assert.equal(passwordMatches("", "secret-password-1"), false);
  });
});
