import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calculator, ArrowRight } from "lucide-react";

const GymCostCalculator = () => {
  const [gymType, setGymType] = useState("");
  const [space, setSpace] = useState([500]);
  const [budget, setBudget] = useState([50000]);
  
  const calculateRecommendation = () => {
    if (!gymType) return null;
    
    const baseMultiplier = gymType === "home" ? 1 : gymType === "office" ? 1.5 : 2;
    const spaceMultiplier = space[0] / 100;
    const recommendation = Math.round(budget[0] * baseMultiplier * spaceMultiplier / 10000) * 10000;
    
    return {
      type: gymType,
      space: space[0],
      budget: budget[0],
      recommendation: recommendation,
      equipment: gymType === "home" ? "8-12 items" : gymType === "office" ? "15-20 items" : "30+ items"
    };
  };

  const result = calculateRecommendation();

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-olive-50 overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Geometric shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 border-2 border-gray-200 rounded-lg opacity-30 animate-spin" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-olive-200 rounded-full opacity-25 animate-bounce" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-olive-100 rounded-full opacity-40 animate-float"></div>
        <div className="absolute bottom-40 left-1/3 w-24 h-24 border-2 border-gray-200 rounded-lg opacity-20 animate-pulse" style={{ animationDuration: '3s' }}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, #808000 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Calculate Your
              <span className="text-olive-600 animate-pulse"> Dream Gym Cost</span>
            </h2>
            <p className="text-xl text-gray-600 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Get an instant estimate tailored to your space and needs
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-slide-up hover:shadow-2xl transition-all duration-500" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-6 w-6 text-olive-600 animate-bounce" style={{ animationDuration: '2s' }} />
                <span>Gym Cost Calculator</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Gym Type</label>
                    <Select value={gymType} onValueChange={setGymType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gym type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home Gym</SelectItem>
                        <SelectItem value="office">Office Gym</SelectItem>
                        <SelectItem value="commercial">Commercial Gym</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Space Available: {space[0]} sq ft
                    </label>
                    <Slider
                      value={space}
                      onValueChange={setSpace}
                      max={5000}
                      min={100}
                      step={50}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Budget: ₹{budget[0].toLocaleString()}
                    </label>
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      max={5000000}
                      min={25000}
                      step={25000}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-black to-olive-800 rounded-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Your Estimate</h3>
                  {result ? (
                    <div className="space-y-3">
                      <div className="text-3xl font-bold">
                        ₹{result.recommendation.toLocaleString()}
                      </div>
                      <div className="text-gray-300">
                        <p>Equipment Count: {result.equipment}</p>
                        <p>Space: {result.space} sq ft</p>
                        <p>Type: {result.type.charAt(0).toUpperCase() + result.type.slice(1)} Gym</p>
                      </div>
                      <Button 
                        variant="secondary" 
                        className="w-full mt-4 bg-white text-black hover:bg-gray-100"
                      >
                        Get Detailed Quote
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-300">Select gym type to see estimate</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GymCostCalculator;
