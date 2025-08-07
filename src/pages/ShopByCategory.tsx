import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  Building2, 
  Dumbbell, 
  Target, 
  Zap, 
  Shield,
  ArrowRight,
  Star,
  Award,
  TrendingUp,
  Users
} from "lucide-react";

const ShopByCategory = () => {
  const navigate = useNavigate();

  const spaceTypes = [
    {
      id: 1,
      name: "Home Gym",
      description: "Transform your home into your personal fitness sanctuary",
      longDescription: "Create the perfect home fitness environment with our carefully curated selection of space-efficient, premium equipment designed for residential use.",
      icon: Home,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      itemCount: "150+ Items",
      badge: "Most Popular",
      spaceType: "home",
      features: ["Space-efficient design", "Quiet operation", "Easy assembly", "Compact storage"],
      gradient: "from-emerald-600 to-teal-600"
    },
    {
      id: 2,
      name: "Commercial Gym",
      description: "Professional-grade equipment for fitness facilities",
      longDescription: "Equip your commercial facility with industrial-strength equipment built to withstand heavy usage while delivering exceptional performance.",
      icon: Building2,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      itemCount: "200+ Items",
      badge: "Professional",
      spaceType: "commercial",
      features: ["Heavy-duty construction", "High user capacity", "Extended warranties", "24/7 support"],
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      id: 3,
      name: "Office Fitness",
      description: "Workplace wellness solutions for modern offices",
      longDescription: "Promote employee health and productivity with our selection of office-friendly fitness equipment that seamlessly integrates into corporate environments.",
      icon: Users,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      itemCount: "75+ Items",
      badge: "Trending",
      spaceType: "office",
      features: ["Noise reduction", "Professional aesthetics", "Compact footprint", "Easy maintenance"],
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  const equipmentCategories = [
    {
      id: 1,
      name: "Free Weights",
      description: "Dumbbells, barbells, and weight plates",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      itemCount: "120+ Items",
      category: "free-weights",
      icon: Dumbbell,
      popularProducts: ["Adjustable Dumbbells", "Olympic Barbells", "Bumper Plates"]
    },
    {
      id: 2,
      name: "Strength Equipment",
      description: "Power racks, benches, and machines",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      itemCount: "85+ Items",
      category: "strength",
      icon: Target,
      popularProducts: ["Power Racks", "Adjustable Benches", "Smith Machines"]
    },
    {
      id: 3,
      name: "Cardio Machines",
      description: "Treadmills, bikes, and ellipticals",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      itemCount: "60+ Items",
      category: "cardio",
      icon: TrendingUp,
      popularProducts: ["Commercial Treadmills", "Spin Bikes", "Elliptical Trainers"]
    },
    {
      id: 4,
      name: "Functional Training",
      description: "Cable machines and functional trainers",
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      itemCount: "45+ Items",
      category: "functional",
      icon: Zap,
      popularProducts: ["Cable Crossovers", "Functional Trainers", "Suspension Systems"]
    },
    {
      id: 5,
      name: "Accessories",
      description: "Mats, resistance bands, and more",
      image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      itemCount: "200+ Items",
      category: "accessories",
      icon: Shield,
      popularProducts: ["Gym Mats", "Resistance Bands", "Storage Solutions"]
    },
    {
      id: 6,
      name: "Premium Collection",
      description: "Luxury and high-end equipment",
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      itemCount: "30+ Items",
      category: "premium",
      icon: Award,
      popularProducts: ["Luxury Home Gyms", "Smart Equipment", "Designer Collections"]
    }
  ];

  const handleSpaceTypeClick = (spaceType: string) => {
    navigate(`/shop/products?spaceType=${spaceType}`);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/shop/products?category=${category}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Curated Collections by Experts
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Shop by
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Category
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Discover the perfect equipment for your space. Our expert-curated categories 
              make it easy to find exactly what you need.
            </p>
          </div>
        </div>
      </section>

      {/* Space Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Space Type
            </h2>
            <p className="text-xl text-gray-600">
              Every space is unique. Find equipment specifically designed for your environment.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {spaceTypes.map((space) => (
              <Card 
                key={space.id}
                className="group hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border-0 bg-white relative"
                onClick={() => handleSpaceTypeClick(space.spaceType)}
              >
                {/* Badge */}
                <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${space.gradient}`}>
                  {space.badge}
                </div>

                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={space.image}
                    alt={space.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Icon Overlay */}
                  <div className={`absolute top-4 left-4 p-2 rounded-lg bg-gradient-to-r ${space.gradient} text-white shadow-lg`}>
                    <space.icon className="w-5 h-5" />
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{space.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{space.longDescription}</p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {space.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-700">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${space.gradient} mr-2`}></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">{space.itemCount}</span>
                    <Button size="sm" className={`bg-gradient-to-r ${space.gradient} text-white border-0`}>
                      Explore
                      <ArrowRight className="ml-1 w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Categories */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Equipment Type
            </h2>
            <p className="text-xl text-gray-600">
              From free weights to cardio machines, find exactly what you're looking for.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentCategories.map((category) => (
              <Card 
                key={category.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 bg-white"
                onClick={() => handleCategoryClick(category.category)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Icon */}
                  <div className="absolute top-3 left-3 p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white">
                    <category.icon className="w-4 h-4" />
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                    <Badge variant="secondary" className="text-xs">{category.itemCount}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  
                  {/* Popular Products */}
                  <div className="space-y-1 mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Popular Items:</p>
                    {category.popularProducts.slice(0, 2).map((product, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-600">
                        <div className="w-1 h-1 rounded-full bg-blue-500 mr-2"></div>
                        {product}
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-gray-900 group-hover:text-white transition-colors"
                  >
                    Browse {category.name}
                    <ArrowRight className="ml-2 w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Our fitness equipment experts are here to help you find the perfect setup for your space and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-8"
              onClick={() => navigate("/contact")}
            >
              Get Expert Consultation
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8"
              onClick={() => navigate("/shop/products")}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopByCategory;
