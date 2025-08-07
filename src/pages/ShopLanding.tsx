import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Grid3X3, Package, ArrowRight, Sparkles, Target } from "lucide-react";

const ShopLanding = () => {
  const navigate = useNavigate();

  const shopOptions = [
    {
      id: 1,
      title: "Shop by Category",
      description: "Discover equipment organized by type and space. Perfect for focused shopping with expert guidance.",
      icon: Grid3X3,
      features: [
        "Curated collections",
        "Expert recommendations", 
        "Space-specific solutions",
        "Guided shopping experience"
      ],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      href: "/shop/categories",
      badge: "Recommended",
      gradient: "from-black to-olive-600"
    },
    {
      id: 2,
      title: "See All Products",
      description: "Browse our complete catalog with advanced filters and search. Ideal for experienced buyers.",
      icon: Package,
      features: [
        "Complete product catalog",
        "Advanced filtering",
        "Price comparison",
        "Bulk ordering options"
      ],
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      href: "/shop/products",
      badge: "Power Users",
      gradient: "from-olive-600 to-olive-800"
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: "Expert Curation",
      description: "Every product is carefully selected by fitness industry professionals"
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Only the highest quality equipment from trusted manufacturers"
    },
    {
      icon: ArrowRight,
      title: "Fast Delivery",
      description: "Quick shipping with professional installation services available"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Fitness Equipment Store
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Choose Your
              <span className="block bg-gradient-to-r from-olive-400 to-olive-600 bg-clip-text text-transparent">
                Shopping Experience
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Whether you're building your first home gym or outfitting a commercial facility,
              we have the perfect shopping experience for you.
            </p>
          </div>
        </div>
      </section>

      {/* Shop Options */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              How Would You Like to Shop?
            </h2>
            <p className="text-xl text-gray-600">
              Choose the shopping experience that best fits your needs and expertise level.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {shopOptions.map((option) => (
              <Card 
                key={option.id}
                className="group hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border-0 bg-white relative"
                onClick={() => navigate(option.href)}
              >
                {/* Badge */}
                <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${option.gradient}`}>
                  {option.badge}
                </div>

                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent`}></div>
                  
                  {/* Icon Overlay */}
                  <div className={`absolute top-6 left-6 p-3 rounded-xl bg-gradient-to-r ${option.gradient} text-white shadow-lg`}>
                    <option.icon className="w-6 h-6" />
                  </div>
                </div>

                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-3">{option.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{option.description}</p>
                  
                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${option.gradient} mr-3`}></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className={`w-full bg-gradient-to-r ${option.gradient} hover:shadow-lg transition-all duration-300 text-white border-0 py-3 text-base font-semibold`}
                    onClick={() => navigate(option.href)}
                  >
                    {option.title}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-black mb-4">Why Choose Define Strength?</h3>
            <p className="text-gray-600">Experience the difference with our premium service</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-black to-olive-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-black mb-2">{benefit.title}</h4>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-olive-400 mb-2">500+</div>
              <div className="text-sm text-gray-300">Products Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-olive-600 mb-2">50+</div>
              <div className="text-sm text-gray-300">Premium Brands</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-olive-500 mb-2">1000+</div>
              <div className="text-sm text-gray-300">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">98%</div>
              <div className="text-sm text-gray-300">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopLanding;
