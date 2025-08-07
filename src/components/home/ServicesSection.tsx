import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServicesSection = () => {
  const navigate = useNavigate();

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const services = [
    {
      icon: ShoppingBag,
      title: "Equipment Sales",
      description: "Premium gym equipment from top brands. From dumbbells to commercial-grade machines.",
      features: ["Free shipping on orders over $500", "Professional installation", "Extended warranty options"],
      cta: "Shop Equipment",
      href: "/shop"
    },
    {
      icon: Users,
      title: "Gym Setup Consultancy",
      description: "Expert guidance to design and build your perfect fitness space with professional planning.",
      features: ["Space optimization", "Equipment selection", "Layout planning", "Project management"],
      cta: "Book Consultation",
      href: "/consultancy"
    },
    {
      icon: Building2,
      title: "Complete Solutions",
      description: "End-to-end solutions for home gyms, office fitness centers, and commercial facilities.",
      features: ["Custom design", "Turnkey installation", "Ongoing support", "Maintenance services"],
      cta: "View Solutions",
      href: "/solutions"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need for Your
            <span className="text-primary"> Fitness Space</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Whether you're building a home gym, office fitness center, or commercial facility, 
            we provide the equipment and expertise to make it happen.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="border-border hover:shadow-md transition-all duration-300 group h-full flex flex-col">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 flex flex-col">
                {/* Features */}
                <ul className="space-y-2 flex-1">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button 
                  className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors mt-auto"
                  variant="outline"
                  onClick={() => handleNavigation(service.href)}
                >
                  {service.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Not sure where to start? Let our experts guide you through the process.
          </p>
          <Button size="lg" variant="cta" onClick={() => handleNavigation("/contact")}>
            Get Free Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;