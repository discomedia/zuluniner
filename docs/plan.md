# ZuluNiner MVP Development Plan

## Project Overview
ZuluNiner (zuluniner.com) is an aircraft marketplace built with Next.js, React, Tailwind CSS, TypeScript, and Supabase. The platform enables aircraft listings, search/filtering, photo galleries, and blog content with a custom CMS.

**Target Audience**: Aircraft community (primarily older men) - design must evoke trust and reliability.

## Core Project Data
- **Project Name**: ZuluNiner
- **Supabase project ID**: bjwlldxavgoxhyyufffy (production Supabase Cloud project)
- **Local Development**: Docker-based Supabase for development
- **GitHub Repository**: [discomedia/zuluniner](https://github.com/discomedia/zuluniner)
- **Domain**: zuluniner.com (DNS managed via Cloudflare)

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage, Type-safe functions). Use Docker for local development with `npm run supabase:start/stop`. Create migrations in supabase/migrations/ and apply with `npm run db:reset`.
- **Deployment**: Vercel (Next.js frontend) + Supabase Cloud (backend services)
- **Content Generation**: @discomedia/utils package for LLM integration
- **Image Processing**: Next.js Image Optimization + Supabase Storage

## Architecture Notes

### Key Technical Decisions
1. **App Router**: Using Next.js 14+ App Router for improved performance and SEO
2. **Type Safety**: Full TypeScript integration with Supabase-generated types
3. **Image Strategy**: Supabase Storage + Next.js Image optimization
4. **State Management**: React Server Components + client state for complex interactions
5. **Styling**: Tailwind CSS with custom design system tokens

### Security Considerations
- Row Level Security (RLS) for all data access
- Input validation and sanitization
- Rate limiting on content generation APIs
- Secure file upload with type validation
- XSS protection for user-generated content

### Scalability Planning
- Database indexing strategy for search performance
- Image CDN for global delivery
- Caching strategy for frequently accessed data
- API rate limiting and quota management
- Monitoring for performance bottlenecks

## Stage 1: Project Setup & Foundation ✅

### Core Setup
- [x] Initialize Next.js project with TypeScript and Tailwind CSS
- [x] Configure ESLint, Prettier, and TypeScript strict mode
- [x] Set up project structure with proper folder organization
- [x] Configure environment variables for development/production
- [x] Set up Git workflow with proper .gitignore. Publish to discomedia/zuluniner repository
- [x] Create package.json with all required dependencies

### Development Environment
- [x] Install and configure @discomedia/utils package
- [x] Set up VS Code workspace with recommended extensions
- [x] Configure TypeScript paths for clean imports
- [x] Set up development scripts (dev, build, lint, type-check)

---

## Stage 2: Database Schema & Supabase Setup ✅

**Local Development Commands:**
- Start Supabase: `npm run supabase:start` (requires Docker Desktop)
- Stop Supabase: `npm run supabase:stop`
- Reset DB with migrations: `npm run db:reset`
- Generate types: `npm run generate-schema`

**Production Deployment Commands:**
- Push schema to production: `npm run db:push`
- Deploy schema + update types: `npm run deploy:schema`
- Generate types from production: `npm run generate-schema:prod`
- Pull production changes: `npm run db:pull`
- Check migration status: `npm run db:status`
- Re-link to production: `npm run supabase:link`
- Pre-deployment check: `npm run deploy:check`

### Supabase Configuration
- [x] Create Supabase project
- [x] Install Docker and set it up
- [x] Configure environment variables for local development (Docker-based Supabase)
- [x] Set up authentication (ready for email/password, social providers if needed)
- [x] Configure Row Level Security (RLS) policies
- [x] Set up Supabase Storage buckets for images
- [x] Generate TypeScript types from Supabase schema (`npm run generate-schema`)

### Database Schema Design
- [x] **Users table** (extends auth.users)
  - [x] Profile information (name, company, phone, location)
  - [x] User roles (admin, seller, buyer)
  - [x] Created/updated timestamps
  
- [x] **Aircraft table**
  - [x] Basic info (title, description, price, year, make, model)
  - [x] Technical specs (hours, engine type, avionics, etc.)
  - [x] Location data (airport code, city, country, lat/lng)
  - [x] Status (active, sold, pending)
  - [x] SEO fields (slug, meta description)
  - [x] Created/updated timestamps, user_id foreign key
  
