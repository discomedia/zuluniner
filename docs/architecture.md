# Architecture

ZuluNiner uses Astro static output on Cloudflare Workers Static Assets. The same Worker handles `/api/*`, `/oauth/*`, `/.well-known/*` and `/images/*`; other requests go directly to static assets. The production domain is `zuluniner.com`, repository `discomedia/zuluniner`.

## Public site

`src/api/public-content.ts` reads active aircraft, their ordered galleries and published posts at build time in a read-only repeatable-read Neon transaction. Database failures stop the build. Generated pages contain the published snapshot; visitors never query Postgres. `content-manifest.json` records only public titles/slugs and the snapshot timestamp for deployment verification.

Aircraft browse hydrates the existing React filter/search/sort/pagination controls over the small published inventory and preserves query parameters. Other pages render React components only at build time or use native HTML/JavaScript for navigation, galleries, sharing and mailto forms. Markdown is rendered during the build. If inventory grows substantially, reconsider the full browser snapshot.

Images are stored in R2 as originals plus 480/960/1600-width WebP variants. Public image URLs are `/images/aircraft-photos/<path>` and `/images/blog-images/<path>`, with `?w=480`, `960` or `1600` for responsive variants. The Worker reads R2 and caches immutable objects at the edge. New uploads use Cloudflare Images at upload time, store the optimized result and variants once, and do not transform on every view. External absolute image URLs remain supported, but managed R2 paths are preferable.

Contact uses seller email/telephone links. The contact form opens an email draft; it does not claim to send mail. No payments, deposits or public accounts are implemented.

## Content and publication

`src/mcp` validates and manages posts, aircraft and images. Parameterized Neon HTTP queries run only in the Worker. Request configuration is isolated with AsyncLocalStorage. Gallery replacement and stale-revision checking are a single Postgres transaction; multi-item MCP batches retain per-item partial successes.

Successful content mutations save immediately, then dispatch GitHub Actions. Responses distinguish saved content from deployed public changes. `publish_status` reports the latest request; `publish_site` retries publication. Static routes appear/disappear only after a completed deployment. There is no periodic database polling or ISR process keeping Neon awake.

The workflow serializes deployments. GitHub may coalesce pending runs; a successful snapshot marks all publication requests older than its transaction timestamp deployed. Newer changes remain pending until a subsequent snapshot. Live checks compare the deployed manifest with the actual built manifest rather than a changing database. Failed builds retain the previous site; failures after deployment are reported and require investigation.

## Owner authentication and MCP OAuth

Neon Managed Auth provides owner email-code sign-in on `/connect`. Public signup and localhost access are disabled. Email codes currently use Neon's shared sender; custom SMTP credentials are needed before a broader authentication rollout. The preserved application owner UUID maps to the Neon identity via `users.auth_subject`. Signed identity JWTs are verified against the configured JWKS, issuer, audience and expiry before consent; a live admin profile and exact owner allowlist are also required.

The site's OAuth server preserves S256 PKCE, restricted callbacks, explicit consent, resource-bound opaque access tokens and rotating refresh families. Token hashes/claims live in the private `mcp_auth_records` Postgres table. Atomic inserts enforce one-use authorization codes, refresh claims and upload URLs. Access tokens last 15 minutes and refresh families 30 days. Refresh replay revokes the family. Existing Supabase-backed grants are not migrated: reconnect agents after cutover.

No database credentials or tokens enter client bundles. Read and write scopes are enforced for each MCP tool. Neon Auth tables are provider-managed and separate from application profiles. Images have no public write endpoint apart from signed, scoped uploads.

## Infrastructure and rollback

Cloudflare Worker: `zuluniner`; R2 bucket: `zuluniner-images`; Neon project: `crimson-pine-91526170`, Singapore, branch `main`. Operator commands use Wrangler and Neon tools. Runtime secrets are listed in README. The Neon free-plan autosuspend default is retained; static visits require no compute.

`db/migrations/001_initial.sql` defines the migrated application tables, owner mapping, OAuth/publication records and gallery function. Existing application IDs and image paths are preserved. The local ignored backup includes every original row and public image. Historical Supabase migrations are archived, not active tooling.

The existing Vercel/Supabase deployment is retained during the transition. Vercel automatic Git deployments are disabled to keep its original production snapshot intact. The Cloudflare domain route can be removed for immediate traffic rollback to the original DNS origin. Any content saved after cutover must be separately copied back before a data rollback; the retained source database does not receive new edits automatically.
