# Content MCP

Endpoint: **https://zuluniner.com/api/mcp** (Streamable HTTP, OAuth).

Add it as a private/custom MCP plugin in ChatGPT, choose OAuth, sign in with an emailed code for the configured owner email and approve the listed permissions. Public registration is disabled in the consent UI. A registered client uses S256 PKCE; only official ChatGPT callbacks and explicitly configured agent callback URLs are accepted.

## Tools

| Tool | Purpose |
| --- | --- |
| `list_content` | Search aircraft/posts, including drafts, with pagination. |
| `get_content` | Read exact IDs or slugs, including aircraft galleries. |
| `list_sellers` | Get existing seller IDs for attribution. |
| `publish_site`, `publish_status` | Queue a static rebuild or check the latest publication. |
| `create_posts`, `update_posts` | Supplied Markdown, titles, slugs, metadata, header images and publication. |
| `create_aircraft`, `update_aircraft` | Supplied specifications, descriptions, metadata, seller and listing status. |
| `delete_content` | Permanently remove exact IDs; aircraft gallery records cascade. |
| `upload_images` | Import public HTTPS or small raw base64 JPEG/PNG/WebP; normalize to WebP. |
| `begin_image_upload` | Issue a two-hour scoped signed URL for a local binary image or prepared WebP family. |
| `set_aircraft_images` | Replace/reorder an ordered gallery, choose its cover, change alt text/captions or clear it. |

Mutation tools and `get_content` take `{ "items": [...] }`, with 1–20 items. Batches run sequentially and **are not transactions**. Results include `atomic:false`, success/failure counts and indexed per-item results. A failure does not roll back successful siblings. Retry only failed items. A malformed batch fails validation before any operation runs.

Posts default to `published:false`; aircraft default to `status:"draft"`. Explicitly set `published:true` or `status:"active"` to publish. Price is USD whole dollars, matching the site's display. Null clears nullable fields; omitted patch fields are preserved. Read before editing and supply `expected_updated_at` for stale-edit protection.

For source ads, `price`, `year` and `make` accept null when unknown. `price_text` preserves a quote with unconfirmed currency or other sale terms; numeric `price` remains confirmed USD only. Flight hours may contain decimals. Optional `source_url` (HTTPS), `source_name` and `source_seller` retain attribution and direct enquiries to the original listing. The importing owner remains the record owner; source seller names do not create accounts.

Upload images first, then use the returned `storage_path` as a post `header_photo` or gallery entry. Use `public_url` for inline Markdown images. Remote imports accept configured trusted HTTPS hosts, reject private/reserved addresses and redirects to untrusted hosts, and optimize to WebP. Other sources can be downloaded locally and uploaded using a signed URL. Base64 is limited to about 1.5 MiB per image, with a 3 MiB total MCP request limit. Use HTTPS imports or signed uploads for larger files. Signed upload URLs are secrets: never include them in published content. Directly uploaded images must be JPEG, PNG or WebP up to 10 MiB and 40 million pixels. Optimized originals and responsive variants are stored once in R2.

Each gallery replacement uses one Postgres transaction, including its optional revision check. Multi-item batches remain non-atomic. Clearing a gallery or deleting content preserves image files so shared images remain usable. Unpublish for reversible removal; `delete_content` permanently removes database records.

### Uploading without Cloudflare Images transformations

For local covers, prefer the prepared-family path. It uses the existing Sharp dependency locally, then uploads the original and all responsive variants through the same signed, scoped, single-use URL. It does not call Cloudflare Images or require a plan change. A `9422` transformation-quota error on ordinary import is a signal to use this path immediately, rather than retrying identical transformations on later days.

1. Back up the affected content and call `begin_image_upload` with the correct kind and filename. Save its complete connector result (or its data object) to an ignored receipt JSON file. The receipt contains a credential; never log it.
2. Run with Node 24: `node --import tsx scripts/upload-prepared-image.ts SOURCE_FILE RECEIPT_JSON OUTPUT_DIRECTORY`. Use an ignored output directory under `data/`.
3. The helper decodes, auto-orients and converts the source to metadata-free WebP, bounds the original to 1600×1600 without enlargement, and prepares widths 480/960/1600. It PUTs multipart fields `original`, `480`, `960` and `1600`; total request size is limited to 10 MiB. The 1600 variant is byte-identical to the optimized original. The server checks the complete static WebP containers, dimensions and aspect ratios before writing anything. It stores the original last and cleans up this new family on a storage failure.
4. The helper verifies the exact public bytes, format and dimensions of all four objects and writes `verified-upload.json`. Its output contains public paths only. Attach that verified `storage_path` using `update_posts` or `set_aircraft_images`, with the current revision guard. Verify the resulting content deployment separately.

If upload verification is interrupted, rerunning with the same receipt/output directory reuses its successful upload result and repeats verification. An expired or already-used receipt without a saved success needs a fresh `begin_image_upload` call. Existing raw binary PUTs and remote/base64 imports remain supported through Cloudflare Images; neither authentication nor upload limits are relaxed.

## Access and operations

Read tools require `content:read`; mutations require `content:write`. Grants are resource-bound and require the configured owner allowlist plus a live admin profile. Consent is explicit. Tokens are opaque; only their hashes name private storage records. Authorization codes and rotating refresh tokens have single-use claims. Access tokens last 15 minutes; refresh families last 30 days. Replaying a refresh token revokes its family. `/oauth/revoke` accepts an access or refresh token with its `client_id` and revokes that connection. Removing an owner UUID from configuration disables all their connections after deployment.

Content saves are immediate, but public pages are static. Successful content batches return a `publishing` object with a publication UUID and `public_changes_live:false`; they queue a GitHub Actions rebuild. Use `publish_status` until the latest request reports `deployed`. Failed triggers/builds preserve saved content; use `publish_site` to retry. Publication typically takes a few minutes and may coalesce closely spaced edits. Direct SQL changes need an explicit rebuild.

Never expose database credentials, signing secrets or identity/access tokens. No OpenAI API key is required. OAuth records live in a private Postgres table. Expired records may be pruned by an operator, retaining revocation markers until their token family can no longer be valid. Back up current content before bulk edits.

Existing Supabase owner sessions and agent grants do not transfer. Reconnect the agent using the same endpoint and the Neon owner sign-in code. Read-only connections cannot publish or mutate.

`npm run test:live:mcp -- <origin>` is an explicit mutation test requiring a fresh owner identity JWT (`OWNER_IDENTITY_TOKEN`) and server-side `DATABASE_URL` for targeted cleanup. It creates only uniquely prefixed disposable records and validates CRUD, partial batches, gallery transactions, uploads, OAuth scopes, PKCE, refresh rotation and replay revocation. It can publish a clearly labelled temporary test post; run only as an authorized release check. It never deletes pre-existing content. Verify static publication/removal separately after the workflow completes. The pre-existing public MCP test aircraft is retained.
