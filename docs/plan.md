# ZuluNiner MVP Development Plan

## Project Overview
ZuluNiner (zuluniner.com) is an aircraft marketplace built with Next.js, React, Tailwind CSS, TypeScript, and Supabase. The platform enables aircraft listings, search/filtering, photo galleries, and blog content with a custom CMS.

**Target Audience**: Aircraft community (primarily older men) - design must evoke trust and reliability.

## Core Project Data
- **Project Name**: ZuluNiner
- **Supabase project ID**: bjwlldxavgoxhyyufffy
- **GitHub Repository**: [discomedia/zuluniner](https://github.com/discomedia/zuluniner)
- **Domain**: zuluniner.com

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage, Type-safe functions). Use local terminal `supabase` commands to build out the backend, including migrations, types, and policies.
- **Deployment**: Netlify or Railway (free tier with custom domain)
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

## Stage 1: Project Setup & Foundation

### Core Setup
- [ ] Initialize Next.js project with TypeScript and Tailwind CSS
- [ ] Configure ESLint, Prettier, and TypeScript strict mode
- [ ] Set up project structure with proper folder organization
- [ ] Configure environment variables for development/production
- [ ] Set up Git workflow with proper .gitignore. Publish to discomedia/zuluniner repository
- [ ] Create package.json with all required dependencies

### Development Environment
- [ ] Install and configure @discomedia/utils package
- [ ] Set up VS Code workspace with recommended extensions
- [ ] Configure TypeScript paths for clean imports
- [ ] Set up development scripts (dev, build, lint, type-check)

---

## Stage 2: Database Schema & Supabase Setup

### Supabase Configuration
- [x] Create Supabase project
- [ ] Configure environment variables. (Supabase project id: bjwlldxavgoxhyyufffy)
- [ ] Set up authentication (email/password, social providers if needed)
- [ ] Configure Row Level Security (RLS) policies
- [ ] Set up Supabase Storage buckets for images
- [ ] Generate TypeScript types from Supabase schema

### Database Schema Design
- [ ] **Users table** (extends auth.users)
  - [ ] Profile information (name, company, phone, location)
  - [ ] User roles (admin, seller, buyer)
  - [ ] Created/updated timestamps
  
- [ ] **Aircraft table**
  - [ ] Basic info (title, description, price, year, make, model)
  - [ ] Technical specs (hours, engine type, avionics, etc.)
  - [ ] Location data (airport code, city, country, lat/lng)
  - [ ] Status (active, sold, pending)
  - [ ] SEO fields (slug, meta description)
  - [ ] Created/updated timestamps, user_id foreign key
  
- [ ] **Photos table**
  - [ ] aircraft_id foreign key
  - [ ] Storage path, alt text, caption
  - [ ] Display order, is_primary flag
  - [ ] Optimized file sizes and formats
  
- [ ] **Blog_posts table**
  - [ ] Title, slug, blurb, content (markdown)
  - [ ] Header photo, SEO fields
  - [ ] Published status and timestamps
  - [ ] Author (user_id foreign key)
  
- [ ] **Categories/Tags tables** (if needed for filtering)

### Type Safety Setup
- [ ] Configure Supabase CLI for local development
- [ ] Set up automatic type generation workflow
- [ ] Create type-safe database client wrapper
- [ ] Set up migration scripts

---

## Stage 3: Core UI Components & Design System

### Design System Foundation
- [ ] Define color palette (professional, trustworthy colors)
- [ ] Select typography (readable fonts for older users)
- [ ] Create spacing and sizing scales
- [ ] Design component tokens (borders, shadows, etc.)
- [ ] Create Tailwind CSS custom configuration

### Core Components
- [ ] **Layout Components**
  - [ ] Header with navigation
  - [ ] Footer with contact info
  - [ ] Page layouts (full-width, contained, sidebar)
  
- [ ] **UI Components**
  - [ ] Button variants (primary, secondary, ghost)
  - [ ] Form inputs (text, select, file upload, textarea)
  - [ ] Cards (aircraft listing, blog post)
  - [ ] Modal/Dialog components
  - [ ] Loading states and spinners
  - [ ] Error and success messages
  
- [ ] **Navigation Components**
  - [ ] Main navigation menu
  - [ ] Breadcrumbs
  - [ ] Pagination
  - [ ] Search bar with filters

### Responsive Design
- [ ] Mobile-first responsive breakpoints
- [ ] Desktop-optimized layouts (primary audience)
- [ ] Touch-friendly interface elements
- [ ] Accessibility considerations (WCAG compliance)

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
- [ ] **Platform evaluation** (Netlify vs Railway)
  - [ ] Compare pricing and features
  - [ ] Test deployment process
  - [ ] Configure custom domain (zuluniner.com)
  - [ ] Set up SSL certificates
  
- [ ] **Production configuration**
  - [ ] Environment variables setup
  - [ ] Database migration to production
  - [ ] CDN configuration for assets
  - [ ] Monitoring and error tracking

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