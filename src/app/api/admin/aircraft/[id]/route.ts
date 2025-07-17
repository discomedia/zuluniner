import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { updateAircraft } from '@/api/db';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authorization
    await requireAdmin();
    
    const { id } = await params;
    const body = await request.json();

    // Update the aircraft using authenticated client
    const { createServerSupabaseClient } = await import('@/lib/auth-server');
    const supabase = await createServerSupabaseClient();
    const updatedAircraft = await updateAircraft(id, body, supabase);

    return NextResponse.json({
      success: true,
      data: updatedAircraft,
      message: 'Aircraft updated successfully',
    });

  } catch (error) {
    console.error('Error updating aircraft:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update aircraft',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authorization
    await requireAdmin();
    
    const { id } = await params;

    // For now, we'll implement soft delete by setting status to 'deleted'
    const { createServerSupabaseClient } = await import('@/lib/auth-server');
    const supabase = await createServerSupabaseClient();
    const updatedAircraft = await updateAircraft(id, { status: 'deleted' }, supabase);

    return NextResponse.json({
      success: true,
      data: updatedAircraft,
      message: 'Aircraft deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting aircraft:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete aircraft',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}