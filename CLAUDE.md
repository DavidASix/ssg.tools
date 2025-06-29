# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See @README.md for project overview and @package.json

## Development Commands

### Building and Testing
- `docker compose up` - Running this starts the server and runs npm run dev
- `npm run dev` - Start development server with Turbopack
- `npm run start` - Start production server
- `npm run build` - Build production version

### Code Quality
- `npm run check` - Run all checks (types, lint, format, tests)
- `npm run check:types` - TypeScript type checking
- `npm run check:lint` - ESLint checking
- `npm run check:format` - Prettier format checking
- `npm run test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run format` - Format code with Prettier

### Database Operations
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:clear` - Clear all database data
- `npm run db:fresh` - Clear database and run fresh migrations
- `npm run db:production:migrate` - Run production migrations. AI Models should NEVER DO THIS.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js v5 with email magic links
- **Styling**: Tailwind CSS with shadcn/ui components
- **Testing**: Vitest
- **Payments**: Stripe integration

### Project Structure

#### Core Application
- `src/app/` - Next.js App Router pages and API routes
  - `(product)/` - Product pages (requires auth)
  - `(site)/` - Public marketing/auth pages
  - `api/` - REST API endpoints with nested structure

#### Key Directories
- `src/components/` - React components organized by purpose:
  - `common/` - Shared business logic components
  - `magicui/` - UI animation components
  - `structure/` - Layout components (header, footer, navigation)
  - `ui/` - shadcn/ui base components
- `src/lib/` - Utility functions and shared logic
- `src/middleware/` - Request middleware (auth, API key validation, body parsing)
- `src/schema/` - Database schema and migrations

### Database Schema
Uses Drizzle ORM with PostgreSQL. A full table structure can be found in `src/schema/schema.ts`
- Generate migrations with `npm run db:generate`
- If you need a blank or custom migration, you can generate it with the command `npx drizzle-kit generate --custom --name=some-name`

### Authentication & Security
- **Session Auth**: NextAuth.js with magic link email authentication
- **API Auth**: Custom API key system with encrypted storage for access to programmatic endpoints.
- **Middleware**: `withAuth` for session-protected routes, `withApiKey` for API endpoints
- **Development**: Uses console logging for magic links instead of email sending

### Styling Conventions
Pages should use semantic `<section>` blocks with consistent layout:
```html
<section className="section section-padding">
    <div className="content">
        <!-- content here -->
    </div>
</section>
```
The inner div can use `content` or `content-wide` classes.

## Type-Safe API Request Pattern

This codebase uses a custom type-safe API request pattern. When implementing new API endpoints, follow this pattern for consistency and type safety.

### Implementation Steps

1. **Create API Schema** (`/api/endpoint/schema.ts`):
```typescript
import { z } from "zod";
import type { APISchema } from "@/schema/types";

const schema = {
  url: "/api/endpoint-name",
  // Define request body schema (use z.undefined() for GET)
  request: z.object({
  }),
  // Define response body schema
  response: z.object({
  }),
} satisfies APISchema;

export default schema;
```

2. **Implement Route Handler** (`/api/endpoint/route.ts`):
```typescript
import schema from "./schema";
import { withAuth } from "@/middleware/withAuth";
import { withBody } from "@/middleware/withBody"; // For POST/PUT

// GET request
export const GET = withAuth(async (_, context) => {
  // Implementation...
  const response = schema.response.parse(result);
  return NextResponse.json(response);
});

// POST request with body validation
export const POST = withAuth(
  withBody(schema, async (_, context) => {
    const { body } = context; // Typed and validated
    // Implementation...
    const response = schema.response.parse(result);
    return NextResponse.json(response);
  })
);
```

3. **Client-Side Usage**:
```typescript
import requests from "@/lib/requests";
import endpointSchema from "@/app/api/endpoint/schema";

// GET request
const data = await requests.get(endpointSchema);

// POST request
const result = await requests.post(endpointSchema, requestBody);
```

### Conventions
- Use `z.undefined()` for GET request schemas (no body)
- Always validate responses with `schema.response.parse()` before sending them to the client
- Import schema in both route handler and client code
- Use middleware (`withAuth`, `withBody`, `withApiKey`) for common functionality; These can be chained together.
- Export default schema from schema files

## Development Conventions

### Code Style

- Use `camelCase` except for database fields which are `snake_case` (due to SQL case-sensitivity)
- Prefer optional chaining: `address?.postalCode` over `address && address.postalCode`

### Type Safety Rules

- **Never use `any`** - use `unknown` instead if type is unknown
- **Avoid `as unknown as Type`** - indicates wrong approach
- **Avoid `as Type`** - also indicates wrong approach

## Tools

### Git

Never git push
When writing commit comments, don't indicate that the commit was generated by Claude. Do not mention Claude or that the code was not written by the user in the comments.
Your git comments should be short and to the point, maximum 2 sentences. Your code commits should be small enough that a detailed comment is not needed, as the code changes are self-explanatory. If your change is very advanced, you may write a long comment, but more likely you should be the commit up into smaller pieces.