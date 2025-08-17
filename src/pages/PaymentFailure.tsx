import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, RefreshCw, ArrowLeft, Home, HelpCircle, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentFailureData {
  orderId: string;
  total: number;
  paymentMethod?: string;
  error?: string;
  guidance?: string;
  canRetry?: boolean;
}

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const failureData = location.state as PaymentFailureData;

  useEffect(() => {
    if (!failureData) {
      navigate("/");
      return;
    }

    // Show failure toast
    toast({
      title: "Payment Failed",
      description: "Your payment could not be processed. Please try again.",
      variant: "destructive",
    });
  }, [failureData, navigate, toast]);

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      card: "Credit/Debit Card",
      upi: "UPI",
      netbanking: "Net Banking",
      wallet: "Digital Wallet",
    };
    return methods[method] || method;
  };

  const handleRetryPayment = () => {
    // Navigate back to payment page with the same data
    navigate("/payment", { state: location.state });
  };
  
  // Determine if we should show the retry button
  const showRetryButton = failureData?.canRetry !== false;

  const commonFailureReasons = [
    {
      reason: "Insufficient funds",
      solution: "Please ensure you have sufficient balance in your account"
    },
    {
      reason: "Card expired",
      solution: "Please use a valid card with a future expiry date"
    },
    {
      reason: "Incorrect details",
      solution: "Please verify your card details and try again"
    },
    {
      reason: "Bank declined",
      solution: "Contact your bank for more information"
    },
    {
      reason: "Network timeout",
      solution: "Please check your internet connection and try again"
    }
  ];

  if (!failureData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Failure Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Payment Failed</h1>
          <p className="text-gray-600">
            We couldn't process your payment. Don't worry, no money has been charged.
          </p>
        </div>

        {/* Failure Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-red-600">
              <span>Payment Information</span>
              <span className="text-sm font-normal text-gray-600">
                Transaction #{failureData.orderId}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Attempted On</p>
                <p className="font-semibold text-black">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-semibold text-black">
                  {getPaymentMethodName(failureData.paymentMethod)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Amount</p>
                <p className="font-semibold text-black text-lg">
                  ${failureData.total.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Failed
                </span>
              </div>
            </div>

            {failureData.error && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-1">Failure Reason</h4>
                <p className="text-red-700 text-sm">{failureData.error}</p>
                {failureData.guidance && (
                  <div className="mt-2 p-2 bg-red-100 rounded">
                    <p className="text-red-800 text-sm font-medium">What to do:</p>
                    <p className="text-red-700 text-sm">{failureData.guidance}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Common Issues & Solutions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-olive-600" />
              Common Issues & Solutions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {commonFailureReasons.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-black text-sm">{item.reason}</h4>
                <p className="text-gray-600 text-sm mt-1">{item.solution}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {showRetryButton && (
            <Button
              onClick={handleRetryPayment}
              className="w-full bg-olive-600 hover:bg-olive-700"
              size="lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Payment
            </Button>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/checkout")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Checkout
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

        {/* Alternative Payment Methods */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Try a Different Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">
              If you're still having issues, try using a different payment method:
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 border rounded-lg text-center">
                <h4 className="font-semibold text-black">UPI</h4>
                <p className="text-gray-600">PhonePe, Google Pay, Paytm</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <h4 className="font-semibold text-black">Net Banking</h4>
                <p className="text-gray-600">All major banks supported</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <h4 className="font-semibold text-black">Digital Wallet</h4>
                <p className="text-gray-600">Wallet balance payments</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <h4 className="font-semibold text-black">Debit Card</h4>
                <p className="text-gray-600">Try a different card</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2 text-center">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <Phone className="h-4 w-4" />
              <span>Call us: +91 123 456 7890</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <Mail className="h-4 w-4" />
              <span>Email: support@fitspaceforge.com</span>
            </div>
          </div>
          <p className="text-blue-600 text-center mt-2 text-xs">
            Our support team is available 24/7 to help you with payment issues
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
