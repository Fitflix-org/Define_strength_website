import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  CreditCard as EMI,
} from "lucide-react";
import { razorpayService, RazorpayService } from "@/services/razorpayService";
import { useToast } from "@/hooks/use-toast";

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  currency?: string;
  customerInfo?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (paymentData: any) => void;
  onError: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

const paymentMethodIcons = {
  card: CreditCard,
  upi: Smartphone,
  netbanking: Building2,
  wallet: Wallet,
  emi: EMI,
};

export const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  orderId,
  amount,
  currency = "INR",
  customerInfo,
  onSuccess,
  onError,
  disabled = false,
  className = "",
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if Razorpay is available
  const isRazorpayAvailable = razorpayService.isAvailable();

  const handlePayment = async () => {
    if (!isRazorpayAvailable) {
      const errorMsg = "Payment gateway is not properly configured";
      setError(errorMsg);
      onError(new Error(errorMsg));
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const paymentResult = await razorpayService.processPayment({
        orderId,
        amount: RazorpayService.formatAmountToPaise(amount),
        currency,
        customerInfo,
      });

      if (paymentResult.success) {
        toast({
          title: "Payment Successful!",
          description: paymentResult.message, // "Payment verified and completed successfully"
        });
        onSuccess(paymentResult);
      } else {
        throw new Error(paymentResult.message || "Payment verification failed");
      }
    } catch (error: any) {
      console.error("Payment failed:", error);
      const errorMessage = error.message || "Payment failed. Please try again.";
      setError(errorMessage);

      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });

      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  const supportedMethods = razorpayService.getSupportedPaymentMethods();

  if (!isRazorpayAvailable) {
    return (
      <Alert className="mb-4">
        <AlertDescription>
          Payment gateway is not configured. Please contact support.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Secure Payment
        </CardTitle>
        <CardDescription>
          Pay securely using Razorpay - India's most trusted payment gateway
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Amount Display */}
        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">Total Amount:</span>
          <span className="text-lg font-bold">{formatCurrency(amount)}</span>
        </div>

        {/* Supported Payment Methods */}
        <div>
          <p className="text-sm font-medium mb-2">Supported Payment Methods:</p>
          <div className="flex flex-wrap gap-2">
            {supportedMethods.map((method) => {
              const IconComponent =
                paymentMethodIcons[
                  method.id as keyof typeof paymentMethodIcons
                ];
              return (
                <Badge
                  key={method.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {IconComponent && <IconComponent className="h-3 w-3" />}
                  {method.name}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Customer Info Display */}
        {customerInfo && (
          <div className="text-sm text-muted-foreground">
            <p>Payment will be made for: {customerInfo.name}</p>
            {customerInfo.email && <p>Email: {customerInfo.email}</p>}
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={disabled || isProcessing}
          size="lg"
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay {formatCurrency(amount)}
            </>
          )}
        </Button>

        {/* Security Notice */}
        <div className="text-xs text-muted-foreground text-center">
          <p>🔒 Your payment information is encrypted and secure</p>
          <p>Powered by Razorpay - PCI DSS Level 1 Compliant</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RazorpayCheckout;
