import type { ImgHTMLAttributes } from 'react';
import { responsiveImage } from '@/lib/image-url';
type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string; fill?: boolean; priority?: boolean };
export default function Image({ src, fill, priority, style, ...props }: Props) {
  return <img {...props} src={src} srcSet={responsiveImage(src)} loading={priority ? 'eager' : 'lazy'} decoding="async" style={{ ...style, ...(fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } : {}) }} />;
}
