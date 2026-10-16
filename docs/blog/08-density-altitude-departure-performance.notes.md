# Article 08 preparation record

Prepared on **16 October 2026 Eastern** for the persisted **9:33 a.m. EDT** publication target (12:33 a.m. on 17 October Australia/Melbourne, converted with IANA timezone data). The existing automation's wake was moved to that target before research began, including this preparation wake just before 6 a.m. Its prompt, kind, destination, name, status and notification settings were preserved.

The article is **an unpublished, complete draft**, not a verified publication. Counts stay seven published and 29 unpublished planned IDs. Draft ID/revision and uploaded cover are in [metadata](08-density-altitude-departure-performance.metadata.json). Do not mark the plan published until the publication wake completes its live checks.

## Reconciliation

The full inventory initially contained seven posts, all published, matching the live manifest. There was no density-altitude draft or close-overlap article and no post published on 16 October Eastern. Existing articles 01 and 07 supply contextual links. Current inventory contains aircraft classifieds; the article links to general browse without presenting any particular listing as a verified performance example. Complete post records were backed up under ignored `data/backups/blog-before-draft-08-2026-10-16.json` before production mutations. No existing post or aircraft was replaced or deleted.

## Research and scope

* The [pilot discussion about older Cessna takeoff tables](https://www.reddit.com/r/flying/comments/1s0mgx2/takeoff_tables_c172_h_poh_question_student_pilot/) was inspected for the audience question. Replies disagree on using density altitude directly. The article follows the actual table's labels and notes; forum replies do not establish technical answers.
* The current [FAA PHAK catalog](https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak) identifies FAA-H-8083-25C. [Chapter 4](https://www.faa.gov/sites/faa.gov/files/06_phak_ch4_0.pdf) supports altitude/density and moisture concepts. [Chapter 11](https://www.faa.gov/sites/faa.gov/files/13_phak_ch11.pdf) was downloaded and read locally for performance-chart assumptions, climb and runway factors; the web reader rejected that PDF's size, rather than establishing missing source access. Local copy/text are retained under ignored `data/research/08-faa-phak-performance.*`.
* [FAA Safety Briefing, July/August 2010](https://www.faa.gov/sites/faa.gov/files/2022-01/JulAug2010.pdf), printed pages 12–15, provides the 120 ft/°C approximation. The actual PDF text was inspected locally; the article identifies the formula as an estimate. Bureau of Meteorology training notes [hosted by NWS](https://www.weather.gov/media/zhu/ZHU_Training_Page/winds/pressure_winds/Temp_Density_Pressure.pdf), PDF page 12, separately show the lapse-rate and density-altitude approximation. No Australian operating rules from that document are imported into this US-focused article.
* The [1978 Cessna 172N POH reference scan](https://spartanflightacademy.com/wp-content/uploads/2025/10/Cessna-172N-POH.pdf) was downloaded and visually inspected. Its scanned cover identifies the model/year. Figure 5-4 is on printed pages 5-12/5-13 (PDF page 42); Figure 5-5 is on page 5-14 (PDF page 43). The scan does not establish a current aircraft-specific revision, approval applicability or installed configuration. That limit is explicit in the article; these are reference-copy training lookups rather than operational data assigned to an individual aircraft. Ignored copy: `data/research/08-cessna-172n-poh.pdf`; SHA-256 `8fdc47b90b9750f41eb56d82ac1faab5a5776862f5925997f1fae43d4c904824`.
* The FAA's [current ACS catalog](https://www.faa.gov/training_testing/testing/acs) links [FAA-S-ACS-6C](https://www.faa.gov/training_testing/testing/acs/private_airplane_acs_6.pdf). The two original study checks map to Area I, Task F, Performance and Limitations. They are not recalled or official FAA exam questions.

The initially discovered King Schools 172S PIM returned 404, and a separate 172S reference copy returned 403. Neither is cited or used for facts. The 172N scan was read directly rather than relying on search-result table transcription. No actual flight, interview, aircraft inspection, current condition, price or insurance terms are claimed. No independent CFI review has occurred; specialist review remains an editorial improvement rather than a completed claim. The post teaches source reading and hypothetical arithmetic and does not supply a flight release or a departure recommendation for an actual airplane.

## Original examples and checks

The same fictional airport has 6,000 ft elevation/pressure altitude, standard pressure, and 1,000 m paved/level/dry runway. A uses 1,900 lb and 10°C; B uses 2,300 lb and 30°C. The additional controlled comparison holds the heavier loading at 10°C. No airport or aircraft record is invented as a real source.

Direct Figure 5-4 lookups at 6,000 ft pressure altitude:

| Loading / temperature | Ground roll, ft | Distance over 50 ft, ft |
| --- | --- | --- |
| 1,900 lb / 10°C | 875 | 1,575 |
| 2,300 lb / 10°C | 1,365 | 2,485 |
| 2,300 lb / 30°C | 1,585 | 2,895 |

The flaps-up short-field assumptions and notes are recorded beside the article's results. The pressure-altitude and temperature inputs are not replaced with the calculated density altitude. Estimates are 6,840 ft and 9,240 ft, with metric conversions checked. The controlled weather comparison is approximately 16.5%, loading comparison approximately 58%, and combined comparison approximately 84%; they are not universal penalties.

Figure 5-5's 2,300 lb, 6,000 ft entries are 440 ft/min at 20°C and 385 ft/min at 40°C. Linear interpolation gives 412.5 ft/min at 30°C, about 126 m/min. Speed and configuration assumptions are stated. No lower-weight climb result is fabricated. The separate constant-400-ft/min gradient example uses assumed groundspeeds of 100/120 kt and yields 240/200 ft per NM, 3.95%/3.29%. It is explicitly hypothetical and is not derived as a Cessna departure prediction.

The original [worksheet source](08-density-altitude-departure-worksheet.md) is copied to `public/blog/density-altitude-departure-worksheet.md`. The article and worksheet distinguish real-aircraft inputs from the reference exercise.

## Cover and validation

Built-in imagegen generated an original fictional-aircraft illustration. One framing refinement brought the complete airplane and wing tips inside the cover. Final 3:2 WebP: [density-altitude-departure-cover.webp](images/density-altitude-departure-cover.webp). The exact initial/refinement prompts and generated source paths are saved in [08-generation-prompt.json](images/08-generation-prompt.json). The image has no text or people and does not depict a listing aircraft or an actual departure.

The cover used the signed prepared-family upload through the ZuluNiner connector, with credential receipts only under ignored `data/`. All four public objects matched the prepared bytes and decoded as WebP: original/1600 1536×1024 (270,424 bytes), 480 480×320 (31,304 bytes), 960 960×640 (103,044 bytes). The original and thumbnail were inspected; descriptive alt text is in the static cover mapping.

The draft preview used the production template/CSS and the uploaded cover. Desktop 1280×900 and phone 390×844 were inspected: title and cover fit, page width stayed 390 px on the phone, all 10 contents targets existed, the Cessna-table contents link scrolled to its heading, and tables stayed inside scrolling containers. There is no hydrated island. This is preview evidence; the live article and card must be inspected after publication.

Node 24 `npm run verify` passed. The local article check verifies 10 contents targets, three tables, no banned prose, the transcribed table conversions, density-altitude/percentage/climb-gradient arithmetic and a byte-identical worksheet. The exact complete post was saved through the connector as `published=false`, with the uploaded header, and its ID/revision persisted in state with phase `publish`. Terminal draft-save/source-deployment results and final live unpublished-state checks are recorded in ignored publishing state.
