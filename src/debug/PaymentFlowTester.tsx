import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { orderService } from '@/services/orderService';
import { razorpayService } from '@/services/razorpayService';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

const PaymentFlowTester: React.FC = () => {
  const { user } = useAuth();
  const { cart } = useCart();
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [orderData, setOrderData] = useState<any>(null);
  const [razorpayOrderData, setRazorpayOrderData] = useState<any>(null);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const emoji = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    };
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} ${emoji[type]} ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
    setCurrentStep(0);
    setOrderData(null);
    setRazorpayOrderData(null);
    setPaymentResult(null);
  };

  // Step 1: Create Internal Order
  const testStep1_CreateOrder = async () => {
    try {
      setCurrentStep(1);
      addLog('🛒 STEP 1: Creating internal order...', 'info');
      
      const demoShippingAddress = {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '123456',
        country: 'India',
        phone: '9876543210'
      };

      addLog('📤 Sending request to: POST /api/orders/create', 'info');
      addLog(`📋 Request payload: ${JSON.stringify({ shippingAddress: demoShippingAddress }, null, 2)}`, 'info');

      const orderResponse = await orderService.createOrder(demoShippingAddress);
      setOrderData(orderResponse);
      
      addLog('✅ STEP 1 COMPLETED: Internal order created successfully!', 'success');
      addLog(`📦 Order ID: ${orderResponse.order.id}`, 'success');
      addLog(`📋 Order Number: ${orderResponse.order.orderNumber}`, 'success');
      addLog(`💰 Order Total: ₹${orderResponse.order.total}`, 'success');
      addLog(`📊 Order Status: ${orderResponse.order.status}`, 'success');
      addLog(`📅 Created At: ${orderResponse.order.createdAt}`, 'info');
      
      // Log complete response for debugging
      addLog(`🔍 Complete Order Response: ${JSON.stringify(orderResponse, null, 2)}`, 'info');
      
    } catch (error: any) {
      addLog(`❌ STEP 1 FAILED: ${error.message}`, 'error');
      addLog(`🔍 Error details: ${JSON.stringify(error.response?.data || error, null, 2)}`, 'error');
      console.error('Step 1 error:', error);
    }
  };

  // Step 2: Create Razorpay Order
  const testStep2_CreateRazorpayOrder = async () => {
    if (!orderData) {
      addLog('❌ Cannot proceed: No internal order found. Complete Step 1 first.', 'error');
      return;
    }

    try {
      setCurrentStep(2);
      addLog('💳 STEP 2: Creating Razorpay order...', 'info');
      
      const razorpayOrderRequest = {
        orderId: orderData.id,
        amount: Math.round(orderData.total), // Amount in rupees as per your flow
        currency: 'INR'
      };
      
      addLog('📤 Sending request to: POST /api/payments/create-razorpay-order', 'info');
      addLog(`📋 Request payload: ${JSON.stringify(razorpayOrderRequest, null, 2)}`, 'info');
      addLog(`🔑 Using internal order ID: ${orderData.id}`, 'info');
      
      const razorpayResponse = await razorpayService.createOrder(razorpayOrderRequest);
      setRazorpayOrderData(razorpayResponse);
      
      addLog('✅ STEP 2 COMPLETED: Razorpay order created successfully!', 'success');
      addLog(`🏷️ Razorpay Order ID: ${razorpayResponse.razorpayOrder.id}`, 'success');
      addLog(`💰 Amount: ₹${razorpayResponse.razorpayOrder.amount / 100}`, 'success');
      addLog(`💱 Currency: ${razorpayResponse.razorpayOrder.currency}`, 'success');
      addLog(`🔗 Order Reference: ${razorpayResponse.orderDetails.id}`, 'success');
      addLog(`🔑 Razorpay Key: ${razorpayResponse.key}`, 'success');
      
      // Log complete response for debugging
      addLog(`🔍 Complete Razorpay Response: ${JSON.stringify(razorpayResponse, null, 2)}`, 'info');
      
    } catch (error: any) {
      addLog(`❌ STEP 2 FAILED: ${error.message}`, 'error');
      addLog(`🔍 Error details: ${JSON.stringify(error.response?.data || error, null, 2)}`, 'error');
      
      // Check specific error conditions
      if (error.message.includes('Order not found')) {
        addLog('🔍 DIAGNOSIS: Backend cannot find the internal order', 'warning');
        addLog(`🔍 Check if order ID ${orderData.id} exists in backend database`, 'warning');
        addLog('🔍 Verify order status is PENDING', 'warning');
        addLog('🔍 Confirm order belongs to authenticated user', 'warning');
      }
      
      console.error('Step 2 error:', error);
    }
  };

  // Step 3: Test Full Payment Flow (without actual payment)
    const testStep3_PaymentFlow = async () => {
    if (!orderData || !razorpayOrderData) {
      addLog('❌ Cannot proceed: Missing order data. Complete Steps 1 & 2 first.', 'error');
      return;
    }
  
    try {
      setCurrentStep(3);
      addLog('🎯 STEP 3: Testing complete payment flow...', 'info');
  
      // Simulate payment response
      const simulatedPaymentResponse = {
        order_id: orderData.id, // <-- Add this!
        razorpay_order_id: razorpayOrderData.razorpayOrder.id,
        razorpay_payment_id: 'pay_simulation_12345',
        razorpay_signature: 'simulated_signature_abcdef'
      };
  
      addLog('🔄 Simulating payment completion...', 'info');
      addLog(`📋 Simulated Razorpay response: ${JSON.stringify(simulatedPaymentResponse, null, 2)}`, 'info');
  
      // Call verify-payment endpoint
      addLog('📤 Sending request to: POST /api/payments/verify-payment', 'info');
      const verifyResult = await razorpayService.verifyPayment(simulatedPaymentResponse);
      setPaymentResult(verifyResult);
  
      addLog('✅ STEP 3 COMPLETED: Payment verification response received!', 'success');
      addLog(`� Verification Result: ${JSON.stringify(verifyResult, null, 2)}`, 'info');
    } catch (error: any) {
      addLog(`❌ STEP 3 FAILED: ${error.message}`, 'error');
      addLog(`🔍 Error details: ${JSON.stringify(error.response?.data || error, null, 2)}`, 'error');
      console.error('Step 3 error:', error);
    }
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'pending';
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'current': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Payment Flow Tester - Define Strength</CardTitle>
          <p className="text-sm text-gray-600">Test the complete order → payment → verification flow</p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Flow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 1, title: 'Create Order', desc: 'POST /api/orders/create' },
              { id: 2, title: 'Create Razorpay Order', desc: 'POST /api/payments/create-razorpay-order' },
              { id: 3, title: 'Payment Flow', desc: 'Razorpay Checkout → Verify' }
            ].map((step, index) => (
              <Card key={step.id} className={`p-4 ${getStepStatus(step.id) === 'current' ? 'border-blue-500' : ''}`}>
                <div className="flex items-center space-x-2">
                  <StatusIcon status={getStepStatus(step.id)} />
                  <div>
                    <h3 className="font-medium">Step {step.id}: {step.title}</h3>
                    <p className="text-xs text-gray-500">{step.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testStep1_CreateOrder} variant="outline">
              Step 1: Create Order
            </Button>
            <Button 
              onClick={testStep2_CreateRazorpayOrder} 
              variant="outline"
              disabled={!orderData}
            >
              Step 2: Create Razorpay Order
            </Button>
            <Button 
              onClick={testStep3_PaymentFlow} 
              variant="outline"
              disabled={!razorpayOrderData}
            >
              Step 3: Test Payment Flow
            </Button>
            <Button onClick={clearLogs} variant="destructive">
              Clear All
            </Button>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Current State</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1">
                <div><strong>User:</strong> {user?.email || 'Not logged in'}</div>
                <div><strong>Cart Items:</strong> {cart?.items.length || 0}</div>
                <div><strong>Internal Order:</strong> {orderData ? '✅ Created' : '❌ None'}</div>
                <div><strong>Razorpay Order:</strong> {razorpayOrderData ? '✅ Created' : '❌ None'}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Order Data</CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                {orderData ? (
                  <div className="space-y-1">
                    <div><strong>ID:</strong> {orderData.id}</div>
                    <div><strong>Status:</strong> <Badge variant="outline">{orderData.status}</Badge></div>
                    <div><strong>Total:</strong> ₹{orderData.total}</div>
                  </div>
                ) : (
                  <div className="text-gray-500">No order created yet</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Razorpay Data</CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                {razorpayOrderData ? (
                  <div className="space-y-1">
                    <div><strong>RZP ID:</strong> {razorpayOrderData.razorpayOrder.id}</div>
                    <div><strong>Amount:</strong> ₹{razorpayOrderData.razorpayOrder.amount / 100}</div>
                  </div>
                ) : (
                  <div className="text-gray-500">No Razorpay order yet</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Debug Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Debug Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded text-xs font-mono h-96 overflow-y-auto">
                {logs.length === 0 ? 'No logs yet. Click a button to start testing the payment flow.' : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">{log}</div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFlowTester;
