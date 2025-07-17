// Core application types for ZuluNiner

export interface Aircraft {
  id: string;
  title: string;
  description: string;
  price: number;
  year: number;
  make: string;
  model: string;
  hours: number;
  engine_type: string;
  avionics: string;
  location: AircraftLocation;
  status: AircraftStatus;
  slug: string;
  meta_description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
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
  caption?: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  location?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
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
