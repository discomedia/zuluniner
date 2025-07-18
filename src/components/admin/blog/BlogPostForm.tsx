'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import type { Tables } from '@/api/schema';

interface BlogPostFormProps {
  initialData?: Partial<Tables<'blog_posts'>>;
  isEditing?: boolean;
}

export default function BlogPostForm({ initialData, isEditing = false }: BlogPostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    blurb: initialData?.blurb || '',
    content: initialData?.content || '',
    meta_description: initialData?.meta_description || '',
    header_photo: initialData?.header_photo || '',
    published: initialData?.published || false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        published: asDraft ? false : formData.published,
      };

      const endpoint = isEditing 
        ? `/api/admin/blog/${initialData?.id}` 
        : '/api/admin/blog';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save blog post');
      }

      const result = await response.json();
      console.log('✅ Blog post saved:', result);

      router.push('/admin/blog');
    } catch (err) {
      console.error('❌ Error saving blog post:', err);
      setError(err instanceof Error ? err.message : 'Failed to save blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoPopulate = async () => {
    if (!formData.title.trim()) {
      setError('Please enter a blog topic/title first');
      return;
    }

    // Basic validation for topic length
    const wordCount = formData.title.trim().split(/\s+/).length;
    if (wordCount < 2) {
      setError('Please provide a more specific topic (at least 2 words)');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      setGenerationProgress('Researching aviation topic...');
      
      const response = await fetch('/api/admin/blog/auto-populate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: formData.title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate blog content');
      }

      setGenerationProgress('Generating content...');
      
      const result = await response.json();
      console.log('✅ Blog content generated:', result);

      // Auto-populate the form with generated data
      setFormData(prev => ({
        ...prev,
        title: result.data.title || prev.title,
        slug: result.data.slug || prev.slug,
        blurb: result.data.blurb || prev.blurb,
        content: result.data.content || prev.content,
        meta_description: result.data.meta_description || prev.meta_description,
        header_photo: result.data.header_photo || prev.header_photo,
      }));

      setGenerationProgress('');
      console.log(`💰 Generation cost: $${result.cost?.toFixed(4) || '0.0000'}`);
      
    } catch (err) {
      console.error('❌ Error generating blog content:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate blog content');
      setGenerationProgress('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Generation Progress Modal */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <div className="text-2xl text-white animate-pulse">✨</div>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Generating Blog Content
              </h3>
              <p className="text-neutral-600 mb-4">
                {generationProgress || 'Preparing to research...'}
              </p>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-1000 animate-pulse" 
                     style={{ width: generationProgress.includes('content') ? '80%' : '40%' }}>
                </div>
              </div>
              <p className="text-sm text-neutral-500 mt-4">
                This may take 30-60 seconds. Please don&apos;t close this window.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">Basic Information</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-neutral-900">
                Title / Topic *
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAutoPopulate}
                disabled={isGenerating || isSubmitting || !formData.title.trim()}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700"
              >
                {isGenerating ? '✨ Generating...' : '✨ Generate Content'}
              </Button>
            </div>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter blog topic (e.g., 'Aircraft Annual Inspections' or 'Best Avionics Upgrades 2024')"
              required
            />
            <p className="text-sm text-neutral-600 mt-1">
              Enter a topic and click Generate Content to auto-populate this blog post with AI-researched content
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              URL Slug *
            </label>
            <Input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
              placeholder="url-friendly-slug"
              required
            />
            <p className="text-sm text-neutral-600 mt-1">
              This will be the URL: /blog/{formData.slug}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Brief Description
            </label>
            <Textarea
              value={formData.blurb}
              onChange={(e) => setFormData(prev => ({ ...prev, blurb: e.target.value }))}
              placeholder="A short description that appears on the blog listing"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Header Image URL
            </label>
            <Input
              type="url"
              value={formData.header_photo}
              onChange={(e) => setFormData(prev => ({ ...prev, header_photo: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">Content</h2>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Content (Markdown)
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your blog post content in Markdown format..."
              rows={20}
              className="font-mono text-sm"
            />
            <p className="text-sm text-neutral-600 mt-2">
              You can use Markdown formatting. 
              <a 
                href="https://www.markdownguide.org/basic-syntax/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 ml-1"
              >
                View Markdown guide
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">SEO & Meta Data</h2>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Meta Description
            </label>
            <Textarea
              value={formData.meta_description}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
              placeholder="Brief description for search engines (recommended: 150-160 characters)"
              rows={3}
              maxLength={160}
            />
            <p className="text-sm text-neutral-600 mt-1">
              {formData.meta_description.length}/160 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Publishing */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">Publishing</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            />
            <label htmlFor="published" className="text-sm font-medium text-neutral-900">
              Publish immediately
            </label>
          </div>
          <p className="text-sm text-neutral-600 mt-2">
            Uncheck to save as draft. You can publish later from the blog management page.
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/blog')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : (isEditing ? 'Update Post' : 'Publish Post')}
          </Button>
        </div>
      </div>
    </form>
  );
}