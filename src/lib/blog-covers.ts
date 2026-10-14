const descriptions: Record<string, string> = {
  'cessna-172-180-conversion-records': 'Illustration of a high-wing airplane beside a hangar with its upper engine cowling open.',
  'sport-pilot-private-pilot-mosaic-aircraft': 'Illustration of a high-wing airplane and a smaller low-wing airplane parked on an apron beside a hangar.',
  'maneuvering-speed-aircraft-weight': 'Illustration of a light piston airplane in a shallow bank over countryside, with curved airflow bands behind it.',
  'airplane-ownership-cost-50-100-200-hours': 'Illustration of a high-wing piston airplane inside an open hangar, with morning light crossing the apron.',
  'four-seats-full-fuel-aircraft-payload': 'Illustration of a four-seat airplane beside a balance beam comparing fuel with passengers’ baggage.',
  'prebuy-vs-annual-inspection': 'Illustration of a light airplane in a hangar with its engine cowling open for inspection.',
  'low-engine-hours-old-overhaul': 'Illustration of a piston engine inside an airplane’s nose, with changing seasons outside the hangar.',
};

export function blogCoverAlt(slug: string, title: string): string {
  return descriptions[slug] || title;
}
