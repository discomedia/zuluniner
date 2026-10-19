# Article 13 preparation and evidence record

Prepared on 19 October 2026 Eastern for the existing 9:06 a.m. EDT target. The preparation wake arrived at 6:19 a.m.; the same automation was moved before drafting to the preserved publication target, which is 12:06 a.m. Australia/Melbourne on 20 October. IANA timezone conversion was used and other automation settings were preserved.

Topic 10's evidence blocker is unchanged. Topic 12 was considered next; its owner interview, current applicable maintenance evidence and supplier-confirmed parts support weren't available. The [blocker](12-comanche-250.blocker.md) records the limits. Topic 13 is the lowest eligible unpublished topic. Ten published posts and no overlapping drafts were found in the full connector inventory and live manifest. Both blocked topics count in the 26 unpublished planned IDs.

## Sources actually inspected

- [Textron Skyhawk specifications](https://cessna.txtav.com/en/piston/cessna-skyhawk), current page read 19 October: four occupants, 2,550 lb maximum takeoff weight, 53 US gal usable fuel. Its factory empty weight and advertised payload are deliberately not assigned to the fictional candidate. The page also distinguishes ramp from takeoff weight.
- [Piper PA-32-300 Information Manual, 761-559](https://www.piperowner.org/talk/uploads/editor/j8/881ruic1xaxw.pdf), issued July 1973, 113-page scan downloaded and text extracted. Applicability limits and revision warning were read. Report VB-551 page 5-7, revised 11 January 1974 (PDF page 64), was rendered and visually inspected: licensed empty weight, separate 22.5 lb oil line, 12 US qt, 3,400 lb gross-weight subtraction. This is historical manufacturer reference material, not a current applicable operational manual for a listing. The linked page sometimes timed out through web retrieval; the full downloaded PDF remained available locally.
- [Piper Technical Publications](https://www.piper.com/technical-publications/): serial-specific manuals, revision checks, PIM/reference status and electronic-publication route. No inaccessible current manual is claimed to have been read.
- [FAA PHAK chapter 10](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/phak/12_phak_ch10.pdf): weight records, equipment changes and balance. Current page read.
- [FAA PHAK chapter 11](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/phak/13_phak_ch11.pdf): aircraft performance and effects of atmospheric conditions/weight. Web rendering rejected its 15 MB size; downloaded PDF text was extracted and relevant passages inspected instead.
- [Audience question about a club Cherokee Six's carrying capacity](https://www.reddit.com/r/flying/comments/kuwbk5/why_is_the_useful_load_for_a_19781979_piper/): question and replies inspected. It demonstrates confusion over equipment, full tanks and empty weight; comments aren't technical authority. The original media-plan F14 thread timed out, so its detailed answers aren't represented as read.

The 1977 Six listing was read through the connector with its full source description. It advertises 1,294 lb, factory A/C, club seating and upgraded avionics. Registration N444LC and serial 32-7740047 match the other syndicated record; these are the same aircraft, not two independent payload measurements. No inspection, current weighing, condition assessment, owner interview, CFI review or supplier quotation is claimed.

## Original teaching arithmetic

All three invented empty weights include installed equipment, unusable fuel and assumed full operating oil. The figures aren't listing specifications or factory-standard weights. Pounds are the calculation basis; metric displays are rounded using 0.45359237 kg/lb and 3.785411784 L/US gal.

- A: 2,550 − 1,650 − 40 × 6 = 660 lb for people and bags.
- B: 3,400 − 2,000 − 60 × 6 = 1,040 lb.
- C: 3,400 − 2,150 − 60 × 6 = 890 lb.
- Four adults and bags: 4 × 180 + 60 = 780 lb; margins −120/+260/+110 lb.
- Five adults and bags: 960 lb; B/C margins +80/−70 lb.
- Six adults and bags: 1,140 lb; B/C margins −100/−250 lb.
- A at 53 US gal: 2,550 − 1,650 − 318 = 582 lb.

The 40/60 US gal departure quantities are chosen arithmetic inputs, not route requirements derived from aircraft performance, actual burn figures, reserve policy or equal-range results. No fictional CG, station arms, compartment approval or performance clearance is supplied. The worksheet exposes those unfinished checks.

## Original cover, assets and validation

An original 3:2 aircraft-focused cover was made with built-in image generation and inspected. It shows a fictional low-wing long-cabin airplane with a smaller high-wing trainer and bags on an apron. No actual sale aircraft is depicted, and there is no cover text. Exact prompt and source path are in `images/13-generation-prompt.json`; the final WebP is saved in this project.

The prepared-family helper uploaded and byte-verified the original and 480/960/1600 variants without Cloudflare Images transformations. Credential receipts remain ignored in `data/`. The static cover-alt mapping was extended for this slug. The public worksheet matches its editorial source byte for byte.

Node 24 `npm run verify` passed, including 39 tests, Astro/TypeScript, lint, static build and Worker dry run. A separate production-renderer check passed 1,847 words, eight contents targets, two tables, all original load arithmetic, worksheet identity and the literal banned-word scan. Desktop 1280 × 900 and phone 390 × 844 previews were inspected; the cover and title fit, page width stays 390 pixels, table overflow is contained, and contents navigation reaches the target. Live checks must be repeated after publication.

## Verified publication — 19 October 2026 Eastern

The exact prepared draft `d1d41205-a442-4991-9544-d18da8842c39` was published at **9:12 a.m. EDT**, after the preserved 9:06 a.m. target. Its published/revision timestamp is `2026-10-19T13:12:31.142181+00:00`. Publication `f08c791f-7a45-4174-8ce5-264ff3398b43` reports deployed; [content workflow 39258192639](https://github.com/discomedia/zuluniner/actions/runs/39258192639) succeeded at 9:14 a.m. EDT. The prior draft-save and source workflows, 39257605990 and 39257724550, also succeeded.

The [live article](https://zuluniner.com/blog/cherokee-six-vs-four-seat-payload/) and blog card passed canonical/Open Graph/description metadata, cover alt text, exact original and 480/960/1600 WebP bytes, eight contents targets, two tables, all internal links including the available Six ad, and the byte-identical 2,677-byte worksheet. The original and 1600 variant are 1536 × 1024, 153770 bytes; the 480 variant is 480 × 320, 20282 bytes; the 960 variant is 960 × 640, 60430 bytes. No hydrated article island is present. Desktop 1280 × 900 and phone 390 × 844 were inspected; the page fits, table overflow stays contained, and contents navigation reaches its target.

The media plan now records **11 published, 25 unpublished**, including blocked topics 10 and 12. Topic 14 is next eligible. The same automation was reset in a finally step to 20 October 6 a.m. Eastern preparation, with a new uniformly selected publication target of **20 October 9:25 a.m. EDT** (21 October 12:25 a.m. Australia/Melbourne), using IANA timezone conversion. Other automation settings were preserved and read back.
