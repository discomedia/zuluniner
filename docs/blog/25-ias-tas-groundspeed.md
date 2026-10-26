# IAS, TAS and groundspeed: which number answers which question?

Use the aircraft's specified airspeed reference to fly its procedures and respect its limits. Use true airspeed to describe movement through the air and plan for wind. Use groundspeed to work out progress along a route. Those numbers can differ substantially while every instrument is working correctly.

The common shortcut—fly IAS, plan TAS, time with groundspeed—is a starting point. You still need the airplane's calibration data, the right atmospheric inputs and the direction of the wind. You also need to read the units beside an advertised cruise figure before comparing airplanes.

A [Pilots of America TAS-calculation question](https://www.pilotsofamerica.com/community/threads/tas-calc-help.77391/) illustrates the confusion: the discussion mixes indicated altitude, pressure altitude, temperature and a changed static source. Some replies help; a quick percentage correction alone cannot resolve all of those questions. This US-first explanation uses the FAA's [Pilot's Handbook of Aeronautical Knowledge](https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak), checked on **26 October 2026**. All numerical scenarios below are original, hypothetical study cases.

## On this page

* [Name the reference before comparing speeds](#name-the-reference-before-comparing-speeds)
* [Correct the indication before correcting density](#correct-the-indication-before-correcting-density)
* [Case 1: explain the cruise display](#case-1-explain-the-cruise-display)
* [Case 2: time the round trip](#case-2-time-the-round-trip)
* [Case 3: include the crosswind direction](#case-3-include-the-crosswind-direction)
* [Read the speed basis beside a limitation](#read-the-speed-basis-beside-a-limitation)
* [Compare an advertised cruise claim](#compare-an-advertised-cruise-claim)
* [Check your reasoning before the next flight](#check-your-reasoning-before-the-next-flight)

## Name the reference before comparing speeds

**Indicated airspeed (IAS)** is the airspeed indicator's reading. A conventional instrument responds to the difference between pitot and static pressure, rather than measuring distance traveled in a given time. The FAA explains the instrument and its errors in [Chapter 8, Flight Instruments](https://www.faa.gov/sites/faa.gov/files/10_phak_ch8.pdf).

**Calibrated airspeed (CAS)** corrects IAS for instrument and installation errors. A particular indicated value can correspond to a different calibrated value, especially at low speed or with a different flap configuration. Use that aircraft's calibration chart when a calculation calls for CAS; don't invent a fixed correction for the whole operating range.

**True airspeed (TAS)** is speed relative to the surrounding air mass. Lower-density air requires a higher TAS to produce the same low-speed pressure indication. This explains how the airplane can show the same IAS at two altitudes while traveling through the air at different speeds. It doesn't establish that the airplane can maintain any chosen IAS at any altitude or power setting.

**Groundspeed (GS)** is speed over the ground. Wind connects the air-relative and ground-relative motion. In steady, level flight through a uniform air mass, a tailwind can raise GS without raising TAS. Changing wind, gusts and wind shear introduce additional effects; the steady-wind examples here don't describe those transients.

| Question | Reference to start with | What else you need |
| --- | --- | --- |
| What speed should I use for this aircraft procedure? | The reference specified in its manual, often IAS | Weight, configuration, conditions and any stated corrections |
| How fast is it moving through the air? | TAS | Valid air-data inputs and the method used to obtain TAS |
| How long will this route leg take? | GS along the intended track | Distance, wind, heading and changes along the route |
| Does this cruise claim match another airplane's? | A common speed basis, usually TAS | Units, altitude, power, fuel flow, weight and configuration |

A value marked **KIAS** is in knots indicated; **KCAS** means knots calibrated and **KTAS** means knots true. The K identifies knots, not kilometres. Keep that suffix when copying a figure into your notes.

## Correct the indication before correcting density

For ordinary light-airplane calculations, the FAA's Chapter 8 method starts with CAS, pressure altitude and outside air temperature. A flight computer then supplies TAS. Pressure altitude is referenced to standard pressure; a local altimeter reading isn't automatically the same input. Nor should you enter density altitude into a field labeled pressure altitude and then independently apply temperature again.

The more complete correction sequence includes **equivalent airspeed (EAS)**: CAS corrected for compressibility, followed by the density correction to obtain TAS. [Chapter 11, Aircraft Performance](https://www.faa.gov/sites/faa.gov/files/13_phak_ch11.pdf), defines these airspeeds. At the modest speeds in our examples, we neglect compressibility for the teaching calculation. That simplification doesn't extend to every fast airplane or high-altitude operation.

Chapter 8 also gives an approximate two-percent-per-1,000-ft shortcut. It is a percentage of CAS, and its result is an estimate. It doesn't explicitly account for the day's temperature or repair a bad IAS-to-CAS assumption. Use the flight-computer method with the stated inputs when accuracy affects the plan.

If a display calculates TAS automatically, learn which sensors and settings it uses. An incorrect temperature input or a pitot/static problem doesn't become reliable because the answer appears digitally. A GPS groundspeed reading alone also cannot establish TAS when the wind is unknown.

## Case 1: explain the cruise display

Consider a **fictional light single** in steady, level cruise. Its indicated speed is **185 km/h (100 KIAS)**. For this exercise only, its calibration chart converts that reading to **189 km/h (102 KCAS)**. Pressure altitude is **1,829 m (6,000 ft)** and outside air temperature is **20°C (68°F)**. These aren't data for a particular model or aircraft for sale.

Using the pressure and temperature to correct the calibrated speed gives approximately **213 km/h (115 KTAS)**. The result is rounded; the example uses the low-speed density approximation, with compressibility neglected. It demonstrates the input sequence rather than claiming a flight-test measurement.

Now add a steady wind directly opposing the route at **37 km/h (20 kt)**. With heading and track aligned in this level-flight example, groundspeed is approximately **176 km/h (95 kt)**:

`115 KTAS − 20 kt direct headwind = 95 kt groundspeed`

A **92.6 km (50 NM)** leg takes about **31.6 minutes** at that groundspeed: `50 ÷ 95 × 60`. Using the 100-KIAS indication gives 30 minutes; using 115 KTAS without wind gives about 26.1 minutes. Both miss part of the problem.

Those figures describe only this constant-speed cruise leg. A real fuel/time plan must also account for climb, descent, changing winds and the required reserves. A more precise cruise calculation cannot compensate for leaving those phases out.

**Study check:** If the headwind becomes a tailwind of the same strength while TAS stays fixed, which number changes? GS becomes about **250 km/h (135 kt)**. The wind hasn't turned the 115-KTAS air-relative motion into a 135-KTAS cruise performance claim.

## Case 2: time the round trip

For a separate **hypothetical level-flight problem**, assume **222 km/h (120 KTAS)** throughout. Fly a **185.2 km (100 NM)** leg directly into a steady **56 km/h (30 kt)** wind, then return the same distance with that wind directly behind you. Ignore turns, climb and descent for this arithmetic exercise.

| Leg | Groundspeed | Time for 100 NM |
| --- | --- | --- |
| Outbound, direct headwind | 167 km/h (90 kt) | 66.7 minutes |
| Return, direct tailwind | 278 km/h (150 kt) | 40.0 minutes |
| Total | Two equal-distance legs | 106.7 minutes |

In still air, the round trip takes 100 minutes. Equal headwind and tailwind don't cancel the extra time: you spend longer on the slower leg. Adding 90 and 150 and dividing by two gives 120, but that arithmetic average doesn't account for the unequal time spent at each speed.

This is an application of the wind effects described in the FAA's [Chapter 16, Navigation](https://www.faa.gov/sites/faa.gov/files/18_phak_ch16.pdf). It also explains why a screenshot of a fast return leg says little about the time needed for the whole mission. Recalculate each leg with its own distance and forecast conditions.

**Study check:** Would averaging the two groundspeeds work if you spent equal time at each speed? Yes, for the average speed over those equal-time intervals. The original question specifies equal distances instead.

## Case 3: include the crosswind direction

A third **original study case** asks you to maintain a northbound track in level flight at **185 km/h (100 KTAS)**. The steady wind is from the west at **37 km/h (20 kt)**, exactly perpendicular to the desired track. All directions in this case are true; no magnetic conversion is included.

Pointing north would let the wind carry the airplane east. To hold the track, head into the wind, approximately **11.5° west of north**, or **348.5° true**. Part of the air-relative velocity now opposes the sideways wind. Its remaining northward component is about **181 km/h (98 kt)**.

The [FAA wind-triangle discussion](https://www.faa.gov/sites/faa.gov/files/18_phak_ch16.pdf) treats these motions as vectors: both direction and magnitude count. For this perpendicular-wind case, the study calculations are `arcsin(20 ÷ 100)` for the correction angle and `√(100² − 20²)` for GS. These equations assume the stated steady, level conditions and a maintainable track.

![An original velocity triangle: a west-of-north TAS arrow plus an eastward wind arrow produces a northbound groundspeed arrow.](/blog/diagrams/airspeed-crosswind-triangle.svg)

This original diagram shows velocity relationships, not a map of an actual flight. Up represents north. The short wind arrow points east because a wind **from** the west carries the air east. Arrow lengths are proportional to the scenario's speeds; labels identify TAS, wind and GS. The TAS arrow's slant represents heading, while the GS arrow represents the maintained track.

Subtracting the entire 20-kt wind as though it were a headwind would give 80 kt, which doesn't fit this geometry. Ignoring wind because its along-track component is zero would give 100 kt, which overlooks the heading correction. Use a wind-triangle solution when the wind isn't directly along the route.

## Read the speed basis beside a limitation

The FAA's [flight-manual chapter](https://www.faa.gov/sites/faa.gov/files/11_phak_ch9.pdf) places operating limitations, instrument markings and placards in their aircraft-specific context. Read the applicable Airplane Flight Manual or Pilot's Operating Handbook (**AFM/POH**), including supplements, rather than assigning every speed to the same reference from memory.

For example, Van's [Section 15 revision notice](https://www.vansaircraft.com/service-information-and-revisions/manual-section-15/) explicitly describes never-exceed speeds as limits on both IAS and TAS, whichever is reached first. Its stated applicability excludes the RV-12/12iS. This is a manufacturer-specific example, not a reason to replace another airplane's documented limits with a universal TAS rule.

A GPS groundspeed below a redline doesn't establish compliance with an airspeed limit. A headwind can make GS low while airspeed is high. Conversely, a high tailwind-assisted GS isn't by itself evidence that an airspeed limit has been exceeded. Compare the right reference with the applicable limit.

The same care applies at the slow end. A quoted stall speed represents stated loading and configuration conditions; it isn't a universal ground-relative boundary. Our [density-altitude explanation](/blog/density-altitude-takeoff-climb-performance) connects atmospheric conditions with departure performance, while [maneuvering speed and weight](/blog/maneuvering-speed-aircraft-weight) explains another reason a memorized number needs its conditions.

## Compare an advertised cruise claim

Before comparing two aircraft, ask whether each advertised speed is IAS, TAS or GS, and whether it is in knots or statute miles per hour. Then ask for altitude, power setting, fuel flow, weight and configuration. A fast GPS screenshot without wind information cannot establish still-air cruise performance.

For an airplane you are considering, compare the claim with applicable performance data and documented equipment. Don't infer a propeller, engine or airframe problem from one mismatched display value. First establish that the comparison uses the same basis and valid inputs; diagnosis requires additional evidence.

When you [browse available aircraft](/aircraft), keep a short note beside each cruise claim: reference and units; conditions; supporting records. That makes the seller's next question specific: “Is this KTAS at a stated altitude and power setting, or a groundspeed observed on one flight?”

## Check your reasoning before the next flight

Choose one speed from your airplane's manual and identify its units, reference and conditions. Then explain which inputs connect its indicated reading to TAS, and which wind solution connects TAS to groundspeed. Use an instructor's ground briefing to resolve any uncertainty before relying on the result in flight.

The three cases above are original teaching problems, not recalled FAA exam questions, aircraft operating instructions or measured performance. No flight test, owner interview or independent instructor review was obtained. The calculations should help you identify the question each number answers and the aircraft-specific information still needed.
