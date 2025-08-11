import { NextResponse } from "next/server";
import { RequestHandler } from "./types";
import { countEventsInTimeWindow, recordEvent } from "@/lib/server/events";
import type { DBEvent, EventMetadata } from "@/schema/schema";

/**
 * Configuration for event rate limiting
 */
export interface EventRateLimitConfig {
  event: DBEvent;
  maxCalls: number;
  timeWindowHours: number;
  metadata?: EventMetadata;
}

/**
 * Middleware wrapper that implements rate limiting based on event tracking.
 * Checks if a user has exceeded the allowed number of calls for a specific event
 * within a given time window and rejects the request if the limit is exceeded.
 *
 * This middleware requires that the context includes a user_id property, so it should
 * be used with either withAuth or withApiKey middleware.
 *
 * @param config - Rate limiting configuration
 * @param config.event - The event type to track and limit
 * @param config.maxCalls - Maximum number of calls allowed within the time window
 * @param config.timeWindowHours - Time window in hours to check for rate limiting
 * @param config.metadata - Optional metadata to record with the event
 *
 * @example
 * ```typescript
 * export const POST: RequestHandler<NextRouteContext> = withApiKey(
 *   withEventRateLimit(
 *     { event: "fetch_reviews", maxCalls: 100, timeWindowHours: 24 },
 *     withBody(schema, async (_, context) => {
 *       const { user_id, body } = context;
 *       // Handler implementation...
 *       return NextResponse.json({ success: true });
 *     })
 *   )
 * );
 * ```
 */
export function withEventRateLimit<T extends object & { user_id: string }>(
  config: EventRateLimitConfig,
  handler: RequestHandler<T>,
): RequestHandler<T> {
  return async function (req, context: T) {
    const { user_id } = context;
    const { event, maxCalls, timeWindowHours, metadata = {} } = config;

    try {
      // Count how many times this event has been called by this user in the time window
      const eventCount = await countEventsInTimeWindow(
        event,
        user_id,
        timeWindowHours,
      );

      // Check if the user has exceeded the rate limit
      if (eventCount >= maxCalls) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            details: {
              event,
              maxCalls,
              timeWindowHours,
              currentCount: eventCount,
            },
          },
          { status: 429 },
        );
      }

      // Execute the handler
      const response = await handler(req, context);

      // If the handler succeeded (status < 400), record the event
      if (response.status < 400) {
        await recordEvent(event, user_id, metadata);
      }

      return response;
    } catch (error) {
      console.error("Error in withEventRateLimit middleware:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  };
}
