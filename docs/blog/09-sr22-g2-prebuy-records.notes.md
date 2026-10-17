# Article 09 preparation record

Prepared on **17 October 2026 Eastern** for the persisted **8:21 a.m. EDT** publication target (**11:21 p.m. Australia/Melbourne** on that date, converted with IANA timezone data). The 5:58 a.m. preparation wake started work immediately under the ten-minute early allowance. Before drafting, the same heartbeat was moved to the reserved publication clock; readback confirmed its prompt, kind, destination, name, status and notification settings were preserved.

The article is a **complete unpublished draft**. Current totals stay eight published and 28 unpublished planned IDs. Its exact ID, revision and uploaded cover path are in [metadata](09-sr22-g2-prebuy-records.metadata.json). Publication must recheck the actual Eastern clock, daily publication limit, latest revision, live deployment and desktop/phone layouts before marking plan ID 09 complete.

## Reconciliation and scope

Full connector inventory and the live manifest both contained eight published posts. No SR22/G2 draft or close-overlap post existed, and no article had been published on 17 October Eastern. This was rechecked immediately before draft creation. Complete records were backed up to ignored `data/backups/blog-before-draft-09-2026-10-17.json` before production content mutations. Existing posts and aircraft were preserved.

The guide compares two documented **seller-advertised configurations**, not two independently inspected aircraft. Current active listing records were read in full and both public routes returned successfully. Local evidence is under ignored `data/blog-09-listing-source-records.json` and `data/blog-09-listing-a.html` / `data/blog-09-listing-b.html`.

* A: listing ID `78d9743e-7447-4447-9075-934f45c97063`, 2005 SR22 G2, N823PV, serial 1383. Source text lists Entegra PFD/EX5000, dual GNS430 (W unspecified), S-TEC 55X, 1,585 engine hours since new, and a 1,087 lb loading allowance.
* B: listing ID `418a958d-aa40-4151-acb6-f5f4ec23eac0`, 2004 SR22 G2, N701SG, serial 0963. Source text lists Entegra PFD/EX5000, dual GNS430W/WAAS, DFC90, 275 engine hours since new separately from 4,205 airframe hours, and a 1,004 lb loading allowance.

The article doesn't infer that A lacks WAAS because its text omits W. It doesn't repeat advertised condition, damage-history, service-center-history, maintenance-interval or price claims as verified facts. Availability and specifications must be rechecked with sellers. The local records contain raw sales copy for provenance; that copy was not adopted as editorial prose.

## Research and evidence limits

