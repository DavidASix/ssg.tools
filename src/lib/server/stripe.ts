import "server-only";

import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Guard check added to avoid failing builds which don't have the environment variable set
if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY is not set in the environment variables.");
  throw new Error("Stripe environment variable is required");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-04-30.basil",
});
