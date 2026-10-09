import { supabase } from './supabase';
import type { AircraftPhoto, SearchFilters } from '@/types';
import type { Tables } from './schema';

type AircraftWithPhotos = Tables<'aircraft'> & { photos: AircraftPhoto[] };
type AircraftWithUser = AircraftWithPhotos & { user: Pick<Tables<'users'>, 'name' | 'company' | 'phone' | 'email'> };
type SearchResult = { aircraft: AircraftWithPhotos[]; total: number; page: number; limit: number };
type BlogPostWithAuthor = Tables<'blog_posts'> & { author: Pick<Tables<'users'>, 'name' | 'company'> };
type BlogPostsResult = { posts: Array<Tables<'blog_posts'> & { author: Pick<Tables<'users'>, 'name'> }>; total: number; page: number; limit: number };

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
    .maybeSingle();

  if (error) throw error;
  return data;
}

export const db = {
  aircraft: { getBySlug: getAircraftBySlug, search: searchAircraft },
  photos: { getPhotoUrl },
  blog: { getPosts: getBlogPosts, getPost: getBlogPost, getImageUrl: getBlogImageUrl },
};
