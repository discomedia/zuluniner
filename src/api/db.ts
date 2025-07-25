// Database convenience functions for ZuluNiner
import { supabase } from './supabase';
import type { AircraftPhoto, UserProfile, SearchFilters } from '@/types';
import type { TablesInsert, TablesUpdate, Database, Tables } from './schema';
import type { SupabaseClient } from '@supabase/supabase-js';

// Types for function return values
type AircraftWithPhotos = Tables<'aircraft'> & {
  photos: AircraftPhoto[];
  user?: Pick<Tables<'users'>, 'name' | 'phone' | 'email'> | null;
};

type AircraftWithUser = Tables<'aircraft'> & {
  photos: AircraftPhoto[];
  user: Pick<Tables<'users'>, 'name' | 'company' | 'phone' | 'email'>;
};

type AircraftWithUserForAdmin = Tables<'aircraft'> & {
  photos: AircraftPhoto[];
  user: Pick<Tables<'users'>, 'name' | 'email' | 'company'>;
};

type SearchResult = {
  aircraft: AircraftWithPhotos[];
  total: number;
  page: number;
  limit: number;
};

type BlogPostWithAuthor = Tables<'blog_posts'> & {
  author: Pick<Tables<'users'>, 'name' | 'company'>;
};

type BlogPostsResult = {
  posts: Array<Tables<'blog_posts'> & { author: Pick<Tables<'users'>, 'name'> }>;
  total: number;
  page: number;
  limit: number;
};

// Aircraft functions
async function getAircraftById(id: string): Promise<AircraftWithPhotos | null> {
  try {
    const { data: aircraftData, error: aircraftError } = await supabase
      .from('aircraft')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (aircraftError) throw aircraftError;
    if (!aircraftData) return null;

    const { data: photosData, error: photosError } = await supabase
      .from('aircraft_photos')
      .select('*')
      .eq('aircraft_id', id)
      .order('display_order');

    if (photosError) {
      console.error('⚠️ Photos query error (non-critical):', photosError);
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('name, phone, email')
      .eq('id', aircraftData.user_id)
      .single();

    if (userError) {
      console.error('⚠️ User query error (non-critical):', userError);
    }

    return {
      ...aircraftData,
      photos: photosData || [],
      user: userData || null
    };
  } catch (error) {
    console.error('💥 Error in getAircraftById:', error);
    throw error;
  }
}

async function getAircraftByIdForAdmin(id: string, client?: SupabaseClient): Promise<AircraftWithPhotos | null> {
  const supabaseClient = client || supabase;
  
  try {
    const { data: aircraftData, error: aircraftError } = await supabaseClient
      .from('aircraft')
      .select('*')
      .eq('id', id)
      .single();

    if (aircraftError) throw aircraftError;
    if (!aircraftData) return null;

    const { data: photosData, error: photosError } = await supabaseClient
      .from('aircraft_photos')
      .select('*')
      .eq('aircraft_id', id)
      .order('display_order');

    if (photosError) {
      console.error('⚠️ Photos query error (non-critical):', photosError);
    }

    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('name, phone, email')
      .eq('id', aircraftData.user_id)
      .single();

    if (userError) {
      console.error('⚠️ User query error (non-critical):', userError);
    }

    return {
      ...aircraftData,
      photos: photosData || [],
      user: userData || null
    };
  } catch (error) {
    console.error('💥 Error in getAircraftByIdForAdmin:', error);
    throw error;
  }
}

async function getAircraftBySlug(slug: string): Promise<AircraftWithUser | null> {
  try {
    const { data, error } = await supabase
      .from('aircraft')
      .select(`
        *,
        photos:aircraft_photos(*),
        user:users(name, company, phone, email)
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error || !data) return null;
    return data as AircraftWithUser;
  } catch (error) {
    console.error('💥 Error in getAircraftBySlug:', error);
    throw error;
  }
}

async function searchAircraft(filters: SearchFilters, page = 1, limit = 20): Promise<SearchResult> {
  
  try {
    let query = supabase
      .from('aircraft')
      .select('*', { count: 'exact' })
      .eq('status', 'active');

    // Apply filters
    if (filters.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%,make.ilike.%${filters.query}%,model.ilike.%${filters.query}%`);
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

    query = query.order('created_at', { ascending: false });

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: aircraftData, error: aircraftError, count } = await query;
    
    if (aircraftError) {
      console.error('💥 Aircraft query error:', aircraftError);
      throw aircraftError;
    }

    if (!aircraftData || aircraftData.length === 0) {
      return {
        aircraft: [],
        total: count || 0,
        page,
        limit
      };
    }

    const aircraftIds = aircraftData.map(aircraft => aircraft.id);
        
    const { data: photosData, error: photosError } = await supabase
      .from('aircraft_photos')
      .select('*')
      .in('aircraft_id', aircraftIds)
      .order('display_order');

    if (photosError) {
      console.error('⚠️ Photos query error (non-critical):', photosError);
    }

    const aircraftWithPhotos = aircraftData.map(aircraft => ({
      ...aircraft,
      photos: photosData?.filter(photo => photo.aircraft_id === aircraft.id) || []
    }));

    const result = {
      aircraft: aircraftWithPhotos,
      total: count || 0,
      page,
      limit
    };
    
    return result;
    
  } catch (error) {
    console.error('💥 Unexpected error in searchAircraft:', error);
    throw error;
  }
}

async function createAircraft(aircraft: TablesInsert<'aircraft'>, client?: SupabaseClient): Promise<Tables<'aircraft'>> {
  const supabaseClient = client || supabase;
  const { data, error } = await supabaseClient
    .from('aircraft')
    .insert(aircraft)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateAircraft(id: string, updates: TablesUpdate<'aircraft'>, client?: SupabaseClient): Promise<Tables<'aircraft'>> {
  const supabaseClient = client || supabase;
  const { data, error } = await supabaseClient
    .from('aircraft')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getAllAircraft(page = 1, limit = 20): Promise<{ aircraft: Tables<'aircraft'>[]; total: number; page: number; limit: number }> {
  const offset = (page - 1) * limit;
  const { data, error, count } = await supabase
    .from('aircraft')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    aircraft: data || [],
    total: count || 0,
    page,
    limit
  };
}

async function getAllAircraftForAdmin(client?: SupabaseClient): Promise<{ aircraft: AircraftWithUserForAdmin[]; total: number }> {
  const supabaseClient = client || supabase;
  
  const { data, error, count } = await supabaseClient
    .from('aircraft')
    .select(`
      *,
      photos:aircraft_photos(*),
      user:users(name, email, company)
    `, { count: 'exact' })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return {
    aircraft: data || [],
    total: count || 0,
  };
}

async function getUserAircraft(userId: string): Promise<Tables<'aircraft'>[]> {
  const { data, error } = await supabase
    .from('aircraft')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Photo functions
async function getAircraftPhotos(aircraftId: string): Promise<AircraftPhoto[]> {
  const { data, error } = await supabase
    .from('aircraft_photos')
    .select('*')
    .eq('aircraft_id', aircraftId)
    .order('display_order');

  if (error) throw error;
  return data || [];
}

async function uploadAircraftPhoto(
  aircraftId: string,
  file: File,
  altText: string,
  isPrimary = false,
  supabaseClient?: SupabaseClient<Database>
): Promise<AircraftPhoto> {
  const client = supabaseClient || supabase;
  
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const fileName = `aircraft-${aircraftId}/${timestamp}-${safeName}.${fileExt}`;

  const { error: uploadError } = await client.storage
    .from('aircraft-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { count } = await client
    .from('aircraft_photos')
    .select('*', { count: 'exact', head: true })
    .eq('aircraft_id', aircraftId);

  const displayOrder = (count || 0) + 1;

  if (isPrimary) {
    await client
      .from('aircraft_photos')
      .update({ is_primary: false })
      .eq('aircraft_id', aircraftId);
  }

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
}

async function uploadMultipleAircraftPhotos(
  aircraftId: string,
  photos: Array<{ file: File; altText?: string; caption?: string }>,
  supabaseClient?: SupabaseClient<Database>
): Promise<AircraftPhoto[]> {
  const client = supabaseClient || supabase;
  const uploadedPhotos: AircraftPhoto[] = [];

  try {
    for (let i = 0; i < photos.length; i++) {
      const { file, altText = '', caption } = photos[i];
      const isPrimary = i === 0;

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const timestamp = Date.now() + i;
      const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const fileName = `aircraft-${aircraftId}/${timestamp}-${safeName}.${fileExt}`;

      const { error: uploadError } = await client.storage
        .from('aircraft-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error(`Failed to upload photo ${i + 1}:`, uploadError);
        continue;
      }

      if (isPrimary) {
        await client
          .from('aircraft_photos')
          .update({ is_primary: false })
          .eq('aircraft_id', aircraftId);
      }

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
        await client.storage
          .from('aircraft-photos')
          .remove([fileName]);
        continue;
      }

      uploadedPhotos.push(data);
    }

    return uploadedPhotos;
  } catch (error) {
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
}

function getPhotoUrl(storagePath: string): string {
  const baseUrl = supabase.storage.from('aircraft-photos').getPublicUrl(storagePath).data.publicUrl;
  
  // For local development, replace localhost with current host if needed
  if (typeof window !== 'undefined' && baseUrl.includes('127.0.0.1')) {
    const currentHost = window.location.hostname;
    if (currentHost !== '127.0.0.1' && currentHost !== 'localhost') {
      return baseUrl.replace('127.0.0.1', currentHost);
    }
  }
  
  return baseUrl;
}
// Get public URL for a blog image storage path
export function getBlogImageUrl(storagePath: string): string {
  if (!storagePath) return '';
  // Always return absolute URL for Next.js <Image>
  const url = supabase.storage.from('blog-images').getPublicUrl(storagePath).data.publicUrl;
  // For local dev, replace 127.0.0.1 with window.location.hostname if needed
  if (typeof window !== 'undefined' && url.includes('127.0.0.1')) {
    const currentHost = window.location.hostname;
    if (currentHost !== '127.0.0.1' && currentHost !== 'localhost') {
      return url.replace('127.0.0.1', currentHost);
    }
  }
  return url;
}

// Blog image upload (Supabase Storage: blog-images)
export async function uploadBlogImage(
  file: Buffer,
  filename: string,
  altText: string,
  supabaseClient?: SupabaseClient<Database>
): Promise<{ storage_path: string; alt_text: string }> {
  const client = supabaseClient || supabase;
  const timestamp = Date.now();
  const safeName = filename.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const storagePath = `blog/${timestamp}-${safeName}.webp`;

  const { error: uploadError } = await client.storage
    .from('blog-images')
    .upload(storagePath, file, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  return { storage_path: storagePath, alt_text: altText };
}

// Blog functions
async function getBlogPosts(published = true, page = 1, limit = 10): Promise<BlogPostsResult> {
  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      author:users(name)
    `, { count: 'exact' });

  if (published) {
    query = query.eq('published', true);
  }

  // Order by published_at DESC, then created_at DESC (so posts with null published_at still show)
  query = query.order('published_at', { ascending: false, nullsFirst: false });
  query = query.order('created_at', { ascending: false });

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
}

async function getBlogPost(slug: string): Promise<BlogPostWithAuthor | null> {
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
}

async function getAllBlogPostsForAdmin(page = 1, limit = 20): Promise<BlogPostsResult> {
  const offset = (page - 1) * limit;
  
  const { data, error, count } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:users(name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    posts: data || [],
    total: count || 0,
    page,
    limit
  };
}

async function getBlogPostByIdForAdmin(id: string): Promise<BlogPostWithAuthor | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:users(name, company)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
  return data;
}

async function createBlogPost(
  postData: Omit<Tables<'blog_posts'>, 'id' | 'created_at' | 'updated_at'>,
  client?: SupabaseClient<Database>
): Promise<Tables<'blog_posts'>> {
  const supabaseClient = client || supabase;
  
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .insert(postData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateBlogPost(
  id: string,
  updates: Partial<Omit<Tables<'blog_posts'>, 'id' | 'created_at'>>,
  client?: SupabaseClient<Database>
): Promise<Tables<'blog_posts'>> {
  const supabaseClient = client || supabase;
  
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deleteBlogPost(id: string, client?: SupabaseClient<Database>): Promise<void> {
  const supabaseClient = client || supabase;
  
  const { error } = await supabaseClient
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// User functions
async function getUserById(userId: string): Promise<Tables<'users'> | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  return data;
}

async function getUserProfile(userId: string): Promise<UserProfile | null> {
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
}

async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<Tables<'users'>> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getUserCount(): Promise<number> {
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}

// Export structured API
export const db = {
  aircraft: {
    getById: getAircraftById,
    getByIdForAdmin: getAircraftByIdForAdmin,
    getBySlug: getAircraftBySlug,
    search: searchAircraft,
    create: createAircraft,
    update: updateAircraft,
    getAll: getAllAircraft,
    getAllForAdmin: getAllAircraftForAdmin,
    getUserAircraft: getUserAircraft,
  },
  photos: {
    getAircraftPhotos: getAircraftPhotos,
    uploadAircraftPhoto: uploadAircraftPhoto,
    uploadMultipleAircraftPhotos: uploadMultipleAircraftPhotos,
    getPhotoUrl: getPhotoUrl,
  },
  blog: {
    getPosts: getBlogPosts,
    getPost: getBlogPost,
    getAllForAdmin: getAllBlogPostsForAdmin,
    getByIdForAdmin: getBlogPostByIdForAdmin,
    create: createBlogPost,
    update: updateBlogPost,
    delete: deleteBlogPost,
    uploadImage: uploadBlogImage,
    getImageUrl: getBlogImageUrl,
  },
  users: {
    getById: getUserById,
    getProfile: getUserProfile,
    updateProfile: updateUserProfile,
    getCount: getUserCount,
  },
};

