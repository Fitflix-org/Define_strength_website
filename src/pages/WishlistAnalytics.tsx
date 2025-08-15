import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Heart, ShoppingCart, BarChart3 } from 'lucide-react';

interface WishlistAnalytics {
  totalWishlistItems: number;
  uniqueWishlistedProducts: number;
  averageWishlistSize: number;
  conversionRate: number;
  topWishlistedProducts: Array<{
    productId: string;
    productName: string;
    wishlistCount: number;
    conversionCount: number;
    conversionRate: number;
  }>;
}

interface PopularItem {
  productId: string;
  productName: string;
  product: {
    name: string;
    price: number;
    imageUrl?: string;
  };
  wishlistCount: number;
  conversionCount: number;
  conversionRate: number;
}

interface ConversionStats {
  averageTimeToConversion: number;
  averageOrderValueFromWishlist: number;
  wishlistToCartRate: number;
}

// Mock API functions (replace with actual API calls)
const fetchWishlistAnalytics = async (): Promise<WishlistAnalytics> => {
  // Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    totalWishlistItems: 0,
    uniqueWishlistedProducts: 0,
    averageWishlistSize: 0,
    conversionRate: 0,
    topWishlistedProducts: []
  };
};

const fetchPopularItems = async (): Promise<{ popularItems: PopularItem[] }> => {
  // Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    popularItems: [
      {
        productId: 'cme2aqr10000kj0a2ankoib8y',
        productName: 'Adjustable Dumbbells',
        product: {
          name: 'Adjustable Dumbbells',
          price: 299.99,
          imageUrl: '/placeholder-product.png'
        },
        wishlistCount: 3,
        conversionCount: 0,
        conversionRate: 0
      }
      // Add more mock items as needed
    ]
  };
};

const fetchConversionStats = async (): Promise<ConversionStats> => {
  // Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    averageTimeToConversion: 0,
    averageOrderValueFromWishlist: 0,
    wishlistToCartRate: 0
  };
};

const WishlistAnalytics: React.FC = () => {
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError
  } = useQuery({
    queryKey: ['wishlist-analytics'],
    queryFn: fetchWishlistAnalytics
  });

  const {
    data: popularItemsData,
    isLoading: popularItemsLoading,
    error: popularItemsError
  } = useQuery({
    queryKey: ['popular-wishlist-items'],
    queryFn: fetchPopularItems
  });

  const {
    data: conversionData,
    isLoading: conversionLoading,
    error: conversionError
  } = useQuery({
    queryKey: ['wishlist-conversion-stats'],
    queryFn: fetchConversionStats
  });

  const isLoading = analyticsLoading || popularItemsLoading || conversionLoading;
  const hasError = analyticsError || popularItemsError || conversionError;

  if (hasError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error loading wishlist analytics. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Wishlist Analytics</h1>
        <Badge variant="outline" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics Dashboard
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wishlist Items</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{analyticsData?.totalWishlistItems || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Products</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{analyticsData?.uniqueWishlistedProducts || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{analyticsData?.conversionRate || 0}%</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Wishlist Size</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{analyticsData?.averageWishlistSize || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Popular Items */}
      <Card>
        <CardHeader>
          <CardTitle>Most Wishlisted Products</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {popularItemsData?.popularItems?.map((item) => (
                <div key={item.productId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product?.imageUrl || '/placeholder-product.png'}
                      alt={item.product?.name || item.productName}
                      className="h-12 w-12 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-product.png';
                      }}
                    />
                    <div>
                      <p className="font-medium">{item.product?.name || item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.product?.price?.toFixed(2) || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.wishlistCount} wishlists</p>
                    <p className="text-sm text-muted-foreground">
                      {item.conversionRate}% conversion
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-center text-muted-foreground py-8">
                  No wishlist data available
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Time to Conversion</p>
                <p className="text-2xl font-bold">{conversionData?.averageTimeToConversion || 0} days</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                <p className="text-2xl font-bold">${conversionData?.averageOrderValueFromWishlist?.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wishlist to Cart Rate</p>
                <p className="text-2xl font-bold">{conversionData?.wishlistToCartRate || 0}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WishlistAnalytics;
