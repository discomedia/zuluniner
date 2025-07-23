import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, createServerSupabaseClient } from '@/lib/auth-server';

// PUT /api/admin/aircraft/[id]/photos/reorder - Reorder photos
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: aircraftId } = await params;

    const { photoOrders } = await request.json();

    if (!Array.isArray(photoOrders)) {
      return NextResponse.json(
        { error: 'Invalid photo orders data' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Update each photo's display order
    for (const order of photoOrders) {
      const { error } = await supabase
        .from('aircraft_photos')
        .update({ display_order: order.display_order })
        .eq('id', order.id)
        .eq('aircraft_id', aircraftId);

      if (error) {
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Photos reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering aircraft photos:', error);
    return NextResponse.json(
      { error: 'Failed to reorder photos' },
      { status: 500 }
    );
  }
}