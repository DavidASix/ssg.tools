import { NextResponse } from "next/server";

import schema from "./schema";
import { NextRouteContext, RequestHandler } from "@/middleware/types";
import { withApiKey } from "@/middleware/withApiKey";
import { withEventRateLimit } from "@/middleware/withEventRateLimit";
import { countEventsInTimeWindow } from "@/lib/server/events";

/**
 * Demo endpoint showing multiple rate limits on a single endpoint.
 * This demonstrates the capability to chain multiple withEventRateLimit middlewares.
 *
 * Rate limits:
 * - fetch_reviews: 10 calls per 24 hours
 * - update_reviews: 3 calls per 24 hours
 *
 * This endpoint will be rejected if either rate limit is exceeded.
 */
export const GET: RequestHandler<NextRouteContext> = withApiKey(
  withEventRateLimit(
    { event: "fetch_reviews", maxCalls: 10, timeWindowHours: 24 },
    withEventRateLimit(
      { event: "update_reviews", maxCalls: 3, timeWindowHours: 24 },
      async (_, context) => {
        try {
          // Get current event counts for demonstration
          const [fetchReviewsCount, updateReviewsCount] = await Promise.all([
            countEventsInTimeWindow("fetch_reviews", context.user_id, 24),
            countEventsInTimeWindow("update_reviews", context.user_id, 24),
          ]);

          const response = schema.response.parse({
            message: "Rate limit test endpoint accessed successfully!",
            userId: context.user_id,
            eventCounts: {
              fetchReviews: fetchReviewsCount,
              updateReviews: updateReviewsCount,
            },
          });

          return NextResponse.json(response);
        } catch (error) {
          console.error("Error in rate limit test endpoint:", error);
          return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
          );
        }
      },
    ),
  ),
);
