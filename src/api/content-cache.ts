import { revalidateTag, revalidatePath } from 'next/cache';

const aircraftTag = 'public-aircraft';
const postsTag = 'public-posts';

// Called after successful MCP batches, inside the Next.js route-handler context.
// Expire immediately: unpublished/deleted content must disappear on the next request.
export function invalidatePublicContent(kind: 'post' | 'aircraft') {
  revalidateTag(kind === 'post' ? postsTag : aircraftTag, { expire: 0 });
  const root = kind === 'post' ? '/blog' : '/aircraft';
  revalidatePath(root);
  revalidatePath(`${root}/[slug]`, 'page');
  if (kind === 'aircraft') revalidatePath('/');
}
