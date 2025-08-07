import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { User, authService, LoginData, RegisterData } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('auth_token');
      
      if (token) {
        try {
          const { user: currentUser } = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error: any) {
          // Token is invalid, clear everything
          Cookies.remove('auth_token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data);
      
      // Store token in cookie with production-ready settings
      const isProduction = import.meta.env.PROD;
      Cookies.set('auth_token', response.token, { 
        expires: 7, // 7 days
        secure: isProduction, // Only secure in production
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/'
      });
      
      setUser(response.user);
      
      toast({
        title: "Welcome back!",
        description: response.message,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.error || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      
      // Store token in cookie with production-ready settings
      const isProduction = import.meta.env.PROD;
      Cookies.set('auth_token', response.token, { 
        expires: 7, // 7 days
        secure: isProduction, // Only secure in production
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/'
      });
      
      setUser(response.user);
      
      toast({
        title: "Account created!",
        description: response.message,
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.error || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('auth_token');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
