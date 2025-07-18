import { requireAdmin } from '@/lib/auth-server';
import BlogPostForm from '@/components/admin/blog/BlogPostForm';

export const metadata = {
  title: 'New Blog Post | Admin - ZuluNiner',
  description: 'Create a new blog post',
};

export default async function NewBlogPostPage() {
  const { profile } = await requireAdmin();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Create New Blog Post</h1>
        <p className="mt-2 text-neutral-600">
          Create and publish a new blog post as {profile?.name || 'Admin'}
        </p>
      </div>

      {/* Form */}
      <BlogPostForm />
    </div>
  );
}