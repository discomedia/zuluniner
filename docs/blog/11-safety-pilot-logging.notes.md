# Article 11 preparation record

Prepared on 18 October 2026 Eastern. **Published and verified; publication details below.** Reserved publication: **18 October at 8:23 a.m. EDT**, or 11:23 p.m. Australia/Melbourne that day, converted with IANA timezone data. The same heartbeat automation was moved to this preserved target before drafting. Its early 5:57 a.m. preparation wake started immediately.

Draft ID: `3c58e13b-a0e2-4776-9154-1dcaecf8e12c`. Saved revision: `2026-10-18T10:09:30.641678+00:00`. Slug: `safety-pilot-pic-cross-country`. Draft-save publication ID: `df4dbc2e-cd73-40d8-805f-d42b6e5e145a`. Read the latest revision again at publication; use that exact ID with its current revision guard. Canonical URL: [Safety-pilot time](https://zuluniner.com/blog/safety-pilot-pic-cross-country/).

The full connector inventory and live manifest contained nine published articles and no overlapping draft before creation. A complete inventory backup was saved under ignored `data/backups/` before production mutation. Topic 10 was considered first and [deferred for its missing evidence](10-lean-of-peak.blocker.md). Topic 11 is the lowest eligible unpublished topic. Counts remain **9 published, 27 unpublished**, including blocked topic 10.

## Evidence and boundaries

Current eCFR pages inspected on 18 October displayed Title 14 as updated through 15 October 2026:

- [14 CFR §1.1](https://www.ecfr.gov/current/title-14/section-1.1): command responsibility and PIC definition.
- [§61.51](https://www.ecfr.gov/current/title-14/section-61.51): sole-manipulator and required-crew PIC bases, SIC, instrument time, training time and logbook particulars.
- [§91.109](https://www.ecfr.gov/current/title-14/section-91.109): current paragraph (c), other control seat, ratings, visibility and functioning controls.
- [§61.1](https://www.ecfr.gov/current/title-14/section-61.1): purpose-specific cross-country definitions; instrument-rating definition requires a qualifying landing point strictly more than 50 NM from original departure, with navigation. Generic and ATP definitions differ.
- [§61.65](https://www.ecfr.gov/current/title-14/section-61.65): instrument-airplane experience and training requirements, including paragraph (d)(1)'s cross-country PIC requirement and its stated exception.
- [FAA Gebhart interpretation, 22 June 2009](https://www.faa.gov/media/14521): both PDF pages read. Pilot conducting the complete flight receives cross-country credit; safety pilot required only for the simulated-instrument segment does not. Article explains that its old §91.109(b) reference is now paragraph (c).
- [FAA Beaty interpretation, 23 January 2013](https://www.faa.gov/media/12606): both PDF pages read, including the footnote recognizing SIC logging. Distinguishes a safety pilot in a normally single-pilot airplane from a designated SIC subject to §61.55. Article retains its own narrower VFR/VMC facts rather than importing every IFR fact from this letter.

The [Pilots of America audience question](https://www.pilotsofamerica.com/community/threads/can-a-safety-pilot-log-cross-country-time.116199/) was inspected through search-index excerpts, including disagreement about logging. Direct thread access failed; a full reading of the thread is not claimed. It establishes audience interest, not technical authority. eCFR API XML downloads returned HTTP 406; current rendered eCFR text was available and read instead. FAA Hicks commentary was also inspected but is not used as an article authority.

The six scenarios are original fictional teaching cases, not copied FAA test questions or actual logbooks. All assume qualified private ASEL pilots with appropriate current medical certificates, a normally single-pilot airplane, functioning dual controls, day VFR/VMC, and no instruction. Alex flies every takeoff, landing and intervening segment; Blair never manipulates the controls. Flights total 1.4 hours, with 1.0 hour under the hood when specified. Cross-country credit is explicitly restricted to §61.65(d)(1); IFR/IMC, BasicMed, student pilots, split takeoff/landing cases and other certificate definitions need separate checks. No instructor or legal review is claimed.

The matrix separates local SIC, overlapping PIC, command without a logging basis, a qualifying 60 NM landing, exactly 50 NM, and a long flight with no away landing. Distance conversions checked: 50 NM = 92.6 km; 60 NM rounds to 111 km. The worksheet separates responsibility, logging authority, instrument time and cross-country purpose.

## Original cover and static assets

The built-in image generator created an original aircraft-focused 3:2 illustration, then one framing refinement moved both wingtips inside the image. The final image was inspected as generated and after conversion to sRGB WebP. It depicts a parked fictional high-wing trainer and two occupants; no actual aircraft inspection, flying event or individual pilot is represented. Exact prompts and selection are in `images/11-generation-prompt.json`.

The signed prepared-family helper uploaded and verified `mcp/fc41e790-74e4-431b-baec-6994764fa001-safety-pilot-logging-cover.webp`, bypassing Cloudflare Images transformations. Signed credentials remain ignored under `data/`; no signed URL is included in source artifacts.

| Variant | Dimensions | Bytes |
| --- | --- | --- |
| Original | 1536 × 1024 | 191810 |
| 480 | 480 × 320 | 23178 |
| 960 | 960 × 640 | 72096 |
| 1600 | 1536 × 1024 | 191810 |

Descriptive alt text is in the existing static `src/lib/blog-covers.ts` mapping. The downloadable Markdown worksheet is byte-identical to its editorial source.

## Preparation validation

Node 24 `npm run verify` passed, including all 39 tests, Astro/TypeScript, lint, published-data build and Worker dry run. A local production-renderer check passed eight contents targets, one six-row scenario table, original-case assertions, distance checks, worksheet identity and the style guide's literal banned wording scan. No hydrated article island is introduced.

Desktop preview at 1280 × 900 and phone preview at 390 × 844 were inspected with production page styles. The cover and heading render correctly. Phone width stays 390 pixels; the scenario table has its own horizontal overflow container. Clicking the scenarios contents link reaches its matching heading. These are draft previews; live article/card/metadata/contents and device checks must be repeated after actual publication.

The article links to available aircraft browsing and the live ownership-cost and aircraft-loading guides. The worksheet's live URL requires the source deployment. Preparation deployment results are recorded below when terminal success is confirmed. Do not mark the media-plan checkbox complete until the publication workflow and all live checks pass.

## Verified publication — 18 October 2026 Eastern

Published the exact prepared draft at **9:04 a.m. EDT**, after its reserved 8:23 a.m. target and within the morning window. The save connection closed without returning a result. Full inventory readback established `published=true`, with published/revision timestamp `2026-10-18T13:04:39.997361+00:00`; no second publication mutation was sent. Publication `d21450b1-ddce-4731-8f25-48be7ad39e18` reports deployed, and [content workflow 39129968040](https://github.com/discomedia/zuluniner/actions/runs/39129968040) succeeded at 9:06 a.m. EDT.

Node 24 `npm run verify` passed again, including 39 tests. Live checks passed the article and blog card, canonical/Open Graph/description metadata, descriptive cover alt text, exact original and all three WebP variant bytes, eight contents targets, the scenario table, byte-identical 2,185-byte worksheet, all internal links and the absence of a hydrated article island. Desktop 1280 × 900 and phone 390 × 844 were inspected; the phone stays 390 pixels wide and the table scrolls within its container. Contents navigation reaches its target. Additional live verification finished after 10 a.m.; the publication and deployment themselves completed within the authorized window.

The media plan now records **10 published, 26 unpublished**, including blocked topic 10. Topic 12 is next eligible. In a finally step, the same automation was reset to 19 October 6 a.m. Eastern; its new uniformly selected publication target is **19 October 9:06 a.m. EDT**, or **20 October 12:06 a.m. Australia/Melbourne**, using IANA timezone conversion. Prompt, kind, destination, status and notification settings were preserved and read back.
