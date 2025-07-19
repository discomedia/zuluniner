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

## General UX Improvements ✅

### Front Page Navigation & Content ✅
- [x] **Fixed navigation buttons**
  - [x] "Browse" button now navigates to `/aircraft` page
  - [x] "View All Aircraft" button now navigates to `/aircraft` page  
  - [x] "Sell Your Aircraft" buttons now navigate to `/sell` page
  - [x] "List Your Aircraft" button now navigates to `/sell` page

- [x] **Replaced placeholder content with real data**
  - [x] Featured aircraft section now pulls from database using `searchAircraft()`
  - [x] Shows real aircraft data with photos, prices, and specifications
  - [x] Displays fallback message "No planes available right now :(" when database is empty
  - [x] Added loading state while fetching data
  - [x] Integrated with Next.js Image optimization for aircraft photos

- [x] **Enhanced search functionality**
  - [x] Search bar on homepage now redirects to `/aircraft` with search query
  - [x] Search parameters properly encoded and passed to listings page

### New Page Creation ✅
- [x] **Sell Page** (`/app/sell/page.tsx`)
  - [x] Professional landing page for aircraft sellers
  - [x] Features section highlighting marketplace benefits
  - [x] "How It Works" step-by-step guide
  - [x] Transparent pricing information (3% success fee)
  - [x] Call-to-action sections for seller engagement
  - [x] SEO optimized with proper metadata

- [x] **Contact Page** (`/app/contact/page.tsx`)
  - [x] Complete contact form with validation
  - [x] Multiple contact methods (phone, email, office address)
  - [x] Category-based inquiry routing
  - [x] FAQ section with common questions
  - [x] Form submission handling with success/error states
  - [x] Professional layout with accessibility considerations

### Build Quality ✅
- [x] **Fixed TypeScript errors**
  - [x] Resolved property access issues with Aircraft type
  - [x] Fixed React unescaped entities warnings
  - [x] Replaced `<img>` tags with Next.js `<Image>` components
  - [x] Cleaned up unused imports and variables

- [x] **Navigation flow testing**
  - [x] All buttons and links properly navigate between pages
  - [x] Search functionality works end-to-end
  - [x] Mobile responsiveness maintained across new pages

**Implementation Notes:**
- Real database integration maintains existing data structure and API
- All new pages follow established design system and component patterns
- Navigation improvements enhance user flow without breaking existing functionality
- Build passes successfully with minimal warnings (only existing admin page warnings remain)

---

## Stage 9: Blog System

### Blog Frontend
- [ ] **Blog listing page**
  - [ ] Article cards with preview
  - [ ] Category and tag filtering
  - [ ] Search within blog posts
  - [ ] Pagination and infinite scroll option
  
- [x] **Article detail pages**
  - [x] Markdown content rendering (ReactMarkdown + remarkGfm)
  - [x] @tailwindcss/typography plugin installed for proper prose styling
  - [ ] Header image display
  - [x] Author information
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

## Stage 10: Content Generation (LLM Integration) ✅

### LLM Integration Setup ✅
- [x] Configure @discomedia/utils package
- [x] Set up API keys and rate limiting
- [x] Create content generation prompts
- [x] Error handling for API failures

### Aircraft Listing Content Generation ✅
- [x] **Auto-populate feature**
  - [x] Take descriptive title input (e.g., "1978 Piper Archer II – Low Time Engine, Garmin Avionics")
  - [x] Perform web searches for aircraft information
  - [x] Generate comprehensive aircraft data including specifications, market info, and descriptions
  - [x] Auto-populate form fields with AI-generated content
  - [x] Progressive modal with 15-second process animation
  - [x] Error handling for API failures and network issues
  
- [x] **Content enhancement**
  - [x] Generate SEO-optimized meta descriptions
  - [x] Create compelling listing descriptions
  - [x] Include technical specifications context
  - [x] Maintain consistent tone and style

### Technical Implementation ✅
- [x] **API Route** (`/api/admin/aircraft/auto-populate`)
  - [x] POST endpoint for auto-population requests
  - [x] Two-step LLM process: web search + structured JSON conversion
  - [x] Aircraft-specific validation and prompting
  - [x] Cost tracking and usage reporting
  - [x] Comprehensive error handling
  
