import { requireAdmin } from '@/lib/auth-server';
import { db } from '@/api/db';
import { notFound } from 'next/navigation';
import BlogPostForm from '@/components/admin/blog/BlogPostForm';

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditBlogPostPageProps) {
  const post = await db.blog.getByIdForAdmin(params.id);
  
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
  const user = await requireAdmin();
  
  console.log(`🔄 Fetching blog post for editing: ${params.id}`);
  
  const post = await db.blog.getByIdForAdmin(params.id);
  
  if (!post) {
    console.log(`❌ Blog post not found: ${params.id}`);
    notFound();
  }

  console.log(`✅ Blog post loaded for editing: ${post.title}`);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Edit Blog Post</h1>
        <p className="mt-2 text-neutral-600">
          Editing &ldquo;{post.title}&rdquo; as {user?.name || 'Admin'}
        </p>
      </div>

      {/* Form */}
      <BlogPostForm initialData={post} isEditing={true} />
    </div>
  );
}