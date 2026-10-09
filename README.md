# ZuluNiner

Aircraft listings and Markdown posts, built with Next.js, React, TypeScript and Tailwind. Vercel serves the site and its content MCP; Supabase provides Postgres, owner authentication and image storage. Cloudflare fronts the domain.

Public pages read active aircraft and published posts. Content is managed through the authenticated MCP at **https://zuluniner.com/api/mcp**. The site has no admin editor, AI generator, public account registration UI or AI API key. Agents prepare content and images using their own services.

## Development

Use Node 24 or 26. Run `npm ci`, `npm run dev`, and `npm run verify` (types, lint, tests and production build). Keep local configuration in the ignored `.env`.

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for public reads and owner sign-in.
- `SUPABASE_SERVICE_ROLE_KEY` for server-only content writes and private OAuth storage.
- `NEXT_PUBLIC_SITE_URL` for the canonical production origin.
- `ZULUNINER_MCP_OWNER_IDS` for a comma-separated allowlist of owner Auth UUIDs. Each must also have an admin profile in `users`. An empty allowlist denies all access.
- Optional `ZULUNINER_OAUTH_REDIRECT_URIS` for exact callback URLs of agents other than ChatGPT.

See [content MCP](docs/content-mcp.md) for tools, authorization, image handling and batch behavior, and [architecture](docs/architecture.md) for deployment details.
