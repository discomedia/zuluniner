# A good destination METAR, a bad route: the VFR weather trap

A destination report describes one airport at one time. Your trip under visual flight rules (VFR) needs weather that works along the route, at the heights you can fly, when you expect to get there. Green endpoints leave much of that question unanswered.

On 30 October 2026, Roanoke and Blacksburg, Virginia, reported clear skies and about 16 km (10 statute miles) of visibility. A nearly contemporaneous report from Lynchburg showed about 2.8 km (1¾ statute miles) in mist, also with a clear-sky code. Those reports make a compact example of how a promising destination can distract you from another part of a proposed flight.

**This is a dated ground-study case, not a current weather briefing.** The observations and forecasts below are real NOAA products; the proposed training route is fictional. No flight, instructor endorsement or pilot decision is being reported.

## Contents

* [The dated Virginia study case](#the-dated-virginia-study-case)
* [Read visibility separately from clear skies](#read-visibility-separately-from-clear-skies)
* [Put the forecast and observation on one timeline](#put-the-forecast-and-observation-on-one-timeline)
* [Brief the route at the planned time](#brief-the-route-at-the-planned-time)
* [Keep cloud heights and terrain on the same basis](#keep-cloud-heights-and-terrain-on-the-same-basis)
* [Turn missing evidence into a planning action](#turn-missing-evidence-into-a-planning-action)
* [Update the plan before options narrow](#update-the-plan-before-options-narrow)
* [Match the airplane to a realistic mission](#match-the-airplane-to-a-realistic-mission)

## The dated Virginia study case

Imagine a VFR training trip from Roanoke Regional (**KROA**), with an intermediate landing at Lynchburg Regional (**KLYH**), finishing at Virginia Tech/Montgomery Executive in Blacksburg (**KBCB**). This is an invented triangle, including the stop at Lynchburg. Lynchburg isn't an intermediate point on the direct Roanoke–Blacksburg route.

The [NOAA Aviation Weather Center API](https://aviationweather.gov/data/api/) supplied these observations, retrieved at 10:01 UTC on 30 October 2026. UTC, also written Z, is used throughout this case. The [fixed study archive](/blog/weather/2026-10-30-virginia-study.json) preserves the exact reports, API fields, source URLs and separate retrieval times.

| Role / airport | UTC | Visibility, sky; API category |
| --- | --- | --- |
| Departure: KROA | 09:54 | About 16 km (10 SM); `CLR`; VFR |
| Intermediate landing: KLYH | 09:58, special report | About 2.8 km (1¾ SM); mist; `CLR`; IFR |
| Final destination: KBCB | 09:55 | About 16 km (10 SM); `CLR`; VFR |

**SM means statute miles**, not nautical miles. The metric values are rounded conversions; the original report units are preserved in the archive.

Looking only at the departure and final destination would miss the poor visibility at the planned stop. Equally, the Lynchburg report doesn't establish that every kilometre of either leg was in cloud or mist. Each station adds evidence at its location and observation time; the gaps still need investigation.

The times also matter. These observations were taken in the early morning, before the later publication of this article. They cannot establish what a pilot would encounter on an afternoon flight, nor justify applying daytime operating assumptions to an earlier departure.

## Read visibility separately from clear skies

Routine airport observations are published as METARs; a special observation is a SPECI. The Lynchburg report was:

```
SPECI KLYH 300958Z AUTO 00000KT 1 3/4SM R04/6000VP6000FT BR CLR 07/07 A3017 RMK AO2 VIS 3/4V5 T00670067
```

`SPECI` identifies a special observation. Read `1 3/4SM` as the reported prevailing visibility and `BR` as mist. The runway visual range group beginning `R04/` is a separate measurement; it doesn't replace the visibility group when reading this report. The [AWC explanation of METAR elements](https://aviationweather.gov/help/data/#metars) describes these fields separately.

`CLR` is a sky-condition code. At an automated US station it means no cloud layers were detected at or below approximately 3,660 m (12,000 ft). It doesn't describe horizontal visibility or promise a clear route through surrounding terrain. Here, reduced visibility and `CLR` appear in the same observation. [AWC sky-condition definitions](https://aviationweather.gov/help/data/#metars).

The API classified Lynchburg as IFR because of visibility. [AWC's flight-category legend](https://aviationweather.gov/gfa/help/) allows an IFR category from visibility alone; a low ceiling isn't required. Read the number and its cause rather than translating a sky code into an overall impression of good weather.

A category colour also doesn't decide whether your operation is legal. US [basic VFR weather minimums in §91.155](https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-91/subpart-B/section-91.155) depend on airspace, altitude and, in some cases, day or night, with additional provisions for airport surface areas. A terminal report doesn't supply all those facts, your actual flight visibility, or your personal operating limits.

## Put the forecast and observation on one timeline

A terminal aerodrome forecast, or **TAF**, adds expected conditions over a stated period. It covers the terminal area within about 8 km (5 statute miles) of the centre of the runway complex, rather than the entire route. [AWC TAF guidance](https://aviationweather.gov/help/data/#tafs).

The Lynchburg TAF returned by the API at 10:03 UTC was issued at 05:20 UTC. It was valid from 06:00 UTC on 30 October to 06:00 UTC on 31 October:

```
TAF KLYH 300520Z 3006/3106 20003KT P6SM SKC FM301500 28006KT P6SM SKC FM310300 03004KT P6SM SKC
```

For the period containing the 09:58 observation, it forecast visibility greater than about 9.7 km (6 SM), coded `P6SM`, and clear skies. The later observation reported much less visibility. The preserved forecast and observation therefore disagree on that element at that time.

That is a reason to investigate the discrepancy and obtain updates. This small archive doesn't establish how long the reduced visibility lasted, when another forecast was issued, or whether a different proposed arrival time would have worked. It contains neither a complete reporting sequence nor a retrospective account of the whole morning.

| Time to record | What it answers | Error to avoid |
| --- | --- | --- |
| Observation time | When the station measured the reported conditions | Treating the page retrieval time as the observation time |
| Forecast issue and valid times | Which forecast period applies to the proposed arrival | Reading a later improvement as conditions already present |
| Planned time at each route segment | Which observations, trends and forecasts need comparison | Briefing every leg against the departure time |

For the fictional triangle, the next step would be to add an actual proposed departure time and estimated time at Lynchburg and Blacksburg. Until those are specified, even a complete set of terminal forecasts has no single arrival window to answer.

## Brief the route at the planned time

A student asking [how to assess cross-country weather](https://www.reddit.com/r/flying/comments/1dlq1wp/how_do_you_assess_weather_on_a_xc_fly/) described the gap between reading METARs and TAFs and understanding the trip. That question calls for a sequence of checks, rather than another airport colour.

Start by writing the proposed route, departure time, time en route and altitude. Those are among the background details in the FAA's [standard briefing procedure](https://www.faa.gov/air_traffic/publications/atpubs/fs_html/chap5_section_2.html). They let a briefing address the intended flight rather than a general impression of the region.

Then work from departure through each leg and stop, including the AWC Graphical Forecasts for Aviation (GFA). The following are original questions to bring to a briefing; the table isn't a completed briefing for the Virginia case.

| Planning question | Evidence to examine | What to leave open until checked |
| --- | --- | --- |
| What is changing before arrival? | Weather-system movement, forecasts and successive observations | Timing and direction of deterioration or improvement |
| What is between reporting airports? | GFA ceiling/visibility and cloud products, terrain, relevant pilot reports and imagery | Whether the proposed corridor has enough weather margin |
| What could affect the chosen height? | Applicable advisories, winds, turbulence and icing information | Whether changing altitude is a realistic option |
| Where can the plan change? | Weather and aeronautical information for reachable alternatives | Whether the alternative is usable when needed |

The FAA's [preflight briefing guide, AC 91-92](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_91-92.pdf), directs pilots to consider current conditions along the route and forecasts through climb, cruise and descent. It also warns that conditions between reporting stations can be below VFR minimums even when station reports are better. Flight Service can help resolve questions the self-briefing leaves unanswered.

AWC's [Graphical Forecasts for Aviation help](https://aviationweather.gov/gfa/help/) explains both observations and model products. Its gridded ceiling/visibility analysis interpolates between observation points and may not represent actual conditions there. A continuous coloured surface on a map should therefore prompt questions about supporting evidence, rather than imply continuous measurement.

This article hasn't archived a complete GFA, advisory, imagery or pilot-report briefing for the triangle. It makes no claim that a particular ridge, valley or alternative airport was usable that morning.

## Keep cloud heights and terrain on the same basis

Reported METAR cloud bases use height above ground level (**AGL**). AWC's GFA cloud bases and tops use altitude above mean sea level (**MSL**). Check the product and legend before comparing a cloud number with a charted elevation. [AWC METAR guidance](https://aviationweather.gov/help/data/#metars), [GFA cloud guidance](https://aviationweather.gov/gfa/help/).

Consider a separate, entirely hypothetical arithmetic example: an airport at 610 m (2,000 ft) MSL reports a cloud base 914 m (3,000 ft) AGL. Adding those figures puts that reported base near 1,524 m (5,000 ft) MSL **over the airport**.

Suppose an invented ridge elsewhere on the proposed route rises to 1,372 m (4,500 ft) MSL. Subtraction gives only 152 m (500 ft) between that ridge elevation and the airport-derived cloud altitude. More fundamentally, the airport report doesn't establish the cloud base over the ridge. The calculation demonstrates a reference-system problem; it supplies neither route clearance nor a legal cloud-separation solution.

The same issue appears when a pilot selects a lower route to stay below cloud. That changes the terrain, obstacle, airspace and diversion problem. Assess the revised route as a new plan with current evidence; don't infer its acceptability from the original destination report.

## Turn missing evidence into a planning action

For the fictional Virginia trip, the study set identifies an immediate question at the intermediate stop and leaves the corridor unassessed. A defensible planning note would read: “The 09:58 KLYH observation conflicts with the earlier visibility forecast. Obtain current conditions and the trend for the proposed arrival, then reassess the stop and both legs.”

Possible planning actions include postponing, cancelling or developing a different itinerary. Each revised itinerary needs its own weather, airspace, fuel and airport checks. Deleting the red dot from a tablet route doesn't establish that the new path works.

Use the [route-weather briefing worksheet](/blog/route-weather-briefing-worksheet.md) to record sources, valid times, gaps and decisions. It asks for the evidence that would change the plan and the point at which you'll reassess it. It contains no universal ceiling or visibility recommendation.

Set those margins through training and your actual circumstances. The [VFR personal-minimums article](/blog/vfr-personal-minimums) covers that separate planning task; the [fuel-range article](/blog/aircraft-range-fuel-planning) helps test whether a proposed detour and alternative fit the fuel budget.

## Update the plan before options narrow

Before departure, check what changed since the briefing, especially any unresolved discrepancy. In flight, revisit the assumptions at planned checkpoints while alternatives are still available. A report received recently may describe conditions measured earlier; keep the observation or valid time visible alongside the display time.

Cockpit weather has transmission, coverage and product limitations. The FAA's [AIM section on Flight Information Services](https://www.faa.gov/air_traffic/publications/aim_html/chap7_section_1.html) says these services supplement other information and communications. It specifically treats graphical weather as support for strategic route selection, rather than tactical threading through hazardous weather.

Use updates to reconsider the route and ask focused questions through the available flight-information services. A newer destination METAR can answer a destination question while leaving the next section of the flight unresolved.

## Match the airplane to a realistic mission

When comparing [available aircraft](/aircraft), describe the trips you expect to make and the delays you can accept. Ask about the particular aircraft's approved equipment and limitations, then assess the pilot qualifications, proficiency and operating support needed for that mission.

An IFR-capable panel doesn't settle a weather decision. Nor does more speed remove the need to assess the route at the time you'll reach it. Build the ownership plan around trips you can assess honestly, including days when the practical answer is to travel another way.
