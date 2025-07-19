import { supabase } from './supabase';
import type { Database } from './schema';
import type { SupabaseClient } from '@supabase/supabase-js';
import sharp from 'sharp';

// Blog image upload (Supabase Storage: blog-images) with compression and keyword filename
export async function uploadBlogImageCompressed(
  file: Buffer,
  filename: string,
  altText: string,
  supabaseClient?: SupabaseClient<Database>
): Promise<{ storage_path: string; alt_text: string; public_url: string }> {
  const client = supabaseClient || supabase;
  const timestamp = Date.now();
  const safeName = filename.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const storagePath = `blog/${timestamp}-${safeName}.webp`;

  console.log(`🗜️ Compressing blog image for "${filename}"...`);
  const compressed = await sharp(file)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  console.log(`⬆️ Uploading compressed image to Supabase Storage: ${storagePath}`);
  const { error: uploadError } = await client.storage
    .from('blog-images')
    .upload(storagePath, compressed, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const publicUrl = client.storage.from('blog-images').getPublicUrl(storagePath).data.publicUrl;
  console.log(`🌐 Blog image public URL: ${publicUrl}`);

  return { storage_path: storagePath, alt_text: altText, public_url: publicUrl };
}