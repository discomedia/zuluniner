# Content MCP

Endpoint: **https://zuluniner.com/api/mcp** (Streamable HTTP, OAuth).

Add it as a private/custom MCP plugin in ChatGPT, choose OAuth, sign in with the configured owner email and approve the listed permissions. Public registration is disabled in the consent UI. A registered client uses S256 PKCE; only official ChatGPT callbacks and explicitly configured agent callback URLs are accepted.

## Tools

| Tool | Purpose |
| --- | --- |
| `list_content` | Search aircraft/posts, including drafts, with pagination. |
| `get_content` | Read exact IDs or slugs, including aircraft galleries. |
| `list_sellers` | Get existing seller IDs for attribution. |
| `create_posts`, `update_posts` | Supplied Markdown, titles, slugs, metadata, header images and publication. |
| `create_aircraft`, `update_aircraft` | Supplied specifications, descriptions, metadata, seller and listing status. |
| `delete_content` | Permanently remove exact IDs; aircraft gallery records cascade. |
| `upload_images` | Import public HTTPS or small raw base64 JPEG/PNG/WebP; normalize to WebP. |
| `begin_image_upload` | Issue a two-hour scoped signed URL for a local binary image. |
| `set_aircraft_images` | Replace/reorder an ordered gallery, choose its cover, change alt text/captions or clear it. |

Mutation tools and `get_content` take `{ "items": [...] }`, with 1–20 items. Batches run sequentially and **are not transactions**. Results include `atomic:false`, success/failure counts and indexed per-item results. A failure does not roll back successful siblings. Retry only failed items. A malformed batch fails validation before any operation runs.

Posts default to `published:false`; aircraft default to `status:"draft"`. Explicitly set `published:true` or `status:"active"` to publish. Price is USD whole dollars, matching the site's display. Null clears nullable fields; omitted patch fields are preserved. Read before editing and supply `expected_updated_at` for stale-edit protection.

Upload images first, then use the returned `storage_path` as a post `header_photo` or gallery entry. Use `public_url` for inline Markdown images. Remote imports reject private/reserved network destinations and optimize to WebP. Base64 is limited to about 1.5 MiB per image, with a 3 MiB total MCP request limit. Use HTTPS imports or signed uploads for larger files. Signed upload URLs are secrets: never include them in published content. Directly uploaded images must be JPEG, PNG or WebP within the bucket's size limit.

Gallery replacement uses compensating writes rather than a database transaction; a failed operation instructs the agent to reread the actual gallery. Clearing a gallery or deleting content preserves image files so shared images remain usable. Unpublish for reversible removal; `delete_content` permanently removes database records.

## Access and operations

Read tools require `content:read`; mutations require `content:write`. Grants are resource-bound and require the configured owner allowlist plus a live admin profile. Consent is explicit. Tokens are opaque; only their hashes name private storage records. Authorization codes and rotating refresh tokens have single-use claims. Access tokens last 15 minutes; refresh families last 30 days. Replaying a refresh token revokes its family. `/oauth/revoke` accepts an access or refresh token with its `client_id` and revokes that connection. Removing an owner UUID from configuration disables all their connections after deployment.

Never expose the service-role key or auth bucket. No OpenAI API key is required. Auth storage must be a private `zuluniner-mcp-auth` bucket accepting JSON; create it with the service role. Expired records may be pruned by an operator, retaining revocation markers until their token family can no longer be valid. Back up current content before bulk edits.

`npm run test:live:mcp -- https://zuluniner.com` is an explicit mutation test, using the local service key to authenticate the configured owner and creating only test-prefixed disposable records. It checks batches, supplied images, optimistic edits, auth failures, refresh rotation and revocation. It never deletes existing records. The public aircraft requested for the Chrome/ChatGPT test is separate and retained.

## Legacy database hardening

Live testing confirmed that the original authenticated profile policy allows a user to assign their own admin role. The MCP independently rejects non-allowlisted users, but this does not close direct access through old database policies. Apply `supabase/migrations/20261009000001_retire_legacy_client_writes.sql` using the owning Supabase project account. It removes browser table writes and old storage upload policies and makes the signup trigger assign only buyer roles. This preserves public reads and server service-role writes. The available management account cannot access this project, so do not assume the migration is applied merely because it is in Git.
