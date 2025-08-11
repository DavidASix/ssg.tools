import { z } from "zod";
import { stringDate, type APISchema } from "@/schema/types";

const schema = {
  url: "/api/purchases/get-subscription-details",
  request: z.undefined(),
  response: z.object({
    hasActiveSubscription: z.boolean(),
    // NOTE: subscriptionEnd is a date, but as it's returned from the server as serialized json,
    // it has to be a string which conforms to datetime format.
    subscriptionStart: stringDate.optional(),
    subscriptionEnd: stringDate.optional(),
  }),
} satisfies APISchema;

export default schema;
