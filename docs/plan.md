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

## Stage 4: Authentication & User Management

### Authentication Flow
- [ ] Set up Supabase Auth with Next.js middleware
- [ ] Create login/register pages
- [ ] Implement password reset functionality
- [ ] Add email verification flow
- [ ] Create protected route wrapper components

### User Profile Management
- [ ] User profile creation and editing
- [ ] Profile photo upload and management
- [ ] Contact information management
- [ ] Account settings and preferences

### Authorization
- [ ] Role-based access control (admin, seller, buyer)
- [ ] Row Level Security policies for data access
- [ ] Admin dashboard access controls
- [ ] User session management

---

## Stage 5: Aircraft Listings - Frontend

### Listing Display
- [ ] **Aircraft detail page**
  - [ ] Hero section with primary photo
  - [ ] Specification tables (organized by category)
  - [ ] Photo gallery with lightbox
  - [ ] Contact seller section
  - [ ] Share functionality
  
- [ ] **Listing cards** for browse/search results
  - [ ] Primary photo, title, price, location
  - [ ] Key specs preview
  - [ ] Seller contact button
  - [ ] Responsive grid layouts

### Browse & Discovery
- [ ] Aircraft listings overview page
- [ ] Grid and list view options
- [ ] Sort options (latest, oldest, price up/down)
- [ ] Pagination with performance optimization
- [ ] "Recently viewed" functionality

### SEO Optimization
- [ ] Dynamic meta tags for aircraft pages
- [ ] Structured data (JSON-LD) for search engines
- [ ] Optimized URLs with aircraft details
- [ ] Open Graph tags for social sharing

---

## Stage 6: Aircraft Listings - Backend/CMS

### CMS Interface
- [ ] **Admin dashboard** for managing listings
  - [ ] Create/edit aircraft listings form
  - [ ] Draft and published status management
  - [ ] Bulk operations (delete, status change)
  
- [ ] **Listing creation form**
  - [ ] Step-by-step wizard interface
  - [ ] Auto-save functionality
  - [ ] Validation and error handling
  - [ ] Preview mode before publishing

### Data Management
- [ ] CRUD operations for aircraft listings
- [ ] Soft delete functionality
- [ ] Listing history and version control
- [ ] Bulk import/export capabilities
- [ ] Data validation and sanitization

---

## Stage 7: Search & Filtering

### Search Functionality
- [ ] **Full-text search** across aircraft listings
  - [ ] Search in title, description, specifications
  - [ ] Search suggestions and autocomplete
  - [ ] Search result highlighting
  - [ ] Search analytics and popular terms

### Advanced Filtering
- [ ] **Location-based filtering**
  - [ ] Search within radius of location
  - [ ] Airport code lookup
  - [ ] Map-based location selection
  
- [ ] **Specification filters**
  - [ ] Price range slider
  - [ ] Year range, hours flown
  - [ ] Make and model dropdowns
  - [ ] Engine type, avionics packages
  - [ ] Custom specification filters

### Performance Optimization
- [ ] Database indexing for search performance
- [ ] Debounced search inputs
- [ ] Cached filter options
- [ ] Pagination for large result sets

---

## Stage 8: Photo Management System

### Photo Upload System
- [ ] **Drag-and-drop interface**
  - [ ] Multiple file selection
  - [ ] Progress indicators
  - [ ] File type and size validation
  - [ ] Error handling for failed uploads

### Photo Processing Pipeline
- [ ] **Automatic optimization**
  - [ ] Resize images to multiple sizes
  - [ ] Convert to WebP format with fallbacks
  - [ ] Generate thumbnails and previews
  - [ ] Compress for web delivery
  
- [ ] **File naming and organization**
  - [ ] Rename files with listing keywords
  - [ ] Organize in structured folder hierarchy
  - [ ] Generate SEO-friendly filenames
  - [ ] Maintain original filename mapping

### Photo Management Interface
- [ ] Photo gallery management in CMS
- [ ] Drag-to-reorder functionality
- [ ] Set primary photo selection
- [ ] Bulk photo operations (delete, reorder)
- [ ] Alt text editing for accessibility

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
- [ ] **Vercel Deployment** (via GitHub)
  - [ ] Connect GitHub repository to Vercel
  - [ ] Configure automatic deployments on commits
  - [ ] Configure custom domain (zuluniner.com)
  - [ ] Set up SSL certificates (automatic with Vercel)
  
- [ ] **Production configuration**
  - [ ] Environment variables setup
  - [ ] Database migration to production - **Note: Transition from Docker to hosted Supabase**
  - [ ] CDN configuration for assets
  - [ ] Monitoring and error tracking

### Supabase Deployment Notes
**Important**: This project uses Supabase with Docker for local development. For production deployment:

- [ ] **Supabase Cloud Setup**
  - [ ] Use existing production Supabase project (bjwlldxavgoxhyyufffy)
  - [ ] Copy database schema from local Docker setup to cloud
  - [ ] Run migrations: `npx supabase db push` (pushes local schema to cloud)
  - [ ] Update environment variables to point to cloud instance
  - [ ] Set up production Row Level Security (RLS) policies
  - [ ] Configure production storage buckets for images

- [ ] **Migration Process**
  - [ ] Export local data: `npx supabase db dump --data-only > data.sql`
  - [ ] Import to cloud: Use Supabase dashboard or CLI to import data
  - [ ] Test all functionality with cloud database
  - [ ] Update authentication providers if using social login
  - [ ] Verify all RLS policies work correctly in production

- [ ] **Environment Variables**
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://bjwlldxavgoxhyyufffy.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (server-side only)
  ```

- [ ] **Vercel Configuration**
  - [ ] Add environment variables in Vercel dashboard
  - [ ] Configure build settings (Next.js preset should auto-detect)
  - [ ] Set up preview deployments for pull requests
  - [ ] Configure production branch (typically `main` or `master`)
  - [ ] Test deployment with staging environment first
  - [ ] Configure custom domain (zuluniner.com) in Vercel dashboard
  - [ ] Update DNS in Cloudflare to point to Vercel
  - [ ] Verify SSL certificate auto-generation

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