* [COPA's 2015 G2 buying discussion](https://forum.cirruspilots.org/t/about-to-pull-trigger-on-2004-sr22-need-advice/77563) was read for the audience question: equipment verification, upgrades and independent inspection. No forum reply establishes a technical claim or a current price; no owner experience is invented. The originally planned F15 discussion appeared in discovery results, but the fully inspected COPA thread supplies the article's audience link.
* Cirrus's [current technical-publications portal](https://techpubs.cirrusaircraft.com/) requires sign-in. Its [SR technical-publications suite catalog](https://store.cirrusaircraft.com/sr-series-online-technical-publications-suite/5637342579.p) identifies POHs, supplements, maintenance manuals, CAPS component manuals and service information across SR configurations. The catalog was accessed; account-gated aircraft-specific manuals were **not** obtained. Later repeated web fetches of some already-read manufacturer pages timed out. No timeout was presented as successful access to a manual.
* The brief requires current applicable Cirrus publications and service-center review before stating maintenance intervals or costs. No service-center review occurred. The article therefore supplies **neither universal service intervals nor maintenance costs**. Its CAPS section requests itemized identity, task references, work entries and maintainer-established next actions. It doesn't reuse a generic interval or turn an advertisement's future date into an airworthiness determination. Independent aircraft-specific review remains a buyer action, not a completed editorial deliverable.
* [Avidyne's DFC90 product page](https://www.avidyne.com/shop/general-aviation/dfc90-digital-autopilot/) identifies approved SR20/22/Entegra configurations. The [Vantage page](https://www.avidyne.com/vantage12/) identifies the S-TEC 55X replacement route. These establish manufacturer-described system options, not approval or serviceability of either ad's actual installation. No promised Vantage/DFC110 software compatibility or price is asserted.
* [Garmin's GNS 430W page](https://www.garmin.com/en-CA/p/301/pn/010-00412-01/) was inspected in the rendered browser after the web reader returned only its JavaScript shell. It supports WAAS/LPV product capability; the article separately requires checking installation approval and operation.
* [Garmin Service Advisory 23018 Rev B](https://support.garmin.com/en-US/?faq=HLCXhipr3t4FtlEhJFFYv5) was read in the rendered browser. It ends display-module replacement repairs for WAAS and non-WAAS GNS 430 units, describes other repair support as component-dependent, and keeps database/technical support. The article doesn't claim all repairs or all support ended. Its attachment link was observed, but the PDF web fetch failed; the rendered official advisory text was the evidence used.
* [Garmin Service Advisory 2027](https://support.garmin.com/en-GB/aviation/faq/QlJZ7Vgdje9g6ldPtIJgx6/) was read in the browser. The factory WAAS upgrade program ended in 2020. The legacy product page's upgrade marketing was not used to claim the program is still available.
* The [FAA's AD applicability guidance](https://www.faa.gov/aircraft/air_cert/continued_operation/ad/app_comp) was opened and read. It requires searching affected products, including aircraft, engine, propeller and appliances, with model/series applicability. No aircraft-specific AD compliance search is claimed complete.
* [Cirrus Embark's current terms](https://embark.cirrusaircraft.com/) were read. The article describes conditional eligibility and deadlines without promising coverage or insurance acceptance. It correctly separates transition/differences instruction from flight reviews, instrument proficiency checks and ferry activity.

No interviews, specialist review, flight test, physical aircraft inspection or personal ownership experience occurred. The guide's inspection requests are proposed outputs for a qualified shop and pilot, not maintenance or flight-test instructions.

## Original worksheet and calculation checks

[Checklist source](09-sr22-g2-prebuy-records-checklist.md) is copied byte-for-byte to `public/blog/sr22-g2-prebuy-records-checklist.md`. It distinguishes seller claims, record identity, independent checks, maintenance applicability and unresolved items. No fictional maintenance prices or quotations appear.

The loading exercise is explicitly hypothetical. Source-advertised 1,087 lb converts to 493.055 kg; 1,004 lb converts to 455.407 kg. These are rounded to 493/455 kg. Assumed occupants/baggage 300 kg plus fuel mass 160 kg equals 460 kg (1,014 lb), leaving about 33 kg (73 lb) against A's advertised figure and exceeding B's by about 5 kg (11 lb). The exercise supplies no route-fuel/reserve adequacy, approved loading envelope or departure clearance. Conversions and arithmetic were checked independently of the prose.

## Cover and preparation validation

Built-in imagegen produced an original fictional low-wing composite airplane outside a hangar. The selected 3:2 cover has no text or people and doesn't represent either listed aircraft. The final [WebP](images/sr22-g2-prebuy-records-cover.webp) and [exact prompt](images/09-generation-prompt.json) are retained in the repository. Original and compressed image were visually inspected.

The cover used the signed prepared-family upload, without Cloudflare Images transformations. Credentials stay only under ignored `data/`. All four public objects matched the prepared bytes and decoded as WebP: original/1600 1536×1024 (140,796 bytes), 480 480×320 (21,328 bytes), and 960 960×640 (58,834 bytes). Descriptive cover alt text is in the static mapping.

Node 24 `npm run verify` passed: generated bindings, Astro/TypeScript checks, lint, 39 tests, static build and Worker dry run. The local article check verifies ten contents targets, two tables, no banned prose, no hydrated island, listing transcription, loading arithmetic and worksheet identity.

The unpublished preview used the production template and stylesheet with the new body and verified cover. Desktop 1280×900 and phone 390×844 were inspected. Phone page width stays 390 px; both tables fit their 358 px containers, with overflow handling retained. Clicking the comparison section's contents link landed at the correct heading. The title, cover and body render correctly. This is preview evidence; actual public article/card checks remain for publication.

The connector saved the complete post as `published=false`, ID `5ed1d3be-67b5-4b72-b94b-5c222e9504af`, revision `2026-10-17T10:05:36.359086+00:00`. Exact readback and terminal draft-save/source-deployment verification are retained in ignored publishing state. No plan item is marked published during preparation.
