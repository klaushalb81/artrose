import type { Metadata } from "next";
import Link from "next/link";
import CopyLinkButton from "@/components/CopyLinkButton";
import RefreshPoller from "@/components/RefreshPoller";
import { env } from "@/lib/env";
import { formatDateNb } from "@/lib/format";
import { getPurchaseByCheckoutSession } from "@/lib/purchases";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Betaling fullført | Artrosefysio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const SESSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9]+$/;

/**
 * /success?session_id=cs_...
 *
 * Stripe redirects here after Checkout. The URL alone proves nothing, so we:
 *   1. ask Stripe's API whether this session is actually paid, and
 *   2. show the viewing link only once the webhook has recorded the purchase.
 */
export default async function SuccessPage({ searchParams }: PageProps<"/success">) {
  const { session_id } = await searchParams;
  if (typeof session_id !== "string" || !SESSION_ID_PATTERN.test(session_id)) {
    return <Message title="Fant ikke betalingen." text="Lenken du brukte er ikke gyldig." />;
  }

  let paid: boolean;
  try {
    const session = await stripe().checkout.sessions.retrieve(session_id);
    paid = session.payment_status === "paid";
  } catch {
    return <Message title="Fant ikke betalingen." text="Lenken du brukte er ikke gyldig." />;
  }

  if (!paid) {
    return (
      <Message
        title="Betalingen er ikke fullført."
        text="Vi har ikke mottatt noen betaling for denne bestillingen. Du kan prøve igjen."
        action={
          <Link href="/videoer" className="btn btn-filled">
            Tilbake til videoene
          </Link>
        }
      />
    );
  }

  const purchase = await getPurchaseByCheckoutSession(session_id);

  if (!purchase) {
    // Paid according to Stripe, but the webhook hasn't landed yet. Poll a little.
    return (
      <>
        <RefreshPoller />
        <Message
          eyebrow="Betaling mottatt"
          title="Gjør klar videoen din …"
          text="Dette tar vanligvis bare noen sekunder. Siden oppdaterer seg selv. Hvis ingenting skjer innen ett minutt, send oss en e-post på artrosefysio@gmail.com, så ordner vi det."
        />
      </>
    );
  }

  const watchUrl = `${env().SITE_URL}/watch/${purchase.viewingToken}`;

  return (
    <section>
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="hero-eyebrow">
          <span className="stripe-inline"></span>
          <span className="label label-muted">Betaling fullført</span>
        </div>
        <h1 className="display-lg" style={{ marginBottom: 24 }}>
          Videoen din er klar.
        </h1>
        <p className="body" style={{ fontSize: 18, marginBottom: 32 }}>
          Takk for kjøpet av <strong style={{ color: "var(--ink)" }}>{purchase.videoTitle}</strong>.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 40 }}>
          <a href={watchUrl} className="btn btn-filled">
            Se videoen din <span className="arrow">→</span>
          </a>
          <CopyLinkButton url={watchUrl} />
        </div>

        <div className="callout" style={{ margin: 0 }}>
          <span className="label">Din personlige lenke</span>
          <p style={{ wordBreak: "break-all", fontFamily: "monospace", fontSize: 14 }}>{watchUrl}</p>
          <p style={{ marginTop: 16 }}>
            Lenken virker til og med <strong style={{ color: "var(--ink)" }}>{formatDateNb(purchase.expiresAt)}</strong>.
            Lagre den som bokmerke, eller send den til deg selv på e-post, så kan du se videoen så ofte du vil fram
            til da. Du trenger ikke passord eller innlogging.
          </p>
        </div>
      </div>
    </section>
  );
}

function Message({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow?: string;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <section>
      <div className="container" style={{ maxWidth: 760 }}>
        {eyebrow && (
          <div className="hero-eyebrow">
            <span className="stripe-inline"></span>
            <span className="label label-muted">{eyebrow}</span>
          </div>
        )}
        <h1 className="display-lg" style={{ marginBottom: 24 }}>
          {title}
        </h1>
        <p className="body" style={{ fontSize: 18, marginBottom: action ? 32 : 0 }}>
          {text}
        </p>
        {action}
      </div>
    </section>
  );
}
