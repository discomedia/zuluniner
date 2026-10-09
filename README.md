# ZuluNiner

A static aircraft marketplace and Markdown blog built with Astro, TypeScript and Tailwind. Cloudflare serves the site, images and authenticated content MCP. Neon provides Postgres and owner authentication; Cloudflare R2 stores images.

Pages are generated at build time. Browsing/search/filtering runs locally over the small public inventory. Only the aircraft browse controls hydrate React; the rest of the public site uses static HTML and small native scripts. Public visits do not query the database.

Content is managed through **https://zuluniner.com/api/mcp**. MCP saves queue a GitHub Actions rebuild; public changes appear after successful deployment. There is no admin editor, public signup or site-side AI generation.

## Development

Use Node 24. Run `npm ci`, then `npm run dev`. Put `DATABASE_URL` in the ignored `.env` for build-time content reads. Run `npm run verify` for generated Worker types, Astro/TypeScript checks, lint, tests, static build and Worker dry-run.

`npm run worker:dev` serves the built site and API with local bindings; rebuild first. Local R2 is separate from production. Keep local Worker secrets in the ignored `.dev.vars`.

## Deployment

Pushes to `master` and content publications run `.github/workflows/deploy.yml`. It builds one consistent published-content snapshot, deploys the Worker and assets together, checks live routes against the snapshot, then records publication status. A failed build leaves the existing deployment available. Changes made directly in SQL require `publish_site` or a workflow dispatch.

GitHub secrets: `DATABASE_URL`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

Worker secrets, set with `wrangler secret put` or `wrangler secret bulk`:

- `DATABASE_URL`: server-only Neon connection string.
- `OWNER_PROFILE_IDS`: comma-separated application profile UUIDs allowed to manage content. Each also needs `users.role='admin'` and an `auth_subject` matching their Neon Auth user. Empty denies access.
- `GITHUB_DEPLOY_TOKEN`: token allowed to dispatch this repository's deploy workflow.
- `UPLOAD_SIGNING_SECRET`: random secret for scoped, single-use image uploads.

Public URLs/bindings are configured in `wrangler.jsonc`. Optional `OAUTH_REDIRECT_URIS` permits additional exact OAuth callback URLs; optional `IMAGE_IMPORT_HOSTS` permits trusted HTTPS image hosts. Public owner registration is disabled in Neon Auth.

See [architecture](docs/architecture.md), [content MCP](docs/content-mcp.md), and [database notes](docs/database-notes.md). Migration utilities and local backups are for operator use; backups and credentials are ignored. The previous Vercel/Supabase deployment is retained for rollback, with historical SQL in `docs/archive/supabase`.
