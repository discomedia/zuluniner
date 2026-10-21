# Article 16 preparation record

Prepared on 21 October 2026 Eastern. **Unpublished draft.** Reserved publication: 21 October at **9:04 a.m. EDT**, or 22 October at **12:04 a.m. Australia/Melbourne**, using IANA timezone conversion. Before drafting, the same automation was moved to that stored time and its prompt and other settings were preserved and read back.

The full connector inventory and live manifest contained 12 published posts, no drafts and no overlapping article. The inventory was backed up under ignored `data/backups/` before production mutation. Topic 15's required interviews and legal review weren't obtained; its blocker was recorded. Topics 10 and 12 are still blocked. Counts stay **12 published, 24 unpublished**, including blocked topics and this draft.

## Sources and limits

Current eCFR pages were read on 21 October; they display Title 14 as updated through 19 October 2026, last amended 15 October. The article concerns ordinary Part 91 small piston airplanes with standard airworthiness certificates, not every category or operating rule.

- [§91.205](https://www.ecfr.gov/current/title-14/section-91.205): applicable day/night/IFR instruments and route-suitable communication/navigation equipment.
- [§91.9](https://www.ecfr.gov/current/title-14/section-91.9): operating limitations and aircraft manual material.
- [§91.411](https://www.ecfr.gov/current/title-14/section-91.411): controlled-airspace IFR tests, calendar-month interval, tested-altitude limit and subsequent tests after specified maintenance, including the stated static-system exceptions.
- [§91.413](https://www.ecfr.gov/current/title-14/section-91.413): transponder tests and specified subsequent maintenance tests; its scope isn't substituted for §91.411.
- [§91.171](https://www.ecfr.gov/current/title-14/section-91.171): IFR use of VOR, approved-procedure alternative and 30-day check route, with required limits/records.
- [§91.213](https://www.ecfr.gov/current/title-14/section-91.213): inoperative-equipment assessment; no dispatch permission is inferred from a placard.
- [FAA STC explanation](https://www.faa.gov/aircraft/air_cert/design_approvals/stc): approval for a modification and its effect on the original design.
- [FAA AIM navigation-aids chapter](https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html): IFR GPS equipment/installation approval, manual limitations, procedure retrieval, airborne databases and LPV support. No universal expired-database permission or alternate-planning rule is supplied.
- [Garmin GTN AFMS 190-01007-A2 revision 9](https://static.garmin.com/pumac/190-01007-a2_09.pdf), dated 3 January 2020: downloaded, extracted and relevant sections read. Printed page 15 was rendered and inspected, including the configuration checkbox. This is a historical manufacturer illustration, not a claim of latest revision, candidate applicability or GTN Xi instructions. Current applicable documents must come from the actual installation. Garmin support search results located newer literature, but direct pages returned an empty shell or 403; that inaccessible content isn't represented as read.
- [Audience question about IFR-certified ads](https://www.reddit.com/r/flying/comments/bzyuxo/): question and replies inspected; audience context only. The partnership question was also opened for topic 15, but no forum post is represented as an interview for ZuluNiner.

No aircraft inspection, owner interview, avionics-shop quotation, insurer review or independent CFI/maintenance/legal review was obtained. Individual listings aren't assigned a readiness verdict. Links lead to available aircraft browsing and related prebuy, ownership-cost and buy-for-training articles.

## Original examples and assets

The three advertised configurations and the inspection-record exercise are invented teaching cases. September 2024 to October 2026 spans 25 calendar-month positions; October 2024 to October 2026 spans 24. The exercise doesn't establish completion of a subsequent maintenance-triggered test. No current upgrade price, subscription cost, support promise or aircraft finding is invented.

The seller-question worksheet matches its public copy byte for byte. It requests evidence rather than acting as a dispatch checklist, approved maintenance program or operating procedure.

Built-in image generation produced an original 3:2 cockpit illustration, inspected before use. The fictional panel has no text, logos or people; it isn't a depicted approved installation. The final WebP is in `images/ifr-avionics-ad-checklist-cover.webp`; the exact prompt and generated source are in `images/16-generation-prompt.json`.

The signed prepared-family upload verified original and all 480/960/1600 WebP variants byte for byte, without Cloudflare Images transformations. Original and 1600: 1536 × 1024, 90,404 bytes. 480: 480 × 320, 19,812 bytes. 960: 960 × 640, 47,790 bytes. Credentials stay in ignored `data/`; only the verified storage path is attached.

Node 24 `npm run verify` passed: 39 tests, Astro/TypeScript, lint, static build and Worker dry run. Production-renderer checks passed 2,075 words, eight contents targets, two tables with seven body rows, the calendar exercise, worksheet identity and banned wording. The cover alt mapping is static; no article island is introduced.

Desktop 1280 × 900 and phone 390 × 844 previews were inspected. Cover and title fit, tables stay in contained overflow containers, page width stays 390 pixels, and keyboard activation of the fictional-ad contents link reaches its heading. Source/draft deployment and live preparation checks are retained in ignored state. Repeat article/card/metadata/device checks at publication, and don't mark topic 16 published until those checks pass.
