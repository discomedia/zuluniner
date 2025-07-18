import { requireAdmin } from '@/lib/auth-server';
import { db } from '@/api/db';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import PageHeader from '@/components/layouts/PageHeader';
import AircraftEditForm from '@/components/admin/aircraft/AircraftEditForm';
import { notFound } from 'next/navigation';
import type { Aircraft } from '@/types';

interface EditAircraftPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAircraftPage({ params }: EditAircraftPageProps) {
  const { profile } = await requireAdmin();
  const { id } = await params;

  try {
    const aircraftData = await db.aircraft.getById(id);
    
    if (!aircraftData) {
      notFound();
    }

    // Convert to Aircraft type expected by the form
    const aircraft: Aircraft = {
      id: aircraftData.id,
      title: aircraftData.title,
      description: aircraftData.description || '',
      price: aircraftData.price || 0,
      year: aircraftData.year || 0,
      make: aircraftData.make || '',
      model: aircraftData.model || '',
      hours: aircraftData.hours || 0,
      engine_type: aircraftData.engine_type || '',
      avionics: aircraftData.avionics || '',
      airport_code: aircraftData.airport_code || '',
      city: aircraftData.city || '',
      country: aircraftData.country || '',
      latitude: aircraftData.latitude || undefined,
      longitude: aircraftData.longitude || undefined,
      status: aircraftData.status as Aircraft['status'],
      slug: aircraftData.slug,
      meta_description: aircraftData.meta_description || undefined,
      user_id: aircraftData.user_id,
      created_at: aircraftData.created_at || '',
      updated_at: aircraftData.updated_at || '',
    };

    return (
      <ContainerLayout>
        <PageHeader
          title={`Edit: ${aircraft.title}`}
          description={`${aircraft.year} ${aircraft.make} ${aircraft.model} • Admin: ${profile.name}`}
        />
        
        <AircraftEditForm aircraft={aircraft} />
      </ContainerLayout>
    );
  } catch (error) {
    console.error('Error loading aircraft:', error);
    notFound();
  }
}