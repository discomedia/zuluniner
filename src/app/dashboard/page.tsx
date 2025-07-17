import { requireAuth } from '@/lib/auth-server';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import PageHeader from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <ContainerLayout>
      <PageHeader
        title="Dashboard"
        description="Manage your aircraft listings and account"
      />
      
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