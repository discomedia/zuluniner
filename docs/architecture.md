# Architecture

## Project Overview
ZuluNiner is an aircraft marketplace built with Next.js, React, Tailwind CSS, TypeScript, and Supabase. The platform supports aircraft listings, search, photo galleries, and blog content.

## Core Project Data
- Project Name: ZuluNiner
- Supabase project ID: bjwlldxavgoxhyyufffy
- Database: Production Supabase Cloud only
- GitHub: discomedia/zuluniner
- Domain: zuluniner.com (Cloudflare DNS)

## Tech Stack
- Frontend: Next.js 14+, React, TypeScript, Tailwind CSS
- Backend: Supabase (DB, Auth, Storage, type-safe functions)
- Deployment: Vercel (frontend), Supabase Cloud (backend)
- Content Generation: @discomedia/utils (LLM)
- Image Processing: Next.js Image, Supabase Storage

## Architecture Notes
- Next.js App Router for performance and SEO
- Full TypeScript with Supabase types
- Supabase Storage + Next.js Image for images
- React Server Components + client state
- Tailwind CSS with custom tokens

## Security
- Row Level Security (RLS) for all data
- Input validation and sanitization
- Rate limiting on content APIs
- Secure file upload with type validation
- XSS protection

## Scalability
- Database indexing for search
- Image CDN
- Caching for frequent data
- API rate limiting
- Performance monitoring

## Supabase & Database
- Production Supabase Cloud database only
- Migrations in supabase/migrations/
- TypeScript types generated from production schema
- RLS policies for all tables
- Storage buckets for images

## Type Safety
- Supabase CLI for local dev
- Automatic type generation
- Type-safe db client wrapper
- Migration scripts

## Database Architecture
- All db operations via src/api/db.ts
- Centralized client management
- Server-side client factory
- Auth client integration
- Organized db API structure
- Generated types for all ops
- Nullable field handling
- Custom types for joins
- Consistent error patterns
- Transaction support
- Compile-time validation
- No direct Supabase usage in UI

## Data Fetching Architecture
- All db ops in server components
- Client components for interactivity only
- Hybrid pattern for pages needing both
- Production issues fixed by server-side fetching

## Developer Workflow
- Use server components for data fetching
- Use client components for UI interactivity
- Always test with `npm run build`
- Use migration scripts for db changes
- Use type-safe db functions
- No direct Supabase in components

## Deployment
- Vercel deployment via GitHub
- Automatic deployments on push
- Custom domain and SSL (Cloudflare)
- Production config in .env.production
- CDN for assets
- Monitoring and error tracking

## Supabase Deployment Notes
- Production Supabase Cloud database only
- Push schema changes with `npm run db:push`
- All env vars point to production
- Test all RLS policies in production
- Storage buckets for images in production

## Schema Update Workflow
1. Create migrations in supabase/migrations/
2. Push schema changes to production with `npm run db:push`
3. Generate updated types with `npm run generate-schema`
4. Test changes thoroughly in development
5. Commit and push to GitHub (triggers Vercel deploy)

## Project Structure

### Source Directory
- src/api/: Supabase config, schema, db functions
- src/app/: Next.js App Router pages
- src/components/: React components
- src/lib/: Utility libraries
- src/types/: TypeScript types

### Database Structure
- supabase/migrations/: SQL migration files
- supabase/config.toml: Supabase config

## Legal & Business Model
- ZuluNiner under Disco Media Pty Ltd (Australia)
- Revenue: Listing fees, possible auction success fees
- Payment: Stripe
- Age: 18+ only
- Data: Stored in Supabase (US/EU)
- Analytics: Google Analytics
- Emails: Transactional/account only
- Governing Law: Australia
