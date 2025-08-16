import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/a3a11a59-6ec9-4515-9248-8ddf9c36281e.png" 
                alt="Define Strength" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-300 mb-4">
              Professional gym equipment and expert consultancy for homes, offices, and commercial fitness centers.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              {[
                { name: "Shop Equipment", href: "/shop" },
                { name: "Consultancy Services", href: "/consultancy" },
                { name: "Home Gym Solutions", href: "/solutions/home" },
                { name: "Commercial Setup", href: "/solutions/commercial" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-gray-300 text-sm  hover:text-[#eded77] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Equipment Categories</h3>
            <ul className="space-y-1">
              {[
                "Strength Equipment",
                "Cardio Machines",
                "Free Weights",
                "Accessories",
                "Gym Flooring",
                "Equipment Bundles",
              ].map((category) => (
                <li key={category}>
                  <Link 
                    to={`/shop?category=${category.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-300 text-sm hover:text-[#eded77] transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Get In Touch</h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-sm space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>definestrengthpvtltd@gmail.com</span>
              </div>
              <div className="flex items-center text-sm space-x-2 text-gray-300">
                <MapPin className="h-12 w-12" />
                <span>90/2, Kishan Icon, Next to Ironhill, Above Barkaaz, Marathahalli Colony, Bangalore, Karnataka, India, 560037</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Newsletter</h4>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button variant="cta" size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-sm text-center text-gray-300">
          <p>&copy; 2024 Define Strength. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;