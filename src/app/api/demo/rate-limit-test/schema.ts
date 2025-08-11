import { z } from "zod";
import type { APISchema } from "@/schema/types";

const schema = {
  url: "/api/demo/rate-limit-test",
  // No request body needed for this demo endpoint
  request: z.undefined(),
  // Response schema
  response: z.object({
    message: z.string(),
    userId: z.string(),
    eventCounts: z.object({
      fetchReviews: z.number(),
      updateReviews: z.number(),
    }),
  }),
} satisfies APISchema;

export default schema;