import { imageSize } from 'image-size';

export const IMAGE_WIDTHS = [480, 960] as const;
export type ImageFamily = { original: Uint8Array; variants: Map<number, Uint8Array> };

// Prepared uploads are owner-authorized, bounded multipart bodies. The operator
// decodes/optimizes them with Sharp; the Worker checks the complete family before
// writing anything and never calls the metered transformation service.
function preparedWebp(bytes: Uint8Array) {
  const data = Buffer.from(bytes);
  if (data.length < 20 || data.toString('ascii', 0, 4) !== 'RIFF' || data.toString('ascii', 8, 12) !== 'WEBP' || data.readUInt32LE(4) + 8 !== data.length) throw Error('Invalid prepared WebP container.');
  let imageChunks = 0;
  for (let offset = 12; offset < data.length;) {
    if (offset + 8 > data.length) throw Error('Truncated prepared WebP chunk.');
    const tag = data.toString('ascii', offset, offset + 4), length = data.readUInt32LE(offset + 4);
    if (!['VP8 ', 'VP8L', 'VP8X', 'ALPH'].includes(tag) || !length) throw Error('Use a static, metadata-free prepared WebP.');
    if (tag === 'VP8 ' || tag === 'VP8L') imageChunks++;
    offset += 8 + length + (length % 2);
    if (offset > data.length) throw Error('Truncated prepared WebP chunk.');
  }
  const info = imageSize(data);
  if (imageChunks !== 1 || info.type !== 'webp' || !info.width || !info.height || info.width > 1600 || info.height > 1600) throw Error('Prepared images must be WebP with both dimensions at most 1600 pixels.');
  return info;
}

export async function readPreparedImages(form: FormData): Promise<ImageFamily> {
  // Accept the old multipart contract during operator upgrades, but never store
  // its redundant 1600 copy or variants that cannot shrink the main image.
  const fields = ['original', ...IMAGE_WIDTHS.map(String), '1600'];
  if ([...form.keys()].some(key => !fields.includes(key))) throw Error('Unknown prepared image field.');
  const images = new Map<string, Uint8Array>();
  for (const name of fields) {
    const values = form.getAll(name);
    if (!values.length && name !== 'original') continue;
    if (values.length !== 1 || typeof values[0] === 'string') throw Error('Supply exactly one WebP file per image size, including original.');
    images.set(name, new Uint8Array(await values[0].arrayBuffer()));
  }
  const original = images.get('original')!, info = preparedWebp(original);
  const variants = new Map<number, Uint8Array>();
  for (const width of [...IMAGE_WIDTHS, 1600]) {
    const bytes = images.get(String(width));
    if (!bytes) {
      if (width < info.width) throw Error(`Supply exactly one WebP file for the ${width} variant.`);
      continue;
    }
    const size = preparedWebp(bytes);
    const expectedWidth = Math.min(width, info.width);
    if (size.width !== expectedWidth || Math.abs(size.height - Math.round(info.height * expectedWidth / info.width)) > 1) throw Error(`Prepared ${width} variant has incorrect dimensions or aspect ratio.`);
    if (width === 1600 && !Buffer.from(bytes).equals(Buffer.from(original))) throw Error('The 1600 variant must match the prepared original.');
    if (width < info.width) variants.set(width, bytes);
  }
  return { original, variants };
}
