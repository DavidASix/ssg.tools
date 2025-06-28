import { z } from "zod";
import { productKeys } from "@/lib/products";
import type { APISchema } from "@/schema/types";

const schema = {
  url: "/api/purchases/initialize-checkout",
  request: z.object({
    product: z.enum(productKeys),
  }),
  response: z.object({
    session: z.any(), // Using `z.any()` to allow any Stripe session object
  }),
} satisfies APISchema;

export default schema;
