import api from './api';
import { Product } from './productService';

// Wishlist interfaces matching backend API documentation
export interface WishlistItem {
  id: string;
  addedAt: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    images: string[];
    stock: number;
    category: string;
    featured: boolean;
    active: boolean;
  };
}

export interface WishlistResponse {
  success: boolean;
  wishlist: WishlistItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AddToWishlistRequest {
  productId: string;
}

export interface WishlistCheckResponse {
  success: boolean;
  inWishlist: boolean;
  addedAt?: string;
}

// Wishlist service functions
export const wishlistService = {
  // Get user's wishlist
  async getWishlist(params?: {
    page?: number;
    limit?: number;
  }): Promise<WishlistResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `/wishlist${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Add product to wishlist
  async addToWishlist(productId: string): Promise<{
    success: boolean;
    message: string;
    wishlistItem: WishlistItem;
  }> {
    const response = await api.post('/wishlist/add', { productId });
    return response.data;
  },

  // Remove product from wishlist
  async removeFromWishlist(productId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return response.data;
  },

  // Clear entire wishlist
  async clearWishlist(): Promise<{
    success: boolean;
    message: string;
    deletedCount: number;
  }> {
    const response = await api.delete('/wishlist/clear');
    return response.data;
  },

  // Check if product is in wishlist
  async checkInWishlist(productId: string): Promise<WishlistCheckResponse> {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data;
  },

  // Get wishlist count (helper function)
  async getWishlistCount(): Promise<number> {
    try {
      const wishlist = await this.getWishlist({ page: 1, limit: 1 });
      return wishlist.pagination.total;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  }
};

// Export individual functions for backward compatibility
export const getWishlist = wishlistService.getWishlist;
export const addToWishlist = wishlistService.addToWishlist;
export const removeFromWishlist = wishlistService.removeFromWishlist;
export const clearWishlist = wishlistService.clearWishlist;
export const checkInWishlist = wishlistService.checkInWishlist;
export const getWishlistCount = wishlistService.getWishlistCount;
