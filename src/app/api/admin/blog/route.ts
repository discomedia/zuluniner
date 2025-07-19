import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, createServerSupabaseClient } from '@/lib/auth-server';
import { db } from '@/api/db';
import { uploadBlogImageCompressed } from '@/api/blog-image-upload';
import { disco } from '@discomedia/utils';

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin();

    const body = await request.json();
    const { title, slug, blurb, content, meta_description, published } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    // 1. Generate image description with LLM
    const imagePrompt = `Create a detailed description for a professional, engaging hero image for a blog post about: "${title}".
Requirements:
- Describe a modern, professional image suitable for blog content
- Include visual elements that relate to one aspect of the topic in an interesting way
- Never include text, letters, or logos in the image
- Describe the exact style - being graphic design, representative, and abstract to illustrate the topic, NEVER a detailed or technical photo or image
- Describe mood, colors, and composition (keeping it simple, stylish, vibrant, and eye-catching)
- Make it engaging and click-worthy for social media sharing
- Aspect must always be 16:9

Return a JSON object with this structure:
{
  "description": "Detailed image generation prompt",
  "altText": "SEO-optimized alt text",
  "filename": "keyword-rich-filename"
}`;

    const imageDescriptionResponse = await disco.llm.call(imagePrompt, {
      responseFormat: 'json',
      model: 'gpt-4.1-mini',
    });

    const imageData = imageDescriptionResponse.response;
    if (!imageData?.description) {
      throw new Error('Failed to generate image description');
    }

    // 2. Generate image with Disco
    const imageResponse = await disco.llm.images(imageData.description);
    const imageBufferB64 = imageResponse.data?.[0]?.b64_json;
    if (!imageBufferB64) {
      throw new Error('Failed to generate image: No image data received');
    }
    const imageBuffer = Buffer.from(imageBufferB64, 'base64');

    // 3. Upload compressed image to Supabase Storage
    const supabase = await createServerSupabaseClient();
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const keywordFilename = `${imageData.filename || slug || 'blog-image'}-${timestamp}.webp`;
    console.log('🖼️ Compressing and uploading blog image...');
    const uploaded = await uploadBlogImageCompressed(
      imageBuffer,
      keywordFilename,
      imageData.altText || title,
      supabase
    );
    console.log(`🌐 Blog image public URL: ${uploaded.public_url}`);

    // 4. Prepare blog post data with generated image
    const blogPostData = {
      title,
      slug,
      blurb: blurb || null,
      content: content || null,
      meta_description: meta_description || null,
      header_photo: uploaded.storage_path,
      published: published || false,
      published_at: published ? new Date().toISOString() : null,
      author_id: user.id,
    };

    console.log('📝 Creating blog post with generated image:', { title, slug, published, image: uploaded.storage_path });

    // 5. Create the blog post using authenticated client
    const newPost = await db.blog.create(blogPostData, supabase);

    console.log('✅ Blog post created successfully:', newPost.id);

    return NextResponse.json({
      message: 'Blog post created successfully',
      post: { ...newPost, image_public_url: uploaded.public_url }
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