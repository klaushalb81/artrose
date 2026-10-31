/**
 * Pure access decision for /watch/[token], separated from the database so it can
 * be unit tested. `resolveViewingAccess` in lib/purchases.ts feeds it the row it
 * found (or nothing).
 */

export type PurchaseRow = {
  payment_status: string;
  expires_at: Date;
};

export type AccessDecision = "ok" | "invalid" | "expired";

export function decideAccess(row: PurchaseRow | undefined | null, now: Date): AccessDecision {
  if (!row) return "invalid";
  if (row.payment_status !== "paid") return "invalid";
  if (row.expires_at.getTime() <= now.getTime()) return "expired";
  return "ok";
}
