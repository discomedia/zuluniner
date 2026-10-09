# ZuluNiner operations

Use Node 24 and npm. Public pages are Astro static output; React hydration belongs only in aircraft browse. Keep ordinary pages and interactions static/native unless there is a clear need for a framework island. Database reads belong in build-only public-content or server-side Worker code, never browser bundles.

Run `npm run verify` before release. It generates Worker binding types from Wrangler, checks Astro/TypeScript, lints, runs unit tests, builds published data and dry-runs the Worker. `DATABASE_URL` is required for builds. Production pushes to master run the deploy workflow; verify terminal workflow success and live routes. MCP changes are asynchronous publications; a database save is not a completed public deployment.

Keep credentials in ignored `.env`, `.dev.vars`, or operator files under ignored `data/`. Never print or commit them. Preserve existing IDs, slugs, image paths and owner permissions during migrations. Back up before production mutations; live test cleanup must target only IDs created by the current test.

Use `wrangler secret` for Worker secrets and GitHub repository secrets for builds. `wrangler.jsonc` contains only public configuration. Regenerate binding types after changing bindings. Runtime request state must remain isolated; no module-global mutable owner/environment state.

See README and docs/architecture.md for infrastructure, deployment and rollback. Historical Supabase notes are archived and do not describe current runtime behavior. Never remove the retained old infrastructure as part of routine release cleanup.
