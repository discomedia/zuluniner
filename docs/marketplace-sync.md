# Programmatic marketplace maintenance

## Required workflow from 15 October 2026

The 14 October four-object benchmark was too small to establish daily performance. The actual next runs exposed two remaining scaling costs: 3,636 Controller objects used 31.6 minutes of paced REST uploads; Trade-A-Plane explicitly forced one lane and used 38.3 minutes for 1,828 objects. Both rewrote the complete receipt file after every upload and every byte check. Long media phases held the release lock and made other chats wait. A transient route response also triggered whole-workflow retries. These findings supersede the original media instructions below.

The production transport is now **R2 S3 with six bounded lanes**, not Cloudflare's management API. `uploadObjects` in `scripts/marketplace/media.mjs` defaults to S3; `s3.mjs` verifies the existing token and derives its documented S3 credential pair in memory. It creates no credentials and changes no permissions, secrets, bindings or bucket configuration. The existing ignored `data/cloudflare-env.json` supplies the R2-authorized token and account ID. Do not substitute a Wrangler OAuth token. REST is retained only as an explicit diagnostic `transport:'rest'`; do not fall back to it automatically during daily work. The S3 path has no management-API pacing interval, but retains bounded concurrency, request timeouts, Retry-After handling, byte verification and source-path/lock checks.

`receipts.mjs` appends small per-object journal records and writes a complete compatibility snapshot once per batch. It replays an interrupted journal on startup, preserves verified receipts and discards only an incomplete trailing append. All transfer lanes settle before an error is returned, so using six lanes does not leave writes running after a release lock is freed. A no-change repeat writes no snapshot and makes zero requests. Never erase receipts to force a rerun.

The source entrypoints have been updated directly:

- Controller: `data/marketplace-sync/controller/upload-media-v2.mjs`.
- Trade-A-Plane: `data/marketplace-sync/trade-a-plane/native-media.mjs`, used by its existing guarded publisher.
- Barnstormers: `data/marketplace-sync/barnstormers/daily-media-upload.mjs`, with 256-object batches and no artificial pause between batches.

They explicitly select S3 and six lanes. Reuse these entrypoints and existing prepared families, mappings, owners, IDs, slugs and storage paths. Do not reconstruct an uploader or run a new benchmark during routine ingestion. Never use one lane, one CLI invocation per object, or the failing image-conversion endpoint as an unattended fallback. If the tested path fails, preserve checkpoints and report the concrete failure.

### Evidence at useful scale

On 15 October, a live test uploaded **512 new objects, 68,586,578 bytes**, through the same uploader used by the jobs. All 512 exact public-byte checks passed in **40.907 seconds** using six S3 lanes and one complete receipt snapshot. A repeat made **zero requests and zero snapshot writes**. All 512 isolated test keys were deleted and confirmed absent via S3. Precondition checks and cleanup are outside the timed upload phase. The old 500 ms management-API interval alone would require at least 255.5 seconds for 512 writes, before transfer and verification latency.

A 3,636-object contract test exercises the same signing, scheduling, receipt and verification code with simulated HTTP responses. It asserts 3,636 writes, 3,636 byte checks, at most six in-flight operations, one complete snapshot, a zero-request repeat, crash recovery and settlement of active lanes before an error returns. This is a scale/correctness test, not a measured production network runtime.

The three actual source upload entrypoints were also replayed against isolated copies of their completed state with networking forcibly disabled. Controller reused 3,636 objects in 196 ms, Trade-A-Plane reused 1,828 in 108 ms, and Barnstormers reused 2,500 in 354 ms, with zero network requests. This integration test caught and corrected a Barnstormers retry guard that rejected newly staged, fully verified images merely because they were absent from the pre-import gallery. Such images now require their complete exact family receipts; legacy paths still require prior audit evidence. The sandbox changed no live source state or database records.

The live static-site checker was measured against all **650 public routes**. The old checker took **40.669 seconds and 1,297 requests**. The replacement took **4.375 seconds and 656 requests**. It reads and validates each title and page body together, with six lanes; it still requires the exact deployed manifest and checks every public route plus protected/absent endpoints. Bounded route retries handle transient 404/429/5xx and network failures. Persistent failures, wrong titles, a wrong snapshot, credential leaks and unwanted hydration still fail. Tests cover transient and permanent failures.

Raw reports and reproducible experiment scripts are under `data/marketplace-sync/experiments/2026-10-15/`. Full next-day ingestion runtime is still to be measured; report phase timings rather than claiming a network benchmark is an end-to-end speedup.

### Daily execution and recovery rules

