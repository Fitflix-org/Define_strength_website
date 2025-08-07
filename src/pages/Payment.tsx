import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Wallet, 
  Building, 
  ArrowLeft, 
  Lock, 
  CheckCircle, 
  XCircle,
  Clock
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { orderService, ShippingAddress } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";

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
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  icon: React.ElementType;
  description: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const paymentData = location.state as PaymentData;
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Card details
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // UPI details
  const [upiId, setUpiId] = useState("");

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      name: "Credit/Debit Card",
      type: "card",
      icon: CreditCard,
      description: "Visa, Mastercard, American Express"
    },
    {
      id: "upi",
      name: "UPI",
      type: "upi",
      icon: Wallet,
      description: "Pay using UPI ID"
    },
    {
      id: "netbanking",
      name: "Net Banking",
      type: "netbanking",
      icon: Building,
      description: "Pay through your bank"
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      type: "wallet",
      icon: Wallet,
      description: "Paytm, PhonePe, Google Pay"
    }
  ];

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    // Redirect to checkout if no payment data
    if (!paymentData) {
      navigate("/checkout");
      return;
    }

    // Validate that payment data has required fields
    if (!paymentData.items || paymentData.items.length === 0) {
      navigate("/cart");
      return;
    }

    if (!paymentData.shippingAddress) {
      navigate("/checkout");
      return;
    }
  }, [paymentData, navigate, user, location]);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Validate payment details based on selected method
      if (selectedMethod === "card") {
        if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
          toast({
            title: "Missing Card Details",
            description: "Please fill in all card details",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
      } else if (selectedMethod === "upi") {
        if (!upiId) {
          toast({
            title: "Missing UPI ID",
            description: "Please enter your UPI ID",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
      }

      // Process payment with new payment service
      try {
        // Validate shipping address
        if (!paymentData.shippingAddress) {
          toast({
            title: "Error",
            description: "Shipping address is missing. Please go back to checkout.",
            variant: "destructive",
          });
          navigate("/checkout");
          return;
        }

        // Create order first
        const order = await orderService.createOrder(paymentData.shippingAddress);
        
        // Create a payment record
        const payment = await paymentService.createPayment({
          orderId: order.id,
          amount: paymentData.total * 1.18, // Including tax
          paymentMethod: selectedMethod as 'card' | 'upi' | 'netbanking' | 'wallet',
          cardLast4: selectedMethod === 'card' ? cardDetails.number?.slice(-4) : undefined,
          cardBrand: selectedMethod === 'card' ? paymentService.detectCardBrand(cardDetails.number) : undefined,
        });

        // In a real application, you would integrate with a payment gateway here
        // For this demo, we'll create a successful payment record
        await paymentService.updatePaymentStatus(payment.id, {
          status: 'COMPLETED',
          transactionId: `txn_${Date.now()}`,
          gatewayFee: paymentData.total * 0.025, // 2.5% gateway fee
        });

        // Clear cart on successful payment
        clearCart();
        
        // Navigate to success page
        navigate("/payment-success", {
          state: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            total: order.total,
            paymentMethod: selectedMethod,
            paymentId: payment.id,
            items: order.items,
            order: order
          }
        });

      } catch (error) {
        console.error("Payment error:", error);
        toast({
          title: "Payment Failed",
          description: "An error occurred while processing payment. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return cleaned;
    }
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Invalid Payment Session</h1>
          <Button onClick={() => navigate("/checkout")}>Return to Checkout</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/checkout")}
                className="flex items-center text-gray-600 hover:text-olive-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Checkout
              </button>
              <h1 className="text-2xl font-bold text-black">Payment</h1>
            </div>
            <div className="text-sm text-gray-600">
              Step 3 of 3
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-olive-600" />
                  Payment Method
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Your payment information is encrypted and secure
                </p>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <div
                        key={method.id}
                        className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <RadioGroupItem value={method.id} />
                        <IconComponent className="h-5 w-5 text-olive-600" />
                        <div className="flex-1">
                          <h4 className="font-medium text-black">{method.name}</h4>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails(prev => ({ 
                          ...prev, 
                          number: formatCardNumber(e.target.value) 
                        }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails(prev => ({ 
                          ...prev, 
                          name: e.target.value 
                        }))}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails(prev => ({ 
                            ...prev, 
                            expiry: formatExpiry(e.target.value) 
                          }))}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails(prev => ({ 
                            ...prev, 
                            cvv: e.target.value.replace(/\D/g, '') 
                          }))}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === "upi" && (
                  <div>
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                    />
                  </div>
                )}

                {selectedMethod === "netbanking" && (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto text-olive-600 mb-4" />
                    <h3 className="text-lg font-semibold text-black mb-2">Net Banking</h3>
                    <p className="text-gray-600">
                      You will be redirected to your bank's website to complete the payment
                    </p>
                  </div>
                )}

                {selectedMethod === "wallet" && (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 mx-auto text-olive-600 mb-4" />
                    <h3 className="text-lg font-semibold text-black mb-2">Digital Wallet</h3>
                    <p className="text-gray-600">
                      Choose your preferred wallet app to complete the payment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentData.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-black text-sm line-clamp-2">
                        {item.product.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-black">
                      ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-black">${paymentData.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-olive-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (18%):</span>
                    <span className="text-black">${(paymentData.total * 0.18).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-black">Total:</span>
                    <span className="text-olive-600">${(paymentData.total * 1.18).toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-olive-600 hover:bg-olive-700"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Pay $${(paymentData.total * 1.18).toFixed(2)}`
                  )}
                </Button>

                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <Lock className="h-3 w-3" />
                  <span>Your payment is secured with SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
