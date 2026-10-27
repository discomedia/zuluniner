# VOR radials and reverse sensing without memorizing the picture

A VOR radial names a line extending **from** the station. You can fly toward the station on that same radial. The number selected on a conventional indicator describes the course you want to use; it doesn't change your position, and its TO/FROM flag doesn't measure which way the nose is pointing.

VOR questions become confusing when those ideas are mixed together. Separate the aircraft's position, selected course and heading, then interpret the indication. That method works better than deciding that every TO flag means the airplane must be moving toward the beacon.

A [Pilots of America discussion about VOR radials](https://www.pilotsofamerica.com/community/threads/vor-radials.80118/) shows the recurring question: how can a clearance name a radial when the route uses it inbound? The replies explain the radial's name, but a reader still needs to connect that geometry with the instrument. The original examples below do that, using FAA material checked on **27 October 2026**.

## On this page

* [Separate the radial, course and heading](#separate-the-radial-course-and-heading)
* [Read a centered conventional CDI](#read-a-centered-conventional-cdi)
* [Move off course without changing the example](#move-off-course-without-changing-the-example)
* [Explain what reverse sensing means](#explain-what-reverse-sensing-means)
* [Read an HSI as a different presentation](#read-an-hsi-as-a-different-presentation)
* [Keep VOR, localizer and GPS guidance separate](#keep-vor-localizer-and-gps-guidance-separate)
* [Work three original ground-study cases](#work-three-original-ground-study-cases)
* [Check the installed system when comparing airplanes](#check-the-installed-system-when-comparing-airplanes)

## Separate the radial, course and heading

**VOR** stands for very high frequency omnidirectional range. It supplies bearing information relative to a ground station. In the FAA's [Pilot's Handbook of Aeronautical Knowledge, Chapter 16](https://www.faa.gov/sites/faa.gov/files/18_phak_ch16.pdf), radials extend outward from that station and use its magnetic reference. A radial is a line of position, not a command to fly away from the station.

**Course** describes an intended direction of travel along a route. **Heading** is where the nose points. Wind can make the heading needed to maintain a course different from the course itself; our [IAS, TAS and groundspeed explanation](/blog/ias-tas-groundspeed) includes an original wind-triangle example.

For this article's **fictional ground-study geometry**, place the airplane due east of a VOR, on its 090 radial. The inbound course along that line is 270°. The outbound course is 090°. All compass angles in these examples use the same magnetic reference; they aren't true bearings from a real chart.

![An airplane points west toward a VOR while its position stays on the station's eastward 090 radial.](/blog/diagrams/vor-radial-position.svg)

This original plan view shows a west-pointing airplane on the 090 radial. The blue arrow shows the radial's outward direction, rather than the airplane's motion. North is up. Aircraft symbols and distances are schematic, not to scale; these aren't actual facilities, routes or clearances.

If the airplane turns around while its position is held fixed for a ground exercise, its radial doesn't become 270. Its heading changes. That is the first fact to establish before looking at the indicator.

## Read a centered conventional CDI

A **course deviation indicator (CDI)** shows displacement from the selected course line. The **omnibearing selector (OBS)** lets you select the course. A TO/FROM indication resolves which side of the station applies to that selected direction. This section assumes a conventional VOR CDI with valid reception and no automatic reverse-sensing correction.

The FAA's [Instrument Flying Handbook, Chapter 9](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/FAA-H-8083-15B.pdf) explicitly explains that VOR orientation indications don't depend on aircraft heading. Its centered-needle example uses TO/FROM to distinguish the radial from its reciprocal. The receiver isn't measuring whether you are getting closer to the station.

Keep the airplane's position fixed on the 090 radial and compare these **original study cases**:

| OBS selection | Heading stated in the problem | Conventional indication | Position established |
| --- | --- | --- | --- |
| 090° | 090° | Centered, FROM | On the 090 radial, east of the station |
| 090° | 270° | Centered, FROM | Still on the 090 radial |
| 270° | 270° | Centered, TO | Still on the 090 radial |
| 270° | 090° | Centered, TO | Still on the 090 radial |

Changing heading alone doesn't change these idealized indications. Changing the OBS by 180° changes the selected direction and TO/FROM interpretation, while the same geometric line can still give a centered needle. A centered needle therefore doesn't prove that the selected course agrees with your intended travel.

For a centered CDI with FROM showing, the selected value identifies the radial. With TO showing, the radial is the reciprocal of the selected course. In this example, 270 TO places the airplane on the 090 radial; calling it the “270 radial inbound” would put the airplane on the opposite side of the station.

## Move off course without changing the example

Now put the airplane **north of the 090 radial**, still east of the VOR, with a westward heading. The intended inbound course is 270°. These drawings use the same off-course position and heading, changing only the OBS selection.

**270° selected: TO, needle left**

![An airplane north of the 090 radial points west; with 270 selected, a conventional CDI shows TO and a left deflection.](/blog/diagrams/vor-cdi-270-to.svg)

For an airplane pointed west, south lies to its left. The intended east–west course line is south of this aircraft, so the conventional CDI's left deflection agrees with the course geometry when 270 is selected. It shows a course-line relationship, not a complete intercept maneuver or bank command.

**090° selected: FROM, needle right**

![The same airplane stays north of the 090 radial and points west; changing only the OBS to 090 produces FROM and right deflection.](/blog/diagrams/vor-cdi-090-from.svg)

The station, radial, airplane position and westward heading haven't moved. Selecting the reciprocal reverses the conventional left/right indication and changes TO to FROM. With the airplane still intended to travel inbound, following the right-pointing needle as though it were an ordinary left/right steering command would take it farther north of the intended line.

Both figures are original, simplified teaching schematics. The left panel is a north-up position diagram; the right panel is a fixed instrument face as viewed by the pilot. The number at the top is the OBS selection, not a heading indication. The needle is drawn at full lateral deflection for this off-course example; the pictures don't supply an exact angular error, distance, calibrated instrument scale or intercept heading. The aircraft symbol's center represents its position.

## Explain what reverse sensing means

In this conventional-CDI example, **reverse sensing** describes the apparent reversal of left/right steering information when the selected course is the reciprocal of the intended course. The [FAA handbook's discussion on printed page 9-14](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/FAA-H-8083-15B.pdf) explains this relationship and says to set the VOR to agree with the intended course to avoid it.

The radio signal hasn't exchanged east and west. The instrument is still reporting the course relationship associated with your selection. The mismatch is between that selection and the way you intend to travel. Explaining the geometry tells you why the indication looks reversed; memorizing “TO is good, FROM is bad” doesn't.

FROM is the expected indication when tracking an outbound radial with its outward course selected. TO is expected for the corresponding inbound course. The word alone doesn't diagnose an error. Name the intended direction and selected course before judging it.

Don't use a deflected needle to guess a direct bearing to the station. The selected course line may be some distance to one side, and a CDI can be fully deflected over a broad area. A single radial also doesn't provide distance from the station. You need additional position information to establish a particular point along it.

## Read an HSI as a different presentation

A **horizontal situation indicator (HSI)** combines heading and course information. The FAA's [PHAK HSI explanation](https://www.faa.gov/sites/faa.gov/files/18_phak_ch16.pdf) describes a compass card, course-select pointer, deviation bar and TO/FROM indication. The pointer has a head and a reciprocal tail; the heading at the top of the card is a separate value from the selected course.

On a conventional heading-up HSI, the course pointer and bar are presented in relation to the heading card. That makes the geometry visible in a way that a fixed left/right CDI cannot. You must read the course arrow and the bar together, rather than transferring the raw screen-left/screen-right conclusions from the conventional-CDI drawings above.

Electronic displays add another reason to identify the exact presentation. The [Garmin GI 275 Pilot's Guide, Revision S](https://static.garmin.com/pumac/190-02246-01_s.pdf), on printed page 48, describes automatic reverse-sensing correction for a lateral-deviation presentation. It also separately describes its HSI and CDI pages, with the CDI page analogous to a traditional mechanical CDI. Those page descriptions should be read with the installed system's configuration and applicable documentation.

Display behavior depends on the system and page, and the selected course still needs to agree with the intended route. Establish the navigation source, display page, selected course, heading reference and any automatic correction before applying a rule from another cockpit. These diagrams specifically show an uncorrected conventional VOR CDI.

## Keep VOR, localizer and GPS guidance separate

A similar-looking needle can represent a different navigation source. A **localizer** supplies lateral guidance associated with an instrument landing system. A **GPS** navigator can supply course guidance without using the received VOR signal. Looking at the shape or colour of the pointer alone isn't enough to establish which source is active.

The [Instrument Flying Handbook's localizer discussion](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/FAA-H-8083-15B.pdf), on printed page 9-40, explains that rotating the OBS doesn't change a conventional localizer needle's operation. You cannot transfer the VOR example's “turn the OBS 180° and the indication reverses” relationship to a localizer. Back-course procedures and system-specific correction modes need their own training and documentation.

For VOR use, a plausible indication also doesn't establish that the signal is suitable. The FAA [navigation chapter](https://www.faa.gov/sites/faa.gov/files/18_phak_ch16.pdf) covers station identification, warning flags and reception limits. Check the intended station's identity, valid source indication and current availability. These ground diagrams assume a correctly identified, usable signal; they don't establish serviceability of an installed receiver or availability of a real facility.

Near station passage, indications can change rapidly in the region above the transmitter. The handbook describes this zone of confusion. The fixed-position examples intentionally avoid that region and the TO/FROM transition boundary. Don't force an ambiguous real indication to match a clean textbook picture.

## Work three original ground-study cases

These are **invented learning questions**, not recalled FAA exam questions or instructions to fly a maneuver. State the assumptions before answering.

| Case | Answer and reasoning |
| --- | --- |
| An airplane is on the 090 radial, heading west, with 090 selected and FROM showing. A student changes the radial's name to 270 because the nose points west. | The radial is still 090. Heading describes the nose; the radial describes position from the station. The selected course is reciprocal to the intended inbound direction. |
| The same airplane is north of that radial, heading west. Its conventional CDI shows TO and left deflection with 270 selected. What changes if only the OBS becomes 090? | FROM and right deflection. The aircraft hasn't moved, and the course line is unchanged. Its course-relative indication has reversed with the selection. |
| A pilot sees TO on an electronic display and concludes both that the aircraft is moving toward the station and that the selected source must be VOR. Is either conclusion established? | Neither follows from TO alone. The pilot must identify the active source and display behavior; the indication doesn't independently measure motion toward the station. |

For a second pass, mirror the geometry to the west side of the station. Explain the new radial and inbound course before predicting the indication. Then hold position fixed and change heading. If the answer changes solely because you rotate the airplane symbol, check whether you've accidentally treated the CDI as a heading or bearing pointer.

FlightInsight's [published VOR-simulator description](https://www.flight-insight.com/vor-simulator) covers OBS changes, CDI and TO/FROM indications, tracking and wind. At the time checked, access required a free account. Its description is an audience and teaching-method reference; this article doesn't claim that a simulator session was run or a course/video was fully reviewed.

## Check the installed system when comparing airplanes

An aircraft ad that says “VOR equipped” doesn't establish which indicator, navigation receiver or switching arrangement is installed. Ask for exact model identities and documentation, then check how the system selects and annunciates its source. Our [IFR avionics-ad checklist](/blog/ifr-avionics-ad-checklist) provides a records-based starting point.

When you [browse available aircraft](/aircraft), include familiarization with that particular navigation setup in the transition-training plan. A conventional CDI, an HSI and an electronic page can show related information with different visual behavior. Arrange a ground briefing around the installed equipment before relying on a memorized picture from another airplane.

No aircraft flight test, independent instructor review or owner interview was obtained for this article. Its original examples explain indication geometry; they don't replace an aircraft manual, current navigation information or instructor-led training.
