import "dotenv/config";
import * as userSeed from "./user";
import * as accountSeed from "./account";
import * as sessionSeed from "./session";
import * as verificationTokenSeed from "./verificationToken";
import * as authenticatorSeed from "./authenticator";
import * as businessesSeed from "./businesses";
import * as reviewsSeed from "./reviews";
import * as businessStatsSeed from "./business_stats";
import * as eventsSeed from "./events";
import * as apiKeysSeed from "./api_keys";
import * as subscriptionPaymentsSeed from "./subscription_payments";

const seedModules = [
  userSeed,
  accountSeed,
  sessionSeed,
  verificationTokenSeed,
  authenticatorSeed,
  businessesSeed,
  reviewsSeed,
  businessStatsSeed,
  eventsSeed,
  apiKeysSeed,
  subscriptionPaymentsSeed,
];

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    for (const seedModule of seedModules) {
      await seedModule.up();
    }

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Unexpected error during seeding:", error);
  process.exit(1);
});
