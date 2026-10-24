# Blog launch publication record

Published on 9 October 2026 using three parallel writing agents, with final editorial review against `zuluniner-style-guide.md`.

## Published articles

| Plan ID | Article | Canonical source |
| --- | --- | --- |
| 01 | [Four seats, full fuel: will this airplane carry your mission?](https://zuluniner.com/blog/four-seats-full-fuel-aircraft-payload) | [01-four-seats-full-fuel.md](01-four-seats-full-fuel.md) |
| 02 | [Fresh annual vs prebuy: what are you actually buying?](https://zuluniner.com/blog/prebuy-vs-annual-inspection) | [02-prebuy-vs-annual.md](02-prebuy-vs-annual.md) |
| 03 | [Low engine hours, old overhaul: bargain or liability?](https://zuluniner.com/blog/low-engine-hours-old-overhaul) | [03-low-engine-hours-old-overhaul.md](03-low-engine-hours-old-overhaul.md) |

Metadata, record IDs and uploaded cover paths are saved in [publication.json](publication.json). Each Markdown file includes its title; the publication process removes that first H1 because the site template supplies the page title.

## Replacement and recovery

Deleted exactly the three pre-existing blog records after retaining their complete records in ignored `data/backups/blog-before-replacement-2026-10-09.json`. Uploaded originals remain available. Aircraft listings and their IDs, images and ownership were not changed.

## Evidence and editorial limits

The drafts cite primary FAA, eCFR and manufacturer sources beside the relevant claims. The original loading, inspection and engine-budget examples are explicitly hypothetical. Their calculations were checked during drafting and final review. No owner experience, aircraft inspection, professional review or interview is claimed. Independent CFI/A&P/IA review and the proposed specialist interviews have not occurred; they remain follow-up editorial improvements rather than completed deliverables.

The engine article checks Lycoming SI1009BF dated 20 July 2026. It identifies the current Continental M-0 catalog entry but supplies no interval from the access-restricted manual. Hypothetical costs are not current quotations.

## Covers

The three original generated covers are WebP, 1,536 × 1,024 pixels (3:2). Files and exact prompts are recorded in [generation-prompts.json](images/generation-prompts.json). They are editorial illustrations, not photographs of aircraft for sale. All three uploaded files and responsive variants were checked on the live pages; descriptive alt text is supplied in the static renderer.

## Validation

- `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run verify` passed against the replacement content: type checks, lint, 13 tests, static build and Worker dry run.
- All 23 article contents links matched generated heading IDs; each article has one H1 and no hydrated React island.
- [Deployment 37897258710](https://github.com/discomedia/zuluniner/actions/runs/37897258710) succeeded, including the workflow's exact built-manifest comparison and all public routes.
- The content connector reports deployed and public changes live. The launch inventory contained exactly articles 01–03.
- All three articles were inspected at desktop width (1,280 px) and phone width (390 px). Covers preserve 3:2; titles and body text fit; tables wrap or scroll inside their own containers. Page width remains 390 px on phones, and contents navigation works.

The first content-only deployment encountered a transient old-manifest response during immediate post-deploy verification. The subsequent queued content deployment and code deployment both completed successfully. A later documentation deployment exposed the same propagation delay, so the manifest comparison now permits up to 45 seconds of waiting with bounded retries. It still requires the exact built snapshot; no verification check was weakened.

## Scheduled publications

| Eastern date | Plan ID | Article and verification record |
| --- | --- | --- |
| 10 October 2026 | 04 | [Airplane ownership at 50, 100 and 200 hours a year](https://zuluniner.com/blog/airplane-ownership-cost-50-100-200-hours/); [sources, calculator checks and live verification](04-airplane-ownership-cost.notes.md). |
| 11 October 2026 | 05 | [Why maneuvering speed gets lower as your airplane gets lighter](https://zuluniner.com/blog/maneuvering-speed-aircraft-weight/); [research, original diagram and live verification](05-maneuvering-speed-weight.notes.md). Published immediately at the owner's request after the missed morning preparation. |
| 13 October 2026 | 06 | [Sport pilot vs private pilot after MOSAIC: which airplane can you fly?](https://zuluniner.com/blog/sport-pilot-private-pilot-mosaic-aircraft/); [research, screening worksheet and live verification](06-sport-pilot-private-pilot-mosaic.notes.md). |
| 15 October 2026 | 07 | [Cessna 172/180 conversions: what the extra horsepower doesn't tell you](https://zuluniner.com/blog/cessna-172-180-conversion-records/); [research, upload fix, checklist and live verification](07-cessna-172-180-conversions.notes.md). Published immediately at the owner's explicit request after the image upload repair. |
| 16 October 2026 | 08 | [Density altitude: the calculation is only the beginning](https://zuluniner.com/blog/density-altitude-takeoff-climb-performance/); [research, worksheet and live verification](08-density-altitude-departure-performance.notes.md). Published at 9:34 a.m. EDT after the reserved 9:33 a.m. target. |
| 17 October 2026 | 09 | [Buying an older SR22 G2: what to check beyond the glass panel](https://zuluniner.com/blog/sr22-g2-prebuy-records/); [research, comparison checklist and live verification](09-sr22-g2-prebuy-records.notes.md). Published at 9:24 a.m. EDT within the morning window. |
| 18 October 2026 | 11 | [Safety-pilot time: who can log PIC and cross-country?](https://zuluniner.com/blog/safety-pilot-pic-cross-country/); [research, six original scenarios, worksheet and live verification](11-safety-pilot-logging.notes.md). Published at 9:04 a.m. EDT within the morning window. |
| 19 October 2026 | 13 | [Cherokee Six vs a four-seat single: how much payload do you gain?](https://zuluniner.com/blog/cherokee-six-vs-four-seat-payload/); [research, original load comparisons, worksheet and live verification](13-cherokee-six-payload.notes.md). Published at 9:12 a.m. EDT. |
| 20 October 2026 | 14 | [Should you buy an airplane for your private-pilot training?](https://zuluniner.com/blog/buy-airplane-private-pilot-training/); [research, original buy/rent examples, worksheet and live verification](14-buy-airplane-private-pilot-training.notes.md). Published at 9:35 a.m. EDT. |
| 21 October 2026 | 16 | [Buying an airplane for IFR: how to check an avionics ad](https://zuluniner.com/blog/ifr-avionics-ad-checklist/); [research, fictional ad cases, worksheet and live verification](16-ifr-avionics-ad-checklist.notes.md). Published at 9:23 a.m. EDT and deployed at 9:24; final device checks completed after 10 a.m. |
| 22 October 2026 | 20 | [A flight review that addresses the flying you actually do](https://zuluniner.com/blog/flight-review-preparation/); [FAA sources, fictional profiles, worksheet and live verification](20-flight-review-preparation.notes.md). Published at 8:50 a.m. EDT after the reserved 8:47 a.m. target. |
| 23 October 2026 | 21 | [VFR personal minimums for a trip you actually want to make](https://zuluniner.com/blog/vfr-personal-minimums/); [FAA sources, fictional scenarios, worksheet and live verification](21-vfr-personal-minimums.notes.md). Published at 9:46 a.m. EDT after the reserved 9:42 a.m. target. |

Articles 04–09, 11, 13, 14, 16, 20 and 21 passed publication and desktop/phone checks after successful deployments. Current totals are 15 published and 21 unpublished planned IDs, including blocked topics 10, 12, 15, 17–19, 22 and 23. Existing posts and aircraft were preserved.

Article 20 was prepared as an unpublished draft and published after the preserved 8:47 a.m. Eastern target on 22 October. Its verified publication is included in the totals above.

Article 21 was prepared as an unpublished draft and published after the preserved 9:42 a.m. Eastern target on 23 October. Its verified publication is included in the totals above.

Article 24 was prepared as an unpublished draft on 24 October for the preserved 9:25 a.m. Eastern target. Topics 22 and 23 were deferred for their required instructor reviews. See the [preparation and evidence record](24-slip-vs-skid.notes.md). The draft is not included in the published total.
