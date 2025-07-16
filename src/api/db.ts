// Database convenience functions for ZuluNiner
import { supabase } from './supabase';
import type { Aircraft, AircraftPhoto, UserProfile, SearchFilters } from '@/types';

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
      photos:aircraft_photos!inner(*)
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

export const createAircraft = async (aircraft: Omit<Aircraft, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('aircraft')
    .insert(aircraft)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateAircraft = async (id: string, updates: Partial<Aircraft>) => {
  const { data, error } = await supabase
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
  isPrimary = false
): Promise<AircraftPhoto> => {
  // Generate a unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${aircraftId}/${Date.now()}.${fileExt}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('aircraft-photos')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Get the next display order
  const { count } = await supabase
    .from('aircraft_photos')
    .select('*', { count: 'exact', head: true })
    .eq('aircraft_id', aircraftId);

  const displayOrder = (count || 0) + 1;

  // If this is primary, unset other primary photos
  if (isPrimary) {
    await supabase
      .from('aircraft_photos')
      .update({ is_primary: false })
      .eq('aircraft_id', aircraftId);
  }

  // Create photo record
  const { data, error } = await supabase
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
