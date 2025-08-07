import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Building, Briefcase, ArrowRight } from "lucide-react";
import homeGymImage from "@/assets/home-gym.jpg";
import commercialGymImage from "@/assets/commercial-gym.jpg";
import officeGymImage from "@/assets/office-gym.jpg";

const SolutionsSection = () => {
  const solutions = [
    {
      icon: Home,
      title: "Home Gym Setup",
      description: "Transform any space into your personal fitness sanctuary. Perfect for busy professionals and fitness enthusiasts.",
      image: homeGymImage,
      features: ["Space-efficient design", "Noise consideration", "Multi-functional equipment"],
      cta: "Explore Home Solutions",
      href: "/solutions/home"
    },
    {
      icon: Building,
      title: "Commercial Gym Setup", 
      description: "Full-scale commercial fitness facilities with professional-grade equipment and optimal layout design.",
      image: commercialGymImage,
      features: ["High-capacity equipment", "Commercial warranties", "Layout optimization"],
      cta: "Commercial Solutions",
      href: "/solutions/commercial"
    },
    {
      icon: Briefcase,
      title: "Office / Corporate Gym",
      description: "Boost employee wellness with corporate fitness centers. Improve productivity and reduce healthcare costs.",
      image: officeGymImage,
      features: ["Employee wellness programs", "Compact solutions", "Corporate packages"],
      cta: "Office Solutions",
      href: "/solutions/office"
    }
  ];

  return (
    <section className="py-24 bg-gradient-accent">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Solutions for Every
            <span className="text-primary"> Space & Need</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From intimate home gyms to expansive commercial facilities, we design and build 
            fitness spaces that inspire and deliver results.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <Card key={index} className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={solution.image} 
                  alt={solution.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <solution.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{solution.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {solution.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  {solution.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Overview */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">Our Process</h3>
            <p className="text-muted-foreground">Simple, transparent, and professional</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", description: "Understand your needs, space, and budget" },
              { step: "02", title: "Design", description: "Create optimal layout and equipment selection" },
              { step: "03", title: "Installation", description: "Professional delivery and setup service" },
              { step: "04", title: "Support", description: "Ongoing maintenance and support" }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary-foreground">{process.step}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{process.title}</h4>
                <p className="text-sm text-muted-foreground">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;