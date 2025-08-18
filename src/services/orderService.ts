import api from './api';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: { id: string; name: string; images: string[] };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'pending' | 'payment_initiated' | 'confirmed' | 'failed' | 'cancelled';
  total: number;
  items: OrderItem[];
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: string | Date;
}

export interface CreateOrderRequest {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: ShippingAddress;
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
  async createOrder(data: CreateOrderRequest): Promise<{ order: Order; razorpay: { orderId: string; amount: number; currency: string; key: string } }> {
    const res = await api.post('/orders/create', data);
    return res.data;
  },

  async verifyPayment(payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; orderId?: string }): Promise<{ success: boolean }> {
    const res = await api.post('/orders/verify', payload);
    return res.data;
  },

  async getOrder(orderId: string): Promise<Order> {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const res = await api.get(`/orders/user/${userId}`);
    return res.data;
  },

  async retryOrderPayment(orderId: string): Promise<{ success: boolean; order: Partial<Order>; razorpay: { orderId: string; amount: number; currency: string; key: string } }> {
    const res = await api.post(`/orders/${orderId}/retry`);
    return res.data;
  },
};
