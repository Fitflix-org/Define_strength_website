import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Building, Briefcase, ArrowRight, CheckCircle, DollarSign, Clock, Users } from "lucide-react";
import homeGymImage from "@/assets/home-gym.jpg";
import commercialGymImage from "@/assets/commercial-gym.jpg";
import officeGymImage from "@/assets/office-gym.jpg";

const Solutions = () => {
  const solutions = [
    {
      id: "home",
      icon: Home,
      title: "Home Gym Solutions",
      subtitle: "Personal Fitness Sanctuary",
      description: "Transform any room into your personal fitness haven. Perfect for busy professionals, fitness enthusiasts, and families who want convenient access to quality workouts.",
      image: homeGymImage,
      priceRange: "$2,000 - $25,000",
      timeline: "1-3 weeks",
      spaceSize: "50 - 500 sq ft",
      features: [
        "Space-efficient equipment selection",
        "Noise-conscious solutions",
        "Multi-functional equipment focus",
        "Storage optimization",
        "Ventilation planning",
        "Flooring recommendations"
      ],
      equipment: [
        "Adjustable dumbbells",
        "Power racks or compact stations",
        "Cardio machines (folding options)",
        "Resistance training tools",
        "Yoga/stretching area",
        "Storage solutions"
      ],
      benefits: [
        "24/7 access to your gym",
        "No monthly membership fees",
        "Privacy and comfort",
        "Family-friendly environment",
        "Convenience and time-saving",
        "Increased property value"
      ]
    },
    {
      id: "commercial",
      icon: Building,
      title: "Commercial Gym Setup",
      subtitle: "Professional Fitness Facilities",
      description: "Complete commercial gym solutions for fitness entrepreneurs, franchises, and established facilities looking to upgrade or expand their offerings.",
      image: commercialGymImage,
      priceRange: "$50,000 - $500,000+",
      timeline: "6-16 weeks",
      spaceSize: "2,000 - 20,000+ sq ft",
      features: [
        "Commercial-grade equipment",
        "Layout optimization for traffic flow",
        "Multiple workout zones",
        "Professional design aesthetics",
        "Safety and compliance planning",
        "Revenue optimization strategies"
      ],
      equipment: [
        "Cardio machine banks",
        "Strength training circuits",
        "Free weight areas",
        "Functional training zones",
        "Group fitness spaces",
        "Locker room planning"
      ],
      benefits: [
        "Attract and retain members",
        "Maximize revenue potential",
        "Professional brand image",
        "Efficient space utilization",
        "Reduced maintenance costs",
        "Scalable solutions"
      ]
    },
    {
      id: "office",
      icon: Briefcase,
      title: "Office & Corporate Gym",
      subtitle: "Employee Wellness Programs",
      description: "Boost employee health, productivity, and retention with on-site corporate fitness facilities. Perfect for offices, corporate campuses, and employee wellness initiatives.",
      image: officeGymImage,
      priceRange: "$10,000 - $100,000",
      timeline: "3-8 weeks",
      spaceSize: "200 - 3,000 sq ft",
      features: [
        "Professional appearance",
        "Compact, efficient layouts",
        "Low-maintenance equipment",
        "Quiet operation",
        "Easy-to-use equipment",
        "Corporate wellness integration"
      ],
      equipment: [
        "Commercial cardio equipment",
        "Strength training stations",
        "Stretching and recovery areas",
        "Wellness technology integration",
        "Locker and changing facilities",
        "Hydration stations"
      ],
      benefits: [
        "Improved employee health",
        "Increased productivity",
        "Reduced healthcare costs",
        "Enhanced employee retention",
        "Positive company culture",
        "Competitive recruitment advantage"
      ]
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Fitness Solutions for
            <span className="text-primary"> Every Space</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're creating a personal home gym, building a commercial facility, 
            or enhancing workplace wellness, we have the expertise and solutions you need.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="space-y-20">
          {solutions.map((solution, index) => (
            <div key={solution.id} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              {/* Image */}
              <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <img 
                  src={solution.image} 
                  alt={solution.title}
                  className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                />
                <div className="absolute top-4 left-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <solution.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div>
                  <Badge variant="outline" className="mb-2">{solution.subtitle}</Badge>
                  <h2 className="text-3xl font-bold text-foreground mb-4">{solution.title}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {solution.description}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-accent rounded-lg">
                  <div className="text-center">
                    <DollarSign className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-sm font-medium">{solution.priceRange}</div>
                    <div className="text-xs text-muted-foreground">Investment</div>
                  </div>
                  <div className="text-center">
                    <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-sm font-medium">{solution.timeline}</div>
                    <div className="text-xs text-muted-foreground">Timeline</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-sm font-medium">{solution.spaceSize}</div>
                    <div className="text-xs text-muted-foreground">Space Size</div>
                  </div>
                </div>

                {/* Features, Equipment, Benefits Tabs */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Key Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {solution.features.slice(0, 4).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="cta" size="lg">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="lg">
                      View Examples
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Compare Solutions</h2>
            <p className="text-muted-foreground">Find the perfect fit for your needs</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-accent">
                  <th className="border border-border p-4 text-left font-semibold">Feature</th>
                  <th className="border border-border p-4 text-center font-semibold">Home Gym</th>
                  <th className="border border-border p-4 text-center font-semibold">Commercial</th>
                  <th className="border border-border p-4 text-center font-semibold">Office Gym</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Typical Investment", home: "$2K - $25K", commercial: "$50K - $500K+", office: "$10K - $100K" },
                  { feature: "Space Required", home: "50 - 500 sq ft", commercial: "2K - 20K+ sq ft", office: "200 - 3K sq ft" },
                  { feature: "Setup Timeline", home: "1-3 weeks", commercial: "6-16 weeks", office: "3-8 weeks" },
                  { feature: "Maintenance Level", home: "Low", commercial: "High", office: "Medium" },
                  { feature: "User Capacity", home: "1-5 people", commercial: "50-500+ people", office: "10-100 people" },
                  { feature: "Equipment Type", home: "Multi-functional", commercial: "Specialized", office: "Professional" },
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    <td className="border border-border p-4 font-medium">{row.feature}</td>
                    <td className="border border-border p-4 text-center">{row.home}</td>
                    <td className="border border-border p-4 text-center">{row.commercial}</td>
                    <td className="border border-border p-4 text-center">{row.office}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-hero text-primary-foreground p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Let our experts help you choose the perfect solution for your space, 
            budget, and fitness goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Book Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-[#808000] hover:bg-white/10">
              View Our Portfolio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;