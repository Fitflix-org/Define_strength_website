import api from './api';

// Review interfaces matching backend API documentation
export interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  updatedAt?: string;
  user: {
    name: string;
    firstName?: string;
  };
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: string]: number;
  };
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    summary: ReviewSummary;
  };
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
}

// Review service functions
export const reviewService = {
  // Get reviews for a specific product
  async getProductReviews(
    productId: string,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: 'newest' | 'oldest' | 'rating-high' | 'rating-low' | 'helpful';
    }
  ): Promise<ReviewsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const url = `/reviews/${productId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Create a new product review
  async createReview(reviewData: CreateReviewRequest): Promise<{
    success: boolean;
    message: string;
    data: Review;
  }> {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Update an existing review
  async updateReview(reviewId: string, reviewData: UpdateReviewRequest): Promise<{
    success: boolean;
    message: string;
    data: Review;
  }> {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete a review
  async deleteReview(reviewId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // Mark a review as helpful
  async markReviewHelpful(reviewId: string): Promise<{
    success: boolean;
    message: string;
    data: {
      helpful: number;
    };
  }> {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  }
};

// Export individual functions for backward compatibility
export const getProductReviews = reviewService.getProductReviews;
export const createReview = reviewService.createReview;
export const updateReview = reviewService.updateReview;
export const deleteReview = reviewService.deleteReview;
export const markReviewHelpful = reviewService.markReviewHelpful;