- [x] **Photos table**
  - [x] aircraft_id foreign key
  - [x] Storage path, alt text, caption
  - [x] Display order, is_primary flag
  - [x] Optimized file sizes and formats
  
- [x] **Blog_posts table**
  - [x] Title, slug, blurb, content (markdown)
  - [x] Header photo, SEO fields
  - [x] Published status and timestamps
  - [x] Author (user_id foreign key)
  
- [ ] **Categories/Tags tables** (if needed for filtering)

### Type Safety Setup
- [x] Configure Supabase CLI for local development (Docker-based)
- [x] Set up automatic type generation workflow (`npm run generate-schema`)
- [x] Create type-safe database client wrapper
- [x] Set up migration scripts (`npm run db:reset` to apply migrations)

---

## Stage 3: Core UI Components & Design System ✅

### Design System Foundation
- [x] Define color palette (professional, trustworthy colors) - Blue-based primary palette with semantic colors
- [x] Select typography (readable fonts for older users) - System fonts with improved readability
- [x] Create spacing and sizing scales - Complete spacing scale from 0.125rem to 24rem
- [x] Design component tokens (borders, shadows, etc.) - Border radius, shadows, and focus states
- [x] Create Tailwind CSS custom configuration - Using Tailwind v4 inline theme configuration

### Core Components
- [x] **Layout Components**
  - [x] Header with navigation - Responsive header with mobile menu, logo, and auth buttons
  - [x] Footer with contact info - Comprehensive footer with social links and company info
  - [x] Page layouts (full-width, contained, sidebar) - MainLayout, ContainerLayout, and PageHeader components
  
- [x] **UI Components**
  - [x] Button variants (primary, secondary, ghost, danger) - Added danger variant for destructive actions
  - [x] Form inputs (text, select, file upload, textarea) - Input, Textarea, Select with labels and error states
  - [x] Cards (aircraft listing, blog post) - Flexible Card system with Header, Content, Footer components
  - [x] Modal/Dialog components - Accessible Modal using Headless UI
  - [x] Loading states and spinners - Loading component with overlay and skeleton variants
  - [x] Error and success messages - Alert component with info, success, warning, error variants
  
- [x] **Navigation Components**
  - [x] Main navigation menu - Integrated into Header component
  - [x] Breadcrumbs - Accessible breadcrumb navigation component
  - [x] Pagination - Full-featured pagination with mobile support
  - [x] Search bar with filters - Advanced SearchBar with suggestions and keyboard navigation

### Responsive Design
- [x] Mobile-first responsive breakpoints - All components designed mobile-first
- [x] Desktop-optimized layouts (primary audience) - Larger layouts and spacing for desktop users
- [x] Touch-friendly interface elements - Appropriate touch targets and spacing
- [x] Accessibility considerations (WCAG compliance) - Focus states, ARIA labels, semantic HTML, keyboard navigation

### Additional Implementations
- [x] **Updated Homepage** - Professional aircraft marketplace design showcasing components
- [x] **Utility Functions** - cn() function for class merging using clsx and tailwind-merge
- [x] **TypeScript Integration** - Full type safety for all components
- [x] **Package Dependencies** - Added clsx, tailwind-merge, @headlessui/react

---

## Stage 4: Authentication & User Management ✅

### Authentication Flow
- [x] Set up Supabase Auth with Next.js middleware
- [x] Create login/register pages
- [x] Implement password reset functionality
- [x] Add email verification flow
- [x] Create protected route wrapper components

### User Profile Management
- [x] User profile creation and editing
- [ ] Profile photo upload and management
- [x] Contact information management
- [x] Account settings and preferences

### Authorization
- [x] Role-based access control (admin, seller, buyer)
- [x] Row Level Security policies for data access
- [x] Admin dashboard access controls
- [x] User session management

### Additional Implementations
- [x] **Next.js Middleware** - Complete authentication middleware with route protection
- [x] **AuthProvider Context** - Global authentication state management
- [x] **Server/Client Auth Separation** - Proper separation of server-side and client-side auth functions
- [x] **Database Triggers** - Automatic user profile creation on signup
- [x] **Email Verification Callback** - Complete email verification flow with callback handling
- [x] **Admin User Creation** - Script and process for creating admin users
- [x] **Protected Route Components** - Both server-side and client-side protected route wrappers
- [x] **Role-Based UI** - Dynamic header and navigation based on user role
- [x] **Session Management** - Proper session handling with automatic refresh
- [x] **Error Handling** - Comprehensive error handling for all auth flows
- [x] **TypeScript Integration** - Full type safety for all authentication components