- [x] **UI Components**
  - [x] Auto-populate button with AI sparkle emoji (✨)
  - [x] Progress modal with animated slider
  - [x] Step-by-step progress indicators
  - [x] Success/error state handling
  - [x] Integrated into aircraft creation wizard
  
- [x] **Data Processing**
  - [x] Structured JSON response matching Aircraft interface
  - [x] Market price estimation and specification lookup
  - [x] Location suggestions with airport codes
  - [x] Form field population without overwriting existing data

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

### UI/UX Improvements ✅
- [x] **Form readability and accessibility**
  - [x] Fixed text contrast issues with improved color schemes
  - [x] Enhanced label visibility (text-gray-900 instead of text-neutral-700)
  - [x] Improved input text contrast (text-gray-900 with bg-white)
  - [x] Better placeholder text readability (text-gray-400)
  - [x] Enhanced help text visibility (text-gray-600)

- [x] **Navigation and user flow**
  - [x] Added Cancel button to return to admin dashboard
  - [x] Improved button grouping and layout
  - [x] Enhanced visual hierarchy in form steps
  - [x] Added gradient styling to auto-populate button for prominence

- [x] **Visual design enhancements**
  - [x] Improved preview URL section with blue background
  - [x] Better step indicator styling
  - [x] Enhanced card header contrast
  - [x] Consistent error message styling

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

---

## Database Architecture: Type-Safe Supabase Integration ✅

### Overview
ZuluNiner implements a fully type-safe database layer that eliminates direct Supabase usage throughout the application. All database operations go through centralized convenience functions in `src/api/db.ts`, providing consistent error handling, proper TypeScript integration, and maintainable data access patterns.

### Type-Safe Client Implementation ✅

**✅ Supabase Client Initialization**
- [x] **Schema-typed clients**: All Supabase clients initialized with `createClient<Database>()` for full type inference
- [x] **Centralized client management**: Main client in `src/api/supabase.ts` with Database schema typing
- [x] **Server-side client factory**: Typed service role client creation for admin operations
- [x] **Auth client integration**: Browser and server auth clients properly typed with Database schema

**✅ Database API Structure**
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

### Type Safety Implementation ✅

**✅ Schema Type Integration**
- [x] **Generated types**: All operations use `Tables`, `TablesInsert`, `TablesUpdate` from generated schema
- [x] **Nullable field handling**: Proper handling of database nullability (`string | null` vs `string | undefined`)
- [x] **Return type definitions**: Custom types for joined data (`AircraftWithPhotos`, `AircraftWithUser`, etc.)
- [x] **Type consistency**: Application types updated to match database schema exactly

**✅ Error Handling & Safety**
- [x] **Consistent error patterns**: All functions use try/catch with meaningful error messages
- [x] **Transaction support**: Functions accept optional `SupabaseClient` parameter for server-side operations
- [x] **Null safety**: Proper handling of nullable database fields throughout the application
- [x] **Compile-time validation**: TypeScript catches schema mismatches at build time

### Usage Patterns ✅

**✅ Component Integration**
```typescript
// ✅ Correct usage - type-safe convenience functions
import { db } from '@/api/db';

const aircraft = await db.aircraft.getById(id);
const photoUrl = db.photos.getPhotoUrl(photo.storage_path);
const searchResults = await db.aircraft.search(filters, page, limit);

// ❌ Never allowed - direct supabase usage
import { supabase } from '@/api/supabase'; // This pattern eliminated
```

**✅ Server-Side Operations**
```typescript
// API routes and server components
const supabase = await createServerSupabaseClient();
const aircraft = await db.aircraft.create(aircraftData, supabase);
const result = await db.aircraft.update(id, updates, supabase);
```

### Migration Strategy ✅

**✅ Codebase Migration Completed**
- [x] **Aircraft detail pages**: Migrated to `db.aircraft.getBySlug()` and `db.photos.getPhotoUrl()`
- [x] **Aircraft listings**: All components use structured `db` API
- [x] **Photo gallery**: Updated to use convenience photo functions
- [x] **Admin interfaces**: Server-side operations properly use authenticated clients
- [x] **Search functionality**: Uses type-safe `db.aircraft.search()` with proper filtering
- [x] **Component cleanup**: Removed all direct Supabase imports from UI components

### Development Workflow ✅

**✅ Adding New Database Functions**

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

### Benefits Achieved ✅

