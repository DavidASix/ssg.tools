import { NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";

import schema from "./schema";
import { withAuth } from "@/middleware/withAuth";
import { NextRouteContext, RequestHandler } from "@/middleware/types";

import { api_keys } from "@/schema/schema";
import { db } from "@/schema/db";
import { decrypt } from "@/lib/encryption";

export const GET: RequestHandler<NextRouteContext> = withAuth(
  async (_, context) => {
    const { user_id } = context;
    try {
      const [apiKey] = await db
        .select()
        .from(api_keys)
        .where(and(eq(api_keys.user_id, user_id), eq(api_keys.expired, false)))
        .orderBy(desc(api_keys.created_at));
      const decryptedKey = apiKey ? await decrypt(apiKey?.key || "") : null;
      const response = schema.response.parse({
        apiKey: decryptedKey,
      });
      return NextResponse.json(response, { status: 200 });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  },
);
