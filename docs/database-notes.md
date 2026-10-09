# Database notes

Application schema: `db/migrations/001_initial.sql`. Runtime row types: `src/api/schema.ts`; mutation inputs: `src/mcp/schemas.ts`.

`users`, `aircraft`, `aircraft_photos` and `blog_posts` preserve the original UUIDs and relationships. Application profile IDs are independent of Neon Auth IDs; `users.auth_subject` maps the configured owner. Authentication tables in `neon_auth` are provider-managed. Server-side queries enforce owner permissions; browsers receive published static data, with no Postgres credentials or browser write client.

`mcp_auth_records` stores hashed OAuth token records and atomic one-use claims. `site_publications` tracks queued/building/deployed/failed static builds. Expired OAuth rows can be pruned by an operator, but retain family revocations until the maximum family lifetime has passed. No scheduled pruning/refresh job is configured.

`replace_aircraft_gallery` locks the parent listing, checks an optional revision, replaces the ordered gallery and updates the parent timestamp atomically. Other patches whitelist validated columns and preserve omitted fields. A batch is not a transaction across items.

The operator-only `scripts/migrate-data.ts` imports the ignored pre-migration backup into a new empty application schema and checks row counts. It is not a recurring production seed. `scripts/migrate-images.ts` copies the original public assets to R2, builds responsive variants with Sharp, and records resumable progress in ignored local backup files. Sharp is build/operator tooling, not a Worker dependency.

Build reads use a repeatable-read transaction. Public content is refreshed by a deployment rather than database queries on page visits. After a direct SQL edit, invoke `publish_site` to publish the new snapshot.
