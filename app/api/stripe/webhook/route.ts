import type Stripe from "stripe";
import { sendViewingLinkEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { getVideoPackage } from "@/lib/package";
import { stripe } from "@/lib/stripe";
import { createPaidPurchase, markRefundedByPaymentIntent } from "@/lib/purchases";

export const dynamic = "force-dynamic";

/**
 * POST /api/stripe/webhook
 *
 * The single source of truth for "this customer has paid". Flow:
 *   1. verify the Stripe-Signature header against the raw body
 *   2. only act on sessions whose payment_status is "paid"
 *   3. check it is a video package session (metadata.product)
 *   4. insert the purchase + viewing token (idempotent on the session id)
 *
 * Always answer 2xx once the event was understood, even if it was a duplicate,
 * so Stripe stops retrying. Answer 4xx/5xx only when Stripe should retry.
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing Stripe-Signature header", { status: 400 });

  // Must be the raw, unparsed body for signature verification.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(rawBody, signature, env().STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.warn("[webhook] signature verification failed", error instanceof Error ? error.message : error);
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      try {
        await fulfillCheckoutSession(event.data.object, new Date(event.created * 1000));
      } catch (error) {
        console.error(`[webhook] failed to fulfil ${event.type} ${event.id}`, error);
        // 500 → Stripe will retry with the same event (our insert is idempotent).
        return new Response("Fulfilment failed", { status: 500 });
      }
      break;
    }
    case "charge.refunded": {
      // Full refund → revoke access. Partial refunds keep access.
      const charge = event.data.object;
      const paymentIntentId =
        typeof charge.payment_intent === "string" ? charge.payment_intent : (charge.payment_intent?.id ?? null);
      if (charge.refunded && paymentIntentId) {
        try {
          const count = await markRefundedByPaymentIntent(paymentIntentId);
          console.info(`[webhook] refund for ${paymentIntentId}: ${count} purchase(s) revoked`);
        } catch (error) {
          console.error(`[webhook] failed to process refund ${event.id}`, error);
          return new Response("Refund handling failed", { status: 500 });
        }
      }
      break;
    }
    default:
      // e.g. checkout.session.async_payment_failed, checkout.session.expired:
      // nothing was ever granted, so nothing to revoke.
      break;
  }

  return Response.json({ received: true });
}

async function fulfillCheckoutSession(session: Stripe.Checkout.Session, eventTime: Date) {
  // For card payments the session completes already paid. For delayed methods it
  // completes "unpaid" and we get async_payment_succeeded later — ignore until then.
  if (session.payment_status !== "paid") {
    console.info(`[webhook] session ${session.id} not paid yet (${session.payment_status}), skipping`);
    return;
  }

  // Our package sessions carry metadata.product; older single-video sessions carry video_id.
  const isOurs = session.metadata?.product === "video_package" || Boolean(session.metadata?.video_id);
  if (!isOurs) {
    // Not one of our sessions. Nothing to fulfil; don't retry.
    console.error(`[webhook] session ${session.id} is not a video package purchase`);
    return;
  }

  const customerEmail = session.customer_details?.email ?? null;
  const result = await createPaidPurchase({
    checkoutSessionId: session.id,
    paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null),
    customerEmail,
    amountTotal: session.amount_total ?? null,
    currency: session.currency ?? null,
    paidAt: eventTime,
  });

  if (!result.created) {
    console.info(`[webhook] session ${session.id} already fulfilled (duplicate delivery)`);
    return;
  }

  console.info(`[webhook] purchase created for session ${session.id}, expires ${result.expiresAt.toISOString()}`);

  // E-mail the link. Only on first fulfilment (duplicates returned above), and a
  // failed e-mail never undoes the purchase — the admin can resend it from /admin/salg.
  if (customerEmail) {
    try {
      const pkg = await getVideoPackage();
      const mail = await sendViewingLinkEmail({
        to: customerEmail,
        watchUrl: `${env().SITE_URL}/watch/${result.viewingToken}`,
        expiresAt: result.expiresAt,
        packageTitle: pkg.title,
      });
      if (mail.sent) console.info(`[webhook] viewing link e-mailed for session ${session.id}`);
      else console.warn(`[webhook] viewing link not e-mailed for session ${session.id}: ${mail.reason}`);
    } catch (error) {
      console.error(`[webhook] e-mail step failed for session ${session.id}`, error);
    }
  }
}
