import api from './api';
import { 
  RazorpayOrderRequest, 
  RazorpayOrderResponse, 
  PaymentVerificationRequest, 
  PaymentVerificationResponse,
  RazorpayOptions,
  RazorpayPaymentResponse,
  RazorpayError
} from '@/types/razorpay';

// Load Razorpay script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export class RazorpayService {
  private keyId: string;

  constructor() {
    this.keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    if (!this.keyId) {
      console.warn('Razorpay Key ID not found in environment variables');
    }
  }

  // Create a new payment order (backend computes amount/currency)
  async createOrder(orderData: { orderId: string }): Promise<RazorpayOrderResponse> {
    try {
      const response = await api.post('/payments/create-razorpay-order', orderData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating Razorpay order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create payment order');
    }
  }

  // Verify payment signature
  async verifyPayment(verificationData: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
  try {
    // ✅ Fix: Add /api prefix to match backend route
    const response = await api.post('/api/payments/verify-payment', verificationData);
    return response.data;
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
}

  // Open Razorpay checkout
  async openCheckout(options: Partial<RazorpayOptions>): Promise<RazorpayPaymentResponse> {
    // Load Razorpay script if not already loaded
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    return new Promise((resolve, reject) => {
      const defaultOptions: RazorpayOptions = {
        key: this.keyId,
        amount: 0,
        currency: 'INR',
        name: 'Define Strength',
        description: 'Premium Fitness Equipment',
        image: '/favicon.ico',
        order_id: '',
        theme: {
          color: '#000000'
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          }
        },
        handler: (response: RazorpayPaymentResponse) => {  
          console.log("Handler got:", response);
          console.log("Razorpay handler response:", response);
          resolve(response);
        },
        retry: {
          enabled: true
        },
        timeout: 300, // 5 minutes
        remember_customer: false,
        ...options
      };

      try {
        const razorpay = new window.Razorpay(defaultOptions);
        
        // Handle payment failure
        razorpay.on('payment.failed', (response: { error: RazorpayError }) => {
          console.error('Payment failed:', response.error);
          reject(new Error(`Payment failed: ${response.error.description}`));
        });

        // Open checkout
        razorpay.open();
      } catch (error) {
        console.error('Error opening Razorpay checkout:', error);
        reject(new Error('Failed to open payment gateway'));
      }
    });
  }

  // Complete payment flow
  async processPayment({
    orderId,
    amount,
    currency = 'INR',
    customerInfo
  }: {
    orderId: string;
    amount: number;
    currency?: string;
    customerInfo?: {
      name?: string;
      email?: string;
      contact?: string;
    };
  }): Promise<PaymentVerificationResponse> {
    try {
      // Step 1: Create Razorpay order
      const orderResponse = await this.createOrder({ orderId });

      // Step 2: Open Razorpay checkout with backend-provided key and order id
      const paymentResponse = await this.openCheckout({
        key: orderResponse.key,
        amount: orderResponse.razorpayOrder.amount,
        currency: orderResponse.razorpayOrder.currency,
        order_id: orderResponse.razorpayOrder.id,
        prefill: customerInfo,
        notes: {
          order_id: orderId
        }
      });

      // Step 3: Verify payment
      const verificationResponse = await this.verifyPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        // order_id: orderId
      });

      return verificationResponse;
    } catch (error: any) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }

  // Utility method to format amount in paise
  static formatAmountToPaise(amount: number): number {
    return Math.round(amount * 100);
  }

  // Utility method to format amount from paise
  static formatAmountFromPaise(amountInPaise: number): number {
    return amountInPaise / 100;
  }

  // Check if Razorpay is available
  isAvailable(): boolean {
    return !!this.keyId && typeof window !== 'undefined';
  }

  // Get supported payment methods (this could be fetched from API)
  getSupportedPaymentMethods() {
    return [
      { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
      { id: 'upi', name: 'UPI', icon: '📱' },
      { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
      { id: 'wallet', name: 'Wallet', icon: '💰' },
      { id: 'emi', name: 'EMI', icon: '💸' }
    ];
  }
}

// Export singleton instance
export const razorpayService = new RazorpayService();

export default razorpayService;
