import { requireAdmin, createServerSupabaseClient } from '@/lib/auth-server';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import PageHeader from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { db } from '@/api/db';
import AircraftListClient from '@/components/admin/AircraftListClient';

// Get all aircraft (including drafts) for admin view
async function getAllAircraft() {
  // Get all aircraft with all statuses for admin view using db convenience function
  const supabase = await createServerSupabaseClient();
  return await db.aircraft.getAllForAdmin(supabase);
}

export default async function AdminAircraftPage() {
  const { profile } = await requireAdmin();
  const { aircraft, total } = await getAllAircraft();

  const statusCounts = {
    active: aircraft.filter(a => a.status === 'active').length,
    draft: aircraft.filter(a => a.status === 'draft').length,
    pending: aircraft.filter(a => a.status === 'pending').length,
    sold: aircraft.filter(a => a.status === 'sold').length,
  };

  return (
    <ContainerLayout>

      {/* Back to Admin Dashboard */}
      <div className="w-full flex justify-start mb-2">
        <Link href="/admin" className="inline-flex items-center gap-1 text-primary-700 hover:underline font-medium text-sm px-2 py-1 rounded transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to admin dashboard
        </Link>
      </div>

      {/* Header with rounded corners and button below */}
      <div className="bg-white border-b border-neutral-200 rounded-xl shadow-sm px-6 py-6 mb-4">
        <PageHeader
          title="Aircraft Management"
          description={`Manage all aircraft listings on the platform • Logged in as ${profile.name}`}
        />
        <div className="mt-4 flex justify-end">
          <Link href="/admin/aircraft/new">
            <Button variant="primary">
              Create New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.active}</div>
            <div className="text-sm text-gray-600">Active Listings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.draft}</div>
            <div className="text-sm text-gray-600">Draft Listings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.pending}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{statusCounts.sold}</div>
            <div className="text-sm text-gray-600">Sold</div>
          </CardContent>
        </Card>
      </div>

      {/* Aircraft List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <h3 className="text-lg font-semibold">All Aircraft Listings ({total})</h3>
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search aircraft..."
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
              <Button variant="secondary" size="sm">
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AircraftListClient aircraft={aircraft} total={total} />
        </CardContent>
      </Card>
    </ContainerLayout>
  );
}