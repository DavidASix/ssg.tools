import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { NextRouteContext, RequestHandler } from "@/middleware/types";
import { withAuth } from "@/middleware/withAuth";
import { db } from "@/schema/db";
import { business_stats, businesses } from "@/schema/schema";

import schema from "./schema";

export const GET: RequestHandler<NextRouteContext> = withAuth(
  async (_, context) => {
    const { user_id } = context;

    const userBusinesses = await db
      .select({
        id: businesses.id,
        name: businesses.name,
        place_id: businesses.place_id,
        address: businesses.address,
        stats: {
          review_count: business_stats.review_count,
          review_score: business_stats.review_score,
        },
      })
      .from(businesses)
      .leftJoin(business_stats, eq(businesses.id, business_stats.business_id))
      .where(eq(businesses.user_id, user_id));

    const response = schema.response.parse({
      businesses: userBusinesses,
    });

    return NextResponse.json(response);
  },
);
