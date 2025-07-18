import { NextRequest, NextResponse } from 'next/server';
import { disco } from '@discomedia/utils';
import { config } from '@/config/config';

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Aircraft title is required' },
        { status: 400 }
      );
    }

    // Basic validation for aircraft title format
    // Check for at least a 2- or 4-digit year and some additional words
    const hasYear = /\b(19|20)\d{2}\b|\b\d{2}\b/.test(title);
    const wordCount = title.trim().split(/\s+/).length;
    
    if (!hasYear) {
      return NextResponse.json(
        { error: 'Please include the year of the aircraft in the title' },
        { status: 400 }
      );
    }
    
    if (wordCount < 3) {
      return NextResponse.json(
        { error: 'Please provide more details: year, make, model, and condition notes are required' },
        { status: 400 }
      );
    }

    // Use LLM to validate and enhance the title
    const validationResponse = await disco.llm.call(
      `Analyze this aircraft title and determine if it contains enough information for a listing: "${title}"
      
      Required information:
      - Year (2-digit or 4-digit)
      - Make/manufacturer 
      - Model
      - Any additional details about condition, equipment, or price
      
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
          "hasConditionInfo": boolean
        }
      }`,
      {
        model: config.llm.model,
        responseFormat: config.llm.responseFormat.json,
      }
    );

    if (!validationResponse.response?.valid) {
      const missing = validationResponse.response?.missing || ['year, make, and model'];
      return NextResponse.json(
        { 
          error: `Missing required information: ${missing.join(', ')}. Please include year, make, model, and condition details (e.g., "1978 Piper Archer II – Low Time Engine" or "2001 Kitfox 5 Outback (recently restored) $108K")` 
        },
        { status: 400 }
      );
    }

    // Use the enhanced title for better search results
    const searchTitle = validationResponse.response?.enhanced_title || title;

    // Step 1: Search for comprehensive aircraft information
    const textResponse = await disco.llm.call(
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

    // Step 2: Convert to structured JSON matching our Aircraft interface
    const jsonResponse = await disco.llm.call(
      `Convert the following aircraft information to structured JSON format: ${textResponse.response}
      
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

    // Validate the LLM response
    if (!jsonResponse.response || typeof jsonResponse.response !== 'object') {
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      );
    }

    const aircraftData = jsonResponse.response;

    // Calculate total cost
    const totalCost = validationResponse.usage.cost + textResponse.usage.cost + jsonResponse.usage.cost;

    return NextResponse.json({
      success: true,
      data: aircraftData,
      cost: totalCost,
      message: 'Aircraft information auto-populated successfully'
    });

  } catch (error) {
    console.error('Auto-populate API error:', error);
    
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
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}