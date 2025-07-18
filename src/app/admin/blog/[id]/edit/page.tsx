import { requireAdmin } from '@/lib/auth-server';
import { db } from '@/api/db';
import { notFound } from 'next/navigation';
import BlogPostForm from '@/components/admin/blog/BlogPostForm';

interface EditBlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  const post = await db.blog.getByIdForAdmin(id);
  
  if (!post) {
    return {
      title: 'Post Not Found | Admin - ZuluNiner',
    };
  }

  return {
    title: `Edit: ${post.title} | Admin - ZuluNiner`,
    description: `Edit blog post: ${post.title}`,
  };
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { profile } = await requireAdmin();
  const { id } = await params;
  
  console.log(`🔄 Fetching blog post for editing: ${id}`);
  
  const post = await db.blog.getByIdForAdmin(id);
  
  if (!post) {
    console.log(`❌ Blog post not found: ${id}`);
    notFound();
  }

  console.log(`✅ Blog post loaded for editing: ${post.title}`);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Edit Blog Post</h1>
        <p className="mt-2 text-neutral-600">
          Editing &ldquo;{post.title}&rdquo; as {profile?.name || 'Admin'}
        </p>
      </div>

      {/* Form */}
      <BlogPostForm initialData={post} isEditing={true} />
    </div>
  );
}