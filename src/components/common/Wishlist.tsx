import React, { useState, useEffect } from 'react';
import { Heart, HeartIcon, Trash2, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    images: string[];
    stock: number;
    category: string;
    inStock: boolean;
  };
  createdAt: string;
}

interface WishlistProps {
  items: WishlistItem[];
  onRemoveItem: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ items, onRemoveItem, onAddToCart }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(items);

  useEffect(() => {
    setWishlistItems(items);
  }, [items]);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await onRemoveItem(productId);
      setWishlistItems(prev => prev.filter(item => item.productId !== productId));
      
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      if (!item.product.inStock) {
        toast({
          title: "Out of Stock",
          description: "This item is currently out of stock",
          variant: "destructive",
        });
        return;
      }

      await addToCart({
        productId: item.productId,
        quantity: 1,
      });

      await onAddToCart(item.productId);
      
      toast({
        title: "Added to Cart",
        description: `${item.product.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const handleMoveAllToCart = async () => {
    const inStockItems = wishlistItems.filter(item => item.product.inStock);
    
    if (inStockItems.length === 0) {
      toast({
        title: "No Items Available",
        description: "No items in your wishlist are currently in stock",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const item of inStockItems) {
        await addToCart({
          productId: item.productId,
          quantity: 1,
        });
        await onAddToCart(item.productId);
      }

      toast({
        title: "Success",
        description: `${inStockItems.length} items moved to cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move items to cart",
        variant: "destructive",
      });
    }
  };

  const calculateSavings = () => {
    return wishlistItems.reduce((total, item) => {
      if (item.product.salePrice) {
        return total + (item.product.price - item.product.salePrice);
      }
      return total;
    }, 0);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist</h2>
            <p className="text-gray-600 mb-6">Please login to view your wishlist</p>
            <Link to="/login">
              <Button>Login to Continue</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <div className="text-center py-16">
            <Heart className="h-24 w-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">
              Save items you're interested in to your wishlist and come back to them later
            </p>
            <Link to="/shop">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Wishlist Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                <span>Total Value: ₹{wishlistItems.reduce((total, item) => total + (item.product.salePrice || item.product.price), 0).toFixed(2)}</span>
                {calculateSavings() > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    You save ₹{calculateSavings().toFixed(2)}
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleMoveAllToCart}
                  disabled={wishlistItems.filter(item => item.product.inStock).length === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add All to Cart
                </Button>
              </div>
            </div>

            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {/* Product Image */}
                    <div className="relative mb-4">
                      <Link to={`/products/${item.productId}`}>
                        <img
                          src={item.product.images[0] || '/placeholder.svg'}
                          alt={item.product.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </Link>
                      
                      {/* Remove from Wishlist */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => handleRemoveFromWishlist(item.productId)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>

                      {/* Stock Status */}
                      {!item.product.inStock && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <Link to={`/products/${item.productId}`}>
                        <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary">
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      <Badge variant="outline" className="text-xs">
                        {item.product.category}
                      </Badge>

                      <div className="flex items-center gap-2">
                        {item.product.salePrice ? (
                          <>
                            <span className="text-lg font-bold text-primary">
                              ₹{item.product.salePrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.product.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">
                            ₹{item.product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-gray-500">
                        Added {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 space-y-2">
                      <Button
                        className="w-full"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.product.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {item.product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      
                      <Link to={`/products/${item.productId}`} className="block">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
