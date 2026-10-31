import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { decideAccess } from "../lib/access.ts";

const paidAt = new Date("2026-10-08T12:00:00Z");
// What Postgres computes for paid_at + interval '6 months'
const expiresAt = new Date("2027-04-08T12:00:00Z");

describe("viewing access decision", () => {
  it("grants access to a paid, unexpired purchase", () => {
    assert.equal(decideAccess({ payment_status: "paid", expires_at: expiresAt }, paidAt), "ok");
  });

  it("can be reused many times during the 6 months", () => {
    const row = { payment_status: "paid", expires_at: expiresAt };
    const visits = [
      new Date("2026-10-08T12:00:01Z"),
      new Date("2026-11-15T08:30:00Z"),
      new Date("2026-12-31T23:59:59Z"),
      new Date("2027-03-20T10:00:00Z"),
      new Date("2027-04-08T11:59:59Z"), // one second before expiry
    ];
    for (const when of visits) assert.equal(decideAccess(row, when), "ok", when.toISOString());
  });

  it("denies access from the moment of expiry onwards", () => {
    const row = { payment_status: "paid", expires_at: expiresAt };
    assert.equal(decideAccess(row, expiresAt), "expired");
    assert.equal(decideAccess(row, new Date("2027-04-08T12:00:01Z")), "expired");
    assert.equal(decideAccess(row, new Date("2030-01-01T00:00:00Z")), "expired");
  });

  it("treats an unknown token as invalid, not expired", () => {
    assert.equal(decideAccess(undefined, paidAt), "invalid");
    assert.equal(decideAccess(null, paidAt), "invalid");
  });

  it("never grants access without a successful payment", () => {
    for (const status of ["refunded", "unpaid", "pending", "", "PAID"]) {
      assert.equal(decideAccess({ payment_status: status, expires_at: expiresAt }, paidAt), "invalid", status);
    }
  });
});
