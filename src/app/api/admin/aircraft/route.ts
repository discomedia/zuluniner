import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, requireAdmin } from '@/lib/auth-server';
import { createAircraft, uploadAircraftPhoto } from '@/api/db';
import type { Database } from '@/api/schema';

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const { user } = await requireAdmin();

    const body = await request.json();
    const { aircraft: aircraftData, photos } = body;

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
      description: aircraftData.description,
      price: aircraftData.price,
      year: aircraftData.year,
      make: aircraftData.make,
      model: aircraftData.model,
      hours: aircraftData.hours,
      engine_type: aircraftData.engine_type,
      avionics: aircraftData.avionics,
      airport_code: aircraftData.airport_code,
      city: aircraftData.city,
      country: aircraftData.country,
      latitude: aircraftData.latitude,
      longitude: aircraftData.longitude,
      meta_description: aircraftData.meta_description,
      status: aircraftData.status,
      slug,
      user_id: user.id,
    };

    // Create the aircraft using authenticated client
    const supabase = await createServerSupabaseClient();
    const newAircraft = await createAircraft(aircraftToCreate, supabase);

    // Handle photo uploads if provided
    // Note: For now, we'll just return success. In a real implementation,
    // you'd handle the actual file uploads here using FormData
    
    return NextResponse.json({
      success: true,
      data: newAircraft,
      message: 'Aircraft created successfully',
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

export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    await requireAdmin();

    const supabase = await createServerSupabaseClient();
    
    // Get all aircraft for admin view (including drafts)
    const { data: aircraft, error, count } = await supabase
      .from('aircraft')
      .select(`
        *,
        photos:aircraft_photos(*),
        user:users(name, email, company)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        aircraft: aircraft || [],
        total: count || 0,
      },
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