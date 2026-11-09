import CopyLinkButton from "@/components/CopyLinkButton";
import { requireAdmin } from "@/lib/admin-auth";
import { env } from "@/lib/env";
import { formatDateNb } from "@/lib/format";
import { listPurchasesForAdmin } from "@/lib/purchases";
import { formatPrice } from "@/lib/videos";
import { extendPurchaseAction, resendLinkAction } from "../actions";

export default async function SalesPage({ searchParams }: PageProps<"/admin/salg">) {
  await requireAdmin();
  const { q, epost } = await searchParams;
  const search = typeof q === "string" ? q.trim().slice(0, 200) : "";
  const purchases = await listPurchasesForAdmin(search);
  const now = new Date();
  const stripeBase = env().STRIPE_SECRET_KEY.startsWith("sk_test_")
    ? "https://dashboard.stripe.com/test/payments"
    : "https://dashboard.stripe.com/payments";

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="display-sm">Salg</h1>
          <p className="caption" style={{ marginTop: 8 }}>
            Finn en kunde for å sende lenken på nytt eller forlenge tilgangen.
          </p>
        </div>
        <form className="admin-search">
          <input name="q" defaultValue={search} placeholder="Søk på e-post" />
          <button type="submit" className="btn">
            Søk
          </button>
        </form>
      </div>

      {epost === "sendt" && <p className="admin-ok">Lenken er sendt på e-post.</p>}
      {epost === "feil" && (
        <p className="admin-error">
          E-posten kunne ikke sendes. Sjekk at GMAIL_USER og GMAIL_APP_PASSWORD er satt i Netlify, eller kopier lenken og
          send den selv.
        </p>
      )}
      {epost === "mangler" && <p className="admin-error">Fant ingen e-postadresse for dette kjøpet.</p>}

      {purchases.length === 0 ? (
        <p className="body">{search ? "Ingen treff." : "Ingen salg ennå."}</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Dato</th>
                <th>Kunde</th>
                <th>Kjøp</th>
                <th className="num">Beløp</th>
                <th>Gyldig til</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => {
                const expired = p.expires_at <= now;
                const url = p.viewingToken ? `${env().SITE_URL}/watch/${p.viewingToken}` : null;
                return (
                  <tr key={p.id}>
                    <td>{formatDateNb(p.paid_at)}</td>
                    <td>{p.customer_email ?? "—"}</td>
                    <td>{p.video_title ? `Enkeltvideo: ${p.video_title}` : "Videopakke"}</td>
                    <td className="num">
                      {p.amount_total != null ? formatPrice({ price: p.amount_total, currency: "nok" }) : "—"}
                    </td>
                    <td>{formatDateNb(p.expires_at)}</td>
                    <td>
                      {p.payment_status === "refunded" ? (
                        <span className="pill pill-bad">Refundert</span>
                      ) : expired ? (
                        <span className="pill">Utløpt</span>
                      ) : (
                        <span className="pill pill-ok">Aktiv</span>
                      )}
                    </td>
                    <td className="admin-row-actions">
                      {url && p.payment_status === "paid" && <CopyLinkButton url={url} />}
                      {p.payment_status === "paid" && p.customer_email && (
                        <form action={resendLinkAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit" className="admin-link-btn" title={`Send lenken til ${p.customer_email}`}>
                            Send e-post
                          </button>
                        </form>
                      )}
                      {p.payment_status === "paid" && (
                        <form action={extendPurchaseAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit" className="admin-link-btn" title="Gi 6 nye måneder">
                            Forleng
                          </button>
                        </form>
                      )}
                      {p.stripe_payment_intent_id && (
                        <a href={`${stripeBase}/${p.stripe_payment_intent_id}`} target="_blank" rel="noreferrer">
                          Stripe ↗
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
