// Simple test to check Supabase connection and data
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔧 Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    console.log('📡 Testing basic connection...');
    const { data: tables, error: tablesError } = await supabase
      .from('aircraft')
      .select('count')
      .limit(1);
    
    if (tablesError) {
      console.error('❌ Connection test failed:', tablesError);
      return;
    }
    
    console.log('✅ Connection successful');
    
    // Test 2: Count aircraft
    console.log('📊 Counting aircraft...');
    const { data: countData, error: countError, count } = await supabase
      .from('aircraft')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Count query failed:', countError);
      return;
    }
    
    console.log('📈 Aircraft count:', count);
    
    // Test 3: Simple select
    console.log('🔍 Fetching first 3 aircraft...');
    const { data: aircraftData, error: aircraftError } = await supabase
      .from('aircraft')
      .select('*')
      .limit(3);
    
    if (aircraftError) {
      console.error('❌ Select query failed:', aircraftError);
      return;
    }
    
    console.log('✅ Aircraft data:', aircraftData);
    
    // Test 4: Complex query (like in searchAircraft)
    console.log('🔍 Testing complex query...');
    const { data: complexData, error: complexError } = await supabase
      .from('aircraft')
      .select(`
        *,
        photos:aircraft_photos(*)
      `)
      .eq('status', 'active')
      .limit(3);
    
    if (complexError) {
      console.error('❌ Complex query failed:', complexError);
      return;
    }
    
    console.log('✅ Complex query successful:', complexData);
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testConnection();
