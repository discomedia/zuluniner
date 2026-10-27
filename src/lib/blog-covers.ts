const descriptions: Record<string, string> = {
  'vor-radials-reverse-sensing': 'Illustration of a low-wing light airplane parked on a rural apron, with a simplified radio-navigation beacon and hangar behind it.',
  'ias-tas-groundspeed': 'Illustration of a high-wing light airplane in level cruise above a winding river and countryside, with pale airflow bands in the sky.',
  'slip-vs-skid-base-to-final': 'Illustration of a light low-wing airplane in a gentle bank over countryside, with a small runway and hangars below.',
  'vfr-personal-minimums': 'Illustration of a high-wing airplane parked beside a rural hangar, with low hills and layered clouds in the distance.',
  'flight-review-preparation': 'Illustration of a low-wing airplane on an apron, with two small figures beside a hangar and a runway in the distance.',
  'ifr-avionics-ad-checklist': 'Illustration of an empty light-airplane cockpit with round instruments and two navigation screens, overlooking an apron and hangar.',
  'buy-airplane-private-pilot-training': 'Illustration of a high-wing training airplane parked outside a hangar, with two small figures and another trainer in the background.',
  'cherokee-six-vs-four-seat-payload': 'Illustration of a low-wing six-seat airplane and a smaller high-wing trainer parked near travel bags on an apron.',
  'safety-pilot-pic-cross-country': 'Illustration of a high-wing training airplane parked on an apron, with two pilots seated in the front cabin.',
  'sr22-g2-prebuy-records': 'Illustration of a low-wing composite airplane parked outside a maintenance hangar, with another airplane in the background.',
  'density-altitude-takeoff-climb-performance': 'Illustration of a high-wing airplane beside a dry runway at a mountain airport, with a windsock in the distance.',
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
