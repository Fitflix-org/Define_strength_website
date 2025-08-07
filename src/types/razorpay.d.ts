// Razorpay TypeScript Definitions
// Custom types for Razorpay integration

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  retry?: {
    enabled?: boolean;
  };
  timeout?: number;
  remember_customer?: boolean;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOrderRequest {
  orderId: string;
  amount: number;
  currency?: string;
}

export interface RazorpayOrderResponse {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  order_id: string;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: string;
}

export interface PaymentVerificationResponse {
  verified: boolean;
  payment_id: string;
  order_id: string;
  status: 'success' | 'failed';
  message?: string;
}

export interface RazorpayError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: Record<string, any>;
}

// Payment Method Types
export type PaymentMethod = 
  | 'card'
  | 'netbanking' 
  | 'wallet'
  | 'upi'
  | 'emi'
  | 'paylater';

// Razorpay Status Types
export type RazorpayPaymentStatus = 
  | 'created'
  | 'authorized'
  | 'captured'
  | 'refunded'
  | 'failed';

// Export for global use
export {};
