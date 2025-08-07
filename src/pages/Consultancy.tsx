import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, MessageSquare, Layout, Package, Truck, ArrowRight } from "lucide-react";

const Consultancy = () => {
  return (
    <div className="min-h-screen py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Expert Gym <span className="text-olive-600">Consultancy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform any space into a professional fitness facility with our comprehensive 
            design and planning services. From concept to completion.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {[
            {
              icon: MessageSquare,
              title: "Consultation",
              description: "We assess your space, budget, and fitness goals through detailed discussion."
            },
            {
              icon: Layout,
              title: "Layout Planning",
              description: "Create optimal floor plans and equipment placement for maximum efficiency."
            },
            {
              icon: Package,
              title: "Equipment Selection",
              description: "Choose the perfect equipment mix based on your needs and space constraints."
            },
            {
              icon: Truck,
              title: "Delivery & Setup",
              description: "Professional installation and setup with full training and support."
            }
          ].map((step, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 bg-white border border-gray-200">
              <CardHeader>
                <div className="w-16 h-16 bg-olive-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg text-black">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left Column - Services */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Our Services</h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Space Assessment & Planning",
                    description: "Detailed analysis of your available space, electrical requirements, and structural considerations.",
                    features: ["3D space modeling", "Electrical planning", "Ventilation assessment", "Safety compliance"]
                  },
                  {
                    title: "Equipment Selection & Sourcing",
                    description: "Expert curation of equipment that maximizes your budget and space efficiency.",
                    features: ["Budget optimization", "Space-efficient solutions", "Quality equipment sourcing", "Warranty management"]
                  },
                  {
                    title: "Project Management",
                    description: "End-to-end project coordination from initial planning to final installation.",
                    features: ["Timeline management", "Vendor coordination", "Quality control", "Progress reporting"]
                  }
                ].map((service, index) => (
                  <Card key={index} className="border border-gray-200 bg-white">
                    <CardHeader>
                      <CardTitle className="text-xl text-black">{service.title}</CardTitle>
                      <CardDescription className="text-gray-600">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-olive-600 mr-2" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-black mb-4">Investment</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Initial Consultation</span>
                  <span className="font-semibold text-olive-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Design & Planning Package</span>
                  <span className="font-semibold text-black">Starting at $500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Full Project Management</span>
                  <span className="font-semibold text-black">3-5% of project value</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                *Final pricing depends on project scope and complexity
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <Card className="sticky top-8 bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-black">Book Your Free Consultation</CardTitle>
                <CardDescription className="text-gray-600">
                  Get expert advice tailored to your specific needs and space requirements.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </div>

                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home Gym</SelectItem>
                      <SelectItem value="office">Office Gym</SelectItem>
                      <SelectItem value="commercial">Commercial Gym</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-5k">Under $5,000</SelectItem>
                      <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                      <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                      <SelectItem value="50k-plus">$50,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Project Details</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your space, goals, and any specific requirements..."
                    rows={4}
                  />
                </div>

                <Button className="w-full bg-olive-600 hover:bg-olive-700 text-white" size="lg">
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <p>✅ Free 30-minute consultation</p>
                  <p>✅ No obligation assessment</p>
                  <p>✅ Expert recommendations</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-black text-white rounded-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Success Stories</h2>
            <p className="text-gray-300">Real projects, real results</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Home Gym Transformation",
                client: "Sarah & Mike Johnson",
                result: "Transformed 200 sq ft basement into fully functional home gym",
                budget: "$8,500",
                timeline: "2 weeks"
              },
              {
                title: "Corporate Wellness Center",
                client: "TechCorp Inc.",
                result: "Designed 1,500 sq ft employee fitness center",
                budget: "$45,000",
                timeline: "6 weeks"
              },
              {
                title: "Commercial Gym Setup",
                client: "FitZone Franchise",
                result: "Complete 3,000 sq ft commercial gym setup",
                budget: "$125,000",
                timeline: "8 weeks"
              }
            ].map((story, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2 text-white">{story.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{story.client}</p>
                <p className="text-gray-200 mb-4">{story.result}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Budget:</span>
                    <span className="text-white">{story.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timeline:</span>
                    <span className="text-white">{story.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultancy;