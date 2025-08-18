import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Quote, Play, VideoIcon, Users, Calendar, MapPin, CheckCircle } from "lucide-react";
import person from "@/assets/person.svg";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Fitness Enthusiast",
      location: "Mumbai",
      rating: 5,
      content: "Define Strength transformed my home into a professional gym. The equipment quality is outstanding and installation was seamless.",
      image: person,
      verified: true,
      category: "Home Gym",
      hasVideo: true,
      setupDate: "2024",
      equipmentCount: "12 pieces"
    },
    {
      name: "Priya Sharma",
      role: "Gym Owner",
      location: "Delhi",
      rating: 5,
      content: "Best investment for my commercial gym. Define Strength's expertise in space planning helped maximize our 2000 sq ft area perfectly.",
      image: person,
      verified: true,
      category: "Commercial",
      hasVideo: true,
      setupDate: "2023",
      equipmentCount: "45 pieces"
    },
    {
      name: "Tech Solutions Pvt Ltd",
      role: "Corporate Client",
      location: "Bangalore",
      rating: 5,
      content: "Our office gym setup by Define Strength boosted employee wellness and productivity. Highly recommended for corporate setups.",
      image: person,
      verified: true,
      category: "Corporate",
      hasVideo: false,
      setupDate: "2024",
      equipmentCount: "25 pieces"
    }
  ];

  const brands = [
    "Rogue Fitness", "Life Fitness", "Precor", "Matrix", "Hammer Strength", "TRX"
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by
            <span className="text-primary"> Fitness Professionals</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See what our clients say about their experience with Define Strength
          </p>
        </div>

        {/* Enhanced Testimonials Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-all duration-300 bg-white relative overflow-hidden group">
              <CardContent className="p-6 space-y-4">
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-olive-50 text-olive-700">
                    {testimonial.category}
                  </Badge>
                  {testimonial.verified && (
                    <div className="flex items-center space-x-1 text-olive-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs">Verified</span>
                    </div>
                  )}
                </div>

                {/* Quote Icon & Video Button */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Quote className="h-5 w-5 text-primary" />
                  </div>
                  {testimonial.hasVideo && (
                    <Button variant="outline" size="sm" className="border-olive-200 text-olive-600 hover:bg-olive-50">
                      <VideoIcon className="h-4 w-4 mr-1" />
                      Watch
                    </Button>
                  )}
                </div>

                {/* Rating */}
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-600 leading-relaxed">"{testimonial.content}"</p>

                {/* Client Info */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{testimonial.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{testimonial.setupDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Equipment Info */}
                  <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Equipment Installed:</span>
                      <span className="font-medium text-gray-900">{testimonial.equipmentCount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Testimonials CTA */}
        <div className="text-center mb-16">
          <Card className="bg-gradient-to-r from-black to-olive-800 text-white inline-block">
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Play className="h-8 w-8" />
                <div>
                  <h3 className="text-xl font-bold">Watch More Success Stories</h3>
                  <p className="text-gray-300">See how we've transformed 500+ fitness spaces</p>
                </div>
              </div>
              <Button variant="secondary" className="bg-white text-black hover:bg-gray-100">
                View All Video Testimonials
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trusted Partners */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-8">
            Trusted Equipment Partners
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-60">
            {brands.map((brand, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-100 h-16 rounded-lg flex items-center justify-center text-gray-600 font-medium text-sm">
                  {brand}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-border">
          {[
            { number: "500+", label: "Gyms Built", icon: <Users className="h-8 w-8" /> },
            { number: "50+", label: "Equipment Brands", icon: <CheckCircle className="h-8 w-8" /> },
            { number: "98%", label: "Client Satisfaction", icon: <Star className="h-8 w-8" /> },
            { number: "7 Years", label: "Warranty", icon: <Calendar className="h-8 w-8" /> }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
