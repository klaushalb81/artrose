import "server-only";
import Stripe from "stripe";
import { env } from "./env";

let client: Stripe | undefined;

export function stripe(): Stripe {
  if (!client) {
    client = new Stripe(env().STRIPE_SECRET_KEY, {
      typescript: true,
      appInfo: { name: "artrosefysio-video" },
    });
  }
  return client;
}
