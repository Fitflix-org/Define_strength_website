const axios = require('axios');

// Test configuration
const API_BASE = 'http://localhost:3001/api';
const TEST_ORDER = {
  orderId: 'TEST_ORDER_123',
  amount: 2999.99,
  currency: 'INR'
};

// Tests payment success response format
async function testPaymentSuccessResponse() {
  try {
    // Simulate payment success response
    const response = await axios.post(`${API_BASE}/payment/success`, {
      razorpay_payment_id: 'pay_TEST123',
      razorpay_order_id: TEST_ORDER.orderId,
      razorpay_signature: 'test_signature'
    });

    console.log('\n✅ Payment Success Response Test:');
    console.log('Status:', response.status);
    console.log('Data:', {
      orderId: response.data.orderId,
      amount: response.data.amount,
      status: response.data.status
    });

    // Verify response format
    if (!response.data.orderId || typeof response.data.amount !== 'number') {
      console.log('\n❌ Validation Error: Missing/invalid fields in response');
    }
  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
  }
}

// Run tests
Promise.all([
  testPaymentSuccessResponse()
]).finally(() => {
  console.log('\n\n=== Frontend Issue Debugging Complete ===');
});