import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { orderService } from '@/services/orderService';
// Legacy debug import removed

const PaymentFlowDebugger: React.FC = () => {
  const { user } = useAuth();
  const { cart } = useCart();
  const [logs, setLogs] = useState<string[]>([]);
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testCreateInternalOrder = async () => {
    try {
      addLog('🔄 Creating internal order...');
      
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

      // Create demo order data with both items and shipping address
      const orderData = {
        items: [
          {
            productId: 'demo-product-1',
            quantity: 1
          }
        ],
        shippingAddress: demoShippingAddress
      };

      const { order } = await orderService.createOrder(orderData);
      setOrderCreated(order);
      addLog(`✅ Internal order created successfully!`);
      addLog(`📋 Order ID: ${order.id}`);
      addLog(`📋 Order Number: ${order.orderNumber}`);
      addLog(`💰 Order Total: ₹${order.total}`);
      addLog(`📊 Order Status: ${order.status}`);
    } catch (error: any) {
      addLog(`❌ Internal order creation failed: ${error.message}`);
      console.error('Internal order creation error:', error);
    }
  };

  const testCreateRazorpayOrder = async () => {
    if (!orderCreated) {
      addLog('❌ No internal order found. Create internal order first.');
      return;
    }

    try {
      addLog('🔄 Creating Razorpay order...');
      addLog(`📤 Sending request with orderId: ${orderCreated.id}`);
      
      const razorpayOrderData = {
        orderId: orderCreated.id,
        amount: Math.round(orderCreated.total * 100), // Convert to paise
        currency: 'INR'
      };
      
      addLog(`📤 Request payload: ${JSON.stringify(razorpayOrderData, null, 2)}`);
      
      const razorpayOrderResponse = await razorpayService.createOrder(razorpayOrderData);
      setRazorpayOrder(razorpayOrderResponse);
      addLog(`✅ Razorpay order created successfully!`);
      addLog(`📋 Razorpay Order Response: ${JSON.stringify(razorpayOrderResponse, null, 2)}`);
    } catch (error: any) {
      addLog(`❌ Razorpay order creation failed: ${error.message}`);
      addLog(`🔍 Error details: ${JSON.stringify(error, null, 2)}`);
      console.error('Razorpay order creation error:', error);
    }
  };

  const testFullPaymentFlow = async () => {
    if (!orderCreated) {
      addLog('❌ No internal order found. Create internal order first.');
      return;
    }

    try {
      addLog('🔄 Testing full payment flow...');
      
      const paymentResult = await razorpayService.processPayment({
        orderId: orderCreated.id,
        amount: orderCreated.total,
        currency: 'INR',
        customerInfo: {
          name: user?.firstName && user?.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user?.email || 'Test User',
          email: user?.email || 'test@example.com',
          contact: user?.phone || '9876543210',
        }
      });
      
      addLog(`✅ Payment flow completed successfully!`);
      addLog(`📋 Payment Result: ${JSON.stringify(paymentResult, null, 2)}`);
    } catch (error: any) {
      addLog(`❌ Payment flow failed: ${error.message}`);
      console.error('Payment flow error:', error);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setOrderCreated(null);
    setRazorpayOrder(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Payment Flow Debugger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testCreateInternalOrder} variant="outline">
              1. Create Internal Order
            </Button>
            <Button 
              onClick={testCreateRazorpayOrder} 
              variant="outline"
              disabled={!orderCreated}
            >
              2. Create Razorpay Order
            </Button>
            <Button 
              onClick={testFullPaymentFlow} 
              variant="outline"
              disabled={!orderCreated}
            >
              3. Test Full Payment Flow
            </Button>
            <Button onClick={clearLogs} variant="destructive">
              Clear Logs
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current State</CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                <div><strong>User:</strong> {user?.email || 'Not logged in'}</div>
                <div><strong>Cart Items:</strong> {cart?.items.length || 0}</div>
                <div><strong>Internal Order:</strong> {orderCreated ? orderCreated.id : 'None'}</div>
                <div><strong>Razorpay Order:</strong> {razorpayOrder ? 'Created' : 'None'}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Debug Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-2 rounded text-xs font-mono h-64 overflow-y-auto">
                  {logs.length === 0 ? 'No logs yet. Click a button to start testing.' : (
                    logs.map((log, index) => (
                      <div key={index}>{log}</div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {orderCreated && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Internal Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(orderCreated, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {razorpayOrder && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Razorpay Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(razorpayOrder, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFlowDebugger;
