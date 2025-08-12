import api from './api';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'pending' | 'payment_initiated' | 'payment_failed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'expired';
  total: number;
  createdAt: string;
  updatedAt: string;
  paymentInitiatedAt?: string;
  expiresAt?: string;
  lastPaymentAttempt?: string;
  items: OrderItem[];
  canRetryPayment?: boolean;
  isExpired?: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export const orderService = {
  // Get all orders for the current user
  async getOrders(): Promise<Order[]> {
    const response = await api.get('/orders');
    // Backend now returns orders array directly
    return response.data;
  },

  // Get a specific order by ID
  async getOrder(orderId: string): Promise<Order> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Create a new order from cart (handles 200 or 201 and existing order reuse)
  async createOrder(shippingAddress: ShippingAddress): Promise<{ order: Order; isExisting?: boolean }> {
    const response = await api.post('/orders/create', { shippingAddress });
    return { order: response.data.order, isExisting: response.data.isExisting };
  },

  // Retry failed payment (legacy method - using payment ID)
  async retryPayment(paymentId: string, paymentMethod: string = 'upi'): Promise<any> {
    const response = await api.post(`/payments/${paymentId}/retry`, { paymentMethod });
    return response.data;
  },
  
  // Retry payment for an order (new method - using order ID)
  async retryOrderPayment(orderId: string): Promise<any> {
    const response = await api.post(`/orders/${orderId}/retry-payment`);
    return response.data;
  },
};
