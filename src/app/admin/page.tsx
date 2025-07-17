import { requireAdmin } from '@/lib/auth-server';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import PageHeader from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default async function AdminDashboard() {
  const { user, profile } = await requireAdmin();

  return (
    <ContainerLayout>
      <PageHeader
        title="Admin Dashboard"
        description={`Welcome, ${profile.name}. Manage the ZuluNiner platform.`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">User Management</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              View and manage user accounts
            </p>
            <Link href="/admin/users">
              <Button variant="primary" size="sm">
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Aircraft Listings</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Review and moderate aircraft listings
            </p>
            <Link href="/admin/aircraft">
              <Button variant="primary" size="sm">
                Manage Listings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Blog Management</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Create and manage blog posts
            </p>
            <Link href="/admin/blog">
              <Button variant="primary" size="sm">
                Manage Blog
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Platform Settings</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Configure platform settings
            </p>
            <Link href="/admin/settings">
              <Button variant="secondary" size="sm">
                Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Analytics</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              View platform analytics and reports
            </p>
            <Link href="/admin/analytics">
              <Button variant="secondary" size="sm">
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Content Generation</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Generate content with AI assistance
            </p>
            <Link href="/admin/content-generation">
              <Button variant="secondary" size="sm">
                Generate Content
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Quick Stats</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">0</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">0</div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">0</div>
                <div className="text-sm text-gray-600">Blog Posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">0</div>
                <div className="text-sm text-gray-600">Pending Reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContainerLayout>
  );
}