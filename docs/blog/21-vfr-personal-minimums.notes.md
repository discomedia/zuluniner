# Article 21 preparation record

Prepared on 23 October 2026 Eastern. **Unpublished draft.** Reserved publication: **23 October at 9:42 a.m. EDT**, or **24 October at 12:42 a.m. Australia/Melbourne**, converted using IANA timezone data. The 5:59 a.m. Eastern preparation wake started immediately. Before drafting, this same heartbeat was moved to the stored publication target and its saved settings were read back. Prompt, kind, destination, status and notification settings were preserved.

Slug: `vfr-personal-minimums`. Draft ID and latest revision are in the adjacent metadata file and ignored publishing state. At publication, read and inspect that exact draft and use its latest revision guard. The expected canonical URL is `https://zuluniner.com/blog/vfr-personal-minimums/`; preparation does not make it live.

## Reconciliation

The full connector inventory contained 14 published posts and no drafts. The live manifest contained those 14 articles and 1,486 aircraft. Titles, slugs and matching content were checked for overlap; existing articles discuss related loading, proficiency and equipment questions without covering this planned decision worksheet and three trip scenarios. A complete inventory backup was saved to ignored `data/backups/blog-before-draft-21-oct23.json` before production mutation. Existing posts and aircraft were preserved.

Topic 21 is the lowest eligible unpublished ID. Topics 10, 12, 15 and 17–19 keep their recorded evidence blockers. Totals stay **14 published, 22 unpublished**, including those six blocked IDs and this prepared draft. No exhaustion alert is due.

## Sources actually inspected

* [Current §91.155](https://www.ecfr.gov/current/title-14/section-91.155): altitude/airspace-specific visibility and cloud distances, exceptions and controlled-surface-airport provisions. The limited Class E example is identified as one row; it doesn't replace the full rule. The eCFR display was updated through 21 October 2026, last amended 15 October.
* [Current §91.103](https://www.ecfr.gov/current/title-14/section-91.103): preflight familiarity requirement, scope of paragraph (a), runway and applicable performance information under paragraph (b). No complete compliance determination is claimed.
* [FAA Personal Minimums catalog](https://www.faa.gov/newsroom/safety-briefing/personal-minimums) and its [February 2015 two-page publication](https://www.faa.gov/sites/faa.gov/files/2022-01/Personal%20Minimums.pdf): the baseline, recent experience, mission adjustment and pressure-free revision framework were read. This is older guidance still hosted by FAA, not a new 2026 regulation. Its abbreviated weather-category description is not used as a legal definition. No published example limits were adopted as recommendations.
* [FAA PAVE checklist, four pages](https://www.faa.gov/sites/faa.gov/files/2022-11/PAVE_0.pdf): pilot, aircraft, environment and external pressures, combined risks, terrain/weather uncertainty and practical alternatives. No crosswind example from it is represented as an aircraft limit.
* [FAA discussion of avoiding VFR flight into instrument weather](https://www.faa.gov/blog/clearedfortakeoff/silver-linings-silver-bullets-and-other-fictions-avoiding-vfr-flight), last updated 1 July 2026: personal minimums, risk assessment, briefing, proficiency and fictional flight planning. The article does not repeat the source's accident statistics or substitute a rating or equipment for a trip assessment.
* [Audience discussion](https://www.reddit.com/r/flying/comments/1rnhbuu/are_these_good_personal_mins_for_a_new_private/): the question, proposed limits and replies were read. Used to identify uncertainty about copying other pilots' limits. No comment is treated as technical authority, an interview or ZuluNiner flying experience.

All 11 cited external and related/browse links returned HTTP 200 in the Node link check. An initial Python check failed on the local interpreter's certificate trust; the subsequent Node check used normal certificate validation and succeeded. No certificate checks were bypassed.

## Original teaching material and checks

Three fictional trips cover deteriorating return conditions, unfamiliar terrain with a route-information gap, and passenger pressure after a delay changes a daylight assumption. They provide no numerical recommended minimums or clearance to fly. The tabletop exercise and worksheet are original; no actual briefing, flight, pilot assessment or instructor review is claimed.

Metric conversions in the limited regulatory example were checked: 10,000 ft × 0.3048 = 3,048 m; 3 statute miles × 1.609344 = 4.828032 km, rounded to 4.8 km; 500/1,000/2,000 ft = 152.4/304.8/609.6 m, rounded to 152/305/610 m. The text tells readers to use the rule's stated units for compliance and preserves its altitude reference. No recommendations to descend under cloud, improvise a mountain passage or practice an escape maneuver are supplied.

The worksheet and public copy match byte for byte. The production renderer passes eight contents targets, one table with three body rows, the literal banned-word scan and a 156-character description. The final draft has 1,985 words, including its title and contents. Node 24 `npm run verify` passed, including all 39 tests, Astro/TypeScript, lint, the static build and Worker dry run; a final rerun covers the expanded abbreviations and clarified scenario wording.

## Cover and preview

Built-in image generation produced an original 3:2 high-wing-airplane illustration outside a rural hangar, with distant hills and layered clouds. The generated image and final WebP were inspected; the whole airplane is visible, no people or text appear, and the scene does not purport to establish flyable weather. Exact prompt and source path: `images/21-generation-prompt.json`; project asset: `images/vfr-personal-minimums-cover.webp`.

The signed prepared-family helper uploaded and byte-verified the original and 480/960/1600 WebP variants without Cloudflare Images transformations. Original/1600: 1536 × 1024, 128,322 bytes; 480: 480 × 320, 21,594 bytes; 960: 960 × 640, 59,686 bytes. Signed credentials remain in ignored `data/`. Only the verified storage path is attached; descriptive alt text uses the existing static mapping.

The actual public article template and production Markdown renderer were used for an explicitly unpublished local preview. Desktop 1280 × 900 and phone 390 × 844 cover/title/body rendering were inspected. On phone, the page stays 390 pixels wide; the table's 358-pixel parent contains overflow. Keyboard activation of the fictional-trips contents link reached the heading. Temporary viewport settings were reset and the preview tab was closed. Repeat live article/card, metadata, image-family, contents, worksheet, link and device checks at publication before marking this ID complete.
