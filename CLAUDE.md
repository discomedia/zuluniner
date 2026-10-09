# Development rules

- Write ECMA2022 TypeScript modules. Use existing generated schema/types; avoid authored `any`/`unknown` types and CommonJS `require`.
- Read current usages and export patterns before edits. UI/layout components use default exports, except named Card exports.
- Use server components for public content reads through the anonymous cached reads in `src/api/public-content.ts` and `src/api/db.ts`. Successful MCP content mutations must invalidate public tags/pages through `src/api/content-cache.ts`. Client components handle interaction. Wrap `useSearchParams` in Suspense.
- MCP writes belong in `src/mcp/content.ts` with schema validation in `src/mcp/schemas.ts`. Always initialize Supabase with the generated Database type. The service role is server-only; never import its client into client components.
- The `/connect` consent page is the only client Auth UI. There are no legacy admin/profile/AI routes. Do not add server generation APIs or AI credentials.
- Keep local credentials in ignored `.env`. Never commit credentials or OAuth tokens. Configure Vercel environments separately.
- Supabase is production project `bjwlldxavgoxhyyufffy`. Treat writes/migrations as production operations. Historical migrations are retained; do not recreate their old test accounts. Regenerate `src/api/schema.ts` after schema changes.
- MCP owner access requires the configured UUID allowlist and live admin profile. Keep read/write scopes, PKCE, single-use codes, refresh rotation, revocation and image network restrictions intact.
- Preserve omitted patch fields. Use revisions for stale edits. Batches are sequential partial-success operations; never claim transaction semantics.
- Complex changes require meaningful tests in `src/testing/*.test.ts`. Run `npm run verify` (typecheck, lint, tests, build) before finishing. Live tests use only unique disposable test content; protect existing data.
- Update README/operational docs when run, auth or deployment behavior changes. See `docs/content-mcp.md` and `docs/architecture.md`.
