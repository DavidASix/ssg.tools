import { z } from "zod";
import type { APISchema } from "@/schema/types";

const schema = {
  url: "/api/purchases/cancel-subscription",
  request: z.undefined(), // No request body needed
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    cancelledSubscriptions: z.number(), // Number of subscriptions cancelled
  }),
} satisfies APISchema;

export default schema;