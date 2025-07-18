import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { db } from '@/api/db';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { user: _user } = await requireAdmin();

    const body = await request.json();
    const { id } = params;
    
    const { title, slug, blurb, content, meta_description, header_photo, published } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const existingPost = await db.blog.getByIdForAdmin(id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const updateData = {
      title,
      slug,
      blurb: blurb || null,
      content: content || null,
      meta_description: meta_description || null,
      header_photo: header_photo || null,
      published: published || false,
      published_at: published && !existingPost.published ? new Date().toISOString() : existingPost.published_at,
    };

    console.log(`📝 Updating blog post ${id}:`, { title, slug, published });

    const updatedPost = await db.blog.update(id, updateData);

    console.log('✅ Blog post updated successfully:', updatedPost.id);

    return NextResponse.json({ 
      message: 'Blog post updated successfully', 
      post: updatedPost 
    });

  } catch (error) {
    console.error('❌ Error updating blog post:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({ 
        error: 'A blog post with this slug already exists' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to update blog post' 
    }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const { user: _user } = await requireAdmin();

    const { id } = params;

    const existingPost = await db.blog.getByIdForAdmin(id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    console.log(`🗑️ Deleting blog post ${id}: ${existingPost.title}`);

    await db.blog.delete(id);

    console.log('✅ Blog post deleted successfully');

    return NextResponse.json({ 
      message: 'Blog post deleted successfully' 
    });

  } catch (error) {
    console.error('❌ Error deleting blog post:', error);
    
    return NextResponse.json({ 
      error: 'Failed to delete blog post' 
    }, { status: 500 });
  }
}