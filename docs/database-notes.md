
## Database Architecture: Type-Safe Supabase Integration

### Overview
ZuluNiner implements a fully type-safe database layer that eliminates direct Supabase usage throughout the application. All database operations go through centralized convenience functions in `src/api/db.ts`, providing consistent error handling, proper TypeScript integration, and maintainable data access patterns.

### Type-Safe Client Implementation

**Database API Structure**
```typescript
// Organized namespace API structure
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

### Type Safety Implementation

 Schema Type Integration**
- [**Generated types**: All operations use `Tables`, `TablesInsert`, `TablesUpdate` from generated schema
- **Nullable field handling**: Proper handling of database nullability (`string | null` vs `string | undefined`)
- **Return type definitions**: Custom types for joined data (`AircraftWithPhotos`, `AircraftWithUser`, etc.)
- **Type consistency**: Application types updated to match database schema exactly

 Error Handling & Safety**
- **Consistent error patterns**: All functions use try/catch with meaningful error messages
- **Transaction support**: Functions accept optional `SupabaseClient` parameter for server-side operations
- **Null safety**: Proper handling of nullable database fields throughout the application
- **Compile-time validation**: TypeScript catches schema mismatches at build time

### Usage Patterns

 Component Integration**
```typescript
// Correct usage - type-safe convenience functions
import { db } from '@/api/db';

const aircraft = await db.aircraft.getById(id);
const photoUrl = db.photos.getPhotoUrl(photo.storage_path);
const searchResults = await db.aircraft.search(filters, page, limit);

// ❌ Never allowed - direct supabase usage
import { supabase } from '@/api/supabase'; // This pattern eliminated
```

 Server-Side Operations**
```typescript
// API routes and server components
const supabase = await createServerSupabaseClient();
const aircraft = await db.aircraft.create(aircraftData, supabase);
const result = await db.aircraft.update(id, updates, supabase);
```

### Development Workflow

 Adding New Database Functions**

1. **Define return types** based on query structure and joins:
```typescript
type AircraftWithDetails = Tables<'aircraft'> & {
  photos: AircraftPhoto[];
  user: Pick<Tables<'users'>, 'name' | 'email'>;
};
```

2. **Create type-safe function** with proper error handling:
```typescript
async function getAircraftWithDetails(id: string): Promise<AircraftWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from('aircraft')
      .select(`*, photos:aircraft_photos(*), user:users(name, email)`)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in getAircraftWithDetails:', error);
    throw error;
  }
}
```

3. **Add to db namespace** and test:
```typescript
export const db = {
  aircraft: {
    // ... existing functions
    getWithDetails: getAircraftWithDetails,
  },
  // ... other namespaces
};
```
4. **Verify type safety** with `npm run build`

### Technical Standards

 Code Quality Requirements**
- **Schema alignment**: All application types match database schema nullability
- **Error boundaries**: Proper try/catch wrapping for all database operations
- **Client management**: Optional client parameters for server-side operations
- **Type exports**: No `any` or `unknown` types in database layer
- **Build verification**: All changes verified with `npm run build` before commit

 Future Development Guidelines**
- Always use `db.*` namespace functions instead of direct Supabase calls
- Define specific return types for complex joins and data structures
- Handle nullable database fields appropriately in component interfaces
- Pass authenticated Supabase clients for server-side operations
- Test new functions with TypeScript compiler before deployment

---

## Data Fetching Architecture: Server vs Client Components

### Production Issue Resolution

**Problem Identified**: Client-side Supabase requests were timing out in production (Vercel) while working fine locally, causing aircraft listings to not load.

**Root Cause**: Network connectivity issues between Vercel's edge functions and Supabase when making client-side requests.

**Solution**: Migrate data fetching from client components to server components for reliable database access.

### Server Component Pattern (Recommended)

 When to Use Server Components:**
- All database operations with Supabase
- Authentication state access
- SEO-critical content rendering
- Static content that doesn't require interactivity

 Server Component Implementation:**
```typescript
// CORRECT: Server component with database access
export default async function AircraftDetailPage({ params }: PageProps) {
  // Direct database access on server - always reliable
  const aircraft = await db.aircraft.getBySlug(params.slug);
  
  if (!aircraft) {
    notFound();
  }

  const primaryPhoto = aircraft.photos?.find(p => p.is_primary) || aircraft.photos?.[0];
  const photoUrl = primaryPhoto ? db.photos.getPhotoUrl(primaryPhoto.storage_path) : null;

  return (
    <div>
      <h1>{aircraft.title}</h1>
      {photoUrl && <Image src={photoUrl} alt={aircraft.title} />}
      {/* Server-rendered content */}
    </div>
  );
}
```

### Client Component Pattern (Interactive Only)

 When to Use Client Components:**
- User interactions (buttons, forms, search)
- Browser APIs (localStorage, router navigation)
- State management and event handlers
- Real-time updates and dynamic UI

 Client Component Implementation:**
```typescript
// CORRECT: Client component for interactivity only
'use client';