1. Use the existing discovery, capture, qualification and guarded import helpers. Each stable source ID is captured at most once per run; checkpoints survive tool/model interruptions. Retain all current syndicated IDs and pending items in the next queue. Do not cap daily new intake at 100.
2. Record healthy paginated discovery separately from publication. `progress.mjs` provides `completeDiscovery` and `captureQueue`: a complete discovery can advance `last_successful_discovery_at` while unknown detail IDs remain explicit retry members. Never freeze discovery behind one broken photo/ad and recrawl an expanding historical window every day. Never advance incomplete/challenged discovery, discard pending IDs, or mark a failed publication complete. When adapting legacy state, preserve its existing pending records and owner data.
3. Download and prepare only missing/changed media before the publication lock. Use the S3 entrypoints above; retain compatible old paths and audit evidence. No receipt means no assumed verification. Optional failed source documents stay recorded; do not spend lock-wait time reworking them or repeatedly checking unchanged database rows.
4. Keep the shared lock for the guarded save, required release checks and deployment. Perform one source-batch save and one publication. While waiting, use one interruptible wait/backoff loop with a durable wait record; do not shell-poll or emit the same update repeatedly.
5. On a transient deployment-check failure, retry the check on the **existing deployment** first. Do not rerun the entire publisher, backups, imports, local verification or uploads. If a newer terminal-success deployment contains the saved batch, confirm its snapshot is after the save and verify every affected page, full text, source link and gallery against it; record that coalesced deployment. Checkpoint the workflow ID, saved revision, successful route checks and verification phase. Redeploy only when evidence shows the published assets are actually missing/wrong and bounded retries cannot recover.
6. Advance publication state only after terminal workflow success and affected-route verification. Emit a concise result with discovery/capture/media/save/build/deploy/lock-wait timings, request/object counts and remaining unknowns. Record the helper version and actual S3 concurrency in the run report. Do not redesign shared code during daily ingestion; report a measured regression for the parent review.

The source availability policy is unchanged: ambiguous responses retain public status; verified sold and repeated healthy-source absence follow the existing reversible rules. Preserve all backups, revision guards and owner edits.

The three daily local chats keep the existing discovery, archive, owner/revision guards, backup, batch import and publication policy in `data/marketplace-sync/README.md`. The checked-in operator helpers below replace repeated interactive capture and per-object CLI startup. They never run in browser bundles or the production Worker.

## Small-scale experiments, 14 October 2026

All captures read live source pages. No aircraft, galleries, blog posts, permissions or database rows were changed by these experiments. The measured upload comparison used eight unique temporary R2 objects. A preliminary attempt used eight other keys and hit an expired cleanup timeout; recovery confirmed their deletion before the measured retry. All sixteen test keys were removed and their absence confirmed through the storage API. Raw captures and detailed reports are ignored under `data/marketplace-sync/experiments/`.

| Experiment | Result |
|---|---|
| Node HTTP, Controller and Trade-A-Plane | Both discovery and detail returned 403. Keep ordinary browser access; do not retry challenges aggressively. |
| Barnstormers, ten existing ads, HTTP concurrency two | Ten complete captures in 6.4 seconds. Most had no gallery; four photo links were captured. |
| Barnstormers, five ads with large galleries | All five descriptions matched the existing archive; all 100 image identities and their order matched. 15 requests took 8.9 seconds, then 4.3 seconds on a repeat. |
| Controller, three complete browser detail captures | 14.0 seconds, then 23.7 seconds; 48 ordered photo links. Both content and asset fingerprints matched on repeat. |
| Trade-A-Plane, three complete browser detail captures | 18.3 seconds, then 23.7 seconds; 33 ordered photo links. Both fingerprints matched. Existing source pacing was retained. |
| Same prepared WebP photo family, four objects, four Wrangler processes | 33.6 seconds for writes. |
| Same photo family, one paced Node process | 2.75 seconds including all four uploads and exact public-byte verification: 12.2 times faster in this small sample. |
| Repeat Node media upload using verified receipts | Zero network requests and zero uploads. |

Browser measurements exclude initial tab creation and include per-page navigation/extraction and checkpoint writes. Browser speed varied on repeat. These are small capture/transport trials, not measured full daily-job runtimes. New-photo transfer volume, source limits and build/deployment still cost time. Raw CDP resource blocking was unavailable in the current browser runtime and was not used.

## Capture helpers

Use Node 24 and npm. Install dependencies with `npm ci`. `linkedom` is pinned as an operator dev dependency. `scripts/marketplace/extractors.mjs` contains fixed DOM readers; parsing never executes source page scripts. `capture.mjs` validates source identity, checkpoints raw evidence and records separate stable content/asset fingerprints. It does not publish or mark a source run successful.

Barnstormers detail sampling:

```sh
node scripts/marketplace/capture.mjs --source barnstormers --sample 10 --output data/marketplace-sync/experiments/sample
```

