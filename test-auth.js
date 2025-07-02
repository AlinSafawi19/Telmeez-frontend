// Simple test script to debug authentication
const API_BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  console.log('🧪 Testing authentication flow...');

  try {
    // Test 1: Check auth status before login
    console.log('\n1️⃣ Checking auth status before login...');
    const statusResponse = await fetch(`${API_BASE_URL}/auth/status`, {
      credentials: 'include'
    });
    const statusData = await statusResponse.json();
    console.log('Auth status:', statusData);

    // Test 2: Try to get profile (should fail)
    console.log('\n2️⃣ Trying to get profile (should fail)...');
    try {
      const profileResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
        credentials: 'include'
      });
      const profileData = await profileResponse.json();
      console.log('Profile response:', profileData);
    } catch (error) {
      console.log('Profile request failed as expected:', error.message);
    }

    // Test 3: Try to refresh token (should fail)
    console.log('\n3️⃣ Trying to refresh token (should fail)...');
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      });
      const refreshData = await refreshResponse.json();
      console.log('Refresh response:', refreshData);
    } catch (error) {
      console.log('Refresh request failed as expected:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAuth(); 