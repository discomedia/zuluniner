# Article 07 preparation record

Prepared on 14 October 2026 Eastern for the persisted **8:09 a.m. EDT** target. The post is **unpublished and incomplete because its cover upload is blocked**. Do not publish it while `header_photo` is null or the cover/variants remain unverified. Totals remain six published and 30 unpublished planned IDs.

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
