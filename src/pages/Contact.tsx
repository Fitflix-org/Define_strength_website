import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, MessageCircle, ArrowRight, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contactService } from "@/services/contactService";

const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      primary: "+1 (555) 123-4567",
      secondary: "Mon-Fri 8AM-6PM EST",
      description: "Speak directly with our consultants"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      primary: "+1 (555) 123-4567",
      secondary: "Quick responses",
      description: "Get instant answers to your questions"
    },
    {
      icon: Mail,
      title: "Email",
      primary: "definestrengthpvtltd@gmail.com",
      secondary: "24-48 hour response",
      description: "Detailed project inquiries"
    },
    {
      icon: MapPin,
      title: "Office",
      primary: "90/2, Kishan Icon, Next to Ironhill",
      secondary: "Above Barkaaz, Marathahalli Colony, Bangalore, Karnataka, India, 560037",
      description: "Visit our showroom by appointment"
    }
  ];

  const faqs = [
    {
      question: "How much does a consultation cost?",
      answer: "Our initial consultation is completely free. We'll assess your space, discuss your goals, and provide preliminary recommendations at no charge."
    },
    {
      question: "Do you handle delivery and installation?",
      answer: "Yes, we provide full delivery and professional installation services. Our certified technicians ensure proper setup and provide equipment training."
    },
    {
      question: "What's the typical timeline for a project?",
      answer: "Home gyms typically take 1-3 weeks, office gyms 3-8 weeks, and commercial facilities 6-16 weeks, depending on scope and complexity."
    },
    {
      question: "Do you offer financing options?",
      answer: "Yes, we partner with financing companies to offer flexible payment plans for both equipment purchases and complete project packages."
    },
    {
      question: "What warranty do you provide?",
      answer: "Equipment comes with manufacturer warranties (typically 1-7 years). We also provide a 1-year service guarantee on our installation work."
    },
    {
      question: "Can you work with my existing equipment?",
      answer: "Absolutely! We can incorporate your current equipment into new designs and recommend additions that complement what you already have."
    }
  ];

  // Callback form state
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState<string | undefined>(undefined);
  const [budget, setBudget] = useState<string | undefined>(undefined);
  const [timeline, setTimeline] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!firstName || !lastName || !email || !phone) {
      toast({ title: "Missing information", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Pre-submit duplicate check
      const check = await contactService.checkCallback({ phone, email });
      if (check?.exists) {
        toast({ title: "Request already received", description: `Reference: ${check.reference}`, variant: "destructive" });
        setSubmitting(false);
        return;
      }

      const res = await contactService.createCallback({
        name: `${firstName} ${lastName}`.trim(),
        phone,
        email,
        preferredTime: timeline,
        message,
      });
      if (res.success) {
        toast({ title: "Callback requested", description: `Reference: ${res.reference}` });
        // Reset minimal fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setTimeline(undefined);
        setMessage("");
      } else {
        toast({ title: "Failed", description: res.message || "Could not submit callback.", variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to transform your space? Let's discuss your project and create the perfect fitness environment for your needs.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <Card key={index} className="text-center border-border hover:shadow-md transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <method.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">{method.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="font-semibold text-foreground">{method.primary}</div>
                <div className="text-sm text-primary">{method.secondary}</div>
                <p className="text-xs text-muted-foreground">{method.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div>
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-2xl">Book Your Free Consultation</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours to schedule your consultation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" type="tel" placeholder="+91 XXXXXXXXXX" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div>
                  <Label htmlFor="projectType">Project Type *</Label>
                  <Select required value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home Gym</SelectItem>
                      <SelectItem value="office">Office Gym</SelectItem>
                      <SelectItem value="commercial">Commercial Gym</SelectItem>
                      <SelectItem value="consultation">General Consultation</SelectItem>
                      <SelectItem value="equipment">Equipment Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select value={budget} onValueChange={setBudget}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-5k">Under ₹5,00,000</SelectItem>
                      <SelectItem value="5k-15k">₹5,00,000 - ₹15,00,000</SelectItem>
                      <SelectItem value="15k-50k">₹15,00,000 - ₹50,00,000</SelectItem>
                      <SelectItem value="50k-100k">₹50,00,000 - ₹1,00,00,000</SelectItem>
                      <SelectItem value="100k-plus">₹1,00,00,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeline">Preferred Timeline</Label>
                  <Select value={timeline} onValueChange={setTimeline}>
                    <SelectTrigger>
                      <SelectValue placeholder="When do you want to start?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">As soon as possible</SelectItem>
                      <SelectItem value="1-month">Within 1 month</SelectItem>
                      <SelectItem value="3-months">Within 3 months</SelectItem>
                      <SelectItem value="6-months">Within 6 months</SelectItem>
                      <SelectItem value="planning">Just planning ahead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Project Details</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your space, goals, equipment preferences, and any specific requirements..."
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <Button className="w-full" size="lg" variant="cta" onClick={onSubmit} disabled={submitting}>
                  <Send className="mr-2 h-5 w-5" />
                  {submitting ? 'Submitting...' : 'Request Callback'}
                </Button>

                <div className="text-center text-sm text-muted-foreground space-y-1">
                  <p>✅ Free consultation included</p>
                  <p>✅ No obligation assessment</p>
                  <p>✅ Response within 24 hours</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Office Info & Map */}
          <div className="space-y-8">
            {/* Office Information */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl">Visit Our Showroom</CardTitle>
                <CardDescription>
                  See and test equipment in person at our fully equipped showroom
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-medium">Define Strength Headquarters</div>
                    <div className="text-muted-foreground">90/2, Kishan Icon, Next to Ironhill</div>
                    <div className="text-muted-foreground">Above Barkaaz, Marathahalli Colony</div>
                    <div className="text-muted-foreground">Bangalore, Karnataka, India, 560037</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-medium">Showroom Hours</div>
                    <div className="text-muted-foreground">Monday - Friday: 9AM - 6PM</div>
                    <div className="text-muted-foreground">Saturday: 10AM - 4PM</div>
                    <div className="text-muted-foreground">Sunday: By appointment</div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="border-border">
              <CardContent className="p-0">
                <div className="h-64 bg-muted rounded-t-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive Map</p>
                    <p className="text-sm text-muted-foreground">Click to view in Google Maps</p>
                  </div>
                </div>
                <div className="p-4">
                  <Button variant="outline" className="w-full">
                    View in Google Maps
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="border-border bg-gradient-accent">
              <CardHeader>
                <CardTitle className="text-xl">Need Immediate Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="default" className="w-full justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now: +1 (555) 123-4567
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp Chat
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-muted-foreground">Quick answers to common questions about our services</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Don't see your question answered?</p>
            <Button variant="outline">
              View All FAQs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;