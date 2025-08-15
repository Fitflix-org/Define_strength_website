import api from './api';

interface RazorpayOrderRequest {
  amount: number;
  currency: string;
  receipt?: string;
  notes?: Record<string, string>;
}

interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface PaymentVerificationResponse {
  success: boolean;
  order_id: string;
  payment_id: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export class SecureRazorpayService {
  /**
   * Create a Razorpay order through backend API
   * Backend will use secret key to create order with Razorpay
   */
  static async createOrder(orderData: RazorpayOrderRequest): Promise<RazorpayOrderResponse> {
    try {
      const response = await api.post('/payments/create-razorpay-order', orderData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating Razorpay order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create payment order');
    }
  }

  /**
   * Verify payment through backend API
   * Backend will verify the signature using secret key
   */
  static async verifyPayment(verificationData: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    try {
      const response = await api.post('/payments/verify-payment', verificationData);
      return response.data;
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  }

  /**
   * Get Razorpay key ID from environment (public key only)
   */
  static getKeyId(): string {
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!keyId) {
      throw new Error('Razorpay Key ID not configured. Please set VITE_RAZORPAY_KEY_ID in environment variables.');
    }
    return keyId;
  }

  /**
   * Load Razorpay SDK script
   */
  static async loadRazorpayScript(): Promise<boolean> {
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
  }

  /**
   * Open Razorpay checkout modal
   * This is the secure way - only using public key and order created by backend
   */
  static async openCheckout(options: {
    order_id: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    customer: {
      name?: string;
      email?: string;
      contact?: string;
    };
    handler: (response: any) => void;
    modal?: {
      ondismiss?: () => void;
    };
    theme?: {
      color?: string;
    };
  }): Promise<void> {
    // Load Razorpay script if not already loaded
    const scriptLoaded = await this.loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    const rzp = new window.Razorpay({
      key: this.getKeyId(), // Only public key used here
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description || 'Payment for Define Strength',
      order_id: options.order_id, // Order created by backend
      handler: options.handler,
      prefill: {
        name: options.customer.name,
        email: options.customer.email,
        contact: options.customer.contact,
      },
      theme: {
        color: options.theme?.color || '#8B4513', // Define Strength brand color
      },
      modal: {
        ondismiss: options.modal?.ondismiss || (() => {
          console.log('Payment modal dismissed');
        }),
      },
    });

    rzp.open();
  }

  /**
   * Complete payment processing workflow (SECURE VERSION)
   */
  static async processPayment(
    orderAmount: number,
    currency: string = 'INR',
    customerInfo: {
      name?: string;
      email?: string;
      contact?: string;
    },
    onSuccess: (response: any) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      // Step 1: Create order through backend (backend uses secret key)
      const order = await this.createOrder({
        amount: orderAmount * 100, // Convert to paise
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          customer_name: customerInfo.name || '',
          customer_email: customerInfo.email || '',
        },
      });

      // Step 2: Open Razorpay checkout (frontend uses public key only)
      await this.openCheckout({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: 'Define Strength',
        description: 'Fitness Equipment Purchase',
        customer: customerInfo,
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment through backend (backend verifies with secret key)
            const verification = await this.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              onSuccess({
                ...response,
                verification,
                order_id: order.id,
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: any) {
            onError(error);
          }
        },
        modal: {
          ondismiss: () => {
            onError(new Error('Payment cancelled by user'));
          },
        },
      });
    } catch (error: any) {
      onError(error);
    }
  }
}
