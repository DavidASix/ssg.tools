import "server-only";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import schema from "./schema";
import { NextRouteContext, RequestHandler } from "@/middleware/types";
import { withAuth } from "@/middleware/withAuth";
import { withBody } from "@/middleware/withBody";

import { stripe } from "@/lib/server/stripe";
import { products } from "@/lib/products";

const { DOMAIN } = process.env;

/**
 * This endpoint initializes a Stripe Checkout session and returns the session details to the client
 * the client then uses the stripe.js library to redirect the user to the Stripe Checkout page
 * After the user completes the payment, a webhook event is sent to the server and the user is
 * redirected to the success or failure page based on the payment status.
 */
export const POST: RequestHandler<NextRouteContext> = withAuth(
  withBody(schema, async (_, context) => {
    try {
      const { body } = context;
      const product = products[body.product];

      const params: Stripe.Checkout.SessionCreateParams = {
        success_url: `${DOMAIN}/subscription/?status=success&product=${body.product}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${DOMAIN}/subscription/?status=fail&product=${body.product}&session_id={CHECKOUT_SESSION_ID}`,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: product.price_id,
            quantity: 1,
          },
        ],
        metadata: {
          app_user_id: context.user_id,
        },
      };

      const session = await stripe.checkout.sessions.create(params);

      const response = schema.response.parse({ session });
      return NextResponse.json(response, { status: 200 });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }),
);
