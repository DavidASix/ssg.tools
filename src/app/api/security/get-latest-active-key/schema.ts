import { z } from "zod";
import type { APISchema } from "@/schema/types";

const schema = {
  url: "/api/security/get-latest-active-key",
  request: z.undefined(),
  response: z.object({
    apiKey: z.string().nullable(),
  }),
} satisfies APISchema;

export default schema;
