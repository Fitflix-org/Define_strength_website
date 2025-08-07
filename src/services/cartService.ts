import api from './api';
import { Product } from './productService';

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export const cartService = {
  async getCart(): Promise<{ cart: Cart }> {
    const response = await api.get('/cart');
    return response.data;
  },

  async addToCart(data: AddToCartData): Promise<{ message: string }> {
    const response = await api.post('/cart/add', data);
    return response.data;
  },

  async updateCartItem(itemId: string, quantity: number): Promise<{ message: string }> {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  async removeCartItem(itemId: string): Promise<{ message: string }> {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  async clearCart(): Promise<{ message: string }> {
    const response = await api.delete('/cart/clear');
    return response.data;
  }
};