**✅ Developer Experience**
- [x] **IntelliSense**: Full autocomplete for table names, column names, and relationships
- [x] **Type inference**: Return types automatically inferred from database schema
- [x] **Refactoring safety**: Schema changes automatically propagate type errors
- [x] **Consistent patterns**: Standardized error handling and data access across application

**✅ Maintainability**
- [x] **Centralized data layer**: All database logic contained in `src/api/db.ts`
- [x] **DRY principle**: No duplicate database queries across components
- [x] **Error consistency**: Unified error handling patterns
- [x] **Schema sync**: Database changes automatically reflected in TypeScript types

**✅ Production Readiness**
- [x] **Type safety**: Compile-time validation prevents runtime database errors
- [x] **Performance**: Optimized queries with proper joins and indexes
- [x] **Security**: Server-side client passing for authenticated operations
- [x] **Monitoring**: Consistent error logging for production debugging

### Technical Standards ✅

**✅ Code Quality Requirements**
- [x] **Schema alignment**: All application types match database schema nullability
- [x] **Error boundaries**: Proper try/catch wrapping for all database operations
- [x] **Client management**: Optional client parameters for server-side operations
- [x] **Type exports**: No `any` or `unknown` types in database layer
- [x] **Build verification**: All changes verified with `npm run build` before commit

**✅ Future Development Guidelines**
- Always use `db.*` namespace functions instead of direct Supabase calls
- Define specific return types for complex joins and data structures
- Handle nullable database fields appropriately in component interfaces
- Pass authenticated Supabase clients for server-side operations
- Test new functions with TypeScript compiler before deployment

This type-safe database architecture provides a robust foundation for scalable development while maintaining full type safety from database to UI components.

---

## Data Fetching Architecture: Server vs Client Components ✅

### Production Issue Resolution ✅

**Problem Identified**: Client-side Supabase requests were timing out in production (Vercel) while working fine locally, causing aircraft listings to not load.

**Root Cause**: Network connectivity issues between Vercel's edge functions and Supabase when making client-side requests.

**Solution**: Migrate data fetching from client components to server components for reliable database access.

### Server Component Pattern (Recommended) ✅

**✅ When to Use Server Components:**
- All database operations with Supabase
- Authentication state access
- SEO-critical content rendering
- Static content that doesn't require interactivity

**✅ Server Component Implementation:**
```typescript
// ✅ CORRECT: Server component with database access
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

### Client Component Pattern (Interactive Only) ✅

**✅ When to Use Client Components:**
- User interactions (buttons, forms, search)
- Browser APIs (localStorage, router navigation)
- State management and event handlers
- Real-time updates and dynamic UI

**✅ Client Component Implementation:**
```typescript
// ✅ CORRECT: Client component for interactivity only
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

### Hybrid Architecture Pattern ✅

**✅ Optimal Pattern: Server Data + Client Interactivity**

