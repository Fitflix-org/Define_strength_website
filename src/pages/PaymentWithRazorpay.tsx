import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Smartphone,
  Building, 
  Wallet, 
  ArrowLeft, 
  Lock, 
  CheckCircle,
  Clock
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { orderService, ShippingAddress } from "@/services/orderService";
import RazorpayCheckout from "@/components/payment/RazorpayCheckout";

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    images: string[];
  };
  quantity: number;
}

interface PaymentData {
  addressId: string;
  orderNotes: string;
  total: number;
  items: CartItem[];
  shippingAddress?: ShippingAddress;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'razorpay' | 'cod';
  icon: React.ElementType;
  description: string;
  enabled: boolean;
}

const PaymentWithRazorpay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedMethod, setSelectedMethod] = useState<string>("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);

  const paymentData = location.state as PaymentData;

  // Redirect if no payment data
  useEffect(() => {
    if (!paymentData) {
      toast({
        title: "Error",
        description: "Payment data not found. Redirecting to checkout.",
        variant: "destructive",
      });
      navigate("/checkout");
    }
  }, [paymentData, navigate, toast]);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "razorpay",
      name: "Online Payment",
      type: "razorpay",
      icon: CreditCard,
      description: "Pay securely with Credit/Debit Card, UPI, Net Banking, or Wallet",
      enabled: true,
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      type: "cod",
      icon: Clock,
      description: "Pay when your order is delivered (₹50 extra charge)",
      enabled: true,
    }
  ];

  // Calculate totals
  const subtotal = paymentData?.total || 0;
  const tax = subtotal * 0.18; // 18% GST
  const codCharge = selectedMethod === 'cod' ? 50 : 0;
  const finalTotal = subtotal + tax + codCharge;

  const handlePaymentSuccess = async (razorpayResponse: any) => {
    try {
      setIsProcessing(true);
      
      // Clear cart on successful payment
      clearCart();
      
      // Navigate to success page
      navigate("/payment-success", {
        state: {
          orderId: orderCreated?.id || razorpayResponse.order_id,
          orderNumber: orderCreated?.orderNumber || `ORD-${Date.now()}`,
          total: finalTotal,
          paymentMethod: "razorpay",
          paymentId: razorpayResponse.payment_id,
          razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        }
      });
    } catch (error) {
      console.error('Error handling payment success:', error);
      toast({
        title: "Error",
        description: "Payment successful but order processing failed. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    navigate("/payment-failure", {
      state: {
        orderId: orderCreated?.id || 'unknown',
        error: error.message,
        total: finalTotal,
      }
    });
  };

  const handleCODOrder = async () => {
    if (!paymentData.shippingAddress) {
      toast({
        title: "Error",
        description: "Shipping address is missing. Please go back to checkout.",
        variant: "destructive",
      });
      navigate("/checkout");
      return;
    }

    setIsProcessing(true);
    try {
      // Create order with COD
      const order = await orderService.createOrder(paymentData.shippingAddress);
      
      // Clear cart
      clearCart();
      
      // Navigate to success page
      navigate("/payment-success", {
        state: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          total: finalTotal,
          paymentMethod: "cod",
          codOrder: true,
        }
      });
    } catch (error: any) {
      console.error('COD order creation failed:', error);
      toast({
        title: "Order Failed",
        description: error.message || "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const createOrderForRazorpay = async () => {
    if (!paymentData.shippingAddress) {
      toast({
        title: "Error",
        description: "Shipping address is missing. Please go back to checkout.",
        variant: "destructive",
      });
      navigate("/checkout");
      return null;
    }

    try {
      const order = await orderService.createOrder(paymentData.shippingAddress);
      setOrderCreated(order);
      return order;
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast({
        title: "Order Creation Failed",
        description: error.message || "Failed to create order. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  if (!paymentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/checkout")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Checkout
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Payment</h1>
            <p className="text-muted-foreground">Choose your preferred payment method</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedMethod}
                  onValueChange={setSelectedMethod}
                  className="space-y-4"
                >
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors ${
                          selectedMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        } ${!method.enabled ? "opacity-50" : ""}`}
                      >
                        <RadioGroupItem
                          value={method.id}
                          id={method.id}
                          disabled={!method.enabled}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={method.id}
                            className="flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <IconComponent className="h-5 w-5" />
                            {method.name}
                            {method.id === 'cod' && (
                              <Badge variant="outline">+₹50</Badge>
                            )}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Razorpay Payment Component */}
            {selectedMethod === "razorpay" && (
              <div>
                <RazorpayCheckout
                  orderId={orderCreated?.id || `temp-${Date.now()}`}
                  amount={finalTotal}
                  currency="INR"
                  customerInfo={{
                    name: user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.email,
                    email: user?.email,
                    contact: user?.phone,
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  disabled={isProcessing}
                />
                {!orderCreated && (
                  <Button 
                    onClick={createOrderForRazorpay}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    Create Order for Payment
                  </Button>
                )}
              </div>
            )}

            {/* COD Button */}
            {selectedMethod === "cod" && (
              <Card>
                <CardContent className="pt-6">
                  <Button
                    onClick={handleCODOrder}
                    disabled={isProcessing}
                    size="lg"
                    className="w-full"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Place COD Order - ₹{finalTotal.toFixed(2)}
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Additional ₹50 COD charges will be collected at delivery
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {paymentData.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ₹{(item.product.salePrice || item.product.price).toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₹{((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  {codCharge > 0 && (
                    <div className="flex justify-between">
                      <span>COD Charges</span>
                      <span>₹{codCharge.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" />
                    Secure Payment
                  </p>
                  <p>Your payment information is encrypted and secure</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentWithRazorpay;
