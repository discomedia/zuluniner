# Article 14 publication record

Prepared on 20 October 2026 Eastern. Initially saved as an unpublished draft; publication was verified later that morning, as recorded below. Reserved publication: **20 October at 9:25 a.m. EDT**, or **21 October at 12:25 a.m. Australia/Melbourne**, converted with IANA timezone data. The 5:56 a.m. Eastern preparation wake started immediately, as authorized. Before drafting, this same heartbeat was moved to the existing publication target; its prompt, kind, destination, status and notification settings were preserved and read back.

Draft ID: `d6a509d7-e7d4-4854-ae1d-9aea1f6c5981`. Saved revision: `2026-10-20T10:07:10.085046+00:00`. Slug: `buy-airplane-private-pilot-training`. Draft-save publication ID: `38942464-67ee-4e10-abe4-325be17e2b89`. At publication, the latest revision was read again and this exact draft ID was updated with its revision guard. The canonical URL is `https://zuluniner.com/blog/buy-airplane-private-pilot-training/`.

The full connector inventory and live manifest contained 11 published posts and no overlapping draft before creation. A complete inventory backup was saved under ignored `data/backups/` before the production mutation. Topic 14 is the lowest eligible unpublished topic; blockers 10 and 12 are unchanged. At preparation, counts were **11 published, 25 unpublished**, including those blocked IDs and this draft.

## Research and scope

This is a US-first planning article for an ordinary airplane single-engine private-pilot training arrangement, rather than a claim that all certification paths or aircraft categories have identical requirements. Current eCFR pages inspected on 20 October display Title 14 as updated through 16 October 2026, last amended 15 October.

