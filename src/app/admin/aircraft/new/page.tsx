'use client';

import { useState } from 'react';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import PageHeader from '@/components/layouts/PageHeader';
import AircraftWizard from '@/components/admin/aircraft/AircraftWizard';

export default function NewAircraftPage() {
  return (
    <ContainerLayout>
      <PageHeader
        title="Create New Aircraft Listing"
        description="Add a new aircraft to the marketplace"
      />
      
      <AircraftWizard />
    </ContainerLayout>
  );
}