import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const ShopByCategory = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: "Home Gym",
      description: "Complete setups for your home fitness space",
      image: "/placeholder.svg",
      itemCount: "25+ Items",
      href: "/shop?category=home-gym"
    },
    {
      id: 2,
      name: "Commercial Gym",
      description: "Professional equipment for fitness centers",
      image: "/placeholder.svg",
      itemCount: "40+ Items",
      href: "/shop?category=commercial"
    }
  ];

  const equipmentCategories = [
    {
      id: 1,
      name: "Dumbbells",
      description: "Free weights for strength training",
      image: "/placeholder.svg",
      itemCount: "15+ Items",
      href: "/shop?category=dumbbells",
      gridClass: "col-span-1"
    },
    {
      id: 2,
      name: "Plates",
      description: "Weight plates for barbells and machines",
      image: "/placeholder.svg",
      itemCount: "20+ Items",
      href: "/shop?category=plates",
      gridClass: "col-span-1"
    },
    {
      id: 3,
      name: "Strength Equipment",
      description: "Power racks, benches, and machines",
      image: "/placeholder.svg",
      itemCount: "30+ Items",
      href: "/shop?category=strength",
      gridClass: "col-span-1"
    },
    {
      id: 4,
      name: "Barbells",
      description: "Olympic and standard barbells",
      image: "/placeholder.svg",
      itemCount: "12+ Items",
      href: "/shop?category=barbells",
      gridClass: "col-span-1"
    },
    {
      id: 5,
      name: "Functional Machines",
      description: "Cable machines and functional trainers",
      image: "/placeholder.svg",
      itemCount: "18+ Items",
      href: "/shop?category=functional",
      gridClass: "col-span-1"
    },
    {
      id: 6,
      name: "Urethane Free Weights",
      description: "Premium urethane coated weights",
      image: "/placeholder.svg",
      itemCount: "25+ Items",
      href: "/shop?category=urethane",
      gridClass: "col-span-1"
    }
  ];

  const handleCategoryClick = (href: string) => {
    navigate(href);
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop by
            <span className="text-primary"> Category</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Find the perfect equipment for your fitness space. Browse by category to discover everything you need.
          </p>
        </div>

        {/* Main Categories - Home vs Commercial */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => handleCategoryClick(category.href)}
            >
              <div className="relative h-64">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-200 mb-3">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{category.itemCount}</span>
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
          <h3 className="text-2xl font-bold text-center mb-8">Browse by Equipment Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {equipmentCategories.map((category) => (
              <Card 
                key={category.id} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => handleCategoryClick(category.href)}
              >
                <div className="relative h-40">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h4 className="font-semibold text-sm mb-1">{category.name}</h4>
                    <p className="text-xs text-gray-300 mb-1">{category.description}</p>
                    <span className="text-xs text-gray-400">{category.itemCount}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Browse our complete catalog.
          </p>
          <Button size="lg" onClick={() => navigate("/shop")}>
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
