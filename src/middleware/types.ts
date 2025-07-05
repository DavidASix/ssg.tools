import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Base interface for the context passed to request handlers. The context of a route
 * is built on top of this interface, adding params based on which middleware is used.
 */
export interface NextRouteContext {
  params: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Type for request handlers in the Next.js middleware.
 * It takes a NextRequest and a context of type T, returning a Promise of NextResponse.
 * @example
 * ```typescript
 * export const GET: RequestHandler<NextRouteContext> = 
 *  withBody(withAuth(
 *    async (_, context) => {
 *      const { user_id, body } = context;
 *      console.log({ user_id, body });
 *      return NextResponse.json({ message: "Hello World!" });
 *    }
 *  ));
 * ```
}
 */
export type RequestHandler<T> = (
  req: NextRequest,
  context: T,
) => Promise<NextResponse>;
