import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/commercial-gym.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate("/shop");
  };

  const handleConsultationClick = () => {
    navigate("/contact");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-accent overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Professional gym equipment" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-4xl text-center space-y-8 mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium">
              🏆 #1 Gym Equipment & Consultancy Provider
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Build Your
                <span className="block text-white font-extrabold text-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>Define Strength</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 font-medium">
                At Home, in Office, or Your Fitness Center.
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 max-w-xl">
              Professional-grade equipment and expert consultation to create the perfect fitness space. 
              From compact home gyms to full commercial setups, we've got you covered.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="hero" className="text-lg px-8 py-4" onClick={handleShopClick}>
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4" onClick={handleConsultationClick}>
                <Play className="mr-2 h-5 w-5" />
                Book a Consultation
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>500+</div>
                <div className="text-sm text-gray-300">Gyms Built</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>50+</div>
                <div className="text-sm text-gray-300">Equipment Brands</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>98%</div>
                <div className="text-sm text-gray-300">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

      {/* Floating Elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;