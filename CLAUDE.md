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

## Supabase Database Layer

### Schema and Type Generation
* Use supabase client (`npx supabase`) to execute commands (to build out or edit the schema)
* Run `npm run generate-schema` to update the schema in src/api/schema.ts from production database
* Database migrations: Create new .sql files in supabase/migrations/ and run `npm run db:push` to apply them to production
* Authentication: Use middleware for route protection, separate client/server auth functions
* Database migrations: Always test schema changes carefully as they apply directly to production

### Type-Safe Client Initialization
**CRITICAL**: Always initialize Supabase clients with the Database schema type for full type safety:

```ts
// src/api/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './schema';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// For server clients
export const createServiceRoleClient = () => {
  return createClient<Database>(supabaseUrl, serviceRoleKey);
};
```

### Database Convenience Functions
**NEVER reference supabase directly in components or other files.** Always use the convenience functions defined in `src/api/db.ts`.

#### Function Structure
Organize database functions by entity with proper TypeScript types:

```ts
// Define specific return types
type AircraftWithPhotos = Tables<'aircraft'> & {
  photos: AircraftPhoto[];
  user?: Pick<Tables<'users'>, 'name' | 'phone' | 'email'> | null;
};

// Create type-safe functions
async function getAircraftById(id: string): Promise<AircraftWithPhotos | null> {
  try {
    const { data: aircraftData, error: aircraftError } = await supabase
      .from('aircraft')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (aircraftError) throw aircraftError;
    if (!aircraftData) return null;

    // Additional related data queries...
    
    return {
      ...aircraftData,
      photos: photosData || [],
      user: userData || null
    };
  } catch (error) {
    console.error('Error in getAircraftById:', error);
    throw error;
  }
}

// Export structured API
export const db = {
  aircraft: {
    getById: getAircraftById,
    getBySlug: getAircraftBySlug,
    search: searchAircraft,
    create: createAircraft,
    update: updateAircraft,
    getAll: getAllAircraft,
    getUserAircraft: getUserAircraft,
  },
  photos: {
    getAircraftPhotos: getAircraftPhotos,
    uploadAircraftPhoto: uploadAircraftPhoto,
    uploadMultipleAircraftPhotos: uploadMultipleAircraftPhotos,
    getPhotoUrl: getPhotoUrl,
  },
  users: {
    getById: getUserById,
    getProfile: getUserProfile,
    updateProfile: updateUserProfile,
    getCount: getUserCount,
  },
  blog: {
    getPosts: getBlogPosts,
    getPost: getBlogPost,
  },
};
```

#### Type Safety Requirements
1. **Use Database schema types**: Import `Tables`, `TablesInsert`, `TablesUpdate` from `./schema`
2. **Create specific return types**: Define clear interfaces for joined data
3. **Handle nullable fields**: Match database schema nullability (`string | null` vs `string | undefined`)
4. **Error handling**: Always wrap in try/catch with meaningful error messages
5. **Client parameter**: Accept optional `SupabaseClient` parameter for server-side operations

#### Adding New Functions
When adding new database functions:

1. **Define the return type** based on your query structure
2. **Create the async function** with proper error handling
3. **Add to the appropriate `db` namespace** (aircraft, users, photos, etc.)
4. **Update `src/types/index.ts`** if new interfaces are needed
5. **Test with `npm run build`** to ensure type safety

#### Usage in Components
```ts
// ✅ Correct - use db convenience functions
import { db } from '@/api/db';

const aircraft = await db.aircraft.getById(id);
const photoUrl = db.photos.getPhotoUrl(photo.storage_path);

// ❌ Never do this - direct supabase usage
import { supabase } from '@/api/supabase';
const { data } = await supabase.from('aircraft').select('*');
```

#### Server-Side Usage
For server components and API routes, pass the authenticated client:

```ts
// API routes
const supabase = await createServerSupabaseClient();
const aircraft = await db.aircraft.create(aircraftData, supabase);

// Server components
const supabase = await createServerSupabaseClient();
const result = await db.aircraft.search(filters, 1, 20);
```

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

## Data Fetching Architecture

### Server Components vs Client Components

**CRITICAL**: Use server components for data fetching to avoid network connectivity issues between client-side and Supabase.

#### Server Components (Recommended for Data Fetching)
Use server components when:
- Fetching data from Supabase
- Accessing authentication state
- SEO optimization needed
- No client-side interactivity required

```typescript
// ✅ Server component pattern (works in production)
export default async function AircraftPage({ params }: { params: { slug: string } }) {
  // Direct database access on server
  const aircraft = await db.aircraft.getBySlug(params.slug);
  
  if (!aircraft) {
    notFound();
  }

  return (
    <div>
      <h1>{aircraft.title}</h1>
      {/* Static content */}
    </div>
  );
}
```

#### Client Components (Interactive Elements Only)
Use client components for:
- User interactions (buttons, forms, modals)
- Browser APIs (localStorage, geolocation)
- State management
- Event handlers

```typescript
// ✅ Client component pattern (interactive wrapper)
'use client';

export default function InteractiveWrapper({ children, initialData }: Props) {
  const [state, setState] = useState(initialData);
  
  const handleClick = () => {
    // Client-side logic
  };

  return (
    <div>
      <button onClick={handleClick}>Interactive Button</button>
      {children}
    </div>
  );
}
```

#### Hybrid Pattern (Server + Client)
For pages needing both data and interactivity:

```typescript
// ✅ Main page: Server component with data
export default async function HomePage() {
  const featuredAircraft = await db.aircraft.search({}, 1, 3);
  
  return (
    <MainLayout>
      <HomePageClient>
        {/* Server-rendered content with data */}
        <AircraftGrid aircraft={featuredAircraft} />
      </HomePageClient>
    </MainLayout>
  );
}

// ✅ Client wrapper: Interactive elements
'use client';
export default function HomePageClient({ children }: { children: ReactNode }) {
  const router = useRouter();
  
  const handleSearch = (query: string) => {
    router.push(`/aircraft?q=${query}`);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      {children}
    </>
  );
}
```

### Network Connectivity Issues

**Problem**: Client-side Supabase requests can timeout in production (Vercel) due to network issues.

**Solution**: Always fetch data server-side and pass to client components as props.

```typescript
// ❌ Problematic client-side fetching
'use client';
export default function ProblematicPage() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // This can timeout in production
    db.aircraft.search().then(setData);
  }, []);
}

// ✅ Fixed server-side fetching
export default async function FixedPage() {
  // Always works - server has reliable Supabase connection
  const data = await db.aircraft.search();
  
  return <ClientComponent initialData={data} />;
}
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
* Generate TypeScript types: `npm run generate-schema` (from production database)
* Push schema changes to production: `npm run db:push`
* Pull schema from production: `npm run db:pull`
* Check migration status: `npm run db:status`
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