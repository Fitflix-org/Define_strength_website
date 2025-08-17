const axios = require('axios');
const crypto = require('crypto');

// Test configuration
const API_BASE = 'http://localhost:3000/api';
const RAZORPAY_KEY_ID = 'test_key';
const RAZORPAY_KEY_SECRET = 'test_secret';

function generateSignature(body) {
  const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
  hmac.update(JSON.stringify(body));
  return hmac.digest('hex');
}

// Tests payment verification process
async function testPaymentVerification() {
  try {
    // Create test order
    const testOrder = {
      amount: 2999.99,
      currency: 'INR',
      receipt: 'TEST_ORDER_456'
    };

    // Simulate payment creation
    const paymentResponse = await axios.post(`${API_BASE}/create-order`, testOrder);
    
    console.log('\n✅ Payment Verification Test:');
    console.log('Order Created:', paymentResponse.data);

    // Verify payment
    const verificationBody = {
      razorpay_payment_id: 'pay_TEST456',
      razorpay_order_id: paymentResponse.data.orderId,
      razorpay_signature: generateSignature(paymentResponse.data)
    };

    const verificationResponse = await axios.post(`${API_BASE}/verify-payment`, verificationBody);
    console.log('Verification Result:', verificationResponse.data);

  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
  }
}

// Run tests
testPaymentVerification().finally(() => {
  console.log('\n\n=== Payment Verification Testing Complete ===');
});