import { NextResponse } from "next/server";

import schema from "./schema";
import { NextRouteContext, RequestHandler } from "@/middleware/types";
import { withBody } from "@/middleware/withBody";
import { withApiKey } from "@/middleware/withApiKey";
import { withEventRateLimit } from "@/middleware/withEventRateLimit";
import { withPaidAccess } from "@/middleware/withPaidAccess";

import { getLastEvent } from "@/lib/server/events";

import {
  updateBusinessStats,
  updateBusinessReviews,
} from "@/lib/server/google/update";
import {
  selectBusinessStats,
  selectBusinessReviews,
} from "@/lib/server/google/select";
import { userHasOwnership } from "@/lib/ownership";
import { businesses } from "@/schema/schema";

/**
 * Checks if reviews/stats need updating, updates if needed, then returns latest data. This endpoint is called by 11ty in the clients
 * website to ensure that their google reviews are updated any time the clients site is rebuilt.
 *
 * Rate limits:
 * - fetch_reviews: 100 calls per 24 hours (for this endpoint usage)
 *
 * @param { business_id: number } - The database ID of the business
 * @returns Latest reviews and stats for the business
 */
export const POST: RequestHandler<NextRouteContext> = withApiKey(
  withPaidAccess(
    withEventRateLimit(
      { event: "fetch_reviews", maxCalls: 100, timeWindowHours: 24 },
      withBody(schema, async (_, context) => {
        try {
          const { business_id } = context.body;

          await userHasOwnership(context.user_id, business_id, businesses);
          const oneDayAgo = new Date();
          oneDayAgo.setDate(oneDayAgo.getDate() - 1);

          // Check last update times
          const lastUpdateReviews = await getLastEvent(
            "update_reviews",
            context.user_id,
          );
          const lastUpdateStats = await getLastEvent(
            "update_stats",
            context.user_id,
          );

          // If data is out of date, fetch and update
          if (
            !lastUpdateReviews?.timestamp ||
            lastUpdateReviews.timestamp < oneDayAgo
          ) {
            await updateBusinessReviews(business_id);
          }

          if (
            !lastUpdateStats?.timestamp ||
            lastUpdateStats.timestamp < oneDayAgo
          ) {
            await updateBusinessStats(business_id);
          }

          // Get the data
          const [reviews, stats] = await Promise.all([
            selectBusinessReviews(business_id),
            selectBusinessStats(business_id),
          ]);

          const response = schema.response.parse({
            reviews: reviews.map((review) => ({
              ...review,
              datetime: review.datetime ? review.datetime.toISOString() : null,
            })),
            stats,
          });
          return NextResponse.json(response);
        } catch (error) {
          console.error("Error processing request:", error);
          return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
          );
        }
      }),
    ),
  ),
);
