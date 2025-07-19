import { db } from '@/api/db';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import type { Tables } from '@/api/schema';

type BlogPostsResult = {
  posts: Array<Tables<'blog_posts'> & { author: Pick<Tables<'users'>, 'name'> }>;
  total: number;
  page: number;
  limit: number;
};

export const metadata = {
  title: 'ZuluNiner Blog | Aircraft, Aviation, and Industry Insights',
  description: 'Expert insights, aircraft reviews, and aviation industry news from the ZuluNiner community.',
};

export default async function BlogPage() {
  console.log('🔄 Starting to fetch blog posts...');
  
  let blogData: BlogPostsResult = { posts: [], total: 0, page: 1, limit: 10 };
  
  try {
    blogData = await db.blog.getPosts(true, 1, 12);
    console.log('✅ Blog posts loaded:', blogData.posts.length);
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                ZuluNiner Blog
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-primary-100">
                You like planes? We like planes too.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {blogData.posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-neutral-600">No blog posts available yet.</p>
                <p className="text-neutral-500 mt-2">Check back soon for expert aviation insights!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {blogData.posts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                        {post.header_photo && (
                          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                            <Image
                              src={post.header_photo}
                              alt={post.title}
                              width={400}
                              height={225}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <h2 className="text-xl font-semibold text-neutral-900 line-clamp-2">
                            {post.title}
                          </h2>
                          {post.blurb && (
                            <p className="text-neutral-600 line-clamp-3 mt-2">
                              {post.blurb}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-neutral-500">
                            <div className="flex items-center space-x-2">
                              <span>By {post.author?.name || 'ZuluNiner'}</span>
                            </div>
                            <time dateTime={post.published_at || post.created_at || undefined}>
                              {formatDate(post.published_at || post.created_at)}
                            </time>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination - Simple version for now */}
                {blogData.total > 12 && (
                  <div className="mt-12 flex justify-center">
                    <p className="text-neutral-500">
                      Showing {blogData.posts.length} of {blogData.total} posts
                    </p>
                    {/* TODO: Add proper pagination controls */}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}