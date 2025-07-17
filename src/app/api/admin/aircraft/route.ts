import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, requireAdmin } from '@/lib/auth-server';
import { db } from '@/api/db';

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const { user } = await requireAdmin();

    // Handle both JSON and FormData
    const contentType = request.headers.get('content-type') || '';
    let aircraftData: {
      title: string;
      year: number;
      make: string;
      model: string;
      description?: string;
      price?: number;
      hours?: number;
      engine_type?: string;
      avionics?: string;
      airport_code?: string;
      city?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
      meta_description?: string;
      status?: string;
    };
    let photoFiles: File[] = [];

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with file uploads)
      const formData = await request.formData();
      
      // Parse aircraft data from form
      const aircraftJson = formData.get('aircraft') as string;
      aircraftData = JSON.parse(aircraftJson);
      
      // Extract photo files
      const files = formData.getAll('photos') as File[];
      photoFiles = files.filter(file => file.size > 0);
    } else {
      // Handle JSON (without files)
      const body = await request.json();
      aircraftData = body.aircraft || body;
    }

    // Generate slug from aircraft data
    const generateSlug = (title: string, year: number, make: string, model: string) => {
      return `${year}-${make}-${model}-${title}`
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    const slug = generateSlug(
      aircraftData.title,
      aircraftData.year,
      aircraftData.make,
      aircraftData.model
    );

    // Prepare aircraft data for database (matching flat schema)
    const aircraftToCreate = {
      title: aircraftData.title,
      description: aircraftData.description || '',
      price: aircraftData.price || 0,
      year: aircraftData.year,
      make: aircraftData.make,
      model: aircraftData.model,
      hours: aircraftData.hours || 0,
      engine_type: aircraftData.engine_type || '',
      avionics: aircraftData.avionics || '',
      airport_code: aircraftData.airport_code || '',
      city: aircraftData.city || '',
      country: aircraftData.country || '',
      latitude: aircraftData.latitude || null,
      longitude: aircraftData.longitude || null,
      meta_description: aircraftData.meta_description || '',
      status: aircraftData.status || 'draft',
      slug,
      user_id: user.id,
    };

    // Create the aircraft using authenticated client
    const supabase = await createServerSupabaseClient();
    const newAircraft = await db.aircraft.create(aircraftToCreate, supabase);

    // Handle photo uploads if provided
    let uploadedPhotos: unknown[] = [];
    if (photoFiles.length > 0) {
      try {
        const photos = photoFiles.map(file => ({
          file,
          altText: `${aircraftData.year} ${aircraftData.make} ${aircraftData.model}`,
          caption: ''
        }));
        
        uploadedPhotos = await db.photos.uploadMultipleAircraftPhotos(
          newAircraft.id,
          photos,
          supabase
        );
      } catch (photoError) {
        console.error('Photo upload failed:', photoError);
        // Don't fail the entire request if photos fail
        // Aircraft is already created, just log the error
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        ...newAircraft,
        photos: uploadedPhotos
      },
      message: `Aircraft created successfully${uploadedPhotos.length > 0 ? ` with ${uploadedPhotos.length} photos` : ''}`,
    });

  } catch (error) {
    console.error('Error creating aircraft:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create aircraft',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check admin authorization
    await requireAdmin();

    const supabase = await createServerSupabaseClient();
    
    // Get all aircraft for admin view using db convenience function
    const result = await db.aircraft.getAllForAdmin(supabase);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Error fetching aircraft:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch aircraft',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}