---

## Stage 5: Aircraft Listings - Frontend ✅

### Listing Display
- [x] **Aircraft detail page** (`/src/app/aircraft/[slug]/page.tsx`)
  - [x] Hero section with primary photo
  - [x] Specification tables (organized by category with icons)
  - [x] Photo gallery with lightbox and keyboard navigation (`PhotoGallery.tsx`)
  - [x] Contact seller section with multiple methods (`ContactSeller.tsx`)
  - [x] Share functionality with social media integration (`ShareButtons.tsx`)
  
- [x] **Listing cards** for browse/search results
  - [x] Grid view card component (`AircraftCard.tsx`)
  - [x] List view component (`AircraftListItem.tsx`) 
  - [x] Primary photo, title, price, location display
  - [x] Key specs preview (year, hours, engine, avionics)
  - [x] Seller contact buttons (call, email)
  - [x] Responsive grid and list layouts

### Browse & Discovery
- [x] Aircraft listings overview page (`/src/app/aircraft/page.tsx`)
- [x] Grid and list view toggle with smooth transitions
- [x] Sort options (newest, oldest, price low/high)
- [x] Advanced filtering system (`AircraftFilters.tsx`)
  - [x] Price range filters
  - [x] Year range filters  
  - [x] Make and model filters
  - [x] Engine type filters
- [x] Pagination with performance optimization
- [x] Real-time search with debouncing
- [ ] "Recently viewed" functionality (deferred to later stage)

### SEO Optimization
- [x] Dynamic meta tags for aircraft pages
- [x] Structured data (JSON-LD) for search engines (`StructuredData.tsx`)
- [x] Optimized URLs with aircraft slug details
- [x] Open Graph tags for social sharing
- [x] Twitter Card optimization
- [x] Breadcrumb structured data

### Implementation Notes
- **Database Integration**: Uses existing `searchAircraft()` and `getAircraftBySlug()` functions from `/src/api/db.ts`
- **Type Safety**: All components use TypeScript types from `/src/types/index.ts`
- **Image Handling**: Integrates with Supabase Storage for aircraft photos
- **Component Architecture**: Modular components in `/src/components/aircraft/`
- **Search & Filters**: Client-side state management with URL param synchronization
- **Performance**: Uses Next.js Image optimization and server-side rendering

---

## Stage 6: Aircraft Listings - Backend/CMS ✅

### CMS Interface
- [x] **Admin dashboard** for managing listings (`/src/app/admin/aircraft/`)
  - [x] Aircraft management dashboard with status overview
  - [x] Table view showing all listings with status, price, photos, created date
  - [x] Quick action buttons (Edit, View) for each listing
  - [x] Status counts (Active, Draft, Pending, Sold)
  - [x] Admin-only access protection with `requireAdmin()`
  
- [x] **Listing creation form** (multi-step wizard)
  - [x] **Step 1: Basic Info** - Title, year, make, model, price, description
  - [x] **Step 2: Specifications** - Hours, engine type, avionics with dropdowns
  - [x] **Step 3: Location** - Airport code with auto-lookup, city, country, coordinates
  - [x] **Step 4: Photos** - Drag-and-drop interface, photo reordering, primary photo selection
  - [x] **Step 5: Preview** - Full listing preview with validation checklist and SEO preview
  - [x] Auto-generation of SEO-friendly slugs
  - [x] Save as draft or publish immediately
  - [x] Form validation and error handling

### Data Management
- [x] **CRUD operations** for aircraft listings
  - [x] Create aircraft via API endpoint `/api/admin/aircraft`
  - [x] Update aircraft via API endpoint `/api/admin/aircraft/[id]`
  - [x] Delete aircraft (soft delete) with status: 'deleted'
  - [x] Admin-only access to all CRUD operations
  
- [x] **Status management** 
  - [x] Extended `AircraftStatus` type: 'active' | 'sold' | 'pending' | 'draft' | 'deleted'
  - [x] Draft functionality for saving work-in-progress
  - [x] Status change capability in edit form
  
- [x] **Aircraft editing**
  - [x] Edit form at `/admin/aircraft/[id]/edit`
  - [x] All fields editable including status
  - [x] Form pre-populated with existing data

### Photo Management System  
- [x] **Photo upload interface**
  - [x] Drag-and-drop file selection
  - [x] Multiple file upload support
  - [x] File type and size validation (10MB max)
  - [x] Photo preview with thumbnails
  - [x] Primary photo designation (first photo)
  - [x] Photo reordering with move left/right controls
  - [x] Individual photo removal
  
- [ ] **Photo processing** (Deferred to Stage 8)
  - [ ] Actual file upload to Supabase Storage
  - [ ] Image optimization and resizing
  - [ ] Multiple format generation (WebP, fallbacks)

### Implementation Notes
- **Architecture**: Created modular wizard components in `/src/components/admin/aircraft/`
- **Type Safety**: Used `TablesInsert<'aircraft'>` from schema for database operations
- **Database Schema**: Used flat schema structure (not nested location object)
- **Authentication**: Full admin protection on all routes and API endpoints
- **UI Integration**: Leveraged existing UI components (Button, Input, Card, etc.)
- **Error Handling**: Comprehensive form validation and API error handling

### Deferred Items (Moved to Later Stages)
- **Auto-save functionality** - Can be added as enhancement in Stage 8
- **Bulk operations** - Moved to Stage 8 (import/export, bulk status changes)
- **Listing history/versioning** - Moved to Stage 8
- **Advanced photo processing** - Core of Stage 8
- **Data validation schemas** - Can be added as enhancement

---

## Stage 7: Search & Filtering Enhancement ✅

**✅ COMPLETED IN STAGE 5:**
- [x] Basic full-text search across aircraft listings (title, description)
- [x] Price range filtering with min/max inputs
- [x] Year range filtering with min/max inputs
- [x] Make and model dropdown filtering
- [x] Engine type filtering
- [x] Debounced search inputs (performance optimized)
- [x] Pagination for large result sets
- [x] Sort options (newest, oldest, price low/high)
- [x] Grid and list view toggle
- [x] Real-time search with URL parameter synchronization

**✅ ADDITIONAL IMPLEMENTATIONS (STAGE 7 ENHANCEMENTS):**
- [x] **Admin Aircraft Management Search Interface**
  - [x] Real-time search input with search icon
  - [x] Status-based filtering dropdown (All Status, Active, Draft, Pending, Sold)
  - [x] Responsive search controls layout
  - [x] Visual search interface integrated with existing table
  - [x] Enhanced user experience for admin aircraft management

**🎯 ADVANCED SEARCH FEATURES - Deferred to later stage**

### Advanced Search Functionality
- [ ] **Enhanced full-text search**
  - [ ] Search suggestions and autocomplete dropdown
  - [ ] Search result highlighting of matched terms
  - [ ] Search analytics tracking (popular search terms)
  - [ ] Fuzzy search and typo tolerance
  - [ ] Search within specific fields (title only, description only)
  - [ ] Recent searches localStorage persistence

### Advanced Filtering  
- [ ] **Location-based filtering**
  - [ ] Search within radius of location (e.g., "within 100 miles of Denver")
  - [ ] Airport code autocomplete with ICAO/IATA lookup
  - [ ] State/region filtering for US listings
  - [ ] Distance calculation and "nearest first" sorting
  - [ ] Interactive map for location selection
  
- [ ] **Enhanced specification filters**
  - [ ] Hours flown range slider (instead of text input)
  - [ ] Avionics packages filter with multi-select
  - [ ] Certification type filter (IFR, VFR, etc.)
  - [ ] Condition rating filter (Excellent, Good, Fair)
  - [ ] Last annual inspection date filter
  - [ ] Engine time since overhaul filter

### Advanced User Features
- [ ] **Saved searches and alerts**
  - [ ] Save search criteria for logged-in users
  - [ ] Email alerts when new aircraft match saved searches
  - [ ] Quick access to saved searches in user dashboard
  - [ ] Search history for anonymous users (localStorage)
  
- [ ] **Comparison features**
  - [ ] "Compare" checkbox on aircraft cards
  - [ ] Side-by-side comparison page for selected aircraft
  - [ ] Comparison table with specs, photos, and pricing
  - [ ] Export comparison as PDF

### Performance and UX Improvements
- [ ] **Database optimization**
  - [ ] Add database indexes on frequently searched fields
  - [ ] Implement full-text search indexes for better performance
  - [ ] Cache popular filter options (makes, models, engine types)
  - [ ] Optimize queries for large datasets
  
- [ ] **Search experience enhancements**
  - [ ] Loading states for search results
  - [ ] Empty state improvements with search suggestions
  - [ ] Filter count badges showing number of matches
  - [ ] "Clear all filters" quick action
  - [ ] Mobile-optimized filter drawer

### Implementation Priority
**Phase 1 (High Priority):**
- Enhanced location filtering (radius search)
- Hours flown range slider
- Saved searches for users
- Database indexing optimization

**Phase 2 (Medium Priority):**
- Search autocomplete and suggestions
- Avionics and certification filters
- Aircraft comparison feature
- Search analytics

**Phase 3 (Lower Priority):**
- Interactive map selection
- Advanced search operators
- Export and sharing features
- Machine learning search improvements

### Technical Notes
- **Build on existing**: Extend `/src/components/aircraft/AircraftFilters.tsx`
- **Database**: Enhance `searchAircraft()` function in `/src/api/db.ts`
- **Types**: Expand `SearchFilters` interface in `/src/types/index.ts`
- **Storage**: Use Supabase for saved searches, localStorage for anonymous users
- **Performance**: Consider Redis caching for production deployment

---

## Stage 8: Photo Management System ✅

### Photo Upload System ✅
- [x] **Drag-and-drop interface**
  - [x] Multiple file selection
  - [x] Progress indicators during optimization
  - [x] File type and size validation (10MB max, image types only)
  - [x] Error handling for failed uploads and optimization
  - [x] Visual feedback during processing

### Photo Processing Pipeline ✅
- [x] **Automatic optimization**
  - [x] Resize images to optimized dimensions (800x600 for web display)
  - [x] Generate thumbnails (300x300 for previews)
  - [x] Compress for web delivery with quality controls
  - [x] Fallback to original if optimization fails
  
- [x] **File naming and organization**
  - [x] Generate SEO-friendly filenames with aircraft info
  - [x] Organize in structured folder hierarchy (`aircraft-{id}/timestamp-filename.ext`)
  - [x] Maintain unique timestamps to prevent conflicts
  - [x] Clean filename sanitization

### Photo Management Interface ✅
- [x] **Enhanced photo gallery management in CMS**
  - [x] Drag-to-reorder functionality with move left/right controls
  - [x] Set primary photo selection (first photo automatically)
  - [x] Individual photo removal with confirmation
  - [x] Clear all photos functionality
  - [x] Photo preview grid with hover controls
  - [x] Visual primary photo badging

### Backend Integration ✅
- [x] **Complete file upload to Supabase Storage**
  - [x] FormData handling for multipart uploads
  - [x] Batch photo upload with transaction support
  - [x] Error handling and cleanup on failures
  - [x] Integration with aircraft creation workflow
  
- [x] **Database photo records**
  - [x] Automatic alt text generation with aircraft details
  - [x] Display order management
  - [x] Primary photo designation
  - [x] Storage path tracking

### Technical Implementations
- [x] **Image processing utilities** (`/src/lib/image-utils.ts`)
  - [x] Canvas-based image resizing with aspect ratio preservation
  - [x] Multiple size generation (thumbnail, medium, large, original)
  - [x] Quality controls for different use cases
  - [x] File validation with proper error messages
  
- [x] **Enhanced database functions** (`/src/api/db.ts`)
  - [x] `uploadMultipleAircraftPhotos()` for batch uploads
  - [x] SEO-friendly filename generation
  - [x] Transaction support and error cleanup
  - [x] Primary photo management

- [x] **Updated API endpoint** (`/src/app/api/admin/aircraft/route.ts`)
  - [x] FormData and JSON support
  - [x] File upload processing
  - [x] Graceful error handling for photo failures
  - [x] Success reporting with photo counts

### Deferred Features (Future Enhancements)
- [ ] **WebP format conversion** - Can be added in future optimization phase
- [ ] **Advanced photo editing** - Alt text editing, caption management
- [ ] **Bulk photo operations** - Import/export, batch status changes

---

## Code Quality & Feature Completion ✅

### Admin Interface Enhancements ✅
- [x] **User Information Display**
  - [x] Admin Dashboard: Shows admin name in welcome message (`Welcome, {profile.name}`)
  - [x] Aircraft Management: Shows logged-in admin in page description
  - [x] Aircraft Edit Pages: Shows admin name in context
  - [x] Proper user context throughout admin interface

