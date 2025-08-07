import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, DollarSign, Users, ArrowRight, ExternalLink } from "lucide-react";

const Projects = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Modern Home Gym Transformation",
      type: "home",
      client: "The Johnson Family",
      location: "Austin, TX",
      budget: "$15,000",
      timeline: "3 weeks",
      space: "300 sq ft",
      completion: "2024",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      beforeImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
      description: "Converted an unused basement into a fully functional home gym with smart storage solutions and premium equipment.",
      features: ["Power rack system", "Cardio corner", "Rubber flooring", "Mirrored walls", "Smart lighting"],
      challenge: "Limited ceiling height and moisture concerns",
      solution: "Selected compact equipment and installed proper ventilation and moisture control systems."
    },
    {
      id: 2,
      title: "Corporate Wellness Center",
      type: "office",
      client: "TechCorp Industries",
      location: "Seattle, WA",
      budget: "$85,000",
      timeline: "8 weeks",
      space: "1,500 sq ft",
      completion: "2024",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
      beforeImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop",
      description: "Designed and built a comprehensive employee wellness center to boost productivity and employee satisfaction.",
      features: ["Commercial cardio equipment", "Strength training zone", "Stretching area", "Locker facilities", "Wellness technology"],
      challenge: "Noise control and professional aesthetics in corporate environment",
      solution: "Implemented sound dampening materials and sleek, professional design that fits corporate culture."
    },
    {
      id: 3,
      title: "Boutique Fitness Studio Setup",
      type: "commercial",
      client: "FitLife Studios",
      location: "Miami, FL",
      budget: "$120,000",
      timeline: "10 weeks",
      space: "2,500 sq ft",
      completion: "2023",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop",
      beforeImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop",
      description: "Complete buildout of a boutique fitness studio focusing on functional training and group classes.",
      features: ["Functional training area", "Group class space", "Premium sound system", "Climate control", "Branded design"],
      challenge: "Maximizing space for multiple workout styles",
      solution: "Created flexible zones with moveable equipment to accommodate various class types and training styles."
    },
    {
      id: 4,
      title: "Luxury Home Gym Estate",
      type: "home",
      client: "Private Residence",
      location: "Beverly Hills, CA",
      budget: "$75,000",
      timeline: "6 weeks",
      space: "800 sq ft",
      completion: "2023",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      beforeImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop",
      description: "High-end home gym with premium equipment and spa-like amenities for a luxury estate.",
      features: ["Premium cardio suite", "Full strength setup", "Recovery zone", "Entertainment system", "Smart home integration"],
      challenge: "Integration with home automation and luxury aesthetics",
      solution: "Seamlessly integrated gym controls with existing smart home system while maintaining elegant design."
    },
    {
      id: 5,
      title: "Community Recreation Center",
      type: "commercial",
      client: "City of Portland",
      location: "Portland, OR",
      budget: "$250,000",
      timeline: "14 weeks",
      space: "5,000 sq ft",
      completion: "2023",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop",
      beforeImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=300&h=200&fit=crop",
      description: "Public recreation center serving diverse community needs with accessible equipment and inclusive design.",
      features: ["ADA compliant equipment", "Family-friendly zones", "Senior fitness area", "Youth programs space", "Community programming"],
      challenge: "Serving diverse age groups and accessibility requirements",
      solution: "Designed inclusive spaces with equipment suitable for all ages and abilities, ensuring ADA compliance throughout."
    },
    {
      id: 6,
      title: "Hotel Fitness Center Renovation",
      type: "commercial",
      client: "Grand Hotel Chain",
      location: "New York, NY",
      budget: "$95,000",
      timeline: "5 weeks",
      space: "1,200 sq ft",
      completion: "2024",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
      beforeImage: "https://images.unsplash.com/photo-1551882731-d4d3d1b5ffc9?w=300&h=200&fit=crop",
      description: "Complete renovation of hotel fitness center to meet modern guest expectations and brand standards.",
      features: ["24/7 access system", "Towel service station", "Complimentary amenities", "Guest-friendly equipment", "Maintenance optimization"],
      challenge: "Minimizing downtime during hotel operations",
      solution: "Executed renovation in phases during low-occupancy periods to maintain guest services throughout project."
    }
  ];

  const filteredProjects = selectedFilter === "all" 
    ? projects 
    : projects.filter(project => project.type === selectedFilter);

  const filters = [
    { value: "all", label: "All Projects" },
    { value: "home", label: "Home Gyms" },
    { value: "commercial", label: "Commercial" },
    { value: "office", label: "Office Gyms" },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-primary">Project Gallery</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore our portfolio of successful gym setups across homes, offices, and commercial facilities. 
            Real projects, real transformations, real results.
          </p>

          {/* Filter */}
          <div className="flex justify-center">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="space-y-16">
          {filteredProjects.map((project, index) => (
            <Card key={project.id} className="overflow-hidden border-border hover:shadow-lg transition-all duration-300">
              <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Images */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="h-[400px] relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground">
                        {project.type.charAt(0).toUpperCase() + project.type.slice(1)} Gym
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Button size="sm" variant="secondary" className="bg-white/90 text-foreground">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Gallery
                      </Button>
                    </div>
                  </div>

                  {/* Before/After Preview */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={project.beforeImage} 
                          alt="Before" 
                          className="w-8 h-6 object-cover rounded"
                        />
                        <span className="text-muted-foreground">Before</span>
                        <ArrowRight className="h-3 w-3" />
                        <span className="text-foreground font-medium">After</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <CardContent className={`p-8 flex flex-col justify-center ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">{project.title}</h2>
                      <p className="text-muted-foreground text-lg">{project.client}</p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span>{project.budget}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{project.timeline}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{project.space}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Challenge & Solution */}
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-destructive mb-1">Challenge:</h5>
                        <p className="text-sm text-muted-foreground">{project.challenge}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-primary mb-1">Solution:</h5>
                        <p className="text-sm text-muted-foreground">{project.solution}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="cta">
                        View Case Study
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        Similar Project
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-accent p-12 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Project Impact</h2>
            <p className="text-muted-foreground">Real numbers from real transformations</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Projects Completed" },
              { number: "98%", label: "Client Satisfaction" },
              { number: "$15M+", label: "Total Project Value" },
              { number: "15+", label: "Years Experience" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who have transformed their spaces with our expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="cta">
              Get Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              View More Projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;