**Main Page Structure:**
```typescript
// ✅ Server component: Data fetching and SEO
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
// ✅ Client component: Interactive elements wrapper
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

### Production vs Development Behavior ✅

**✅ Why This Pattern Prevents Production Issues:**

1. **Server-Side Reliability**: Database operations happen on Vercel's servers, which have reliable connectivity to Supabase
2. **Client-Side Limitations**: Browser clients can experience network timeouts, especially from edge locations
3. **Build-Time Optimization**: Server components can be pre-rendered during build, improving performance
4. **SEO Benefits**: Content is available immediately without JavaScript execution

**✅ Working Examples in Codebase:**
- **Aircraft Detail Pages** (`/src/app/aircraft/[slug]/page.tsx`): Server component pattern - works in production
- **Admin Pages** (`/src/app/admin/*/page.tsx`): Server component pattern - works in production  
- **Main Page** (after fix): Hybrid pattern - server data + client interactivity

**✅ Anti-Patterns to Avoid:**
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

### Implementation Guidelines ✅

**✅ Development Standards:**

1. **Default to Server Components**: Use server components unless interactivity is specifically needed
2. **Data Fetching Location**: Always fetch data server-side using `async` component functions
3. **Client Boundaries**: Create explicit client component boundaries with `'use client'` directive
4. **Props Pattern**: Pass server-fetched data to client components via props
5. **Error Boundaries**: Handle database errors in server components with proper fallbacks

**✅ Testing Strategy:**
- Test locally with `npm run dev` (uses local Supabase)
- Test production deployment to verify server-side data fetching works
- Monitor for timeout errors in production browser console
- Use `npm run build` to verify server component compilation

**✅ Migration Approach:**
1. Identify client components doing database operations
2. Extract data fetching to parent server component
3. Pass data as props to client component
4. Verify functionality in both development and production

This architecture ensures reliable data loading across all deployment environments while maintaining the interactive user experience expected in modern web applications.

---

## Improvements

*Based on industry insights and user feedback, the following improvements are organized by implementation priority and technical difficulty.*

### High Priority & Easy Implementation

#### 1. N-Number Data Lookup
**Description**: Integrate with FAA Registry API to auto-populate aircraft data using tail number (N-Number).

**Steps to implement**:
1. Create API endpoint `/api/aircraft/lookup-nnumber`
2. Integrate with FAA Aircraft Registry API (https://registry.faa.gov/AircraftInquiry/)
3. Add N-Number input field with lookup button in aircraft creation form
4. Auto-populate: make, model, year, engine type, certification type
5. Show registration validity and airworthiness status

**API Integration**: Uses FAA public APIs for aircraft registration data

#### 2. Market Price Estimation (Zestimate)
**Description**: AI-powered price estimation algorithm like Zillow's Zestimate for aircraft valuation. Use DiscoMedia's LLM for market analysis.

**Steps to implement**:
1. Collect market data from existing listings and sold aircraft
2. Create ML model considering: year, hours, engine time, avionics, location
3. Build API endpoint `/api/aircraft/estimate-price`
4. Display price range and confidence interval on listing pages
5. Show price comparison with similar aircraft

**API Integration**: Uses machine learning APIs and market data analysis

#### 3. Engine TBO Calculator
**Description**: Calculate remaining engine life and associated costs based on hours and TBO (Time Between Overhaul).

**Steps to implement**:
1. Create engine database with TBO specifications by model
2. Build calculator function for remaining hours and cost estimation
3. Add visual indicators (green/yellow/red) for engine condition
4. Display "Expect $X overhaul in Y hours" messaging
5. Include in aircraft detail and listing card components

**API Integration**: Database lookup with cost calculation algorithms

#### 4. Accident History Badge
**Description**: Show accident-free status or accident history using NTSB database.

**Steps to implement**:
1. Integrate with NTSB Aviation Accident Database API
2. Create background job to check accident history by N-Number
3. Add "Accident Free" badge or "View History" link
4. Cache results to avoid repeated API calls
5. Display prominently on aircraft detail pages

**API Integration**: NTSB Aviation Accident Database (public API)

### Medium Priority & Moderate Implementation

#### 5. Flight Activity Tracking
**Description**: Track how often aircraft is flown as health indicator using FlightAware data.

**Steps to implement**:
1. Integrate with FlightAware API for flight tracking
2. Create dashboard showing monthly flight hours/frequency
3. Add "Regular flyer" or "Rarely used" indicators
4. Store flight data in database for trend analysis
5. Display flight activity timeline on aircraft pages

**API Integration**: FlightAware API (subscription required)

#### 6. Airworthiness Directives (AD) Lookup
**Description**: Display applicable ADs and compliance status for aircraft make/model.

**Steps to implement**:
1. Create database of FAA Airworthiness Directives by aircraft type
2. Build matching algorithm for applicable ADs
3. Create API endpoint `/api/aircraft/airworthiness-directives`
4. Display AD list with compliance status indicators
5. Estimate inspection burden costs

**API Integration**: FAA FSIMS API and AD database

#### 7. Hangar/Tie-down Pricing
**Description**: Provide local hangar and tie-down pricing by airport location.

**Steps to implement**:
1. Create database of hangar pricing by airport code
2. Integrate with airport services APIs where available
3. Build pricing lookup by location/radius
4. Display estimated monthly storage costs
5. Include contact information for facilities

**API Integration**: Airport services APIs and manual data collection

#### 8. Insurance Cost Estimation
**Description**: Estimate insurance costs based on aircraft type, pilot experience, and location.

**Steps to implement**:
1. Partner with aviation insurance providers for data
2. Create cost model considering aircraft value, pilot hours, location
3. Build API endpoint `/api/aircraft/insurance-estimate`
4. Display cost ranges and referral links
5. Include in total cost of ownership calculator

**API Integration**: Insurance partner APIs and actuarial data

### Medium Priority & Complex Implementation

#### 9. A&P Mechanic Locator
**Description**: Find licensed A&P mechanics for pre-buy inspections based on aircraft location.

**Steps to implement**:
1. Create database of A&P mechanics with location and specialties
2. Build search API with radius and aircraft type filtering
3. Integrate with FAA Mechanic Registry for verification
4. Add rating/review system for mechanics
5. Create booking system for pre-buy inspections

**API Integration**: FAA Airmen Certification Database

#### 10. Advanced Search with Saved Alerts
**Description**: Nuanced search with saved criteria and email alerts for new matching aircraft.

**Steps to implement**:
1. Expand search filters: seats, range, fuel burn, useful load, avionics
2. Create saved search functionality for logged-in users
3. Build alert system checking new listings against saved criteria
4. Implement email notification system
5. Add "brands I like" preference matching

**API Integration**: Email service integration (SendGrid/Mailgun)

#### 11. Aircraft Comparison Tool
**Description**: Side-by-side comparison of multiple aircraft specifications and pricing.

**Steps to implement**:
1. Add "Compare" checkboxes to aircraft cards
2. Create comparison page with side-by-side layout
3. Build specification comparison table
4. Add photo galleries for each aircraft
5. Export comparison as PDF report

**API Integration**: PDF generation service

#### 12. Enhanced Photo Management with AI
**Description**: AI-powered photo enhancement and automatic aircraft walkaround videos.

**Steps to implement**:
1. Integrate with AI photo enhancement services
2. Create automated photo categorization (exterior, interior, panel, engine)
3. Build video creation from photo sequences
4. Add drone integration for aerial photography
5. Implement "Airbnb-style" stunning photo standards

**API Integration**: AI photo enhancement APIs, video generation services

### Low Priority & Complex Implementation

#### 13. Digital Logbook Analysis
**Description**: AI-powered logbook digitization and compliance verification.

**Steps to implement**:
1. Create photo upload interface for logbook pages
2. Integrate OCR/AI services for text extraction
3. Build compliance checking algorithms
4. Create digital logbook display interface
5. Generate maintenance summary reports

**API Integration**: OCR/AI services (Google Vision, AWS Textract)

#### 14. Marketplace Analytics Dashboard
**Description**: Detailed analytics on listing performance and market trends.

**Steps to implement**:
1. Track listing views, inquiries, and engagement metrics
2. Build seller dashboard with performance analytics
3. Create market trend analysis and reporting
4. Add competitor pricing analysis
5. Implement time-to-sell predictions

**API Integration**: Analytics processing and data visualization APIs

### Very Hard Implementation

#### 15. Financing Integration
**Description**: Connect buyers with specialized aviation financing options.

**Steps to implement**:
1. Partner with aviation lenders and specialty finance companies
2. Build loan application workflow and qualification system
3. Integrate with credit checking services
4. Create loan calculator with payment scenarios
5. Implement secure document upload and processing
6. Build lender portal for application review

**API Integration**: Credit bureau APIs, banking/lending platform APIs

#### 16. Escrow and Transaction Management
**Description**: Full-service transaction platform with escrow and title services.

**Steps to implement**:
1. Partner with aviation escrow and title companies
2. Build secure transaction workflow system
3. Integrate payment processing and wire transfers
4. Create document management and digital signatures
5. Implement milestone-based fund release
6. Build transaction tracking and communication tools

**API Integration**: Banking APIs, document management, payment processors

#### 17. Blockchain Aircraft History
**Description**: Immutable aircraft history and ownership tracking using blockchain.

**Steps to implement**:
1. Design blockchain schema for aircraft records
2. Integrate with aircraft registration systems
3. Build smart contracts for ownership transfers
4. Create maintenance record verification system
5. Implement multi-party verification workflow
6. Build public aircraft history explorer

**API Integration**: Blockchain networks, smart contract platforms

#### 18. International Market Expansion
**Description**: Support for international aircraft sales with regulatory compliance.

**Steps to implement**:
1. Research international aviation regulations by country
2. Build multi-currency pricing and conversion
3. Integrate with international aircraft registries
4. Create country-specific compliance checking
5. Build international shipping and logistics integration
6. Implement multi-language support

**API Integration**: International registry APIs, currency conversion, shipping APIs