- [x] **Real Data Integration**
  - [x] Admin Dashboard: Live statistics from database
    - [x] Total users count from users table
    - [x] Active aircraft listings count by status
    - [x] Pending reviews count (aircraft needing review)
    - [x] Color-coded statistics with semantic meaning
  - [x] Replaced placeholder "0" values with actual database queries

### User Dashboard Implementation ✅
- [x] **Personalized User Experience**
  - [x] Personalized welcome message with user name
  - [x] Real user statistics dashboard
    - [x] Total listings count for user
    - [x] Active listings breakdown
    - [x] Draft listings count
    - [x] Sold listings tracking
  - [x] User-specific aircraft data queries
  - [x] Enhanced dashboard layout with statistics cards

### Search & Filter Interface ✅
- [x] **Enhanced Admin Aircraft Management**
  - [x] Real-time search input with visual search icon
  - [x] Status-based filtering dropdown (All, Active, Draft, Pending, Sold)
  - [x] Responsive search controls layout
  - [x] Improved header layout for better UX
  - [x] Export functionality placeholder

### Code Quality Improvements ✅
- [x] **Unused Variable Cleanup**
  - [x] Removed unused imports (`useState`, `useRouter`, etc.)
  - [x] Cleaned up API parameters (unused `request` parameter)
  - [x] Proper variable naming for intentionally unused variables (`_user`, `_aircraft`)
  - [x] Reduced TypeScript warnings from 15+ to minimal framework-required warnings

- [x] **Type Safety Enhancements**
  - [x] Fixed authentication type issues
  - [x] Proper separation of `requireAuth()` vs `requireAdmin()` usage
  - [x] Enhanced error handling in dashboard data fetching

### Technical Implementations ✅
- [x] **Database Integration Functions**
  - [x] `getDashboardStats()` for admin dashboard statistics
  - [x] `getUserDashboardData()` for user-specific dashboard data
  - [x] Efficient database queries with proper filtering
  - [x] Error handling and fallback values

- [x] **Authentication Flow Improvements**
  - [x] Proper user profile fetching in non-admin contexts
  - [x] Consistent user information display patterns
  - [x] Enhanced security context throughout application

---

## Stage 9: Blog System

### Blog Frontend
- [ ] **Blog listing page**
  - [ ] Article cards with preview
  - [ ] Category and tag filtering
  - [ ] Search within blog posts
  - [ ] Pagination and infinite scroll option
  
- [ ] **Article detail pages**
  - [ ] Markdown content rendering
  - [ ] Header image display
  - [ ] Author information
  - [ ] Related articles suggestions
  - [ ] Social sharing buttons

### Blog CMS
- [ ] **Article creation interface**
  - [ ] Rich text editor for markdown
  - [ ] Header image upload and management
  - [ ] SEO fields (meta description, tags)
  - [ ] Publish/draft status management
  - [ ] Preview functionality

### Blog Features
- [ ] Category and tag management
- [ ] Article search and filtering
- [ ] RSS feed generation
- [ ] Comment system (optional)
- [ ] Newsletter signup integration

---

## Stage 10: Content Generation (LLM Integration)

### LLM Integration Setup
- [ ] Configure @discomedia/utils package
- [ ] Set up API keys and rate limiting
- [ ] Create content generation prompts
- [ ] Error handling for API failures

### Aircraft Listing Content Generation
- [ ] **Auto-generate descriptions**
  - [ ] Take keyword-rich title input
  - [ ] Generate compelling listing descriptions
  - [ ] Include technical specifications context
  - [ ] Maintain consistent tone and style
  
- [ ] **Content enhancement**
  - [ ] Generate SEO-optimized meta descriptions
  - [ ] Suggest relevant tags and categories
  - [ ] Create social media descriptions

### Blog Content Generation
- [ ] **Article research and generation**
  - [ ] Topic research based on keywords
  - [ ] Generate article outlines
  - [ ] Create full markdown content
  - [ ] Generate header images (AI or stock photos)
  
- [ ] **Content optimization**
  - [ ] SEO optimization suggestions
  - [ ] Readability improvements
  - [ ] Fact-checking reminders

---

## Stage 11: Testing & Optimization

### Testing Implementation
- [ ] **Unit tests** for utility functions
- [ ] **Integration tests** for API endpoints
- [ ] **End-to-end tests** for critical user flows
- [ ] **Performance testing** for image loading
- [ ] **Accessibility testing** (automated and manual)

