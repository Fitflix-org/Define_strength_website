import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Filter, ShoppingCart, Star, AlertCircle, Eye } from "lucide-react";
import { productService, Product, ProductFilters } from "@/services/productService";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ShopProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: "all",
    spaceType: "all",
    page: 1,
    limit: 12,
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  // Handle URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    const spaceTypeParam = searchParams.get('spaceType');
    
    if (categoryParam || spaceTypeParam) {
      setFilters(prev => ({
        ...prev,
        category: categoryParam || prev.category,
        spaceType: spaceTypeParam || prev.spaceType,
      }));
    }
  }, [location.search]);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });

  // Fetch products with filters
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
  });

  const spaceTypes = [
    { value: "all", label: "All Spaces" },
    { value: "home", label: "Home Gym" },
    { value: "office", label: "Office Gym" },
    { value: "commercial", label: "Commercial Gym" },
  ];

  const updateFilter = (key: keyof ProductFilters, value: string | number | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : (value as number), // Reset to page 1 when changing filters, ensure page is number
    }));
  };

  const handleCategoryClick = (category?: string, spaceType?: string) => {
    const newFilters = { ...filters };
    if (category) newFilters.category = category;
    if (spaceType) newFilters.spaceType = spaceType;
    newFilters.page = 1;
    
    setFilters(newFilters);
    
    // Update URL
    const searchParams = new URLSearchParams();
    if (category && category !== 'all') searchParams.set('category', category);
    if (spaceType && spaceType !== 'all') searchParams.set('spaceType', spaceType);
    
    const newUrl = searchParams.toString() ? `${location.pathname}?${searchParams.toString()}` : location.pathname;
    navigate(newUrl, { replace: true });
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      });
    } catch (error) {
      // Error is handled in the cart context
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="h-48 w-full object-cover transition-transform group-hover:scale-105"
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
              Featured
            </Badge>
          )}
          {product.salePrice && (
            <Badge className="absolute top-2 right-2 bg-red-600 text-white">
              Sale
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="space-y-2 flex-1 flex flex-col">
          <Badge variant="secondary" className="text-xs">
            {product.category.name}
          </Badge>
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {product.description}
          </CardDescription>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">(4.5)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-600">
                  ${product.salePrice || product.price}
                </span>
                {product.salePrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.price}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Stock: {product.stock} available
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleProductClick(product)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Out of Stock
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Products</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Fitness Equipment Shop</h1>
        <p className="text-lg text-gray-600">
          Find the perfect equipment for your fitness journey
        </p>
      </div>

      {/* Current Filter Display */}
      {(filters.category !== 'all' || filters.spaceType !== 'all') && (
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Filtered by:</span>
            {filters.category !== 'all' && (
              <Badge variant="secondary" className="capitalize">
                {filters.category}
                <button 
                  onClick={() => handleCategoryClick('all')}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.spaceType !== 'all' && (
              <Badge variant="secondary" className="capitalize">
                {filters.spaceType} Gym
                <button 
                  onClick={() => handleCategoryClick(undefined, 'all')}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCategoryClick('all', 'all')}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={filters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={filters.category || "all"}
            onValueChange={(value) => updateFilter("category", value === "all" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoriesData?.categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.spaceType || "all"}
            onValueChange={(value) => updateFilter("spaceType", value === "all" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Spaces" />
            </SelectTrigger>
            <SelectContent>
              {spaceTypes.map((space) => (
                <SelectItem key={space.value} value={space.value}>
                  {space.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setFilters({ page: 1, limit: 12 })}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="p-0">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))
          : productsData?.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
        }
      </div>

      {/* Pagination */}
      {productsData?.pagination && productsData.pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => updateFilter("page", Math.max(1, (filters.page || 1) - 1))}
            disabled={filters.page === 1}
          >
            Previous
          </Button>
          
          <span className="px-4 py-2">
            Page {filters.page || 1} of {productsData.pagination.pages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => updateFilter("page", Math.min(productsData.pagination.pages, (filters.page || 1) + 1))}
            disabled={filters.page === productsData.pagination.pages}
          >
            Next
          </Button>
        </div>
      )}

      {/* No products found */}
      {!isLoading && productsData?.products.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Product Detail Modal */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={selectedProduct.images[0] || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  {selectedProduct.featured && (
                    <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
                      Featured
                    </Badge>
                  )}
                  {selectedProduct.salePrice && (
                    <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                      Sale
                    </Badge>
                  )}
                </div>
                {/* Additional images if available */}
                {selectedProduct.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProduct.images.slice(1, 4).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedProduct.name} view ${index + 2}`}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {selectedProduct.category.name}
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">{selectedProduct.name}</h3>
                  <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">(4.5 out of 5)</span>
                </div>

                {/* Price */}
                <div className="border-t border-b py-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-blue-600">
                      ${selectedProduct.salePrice || selectedProduct.price}
                    </span>
                    {selectedProduct.salePrice && (
                      <span className="text-xl text-gray-500 line-through">
                        ${selectedProduct.price}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2">
                    Stock: {selectedProduct.stock} available
                  </p>
                </div>

                {/* Product Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Product Details:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">SKU:</span> {selectedProduct.sku}
                    </div>
                    <div>
                      <span className="font-medium">Space Type:</span> {selectedProduct.spaceType}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {selectedProduct.category.name}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <Badge variant={selectedProduct.stock > 0 ? "default" : "destructive"} className="ml-2">
                        {selectedProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={() => handleAddToCart(selectedProduct)}
                    disabled={selectedProduct.stock === 0}
                  >
                    {selectedProduct.stock === 0 ? (
                      <>
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Out of Stock
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopProducts;