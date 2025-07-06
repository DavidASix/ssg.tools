import { z, type ZodTypeAny } from "zod";

/**
 * Defines the structure of an API schema, including the URL, request schema, and response schema.
 * This type is is exports from an `/api/endpoint/schema.ts` file, and imported into the `/api/endpoint/route.ts` file
 * and the client-side code that interacts with the API. This ensures that both the server and client are aware of the
 * expected request and response formats.
 */
export type APISchema<
  TRequestSchema extends ZodTypeAny = ZodTypeAny,
  TResponseSchema extends ZodTypeAny = ZodTypeAny,
> = {
  url: string;
  request: TRequestSchema;
  response: TResponseSchema;
};

export const stringDate = z
  .string()
  .datetime()
  .transform((str) => new Date(str));
