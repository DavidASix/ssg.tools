import "server-only";

import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_fake";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-04-30.basil",
});
