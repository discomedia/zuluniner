import { requireAdmin } from '@/lib/auth-server';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import PageHeader from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { DashboardCardIcon } from '@/components/ui/DashboardCardIcon';
import { UserIcon, PaperAirplaneIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { db } from '@/api/db';

// Get dashboard statistics
async function getDashboardStats() {
  // Get user count using db convenience function
  const userCount = await db.users.getCount();

  // Get all aircraft to calculate stats by status
  const { aircraft: aircraftData } = await db.aircraft.getAllForAdmin();

  const aircraftStats = {
    total: aircraftData?.length || 0,
    active: aircraftData?.filter(a => a.status === 'active').length || 0,
    draft: aircraftData?.filter(a => a.status === 'draft').length || 0,
    pending: aircraftData?.filter(a => a.status === 'pending').length || 0,
  };

  // Get published blog post count
  const { posts: publishedPosts } = await db.blog.getPosts(true, 1, 1000);
  const blogCount = publishedPosts.length;

  return {
    userCount: userCount || 0,
    aircraftStats,
    blogCount,
  };
}

export default async function AdminDashboard() {
  const { profile } = await requireAdmin();
  const stats = await getDashboardStats();

  return (
    <ContainerLayout>

      <div className="w-full flex justify-start mb-2">
        <Link href="/" className="inline-flex items-center gap-1 text-primary-700 hover:underline font-medium text-sm px-2 py-1 rounded transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to main site
        </Link>
      </div>
      <div className="bg-white border-b border-neutral-200 rounded-xl shadow-sm px-6 py-6 mb-4">
        <PageHeader
          title="Admin Dashboard"
          description={`Welcome back, ${profile.name || 'Admin'}! Manage the ZuluNiner platform.`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* User Management */}
        <Card className="group hover:shadow-lg transition-all border border-neutral-200 bg-white">
          <CardHeader className="flex flex-col items-start">
            <DashboardCardIcon icon={<UserIcon className="w-6 h-6 text-primary-600" />} />
            <h3 className="text-base font-bold text-neutral-900 mb-1">User Management</h3>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-700 mb-4">View and manage user accounts</p>
            <Link href="/admin/users">
              <Button variant="primary" size="sm">Manage Users</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Aircraft Listings */}
        <Card className="group hover:shadow-lg transition-all border border-neutral-200 bg-white">
          <CardHeader className="flex flex-col items-start">
            <DashboardCardIcon icon={<PaperAirplaneIcon className="w-6 h-6 text-green-600" />} bg="bg-green-100" />
            <h3 className="text-base font-bold text-neutral-900 mb-1">Aircraft Listings</h3>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-700 mb-4">Review and moderate aircraft listings</p>
            <Link href="/admin/aircraft">
              <Button variant="primary" size="sm">Manage Listings</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Blog Management */}
        <Card className="group hover:shadow-lg transition-all border border-neutral-200 bg-white">
          <CardHeader className="flex flex-col items-start">
            <DashboardCardIcon icon={<BookOpenIcon className="w-6 h-6 text-blue-600" />} bg="bg-blue-100" />
            <h3 className="text-base font-bold text-neutral-900 mb-1">Blog Management</h3>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-700 mb-4">Create and manage blog posts</p>
            <Link href="/admin/blog">
              <Button variant="primary" size="sm">Manage Blog</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Removed Platform Settings, Analytics, and Content Generation cards */}
      </div>

      {/* Quick Stats integrated visually with cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card className="flex flex-col items-center py-6 bg-primary-50 border-0">
          <UserIcon className="w-7 h-7 mb-2 text-primary-600" />
          <div className="text-3xl font-extrabold text-primary-700">{stats.userCount}</div>
          <div className="text-base font-medium text-neutral-800 mt-1">Total Users</div>
        </Card>
        <Card className="flex flex-col items-center py-6 bg-green-50 border-0">
          <PaperAirplaneIcon className="w-7 h-7 mb-2 text-green-600" />
          <div className="text-3xl font-extrabold text-green-700">{stats.aircraftStats.active}</div>
          <div className="text-base font-medium text-neutral-800 mt-1">Active Listings</div>
        </Card>
        <Card className="flex flex-col items-center py-6 bg-blue-50 border-0">
          <BookOpenIcon className="w-7 h-7 mb-2 text-blue-600" />
          <div className="text-3xl font-extrabold text-blue-700">{stats.blogCount}</div>
          <div className="text-base font-medium text-neutral-800 mt-1">Blog Posts</div>
        </Card>
      </div>
    </ContainerLayout>
  );
}