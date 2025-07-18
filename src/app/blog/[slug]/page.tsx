import { db } from '@/api/db';
import MainLayout from '@/components/layouts/MainLayout';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await db.blog.getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | ZuluNiner',
    };
  }

  return {
    title: `${post.title} | ZuluNiner Blog`,
    description: post.meta_description || post.blurb || `Read "${post.title}" on the ZuluNiner aviation blog.`,
    openGraph: {
      title: post.title,
      description: post.meta_description || post.blurb,
      images: post.header_photo ? [post.header_photo] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  console.log(`🔄 Fetching blog post with slug: ${params.slug}`);
  
  const post = await db.blog.getPost(params.slug);
  
  if (!post) {
    console.log(`❌ Blog post not found: ${params.slug}`);
    notFound();
  }

  console.log(`✅ Blog post loaded: ${post.title}`);

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Header with image */}
        {post.header_photo && (
          <div className="relative h-96 w-full overflow-hidden">
            <Image
              src={post.header_photo}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-end">
              <div className="mx-auto max-w-4xl px-4 pb-8 sm:px-6 lg:px-8 w-full">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {post.title}
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Header when no image */}
          {!post.header_photo && (
            <header className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>
            </header>
          )}

          {/* Meta information */}
          <div className="mb-8 flex items-center space-x-4 text-neutral-600">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">By {post.author?.name || 'ZuluNiner'}</span>
            </div>
            <span className="text-neutral-400">•</span>
            <time dateTime={post.published_at || post.created_at} className="text-sm">
              {formatDate(post.published_at || post.created_at)}
            </time>
          </div>

          {/* Blurb/excerpt */}
          {post.blurb && (
            <div className="mb-8 text-xl leading-relaxed text-neutral-700 border-l-4 border-primary-500 pl-6 italic">
              {post.blurb}
            </div>
          )}

          {/* Main content */}
          {post.content && (
            <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-semibold prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-900 prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral-900 prose-pre:text-neutral-100">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Author info */}
          {post.author && (
            <div className="mt-16 border-t border-neutral-200 pt-8">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{post.author.name}</h3>
                  {post.author.company && (
                    <p className="text-neutral-600">{post.author.company}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-16 border-t border-neutral-200 pt-8">
            <Link 
              href="/blog"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Blog
            </Link>
          </div>
        </article>
      </div>
    </MainLayout>
  );
}