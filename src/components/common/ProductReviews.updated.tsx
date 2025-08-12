import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, VerifiedIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { reviewService, Review as ApiReview, ReviewSummary } from '@/services/reviewService';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating-high' | 'rating-low' | 'helpful'>('newest');
  
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  // Load reviews
  const loadReviews = async (page = 1, sort = sortBy) => {
    try {
      setLoading(true);
      const response = await reviewService.getProductReviews(productId, {
        page,
        limit: 10,
        sortBy: sort
      });
      
      setReviews(response.data.reviews);
      setReviewSummary(response.data.summary);
      setCurrentPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load reviews on component mount and when productId changes
  useEffect(() => {
    loadReviews();
  }, [productId]);

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (!newReview.comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please write a comment for your review.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingReview(true);
      
      await reviewService.createReview({
        productId,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment
      });

      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      });

      // Reset form and reload reviews
      setNewReview({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      loadReviews();
      
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle helpful vote
  const handleHelpfulVote = async (reviewId: string) => {
    try {
      await reviewService.markReviewHelpful(reviewId);
      loadReviews(currentPage, sortBy); // Reload to get updated helpful count
      
      toast({
        title: "Thank you!",
        description: "Your vote has been recorded.",
      });
    } catch (error) {
      console.error('Error voting helpful:', error);
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle sort change
  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort);
    loadReviews(1, newSort);
  };

  // Star Rating Component
  const StarRating = ({ rating, size = 'sm', interactive = false, onChange }: {
    rating: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onChange?: (rating: number) => void;
  }) => {
    const sizeClasses = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}`}
            onClick={() => interactive && onChange?.(star)}
          />
        ))}
      </div>
    );
  };

  // Rating Distribution Component
  const RatingDistribution = () => {
    if (!reviewSummary) return null;

    const { ratingDistribution, totalReviews } = reviewSummary;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating.toString()] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 w-12">
                <span>{rating}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-gray-600 w-8 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading reviews...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Reviews Summary */}
      {reviewSummary && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {reviewSummary.averageRating.toFixed(1)}
                </div>
                <StarRating rating={Math.round(reviewSummary.averageRating)} size="lg" />
                <p className="text-gray-600 mt-2">
                  Based on {reviewSummary.totalReviews} reviews
                </p>
              </div>

              {/* Rating Distribution */}
              <div>
                <h3 className="font-semibold mb-3">Rating Distribution</h3>
                <RatingDistribution />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Write Review Button */}
      {user && !showReviewForm && (
        <div className="mb-6">
          <Button onClick={() => setShowReviewForm(true)}>
            Write a Review
          </Button>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
            
            <div className="space-y-4">
              {/* Rating Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <StarRating
                  rating={newReview.rating}
                  size="lg"
                  interactive
                  onChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                />
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                <Input
                  placeholder="Summarize your review..."
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <Textarea
                  placeholder="Share your experience with this product..."
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={handleReviewSubmit}
                  disabled={submittingReview || !newReview.comment.trim()}
                >
                  {submittingReview && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Submit Review
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowReviewForm(false)}
                  disabled={submittingReview}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sort Options */}
      {reviews.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {reviewSummary?.totalReviews || 0} Reviews
          </h3>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="rating-high">Highest Rating</SelectItem>
              <SelectItem value="rating-low">Lowest Rating</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <Avatar>
                  <AvatarFallback>
                    {review.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{review.user.name}</span>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <VerifiedIcon className="h-3 w-3 mr-1" />
                        Verified Purchase
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {review.title && (
                    <h4 className="font-medium mb-2">{review.title}</h4>
                  )}

                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  {/* Helpful Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHelpfulVote(review.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => loadReviews(currentPage - 1, sortBy)}
          >
            Previous
          </Button>
          
          <span className="flex items-center px-3 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => loadReviews(currentPage + 1, sortBy)}
          >
            Next
          </Button>
        </div>
      )}

      {/* No Reviews Message */}
      {reviews.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to review this product and help other customers!
            </p>
            {user && !showReviewForm && (
              <Button onClick={() => setShowReviewForm(true)}>
                Write the First Review
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductReviews;
