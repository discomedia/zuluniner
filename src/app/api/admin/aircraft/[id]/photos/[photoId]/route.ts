import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, createServerSupabaseClient } from '@/lib/auth-server';

// DELETE /api/admin/aircraft/[id]/photos/[photoId] - Delete a photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    await requireAdmin();
    const { id: aircraftId, photoId } = await params;

    const supabase = await createServerSupabaseClient();

    // First, get the photo details to delete from storage
    const { data: photo, error: fetchError } = await supabase
      .from('aircraft_photos')
      .select('storage_path')
      .eq('id', photoId)
      .eq('aircraft_id', aircraftId)
      .single();

    if (fetchError || !photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('aircraft-photos')
      .remove([photo.storage_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      // Continue with database deletion even if storage fails
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('aircraft_photos')
      .delete()
      .eq('id', photoId)
      .eq('aircraft_id', aircraftId);

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting aircraft photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}