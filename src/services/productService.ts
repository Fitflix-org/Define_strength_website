import api from './api';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
  images: string[];
  spaceType: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ProductFilters {
  category?: string;
  spaceType?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  async getProduct(id: string): Promise<{ product: Product }> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    const response = await api.get('/products/categories/all');
    return response.data;
  }
};
