import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import ShopLanding from "./pages/ShopLanding";
import ShopProducts from "./pages/ShopProducts";
import ShopByCategory from "./pages/ShopByCategory";
import Consultancy from "./pages/Consultancy";
import Solutions from "./pages/Solutions";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import OrderConfirmation from "./pages/OrderConfirmation";
import Wishlist from "./pages/Wishlist";
import WishlistAnalytics from "./pages/WishlistAnalytics";
// import Support from "./pages/Support"; // Temporarily removed - admin-only feature
import AuthTest from "./pages/AuthTest";
import APITester from "./pages/APITester";
import PaymentFlowDebugger from "./debug/PaymentFlowDebugger";
import EnvironmentDebugger from "./debug/EnvironmentDebugger";
import PaymentFlowTester from "./debug/PaymentFlowTester";
import FrontendBackendDebugger from "./debug/FrontendBackendDebugger";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<ShopLanding />} />
                  <Route path="/shop/products" element={<ShopProducts />} />
                  <Route path="/shop/categories" element={<ShopByCategory />} />
                  <Route path="/consultancy" element={<Consultancy />} />
                  <Route path="/solutions" element={<Solutions />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth-test" element={<AuthTest />} />
                  <Route path="/api-test" element={<APITester />} />
                  <Route path="/payment-debug" element={<PaymentFlowDebugger />} />
                  <Route path="/env-debug" element={<EnvironmentDebugger />} />
                  <Route path="/payment-flow-test" element={<PaymentFlowTester />} />
                  <Route path="/integration-debug" element={<FrontendBackendDebugger />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  
                  {/* Protected Routes */}
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/payment" element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  } />
                  <Route path="/payment-success" element={
                    <ProtectedRoute>
                      <PaymentSuccess />
                    </ProtectedRoute>
                  } />
                  <Route path="/order-confirmation" element={
                    <ProtectedRoute>
                      <OrderConfirmation />
                    </ProtectedRoute>
                  } />
                  <Route path="/payment-failure" element={
                    <ProtectedRoute>
                      <PaymentFailure />
                    </ProtectedRoute>
                  } />
                  <Route path="/wishlist" element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  } />
                  <Route path="/wishlist/analytics" element={
                    <ProtectedRoute>
                      <WishlistAnalytics />
                    </ProtectedRoute>
                  } />
                  {/* Support route temporarily removed - admin-only feature */}
                  {/* TODO: Implement role-based access control for admin features */}
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
