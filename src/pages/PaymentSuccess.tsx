import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Truck, Home, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface PaymentSuccessData {
  orderId: string;
  orderNumber?: string;
  total: number;
  paymentMethod: string;
  items?: CartItem[];
  codOrder?: boolean;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const successData = location.state as PaymentSuccessData;

  useEffect(() => {
    if (!successData) {
      navigate("/");
      return;
    }

    // Show success toast
    const isCoD = successData.codOrder || successData.paymentMethod === "cod";
    toast({
      title: isCoD ? "Order Placed Successfully!" : "Payment Successful!",
      description: `Order ${successData.orderNumber || successData.orderId} has been placed successfully.`,
    });

    // Store order in localStorage (mock order management)
    const existingOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
    const newOrder = {
      id: successData.orderId,
      date: new Date().toISOString(),
      total: successData.total,
      paymentMethod: successData.paymentMethod,
      items: successData.items,
      status: "placed",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      trackingSteps: [
        {
          status: "placed",
          label: "Order Placed",
          completed: true,
          timestamp: new Date().toISOString(),
        },
        {
          status: "shipping",
          label: "Shipped",
          completed: false,
          timestamp: null,
        },
        {
          status: "out-for-delivery",
          label: "Out for Delivery",
          completed: false,
          timestamp: null,
        },
        {
          status: "delivered",
          label: "Delivered",
          completed: false,
          timestamp: null,
        },
      ],
    };
    existingOrders.push(newOrder);
    localStorage.setItem("user_orders", JSON.stringify(existingOrders));
  }, [successData, navigate, toast]);

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      card: "Credit/Debit Card",
      upi: "UPI",
      netbanking: "Net Banking",
      wallet: "Digital Wallet",
      cod: "Cash on Delivery",
      razorpay: "Online Payment",
    };
    return methods[method] || method;
  };

  if (!successData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">
            {successData.codOrder ? "Order Placed Successfully!" : "Payment Successful!"}
          </h1>
          <p className="text-gray-600">
            {successData.codOrder 
              ? "Thank you for your order. Your order has been placed and will be delivered soon."
              : "Thank you for your order. Your payment has been processed successfully."
            }
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order Confirmation</span>
              <span className="text-sm font-normal text-gray-600">
                Order #{successData.orderNumber || successData.orderId}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order Date</p>
                <p className="font-semibold text-black">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-semibold text-black">
                  {getPaymentMethodName(successData.paymentMethod)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="font-semibold text-olive-600 text-lg">
                  ${successData.total.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Payment Status</p>
                <div className="flex items-center space-x-2">
                  {successData.codOrder ? (
                    <>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Pending
                      </span>
                      <span className="text-xs text-gray-500">Pay on delivery</span>
                    </>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Paid
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-gray-600">Estimated Delivery</p>
                <p className="font-semibold text-black">
                  {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              {successData.codOrder && (
                <div className="col-span-2 pt-3 border-t">
                  <p className="text-gray-600 text-sm">Amount Due on Delivery</p>
                  <p className="font-bold text-red-600 text-xl">
                    ${successData.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Please keep exact change ready for the delivery agent
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Order Items */}
            <div className="space-y-3">
              <h4 className="font-semibold text-black">Order Items</h4>
              {successData.items && successData.items.length > 0 ? (
                successData.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-black text-sm line-clamp-2">
                        {item.product.name}
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-black">
                      ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm">Order items information not available.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-olive-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-olive-600" />
              </div>
              <div>
                <h4 className="font-semibold text-black">Order Confirmation</h4>
                <p className="text-gray-600 text-sm">
                  You'll receive an email confirmation shortly with your order details.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Truck className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <h4 className="font-semibold text-black">Order Processing</h4>
                <p className="text-gray-600 text-sm">
                  We'll prepare your order and send you tracking information once it ships.
                </p>
              </div>
            </div>
            {successData.codOrder && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-xs">₹</span>
                </div>
                <div>
                  <h4 className="font-semibold text-black">Cash on Delivery</h4>
                  <p className="text-gray-600 text-sm">
                    Please keep <strong>${successData.total.toFixed(2)}</strong> ready for payment when the delivery agent arrives. We recommend having exact change.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate("/orders")}
              className="bg-olive-600 hover:bg-olive-700"
            >
              <Truck className="h-4 w-4 mr-2" />
              Track Order
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="border-olive-600 text-olive-600 hover:bg-olive-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/shop")}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-blue-700 text-sm">
            Need help with your order? Contact our support team at{" "}
            <a href="mailto:support@fitspaceforge.com" className="font-semibold underline">
              support@fitspaceforge.com
            </a>{" "}
            or call us at{" "}
            <a href="tel:+911234567890" className="font-semibold underline">
              +91 123 456 7890
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
