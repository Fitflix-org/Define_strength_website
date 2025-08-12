import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const APITester: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint: string, method = 'GET', body?: any) => {
    setLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const url = `${apiBaseUrl}${endpoint}`;
      
      console.log(`🔍 Testing ${method} ${url}`);
      console.log(`🔧 Environment VITE_API_BASE_URL:`, import.meta.env.VITE_API_BASE_URL);
      console.log(`🔧 Final URL:`, url);
      
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (body) {
        options.body = JSON.stringify(body);
        console.log(`📦 Request body:`, body);
      }
      
      const response = await fetch(url, options);
      const data = await response.text();
      
      console.log(`📈 Response status:`, response.status);
      console.log(`📄 Response data:`, data);
      
      setResult(`Status: ${response.status} ${response.statusText}\nURL: ${url}\n\nResponse:\n${data}`);
    } catch (error) {
      console.error(`❌ Request failed:`, error);
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = () => {
    testEndpoint('/api/auth/login', 'POST', {
      email: 'test@example.com',
      password: 'password123'
    });
  };

  const testPaymentEndpoints = () => {
    testEndpoint('/api/payments/create-razorpay-order', 'POST', {
      orderId: 'test-order-123'
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">API Endpoint Tester</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test API Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <Button onClick={() => testEndpoint('/health')} disabled={loading}>
                Test Health Check
              </Button>
              <Button onClick={() => testEndpoint('/api/auth/me')} disabled={loading}>
                Test /api/auth/me
              </Button>
              <Button onClick={testLogin} disabled={loading}>
                Test Login
              </Button>
              <Button onClick={testPaymentEndpoints} disabled={loading}>
                Test Payment Endpoints
              </Button>
              <Button onClick={() => testEndpoint('/api')} disabled={loading}>
                Test /api
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Testing...</p>
            ) : (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap">
                {result || 'No test run yet'}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APITester;
