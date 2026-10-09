export function imageUrl(bucket: 'aircraft-photos' | 'blog-images', path: string) {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return `/images/${bucket}/${path.split('/').map(encodeURIComponent).join('/')}`;
}
export function responsiveImage(src: string) {
  if (!src.startsWith('/images/')) return undefined;
  return [480, 960, 1600].map(width => `${src}?w=${width} ${width}w`).join(', ');
}
