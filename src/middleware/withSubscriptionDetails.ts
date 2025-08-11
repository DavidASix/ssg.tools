import { subscription_payments, users } from "@/schema/schema";
import { and, eq, gte, lte, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/schema/db";
import { auth } from "~/auth";
import { RequestHandler } from "./types";

type ActiveSubscriptionContext = {
  subscription: {
    hasActiveSubscription: boolean;
    subscriptionStart?: Date;
    subscriptionEnd?: Date;
  };
};

/**
 * Middleware wrapper to check the details of a users subscription.
 * This middleware assumes that withAuth or withApiKey has been called first
 * to provide the user_id in the context.
 *
 * A user can have a subscription start and end date while having a `hasActiveSubscription`
 * value of false; more details in the users table.
 *
 * @example
 * ```typescript
 * export const GET: RequestHandler<NextRouteContext> = withSubscriptionDetails(
 *   async (_, context) => {
 *     const { hasActiveSubscription, subscriptionEnd } = context.subscription;
 *     if (!hasActiveSubscription && new Date() < subscriptionEnd) {
 *       // User has a paid subscription which will not re-bill
 *     }
 *     return NextResponse.json({
 *       expiresAt: subscriptionEnd
 *     });
 *   }
 * );
 * ```
 */
export function withSubscriptionDetails<
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
      const [subscriptionDetails] = await db
        .select({
          subscription_start: subscription_payments.subscription_start,
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
        .orderBy(desc(subscription_payments.subscription_end))
        .limit(1);

      const [user] = await db
        .select({
          hasActiveSubscription: users.has_active_subscription,
        })
        .from(users)
        .where(eq(users.id, userId));

      const subscriptionEnd = subscriptionDetails?.subscription_end;
      const subscriptionStart = subscriptionDetails?.subscription_start;

      const newContext = {
        ...context,
        subscription: {
          hasActiveSubscription: user.hasActiveSubscription,
          subscriptionStart,
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
