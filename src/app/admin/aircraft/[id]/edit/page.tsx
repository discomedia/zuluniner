import { requireAdmin } from '@/lib/auth-server';
import { getAircraft } from '@/api/db';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import PageHeader from '@/components/layouts/PageHeader';
import AircraftEditForm from '@/components/admin/aircraft/AircraftEditForm';
import { notFound } from 'next/navigation';

interface EditAircraftPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAircraftPage({ params }: EditAircraftPageProps) {
  const { user, profile } = await requireAdmin();
  const { id } = await params;

  try {
    const aircraft = await getAircraft(id);
    
    if (!aircraft) {
      notFound();
    }

    return (
      <ContainerLayout>
        <PageHeader
          title={`Edit: ${aircraft.title}`}
          description={`${aircraft.year} ${aircraft.make} ${aircraft.model}`}
        />
        
        <AircraftEditForm aircraft={aircraft} />
      </ContainerLayout>
    );
  } catch (error) {
    console.error('Error loading aircraft:', error);
    notFound();
  }
}