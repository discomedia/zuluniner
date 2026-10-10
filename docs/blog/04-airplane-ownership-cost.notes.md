# Article 04 publication record

Published on 10 October 2026 at 8:18 a.m. EDT after preparation for the stored 8:16 a.m. slot. Live article: [Airplane ownership at 50, 100 and 200 hours a year](https://zuluniner.com/blog/airplane-ownership-cost-50-100-200-hours/). The media plan now records 4 of 36 published and 32 unpublished IDs.

Article: [04-airplane-ownership-cost.md](04-airplane-ownership-cost.md). Post identity, revision, metadata and uploaded cover path: [04-airplane-ownership-cost.metadata.json](04-airplane-ownership-cost.metadata.json). Original cover and exact built-in generation prompt: [04-generation-prompt.json](images/04-generation-prompt.json). The editable calculator is served from `public/blog/airplane-ownership-cost-worksheet.xlsx`.

## Inventory reconciliation and backup

The connector's complete inventory contained exactly articles 01–03, all published on 9 October 2026 Eastern, with no overlapping draft. The live content manifest matched those three posts. Full records were retained before content mutations in ignored `data/backups/blog-before-draft-04-2026-10-10.json`. No existing posts or aircraft were deleted or replaced.

## Research checked on 10 October 2026

* [Boulder Municipal Airport leasing](https://bouldercolorado.gov/services/airport-hangar-and-tie-down-leasing): 2026 T-hangar rates and reported seven-to-eight-year wait. Rates do not establish availability.
* [Bell Aviation Services / ROMISOFT rates](https://www.romisoft.aero/services/rates/): annual-inspection group prices effective 1 February 2026. The inspected rate sheet doesn't confirm shop region or the scope of corrective work. The article explains these limits and doesn't use the prices as a regional benchmark or its own budget inputs.
* [United Flight Services aircraft rentals](https://united-flight.com/aircraft-rentals/) and [location](https://united-flight.com/contact/): Watsonville, California; posted wet/Hobbs rates by individual 172 variant. No effective date is supplied on the rate page, so the article identifies the access date rather than inventing one.
* [Avemco pilot-information form](https://quote.avemco.com/Forms/FRM0021-PilotInfo.pdf): certificate, ratings, total/recent hours and make/model experience requested. No individualized premium quote was obtained.
* [AOPA operating-cost calculator](https://aopa.org/go-fly/aircraft-and-ownership/operating-costs-calculator): input-based fixed/variable estimates.
* [Current §91.409](https://www.ecfr.gov/current/title-14/section-91.409): annual/calendar provisions, 100-hour instruction trigger and exceptions. The short eCFR URL returned the provision successfully, current through 7 October 2026; initial full-path/API requests were blocked. The article keeps inspection claims within the accessed text.
* [AOPA co-ownership guide](https://www.aopa.org/~/media/Files/AOPA/Home/Flying%20Clubs/Website%20Documents/Guide%20to%20Aircraft%20Co-Ownership): agreement checklist, responsibilities and cash calls. No legal-structure recommendation is made.
* [2023 owner account on buying for training](https://www.reddit.com/r/flying/comments/16ptju2/): indexed full discussion retrieved, including downtime and management concerns. Used as a dated audience signal, not current cost evidence. The older 2021 ownership thread was inaccessible and wasn't quoted or used for a factual price claim.

All budget values, repair cases, finance terms, capital-rate and resale assumptions are explicitly hypothetical. No current aircraft appraisal, performance test, owner experience, interview or independent professional review is claimed.

## Draft checks

The original 3:2 cover was inspected, then exported as a 1,536 × 1,024 WebP and uploaded. It contains no text and represents a fictional aircraft. Descriptive alt text is in the static blog-cover mapping.

The calculator was authored and recalculated with Artifact Tool. Results match the article's 50/100/200-hour tables, including recurring cash, reserves, rental and co-ownership. Representative storage/fuel changes, missing fixed input, zero reserve hours, zero co-owners and zero/blank flying hours were checked; base values were restored. No formula errors remained. Summary and input ranges were rendered and inspected for clipping and legibility. Native Excel/Numbers execution was not separately tested.

The loan example was independently calculated from a USD 68,000 principal, 7% annual rate and 60 monthly payments: monthly payment USD 1,346.481501; first-year payments USD 16,157.778009, interest USD 4,387.116668 and principal USD 11,770.661341. Public figures are rounded and describe unrounded calculations.

Article wording was scanned against the style guide. Rendering through the site's Markdown component confirmed all 10 contents targets, six scrolling tables, the worksheet link and classifieds link, with no scripts. The connector read-back matched the saved article after trailing-whitespace normalization and confirmed `published=false`.

`PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run verify` passed: type checks, lint, all 13 tests, static build and Worker dry run. The draft-save deployment [38044086188](https://github.com/discomedia/zuluniner/actions/runs/38044086188) completed successfully while the public inventory stayed at three articles. The subsequent source release supplies the worksheet and cover-alt mapping; its terminal result is retained in the ignored publishing state.

## Publication verification

The full inventory contained three published articles and this exact draft before publication; none had a 10 October Eastern publication date. The draft body matched the saved source, and its revision was checked again. Complete records were backed up in ignored `data/backups/blog-before-publish-04-2026-10-10.json` before updating this ID with its revision guard.

`PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run verify` passed again before release, including all 13 tests. [Content deployment 38051456113](https://github.com/discomedia/zuluniner/actions/runs/38051456113) completed successfully. The connector reported deployed/public changes live, and the live manifest contained exactly articles 01–04.

The live article and blog card display the expected title, publication date, metadata and cover alt text. The article has one H1, ten working contents targets and no hydrated island. All internal links, including aircraft classifieds and related articles, returned successfully. The downloadable calculator matches the local workbook byte for byte.

The original and 480/960/1600-requested cover variants returned successfully and retained 3:2 proportions; the largest request preserves the 1,536-pixel original without upscaling. Desktop (1,280 × 900) and phone (390 × 844) screenshots were inspected. Titles and text fit, the cover loads, contents navigation reaches its heading, and wide tables scroll inside their containers without widening the phone page. Native Excel/Numbers execution remains untested; workbook formula and render checks are described above.

The final scoped plan/metadata commit triggers a further source deployment. Its terminal workflow result is retained in the ignored publishing state after verification.
