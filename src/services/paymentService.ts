import api from './api';

export interface Payment {
  id: string;
  orderId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIAL_REFUND';
  amount: number;
  currency: string;
  paymentMethod: string;
  gatewayProvider?: string;
  gatewayPaymentId?: string;
  gatewayOrderId?: string;
  transactionId?: string;
  bankRefNumber?: string;
  gatewayFee?: number;
  netAmount?: number;
  cardLast4?: string;
  cardBrand?: string;
  bankName?: string;
  paidAt?: string;
  failedAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  currency?: string;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
  gatewayProvider?: string;
  gatewayPaymentId?: string;
  gatewayOrderId?: string;
  cardLast4?: string;
  cardBrand?: string;
  bankName?: string;
}

export interface UpdatePaymentRequest {
  status: Payment['status'];
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  transactionId?: string;
  bankRefNumber?: string;
  gatewayFee?: number;
  failureReason?: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  gatewayRefundId?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRefundRequest {
  amount: number;
  reason: string;
}

export const paymentService = {
  // Create a new payment
  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    const response = await api.post('/payments/create', data);
    return response.data.payment;
  },

  // Update payment status
  async updatePaymentStatus(paymentId: string, data: UpdatePaymentRequest): Promise<Payment> {
    const response = await api.patch(`/payments/${paymentId}/status`, data);
    return response.data.payment;
  },

  // Get payment by ID
  async getPayment(paymentId: string): Promise<Payment> {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data.payment;
  },

  // Get payments for an order
  async getOrderPayments(orderId: string): Promise<Payment[]> {
    const response = await api.get(`/payments/order/${orderId}`);
    return response.data.payments;
  },

  // Create refund
  async createRefund(paymentId: string, data: CreateRefundRequest): Promise<Refund> {
    const response = await api.post(`/payments/${paymentId}/refund`, data);
    return response.data.refund;
  },

  // Retry failed payment
  async retryPayment(paymentId: string, paymentMethod?: string): Promise<Payment> {
    const response = await api.post(`/payments/${paymentId}/retry`, {
      paymentMethod
    });
    return response.data.payment;
  },

  // Get user payments
  async getUserPayments(): Promise<{ payments: Payment[]; pagination: any }> {
    const response = await api.get('/payments');
    return response.data;
  },

  // Helper function to detect card brand
  detectCardBrand(cardNumber?: string): string | undefined {
    if (!cardNumber) return undefined;
    
    const number = cardNumber.replace(/\s/g, '');
    
    if (number.match(/^4/)) return 'visa';
    if (number.match(/^5[1-5]/)) return 'mastercard';
    if (number.match(/^3[47]/)) return 'amex';
    if (number.match(/^6(?:011|5)/)) return 'discover';
    
    return 'unknown';
  }
};

export default paymentService;