- [§61.109](https://www.ecfr.gov/current/title-14/section-61.109): paragraph (a)'s 40-hour minimum, 20 hours of instructor training, 10 hours solo and further specified requirements/exceptions. The article doesn't predict completion at the minimum or assign these figures to a Part 141 course.
- [§61.87](https://www.ecfr.gov/current/title-14/section-61.87): required student training and the make/model solo endorsement condition within the preceding 90 days. Insurance coverage and regulatory permission are separate checks.
- [§61.23](https://www.ecfr.gov/current/title-14/section-61.23): medical requirements depend on the operation and stated exceptions. The article directs the proposed operation to be resolved without claiming a medical assessment or a universal medical route.
- [§61.45](https://www.ecfr.gov/current/title-14/section-61.45): practical-test aircraft, equipment, controls and operating limitations. Candidate configuration needs instructor/examiner checking.
- [§91.403](https://www.ecfr.gov/current/title-14/section-91.403): owner/operator responsibility for airworthiness.
- [§91.409](https://www.ecfr.gov/current/title-14/section-91.409): annual and separate 100-hour provisions, including exceptions and the aircraft-provider condition for instruction.
- [FAA Pipitone interpretation, 2016](https://www.faa.gov/about/office_org/headquarters_offices/agc/practice_areas/regulations/interpretations/Data/interps/2016/Pipitone_2016_Legal_Interpretation.pdf): all five PDF pages were available through the FAA; the interpretation's operational reasoning on page 2 was read, with the attached incoming correspondence distinguished from the FAA answer. It explains that the student providing the aircraft differs from an instructor providing both airplane and instruction. The article avoids a blanket inspection exemption based on ownership or a blanket 100-hour requirement based only on paying a CFI. The PDF was also downloaded and extracted under ignored `data/research/`.

The [2023 owner-training discussion](https://www.reddit.com/r/flying/comments/16ptju2/) was read, including the original post and replies. Its author describes a purchase after the private certificate for subsequent flying/training, scheduling advantages, maintenance coordination and equipment problems. It supplies audience context, not verified present-day prices or a controlled buy-versus-rent comparison. No first-person ownership experience was invented for ZuluNiner. Historical dollar figures from that thread aren't repeated as current market evidence.

FAA training FAQs and a buyer-guide search result were also located. A direct medical FAQ route and the buyer-guide PDF didn't return usable full content in the web tool, so the article's regulatory claims rely on the current eCFR pages actually read. No inaccessible guide is represented as inspected.

No CFI, insurer, broker, mechanic or owner was contacted or interviewed. No insurance quote, policy review, financing quote, resale valuation, market-price survey or independent professional review is claimed. Insurance and service-access passages are questions for the reader's proposed arrangement.

## Original budget and worksheet

Every budget amount is a hypothetical USD teaching input. It assumes a cash purchase and six-month holding period, with the same aircraft billing-hour basis on both sides. It isn't a complete pilot-certificate budget or an estimate of typical training hours.

- Chosen holding costs USD 4,500 + acquisition expenses USD 1,500 + (USD 60,000 purchase − USD 54,000 net sale proceeds) = USD 12,000 fixed aircraft cost in this model.
- Rental aircraft cost = USD 175 × H; owner aircraft cost = USD 12,000 + USD 85 × H.
- 70 hours: USD 12,250 rental; USD 17,950 ownership; ownership costs USD 5,700 more.
- 100 hours: USD 17,500 rental; USD 20,500 ownership; ownership costs USD 3,000 more.
- 140 hours: USD 24,500 rental; USD 23,900 ownership; ownership costs USD 600 less.
- Crossing point with the other inputs fixed: 12,000 ÷ 90 ≈ 133.3 hours.
- Adverse 70-hour case: extra repair USD 3,000 above the allowance + extra holding USD 1,200 + lower net resale USD 2,500 = USD 6,700 added. USD 17,950 + USD 6,700 = USD 24,650, or USD 12,400 more than the original rental case.

Taxes, borrowing, capital opportunity cost, major unplanned repairs and differences in instruction/other training costs are explicitly excluded from the base model and must be added for a real decision. Purchase cash, net economic cost and loan principal aren't counted as interchangeable expenses. The worksheet separates missing inputs, arrangement checks and adverse cases. It matches its public copy byte for byte.

## Original cover and validation

The built-in image generator created an original 3:2 aircraft-focused illustration, followed by one framing refinement that moved the main wingtips away from the edges. Both generated versions and the final WebP in the preview were inspected. The aircraft is fictional; people are small and secondary, and there is no text. Exact prompts and source paths are recorded in `images/14-generation-prompt.json`. The selected asset is saved in this project, not only the generator directory.

The signed prepared-family helper uploaded and byte-verified the original and 480/960/1600 WebP variants without Cloudflare Images transformations. Signed credentials remain ignored under `data/`; only the verified storage path is attached to the post.

| Variant | Dimensions | Bytes |
| --- | --- | --- |
| Original | 1536 × 1024 | 167682 |
| 480 | 480 × 320 | 24192 |
| 960 | 960 × 640 | 72406 |
| 1600 | 1536 × 1024 | 167682 |

The existing static cover-alt map supplies a descriptive sentence. The article links to available aircraft browsing and the live mission, prebuy and annual-ownership articles. No individual listing is recommended or assigned the model's invented prices.

Node 24 `npm run verify` passed: 39 tests, Astro/TypeScript, lint, published-data build and Worker dry run. A separate production-renderer check passed 1,948 words, eight contents targets, two tables with ten body rows, all budget calculations, worksheet identity and the literal banned-word scan. No hydrated article island is introduced.

Desktop 1280 × 900 and phone 390 × 844 previews were inspected. Cover and title fit. Phone width stays 390 pixels and tables have contained horizontal overflow. Keyboard activation of the budget contents link reaches its matching heading. Preparation source/deployment evidence is retained in ignored state. Live article/card/device checks were repeated after publication, as recorded below.

## Verified publication — 20 October 2026 Eastern

Published at **9:35:12 a.m. EDT** using the exact draft ID and its latest revision guard. Publication ID: `fb3e4907-7877-4d98-ac1c-c4745a2ea168`. The [content deployment](https://github.com/discomedia/zuluniner/actions/runs/39431684415) completed successfully at 9:37 a.m. EDT, and the connector reported the publication deployed and public changes live. Canonical article: [Should you buy an airplane for your private-pilot training?](https://zuluniner.com/blog/buy-airplane-private-pilot-training/).

Before publishing, the complete inventory and live manifest were backed up and reconciled: 11 published posts, this matching draft, and no new publication on 20 October Eastern. All saved article fields matched the reviewed local payload. Node 24 `npm run verify` passed again, including 39 tests, Astro/TypeScript, lint, static build and Worker dry run.

The deployed page passed one-H1, title, canonical, description and Open Graph checks; descriptive cover alt text and responsive source paths; all eight contents targets; both tables; the exact worksheet bytes; all internal links including aircraft browsing; blog-card metadata and cover; and the 12-post live manifest. Original and all three responsive cover files matched the verified upload family byte for byte. No hydrated article island was present. Desktop 1280 × 900 and phone 390 × 844 views were inspected. Phone page width remained 390 pixels, tables had contained horizontal scrolling, and keyboard activation of the budget contents link reached its heading.

The same automation was reset in a finally step to **21 October at 6 a.m. EDT** (9 p.m. Australia/Melbourne), with a newly selected, persisted **9:04 a.m. EDT** publication target (22 October at 12:04 a.m. Australia/Melbourne). IANA timezone conversion and a saved-settings readback confirmed the update; the prompt and other settings were preserved. Totals after verified publication: **12 published, 24 unpublished**. Topic 15 is next; topics 10 and 12 remain blocked and counted. No exhaustion alert is due.