export default function SearchInterface({ children }: { children: ReactNode }) {
  const router = useRouter();
  
  const handleSearch = (query: string) => {
    router.push(`/aircraft?q=${encodeURIComponent(query)}`);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <Button onClick={() => handleNavigation('/aircraft')}>
        Browse
      </Button>
      {children}
    </>
  );
}
```

### Hybrid Architecture Pattern

 Optimal Pattern: Server Data + Client Interactivity**

**Main Page Structure:**
```typescript
// Server component: Data fetching and SEO
export default async function HomePage() {
  console.log('🔄 Starting to fetch featured aircraft...');
  
  let featuredAircraft = [];
  
  try {
    // Server-side database access - reliable in production
    const result = await db.aircraft.search({}, 1, 3);
    featuredAircraft = result.aircraft;
    console.log('✅ Featured aircraft loaded:', featuredAircraft.length);
  } catch (error) {
    console.error('❌ Error fetching featured aircraft:', error);
  }

  return (
    <MainLayout>
      <HomePageClient>
        {/* Server-rendered content with real data */}
        <section className="bg-neutral-50">
          <div className="py-20">
            {featuredAircraft.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-neutral-600">No planes available right now :(</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {featuredAircraft.map((aircraft) => {
                  const primaryPhoto = aircraft.photos?.find(p => p.is_primary) || aircraft.photos?.[0];
                  const photoUrl = primaryPhoto?.storage_path ? 
                    db.photos.getPhotoUrl(primaryPhoto.storage_path) : null;
                  
                  return (
                    <Link key={aircraft.id} href={`/aircraft/${aircraft.slug}`}>
                      <Card>
                        {photoUrl && <Image src={photoUrl} alt={aircraft.title} />}
                        <CardHeader>
                          <CardTitle>{aircraft.make} {aircraft.model}</CardTitle>
                          <CardDescription>{aircraft.year} • {aircraft.hours || 'TBD'} TT</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </HomePageClient>
    </MainLayout>
  );
}
```

**Client Wrapper Component:**
```typescript
// Client component: Interactive elements wrapper
'use client';

export default function HomePageClient({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/aircraft?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/aircraft');
    }
  };

  return (
    <>
      {/* Hero Section with Interactive Elements */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="text-center">
          <h1>Find Your Perfect Aircraft</h1>
          <SearchBar onSearch={handleSearch} />
          <Button onClick={() => router.push('/aircraft')}>
            Browse
          </Button>
        </div>
      </section>

      {/* Server-rendered content passed as children */}
      {children}
    </>
  );
}
```

### Production vs Development Behavior

 Why This Pattern Prevents Production Issues:**

1. **Server-Side Reliability**: Database operations happen on Vercel's servers, which have reliable connectivity to Supabase
2. **Client-Side Limitations**: Browser clients can experience network timeouts, especially from edge locations
3. **Build-Time Optimization**: Server components can be pre-rendered during build, improving performance
4. **SEO Benefits**: Content is available immediately without JavaScript execution

 Working Examples in Codebase:**
- **Aircraft Detail Pages** (`/src/app/aircraft/[slug]/page.tsx`): Server component pattern - works in production
- **Admin Pages** (`/src/app/admin/*/page.tsx`): Server component pattern - works in production  
- **Main Page** (after fix): Hybrid pattern - server data + client interactivity

 Anti-Patterns to Avoid:**
```typescript
// ❌ PROBLEMATIC: Client-side database fetching
'use client';
export default function ProblematicPage() {
  const [aircraft, setAircraft] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // This pattern causes timeouts in production
    const fetchData = async () => {
      try {
        const result = await db.aircraft.search({}, 1, 3);
        setAircraft(result.aircraft);
      } catch (error) {
        console.error('Error:', error); // "Query timeout after 15 seconds"
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return <div>{/* UI that fails to load in production */}</div>;
}
```

### Implementation Guidelines

**Development Standards:**

1. **Default to Server Components**: Use server components unless interactivity is specifically needed
2. **Data Fetching Location**: Always fetch data server-side using `async` component functions
3. **Client Boundaries**: Create explicit client component boundaries with `'use client'` directive
4. **Props Pattern**: Pass server-fetched data to client components via props
5. **Error Boundaries**: Handle database errors in server components with proper fallbacks

**Migration Approach:**
1. Identify client components doing database operations
2. Extract data fetching to parent server component
3. Pass data as props to client component
4. Verify functionality in both development and production

This architecture ensures reliable data loading across all deployment environments while maintaining the interactive user experience expected in modern web applications.
