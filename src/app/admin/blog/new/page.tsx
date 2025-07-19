import { requireAdmin } from '@/lib/auth-server';
import BlogPostForm from '@/components/admin/blog/BlogPostForm';

export const metadata = {
  title: 'New Blog Post | Admin - ZuluNiner',
  description: 'Create a new blog post',
};

export default async function NewBlogPostPage() {
  const { profile } = await requireAdmin();

  return (
    <div className="px-2 md:px-6 space-y-8">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 rounded-xl shadow-sm px-6 py-6 mb-4">
        <h1 className="text-3xl font-bold text-neutral-900">Create New Blog Post</h1>
        <p className="mt-2 text-neutral-600">
          Create and publish a new blog post as {profile?.name || 'Admin'}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-6">
        <BlogPostForm />
      </div>
    </div>
  );
}