For the daily job use `--all` for every managed source listing and `--discover` for paginated discovery with two overlap days, each into a fresh run directory. The discovery command reads `last_successful_discovery_at` or `last_successful_run_at`, or accepts `--since <ISO timestamp>`. It records all categories as candidates: qualification still excludes non-aircraft, promoted duplicates, wanted and lease-only offers. Never infer a full daily coverage check from an experimental sample, skip gallery checks using `--availability-only`, or advance a successful boundary after an unknown/partial run. If a request budget is exceeded, discovery fails rather than claims coverage.

Controller and Trade-A-Plane use `captureBrowser(tab, {source, candidates, directory})`, imported from `capture.mjs` inside `cua_repl` with a supported tab. Pass deduplicated `{id, url}` candidates combining complete recent discovery with every currently syndicated source record and pending archived items. Process remaining candidates in batches; the default 45-second batch limit yields control for progress updates. Three-listing experiments did not relax Trade-A-Plane's 6.5-second minimum pacing. The helper returns results and saves `details/<source-id>.json`. Stop/reconcile on a blocked source; failures are unknown and preserve public status. No standalone driver, cookie export, challenge bypass or private API access is required.

The capture shapes retain the existing source helpers' raw fields. For Controller, copy complete validated captures into its existing `captures/<id>.json` with immutable timestamp evidence before invoking `archive.mjs`. For Trade-A-Plane, `details/<id>.json` matches the current archive input directory. For Barnstormers, direct captures also write the existing `browser/detail-`, `gallery-`, `zoom-` and `complete-` files; the directory name does not imply browser transport. Review discovery qualification and metadata using the existing source helper before importing. Keep new fingerprint checkpoints separate from legacy hashes: first reconcile against existing archive fields and image identities, never reimport everything merely because a hash format changed.

Barnstormers' random numeric photo query suffixes are excluded from asset identity, while its image pathname/version remains significant. Trade-A-Plane's encoded CloudFront JSON is canonicalized by key order. The original source URLs remain in audit evidence. Gallery order, captions and document links matter. Unknown currency/year/manufacturer values remain unknown.

## Media helpers

`prepareFamily` in `scripts/marketplace/media.mjs` converts a local, validated source photograph with Sharp once: WebP quality 85, bounded main image, and 480/960 variants only when narrower than the main. Prepare before holding the production lock. Reuse complete known source hashes and existing storage paths; do not generate replacement paths for unchanged images. Do not store a 1600 copy: `?w=1600` serves the main object. `storageObjects` filters legacy cached plans and is also enforced by `uploadObjects`, so retries cannot recreate removed copies. Actual object counts vary from one to three per photo. Retain historical receipts; verify only the normalized stored-object list.

`uploadObjects` uses the existing Cloudflare operator token, source release-lock token and account ID supplied in memory. It uploads only objects without exact verified receipts, uses the six-lane S3 transport described above, respects Retry-After, journals successful objects and verifies newly published bytes exactly. Credentials never enter manifests or reports. It rejects another source's object paths and never writes aircraft records or performs cleanup. Keep receipts in that source's ignored operator directory. A matching verified immutable receipt skips both upload and network verification on retries. Unverified receipts recover only the affected object.

Use the [documented S3 credential derivation](https://developers.cloudflare.com/r2/api/tokens/#get-s3-api-credentials-from-an-api-token). Cloudflare's [API overview](https://developers.cloudflare.com/r2/api/) directs high-throughput work to S3 or Workers bindings. The management API's shared rate limit is why six REST lanes alone were insufficient. Existing Wrangler tooling remains available for operational recovery.

Verify each new media object's public bytes once and retain its receipt. After publication still verify terminal workflow success, the deployed manifest and every affected listing's text/source link/gallery ordering. Avoid re-fetching every unchanged gallery and every old variant at each release. Legacy paths without trustworthy prior verification need an audit before receipt reuse; never fabricate a verification receipt. A periodic independent media audit can check immutable storage separately. Preserve the existing exact revision and owner checks, backup and reversible source-availability policy. `npm run verify` remains required before release and runs the operator tests as well as the existing app checks.

The local schedules still run at 07:00 Controller, 08:00 Trade-A-Plane and 09:00 Barnstormers, Australia/Melbourne. These optimizations do not turn protected sources into an unattended HTTP-only cloud crawler; they retain the supported local browser for those sources. Any future hosted migration needs a separately verified source-access path.

## Image storage compaction (29 October 2026)

The main optimized WebP is the only largest-size object. All public image URLs, including `?w=1600`, retain their contracts. New preparation omits 480/960 objects when the main image is already no wider than the requested width. Legacy prepared multipart uploads remain accepted but redundant objects are discarded. Controller, Trade-A-Plane and Barnstormers entrypoints normalize old cached families with `storageObjects` before upload and receipt verification. Preserve source paths, owner guards, source archives and historical receipts; do not rerun retired repair/upload scripts to recreate 1600 copies. The cleanup inventory and recoverable object backups are retained under ignored `data/storage-audit-2026-10-29/`.
