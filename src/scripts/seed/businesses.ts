import { db } from "@/schema/db";
import { businesses } from "@/schema/schema";

export async function up() {
  console.log("Seeding businesses table...");

  await db.insert(businesses).values({
    id: 0,
    user_id: "6506bac5-e63a-4fa3-b9c9-a94ab5a549fc",
    name: "UniClaw",
    place_id: "ChIJZVJixfH1K4gRm44apfuxMRg",
    address: "140 University Ave W Unit 1B, Waterloo, ON N2L 6J3, Canada",
  });

  console.log("Businesses seeded successfully");
}
