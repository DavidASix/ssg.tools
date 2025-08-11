import "server-only";

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import schema from "./schema";
import { NextRouteContext, RequestHandler } from "@/middleware/types";
import { withAuth } from "@/middleware/withAuth";
import { db } from "@/schema/db";
import { users } from "@/schema/schema";
import { stripe } from "@/lib/server/stripe";
import type Stripe from "stripe";

/**
 * Cancel all provided subscriptions and return the count of successfully cancelled subscriptions
 */
async function cancelAllSubscriptions(
  subscriptions: Stripe.Subscription[],
): Promise<number> {
  let cancelledCount = 0;

  for (const subscription of subscriptions) {
    try {
      await stripe.subscriptions.cancel(subscription.id);
      cancelledCount++;
    } catch (error) {
      console.error(`Failed to cancel subscription ${subscription.id}:`, error);
      throw error;
    }
  }

  return cancelledCount;
}

/**
 * Cancel user's active subscriptions
 *
 * This endpoint cancels all active subscriptions for the authenticated user
 * on Stripe.
 */
export const POST: RequestHandler<NextRouteContext> = withAuth(
  async (_, context) => {
    try {
      const { user_id } = context;

      // Get user's Stripe customer ID
      const [user] = await db
        .select({ stripe_customer_id: users.stripe_customer_id })
        .from(users)
        .where(eq(users.id, user_id))
        .limit(1);

      if (!user?.stripe_customer_id) {
        return NextResponse.json(
          { error: "No Stripe customer ID found for user" },
          { status: 400 },
        );
      }

      // Get all active subscriptions for this customer
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripe_customer_id,
        status: "active",
      });

      if (subscriptions.data.length === 0) {
        const response = schema.response.parse({
          success: true,
          message: "No active subscriptions found to cancel",
          cancelledSubscriptions: 0,
        });
        return NextResponse.json(response);
      }

      // Cancel all active subscriptions
      const cancelledCount = await cancelAllSubscriptions(subscriptions.data);

      const response = schema.response.parse({
        success: true,
        message: `Successfully cancelled ${cancelledCount} subscription(s)`,
        cancelledSubscriptions: cancelledCount,
      });

      return NextResponse.json(response);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  },
);
