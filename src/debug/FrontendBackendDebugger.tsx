import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Send, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const FrontendBackendDebugger: React.FC = () => {
  const { user } = useAuth();
  const [backendLogs, setBackendLogs] = useState('');
  const [frontendLogs, setFrontendLogs] = useState('');
  const [testOrderId, setTestOrderId] = useState('');
  const [testAmount, setTestAmount] = useState('1500');
  const [showToken, setShowToken] = useState(false);

  const currentToken = localStorage.getItem('accessToken');

  const generateTestRequest = () => {
    const testData = {
      endpoint: 'POST /api/payments/create-razorpay-order',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: {
        orderId: testOrderId || 'order_test_123',
        amount: parseInt(testAmount),
        currency: 'INR'
      },
      notes: {
        frontend_user: user?.email,
        frontend_timestamp: new Date().toISOString(),
        frontend_version: '1.0.0'
      }
    };

    setFrontendLogs(JSON.stringify(testData, null, 2));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportDebugData = () => {
    const debugData = {
      timestamp: new Date().toISOString(),
      frontend_user: user?.email,
      frontend_logs: frontendLogs,
      backend_logs: backendLogs,
      test_parameters: {
        orderId: testOrderId,
        amount: testAmount,
        token_present: !!currentToken
      }
    };

    const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-session-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Frontend ↔️ Backend Debug Console</CardTitle>
          <p className="text-sm text-gray-600">
            Real-time debugging tool for frontend-backend integration
          </p>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Current Status */}
          <Alert>
            <AlertDescription>
              <strong>Integration Status:</strong> Frontend payment flow implemented with verification. 
              Backend returning "Order not found" on Razorpay order creation.
            </AlertDescription>
          </Alert>

          {/* Test Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="orderId">Order ID for Testing</Label>
                  <Input
                    id="orderId"
                    value={testOrderId}
                    onChange={(e) => setTestOrderId(e.target.value)}
                    placeholder="Enter order ID from step 1"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    placeholder="1500"
                  />
                </div>
              </div>
              
              <div>
                <Label>Current User: <Badge variant="outline">{user?.email || 'Not logged in'}</Badge></Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label>JWT Token:</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                {currentToken && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(currentToken)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {showToken && currentToken && (
                <Textarea
                  value={currentToken}
                  readOnly
                  className="font-mono text-xs"
                  rows={3}
                />
              )}
            </CardContent>
          </Card>

          {/* Frontend Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>Frontend Request</span>
                  <Badge variant="default">React</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button onClick={generateTestRequest} size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Generate Test Request
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(frontendLogs)}
                    disabled={!frontendLogs}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                
                <Textarea
                  value={frontendLogs}
                  onChange={(e) => setFrontendLogs(e.target.value)}
                  placeholder="Frontend request data will appear here..."
                  className="font-mono text-xs"
                  rows={15}
                />
                
                <Alert>
                  <AlertDescription className="text-xs">
                    <strong>For Backend Team:</strong> Copy this exact request format to test your endpoint.
                    Verify the token is valid and the orderId exists in your database.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Backend Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>Backend Response/Logs</span>
                  <Badge variant="secondary">Node.js</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(backendLogs)}
                    disabled={!backendLogs}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBackendLogs('')}
                  >
                    Clear
                  </Button>
                </div>
                
                <Textarea
                  value={backendLogs}
                  onChange={(e) => setBackendLogs(e.target.value)}
                  placeholder="Paste backend console logs, error messages, and database query results here..."
                  className="font-mono text-xs"
                  rows={15}
                />
                
                <Alert>
                  <AlertDescription className="text-xs">
                    <strong>For Backend Team:</strong> Paste your console.log output, error messages, 
                    and database query results here. Include the exact error causing "Order not found".
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Integration Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Integration Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Frontend Checklist ✅</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ Order creation implemented</li>
                    <li>✅ Razorpay integration implemented</li>
                    <li>✅ Payment verification implemented</li>
                    <li>✅ Error handling implemented</li>
                    <li>✅ JWT token being sent correctly</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Backend Checklist 🔍</h4>
                  <ul className="text-sm space-y-1">
                    <li>❓ Order creation endpoint working</li>
                    <li>❓ Order status set to "PENDING"</li>
                    <li>❓ JWT token validation working</li>
                    <li>❓ Order lookup query working</li>
                    <li>❓ Razorpay order creation working</li>
                    <li>❓ Payment verification endpoint ready</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Debug Data */}
          <div className="flex justify-between items-center">
            <Button onClick={exportDebugData} variant="outline">
              Export Debug Session
            </Button>
            <p className="text-xs text-gray-500">
              Share this debug session with both frontend and backend teams
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default FrontendBackendDebugger;
