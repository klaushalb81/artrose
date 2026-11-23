import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getVideoPackage } from "@/lib/package";
import { stripe } from "@/lib/stripe";
import { listActiveVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

/** Marks our Checkout Sessions so the webhook knows what was bought. */
const PACKAGE_PRODUCT = "video_package";

/**
 * Version of the consent text shown next to the buy button on /videoer. The consent
 * (start delivery now, right of withdrawal lapses — angrerettloven § 22 bokstav n)
 * is stored on the Stripe payment and repeated in the order e-mail.
 */
const CONSENT_VERSION = "angrerett-digitalt-innhold-v1";

/**
 * POST /api/checkout  (plain HTML form submit; field "samtykke" = "ja" is required)
 *
 * Creates a Stripe Checkout Session for the video package (6 months of access to
 * all videos) and redirects the customer to Stripe. Name and price always come
 * from our database, never from the form.
 */
export async function POST(request: Request) {
  let consented = false;
  try {
    consented = (await request.formData()).get("samtykke") === "ja";
  } catch {
    // fall through: treated as not consented
  }
  if (!consented) {
    return NextResponse.redirect(new URL("/videoer?feil=samtykke", env().SITE_URL), 303);
  }

  try {
    const [pkg, videos] = await Promise.all([getVideoPackage(), listActiveVideos()]);
    if (videos.length === 0) {
      return NextResponse.redirect(new URL("/videoer?feil=ingen", env().SITE_URL), 303);
    }

    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      locale: "nb",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: pkg.currency,
            unit_amount: pkg.price,
            product_data: {
              name: pkg.title,
              description: pkg.description || undefined,
            },
          },
        },
      ],
      metadata: {
        product: PACKAGE_PRODUCT,
        consent: CONSENT_VERSION,
        consent_at: new Date().toISOString(),
      },
      // {CHECKOUT_SESSION_ID} is substituted by Stripe. The success page verifies
      // the session with Stripe's API; it never trusts the URL alone.
      success_url: `${env().SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env().SITE_URL}/videoer`,
    });

    if (!session.url) throw new Error("Stripe did not return a Checkout URL");
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("[checkout] failed to create Stripe session", error);
    return NextResponse.redirect(new URL("/videoer?feil=betaling", env().SITE_URL), 303);
  }
}
