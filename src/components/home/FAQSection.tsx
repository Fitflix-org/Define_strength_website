import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, HelpCircle, Clock, Shield, Truck } from "lucide-react";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      category: "General",
      icon: <HelpCircle className="h-5 w-5" />,
      color: "bg-olive-600",
      questions: [
        {
          question: "How long does it take to set up a complete gym?",
          answer: "Typically 7-14 days depending on gym size. Home gyms: 3-5 days, Office gyms: 5-10 days, Commercial gyms: 10-21 days. We provide detailed timeline during consultation."
        },
        {
          question: "Do you provide equipment warranty and maintenance?",
          answer: "Yes! All equipment comes with 7-year comprehensive warranty. We offer annual maintenance contracts with 24/7 support, free part replacement, and priority service calls."
        },
        {
          question: "Can I customize equipment selection for my space?",
          answer: "Absolutely! Our designers work with you to select equipment that fits your space, budget, and fitness goals. We offer 50+ premium brands with customization options."
        }
      ]
    },
    {
      category: "Pricing",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-black",
      questions: [
        {
          question: "What's included in the gym setup cost?",
          answer: "Complete package includes: Equipment selection & sourcing, Professional installation, Space planning & design, 1-year maintenance, Training for gym use, and post-installation support."
        },
        {
          question: "Do you offer financing or EMI options?",
          answer: "Yes! We offer flexible payment plans: 0% EMI for 12 months, Equipment leasing options, Phased delivery payments, and Corporate payment terms for businesses."
        },
        {
          question: "Are there any hidden costs?",
          answer: "No hidden costs! Our quotes include everything: equipment, delivery, installation, training. Only additional costs are for special flooring requests or electrical modifications."
        }
      ]
    },
    {
      category: "Services",
      icon: <Shield className="h-5 w-5" />,
      color: "bg-olive-700",
      questions: [
        {
          question: "Do you provide gym design and space planning?",
          answer: "Yes! Our certified designers create 3D layouts, optimize space utilization, ensure proper ventilation, plan electrical requirements, and design for maximum functionality."
        },
        {
          question: "What post-installation support do you provide?",
          answer: "Comprehensive support: 24/7 helpline, Quarterly maintenance visits, Emergency repair service, Equipment replacement assistance, and Training for new staff members."
        },
        {
          question: "Can you help with gym certification and compliance?",
          answer: "Absolutely! We assist with: Safety certifications, Fire safety compliance, Insurance documentation, Equipment certifications, and Local authority approvals."
        }
      ]
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gray-100 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-olive-100 rounded-lg opacity-30 animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-gray-100 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-olive-50 rounded-lg opacity-20 animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        
        {/* Subtle gradient overlays */}
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-gray-50/30 to-transparent animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-olive-50/30 to-transparent animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 animate-slide-up">
              Frequently Asked
              <span className="text-olive-600 animate-pulse"> Questions</span>
            </h2>
            <p className="text-xl text-gray-600 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Everything you need to know about our gym setup services
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((category, categoryIndex) => (
              <Card 
                key={categoryIndex} 
                className="overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up"
                style={{ animationDelay: `${categoryIndex * 0.1}s` }}
              >
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b hover:from-olive-50 hover:to-olive-100 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.color} text-white transform hover:rotate-12 transition-transform duration-300 hover:scale-110`}>
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-black">{category.category}</h3>
                    <Badge variant="secondary" className="animate-pulse">{category.questions.length} questions</Badge>
                  </div>
                </div>
                <CardContent className="p-0">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 10 + faqIndex;
                    const isOpen = openFAQ === globalIndex;
                    
                    return (
                      <div key={faqIndex} className="border-b last:border-b-0">
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full text-left p-6 hover:bg-gradient-to-r hover:from-olive-50 hover:to-olive-100 transition-all duration-300 flex justify-between items-center group"
                        >
                          <span className="font-medium text-black pr-4 group-hover:text-olive-700 transition-colors">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0 transform group-hover:text-olive-600 transition-all duration-300 group-hover:scale-110" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0 transform group-hover:text-olive-600 transition-all duration-300 group-hover:scale-110" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6 text-gray-600 leading-relaxed animate-slide-down">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
                

          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Card className="bg-gradient-to-r from-black to-olive-800 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Truck className="h-8 w-8 animate-bounce" />
                  <div>
                    <h3 className="text-xl font-bold">Still have questions?</h3>
                    <p className="text-gray-300">Get instant answers from our gym experts</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    Chat with Expert
                  </button>
                  <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                    Schedule Call
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
