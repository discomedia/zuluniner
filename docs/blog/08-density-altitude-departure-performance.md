# Density altitude: the calculation is only the beginning

A density-altitude number doesn't tell you whether your airplane can make the departure. You still need the correct handbook inputs, actual loading, runway assumptions and climb assessment. A handbook takeoff-distance result can fit the available runway and still leave an unanswered question beyond it.

The first trap is entering density altitude into a table that asks for pressure altitude and temperature. That can count the temperature effect twice. The second is treating the distance to clear a small obstacle as proof of the climb you need farther ahead.

This US-focused guide uses sources checked on **16 October 2026**. The airport and departure plans below are fictional. The Cessna numbers come from an identified historical handbook reference copy; they don't establish performance for an individual airplane or authorize a flight.

## On this page

* [Use the altitude your chart asks for](#use-the-altitude-your-chart-asks-for)
* [Calculate two departures at the same airport](#calculate-two-departures-at-the-same-airport)
* [Read the matching Cessna tables](#read-the-matching-cessna-tables)
* [Separate the weather change from the load change](#separate-the-weather-change-from-the-load-change)
* [Check climb after the runway](#check-climb-after-the-runway)
* [Turn climb rate into distance gained](#turn-climb-rate-into-distance-gained)
* [Identify where the example stops](#identify-where-the-example-stops)
* [Choose changes you can verify](#choose-changes-you-can-verify)
* [Try two original study checks](#try-two-original-study-checks)
* [Compare airplanes with the same departure brief](#compare-airplanes-with-the-same-departure-brief)

## Use the altitude your chart asks for

**Pressure altitude** expresses the sensed pressure on the standard-atmosphere altitude scale. **Density altitude** expresses air density on that scale, accounting for nonstandard temperature. The [FAA's Principles of Flight chapter](https://www.faa.gov/sites/faa.gov/files/06_phak_ch4_0.pdf) explains how pressure, temperature and moisture affect density and performance.

A table with separate pressure-altitude rows and temperature columns already takes both inputs. Use those labelled inputs. If another chart explicitly calls for density altitude, follow that chart's instructions. The number your weather display emphasizes doesn't change the handbook's axes.

This confusion appears in [a pilot discussion about older Cessna takeoff tables](https://www.reddit.com/r/flying/comments/1s0mgx2/takeoff_tables_c172_h_poh_question_student_pilot/). The way to settle it for your airplane is to read its chart, notes and worked example together. A technique that seems convenient for one table may not transfer to another.

Density altitude also doesn't move the surrounding terrain. Keep obstacle elevations and heights on their proper references. A runway with a high reported density altitude hasn't physically moved upward to that altitude.

## Calculate two departures at the same airport

Consider a **fictional airport** at **1,829 m (6,000 ft)** elevation, with **1,000 m (3,281 ft)** of paved, level, dry runway. Assume an altimeter setting of **1,013.25 hPa (29.92 inHg)**, zero wind and no change in pressure between the two plans. Pressure altitude is therefore 1,829 m (6,000 ft) in both cases.

| Fictional plan | Outside air temperature | Planned takeoff mass | Pressure altitude |
| --- | --- | --- | --- |
| A: cooler, lighter departure | 10°C (50°F) | 862 kg (1,900 lb) | 1,829 m (6,000 ft) |
| B: hotter, heavier departure | 30°C (86°F) | 1,043 kg (2,300 lb) | 1,829 m (6,000 ft) |

For a quick training estimate, use the approximation described in [FAA Safety Briefing's density-altitude article](https://www.faa.gov/sites/faa.gov/files/2022-01/JulAug2010.pdf), pages 12–15:

**Density altitude in feet ≈ pressure altitude in feet + 120 × (actual temperature − ISA temperature), with temperatures in °C.**

ISA means International Standard Atmosphere. Using the rounded standard lapse rate of 2°C per 305 m (1,000 ft), standard temperature at this pressure altitude is **15 − 2 × 6 = 3°C**. The [Bureau of Meteorology training notes hosted by the National Weather Service](https://www.weather.gov/media/zhu/ZHU_Training_Page/winds/pressure_winds/Temp_Density_Pressure.pdf), page 12, also set out this approximation.

* Plan A: **6,000 + 120 × (10 − 3) = 6,840 ft**, or about **2,085 m** density altitude.
* Plan B: **6,000 + 120 × (30 − 3) = 9,240 ft**, or about **2,816 m** density altitude.

These rounded estimates omit humidity and aren't substitutes for a flight computer or the airplane's performance instructions. Humid air is less dense than dry air at the same pressure and temperature, as the FAA chapter explains. Don't add a generic humidity percentage to every airplane's tables.

Both takeoff lookups below still use the **6,000 ft pressure-altitude row**. The temperature column changes. Neither lookup uses 6,840 or 9,240 as its pressure altitude.

## Read the matching Cessna tables

The reference is the [1978 Cessna Model 172N Pilot's Operating Handbook](https://spartanflightacademy.com/wp-content/uploads/2025/10/Cessna-172N-POH.pdf#page=42), Figure 5-4, printed pages 5-12/5-13. The cited scan doesn't establish a current revision or applicability to any particular aircraft. Use the airplane's own approved handbook and supplements for an actual departure.

Its short-field table specifies flaps up, full throttle before brake release, a paved/level/dry runway and zero wind. Its notes address mixture above 914 m (3,000 ft). Those conditions belong beside the figures; they aren't interchangeable with another 172 variant's setup.

| Training lookup at 1,829 m (6,000 ft) pressure altitude | Ground roll | Total distance over 15.2 m (50 ft) |
| --- | --- | --- |
| A: 862 kg (1,900 lb), 10°C | 267 m (875 ft) | 480 m (1,575 ft) |
| Comparison only: 1,043 kg (2,300 lb), 10°C | 416 m (1,365 ft) | 757 m (2,485 ft) |
| B: 1,043 kg (2,300 lb), 30°C | 483 m (1,585 ft) | 882 m (2,895 ft) |

These are direct table entries, rounded to whole metres. The middle row holds temperature constant to help separate the two changes. It isn't a third observed flight.

## Separate the weather change from the load change

At the heavier loading, the increase from 10°C to 30°C changes the obstacle-distance entry from 2,485 to 2,895 ft. The calculation **(2,895 ÷ 2,485 − 1) × 100** gives about **16.5%** more distance for that temperature change, under the stated table conditions.

At 10°C, increasing the loading changes the entry from 1,575 to 2,485 ft: about **58%** more. Comparing A directly with B produces about **84%** more distance. That combined result reflects both changes; it isn't a universal penalty for a particular density altitude.

Removing load doesn't change the air's density altitude. It changes the airplane's performance within that atmosphere. This is why “the density altitude is acceptable” leaves an essential input unanswered: acceptable for which loading and configuration?

On the fictional 1,000 m runway, B's 882 m table distance leaves only **about 118 m (386 ft)** by subtraction. That arithmetic doesn't establish an adequate margin. It doesn't account for deviations from the table assumptions or tell you what happens after the specified obstacle height.

## Check climb after the runway

Figure 5-5 in the same [172N reference handbook](https://spartanflightacademy.com/wp-content/uploads/2025/10/Cessna-172N-POH.pdf#page=43), page 5-14, gives maximum-rate climb data at 1,043 kg (2,300 lb). At 6,000 ft pressure altitude, the 20°C and 40°C entries are **134 m/min (440 ft/min)** and **117 m/min (385 ft/min)**. Linear interpolation at 30°C gives about **126 m/min (413 ft/min)**. These entries assume flaps up, full throttle and 130 km/h (70 KIAS); the note specifies leaning above 914 m (3,000 ft) for maximum rpm.

There is no equivalent lighter-weight climb table in that figure. Don't assign the heavier-weight climb result to A as though both cases had been charted. The runway comparison is complete enough to show the arithmetic; the climb comparison still has a missing answer.

The [FAA's Aircraft Performance chapter](https://www.faa.gov/sites/faa.gov/files/13_phak_ch11.pdf) separates altitude gained per unit of time from altitude gained over distance. For an obstacle or rising terrain, write down where it is, how high you must be and the horizontal distance available. A positive vertical-speed indication alone doesn't answer that question.

## Turn climb rate into distance gained

Here is a **separate hypothetical arithmetic example**, with assumed values rather than a Cessna prediction. Hold climb rate at **122 m/min (400 ft/min)** and groundspeed at **185 km/h (100 kt)**. At 100 nautical miles per hour, the airplane covers **100 ÷ 60 = 1.667 NM per minute**.

The assumed gain is **400 ÷ 1.667 = 240 ft per NM**: about **39.5 m per kilometre**, or a **3.95%** ground-referenced climb gradient. If groundspeed becomes **222 km/h (120 kt)** while the assumed climb rate stays unchanged, the result falls to **200 ft per NM**, about **32.9 m per kilometre**, or **3.29%**.

This isolates the arithmetic of speed over the ground. It doesn't calculate the effects of gusts, downdrafts, turns or an actual wind profile. Use groundspeed rather than indicated airspeed in this calculation, and don't extend a constant-rate example into a prediction of the entire climb.

## Identify where the example stops

The FAA performance chapter stresses reading the conditions and notes for each chart. Build a list of the differences between the published case and the proposed departure before deciding which results you can use.

| Unresolved item | Evidence or decision still needed |
| --- | --- |
| Runway slope, contamination or different surface | Applicable handbook treatment and current runway information |
| Changing wind or temperature | Conditions expected at departure, not just an earlier observation |
| Engine, propeller or airframe changes | Correct documents and configuration-specific data |
| Obstacles beyond the table's stated height | A separate departure-path and climb assessment |
| Fuel removed to reduce weight | A revised trip-fuel and reserve calculation |
| Pilot technique differing from the published case | Instructor-led preparation and an appropriate planning margin |

Keep calculations within the published chart range; extending a line beyond its boundary doesn't supply verified data. A correction note may apply to ground roll, total distance or another particular quantity. Read that scope before applying it. An undocumented percentage from a different airplane can make a calculation look complete while leaving its basis unresolved.

Likewise, a takeoff table isn't a promise of a built-in allowance for every aircraft condition or pilot. Decide the margin you require before a trip makes the answer inconvenient. Discuss unfamiliar high-altitude departures and your decision points with an instructor who knows the aircraft and airport.

## Choose changes you can verify

Move the comparison back to inputs you can change and check. A cooler departure needs an updated weather assessment. A lighter departure needs a revised loading calculation. A different runway or airport needs its own obstacle and departure review.

Don't make the fuel line an unexplained balancing item. If reducing fuel creates a stop, include that stop and the applicable reserves in the revised plan. The [four-seat loading guide](/blog/four-seats-full-fuel-aircraft-payload) shows how fuel and passengers compete within the aircraft's documented limits.

Keep a reason beside each alternative: what problem does it resolve, and what evidence shows that it does? If the answers are still missing, delay or change the plan rather than treating an incomplete comparison as approval to depart.

## Try two original study checks

These are original exercises, not FAA exam questions. They relate to **Area I, Task F: Performance and Limitations** in the [Private Pilot Airman Certification Standards, FAA-S-ACS-6C](https://www.faa.gov/training_testing/testing/acs/private_airplane_acs_6.pdf).

**Chart inputs.** A table asks for pressure altitude and temperature. The values are 6,000 ft, 30°C and an estimated density altitude of 9,240 ft. Which pair belongs in the table: A) 6,000 ft and 30°C; B) 9,240 ft and 30°C; or C) 6,000 ft and 3°C?

**A is correct.** B substitutes a temperature-adjusted altitude and then applies the hot temperature again. C substitutes standard temperature for the actual temperature. The correct pair follows the table's labels; density altitude is still helpful as context, but it isn't an extra correction in this lookup.

**Loading and weather.** Weather stays unchanged while the planned takeoff mass decreases. Does density altitude A) stay unchanged; B) fall with the airplane's weight; or C) rise because less fuel is aboard?

**A is correct.** Air density hasn't changed. B and C confuse an aircraft-loading change with an atmospheric property. You still need to check how the new loading affects the applicable performance data and the mission's fuel requirements.

## Compare airplanes with the same departure brief

[Download the departure-comparison worksheet](/blog/density-altitude-departure-worksheet.md) and keep the weather, loading, manual references and unresolved items together. The worksheet separates the two fictional plans from calculations for a real aircraft.

When you [browse aircraft classifieds](/aircraft), ask for evidence that answers the departure problem you actually have. The [172/180 conversion guide](/blog/cessna-172-180-conversion-records) explains why an engine-power label doesn't establish weight limits or performance data. Compare candidates using their documented configurations, your recurring load and the airports you intend to use.
