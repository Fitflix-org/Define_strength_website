import { Button } from "@/components/ui/button";
import { X, Zap } from "lucide-react";
import { useState } from "react";

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-black via-olive-800 to-olive-600 text-white py-3 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <Zap className="h-5 w-5 animate-pulse" />
          <span className="font-bold text-sm md:text-base">
            🔥 LIMITED TIME: Get 20% OFF Your First Equipment Purchase + FREE Consultation
          </span>
          <span className="hidden md:inline text-sm opacity-90">
            Ends March 15th | Use code: STRENGTH20
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-black hover:bg-gray-100 font-bold text-xs"
          >
            Claim Offer
          </Button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
