# Architecture

ZuluNiner runs on Next.js App Router on Vercel, behind Cloudflare at zuluniner.com. The Supabase project is `bjwlldxavgoxhyyufffy` and the repository is `discomedia/zuluniner`.

## Public site

Server components read active aircraft and published posts through `src/api/db.ts`, using the anonymous, schema-typed Supabase client. Listing and detail routes render dynamically so MCP changes appear on the next request. Next.js Image serves assets from public Supabase `aircraft-photos` and `blog-images` buckets.

The existing seller contact flow uses email/telephone links. There is no implemented payment/deposit backend. There are no public admin, profile or registration pages.

## Content management

`src/mcp` contains validated content operations, image handling and authorization. `/api/mcp` exposes Streamable HTTP through `mcp-handler` and the MCP server SDK. It supports batch CRUD for aircraft and posts, gallery replacement/reordering and supplied image uploads. Markdown is supplied by the calling agent. No server code invokes an LLM or image-generation API.

Writes use the service-role key exclusively on the server. MCP grants additionally require an explicitly allowlisted owner UUID and a live `users.role=admin` profile. The anonymous public client never receives that key.

## OAuth

Supabase's native OAuth server is disabled in this project. The site's OAuth authorization-code server uses S256 PKCE, restricted registered callbacks, explicit owner consent, resource-bound opaque access tokens and rotating refresh tokens. Owner sign-in uses Supabase Auth. OAuth records contain hashed token names in the private `zuluniner-mcp-auth` storage bucket, with no policies permitting public access. Storage uniqueness provides single-use claims across Vercel instances. Access tokens expire in 15 minutes; connection families expire in 30 days. Revocation invalidates the entire family. See the MCP guide.

Public OAuth discovery endpoints describe the server and protected resource. Browser origin checks protect MCP and consent requests; per-tool scopes enforce read/write permissions.

## Deployment and verification

Vercel receives the environment variables listed in README. GitHub pushes deploy the site; the Vercel CLI can deploy the same checkout. Node 24 is the production runtime. Supabase table schemas and public images are retained. Historical SQL migrations describe the original schema; they are not a current list of application routes or capabilities.

Run `npm run verify` before release. `npm run test:live:mcp -- <origin>` explicitly runs mutation tests against a deployed site, creating and removing only uniquely named test content. It does not change existing listings or posts. Chrome testing separately checks the actual ChatGPT connection and leaves the requested public test aircraft.
