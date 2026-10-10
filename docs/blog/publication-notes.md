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

Article 04 passed publication and desktop/phone checks after successful deployment. Current totals are 4 published and 32 unpublished planned IDs. Existing posts and aircraft were preserved.
