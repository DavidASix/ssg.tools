import { and, eq, desc, gte } from "drizzle-orm";

import { db } from "@/schema/db";
import type { EventMetadata, DBEvent } from "@/schema/schema";
import { events } from "@/schema/schema";

/**
 * Records an event in the database.
 *
 * @param event - The event type to record, this is a PG Enum
 * @param user_id - The ID of the user associated with the event.
 * @param metadata - Additional metadata related to the event.
 * @example
 * ```typescript
 * import { recordEvent } from "@/lib/server/events";
 * await recordEvent("update_stats", "user123", { business_id: "business456" });
 * ```
 */
export async function recordEvent(
  event: DBEvent,
  user_id: string,
  metadata: EventMetadata,
) {
  await db.insert(events).values({
    user_id,
    event: event,
    metadata,
  });
}

/**
 * Retrieves the last recorded event for a specific user.
 *
 * @param event - The event type to retrieve, this is a PG Enum
 * @param user_id - The ID of the user whose last event is being retrieved.
 * @returns The last event recorded for the user, or undefined if no events exist.
 * @example
 * ```typescript
 * import { getLastEvent } from "@/lib/server/events";
 * const lastEvent = await getLastEvent("update_stats", "user123");
 * console.log(lastEvent);
 * ```
 */
export async function getLastEvent(event: DBEvent, user_id: string) {
  const lastEvent = await db
    .select()
    .from(events)
    .where(and(eq(events.user_id, user_id), eq(events.event, event)))
    .orderBy(desc(events.timestamp))
    .limit(1)
    .then((rows) => rows[0]);

  return lastEvent;
}

/**
 * Counts the number of events of a specific type for a user within a time window.
 *
 * @param event - The event type to count, this is a PG Enum
 * @param user_id - The ID of the user whose events are being counted.
 * @param hoursAgo - Number of hours to look back from now.
 * @returns The count of events within the time window.
 * @example
 * ```typescript
 * import { countEventsInTimeWindow } from "@/lib/server/events";
 * const count = await countEventsInTimeWindow("fetch_reviews", "user123", 24);
 * console.log(`User made ${count} fetch_reviews calls in the last 24 hours`);
 * ```
 */
export async function countEventsInTimeWindow(
  event: DBEvent,
  user_id: string,
  hoursAgo: number,
): Promise<number> {
  const timeWindow = new Date();
  timeWindow.setHours(timeWindow.getHours() - hoursAgo);

  const result = await db
    .select()
    .from(events)
    .where(
      and(
        eq(events.user_id, user_id),
        eq(events.event, event),
        gte(events.timestamp, timeWindow),
      ),
    );

  return result.length;
}
