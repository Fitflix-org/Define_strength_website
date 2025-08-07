import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Target, Heart, ArrowRight, Star, CheckCircle } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Michael Rodriguez",
      role: "Founder & CEO",
      experience: "15+ years",
      specialization: "Commercial Gym Design",
      certifications: ["ACSM Certified", "IHRSA Member"],
      bio: "Former gym owner turned consultant with passion for creating exceptional fitness spaces."
    },
    {
      name: "Sarah Chen",
      role: "Lead Design Consultant",
      experience: "12+ years",
      specialization: "Home Gym Solutions",
      certifications: ["NASM Certified", "Interior Design"],
      bio: "Specialized in optimizing small spaces for maximum fitness functionality and aesthetics."
    },
    {
      name: "David Thompson",
      role: "Equipment Specialist",
      experience: "10+ years",
      specialization: "Equipment Selection & Installation",
      certifications: ["Factory Training", "Safety Certified"],
      bio: "Expert in commercial and residential equipment with extensive manufacturer relationships."
    },
    {
      name: "Lisa Park",
      role: "Project Manager",
      experience: "8+ years",
      specialization: "Project Coordination",
      certifications: ["PMP Certified", "Operations Management"],
      bio: "Ensures seamless project execution from consultation to final installation."
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for perfection in every project, ensuring the highest quality standards and attention to detail."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Our love for fitness and wellness drives us to create spaces that inspire and motivate."
    },
    {
      icon: Users,
      title: "Partnership",
      description: "We work closely with clients as partners, understanding their unique needs and goals."
    },
    {
      icon: Award,
      title: "Innovation",
      description: "We stay ahead of industry trends, incorporating the latest technology and design concepts."
    }
  ];

  const achievements = [
    { year: "2009", milestone: "Company Founded", description: "Started with a vision to transform fitness spaces" },
    { year: "2012", milestone: "100th Project", description: "Reached our first major milestone" },
    { year: "2015", milestone: "Commercial Expansion", description: "Expanded into large-scale commercial projects" },
    { year: "2018", milestone: "Industry Recognition", description: "Featured in Fitness Business Magazine" },
    { year: "2020", milestone: "Virtual Consultations", description: "Adapted services for remote consultations" },
    { year: "2024", milestone: "500+ Projects", description: "Celebrating over 500 successful transformations" }
  ];

  const partners = [
    "Rogue Fitness", "Life Fitness", "Precor", "Matrix", "Hammer Strength", 
    "TRX", "Concept2", "Keiser", "HUR", "Technogym"
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About <span className="text-primary">Define Strength</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            For over 15 years, we've been transforming spaces into exceptional fitness environments. 
            Our passion for wellness and expertise in design have helped hundreds of clients achieve their fitness goals.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-20">
          <Card className="border-border">
            <CardContent className="p-12">
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                  "To democratize access to professional-quality fitness spaces by providing expert consultation, 
                  premium equipment, and exceptional service that transforms any space into a motivating environment for health and wellness."
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">500+</div>
                    <div className="text-muted-foreground">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">98%</div>
                    <div className="text-muted-foreground">Client Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">15+</div>
                    <div className="text-muted-foreground">Years Experience</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-border hover:shadow-md transition-all duration-300 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground">Passionate professionals dedicated to your success</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-border hover:shadow-md transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">{member.experience}</Badge>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-1">Specialization:</h5>
                    <p className="text-xs text-muted-foreground">{member.specialization}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2">Certifications:</h5>
                    <div className="flex flex-wrap gap-1">
                      {member.certifications.map((cert, certIndex) => (
                        <Badge key={certIndex} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Journey</h2>
            <p className="text-muted-foreground">Key milestones in our company's growth</p>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-0.5 w-0.5 h-full bg-border"></div>
            
            <div className="space-y-8">
              {achievements.map((achievement, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <Card className="border-border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-primary text-primary-foreground">{achievement.year}</Badge>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{achievement.milestone}</h3>
                        <p className="text-muted-foreground text-sm">{achievement.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partners */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Trusted Partners</h2>
            <p className="text-muted-foreground">We work with the world's leading fitness equipment manufacturers</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center opacity-60">
            {partners.map((partner, index) => (
              <div key={index} className="text-center">
                <div className="h-16 bg-muted rounded-lg flex items-center justify-center px-4">
                  <span className="font-semibold text-muted-foreground text-sm">{partner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="mb-20">
          <Card className="border-border bg-gradient-accent">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-xl text-muted-foreground leading-relaxed mb-6">
                "Define Strength transformed our company's approach to employee wellness. Their expertise in designing 
                our corporate fitness center has resulted in improved employee satisfaction and reduced healthcare costs. 
                The team's professionalism and attention to detail exceeded our expectations."
              </blockquote>
              <div className="font-semibold text-foreground">Jennifer Martinez</div>
              <div className="text-sm text-muted-foreground">Corporate Wellness Director, Fortune 500 Company</div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-hero text-primary-foreground p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and see how our expertise can help you create the perfect fitness space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Schedule Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              View Our Projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;