### Performance Optimization
- [ ] **Image optimization**
  - [ ] Lazy loading implementation
  - [ ] WebP format with fallbacks
  - [ ] Responsive image sizes
  - [ ] CDN configuration
  
- [ ] **Core Web Vitals optimization**
  - [ ] Largest Contentful Paint (LCP)
  - [ ] First Input Delay (FID)
  - [ ] Cumulative Layout Shift (CLS)
  - [ ] Time to First Byte (TTFB)

### SEO & Analytics
- [ ] Google Analytics 4 integration
- [ ] Search Console setup and monitoring
- [ ] Structured data validation
- [ ] Sitemap generation and submission
- [ ] Page speed optimization

---

## Stage 12: Deployment & Production

### Deployment Setup
- [x] **Vercel Deployment** (via GitHub)
  - [x] Connect GitHub repository to Vercel - done
  - [x] Configure automatic deployments on commits - done
  - [x] Configure custom domain (zuluniner.com) - done
  - [x] Set up SSL certificates (automatic with Vercel)

- [x] **Production configuration**
  - [x] Environment variables setup - production config is in .env.production
  - [x] Database migration to production - **Note: Transition from Docker to hosted Supabase**
  - [x] CDN configuration for assets - using Cloudflare
  - [x] Monitoring and error tracking

### Supabase Deployment Notes
**Important**: This project uses Supabase with Docker for local development. For production deployment:

- [x] **Supabase Cloud Setup**
  - [x] Use existing production Supabase project (bjwlldxavgoxhyyufffy)
  - [x] Copy database schema from local Docker setup to cloud
  - [x] Run migrations: `npx supabase db push` or `npm run db:push` (pushes local schema to cloud)
  - [x] Update environment variables to point to cloud instance
  - [x] Set up production Row Level Security (RLS) policies
  - [x] Configure production storage buckets for images

- [ ] **Migration Process**
  - [ ] Test all functionality with cloud database
  - [ ] Update authentication providers if using social login
  - [ ] Verify all RLS policies work correctly in production

### Schema Update Workflow
When updating database schema after deployment:

**1. Local Development:**
```bash
# Start local Supabase
npm run supabase:start

# Make schema changes, create migrations
# Test locally
npm run db:reset
npm run generate-schema
```

**2. Deploy to Production:**
```bash
# Push schema + update types in one command
npm run deploy:schema

# Or step by step:
npm run db:push                    # Push migrations to production
npm run generate-schema:prod       # Generate types from production

# Check build before pushing to GitHub
npm run deploy:check
```

**3. Sync and Deploy:**
```bash
# Commit and push (triggers Vercel deployment)
git add .
git commit -m "Update database schema"
git push
```

- [ ] **Environment Variables**
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://bjwlldxavgoxhyyufffy.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (server-side only)
  ```

- [x] **Vercel Configuration**
  - [x] Add environment variables in Vercel dashboard
  - [x] Configure build settings (Next.js preset should auto-detect)
  - [x] Set up preview deployments for pull requests
  - [x] Configure production branch (typically `main` or `master`)
  - [x] Test deployment with staging environment first
  - [x] Configure custom domain (zuluniner.com) in Vercel dashboard
  - [x] Update DNS in Cloudflare to point to Vercel
  - [x] Verify SSL certificate auto-generation

### Deployment Workflow
**Automatic Deployments:**
- Every push to `master` branch triggers production deployment on Vercel
- Pull requests create preview deployments automatically
- Build logs and deployment status visible in Vercel dashboard

**Manual Schema Updates:**
```bash
# When you need to update database schema
npm run deploy:schema              # Push DB changes + update types
npm run deploy:check              # Verify build works
git add . && git commit -m "..." && git push    # Deploy via GitHub
```

### Launch Preparation
- [ ] **Content creation**
  - [ ] Initial aircraft listings (sample data)
  - [ ] Blog posts for launch
  - [ ] Legal pages (privacy, terms, contact)
  - [ ] About page and company information
  
- [ ] **Quality assurance**
  - [ ] Cross-browser testing
  - [ ] Mobile device testing
  - [ ] Load testing with sample data
  - [ ] Security audit and penetration testing

### Post-Launch
- [ ] Analytics monitoring setup
- [ ] User feedback collection system
- [ ] Performance monitoring alerts
- [ ] Backup and disaster recovery plan
- [ ] Documentation for future maintenance