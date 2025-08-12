import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, VerifiedIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { reviewService, Review as ApiReview, ReviewSummary } from '@/services/reviewService';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  userHasVoted?: boolean;
}

interface ProductReviewsProps {
  productId: string;
}
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  reviews,
  averageRating,
  totalReviews,
  onReviewSubmit
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const StarRating = ({ rating, size = 'sm', interactive = false, onChange }: {
    rating: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onChange?: (rating: number) => void;
  }) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onChange?.(star)}
          />
        ))}
      </div>
    );
  };

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review",
        variant: "destructive"
      });
      return;
    }

    if (!newReview.comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please write a comment for your review",
        variant: "destructive"
      });
      return;
    }

    onReviewSubmit(newReview);
    setNewReview({ rating: 5, title: '', comment: '' });
    setShowReviewForm(false);
    
    toast({
      title: "Review Submitted",
      description: "Thank you for your review!",
    });
  };

  const handleHelpfulVote = (reviewId: string) => {
    // API call to vote review as helpful
    toast({
      title: "Thank you!",
      description: "Your feedback has been recorded.",
    });
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => r.rating === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <StarRating rating={averageRating} size="lg" />
          <div className="text-sm text-gray-600 mt-2">
            Based on {totalReviews} reviews
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm w-8">{rating}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      {user && !showReviewForm && (
        <Button 
          onClick={() => setShowReviewForm(true)}
          className="w-full md:w-auto"
        >
          Write a Review
        </Button>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
            
            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <StarRating 
                  rating={newReview.rating}
                  size="lg"
                  interactive
                  onChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title (optional)
                </label>
                <Input
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Summary of your review"
                  maxLength={100}
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Review *
                </label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Tell others about your experience with this product"
                  rows={4}
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {newReview.comment.length}/1000 characters
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Button onClick={handleSubmitReview}>
                  Submit Review
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Customer Reviews ({totalReviews})
        </h3>

        {reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {review.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.userName}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <VerifiedIcon className="h-3 w-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-sm text-gray-600">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {review.title && (
                    <h4 className="font-medium mb-2">{review.title}</h4>
                  )}

                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpfulVote(review.id)}
                      disabled={review.userHasVoted}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
