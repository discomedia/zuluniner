import { NextRequest, NextResponse } from 'next/server';
import { disco } from '@discomedia/utils';
import { config } from '@/config/config';

// Increase serverless function timeout for LLM calls
export const maxDuration = 60; // 60 seconds

// Type definitions for LLM responses
interface BlogData {
  title: string;
  slug: string;
  blurb: string;
  content: string;
  meta_description: string;
  header_photo: string | null;
  topics: string[];
  keywords: string[];
}

// LLM call functions
async function searchBlogInformation(topic: string): Promise<{ response: string; cost: number }> {
  console.log('🌐 Starting comprehensive blog research...');
  
  try {
    const response = await disco.llm.call(
      `Research and gather comprehensive information about "${topic}" for an aviation blog post. This is for ZuluNiner, an aircraft marketplace and aviation community platform.

      RESEARCH AREAS:
      - Current trends and developments in this aviation topic
      - Technical details and specifications relevant to aircraft buyers/sellers
      - Market insights and industry perspectives
      - Safety considerations and regulatory updates
      - Expert opinions and best practices
      - Real-world examples and case studies
      - Historical context and evolution
      - Future outlook and predictions
      
      AUDIENCE: Aircraft owners, buyers, sellers, pilots, and aviation enthusiasts
      
      FOCUS: Provide practical, actionable information that helps with aircraft ownership, maintenance, buying/selling decisions, and piloting knowledge
      
      RESEARCH DEPTH: Look for recent articles, industry reports, FAA updates, manufacturer announcements, and expert insights from the past 12 months`,
      {
        model: config.llm.model,
        responseFormat: config.llm.responseFormat.text,
        useWebSearch: true,
      }
    );
    
    console.log('✅ Comprehensive blog research completed');
    return {
      response: response.response as string,
      cost: response.usage.cost
    };
  } catch (error) {
    console.error('❌ Blog research LLM call failed:', error);
    throw new Error(`Research failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function convertToStructuredBlogData(researchResults: string, originalTopic: string): Promise<{ response: BlogData; cost: number }> {
  console.log('🔄 Converting research to structured blog post...');
  
  try {
    const response = await disco.llm.call(
      `Create a comprehensive aviation blog post based on this research: ${researchResults}

      Original topic: "${originalTopic}"
      
      Create a professional, engaging blog post for ZuluNiner's aviation community. Use this exact JSON structure:
      
      {
        "title": "string (compelling, SEO-friendly title that includes key aviation terms)",
        "slug": "string (URL-friendly slug, lowercase, hyphen-separated, under 100 chars)",
        "blurb": "string (engaging 2-3 sentence summary that hooks readers, 150-200 chars)",
        "content": "string (full blog post content in Markdown format, 1500-2500 words)",
        "meta_description": "string (SEO meta description under 160 characters)",
        "header_photo": "string or null (suggest a relevant aviation image URL if available, or null)",
        "topics": "string[] (3-5 relevant aviation topic tags)",
        "keywords": "string[] (5-8 SEO keywords related to aviation and the topic)"
      }

      CONTENT GUIDELINES:
      - Write in an authoritative but accessible and funny (but not cliché) tone
      - Write in the first person and plural (we/us)
      - Use sophisticated humor, including bait-and-switch, irony, deadpan, satire, absurdism, and self-deprecation. No clichés, overused jokes, or dad jokes.
      - Include specific technical details, model numbers, regulations where relevant
      - Add practical tips and actionable advice
      - Use proper aviation terminology
      - Structure with clear headings (## in Markdown), including using quote blocks, and emphasis.
      - Include bullet points and numbered lists for readability
      - Absolutely no em-dashes, only hyphens
      - Reference current market conditions or trends
      - Add safety considerations where appropriate
      - Conclude with actionable next steps for readers
      
      MARKDOWN FORMATTING:
      - Use ## for main headings
      - Use ### for subheadings
      - Use **bold** for emphasis
      - Use bullet points and numbered lists
      - Include relevant links where appropriate
      - Format technical specifications in tables if needed
      
      Make sure the content is valuable to aircraft owners, buyers, pilots, and just anyone who likes planes.`,
      {
        model: config.llm.model,
        responseFormat: config.llm.responseFormat.json,
      }
    );
    
    console.log('✅ Blog post structure completed');
    return {
      response: response.response as BlogData,
      cost: response.usage.cost
    };
  } catch (error) {
    console.error('❌ Blog conversion LLM call failed:', error);
    throw new Error(`Blog conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 Blog auto-populate API called');
  
  try {
    const { topic } = await request.json();
    console.log('📝 Received topic:', topic);

    if (!topic || typeof topic !== 'string') {
      console.log('❌ Invalid topic provided');
      return NextResponse.json(
        { error: 'Blog topic is required' },
        { status: 400 }
      );
    }

    // Basic validation for blog topic
    const wordCount = topic.trim().split(/\s+/).length;
    console.log('🔍 Validation - wordCount:', wordCount);
    
    if (wordCount < 2) {
      console.log('❌ Insufficient words in topic');
      return NextResponse.json(
        { error: 'Please provide a more specific topic (at least 2 words)' },
        { status: 400 }
      );
    }
    
    if (topic.length > 200) {
      console.log('❌ Topic too long');
      return NextResponse.json(
        { error: 'Topic is too long. Please keep it under 200 characters.' },
        { status: 400 }
      );
    }

    // Step 1: Research comprehensive information about the topic
    const researchResults = await searchBlogInformation(topic);

    // Step 2: Convert research to structured blog post
    const structuredData = await convertToStructuredBlogData(researchResults.response, topic);

    // Validate the final response structure
    if (!structuredData.response || typeof structuredData.response !== 'object') {
      console.log('❌ Invalid LLM response structure');
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      );
    }

    // Ensure slug is properly formatted
    if (structuredData.response.slug) {
      structuredData.response.slug = structuredData.response.slug
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 100);
    }

    console.log('📊 Blog post data prepared');

    // Calculate total cost
    const totalCost = researchResults.cost + structuredData.cost;
    console.log('💰 Total cost:', totalCost);

    console.log('🎉 Blog auto-populate completed successfully');
    return NextResponse.json({
      success: true,
      data: structuredData.response,
      cost: totalCost,
      message: 'Blog post content generated successfully'
    });

  } catch (error) {
    console.error('💥 Blog auto-populate API error:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    let errorMessage = 'Failed to generate blog post content';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
        statusCode = 503;
      } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
        errorMessage = 'Service temporarily unavailable. Please try again in a few minutes.';
        statusCode = 429;
      } else if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
        errorMessage = 'Authentication error. Please contact support.';
        statusCode = 401;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
        statusCode = 408;
      }
    }
    
    console.log('📤 Returning error response:', { errorMessage, statusCode });
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}