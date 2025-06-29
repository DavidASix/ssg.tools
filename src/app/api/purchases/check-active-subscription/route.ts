import "server-only";

import { NextResponse } from "next/server";

import { NextRouteContext, RequestHandler } from "@/middleware/types";
import { withActiveSubscription } from "@/middleware/withActiveSubscription";
import { withAuth } from "@/middleware/withAuth";
import schema from "./schema";

/**
 * Check if the authenticated user has an active subscription
 *
 * This endpoint uses the withActiveSubscription middleware to determine
 * if the current user has a valid, active subscription
 */
export const GET: RequestHandler<NextRouteContext> = withAuth(
  withActiveSubscription(async (_, context) => {
    try {
      const { hasActiveSubscription, subscriptionEnd } = context.subscription;

      const response = schema.response.parse({
        hasActiveSubscription,
        subscriptionEnd: subscriptionEnd?.toISOString(),
      });

      return NextResponse.json(response);
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }),
);
