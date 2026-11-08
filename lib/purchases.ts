import "server-only";
import { decideAccess } from "./access";
import { sql } from "./db";
import { env } from "./env";
import {
  decryptViewingToken,
  encryptViewingToken,
  generateViewingToken,
  hashViewingToken,
  isValidViewingTokenFormat,
} from "./viewing-token";

/** How long a purchase grants access, as a Postgres interval literal. */
export const ACCESS_INTERVAL = "6 months";

function encryptionKey(): Buffer {
  return Buffer.from(env().VIEWING_TOKEN_ENCRYPTION_KEY, "base64");
}

type CreatePaidPurchaseInput = {
  checkoutSessionId: string;
  paymentIntentId: string | null;
  customerEmail: string | null;
  /** What Stripe charged, in øre, and its currency. */
  amountTotal: number | null;
  currency: string | null;
  /** When Stripe confirmed the payment. Access runs exactly 6 months from here. */
  paidAt: Date;
};

type CreatePaidPurchaseResult =
  | { created: true; viewingToken: string; expiresAt: Date }
  | { created: false };

/**
 * Records a successful package purchase and mints the customer's viewing token.
 *
 * Idempotent: `stripe_checkout_session_id` is UNIQUE, so a retried webhook hits
 * `ON CONFLICT DO NOTHING` and we report `created: false` without touching the
 * existing row or generating a second token.
 */
export async function createPaidPurchase(input: CreatePaidPurchaseInput): Promise<CreatePaidPurchaseResult> {
  const viewingToken = generateViewingToken();
  const tokenHash = hashViewingToken(viewingToken);
  const tokenEncrypted = encryptViewingToken(viewingToken, encryptionKey());

  const rows = await sql()<{ expires_at: Date }[]>`
    insert into purchases (
      video_id,
      stripe_checkout_session_id,
      stripe_payment_intent_id,
      customer_email,
      amount_total,
      currency,
      viewing_token_hash,
      viewing_token_encrypted,
      payment_status,
      paid_at,
      expires_at
    ) values (
      null,
      ${input.checkoutSessionId},
      ${input.paymentIntentId},
      ${input.customerEmail},
      ${input.amountTotal},
      ${input.currency},
      ${tokenHash},
      ${tokenEncrypted},
      'paid',
      ${input.paidAt}::timestamptz,
      ${input.paidAt}::timestamptz + ${ACCESS_INTERVAL}::interval
    )
    on conflict (stripe_checkout_session_id) do nothing
    returning expires_at
  `;

  if (rows.length === 0) return { created: false };
  return { created: true, viewingToken, expiresAt: rows[0].expires_at };
}

export type SuccessPagePurchase = {
  viewingToken: string;
  expiresAt: Date;
};

/**
 * For the post-checkout success page. Only called after the server has verified
 * with Stripe that the session is paid; returns null until the webhook has run.
 */
export async function getPurchaseByCheckoutSession(checkoutSessionId: string): Promise<SuccessPagePurchase | null> {
  const rows = await sql()<{ viewing_token_encrypted: string; expires_at: Date }[]>`
    select viewing_token_encrypted, expires_at
    from purchases
    where stripe_checkout_session_id = ${checkoutSessionId}
      and payment_status = 'paid'
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    viewingToken: decryptViewingToken(row.viewing_token_encrypted, encryptionKey()),
    expiresAt: row.expires_at,
  };
}

export type ViewingAccess = { status: "invalid" } | { status: "expired" } | { status: "ok"; expiresAt: Date };

/**
 * Resolves a customer-supplied token from /watch/[token].
 *
 * Checks, in order: token shape → purchase exists (by hash) → payment is 'paid'
 * → not expired. A valid token unlocks every active video in the package and
 * can be used any number of times until `expires_at`.
 */
export async function resolveViewingAccess(rawToken: unknown, now: Date = new Date()): Promise<ViewingAccess> {
  if (!isValidViewingTokenFormat(rawToken)) return { status: "invalid" };

  const rows = await sql()<{ payment_status: string; expires_at: Date }[]>`
    select payment_status, expires_at
    from purchases
    where viewing_token_hash = ${hashViewingToken(rawToken)}
    limit 1
  `;
  const row = rows[0];
  const decision = decideAccess(row, now);
  if (decision !== "ok" || !row) return { status: decision === "expired" ? "expired" : "invalid" };
  return { status: "ok", expiresAt: row.expires_at };
}

// ---------------------------------------------------------------------------
// Admin / support
// ---------------------------------------------------------------------------

export type AdminPurchaseRow = {
  id: string;
  /** Title of the video for older single-video purchases; null for package purchases. */
  video_title: string | null;
  amount_total: number | null;
  customer_email: string | null;
  payment_status: string;
  paid_at: Date;
  expires_at: Date;
  stripe_payment_intent_id: string | null;
  viewing_token_encrypted: string;
};

export type AdminPurchase = Omit<AdminPurchaseRow, "viewing_token_encrypted"> & { viewingToken: string | null };

export async function listPurchasesForAdmin(search: string, limit = 200): Promise<AdminPurchase[]> {
  const pattern = `%${search.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const rows = await sql()<AdminPurchaseRow[]>`
    select p.id, v.title as video_title, p.amount_total, p.customer_email, p.payment_status, p.paid_at,
           p.expires_at, p.stripe_payment_intent_id, p.viewing_token_encrypted
    from purchases p
    left join videos v on v.id = p.video_id
    where ${search} = '' or p.customer_email ilike ${pattern}
    order by p.paid_at desc
    limit ${limit}
  `;
  return rows.map(({ viewing_token_encrypted, ...row }) => {
    let viewingToken: string | null = null;
    try {
      viewingToken = decryptViewingToken(viewing_token_encrypted, encryptionKey());
    } catch {
      // Encryption key changed since this purchase; the link still works but can't be shown.
    }
    return { ...row, viewingToken };
  });
}

/** Support tool: gives the customer another full access period from today (or from current expiry if later). */
export async function extendPurchase(id: string): Promise<void> {
  await sql()`
    update purchases
    set expires_at = greatest(expires_at, now()) + ${ACCESS_INTERVAL}::interval
    where id = ${id} and payment_status = 'paid'
  `;
}

/** Called from the Stripe webhook when a payment is fully refunded. Revokes access. */
export async function markRefundedByPaymentIntent(paymentIntentId: string): Promise<number> {
  const rows = await sql()`
    update purchases set payment_status = 'refunded'
    where stripe_payment_intent_id = ${paymentIntentId} and payment_status = 'paid'
    returning id
  `;
  return rows.length;
}

export type SalesStats = { paidCount: number; revenue: number };

/** Number of paid (not refunded) purchases and the total charged, in øre. */
export async function getSalesStats(): Promise<SalesStats> {
  const rows = await sql()<{ paid_count: number; revenue: number }[]>`
    select count(*)::int as paid_count, coalesce(sum(amount_total), 0)::int as revenue
    from purchases
    where payment_status = 'paid'
  `;
  return { paidCount: rows[0].paid_count, revenue: rows[0].revenue };
}
