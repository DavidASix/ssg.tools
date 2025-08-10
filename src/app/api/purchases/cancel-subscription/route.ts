import "server-only";

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { NextRouteContext, RequestHandler } from "@/middleware/types";
import { withAuth } from "@/middleware/withAuth";
import { db } from "@/schema/db";
import { users } from "@/schema/schema";
import { stripe } from "@/lib/server/stripe";
import schema from "./schema";

/**
 * Cancel user's active subscriptions
 *
 * This endpoint cancels all active subscriptions for the authenticated user
 * on Stripe, but makes no changes to the database as per requirements.
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

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (!user.stripe_customer_id) {
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
      let cancelledCount = 0;
      const cancellationPromises = subscriptions.data.map(
        async (subscription) => {
          try {
            await stripe.subscriptions.cancel(subscription.id);
            cancelledCount++;
          } catch (error) {
            console.error(
              `Failed to cancel subscription ${subscription.id}:`,
              error,
            );
            throw error;
          }
        },
      );

      await Promise.all(cancellationPromises);

      const response = schema.response.parse({
        success: true,
        message: `Successfully cancelled ${cancelledCount} subscription(s)`,
        cancelledSubscriptions: cancelledCount,
      });

      return NextResponse.json(response);
    } catch (error) {
      console.error("Error cancelling subscription:", error);

      const response = schema.response.parse({
        success: false,
        message: "Failed to cancel subscription. Please try again later.",
        cancelledSubscriptions: 0,
      });

      return NextResponse.json(response, { status: 500 });
    }
  },
);
