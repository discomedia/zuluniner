# Article 31 — passenger currency and proficiency preparation

Prepared **31 October 2026 Eastern** for the preserved **8:39 a.m. EDT** publication target. The preparation wake arrived at 5:55 a.m. Eastern, within the authorized early allowance. Before drafting, the same heartbeat was moved to 11:39 p.m. Australia/Melbourne on 31 October using IANA conversion; its saved prompt, kind, destination, status and notification settings were verified unchanged. Preparation never authorizes early publication.

Draft ID: `143805be-79de-45f6-a84f-dd87243c700d`. Unpublished revision: `2026-10-31T10:05:38.114899+00:00`. Draft-save publication ID: `9746df87-1084-4b09-b13a-c374847de6ae`. The connector readback matched ID, revision, title, slug, Markdown, blurb, description, cover path and `published=false`. Intended canonical URL after publication: `https://zuluniner.com/blog/passenger-currency-proficiency/`.

The draft-save [workflow 41191332466](https://github.com/discomedia/zuluniner/actions/runs/41191332466) completed successfully. The post remains unpublished; the supporting-source deployment is checked separately after the scoped push.

## Reconciliation and evidence gates

The full connector inventory contained 20 posts, all published, and no drafts. The live manifest also contained 20 published articles and no passenger-currency article. IDs, slugs, titles and close topic overlap were checked; articles 20 and 21 address flight-review preparation and personal minimums, while this article separates the applicable recency records and adds six original scenario cards. Both earlier subjects and article 29's route-weather case are linked.

Topic 30 requires owner/instructor interviews that weren't available in the repository or saved post inventory. It was deferred in `30-instrument-rating-value.blocker.md`; a forum discussion doesn't substitute for those interviews. Topic 31 has no required specialist-review gate and is the lowest-numbered eligible unpublished topic. No third party was contacted and no interview, instructor endorsement, flight or ownership experience was invented.

Counts stay **20 published and 16 unpublished planned IDs** until verified publication. Ten blocked IDs — 10, 12, 15, 17–19, 22, 23, 27 and 30 — remain included. No exhaustion alert is due. Full inventory and manifest backups were saved under ignored `data/backups/blog-before-draft-31-oct31*` before production content mutations. Existing posts, aircraft, IDs and paths were preserved. Unrelated `.gitignore` changes and the untracked style guide are excluded from the scoped commit.

## Primary sources and access limitations

Sources were checked on 31 October 2026. The inspected eCFR pages display Title 14 current through 29 October, last amended 15 October.

- [14 CFR §61.56](https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-61/subpart-A/section-61.56): read the ordinary flight-review route, its calendar period, instructor endorsement and qualifying alternatives. The article doesn't imply that any instructional flight or IPC automatically satisfies every requirement.
- [14 CFR §61.57](https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-61/subpart-A/section-61.57): read general passenger takeoff/landing recency, sole manipulation, category/class/type conditions, tailwheel full stops, the night passenger time window, instrument experience, device provisions, IPC recovery and exceptions. Cases are scoped to ordinary private-pilot airplane operations rather than specialized or commercial exceptions. No exact instrument-expiration calendar date is invented from incomplete records.
- [14 CFR §1.1](https://www.ecfr.gov/current/title-14/chapter-I/subchapter-A/part-1/section-1.1): read the civil-twilight definition of night, separated from §61.57(b)'s one-hour sunset/sunrise window.
- [FAA AC 61-98E](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_61-98E.pdf), dated 30 October 2024: the [FAA catalog](https://www.faa.gov/regulations_policies/advisory_circulars/index.cfm/go/document.information/documentID/1043281) lists it active and identifies cancellation of 61-98D. Read its emphasis on proficiency beyond currency, mission-specific evaluation, automation knowledge and limitations. It is guidance rather than a replacement for current regulatory text.
- [FAA personal-minimums guidance](https://www.faa.gov/sites/faa.gov/files/2022-01/Personal%20Minimums.pdf), February 2015: used for the comparison between mission demands and available pilot/aircraft capability. Its weather-category table isn't used as a statement of legal VFR minima.
- [FAA instrument-currency clarification](https://www.faasafety.gov/SPANS/noticeView.aspx?nid=3489), January 2012: the notice is expired and explicitly identified as historical in the article. Its distinction between a recovery opportunity and permission to act as IFR PIC was checked against current §61.57(c)/(d). No old notice is represented as a current regulation.
- [First night flight with passengers](https://www.reddit.com/r/flying/comments/1b2dk0u/first_time_taking_passengers_up_at_night/): the web reader displayed the original audience question, which supplies the preparation concern only. No technical statement or medication recommendation from the discussion is adopted. No video was claimed as watched and no course was purchased.

Direct Node requests to eCFR returned an access page with HTTP 200; the operative provisions were read through the web reader. Source access isn't claimed from those HTTP statuses. The FAA PDFs were downloaded under ignored `data/blog-31-sources/` and read through the web reader; local `pdftotext` wasn't installed. An exploratory PHAK chapter request exceeded the web reader's size limit and wasn't used as evidence. A previewed sUAS course wasn't used as manned-airplane regulatory authority. Bounded source link results are in ignored `data/blog-31-link-checks.json`.

## Original cases and companion material

All six cards are fictional ground-study exercises. They address a flight review with one landing; night entries without established qualifying times; a different airplane within the same class; an itinerary change to IFR without supported instrument recency; legal currency with narrowly practiced tasks; and a calendar shortcut.

The date calculation independently checks **1 August to 31 October 2026 = 91 days**. The clock example uses invented sunset at 18:00 and end of evening civil twilight at 18:30. Events between 18:40 and 18:55 occur after that assumed twilight boundary but before the assumed 19:00 passenger-rule boundary. These aren't actual airport/date solar times, a flight recipe or a claim of instructor approval. All other legal requirements are expressly assumed met only for the fictional cards, except where a card identifies a gap.

The matching documentation/public `passenger-currency-readiness-cards.md` copies contain six study prompts and a blank record/readiness worksheet. The companion doesn't decide legal status from missing evidence or provide an approved flight-dispatch tool. No universal proficiency-hour requirement or weather minimum was invented.

## Cover and preparation checks

The built-in image tool generated an original 3:2 illustration of a fictional navy-and-white low-wing airplane parked beside a lit hangar at dusk. Aircraft and airport infrastructure dominate; there are no people, text, numbers or registration marks. The original and final WebP were inspected. The exact prompt and generated source path are saved in `images/passenger-currency-proficiency-cover.prompt.json`; this isn't a photograph of a listed aircraft or an actual flight.

The current Node 24 prepared-family helper uploaded and byte-verified the original and all public variants without Cloudflare Images transformations: original 1536 × 1024 / 182,076 bytes; 480 × 320 / 23,490 bytes; 960 × 640 / 70,762 bytes; and `?w=1600` matching the 1536 × 1024 original. The owner's optimized-original storage behavior is preserved. Only the verified path was attached; descriptive alt text uses the static cover mapping. Signed credentials remain ignored under `data/`.

Node 24 `npm run verify` passed on retry: Astro/TypeScript, lint, all 42 tests, published-data build and Worker dry run. The first run passed the tests but stopped during static generation when a TLS connection closed; its log is retained as `data/blog-31-preparation-verify-first-network-failure.log`. No source workaround was needed. The passing run is `data/blog-31-preparation-verify.log`.

The production Markdown renderer checked eight contents targets, one table / five body rows, six scenario headings, the 91-day calculation, a literal banned-word scan, matching companion copies and a 157-character description. The final article has 2,000 whitespace-delimited words and no article script or hydrated island.

An explicitly unpublished local preview used the current production template and stylesheet. The in-app browser was unavailable, so the Chrome extension was used. Actual CSS viewports of 1280 × 900 and 390 × 844 were measured; temporary viewport dimensions compensated for the existing browser zoom without changing it. Cover, title, prose and the comparison table were inspected. The phone page stayed 390 pixels wide and the table fit its 358-pixel container. Keyboard contents navigation reached the selected heading at the viewport top (0.104 pixels). Temporary viewport settings were reset, the preview tab closed and the server stopped. Details are retained in ignored `data/blog-31-device-preview.json`.

The supporting-source deployment must succeed, the live companion must match the saved bytes, and the unpublished article must remain absent from the live blog/manifest before preparation is ready. At the publication wake, re-read the exact draft and latest revision, reconcile all dates and inventory, publish only within the Eastern window after the stored target, and verify terminal deployment plus live article/card, metadata, covers, contents, companion, classifieds links and desktop/phone rendering before marking ID 31 published.
