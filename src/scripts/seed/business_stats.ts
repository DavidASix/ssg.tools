import { db } from "@/schema/db";
import { business_stats } from "@/schema/schema";

export async function up() {
  console.log("Seeding business_stats table...");

  await db.insert(business_stats).values({
    business_id: 1,
    review_count: 218,
    review_score: 5,
    created_at: new Date("2025-07-27T04:22:08.603Z"),
  });

  console.log("Business stats seeded successfully");
}
