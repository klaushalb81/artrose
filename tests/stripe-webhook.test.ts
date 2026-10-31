import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Stripe from "stripe";

/**
 * The webhook route delegates signature checking to
 * `stripe.webhooks.constructEvent(rawBody, signatureHeader, secret)`.
 * These tests pin down the behaviour we rely on, using Stripe's own test helper
 * to produce signatures.
 */

const secret = "whsec_test_secret_for_unit_tests";
const stripe = new Stripe("sk_test_dummy", { typescript: true });

const event = {
  id: "evt_test_1",
  object: "event",
  type: "checkout.session.completed",
  created: 1_760_000_000,
  data: {
    object: {
      id: "cs_test_abc123",
      object: "checkout.session",
      payment_status: "paid",
      metadata: { video_id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
};
const payload = JSON.stringify(event);

describe("Stripe webhook signature verification", () => {
  it("accepts a correctly signed payload", () => {
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
    const parsed = stripe.webhooks.constructEvent(payload, header, secret);
    assert.equal(parsed.type, "checkout.session.completed");
    assert.equal((parsed.data.object as { id: string }).id, "cs_test_abc123");
  });

  it("rejects a payload signed with another secret", () => {
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret: "whsec_someone_else" });
    assert.throws(() => stripe.webhooks.constructEvent(payload, header, secret), /No signatures found matching/);
  });

  it("rejects a body that was modified after signing", () => {
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
    const tampered = payload.replace('"paid"', '"unpaid"');
    assert.throws(() => stripe.webhooks.constructEvent(tampered, header, secret));
  });

  it("rejects a missing or garbage signature header", () => {
    assert.throws(() => stripe.webhooks.constructEvent(payload, "", secret));
    assert.throws(() => stripe.webhooks.constructEvent(payload, "t=1,v1=deadbeef", secret));
  });

  it("rejects stale signatures (replay protection)", () => {
    const header = stripe.webhooks.generateTestHeaderString({
      payload,
      secret,
      timestamp: Math.floor(Date.now() / 1000) - 60 * 60, // one hour old
    });
    assert.throws(() => stripe.webhooks.constructEvent(payload, header, secret), /Timestamp outside the tolerance zone/);
  });
});
