import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Menu, ShoppingCart, Phone, User, LogOut, Package, Heart, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemsCount } = useCart();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Consultancy", href: "/consultancy" },
    { name: "Solutions", href: "/solutions" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleConsultationClick = () => {
    navigate("/contact");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActivePage = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/90">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/a3a11a59-6ec9-4515-9248-8ddf9c36281e.png" 
            alt="Define Strength" 
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-medium cursor-pointer transition-colors hover:text-primary ${
                isActivePage(item.href) ? "text-primary" : "text-gray-300 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleCartClick} className="text-gray-300 hover:text-white hover:bg-gray-800">
            <ShoppingCart className="h-4 w-4" />
            Cart ({itemsCount})
          </Button>

          {/* Wishlist Icon (for authenticated users) */}
          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/wishlist')} className="text-gray-300 hover:text-white hover:bg-gray-800">
              <Heart className="h-4 w-4" />
              Wishlist
            </Button>
          )}
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <User className="h-4 w-4" />
                  {user?.firstName || 'Account'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/orders')}>
                  <Package className="h-4 w-4 mr-2" />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </DropdownMenuItem>
                {/* Support menu item temporarily removed - admin-only feature */}
                {/* TODO: Add role-based access control for admin features */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-2">
              <Button variant="ghost" size="sm" asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="text-black border-gray-600 hover:text-white hover:bg-gray-800">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
          
          <Button variant="cta" size="sm" onClick={handleConsultationClick}>
            <Phone className="h-4 w-4" />
            Book Consultation
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <VisuallyHidden asChild>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>
              <VisuallyHidden asChild>
                <SheetDescription>
                  Main navigation menu with links to different sections of the website
                </SheetDescription>
              </VisuallyHidden>
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-lg font-medium transition-colors hover:text-primary ${
                    isActivePage(item.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t pt-4 space-y-3">
                <Button className="w-full" variant="outline" onClick={handleCartClick}>
                  <ShoppingCart className="h-4 w-4" />
                  Cart ({itemsCount})
                </Button>
                
                {isAuthenticated ? (
                  <>
                    <Button className="w-full" variant="outline" onClick={() => navigate('/orders')}>
                      <Package className="h-4 w-4" />
                      My Orders
                    </Button>
                    <Button className="w-full" variant="outline" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      Sign Out ({user?.firstName})
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full" variant="outline" asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button className="w-full" variant="outline" asChild>
                      <Link to="/register">Register</Link>
                    </Button>
                  </>
                )}
                
                <Button className="w-full" variant="cta" onClick={handleConsultationClick}>
                  <Phone className="h-4 w-4" />
                  Book Consultation
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;