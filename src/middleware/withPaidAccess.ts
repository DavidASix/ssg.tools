import { subscription_payments } from "@/schema/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/schema/db";
import { RequestHandler } from "./types";

/**
 * Middleware wrapper to ensure that the user has a paid subscription.
 * This middleware assumes that withAuth or withApiKey has been called first
 * to provide the user_id in the context.
 *
 * This middleware checks the subscription_payments table directly and ignores
 * the user.has_active_subscription field. It looks for any subscription where
 * the current time falls between subscription_start and subscription_end.
 *
 * @example
 * ```typescript
 * export const GET: RequestHandler<NextRouteContext> = withAuth(
 *   withPaidAccess(async (_, context) => {
 *     const { user_id } = context;
 *     // User has an active paid subscription
 *     return NextResponse.json({ message: "Access granted" });
 *   })
 * );
 * ```
 */
export function withPaidAccess<T extends object & { user_id: string }>(
  handler: RequestHandler<T>,
): RequestHandler<T> {
  return async function (req, context: T) {
    const { user_id } = context;

    try {
      const now = new Date();

      // Query for active subscription where current time is between start and end dates
      const [activeSubscription] = await db
        .select({
          id: subscription_payments.id,
        })
        .from(subscription_payments)
        .where(
          and(
            eq(subscription_payments.user_id, user_id),
            lte(subscription_payments.subscription_start, now),
            gte(subscription_payments.subscription_end, now),
          ),
        )
        .limit(1);

      if (!activeSubscription) {
        return NextResponse.json(
          { error: "Active subscription required" },
          { status: 403 },
        );
      }

      return handler(req, context);
    } catch (error) {
      console.error("Error checking paid access:", error);
      return NextResponse.json(
        { error: "Failed to check subscription status" },
        { status: 500 },
      );
    }
  };
}
