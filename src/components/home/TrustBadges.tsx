import { Shield, Award, Users, Truck } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: Shield,
      title: "7-Year Warranty",
      subtitle: "Full Equipment Coverage"
    },
    {
      icon: Award,
      title: "ISO Certified",
      subtitle: "Quality Guaranteed"
    },
    {
      icon: Users,
      title: "5000+ Happy Clients",
      subtitle: "Since 2009"
    },
    {
      icon: Truck,
      title: "Free Delivery",
      subtitle: "Pan India Service"
    }
  ];

  return (
    <section className="relative py-12 bg-white border-t border-gray-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-olive-50 rounded-full opacity-30 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gray-50 rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-0 w-20 h-20 bg-olive-100 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-0 w-28 h-28 bg-gray-100 rounded-full opacity-25 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div 
              key={index} 
              className="text-center group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-olive-100 to-olive-50 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:animate-glow transition-all duration-300 transform hover:shadow-lg">
                <badge.icon className="h-8 w-8 text-olive-600 group-hover:animate-pulse" />
              </div>
              <h3 className="font-bold text-black text-sm group-hover:text-olive-700 transition-colors">{badge.title}</h3>
              <p className="text-xs text-gray-600 group-hover:text-olive-600 transition-colors">{badge.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
