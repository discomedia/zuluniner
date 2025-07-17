# Claude Development Rules

This file contains important guidelines and conventions for this codebase that Claude should follow when making changes. Customised for the Discomedia ZuluNiner project.

Follow all these rules strictly, every time.

## Coding Standards

* Write ECMA2022 module TypeScript
* Check type files first in src/types. Use current types, or extend or create new ones as needed
* Never use 'any' or 'unknown' types; always use specific types
* Use `import` statements for modules, not `require`
* Follow coding principles: DRY (Don't Repeat Yourself), KISS (Keep It Simple Stupid), YAGNI (You Aren't Gonna Need It), and SOLID principles
* Check how functions/imports are used in other parts of the code for context
* Check type errors and fix them before finishing
* When naming percentage variables and functions, prefer scale 100, and use the naming convention `variableNamePercent100` if they're scale 100 (e.g. 75 = 75%), or `variableNamePercent1` if they're scale 1 (e.g. 0.75 = 75%)
* Always use string literals with inline variables: `log(\`The value is ${value}\`)`
* When logging dates, use locale en-US and timezone 'America/New_York' for consistency: `new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })`
* Don't use .env.local or .env.example etc. Just use .env.

## Import/Export Standards

**CRITICAL**: Always check existing component export patterns before importing

### UI Components (src/components/ui/*)
* All UI components use **default exports**
* Import pattern: `import Button from '@/components/ui/Button'`
* Never use: `import { Button } from '@/components/ui/Button'`

### Layout Components (src/components/layouts/*)
* All layout components use **default exports**
* Import pattern: `import ContainerLayout from '@/components/layouts/ContainerLayout'`
* Never use: `import { ContainerLayout } from '@/components/layouts/ContainerLayout'`

### Exception: Card Component
* Uses named exports: `import { Card, CardHeader, CardContent } from '@/components/ui/Card'`
* Usage: `<Card>`, `<CardHeader>`, `<CardContent>` (not `<Card.Header>`)

### Auth Libraries
* Client-side auth functions: `import { signIn, signUp } from '@/lib/auth'`
* Server-side auth functions: `import { requireAuth, getUser } from '@/lib/auth-server'`
* Never import server functions (`next/headers`, `redirect`) in client components

## Next.js App Router Standards

### Client Components
* Always use `'use client'` directive at the top of the file
* Wrap `useSearchParams()` in Suspense boundary to avoid SSR errors
* Pattern for search params:
```tsx
'use client';
import { Suspense } from 'react';

function ComponentWithSearchParams() {
  const searchParams = useSearchParams();
  // component logic
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComponentWithSearchParams />
    </Suspense>
  );
}
```

### Server Components
* Use for data fetching and authentication checks
* Can use server-side auth functions from `@/lib/auth-server`
* Can use `redirect()` from `next/navigation`

### Protected Routes
* Server-side: Use `requireAuth()` or `requireAdmin()` functions directly in page components
* Client-side: Wrap components with `<ProtectedRoute>` from `@/components/auth/ProtectedRoute`

## Supabase
* Use supabase client (`npx supabase`) to execute commands (to build out or edit the schema)
* For local development: Use `npm run supabase:start` to start Docker containers, `npm run supabase:stop` to stop them
* Run `npm run generate-schema` to update the schema in src/api/schema.ts from local database
* When updating the schema, create new convenience functions in src/api/db.ts to interact with the database
* Database migrations: Create new .sql files in supabase/migrations/ and run `npm run db:reset` to apply them
* Local development uses Docker containers - make sure Docker Desktop is running before starting Supabase
* Authentication: Use middleware for route protection, separate client/server auth functions
* Database migrations: Always test with `npm run db:reset` after creating new migrations

## Project Structure

### Source Directory (src/)
```
src/
├── api/                    # Supabase configuration
│   ├── supabase.ts        # Basic client setup
│   ├── schema.ts          # Generated TypeScript types
│   └── db.ts              # Database convenience functions
├── app/                   # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin-only pages
│   ├── dashboard/         # User dashboard
│   └── profile/           # User profile management
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── layouts/           # Layout components (default exports)
│   └── ui/                # UI components (default exports, except Card)
├── lib/                   # Utility libraries
│   ├── auth.ts            # Client-side auth functions
│   ├── auth-server.ts     # Server-side auth functions
│   └── utils.ts           # General utilities
└── types/                 # TypeScript type definitions
```

### Database Structure (supabase/)
```
supabase/
├── migrations/            # SQL migration files
│   ├── 20250717000001_initial_schema.sql
│   ├── 20250717000002_rls_policies.sql
│   ├── 20250717000003_storage_setup.sql
│   └── 20250717000004_auth_policies.sql
└── config.toml           # Supabase configuration
```

## Testing

For complex new features or revisions, write tests and execute them. Write test files in TypeScript in src/testing, with filenames like "new-feature-test.ts". Execute them with `npm run build && node src/testing/new-feature-test.js`.

## Build & Development Workflow

### Always Run Before Finishing
1. `npm run build` - Check for TypeScript errors and build issues
2. Fix any import/export errors immediately
3. Test authentication flows work properly
4. Verify protected routes are functioning

### Common Commands
* Start Supabase locally: `npm run supabase:start` (requires Docker Desktop)
* Stop Supabase locally: `npm run supabase:stop`
* Reset database with migrations: `npm run db:reset`
* Generate TypeScript types: `npm run generate-schema`
* Build and test: `npm run build && node src/testing/[test-file].ts`
* Type check: `npm run build` (includes type checking)

### Debugging Import Issues
1. Check the actual export pattern in the target file (default vs named)
2. Look at existing imports of the same component in other files
3. Remember: UI/Layout components = default exports, Card = named exports
4. Server-side auth must be in separate file from client-side auth

### Authentication Development Notes
* Middleware handles route protection automatically
* User profiles are created automatically via database triggers
* RLS policies are configured for all tables
* Admin role is protected at multiple levels (middleware, components, RLS)