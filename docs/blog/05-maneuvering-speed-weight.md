# Why maneuvering speed gets lower as your airplane gets lighter

A lighter airplane generally needs a lower maneuvering speed because the same aerodynamic force produces a greater load factor when there's less weight to support. Its wing can reach the critical angle of attack at a lower speed for the same load factor. That moves the positive accelerated-stall boundary to the left on a speed-versus-load-factor diagram.

The practical implication is to use the maneuvering-speed guidance for the airplane's current loading. A number memorized at maximum weight may be too high after passengers leave or fuel burns off. The speed also has specific limits: it doesn't authorize repeated control reversals or combined full inputs.

This explanation addresses US private pilots and FAA exam students. The calculations and diagram describe a fictional airplane, not a procedure for any aircraft. The manufacturer example identifies one particular manual edition. Follow your airplane's applicable flight manual, supplements and limitations; [14 CFR §91.9](https://www.ecfr.gov/current/title-14/section-91.9) requires compliance with those operating limitations.

## On this page

* [Start with load factor](#start-with-load-factor)
* [Why less weight changes the stall boundary](#why-less-weight-changes-the-stall-boundary)
* [Read the diagram without overreading it](#read-the-diagram-without-overreading-it)
* [Calculate the weight correction](#calculate-the-weight-correction)
* [Read the actual manual](#read-the-actual-manual)
* [What maneuvering speed does not cover](#what-maneuvering-speed-does-not-cover)
* [Separate maneuvering speed from turbulence guidance](#separate-maneuvering-speed-from-turbulence-guidance)
* [Four practice questions](#four-practice-questions)
* [Put the number in your loading brief](#put-the-number-in-your-loading-brief)

## Start with load factor

**Load factor**, written as *n*, is the ratio of aerodynamic lift to airplane weight in the simplified wing-loading model. In straight-and-level, unaccelerated flight, lift balances weight and *n* is 1. At twice the airplane's weight in lift, *n* is 2, commonly described as 2 g. The FAA explains this ratio and its relationship to accelerated stalls in [AC 61-67C, paragraph 100(g)](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_61-67C.pdf).

Consider a fictional airplane at **1,000 kg (2,205 lb)**. Its weight force is about 9,810 newtons. Suppose its wings produce 39,240 newtons in a simplified positive maneuver. The ratio is:

**39,240 ÷ 9,810 = 4 g.**

Now remove 200 kg (441 lb), leaving **800 kg (1,764 lb)**, and suppose the same lift force acts on it. Weight force is about 7,848 newtons:

**39,240 ÷ 7,848 = 5 g.**

The second calculation doesn't mean the pilot has commanded an identical maneuver, or that actual lift automatically stays constant after unloading. It isolates the denominator: a given force represents a larger multiple of the lighter airplane's weight.

A wing, tail, engine mount and other components also have their own load paths. The whole airplane can't be reduced to a single wing-force division. A lower total weight doesn't establish a higher approved g limit, and you can't calculate a new structural allowance by dividing the old allowance by your new weight.

## Why less weight changes the stall boundary

**Angle of attack** is the angle between the wing's chord line and the relative airflow. A stall begins when the wing exceeds its critical angle of attack. Airspeed influences how much lift it can produce before reaching that angle; speed alone doesn't define whether the wing is stalled. The FAA's [Principles of Flight chapter](https://www.faa.gov/sites/faa.gov/files/06_phak_ch4_0.pdf) explains the relationship between angle of attack, airflow and lift.

In the same configuration, with the same maximum lift coefficient and air density, maximum lift varies with the square of airspeed. Our original teaching model assumes those conditions stay fixed and ignores tail-force and dynamic effects. At a given speed, its lighter airplane has the same maximum wing-lift capacity divided by less weight.

Suppose the fictional airplane has a 1 g stall speed of **93 km/h (50 kt calibrated airspeed)** at 1,000 kg. At twice that speed, **185 km/h (100 KCAS)**, the simplified maximum lift is four times as large. At the critical angle of attack, that corresponds to 4 g at the reference weight.

At 800 kg, the same maximum lift at 100 KCAS corresponds to 5 g. If this fictional example has a constant positive limit of 4 g, the lighter case can reach that limit before reaching its stall boundary at 100 KCAS. Reducing speed reduces the lift available at the critical angle of attack.

These are invented values chosen for clear arithmetic. The example's 4 g limit isn't a statement about the certification category or approved limits of a Cessna, Piper, Cirrus or Diamond.

## Read the diagram without overreading it

A **V–n diagram** plots speed against load factor; the FAA also calls it a Vg diagram. The original drawing below shows only the positive stall boundary and a hypothetical constant positive limit. The FAA describes the broader diagram in [PHAK Chapter 5, pages 5-37–5-38](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/phak/07_phak_ch5.pdf).

![Two positive stall-boundary curves meet a hypothetical 4 g limit at about 89 KCAS for 800 kg and 100 KCAS for 1,000 kg; the lighter airplane reaches that limit at a lower speed.](/blog/maneuvering-speed-weight-diagram.svg)

*Original teaching diagram for the fictional airplane. It omits the negative-load boundary, maximum-speed boundary, gust envelope, configuration changes and dynamic loads. It isn't an aircraft operating envelope.*

Each curve marks the largest positive load factor available from the wing in this simplified model before its critical angle of attack is exceeded. Moving to the lighter case raises that maximum load factor at a given speed. The intersection with the horizontal 4 g line therefore occurs at a lower speed.

For the heavy case, the intersection is 100 KCAS. For the light case, it's about **166 km/h (89.4 KCAS)**. At speeds beyond those respective intersections, the model's wing can generate more than the assumed positive limit before stalling.

The diagram answers a narrow question about positive pitch loading. It doesn't show how much rudder the tail can tolerate, how rapidly a load changes, or what happens during successive inputs. Treating the picture as protection for every part of the airplane would extend the model beyond its assumptions.

## Calculate the weight correction

The FAA's [Special Airworthiness Information Bulletin CE-11-17](https://www.cessnaflyer.org/media/k2/attachments/ce-11-17.pdf), dated 18 January 2011 and reproduced here by Cessna Flyer, gives the reduced-weight relationship:

**Corrected maneuvering speed = reference maneuvering speed × √(current weight ÷ reference weight).**

Use matching weight units. Kilograms or pounds both work in the ratio; mixing them doesn't. The reference speed must belong to the stated reference weight. Start with approved speed tables or instructions when the manual provides them, rather than replacing them with your own calculation.

For our fictional model:

**100 × √(800 ÷ 1,000) = 89.44 KCAS.**

An original comparison table makes the square-root relationship easier to see:

| Fictional current mass | Fraction of reference weight | Speed from the model |
| --- | --- | --- |
| 1,000 kg (2,205 lb) | 1.00 | 185 km/h (100.0 KCAS) |
| 900 kg (1,984 lb) | 0.90 | 176 km/h (94.9 KCAS) |
| 800 kg (1,764 lb) | 0.80 | 166 km/h (89.4 KCAS) |
| 700 kg (1,543 lb) | 0.70 | 155 km/h (83.7 KCAS) |

Losing 20% of the reference weight reduces this speed by about 10.6%, not 20%. The square root is the reason a simple percentage subtraction gives a different answer.

The table uses **calibrated airspeed**, or CAS, to keep the aerodynamic model consistent. CAS corrects indicated airspeed for instrument and position error. A handbook may publish maneuvering speeds as KIAS, meaning knots indicated airspeed; use that stated basis in the cockpit. Don't substitute groundspeed or assume an indicated speed is numerically identical to a calibrated one. The FAA covers these definitions in [PHAK Chapter 8](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/phak/10_phak_ch8.pdf).

The square-root calculation also doesn't approve flight at a new weight or CG. A mathematically higher result above maximum weight gives you no authority to load the airplane beyond its limits.

## Read the actual manual

Manual terminology and presentation differ. For example, Diamond's **DA 40 NG AFM, document 6.01.15-E, Revision 4, dated 31 December 2024**, labels its published number **vO, operating maneuvering speed**. The inspected [manufacturer-authored manual reproduced on Device.report](https://device.report/m/f374f4495a59a48f5227210f78a755a16d820a4072e4b1679791d61ea28be72a), page 2-3, gives:

| Mass band in this edition | Published operating maneuvering speed |
| --- | --- |
| Up to 1,080 kg (2,381 lb) | 187 km/h (101 KIAS) |
| Above 1,080 kg, up to 1,180 kg (2,601 lb) | 200 km/h (108 KIAS) |
| Above 1,180 kg | 209 km/h (113 KIAS) |

That last band doesn't authorize every weight above 1,180 kg. Other approved mass and configuration limits still apply. This is a reading example from a reproduced edition, not confirmation that it applies to any particular registration or is the latest revision for that airplane. Obtain the applicable manual and supplements from the aircraft records or [Diamond's technical-publications portal](https://partners.diamondaircraft.com/s/technical-publications).

A hypothetical pilot reading this edition at **1,050 kg (2,315 lb)** would select its first band. At **1,150 kg (2,535 lb)**, they would select its second. They wouldn't interpolate a different number unless the applicable instructions called for that.

## What maneuvering speed does not cover

The FAA's [CE-11-17 bulletin](https://www.cessnaflyer.org/media/k2/attachments/ce-11-17.pdf) describes a bounded case: one full deflection of one flight control, once, affecting one rotational axis, in smooth air. It warns that the design requirements don't provide the same protection for an immediate full reversal or simultaneous full inputs in multiple axes.

That rules out interpreting the number as permission to alternate rudder pedals, combine full rudder with full elevator, or repeatedly yank and release a control. The positive-stall explanation doesn't establish protection for negative loading either. Follow the airplane's control restrictions even below the relevant speed.

A stall also brings loss-of-control risk. It isn't an operating technique for relieving an excessive load. The FAA's [stall-and-spin guidance](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_61-67C.pdf) explains that stalls can occur at different speeds and attitudes, and that increasing load factor raises stall speed. Training maneuvers belong within the airplane's approved limitations and an instructor's brief.

## Separate maneuvering speed from turbulence guidance

A rough-air procedure may refer to maneuvering speed, operating maneuvering speed or a separately published turbulence-penetration speed. Read the actual procedure and its configuration, weight and control instructions. A single placard number doesn't establish the whole procedure.

The FAA's [Chapter 5 discussion of rough air](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/phak/07_phak_ch5.pdf), page 5-37, cautions that gusts can exceed load limits regardless of the speed held. Slowing under the applicable guidance reduces exposure; it doesn't make severe turbulence acceptable or turn a thunderstorm into a route option.

Nor does the formula tell you to keep slowing indefinitely. Stall margin and controllability still affect the operating choice. Resolve the airplane's rough-air procedure before departure rather than improvising a new target from a generic diagram after turbulence begins.

## Four practice questions

These original questions test the explanation. They aren't FAA exam questions or authorization to perform a maneuver.

### 1. Why does the lighter case have a lower speed?

The fictional airplane loses weight while its configuration and assumed positive limit stay constant. Which explanation fits the model?

* **A.** Its wing becomes physically weaker whenever fuel burns.
* **B.** The same available lift produces a larger load factor at the lower weight.
* **C.** Its critical angle of attack increases in direct proportion to weight loss.

**Answer: B.** The denominator in lift divided by weight gets smaller. A incorrectly invents a change to the wing's physical strength. C changes an aerodynamic assumption that the question holds constant; the speed needed to reach the critical angle changes, not that angle simply because weight changes.

### 2. Apply the correction

A fictional reference speed is **204 km/h (110 KIAS)** at **1,250 kg (2,756 lb)**. For this exercise, assume the manual expressly calls for the square-root correction on that speed basis. At **1,000 kg (2,205 lb)**, which result follows?

* **A.** About 163 km/h (88 KIAS).
* **B.** About 182 km/h (98.4 KIAS).
* **C.** 204 km/h (110 KIAS).

**Answer: B.** Calculate 110 × √(1,000 ÷ 1,250) = 98.39 KIAS. A subtracts the 20% weight reduction directly from speed. C keeps the reference number despite the question's instruction to correct it. This hypothetical manual example is separate from the CAS-based diagram and Diamond table.

### 3. Which input exceeds the bulletin's assumptions?

A pilot is below the applicable maneuvering speed in smooth air. Which action is specifically outside the single-input case described by the FAA bulletin?

* **A.** An immediate full rudder reversal after a full rudder input.
* **B.** Reading the current weight before selecting the applicable speed.
* **C.** Consulting the approved manual for its control restrictions.

**Answer: A.** The opposite input follows the first and creates a different loading case. B supplies information needed to choose the speed. C establishes restrictions; it doesn't apply a flight-control load. Being below the speed doesn't validate A.

### 4. What does a speed calculation establish?

You calculate a reduced-weight maneuvering speed before a flight where significant turbulence is forecast. What has the calculation established?

* **A.** Severe turbulence cannot damage the airplane below that number.
* **B.** Every training maneuver should be entered at that exact speed.
* **C.** One weight-related reference, to be read with the applicable procedures and weather decision.

**Answer: C.** A invents a gust guarantee. B confuses a maneuvering-speed limit with an entry recommendation for every maneuver. C keeps the result within its scope; the flight manual and the decision about whether to encounter those conditions still need attention.

## Put the number in your loading brief

Record the airplane's current mass, CG, configuration and applicable maneuvering-speed guidance beside the rest of your departure calculations. If a passenger leaves or you make a substantial fuel change, revisit the loading assumptions rather than carrying yesterday's number into today's flight.

For a purchase, the same habit starts with the aircraft's documents. When you [compare airplanes for sale](/aircraft), ask for the applicable manual, supplements and current weight-and-balance record. An advertised seat count or engine conversion doesn't establish those limitations. Our [four-seat payload guide](/blog/four-seats-full-fuel-aircraft-payload) shows how to build the loading case before assessing performance.

A good exam explanation connects weight, maximum lift and load factor, then states the model's limits. A good flight brief takes the next step: it identifies the approved number and procedure for the airplane you're actually flying.
