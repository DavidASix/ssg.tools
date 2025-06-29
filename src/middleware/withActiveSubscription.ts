import { subscription_payments } from "@/schema/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/schema/db";
import { auth } from "~/auth";
import { RequestHandler } from "./types";

type ActiveSubscriptionContext = {
  subscription: {
    hasActiveSubscription: boolean;
    subscriptionEnd?: Date;
  };
};

/**
 * Middleware wrapper to check if the user has an active subscription.
 * This middleware assumes that withAuth or withApiKey has been called first
 * to provide the user_id in the context.
 *
 * It checks the subscription_payments table for any record where the current
 * date falls between subscription_start and subscription_end (inclusive).
 *
 * @example
 */
export function withActiveSubscription<
  T extends object & {
    subscription?: never;
  },
>(handler: RequestHandler<T & ActiveSubscriptionContext>): RequestHandler<T> {
  return async function (req, context: T) {
    // Get the auth session
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const now = new Date();

      // Query for active subscription where current time is between start and end dates
      // Using timezone-aware comparison since our timestamps include timezone info
      const [activeSubscription] = await db
        .select({
          subscription_end: subscription_payments.subscription_end,
        })
        .from(subscription_payments)
        .where(
          and(
            eq(subscription_payments.user_id, userId),
            lte(subscription_payments.subscription_start, now),
            gte(subscription_payments.subscription_end, now),
          ),
        )
        .orderBy(subscription_payments.subscription_end) // Get the latest ending subscription
        .limit(1);

      const hasActiveSubscription = !!activeSubscription;
      const subscriptionEnd = activeSubscription?.subscription_end;

      const newContext = {
        ...context,
        subscription: {
          hasActiveSubscription,
          subscriptionEnd,
        },
      };

      return handler(req, newContext as T & ActiveSubscriptionContext);
    } catch (error) {
      console.error("Error checking active subscription:", error);
      return NextResponse.json(
        { error: "Failed to check subscription status" },
        { status: 500 },
      );
    }
  };
}
