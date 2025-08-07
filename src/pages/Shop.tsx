import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, ShoppingCart, Star, AlertCircle } from "lucide-react";
import { productService, Product, ProductFilters } from "@/services/productService";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: "all",
    spaceType: "all",
    page: 1,
    limit: 12,
  });

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

  // Category data for the category section
  const shopCategories = [
    {
      id: 1,
      name: "Home Gym",
      description: "Complete setups for your home fitness space",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      itemCount: "25+ Items",
      spaceType: "home"
    },
    {
      id: 2,
      name: "Commercial Gym",
      description: "Professional equipment for fitness centers",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      itemCount: "40+ Items",
      spaceType: "commercial"
    }
  ];

  const equipmentCategories = [
    {
      id: 1,
      name: "Dumbbells",
      description: "Free weights for strength training",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      itemCount: "15+ Items",
      category: "dumbbells"
    },
    {
      id: 2,
      name: "Plates",
      description: "Weight plates for barbells and machines",
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      itemCount: "20+ Items",
      category: "plates"
    },
    {
      id: 3,
      name: "Strength Equipment",
      description: "Power racks, benches, and machines",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      itemCount: "30+ Items",
      category: "strength"
    },
    {
      id: 4,
      name: "Barbells",
      description: "Olympic and standard barbells",
      image: "https://images.unsplash.com/photo-1599058918753-2379bbe3d20e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      itemCount: "12+ Items",
      category: "barbells"
    },
    {
      id: 5,
      name: "Functional Machines",
      description: "Cable machines and functional trainers",
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      itemCount: "18+ Items",
      category: "functional"
    },
    {
      id: 6,
      name: "Urethane Free Weights",
      description: "Premium urethane coated weights",
      image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      itemCount: "25+ Items",
      category: "urethane"
    }
  ];

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
            <Badge className="absolute top-2 left-2 bg-olive-600 text-white">
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
                <span className="text-xl font-bold text-olive-600">
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

          <Button
            className="w-full mt-auto"
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

      {/* Shop by Category Section */}
      <div className="mb-12">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Shop by
            <span className="text-primary"> Category</span>
          </h2>
          <p className="text-muted-foreground">
            Find the perfect equipment for your fitness space. Browse by category to discover everything you need.
          </p>
        </div>

        {/* Main Categories - Home vs Commercial */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {shopCategories.map((category) => (
            <Card 
              key={category.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => handleCategoryClick(undefined, category.spaceType)}
            >
              <div className="relative h-48">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-gray-200 text-sm mb-2">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">{category.itemCount}</span>
                    <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Equipment Categories Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-center mb-6">Browse by Equipment Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {equipmentCategories.map((category) => (
              <Card 
                key={category.id} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => handleCategoryClick(category.category)}
              >
                <div className="relative h-32">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 text-white">
                    <h4 className="font-semibold text-xs mb-1">{category.name}</h4>
                    <span className="text-xs text-gray-400">{category.itemCount}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
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
    </div>
  );
};

export default Shop;