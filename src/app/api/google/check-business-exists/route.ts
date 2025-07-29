import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

import schema from "./schema";
import { NextRouteContext, RequestHandler } from "@/middleware/types";
import { withAuth } from "@/middleware/withAuth";
import { withBody } from "@/middleware/withBody";
import { db } from "@/schema/db";
import { businesses } from "@/schema/schema";

export const POST: RequestHandler<NextRouteContext> = withAuth(
  withBody(schema, async (_, context) => {
    try {
      const { place_id } = context.body;

      const [existingBusiness] = await db
        .select({ id: businesses.id })
        .from(businesses)
        .where(
          and(
            eq(businesses.place_id, place_id),
            eq(businesses.user_id, context.user_id),
          ),
        )
        .limit(1);

      const response = schema.response.parse({
        business_id: existingBusiness?.id || null,
      });

      return NextResponse.json(response);
    } catch (error) {
      console.error("Error checking business existence:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }),
);
