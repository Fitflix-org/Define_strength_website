import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const EnvironmentDebugger: React.FC = () => {
  const envVars = {
    'VITE_API_BASE_URL': import.meta.env.VITE_API_BASE_URL,
    'VITE_RAZORPAY_KEY_ID': import.meta.env.VITE_RAZORPAY_KEY_ID,
    'VITE_APP_NAME': import.meta.env.VITE_APP_NAME,
    'VITE_APP_VERSION': import.meta.env.VITE_APP_VERSION,
  };

  const checkRazorpayKey = () => {
    const key = envVars['VITE_RAZORPAY_KEY_ID'];
    if (!key) return { status: 'missing', message: 'Environment variable not set' };
    if (key.includes('your_key_id_here') || key.includes('your_actual_key_here')) {
      return { status: 'placeholder', message: 'Using placeholder key - replace with actual Razorpay key' };
    }
    if (!key.startsWith('rzp_test_') && !key.startsWith('rzp_live_')) {
      return { status: 'invalid', message: 'Key should start with rzp_test_ or rzp_live_' };
    }
    return { status: 'valid', message: 'Key format looks correct' };
  };

  const razorpayStatus = checkRazorpayKey();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
      case 'placeholder':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'missing':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      'valid': 'default',
      'invalid': 'destructive',
      'placeholder': 'destructive',
      'missing': 'secondary'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Razorpay Status Alert */}
          {razorpayStatus.status !== 'valid' && (
            <Alert className={razorpayStatus.status === 'placeholder' || razorpayStatus.status === 'invalid' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Razorpay Configuration Issue:</strong> {razorpayStatus.message}
                {razorpayStatus.status === 'placeholder' && (
                  <>
                    <br />
                    <strong>To fix:</strong>
                    <ol className="ml-4 mt-2 list-decimal">
                      <li>Go to <a href="https://dashboard.razorpay.com/signin" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Razorpay Dashboard</a></li>
                      <li>Navigate to Settings → API Keys</li>
                      <li>Copy your Test Key ID (starts with rzp_test_)</li>
                      <li>Replace VITE_RAZORPAY_KEY_ID in your .env file</li>
                      <li>Restart your development server</li>
                    </ol>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-4">
            {Object.entries(envVars).map(([key, value]) => (
              <Card key={key} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {key === 'VITE_RAZORPAY_KEY_ID' && getStatusIcon(razorpayStatus.status)}
                    <span className="font-mono text-sm font-medium">{key}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {key === 'VITE_RAZORPAY_KEY_ID' && getStatusBadge(razorpayStatus.status)}
                  </div>
                </div>
                <div className="mt-2">
                  <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                    {value || '<not set>'}
                  </code>
                </div>
                {key === 'VITE_RAZORPAY_KEY_ID' && (
                  <div className="mt-2 text-xs text-gray-600">
                    {razorpayStatus.message}
                  </div>
                )}
              </Card>
            ))}
          </div>

          <Alert>
            <AlertDescription>
              <strong>Important:</strong> After updating your .env file, you must restart your development server for changes to take effect.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentDebugger;
