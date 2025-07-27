import { db } from "@/schema/db";
import { events } from "@/schema/schema";

export async function up() {
  console.log("Seeding events table...");

  await db.insert(events).values([
    {
      id: 0,
      event: "update_reviews",
      user_id: "6506bac5-e63a-4fa3-b9c9-a94ab5a549fc",
      metadata: { business_id: 0 },
      timestamp: new Date("2025-07-27T04:22:09.499Z"),
    },
    {
      id: 1,
      event: "update_stats",
      user_id: "6506bac5-e63a-4fa3-b9c9-a94ab5a549fc",
      metadata: { business_id: 0 },
      timestamp: new Date("2025-07-27T04:22:09.502Z"),
    },
  ]);

  console.log("Events seeded successfully");
}
