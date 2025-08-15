import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Cookies from 'js-cookie';

const AuthTest: React.FC = () => {
  const { user, isLoading, isAuthenticated, login } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const checkDebugInfo = () => {
    const token = Cookies.get('auth_token');
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    
    setDebugInfo({
      token: token ? `${token.substring(0, 20)}...` : 'No token found',
      tokenExists: !!token,
      apiBaseUrl,
      userState: user,
      isAuthenticated,
      isLoading,
      environment: import.meta.env.MODE,
      allCookies: document.cookie,
    });
  };

  const testTokenValidation = async () => {
    const token = Cookies.get('auth_token');
    if (!token) {
      console.log('No token found');
      return;
    }

    console.log('Testing token validation...');
    console.log('Token:', token);
    
    try {
      // Test the exact same API call that's failing
      const response = await authService.getCurrentUser();
      console.log('✅ Token validation successful:', response);
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      
      // Let's also test the raw fetch
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
        const rawResponse = await fetch(`${apiBaseUrl}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Raw response status:', rawResponse.status);
        console.log('Raw response headers:', Object.fromEntries(rawResponse.headers.entries()));
        
        const rawData = await rawResponse.text();
        console.log('Raw response body:', rawData);
      } catch (rawError) {
        console.error('Raw fetch error:', rawError);
      }
    }
  };

  const testBackendConnection = async () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    
    try {
      console.log('Testing backend connection...');
      const response = await fetch(`${apiBaseUrl}/api/health`);
      console.log('Health check response:', response.status, response.statusText);
      
      const token = Cookies.get('auth_token');
      if (token) {
        console.log('Testing auth endpoint with current token...');
        const authResponse = await fetch(`${apiBaseUrl}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Auth test response:', authResponse.status, authResponse.statusText);
        const authData = await authResponse.text();
        console.log('Auth response body:', authData);
      }
    } catch (error) {
      console.error('Backend connection test failed:', error);
    }
  };

  const testLogin = async () => {
    try {
      await login({
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Login test completed');
    } catch (error) {
      console.error('Login test failed:', error);
    }
  };

  const clearAuth = () => {
    Cookies.remove('auth_token');
    window.location.reload();
  };

  React.useEffect(() => {
    checkDebugInfo();
  }, [user, isLoading, isAuthenticated]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug Panel</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Auth State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span>Status:</span>
              <Badge variant={isAuthenticated ? "default" : "secondary"}>
                {isLoading ? "Loading..." : isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </Badge>
            </div>
            
            <div>
              <strong>User:</strong>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                {user ? JSON.stringify(user, null, 2) : "null"}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={checkDebugInfo} variant="outline">
                Refresh Debug Info
              </Button>
              
              {debugInfo && (
                <pre className="p-3 bg-gray-100 rounded text-sm overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <Button onClick={testTokenValidation} variant="outline">
                Test Token Validation
              </Button>
              <Button onClick={testBackendConnection} variant="outline">
                Test Backend Connection
              </Button>
              <Button onClick={testLogin} variant="outline">
                Test Login (test@example.com)
              </Button>
              <Button onClick={clearAuth} variant="destructive">
                Clear Auth & Reload
              </Button>
              <Button onClick={() => window.location.reload()} variant="secondary">
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthTest;
