# Article 29 — route-weather preparation record

Prepared on **30 October 2026 Eastern**. Reserved publication time: **8:55 a.m. EDT** (11:55 p.m. Australia/Melbourne on 30 October), converted with IANA timezone data. The same heartbeat was moved to that stored target before drafting, and its saved prompt, kind, destination, status and notification settings were checked. Preparation does not authorize early publication.

Draft ID: `5521b8e1-f5da-4a94-ac67-6a24589ff9bc`. Unpublished revision: `2026-10-30T10:11:43.646715+00:00`. Draft-save publication ID: `8fa464d0-5e3d-42ab-8070-b786402a1771`. The connector readback matched the exact ID, revision, slug, title, Markdown, blurb, description, cover path and `published=false`. Intended canonical URL after publication: `https://zuluniner.com/blog/destination-metar-route-weather/`.

The draft-save [deployment workflow 41038942790](https://github.com/discomedia/zuluniner/actions/runs/41038942790) succeeded. The connector reported deployed at 10:13:40 UTC with public changes live; the post itself is still unpublished. The supporting-source deployment is checked separately after the scoped source push.

## Reconciliation and scope

The full connector inventory contained 19 posts, all published, and no drafts. IDs, slugs, titles and close topic overlap were checked before creation; the live manifest also had 19 entries and no route-weather article. Existing posts 21 (personal minimums) and 28 (fuel planning) are linked as separate subjects. The new article uses a dated station/forecast comparison rather than repeating those articles' planning examples.

Topics 10, 12, 15, 17–19, 22, 23 and 27 still lack their recorded required evidence. Topic 29 is the lowest-numbered eligible unpublished topic and has no required interview or specialist-review gate. No outreach, instructor review, flight, aircraft ownership or actual pilot decision was invented. Counts remain **19 published and 17 unpublished planned IDs**, including the nine blocked IDs. No exhaustion alert is due.

Before production content mutations, the full inventory and live manifest were backed up under ignored `data/backups/blog-before-draft-29-oct30*`. Signed upload credentials remain under ignored `data/`. Existing posts, aircraft, IDs and image paths were preserved. The unrelated `.gitignore` change and untracked style-guide file are excluded from the scoped commit.

## Current primary research and audience question

Sources were accessed on 30 October 2026. Technical facts use primary FAA, eCFR and NOAA/NWS sources; the audience discussion supplies only a question.

- [NOAA AWC Data API](https://aviationweather.gov/data/api/): actual METAR/SPECI and TAF JSON responses were retrieved with bounded requests. The fixed [selected study data](weather/2026-10-30-virginia-study.json), identical to the public JSON, preserves the original station records and raw strings, source URLs, separate retrieval times and explicit limitations. Added ISO observation times are calculated directly from the returned epoch fields. It is historical educational data, not a live briefing.
- [AWC weather-product guidance](https://aviationweather.gov/help/data/): read the report elements, mist, visibility/RVR separation, automated CLR detection limit, AGL cloud bases and TAF terminal coverage/validity. Operational codes stay verbatim; narrative measurements are metric first. A source page returning HTTP 200 was not treated as sufficient proof of its contents.
- [AWC GFA guidance](https://aviationweather.gov/gfa/help/): read the flight-category legend, observational versus model products, interpolated near-surface analysis limitation and MSL basis for GFA cloud bases/tops. The article doesn't infer a measured corridor from gridded colours.
- [FAA standard pilot-briefing procedure](https://www.faa.gov/air_traffic/publications/atpubs/fs_html/chap5_section_2.html): route, altitude and timing as briefing background; current briefing elements. [AC 91-92](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_91-92.pdf), sections 7.4 and 7.8: route-wide conditions, forecasts and gaps between reporting stations. No complete briefing is claimed for the example.
- [FAA AIM 7-1-9](https://www.faa.gov/air_traffic/publications/aim_html/chap7_section_1.html): supplemental use and limitations of flight-information services; strategic weather decisions rather than tactical hazard threading.
- [14 CFR §91.155](https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-91/subpart-B/section-91.155): the operative table and surface-area provisions were read through the web reader, displaying Title 14 current through 28 October. A direct Node request returned an access page despite HTTP 200. The article makes only a supported general statement about the factors affecting legal VFR minima; it doesn't infer the legal status of a specific flight from an airport category.
- [Cross-country weather assessment question](https://www.reddit.com/r/flying/comments/1dlq1wp/how_do_you_assess_weather_on_a_xc_fly/): the accessible web reader showed the student's question about moving beyond METAR/TAF interpretation to a weather-assessment workflow. No commenter is treated as technical authority. No video was represented as watched or interview as conducted.

The source/internal link results are retained in ignored `data/blog-29-link-checks.json`. The eCFR direct-access limitation above prevents an all-content-verified claim based on the HTTP results alone.

## Dated study and original teaching material

Observation retrieval: **10:01:26 UTC, 30 October**. KROA 09:54 UTC and KBCB 09:55 UTC each report `10SM CLR` and API category VFR. KLYH's 09:58 UTC SPECI reports `1 3/4SM`, `BR`, `CLR`, and API category IFR. The raw observation fields are preserved unchanged, including the full remarks and runway visual range group.

TAF retrieval: **10:03:13 UTC**. The retained KLYH forecast was issued at 05:20 UTC and valid from 30 October 06:00 to 31 October 06:00 UTC. Its first period contains `P6SM SKC`; the article compares that with the later 09:58 observation without claiming the duration of the visibility restriction, a complete amendment history or actual conditions elsewhere. KROA's returned TAF is retained in the archive for reproducibility, though not decoded in the article.

The KROA–KLYH–KBCB training triangle, including the intermediate landing, is explicitly fictional. It is not described as a direct Roanoke–Blacksburg route. The reports were early-morning observations, not a current publication-time briefing. No actual leg distances, flight times, ridge conditions or flight outcome are invented. The article identifies the missing route, advisory, imagery, pilot-report, airspace and aeronautical information instead of declaring a flight acceptable.

The broader METAR request also returned KLWB and a malformed KCHO report. Neither is used or silently repaired. A test G-AIRMET request returned multiple hazard types despite its requested filter; it was excluded from the public case. No advisory polygon was asserted to cover the route, and no advisory absence was inferred.

Original calculations: 1.75 statute miles × 1.609344 = 2.816352 km, rounded 2.8 km; 10 SM = 16.09344 km, rounded 16 km; 6 SM = 9.656064 km, rounded 9.7 km. The hypothetical cloud/terrain arithmetic uses 2,000 ft MSL + 3,000 ft AGL = 5,000 ft MSL over an invented airport, compared with an invented 4,500 ft ridge. The nominal 500 ft difference is 152.4 m. It is explicitly not a measured route cloud base, legal separation calculation or clearance recommendation.

The matching public/documentation `route-weather-briefing-worksheet.md` copies collect proposed route/times, product issue/valid/retrieval times, geographic and height coverage, discrepancies, alternatives and review points. They supply no universal personal minimums or approved planning tool.

## Cover and local verification

The built-in image tool created an original restrained 3:2 aircraft-focused illustration. A fictional green-and-white high-wing airplane is parked on an apron; low cloud covers distant wooded ridges. It contains no text or people and doesn't depict a listed aircraft, actual airport or observed weather. Both generated and final WebP images were inspected. The exact prompt and generated source path are saved in `images/destination-metar-route-weather-cover.prompt.json`.

The current Node 24 prepared-family helper uploaded and byte-verified all public image URLs: original 1536 × 1024 / 110,838 bytes, 480 × 320 / 18,684 bytes, 960 × 640 / 49,880 bytes, and the `?w=1600` response matching the 1536 × 1024 original. The owner's 29 October storage change is preserved: the largest request serves the optimized original rather than storing a redundant 1600 copy. No Cloudflare Images transformation was invoked. Only the verified storage path was attached, with descriptive alt text in the existing static cover mapping.

Node 24 `npm run verify` passed, including Astro/TypeScript, lint, all 42 tests, published-data build and Worker dry run. The production Markdown renderer checked eight contents targets, three tables / ten body rows, no article H1/script/island, the banned-word scan, matching worksheet/archive copies and a 160-character description. The article has 2,006 whitespace-delimited words. Original weather timestamps and metric conversions were checked independently of the prose.

An explicitly unpublished local preview used the current production template and stylesheet. Desktop 1280 × 900 and phone 390 × 844 title, cover, prose, table and forecast-code layouts were inspected. After simplifying the first table, all three tables fit 358-pixel phone containers; page width stayed 390 pixels. Both raw-report blocks scroll within their containers. Keyboard contents navigation reached the selected heading at the viewport top. A stale stylesheet reference in an older preview template was corrected before the final device checks. Viewport settings were reset and the temporary preview tab closed.

Supporting-source deployment must complete successfully and the public worksheet/archive must match the saved files before preparation is considered ready. The article route must still return 404 and the blog/manifest must still exclude this unpublished draft. At the reserved wake, recheck the exact draft, current revision and all published dates, then publish only within the authorized Eastern window and verify the final public deployment, article/card, metadata, cover family, contents, links and desktop/phone rendering before marking ID 29 published.
