import "server-only";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import schema from "./schema";
import { NextRouteContext, RequestHandler } from "@/middleware/types";
import { withAuth } from "@/middleware/withAuth";

import { api_keys } from "@/schema/schema";
import { db } from "@/schema/db";
import { generateApiKey } from "@/lib/server/api-keys";
import { withSubscriptionDetails } from "@/middleware/withSubscriptionDetails";

export const GET: RequestHandler<NextRouteContext> = withAuth(
  withSubscriptionDetails(async (_, context) => {
    const { user_id, subscription } = context;
    if (!subscription.hasActiveSubscription) {
      return NextResponse.json(
        { error: "Active subscription required" },
        { status: 403 },
      );
    }
    try {
      await db
        .update(api_keys)
        .set({ expired: true })
        .where(eq(api_keys.user_id, user_id));

      const key = await generateApiKey(user_id);

      schema.response.parse({ key });
      return NextResponse.json({ key }, { status: 200 });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }),
);
