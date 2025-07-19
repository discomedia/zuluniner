import { requireAdmin } from '@/lib/auth-server';
import { db } from '@/api/db';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import type { Tables } from '@/api/schema';

type BlogPostsResult = {
  posts: Array<Tables<'blog_posts'> & { author: Pick<Tables<'users'>, 'name'> }>;
  total: number;
  page: number;
  limit: number;
};

export const metadata = {
  title: 'Blog Management | Admin - ZuluNiner',
  description: 'Manage blog posts and content',
};

export default async function AdminBlogPage() {
  const { profile } = await requireAdmin();
  
  console.log('🔄 Fetching blog posts for admin...');
  
  let blogData: BlogPostsResult = { posts: [], total: 0, page: 1, limit: 20 };
  
  try {
    blogData = await db.blog.getAllForAdmin(1, 20);
    console.log('✅ Admin blog posts loaded:', blogData.posts.length);
  } catch (error) {
    console.error('❌ Error fetching admin blog posts:', error);
  }

  return (
    <div className="px-2 md:px-6 space-y-8">
      {/* Header */}
      {/* Back to Admin Dashboard */}
      <div className="w-full flex justify-start mb-2 mt-2">
        <Link href="/admin" className="inline-flex items-center gap-1 text-primary-700 hover:underline font-medium text-sm px-2 py-1 rounded transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to admin dashboard
        </Link>
      </div>
      <div className="bg-white border-b border-neutral-200 rounded-xl shadow-sm px-6 py-6 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Blog Management</h1>
            <p className="mt-2 text-gray-800">
              Manage your blog posts and content as {profile?.name || 'Admin'}
            </p>
          </div>
          <Link href="/admin/blog/new">
            <Button>Create New Post</Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
        <Card>
          <CardHeader>
            <h3 className="text-base font-semibold text-gray-900">Total Posts</h3>
            <p className="text-3xl font-extrabold text-gray-900">{blogData.total}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-base font-semibold text-gray-900">Published</h3>
            <p className="text-3xl font-extrabold text-green-600">
              {blogData.posts.filter(post => post.published).length}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-base font-semibold text-gray-900">Drafts</h3>
            <p className="text-3xl font-extrabold text-yellow-600">
              {blogData.posts.filter(post => !post.published).length}
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">All Blog Posts</h2>
        </CardHeader>
        <CardContent>
          {blogData.posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 text-lg">No blog posts yet.</p>
              <Link href="/admin/blog/new" className="mt-4 inline-block">
                <Button>Create Your First Post</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-base font-bold text-gray-900">Title</th>
                    <th className="px-6 py-3 text-left text-base font-bold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-base font-bold text-gray-900">Author</th>
                    <th className="px-6 py-3 text-left text-base font-bold text-gray-900">Created</th>
                    <th className="px-6 py-3 text-left text-base font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogData.posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-base font-semibold text-gray-900 line-clamp-1">
                            {post.title}
                          </div>
                          {post.blurb && (
                            <div className="text-sm text-neutral-500 line-clamp-1 mt-1">
                              {post.blurb}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          post.published
                            ? 'bg-success-100 text-success-800'
                            : 'bg-warning-100 text-warning-800'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {post.author?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {post.published && (
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </Link>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination placeholder */}
      {blogData.total > 20 && (
        <div className="flex justify-center">
          <p className="text-neutral-500">
            Showing {blogData.posts.length} of {blogData.total} posts
          </p>
        </div>
      )}
    </div>
  );
}