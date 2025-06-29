import { z } from "zod";
import type { APISchema } from "@/schema/types";

const schema = {
  url: "/api/purchases/check-active-subscription",
  request: z.undefined(),
  response: z.object({
    hasActiveSubscription: z.boolean(),
    subscriptionEnd: z.date().optional(),
  }),
} satisfies APISchema;

export default schema;
