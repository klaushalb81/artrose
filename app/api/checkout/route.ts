import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { getActiveVideo, videoIdSchema } from "@/lib/videos";

export const dynamic = "force-dynamic";

/**
 * POST /api/checkout  (plain HTML form submit: field "videoId")
 *
 * Creates a Stripe Checkout Session for one video and redirects the customer to
 * Stripe. Price and currency always come from our database, never from the form.
 */
export async function POST(request: Request) {
  let videoId: string;
  try {
    const form = await request.formData();
    videoId = videoIdSchema.parse(form.get("videoId"));
  } catch {
    return NextResponse.redirect(new URL("/videoer?feil=ugyldig", env().SITE_URL), 303);
  }

  const video = await getActiveVideo(videoId);
  if (!video) {
    return NextResponse.redirect(new URL("/videoer?feil=ugyldig", env().SITE_URL), 303);
  }

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      locale: "nb",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: video.currency,
            unit_amount: video.price,
            product_data: {
              name: video.title,
              description: video.description || undefined,
            },
          },
        },
      ],
      // The webhook uses this to know which video was bought.
      metadata: { video_id: video.id },
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
