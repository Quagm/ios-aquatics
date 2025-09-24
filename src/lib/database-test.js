import { supabase, testConnection } from '@/supabaseClient';
import { 
  fetchProducts, 
  createInquiry, 
  fetchOrders, 
  getSalesAnalytics 
} from './queries';

/**
 * Comprehensive database connection and functionality test
 */
export async function runDatabaseTests() {
  console.log('🧪 Starting database tests...\n');
  
  const results = {
    connection: false,
    products: false,
    inquiries: false,
    orders: false,
    analytics: false,
    errors: []
  };

  // Test 1: Basic connection
  try {
    console.log('1️⃣ Testing database connection...');
    results.connection = await testConnection();
    if (results.connection) {
      console.log('✅ Database connection successful\n');
    } else {
      console.log('❌ Database connection failed\n');
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    results.errors.push(`Connection: ${error.message}`);
  }

  // Test 2: Products functionality
  try {
    console.log('2️⃣ Testing products functionality...');
    const products = await fetchProducts();
    if (products && products.length > 0) {
      console.log(`✅ Products fetch successful (${products.length} products found)`);
      console.log(`   Sample product: ${products[0].name} - $${products[0].price}`);
      results.products = true;
    } else {
      console.log('⚠️ No products found - check if sample data was inserted');
      results.products = false;
    }
    console.log('');
  } catch (error) {
    console.error('❌ Products test failed:', error.message);
    results.errors.push(`Products: ${error.message}`);
  }

  // Test 3: Inquiries functionality
  try {
    console.log('3️⃣ Testing inquiries functionality...');
    
    // Test creating an inquiry
    const testInquiry = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      subject: 'Database Test',
      message: 'This is a test inquiry created during database testing.',
      status: 'pending'
    };
    
    const createdInquiry = await createInquiry(testInquiry);
    if (createdInquiry && createdInquiry.id) {
      console.log('✅ Inquiry creation successful');
      console.log(`   Created inquiry ID: ${createdInquiry.id}`);
      results.inquiries = true;
      
      // Clean up test inquiry
      await supabase.from('inquiries').delete().eq('id', createdInquiry.id);
      console.log('   Test inquiry cleaned up');
    } else {
      console.log('❌ Inquiry creation failed');
      results.inquiries = false;
    }
    console.log('');
  } catch (error) {
    console.error('❌ Inquiries test failed:', error.message);
    results.errors.push(`Inquiries: ${error.message}`);
  }

  // Test 4: Orders functionality
  try {
    console.log('4️⃣ Testing orders functionality...');
    const orders = await fetchOrders();
    console.log(`✅ Orders fetch successful (${orders.length} orders found)`);
    results.orders = true;
    console.log('');
  } catch (error) {
    console.error('❌ Orders test failed:', error.message);
    results.errors.push(`Orders: ${error.message}`);
  }

  // Test 5: Analytics functionality
  try {
    console.log('5️⃣ Testing analytics functionality...');
    const analytics = await getSalesAnalytics();
    if (analytics && typeof analytics.totalRevenue === 'number') {
      console.log('✅ Analytics fetch successful');
      console.log(`   Total Revenue: $${analytics.totalRevenue}`);
      console.log(`   Total Orders: ${analytics.totalOrders}`);
      console.log(`   Average Order Value: $${analytics.averageOrderValue}`);
      results.analytics = true;
    } else {
      console.log('❌ Analytics fetch failed');
      results.analytics = false;
    }
    console.log('');
  } catch (error) {
    console.error('❌ Analytics test failed:', error.message);
    results.errors.push(`Analytics: ${error.message}`);
  }

  // Summary
  console.log('📊 Test Results Summary:');
  console.log('========================');
  console.log(`Connection: ${results.connection ? '✅' : '❌'}`);
  console.log(`Products: ${results.products ? '✅' : '❌'}`);
  console.log(`Inquiries: ${results.inquiries ? '✅' : '❌'}`);
  console.log(`Orders: ${results.orders ? '✅' : '❌'}`);
  console.log(`Analytics: ${results.analytics ? '✅' : '❌'}`);
  
  const passedTests = Object.values(results).filter(result => result === true).length;
  const totalTests = 5;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    results.errors.forEach(error => console.log(`   - ${error}`));
  }
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Your database is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the errors above and your Supabase configuration.');
  }
  
  return results;
}

/**
 * Quick connection test - can be called from components
 */
export async function quickConnectionTest() {
  try {
    const isConnected = await testConnection();
    return {
      success: isConnected,
      message: isConnected ? 'Database connected successfully' : 'Database connection failed'
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error.message}`
    };
  }
}
