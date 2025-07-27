import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { api_keys } from "@/schema/schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

export async function up() {
  console.log("Seeding api_keys table...");

  await db.insert(api_keys).values({
    id: 1,
    key: "fd649f5db68597ef06e3cd0f6fb7e0bd:e164008ae19cd10fd54944e67814b4d8202a71690fb2921764645b58cf7b3a53b87e06978aa67d3db5f81f3a477e0755b5ad9e5ed5ba3433e804dd1d16e8686a5f0d1575f2e25a9fe7245c9755a4181d",
    user_id: "6506bac5-e63a-4fa3-b9c9-a94ab5a549fc",
    created_at: new Date("2025-07-06T18:45:58.716Z"),
    expired: false,
  });

  console.log("API keys seeded successfully");
}
