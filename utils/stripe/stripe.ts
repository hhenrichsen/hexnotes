import "server-only";
import { Stripe } from "stripe";

const { STRIPE_SECRET_KEY } = process.env;
if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY was not provided");
}

export const stripeClient = new Stripe(STRIPE_SECRET_KEY);
