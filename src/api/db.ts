// Database convenience functions for ZuluNiner
import { supabase } from './supabase';
import type { AircraftPhoto, UserProfile, SearchFilters } from '@/types';
import type { TablesInsert, TablesUpdate, Database } from './schema';
import type { SupabaseClient } from '@supabase/supabase-js';

// Aircraft functions
export const getAircraft = async (id: string) => {
  const { data, error } = await supabase
    .from('aircraft')
    .select(`
      *,
      photos:aircraft_photos(*),
      user:users(name, company, phone)
    `)
    .eq('id', id)
    .eq('status', 'active')
    .single();

  if (error) throw error;
  return data;
};

export const searchAircraft = async (filters: SearchFilters, page = 1, limit = 20) => {
  let query = supabase
    .from('aircraft')
    .select(`
      *,
      photos:aircraft_photos(*)
    `, { count: 'exact' })
    .eq('status', 'active');

  // Apply filters
  if (filters.query) {
    query = query.textSearch('title,description', filters.query);
  }

  if (filters.priceMin) {
    query = query.gte('price', filters.priceMin);
  }

  if (filters.priceMax) {
    query = query.lte('price', filters.priceMax);
  }

  if (filters.yearMin) {
    query = query.gte('year', filters.yearMin);
  }

  if (filters.yearMax) {
    query = query.lte('year', filters.yearMax);
  }

  if (filters.make) {
    query = query.eq('make', filters.make);
  }

  if (filters.model) {
    query = query.eq('model', filters.model);
  }

  // Pagination
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    aircraft: data || [],
    total: count || 0,
    page,
    limit
  };
};

export const createAircraft = async (aircraft: TablesInsert<'aircraft'>, client?: SupabaseClient) => {
  const supabaseClient = client || supabase;
  const { data, error } = await supabaseClient
    .from('aircraft')
    .insert(aircraft)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateAircraft = async (id: string, updates: TablesUpdate<'aircraft'>, client?: SupabaseClient) => {
  const supabaseClient = client || supabase;
  const { data, error } = await supabaseClient
    .from('aircraft')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Photo functions
export const getAircraftPhotos = async (aircraftId: string) => {
  const { data, error } = await supabase
    .from('aircraft_photos')
    .select('*')
    .eq('aircraft_id', aircraftId)
    .order('display_order');

  if (error) throw error;
  return data || [];
};

export const uploadAircraftPhoto = async (
  aircraftId: string,
  file: File,
  altText: string,
  isPrimary = false,
  supabaseClient?: SupabaseClient<Database>
): Promise<AircraftPhoto> => {
  const client = supabaseClient || supabase;
  
  // Generate SEO-friendly filename
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const fileName = `aircraft-${aircraftId}/${timestamp}-${safeName}.${fileExt}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await client.storage
    .from('aircraft-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  // Get the next display order
  const { count } = await client
    .from('aircraft_photos')
    .select('*', { count: 'exact', head: true })
    .eq('aircraft_id', aircraftId);

  const displayOrder = (count || 0) + 1;

  // If this is primary, unset other primary photos
  if (isPrimary) {
    await client
      .from('aircraft_photos')
      .update({ is_primary: false })
      .eq('aircraft_id', aircraftId);
  }

  // Create photo record
  const { data, error } = await client
    .from('aircraft_photos')
    .insert({
      aircraft_id: aircraftId,
      storage_path: fileName,
      alt_text: altText,
      display_order: displayOrder,
      is_primary: isPrimary
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const uploadMultipleAircraftPhotos = async (
  aircraftId: string,
  photos: Array<{ file: File; altText?: string; caption?: string }>,
  supabaseClient?: SupabaseClient<Database>
): Promise<AircraftPhoto[]> => {
  const client = supabaseClient || supabase;
  const uploadedPhotos: AircraftPhoto[] = [];

  try {
    // Upload photos sequentially to maintain order
    for (let i = 0; i < photos.length; i++) {
      const { file, altText = '', caption } = photos[i];
      const isPrimary = i === 0; // First photo is primary

      // Generate SEO-friendly filename
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const timestamp = Date.now() + i; // Add index to ensure unique timestamps
      const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const fileName = `aircraft-${aircraftId}/${timestamp}-${safeName}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await client.storage
        .from('aircraft-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error(`Failed to upload photo ${i + 1}:`, uploadError);
        continue; // Skip this photo but continue with others
      }

      // If this is primary, unset other primary photos
      if (isPrimary) {
        await client
          .from('aircraft_photos')
          .update({ is_primary: false })
          .eq('aircraft_id', aircraftId);
      }

      // Create photo record
      const { data, error } = await client
        .from('aircraft_photos')
        .insert({
          aircraft_id: aircraftId,
          storage_path: fileName,
          alt_text: altText,
          caption: caption || '',
          display_order: i + 1,
          is_primary: isPrimary
        })
        .select()
        .single();

      if (error) {
        console.error(`Failed to create photo record ${i + 1}:`, error);
        // Try to clean up uploaded file
        await client.storage
          .from('aircraft-photos')
          .remove([fileName]);
        continue;
      }

      uploadedPhotos.push(data);
    }

    return uploadedPhotos;
  } catch (error) {
    // Cleanup: remove any successfully uploaded photos
    for (const photo of uploadedPhotos) {
      try {
        await client.storage
          .from('aircraft-photos')
          .remove([photo.storage_path]);
        await client
          .from('aircraft_photos')
          .delete()
          .eq('id', photo.id);
      } catch (cleanupError) {
        console.error('Cleanup failed for photo:', photo.id, cleanupError);
      }
    }
    throw error;
  }
};

// Blog functions
export const getBlogPosts = async (published = true, page = 1, limit = 10) => {
  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      author:users(name)
    `, { count: 'exact' })
    .order('published_at', { ascending: false });

  if (published) {
    query = query.eq('published', true);
  }

  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    posts: data || [],
    total: count || 0,
    page,
    limit
  };
};

export const getBlogPost = async (slug: string) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:users(name, company)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) throw error;
  return data;
};

// User functions
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
