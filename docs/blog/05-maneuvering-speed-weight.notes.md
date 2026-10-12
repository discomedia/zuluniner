# Article 05 publication record

Prepared on 12 October 2026 Australia/Melbourne (11 October Eastern). The owner explicitly requested immediate publication after the early preparation wake returned without drafting. This authorizes one publication outside the usual morning window; later automated posts keep the 8–10 a.m. Eastern window. Published and verified: [live article](https://zuluniner.com/blog/maneuvering-speed-aircraft-weight/), saved at 8:33 p.m. EDT on 11 October 2026.

Source: [05-maneuvering-speed-weight.md](05-maneuvering-speed-weight.md). Identity and metadata: [05-maneuvering-speed-weight.metadata.json](05-maneuvering-speed-weight.metadata.json).

## Reconciliation and backup

The complete post inventory and live manifest contained exactly articles 01–04. No unpublished or overlapping maneuvering-speed article existed, and no article had an 11 October Eastern publication date. Full post and aircraft records were backed up before mutations in ignored `data/backups/blog-before-manual-05-2026-10-11.json`. No existing posts or aircraft were deleted or replaced.

## Sources inspected

* [FAA PHAK catalog](https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak) and [aviation-handbook register](https://www.faa.gov/regulations_policies/handbooks_manuals/aviation): FAA-H-8083-25C, 2023, with October 2025 addendum. The [addendum](https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/PHAK_Addendum_%28MOSAIC%29.pdf) was inspected and doesn't amend the Chapter 5 maneuvering-speed material.
* [Chapter 4](https://www.faa.gov/sites/faa.gov/files/06_phak_ch4_0.pdf): angle of attack and lift. [Chapter 5](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/phak/07_phak_ch5.pdf): pages 5-33–5-38, load factors, accelerated stalls, control-input limits, rough air and Vg diagram. Web extraction rejected its size, so the official PDF was downloaded and read locally with pypdf. Broad simplified stall-envelope statements are bounded in the article by the explicit single-input and gust cautions.
* [Chapter 8](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/phak/10_phak_ch8.pdf), page 8-8: IAS and CAS definitions. The official PDF was downloaded and read locally after web extraction rejected its size.
* [AC 61-67C](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_61-67C.pdf), paragraphs 100(a), (g), (i), (j) and (l): angle of attack, weight, accelerated stalls and turbulence. The [FAA catalog](https://www.faa.gov/regulations_policies/advisory_circulars/index.cfm/go/document.information/documentID/1028760) identifies the circular as active with Changes 1 and 2; the referenced foundational paragraphs were read in the linked base edition.
* [SAIB CE-11-17, 18 January 2011](https://www.cessnaflyer.org/media/k2/attachments/ce-11-17.pdf): original FAA bulletin reproduced by Cessna Flyer. Read its two pages, including the reduced-weight formula and warnings against immediate reversals and simultaneous full inputs. The FAA DRS record was found but its browser response supplied no document text, so the article links the inspected reproduction and identifies its host.
* [Diamond DA 40 NG AFM](https://device.report/m/f374f4495a59a48f5227210f78a755a16d820a4072e4b1679791d61ea28be72a): manufacturer-authored document 6.01.15-E, Revision 4, 31 December 2024, inspected through its reproduced text. Pages 0-1, 2-3 and 2-17 establish the edition, operating maneuvering-speed bands and separate load restrictions. The official technical-publications portal returned a loading/CSS error. No claim of a current serial-specific manual, latest revision, or applicability to a listed aircraft is made. The article uses its table only to illustrate reading a published band.
* [Current 14 CFR §91.9](https://www.ecfr.gov/current/title-14/section-91.9): operating-limit compliance.
* Audience signals: [2019 returning-pilot question](https://www.reddit.com/r/flying/comments/du8608) and [2026 chandelle-entry-speed question](https://www.reddit.com/r/flying/comments/1tomdvs/chandelle_entry_speed/). Retrieved discussions demonstrate the weight and terminology questions; forum numbers and advice aren't technical evidence. The planned Pilots of America thread timed out and wasn't used for a factual claim.

All teaching weights, speeds, limits, forces and practice questions are original and explicitly hypothetical. No flying experience, interview, inspection or independent CFI review is claimed. Proposed instructor review remains an editorial enhancement.

## Assets and checks

Built-in image generation produced the original no-text 3:2 cover. It was inspected and exported as a 1,536 × 1,024 WebP at [maneuvering-speed-weight-cover.webp](images/maneuvering-speed-weight-cover.webp). The exact final prompt and generated-source path are saved in [05-generation-prompt.json](images/05-generation-prompt.json). Uploaded path and descriptive alt text are in metadata and the static cover mapping.

The original SVG diagram is saved under [images/maneuvering-speed-weight-diagram.svg](images/maneuvering-speed-weight-diagram.svg) and served from `/blog/maneuvering-speed-weight-diagram.svg`. Its two curves implement n = (speed/50)^2 × 1,000/mass, with the hypothetical 4 g limit. The reference intersection is 100 KCAS; the lighter intersection is 89.442719 KCAS. It shows only the positive boundary; omitted envelope limits are stated in the article. Rendered line directions, intersections and labels were inspected.

Independent arithmetic checks confirmed the 110 × √0.8 example gives 98.386991 KIAS. Weight and speed conversions were reviewed. The article passed the prohibited-wording scan. Static Markdown rendering confirmed all nine contents targets, two scrolling tables, the diagram, related article and aircraft-classifieds links, with no scripts or hydrated island. The first rendering helper required switching its JSX call to React createElement; the corrected helper passed.

## Verified release

Node 24 `npm run verify` passed before release: generated binding types, Astro/TypeScript, lint, unit tests, static build and Worker dry run. [Source deployment 38188326055](https://github.com/discomedia/zuluniner/actions/runs/38188326055) succeeded and supplied the diagram and static cover-alt mapping.

The exact draft body and metadata matched the saved source on read-back. A fresh complete inventory was backed up in ignored `data/backups/blog-before-publish-05-2026-10-11.json` before the revision-guarded update of ID `e6293749-2894-4d75-82f8-30c73b5b9251`. [Content deployment 38188454229](https://github.com/discomedia/zuluniner/actions/runs/38188454229) succeeded; the connector reported deployed/public changes live.

The live manifest contains five posts. The article and card display the Eastern date, expected title, description and cover alt text. All nine contents targets exist; one H1 and no hydrated island were confirmed. Internal links, including classifieds and the related payload article, returned successfully. The original and 480/960/1600-requested cover variants preserve 3:2; the largest request keeps the original 1,536-pixel width. The served diagram matches the saved SVG byte for byte.

Desktop (1,280 × 900) and phone (390 × 844) views were inspected. Cover and title fit, contents clicks reach the diagram and manual headings, graph labels remain legible, and both tables fit or scroll inside their own containers. The phone page width stays 390 pixels. The phone blog card shows the correct date, cover and metadata. Temporary viewport overrides were reset.

The same heartbeat was restored in a finally step to 12 October at 6 a.m. Eastern, converted with IANA timezone data to 9 p.m. Australia/Melbourne. Its prompt, kind, destination, active status and notification settings were read back unchanged. The next uniformly randomized publication minute is persisted as 8:05 a.m. Eastern. No additional automation was created.

The plan records 5 of 36 published and 31 remaining IDs. The final scoped plan/metadata commit triggers another deployment; its terminal result is retained in ignored publishing state after verification.
