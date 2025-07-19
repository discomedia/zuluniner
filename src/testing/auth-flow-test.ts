/**
 * Authentication Flow Test
 * This script tests the authentication flow to identify any issues
 */

import { createClient } from '../lib/auth';

async function testAuthFlow() {
  console.log('🧪 Starting authentication flow test...\n');

  const testEmail = 'zulufingniner999@zuluniner.com';
  const testPassword = 'n0Tas4nd!ch';

  try {
    // Test 1: Create client
    console.log('1️⃣ Testing client creation...');
    const supabase = createClient();
    console.log('✅ Client created successfully\n');

    // Test 2: Check if user is already logged in
    console.log('2️⃣ Checking current auth state...');
    const { data: { user: currentUser }, error: getUserError } = await supabase.auth.getUser();
    
    if (getUserError) {
      console.log('ℹ️ No current session (expected):', getUserError.message);
    } else if (currentUser) {
      console.log('👤 Current user:', currentUser.email);
      console.log('🚪 Signing out first...');
      await supabase.auth.signOut();
    } else {
      console.log('ℹ️ No user logged in currently');
    }
    console.log('');

    // Test 3: Test sign in
    console.log('3️⃣ Testing sign in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message);
      return;
    }

    if (signInData.user) {
      console.log('✅ Sign in successful');
      console.log('👤 User ID:', signInData.user.id);
      console.log('📧 Email:', signInData.user.email);
      console.log('✅ Email confirmed:', signInData.user.email_confirmed_at ? 'Yes' : 'No');
    }
    console.log('');

    // Test 4: Fetch user profile
    console.log('4️⃣ Testing user profile fetch...');
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    if (profileError) {
      console.error('❌ Profile fetch failed:', profileError.message);
    } else {
      console.log('✅ Profile fetched successfully');
      console.log('👤 Name:', profile.name);
      console.log('🔑 Role:', profile.role);
      console.log('📅 Created:', profile.created_at);
    }
    console.log('');

    // Test 5: Test admin role check
    console.log('5️⃣ Testing admin role check...');
    if (profile && profile.role === 'admin') {
      console.log('✅ User has admin role - should be able to access admin routes');
    } else {
      console.log('❌ User does not have admin role');
    }
    console.log('');

    // Test 6: Sign out
    console.log('6️⃣ Testing sign out...');
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.error('❌ Sign out failed:', signOutError.message);
    } else {
      console.log('✅ Sign out successful');
    }

    console.log('\n🎉 Authentication flow test completed successfully!');

  } catch (error) {
    console.error('💥 Unexpected error during test:', error);
  }
}

testAuthFlow().catch(console.error);