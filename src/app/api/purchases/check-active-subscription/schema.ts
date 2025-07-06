import { z } from "zod";
import { stringDate, type APISchema } from "@/schema/types";

const schema = {
  url: "/api/purchases/check-active-subscription",
  request: z.undefined(),
  response: z.object({
    hasActiveSubscription: z.boolean(),
    // NOTE: subscriptionEnd is a date, but as it's returned from the server as serialized json,
    // it has to be a string which conforms to datetime format.
    subscriptionEnd: stringDate.optional(),
  }),
} satisfies APISchema;

export default schema;
