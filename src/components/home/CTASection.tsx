import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Build Your
              <span className="block">Dream Fitness Space?</span>
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Whether you're looking to shop equipment or need expert consultation, 
              we're here to make your fitness goals a reality.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90"
            >
              <Phone className="mr-2 h-5 w-5" />
              Book Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-4 border-white/30 text-[#808000] hover:bg-white/10"
            >
              Shop Equipment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Call Us</h3>
              <p className="text-white/80">+1 (555) 123-4567</p>
              <p className="text-sm text-white/60">Mon-Fri 8AM-6PM EST</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">WhatsApp</h3>
              <p className="text-white/80">+1 (555) 123-4567</p>
              <p className="text-sm text-white/60">Quick Response</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ArrowRight className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Online Form</h3>
              <p className="text-white/80">Get a Quote</p>
              <p className="text-sm text-white/60">24-48 hour response</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-12 border-t border-white/20 text-sm text-white/80">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-olive-400 rounded-full"></div>
              <span>Free Consultation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-olive-400 rounded-full"></div>
              <span>Professional Installation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-olive-400 rounded-full"></div>
              <span>Extended Warranties</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-olive-400 rounded-full"></div>
              <span>Ongoing Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;