# Article 07 preparation record

Prepared on 14 October 2026 Eastern for the persisted **8:09 a.m. EDT** target. The post was initially incomplete because its cover upload was blocked. **That blocker is now resolved; the existing draft is ready but unpublished.** Do not publish it while `header_photo` is null or the cover/variants remain unverified. Totals remain six published and 30 unpublished planned IDs.

Article: [07-cessna-172-180-conversions.md](07-cessna-172-180-conversions.md). Draft identity, latest revision and asset blocker: [07-cessna-172-180-conversions.metadata.json](07-cessna-172-180-conversions.metadata.json). Original comparison checklist: [07-cessna-172-180-conversion-checklist.md](07-cessna-172-180-conversion-checklist.md), copied to `public/blog/cessna-172-180-conversion-checklist.md`.

## Reconciliation and clock

The full post inventory contained six published planned articles and no draft or close-overlap conversion guide. The live manifest matched those posts and contained 451 aircraft at this check. No post had a 14 October Eastern publication date. The retired original 172/180 ad is not reused; the draft links to general classifieds and four existing related articles, all checked as HTTP 200.

The 5:58 a.m. Eastern wake began preparation within the ten-minute early allowance. Before drafting, the same automation was moved to the stored 8:09 a.m. Eastern target, converted with IANA `America/New_York` and `Australia/Melbourne` timezone data to 11:09 p.m. Melbourne. The saved prompt, kind, name, thread destination, active status and notification settings were verified unchanged. No random time was rerolled and no second schedule was created.

Complete post records were backed up before mutations in ignored `data/backups/blog-before-draft-2026-10-14.json`. Existing posts, aircraft and user-owned marketplace changes were preserved.

## Research and limits

Primary sources inspected on 14 October:

* [FAA STC explanation](https://www.faa.gov/aircraft/air_cert/design_approvals/stc).
* Air Plains [FAQ](https://www.airplains.com/faq), [172 installation page](https://www.airplains.com/cessna172-180hp), [172R comparison](https://www.airplains.com/post/_172r), [weight-increase options](https://www.airplains.com/post/useful-load) and [reference-performance page](https://www.airplains.com/post/172-180hp-performance-data).
* Air Plains [supplement 172051, public reference copy](https://yokota374fss.com/wp-content/uploads/2024/03/airplane_flight_manual-172051.pdf). Applicability, revision pages and page-specific status were inspected. The PDF is retained under ignored `data/research/07-air-plains-172051.pdf`. Its reference-copy status does not establish a current revision or an individual airplane's installation.
* [FAA weight-and-balance chapter](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/phak/12_phak_ch10.pdf), current [§91.9](https://www.ecfr.gov/current/title-14/section-91.9), [§91.417](https://www.ecfr.gov/current/title-14/section-91.417) and [§61.31](https://www.ecfr.gov/current/title-14/section-61.31). Accessed eCFR text displayed coverage through 9 October 2026, stated in the article.

Audience discovery included the recent [172/180 versus 182 discussion](https://www.reddit.com/r/flying/comments/1usyevu/172180_conv_vs_182/) and the older [missing-supplement/performance question](https://www.reddit.com/r/flying/comments/gqbk3y). Forum opinions, prices, speed claims and experience were not adopted as technical evidence.

The three loading cases, assumed fuel density and worksheet are original and explicitly hypothetical. No actual aircraft logbook, installation inspection, current insurer terms, price quotation, interview, independent A&P/IA review or CFI review is claimed. The source-based approval comparison does not certify any aircraft. Those independent reviews and an aircraft-record-based case study remain possible editorial enhancements.

The FAA performance-chapter fetch failed, and a §61.1 fetch returned 503. Neither is cited as inspected evidence; the draft does not reproduce a complex-airplane definition or an aircraft performance calculation. The scanned 172041 supplement was discovered but is not used for an unverified numerical claim.

## Cover and upload blocker

Built-in imagegen produced the original fictional aircraft illustration, inspected locally and converted to a 1,536 × 1,024 WebP (3:2). Final file: [cessna-172-180-conversion-cover.webp](images/cessna-172-180-conversion-cover.webp). Exact prompt and generated source: [07-generation-prompt.json](images/07-generation-prompt.json). It has no embedded text and does not depict an actual classified aircraft or documented installation.

`upload_images` failed with `IMAGES_TRANSFORM_ERROR 9422: Free unique transformations by account has been exhausted`. The supported `begin_image_upload` route was also tried with the already-optimized WebP; its binary PUT returned HTTP 500. Source inspection confirms both paths use the same Cloudflare Images transformations. No runtime, billing or account setting was changed. Signed upload credentials are retained only in ignored operator data.

The article was saved through the connector as `published=false` without a header photo, with the blocker recorded in metadata and ignored state. The same draft ID and revision must be reused. Restoring image-transform capacity and successfully uploading/verifying the cover and responsive variants are required before publication; changing topics does not resolve this shared upload failure.

## Preparation checks

The final editorial banned-word check passed after excluding citation URLs from the prose scan. Rendering confirmed ten contents targets, three tables and no script or hydrated framework island. All three loading rows were parsed from the Markdown and verified against the assumed fuel calculation; metric/imperial conversions were reviewed. The public worksheet matches its source exactly.

Node 24 `npm run verify` passed. Draft read-back, local desktop/phone preview and terminal deployment outcomes are recorded in ignored publishing state after those checks complete. A draft save and ancillary deployment do not complete publication. At the next wake, reconcile current inventory, the actual Eastern clock and the cover blocker before any publication mutation.

The exact connector draft body and metadata matched the saved files on read-back. A private preview with the local cover was inspected at 1,280 × 900 and 390 × 844: title/cover fit, contents navigation reached the loading section, and all tables stay in their scrolling containers. Phone page width is 390 pixels. The preview does not demonstrate a successful production cover upload. Temporary viewport settings were reset and the review tab closed.

## Publication wake: 14 October 2026 Eastern

The complete seven-post inventory still contained six published posts and this exact unpublished draft. The draft body and revision matched the saved source, and no post had a 14 October Eastern publication date. The live manifest contained the six published articles. Current records were backed up under ignored `data/backups/blog-before-publish-attempt-07-2026-10-14.json`. The style/contents/three-row loading checks and Node 24 `npm run verify` passed again.

A fresh connector cover-upload attempt returned the same `IMAGES_TRANSFORM_ERROR 9422` exhausted-transformation error. No publication update was sent, no cover was attached, and the draft was not marked complete. The existing signed path was not retried because both paths had already been established to use the same failing transformation service. Image-transform capacity must be restored before cover upload and responsive-variant verification can succeed.

The finally step moved this same automation to 15 October at 6 a.m. Eastern (9 p.m. Australia/Melbourne), with a newly selected uniform random target of 8:51 a.m. Eastern persisted for that date. Prompt, kind, name, destination, status and notification settings were read back unchanged. The same draft ID/revision and all local artifacts are retained; totals remain six published and 30 unpublished IDs. The scoped record deployment and final live unpublished-state check are saved in ignored publishing state.

## 15 October preparation recheck

At the 6 a.m. Eastern preparation wake, the same automation was moved first to the existing 8:51 a.m. EDT publication reservation (11:51 p.m. Australia/Melbourne, converted with IANA timezone data). Its prompt, kind, destination, name, active status and notification setting were preserved. The seven-post inventory and live six-post manifest were reconciled; no post had a 15 October Eastern publication date. The retained draft body and metadata matched the local source after normalizing trailing whitespace, and its revision remained unchanged. No new draft was created.

The original cover was retried through the connector after a full ignored inventory backup. It again returned `IMAGES_TRANSFORM_ERROR 9422: Free unique transformations by account has been exhausted`. No header or publication update was made. State advances to the publication phase with `preparation_complete=false` and the cover blocker retained, so the reserved wake can retry without duplicating the article. Local article checks passed: 10 contents targets, three tables, three hypothetical loading rows, no banned wording and a matching downloadable worksheet. Totals remain six published and 30 unpublished; no exhaustion alert is due.

Node 24 `npm run verify` passed. Live checks returned HTTP 200 for classifieds, all four related articles and the byte-identical worksheet; the unpublished article route returned HTTP 404 as expected. The source-record deployment result is retained in ignored publishing state.

## 15 October publication attempt

The publication wake arrived shortly before its reserved time. The early interval was used to read the article and metadata, reconcile the complete seven-post inventory with the live six-post manifest, compare the exact draft ID/revision and check for an existing 15 October Eastern publication. The draft matched after trailing-whitespace normalization; no new post was published that date. Full records were backed up in ignored `data/backups/blog-before-publish-attempt-07-2026-10-15.json`.

The original cover upload again failed with `IMAGES_TRANSFORM_ERROR 9422: Free unique transformations by account has been exhausted`. The run continued through the 8:51 a.m. EDT reservation after an interruptible wait. The article's 10 contents targets, three tables, three hypothetical loading rows, wording scan and matching worksheet passed. The missing cover and unverified responsive variants still prevent publication; no post update was sent.

The finally step moved the same active automation to 16 October at 6 a.m. Eastern (9 p.m. Australia/Melbourne), with a newly selected uniform random publication minute of 9:33 a.m. EDT stored for that date. IANA timezone conversion was used and the prompt, kind, destination, name, status and notification setting were read back unchanged. The existing draft ID, revision and local artifacts are held. Totals stay six published and 30 unpublished, so no exhaustion alert is due. Source-record deployment and final live checks are recorded in ignored publishing state.

Node 24 `npm run verify` passed for this record release. Live classifieds, four related articles and the byte-identical worksheet returned HTTP 200; the unpublished article route returned HTTP 404.

## Cover upload fix — 16 October Australia/Melbourne (15 October Eastern)

The owner requested a permanent repair rather than another identical quota retry. The Worker now accepts a complete, locally optimized WebP family through its existing scoped, signed, single-use upload URL. The new helper `scripts/upload-prepared-image.ts` uses the existing Sharp dependency, decodes the source, prepares the original and 480/960/1600 variants, and verifies each public object byte for byte. No Cloudflare Images transformations or billing change are required for this path. Ordinary imports still use Cloudflare Images, with an actionable quota error pointing to the prepared upload path. Both paths prepare every variant before writing the original, with cleanup of the new family on storage failure.

Node 24 `npm run verify` passed, including 39 tests. New cases cover JPEG/PNG/WebP, small images, missing/duplicate/truncated/non-WebP/incorrect-size variants, failed storage cleanup, scope, expiry and replay. Source fix `f2db107aaec4a316a40171d1ff8024bc60dc7f83` deployed successfully in workflow 38794400531.

The live prepared upload succeeded. The original and 1600 variant are 1536×1024 (129,358 bytes); 480 is 480×320 (20,520 bytes); 960 is 960×640 (57,156 bytes). All four public responses matched the prepared bytes and decoded as WebP. The thumbnail was inspected. The verified path is `mcp/d181bcbb-d1c3-4301-96c3-78410dc90166-cessna-172-180-conversion-cover.webp`; it was attached to the existing draft with its revision guard and `published=false`. The exact ID and source text were preserved. Metadata and ignored state record the new revision and clear the blocker.

The same automation's prompt now uses prepared local cover uploads, so quota error 9422 does not become another daily retry. With preparation complete, its next wake moves directly to the reserved 16 October 9:33 a.m. EDT publication (17 October 12:33 a.m. Australia/Melbourne), using IANA timezone conversion. The morning restriction is preserved unless the owner explicitly approves an immediate one-off publication. This record does not mark the post published; totals remain six published and 30 unpublished until live article verification.

The draft preview was inspected again with the exact optimized cover at 1280×900 and 390×844. The image loaded at 1536×1024, the page had no horizontal overflow, all 10 contents targets existed, and wide tables scrolled within their own containers. This is draft-preview evidence; live article/card inspection is still required after publication. The final Node 24 `npm run verify` check passed.
