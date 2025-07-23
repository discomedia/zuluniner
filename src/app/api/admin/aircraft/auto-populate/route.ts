import { NextRequest, NextResponse } from 'next/server';
import { disco } from '@discomedia/utils';
import { config } from '@/config/config';

// Increase serverless function timeout for LLM calls
export const maxDuration = 60; // 60 seconds

// Type definitions for LLM responses
interface ValidationResponse {
  valid: boolean;
  missing?: string[];
  enhanced_title?: string;
  details: {
    year: string | null;
    make: string | null;
    model: string | null;
  };
}

interface AircraftData {
  make: string;
  model: string;
  year: number;
  title: string;
  description: string;
  price: number;
  hours: number;
  engine_type: string;
  avionics: string;
  location: {
    airport_code: string;
    city: string;
    country: string;
  };
  specifications: {
    category: string;
    seats: number;
    empty_weight: number;
    max_takeoff_weight: number;
    fuel_capacity: number;
    cruise_speed: number;
    service_ceiling: number;
    range: number;
  };
  market_info: {
    price_range: {
      min: number;
      max: number;
    };
    desirable_features: string[];
    common_issues: string[];
    maintenance_notes: string[];
  };
  meta_description: string;
  url_slug: string;
}

// LLM call functions
async function validateAndEnhanceTitle(title: string): Promise<{ response: ValidationResponse; cost: number }> {
  console.log('🧠 Starting LLM validation...');
  
  try {
    const response = await disco.llm.call(
      `Analyze this aircraft title and determine if it contains enough information to being searching for details."${title}"
      
      Required information: Year, make, and model.
      
      If valid, also provide an enhanced title with more searchable details.
      
      Respond with JSON:
      {
        "valid": boolean,
        "missing": string[] (list what's missing if invalid),
        "enhanced_title": "string (enhanced version with more details for better searching, only if valid)",
        "details": {
          "year": string or null,
          "make": string or null, 
          "model": string or null,
        }
      }`,
      {
        model: config.llm.model,
        responseFormat: config.llm.responseFormat.json,
      }
    );
    
    console.log('✅ LLM validation completed');
    return {
      response: response.response as ValidationResponse,
      cost: response.usage.cost
    };
  } catch (error) {
    console.error('❌ Validation LLM call failed:', error);
    throw new Error(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function searchAircraftInformation(searchTitle: string): Promise<{ response: string; cost: number }> {
  console.log('🌐 Starting comprehensive search...');
  
  try {
    const response = await disco.llm.call(
      `Search for detailed information about a ${searchTitle} aircraft for sale, and return comprehensive details that aircraft buyers and sellers need:
      
      BASIC INFO: Make, full model name, year of manufacture, production years, country of origin, typical serial number format
      
      PHYSICAL SPECS: Aircraft category (single-engine, multi-engine, turboprop, etc.), engine manufacturer and model, number of seats, empty weight, max takeoff weight, fuel capacity, cruise speed, service ceiling, range
      
      AVIONICS & EQUIPMENT: Common avionics packages for this model/year, autopilot systems, navigation equipment, communication radios, transponder, engine monitoring, GPS systems
      
      PERFORMANCE: Typical cruise speed, fuel consumption, useful load, takeoff/landing distances, stall speed
      
      MARKET INFO: Current market price range in USD for good condition examples, what makes this model desirable, common issues to look for, typical total time and engine hours for aircraft of this age
      
      LOCATION: Common airports where this type of aircraft is based, typical geographic markets
      
      MAINTENANCE: Annual inspection requirements, common maintenance items, engine overhaul intervals, known ADs (Airworthiness Directives)
      
      VARIATIONS: Different versions of this model, notable differences between years, engine options, equipment packages`,
      {
        model: config.llm.model,
        responseFormat: config.llm.responseFormat.text,
        useWebSearch: true,
      }
    );
    
    console.log('✅ Comprehensive search completed');
    return {
      response: response.response as string,
      cost: response.usage.cost
    };
  } catch (error) {
    console.error('❌ Search LLM call failed:', error);
    throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function convertToStructuredData(searchResults: string): Promise<{ response: AircraftData; cost: number }> {
  console.log('🔄 Converting to structured JSON...');
  
  try {
    const response = await disco.llm.call(
      `Convert the following aircraft information to structured JSON format: ${searchResults}
      
      Use this exact structure:
      {
        "make": "string",
        "model": "string", 
        "year": "number",
        "title": "string (descriptive title for listing)",
        "description": "string (comprehensive description for listing)",
        "price": "number (estimated market price in USD)",
        "hours": "number (typical total aircraft hours for this age)",
        "engine_type": "string (engine make and model)",
        "avionics": "string (common avionics package description)",
        "location": {
          "airport_code": "string (suggest appropriate airport code)",
          "city": "string",
          "country": "string"
        },
        "specifications": {
          "category": "string",
          "seats": "number",
          "empty_weight": "number",
          "max_takeoff_weight": "number",
          "fuel_capacity": "number",
          "cruise_speed": "number",
          "service_ceiling": "number",
          "range": "number"
        },
        "market_info": {
          "price_range": {
            "min": "number",
            "max": "number"
          },
          "desirable_features": "string[]",
          "common_issues": "string[]",
          "maintenance_notes": "string[]"
        },
        "meta_description": "string (SEO-friendly description under 160 characters)",
        "url_slug": "string (URL-friendly slug like 'year-make-model-location', e.g., '1978-piper-archer-ii-florida')"
      }
      
      Make sure to provide realistic estimates for all numeric values based on typical aircraft of this make, model, and year.
      The description should be detailed and suitable for an aircraft listing website.
      Suggest an appropriate airport code based on where this type of aircraft is commonly based.
      The meta_description should be compelling and under 160 characters for SEO.
      The url_slug should be lowercase, hyphen-separated, and include key identifying information, be under 100 characters.`,
      {
        model: config.llm.model,
        responseFormat: config.llm.responseFormat.json,
      }
    );
    
    console.log('✅ JSON conversion completed');
    return {
      response: response.response as AircraftData,
      cost: response.usage.cost
    };
  } catch (error) {
    console.error('❌ Conversion LLM call failed:', error);
    throw new Error(`Data conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 Auto-populate API called');
  
  try {
    const { title } = await request.json();
    console.log('📝 Received title:', title);

    if (!title || typeof title !== 'string') {
      console.log('❌ Invalid title provided');
      return NextResponse.json(
        { error: 'Aircraft title is required' },
        { status: 400 }
      );
    }

    // Basic validation for aircraft title format
    // Check for at least a 2- or 4-digit year and some additional words
    const hasYear = /\b(19|20)\d{2}\b|\b\d{2}\b/.test(title);
    const wordCount = title.trim().split(/\s+/).length;
    console.log('🔍 Validation - hasYear:', hasYear, 'wordCount:', wordCount);
    
    if (!hasYear) {
      console.log('❌ No year found in title');
      return NextResponse.json(
        { error: 'Please include the year of the aircraft in the title' },
        { status: 400 }
      );
    }
    
    if (wordCount < 3) {
      console.log('❌ Insufficient words in title');
      return NextResponse.json(
        { error: 'Please provide more details: year, make, model, and condition notes are required' },
        { status: 400 }
      );
    }

    // Step 1: Validate and enhance the title
    const validation = await validateAndEnhanceTitle(title);
    console.log('✅ LLM validation completed, valid:', validation.response.valid);

    if (!validation.response.valid) {
      const missing = validation.response.missing || ['year, make, and model'];
      console.log('❌ Validation failed, missing:', missing);
      return NextResponse.json(
        { 
          error: `Missing required information: ${missing.join(', ')}. Please include year, make, model, and condition details (e.g., "1978 Piper Archer II – Low Time Engine" or "2001 Kitfox 5 Outback (recently restored) $108K")` 
        },
        { status: 400 }
      );
    }

    // Use the enhanced title for better search results
    const searchTitle = validation.response.enhanced_title || title;
    console.log('🔍 Search title:', searchTitle);

    // Step 2: Search for comprehensive aircraft information
    const searchResults = await searchAircraftInformation(searchTitle);

    // Step 3: Convert to structured JSON
    const structuredData = await convertToStructuredData(searchResults.response);

    // Validate the final response structure
    if (!structuredData.response || typeof structuredData.response !== 'object') {
      console.log('❌ Invalid LLM response structure');
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      );
    }

    console.log('📊 Aircraft data prepared');

    // Calculate total cost
    const totalCost = validation.cost + searchResults.cost + structuredData.cost;
    console.log('💰 Total cost:', totalCost);

    console.log('🎉 Auto-populate completed successfully');
    return NextResponse.json({
      success: true,
      data: structuredData.response,
      cost: totalCost,
      message: 'Aircraft information auto-populated successfully'
    });

  } catch (error) {
    console.error('💥 Auto-populate API error:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    let errorMessage = 'Failed to auto-populate aircraft information';
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