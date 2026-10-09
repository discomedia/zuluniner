# Scheduled blog publishing

Requested on 10 October 2026 (Australia/Melbourne). Automation: **ZuluNiner daily blog publishing**, ID `zuluniner-daily-blog-publishing`, attached to the original blog-planning chat.

## Cadence and clock

Publish one additional planned article per Eastern calendar day. The publishing window is **8–10 a.m. America/New_York**, including EST/EDT changes. Prepare the article at **6 a.m. Eastern**, then wake the same automation again at the day's stored random publication time. Choose uniformly from the integer minutes **8:00–9:45 a.m.**, allowing 15 minutes for deployment and verification before 10 a.m.

The first preparation is **10 October 2026 at 6 a.m. EDT**; the first selected publication time is **10 October 2026 at 8:16 a.m. EDT**. The app scheduler currently uses Australia/Melbourne, so the first preparation wake is 9 p.m. on 10 October locally. Recalculate each particular occurrence using IANA timezone conversion; don't keep a fixed Melbourne-to-Eastern or UTC offset across daylight saving changes.

## One automation, two phases

Read ignored `data/blog-publishing-state.json` before each run. It records the automation ID, phase, Eastern date, preparation/publication timestamps, reserved draft and alert history. Save updates atomically with a temporary file and rename. Use the actual current clock and the live site to reconcile interrupted runs.

During preparation, first move this same heartbeat's next wake to the already selected publication time through the app's `automation_update` tool. Research and write the next eligible article, create its cover, run required checks and save it as a draft. Retain the exact draft ID, slug, current revision and local files in state, then set the phase to `publish`. If an interrupted run did not save that phase change, reconcile the draft and current clock before deciding which phase to resume. Do not publish during the preparation phase.

During the publication phase, publish the reviewed draft within the Eastern window. After live verification, update the media plan and publication metadata. In a finally step, move this same automation to the next Eastern day's 6 a.m. preparation, choose and save that day's new random publication time, and clear the completed draft reservation. Preserve the current automation prompt and other settings when changing the schedule. Never create a second automation to do the rescheduling.

Use the current client timezone to convert the next Eastern timestamp into the local scheduler clock, and read the saved automation back after every change. If a run wakes early, reschedule to its reserved time and return instead of holding a long sleep. If it wakes too late to publish and verify before 10 a.m., keep the draft and move to the next eligible day. Don't publish outside the window or produce extra catch-up posts.

## Editorial and release contract

Read the media plan, style guide, AGENTS.md and [publication notes](publication-notes.md). Reconcile the plan with all live posts and drafts before choosing the lowest-numbered eligible unpublished ID. Start with **04 — Airplane ownership at 50, 100 and 200 hours a year**. Reuse drafts and existing work; check titles, slugs and topic overlap before creating content. Maintain a maximum of one new planned publication per Eastern date.

Follow the existing article, metadata, source, cover and static-rendering conventions under `docs/blog/`. Research current primary sources; verify calculations and literal banned wording. Clearly identify invented teaching examples. Don't claim specialist review or an interview unless it occurred. If a topic cannot meet its evidence requirements, record the blocker and select another eligible topic without marking the blocked item complete.

Back up before production mutations. Create drafts through the ZuluNiner connector with `published=false`, and publish by updating the exact reserved draft ID with its current revision guard. Never delete live posts or aircraft as part of this schedule. Preserve user-owned changes and credentials. Use Node 24, npm and `npm run verify` before release. A content save is not a public deployment: verify terminal workflow success, the live manifest, article/card/metadata/images/links and phone/desktop layouts. Mark completion only after these checks pass. Push only scoped files and verify any deployment triggered by the final plan commit.

## Media-plan updates and alerts

After each verified publication, mark the specific ID complete with its canonical URL and Eastern publication date. Update totals and a dated publication log, and identify the next eligible ID. Count all unpublished IDs, including blocked topics, rather than only immediately commissionable ones.

Alert the user when **five or fewer unpublished topics remain**, listing the count and remaining topics. Record the threshold and date in the plan and local state so an unchanged queue does not repeat the same alert. If the count reaches zero, report exhaustion and pause this automation. Do not invent additional off-plan topics.

Local scheduled tasks need the computer on and the desktop app running. See [official scheduled-task documentation](https://learn.chatgpt.com/docs/automations).
