import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { db } from './db';

const aircraftTag = 'public-aircraft';
const postsTag = 'public-posts';
const revalidate = 3600;

// Anonymous public reads only. Never put owner sessions or drafts in these caches.
export const getPublicAircraft = unstable_cache(async () => {
  const first = await db.aircraft.search({}, 1, 100);
  const aircraft = [...first.aircraft];
  for (let page = 2; aircraft.length < first.total; page++) {
    const next = await db.aircraft.search({}, page, 100);
    if (!next.aircraft.length) break;
    aircraft.push(...next.aircraft);
  }
  return aircraft;
}, ['public-aircraft-inventory-v1'], { tags: [aircraftTag], revalidate });

export const getPublicAircraftBySlug = cache(unstable_cache(db.aircraft.getBySlug,
  ['public-aircraft-detail-v1'], { tags: [aircraftTag], revalidate }));

export const getPublicPosts = unstable_cache((page = 1, limit = 12) => db.blog.getPosts(true, page, limit),
  ['public-posts-v1'], { tags: [postsTag], revalidate });

export const getPublicPost = cache(unstable_cache(db.blog.getPost,
  ['public-post-detail-v1'], { tags: [postsTag], revalidate }));

