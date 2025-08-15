import React, { useState, useEffect } from 'react';
import { Heart, HeartIcon, Trash2, ShoppingCart, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { wishlistService, WishlistItem as ApiWishlistItem } from '@/services/wishlistService';

const Wishlist: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // State management
  const [wishlistItems, setWishlistItems] = useState<ApiWishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Load wishlist items
  const loadWishlist = async (page = 1) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await wishlistService.getWishlist({ page, limit: 12 });
      
      setWishlistItems(response.wishlist);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.total);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load wishlist on component mount
  useEffect(() => {
    loadWishlist();
  }, [user]);

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setRemovingItems(prev => new Set(prev).add(productId));
      
      await wishlistService.removeFromWishlist(productId);
      
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
      
      // Remove item from local state
      setWishlistItems(prev => prev.filter(item => item.product.id !== productId));
      setTotalItems(prev => prev - 1);
      
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Add item to cart from wishlist
  const handleAddToCart = async (item: ApiWishlistItem) => {
    if (!item.product.stock || item.product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    try {
      setAddingToCart(prev => new Set(prev).add(item.product.id));
      
      // Add to cart using cart context
      await addToCart({ productId: item.product.id, quantity: 1 });
      
      toast({
        title: "Added to Cart",
        description: `${item.product.name} has been added to your cart.`,
      });
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.product.id);
        return newSet;
      });
    }
  };

  // Move all items to cart
  const handleMoveAllToCart = async () => {
    const availableItems = wishlistItems.filter(item => 
      item.product.stock && item.product.stock > 0
    );

    if (availableItems.length === 0) {
      toast({
        title: "No Available Items",
        description: "No items in your wishlist are currently in stock.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add all available items to cart
      for (const item of availableItems) {
        await addToCart({ productId: item.product.id, quantity: 1 });
      }
      
      toast({
        title: "Added to Cart",
        description: `${availableItems.length} items have been added to your cart.`,
      });
      
    } catch (error) {
      console.error('Error adding items to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add some items to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Clear entire wishlist
  const handleClearWishlist = async () => {
    if (wishlistItems.length === 0) return;

    try {
      await wishlistService.clearWishlist();
      
      setWishlistItems([]);
      setTotalItems(0);
      
      toast({
        title: "Wishlist Cleared",
        description: "All items have been removed from your wishlist.",
      });
      
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to clear wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate total value
  const calculateTotalValue = () => {
    return wishlistItems.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + price;
    }, 0);
  };

  // Calculate potential savings
  const calculateSavings = () => {
    return wishlistItems.reduce((savings, item) => {
      if (item.product.salePrice) {
        return savings + (item.product.price - item.product.salePrice);
      }
      return savings;
    }, 0);
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <HeartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign In to View Your Wishlist</h2>
            <p className="text-gray-600 mb-6">
              Save your favorite items and access them from any device.
            </p>
            <Link to="/login">
              <Button size="lg">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span className="text-lg">Loading your wishlist...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-gray-600 mt-1">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        
        {wishlistItems.length > 0 && (
          <div className="flex gap-3">
            <Button onClick={handleMoveAllToCart} variant="outline">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Move All to Cart
            </Button>
            <Button onClick={handleClearWishlist} variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Wishlist
            </Button>
          </div>
        )}
      </div>

      {/* Wishlist Summary */}
      {wishlistItems.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{calculateTotalValue().toLocaleString('en-IN')}
                </div>
                <p className="text-sm text-gray-600">Total Value</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ₹{calculateSavings().toLocaleString('en-IN')}
                </div>
                <p className="text-sm text-gray-600">Potential Savings</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {wishlistItems.filter(item => item.product.stock > 0).length}
                </div>
                <p className="text-sm text-gray-600">Available Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wishlist Items */}
      {wishlistItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  {/* Product Image */}
                  <div className="relative mb-4">
                    <img
                      src={item.product.images[0] || '/api/placeholder/300/300'}
                      alt={item.product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    
                    {/* Stock Status */}
                    {item.product.stock <= 0 && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        Out of Stock
                      </Badge>
                    )}
                    
                    {/* Sale Badge */}
                    {item.product.salePrice && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        Sale
                      </Badge>
                    )}

                    {/* Remove Button */}
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFromWishlist(item.product.id)}
                      disabled={removingItems.has(item.product.id)}
                    >
                      {removingItems.has(item.product.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="h-4 w-4 fill-current" />
                      )}
                    </Button>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {item.product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        ₹{(item.product.salePrice || item.product.price).toLocaleString('en-IN')}
                      </span>
                      {item.product.salePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600">{item.product.category}</p>

                    {/* Stock Info */}
                    <div className="text-sm">
                      {item.product.stock > 0 ? (
                        <span className="text-green-600">
                          {item.product.stock} in stock
                        </span>
                      ) : (
                        <span className="text-red-600">Out of stock</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(item)}
                      disabled={item.product.stock <= 0 || addingToCart.has(item.product.id)}
                    >
                      {addingToCart.has(item.product.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 mr-2" />
                      )}
                      Add to Cart
                    </Button>
                    
                    <Link to={`/product/${item.product.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-gray-500 mt-2">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => loadWishlist(currentPage - 1)}
              >
                Previous
              </Button>
              
              <span className="flex items-center px-3 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => loadWishlist(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        // Empty Wishlist
        <Card>
          <CardContent className="p-12 text-center">
            <HeartIcon className="h-16 w-16 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">
              Save items you love to your wishlist and never lose track of them.
            </p>
            <Link to="/shop">
              <Button size="lg">
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Wishlist;
