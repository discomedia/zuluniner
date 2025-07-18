import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { db } from '@/api/db';

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin();

    const body = await request.json();
    
    const { title, slug, blurb, content, meta_description, header_photo, published } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const blogPostData = {
      title,
      slug,
      blurb: blurb || null,
      content: content || null,
      meta_description: meta_description || null,
      header_photo: header_photo || null,
      published: published || false,
      published_at: published ? new Date().toISOString() : null,
      author_id: user.id,
    };

    console.log('📝 Creating blog post:', { title, slug, published });

    const newPost = await db.blog.create(blogPostData);

    console.log('✅ Blog post created successfully:', newPost.id);

    return NextResponse.json({ 
      message: 'Blog post created successfully', 
      post: newPost 
    });

  } catch (error) {
    console.error('❌ Error creating blog post:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({ 
        error: 'A blog post with this slug already exists' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create blog post' 
    }, { status: 500 });
  }
}