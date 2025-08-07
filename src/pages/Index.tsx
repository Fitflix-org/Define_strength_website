import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import SolutionsSection from "@/components/home/SolutionsSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import PromoBanner from "@/components/home/PromoBanner";
import TrustBadges from "@/components/home/TrustBadges";
import GymCostCalculator from "@/components/home/GymCostCalculator";
import FAQSection from "@/components/home/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <PromoBanner />
      <HeroSection />
      <TrustBadges />
      <ServicesSection />
      <GymCostCalculator />
      <SolutionsSection />
      <FeaturedProducts />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default Index;
