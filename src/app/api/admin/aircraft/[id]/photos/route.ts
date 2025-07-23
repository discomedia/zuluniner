import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, createServerSupabaseClient } from '@/lib/auth-server';
import { db } from '@/api/db';

// GET /api/admin/aircraft/[id]/photos - Get aircraft photos
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const photos = await db.photos.getAircraftPhotos(id);

    return NextResponse.json({
      success: true,
      photos,
    });
  } catch (error) {
    console.error('Error fetching aircraft photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

// POST /api/admin/aircraft/[id]/photos - Upload new photos
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No photos provided' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    
    // Convert File array to the format expected by the function
    const photoObjects = files.map(file => ({ file }));
    
    const uploadedPhotos = await db.photos.uploadMultipleAircraftPhotos(
      id,
      photoObjects,
      supabase
    );

    return NextResponse.json({
      success: true,
      photos: uploadedPhotos,
    });
  } catch (error) {
    console.error('Error uploading aircraft photos:', error);
    return NextResponse.json(
      { error: 'Failed to upload photos' },
      { status: 500 }
    );
  }
}