import { requireAuth } from '@/lib/auth-server';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import PageHeader from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { db } from '@/api/db';

// Get user dashboard data
async function getUserDashboardData(userId: string) {
  // Get user's aircraft using db convenience function
  const aircraft = await db.aircraft.getUserAircraft(userId);
    
  const stats = {
    totalListings: aircraft.length,
    activeListings: aircraft?.filter(a => a.status === 'active').length || 0,
    draftListings: aircraft?.filter(a => a.status === 'draft').length || 0,
    soldListings: aircraft?.filter(a => a.status === 'sold').length || 0,
  };
  
  return { aircraft: aircraft || [], stats };
}

export default async function DashboardPage() {
  const user = await requireAuth();
  const { aircraft: _aircraft, stats } = await getUserDashboardData(user.id);
  
  // Get user profile using db convenience function
  const profile = await db.users.getProfile(user.id);

  return (
    <ContainerLayout>
      <PageHeader
        title={`Welcome back, ${profile?.name || 'User'}`}
        description="Manage your aircraft listings and account"
      />
      
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.totalListings}</div>
            <div className="text-sm text-gray-600">Total Listings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeListings}</div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.draftListings}</div>
            <div className="text-sm text-gray-600">Drafts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.soldListings}</div>
            <div className="text-sm text-gray-600">Sold</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">My Aircraft</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              View and manage your aircraft listings
            </p>
            <Link href="/aircraft/manage">
              <Button variant="primary" size="sm">
                View Listings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Create Listing</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              List your aircraft for sale
            </p>
            <Link href="/aircraft/create">
              <Button variant="primary" size="sm">
                Create Listing
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Profile</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Update your profile information
            </p>
            <Link href="/profile">
              <Button variant="secondary" size="sm">
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </ContainerLayout>
  );
}