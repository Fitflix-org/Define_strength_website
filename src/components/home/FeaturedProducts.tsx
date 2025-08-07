import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
  const navigate = useNavigate();

  const featuredProducts = [
    {
      id: 1,
      name: "Kong Double Rack Rig",
      description: "Professional-grade power rack with dual stations for comprehensive strength training.",
      price: 3299,
      salePrice: 2999,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      featured: true,
      category: "Power Racks"
    },
    {
      id: 2,
      name: "Adjustable Dumbbells Set",
      description: "Space-saving adjustable dumbbells with quick-change mechanism, 5-50lbs per dumbbell.",
      price: 899,
      salePrice: null,
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.6,
      featured: true,
      category: "Free Weights"
    },
    {
      id: 3,
      name: "Commercial Treadmill Pro",
      description: "Heavy-duty commercial treadmill with advanced cushioning and entertainment system.",
      price: 4599,
      salePrice: 3999,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
      featured: true,
      category: "Cardio"
    },
    {
      id: 4,
      name: "Cable Crossover Machine",
      description: "Dual-adjustable pulley system for versatile functional training and strength building.",
      price: 2299,
      salePrice: null,
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      featured: true,
      category: "Cable Machines"
    }
  ];

  const handleProductClick = (productId: number) => {
    // Navigate to the products page and scroll to the specific product
    navigate(`/shop/products#product-${productId}`);
  };

  const handleViewAllClick = () => {
    navigate("/shop");
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured
            <span className="text-primary"> Equipment</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Discover our most popular gym equipment, trusted by fitness enthusiasts and professionals worldwide.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
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
                  <Badge variant="secondary" className="text-xs w-fit">
                    {product.category}
                  </Badge>
                  <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2 flex-1">
                    {product.description}
                  </CardDescription>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.rating})</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
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
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Button size="lg" onClick={handleViewAllClick} className="px-8">
            View All Equipment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
