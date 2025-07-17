// Core application types for ZuluNiner

export interface Aircraft {
  id: string;
  title: string;
  description: string | null;
  price: number;
  year: number;
  make: string;
  model: string;
  hours: number | null;
  engine_type: string | null;
  avionics: string | null;
  airport_code: string | null;
  city: string | null;
  country: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: string | null;
  slug: string;
  meta_description?: string | null;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface AircraftLocation {
  airport_code: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export type AircraftStatus = 'active' | 'sold' | 'pending' | 'draft' | 'deleted';

export interface AircraftPhoto {
  id: string;
  aircraft_id: string;
  storage_path: string;
  alt_text: string;
  caption?: string | null;
  display_order: number;
  is_primary: boolean | null;
  created_at: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  location?: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type UserRole = 'admin' | 'seller' | 'buyer';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  blurb: string;
  content: string; // Markdown content
  header_photo?: string;
  meta_description?: string;
  published: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// Search and filtering types
export interface SearchFilters {
  query?: string;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  make?: string;
  model?: string;
  location?: {
    center: {
      latitude: number;
      longitude: number;
    };
    radiusKm: number;
  };
  engineType?: string;
  status?: AircraftStatus[];
}

export interface SearchResult {
  aircraft: Aircraft[];
  total: number;
  page: number;
  limit: number;
}

// Component prop types
export interface AircraftCardProps {
  aircraft: Aircraft;
  primaryPhoto?: AircraftPhoto;
}

export interface PhotoGalleryProps {
  photos: AircraftPhoto[];
  aircraftTitle: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Content generation types
export interface ContentGenerationRequest {
  title: string;
  context?: string;
  type: 'aircraft_description' | 'blog_post' | 'meta_description';
}

export interface GeneratedContent {
  content: string;
  suggestions?: string[];
}
