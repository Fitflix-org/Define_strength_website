import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, Smartphone, Building2, Wallet, CreditCard as EMI } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  currency?: string;
  razorpayOrderId: string;
  publicKey: string;
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
  razorpayOrderId,
  publicKey,
  customerInfo,
  onSuccess,
  onError,
  disabled = false,
  className = "",
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) throw new Error('Failed to load Razorpay SDK');

      const options: any = {
        key: publicKey,
        amount: Math.round(amount * 100),
        currency,
        name: 'Define Strength',
        description: `Order ${orderId}`,
        order_id: razorpayOrderId,
        notes: { order_id: orderId },
        handler: (response: any) => onSuccess(response),
        modal: { ondismiss: () => onError(new Error('Payment cancelled by user')) },
        prefill: customerInfo,
        theme: { color: '#000000' },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', async (resp: any) => {
        try {
          await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/orders/payment-failed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ orderId, razorpay_order_id: resp?.error?.metadata?.order_id, error: resp?.error })
          });
        } catch {}
        onError(new Error(resp?.error?.description || 'Payment failed'));
      });
      razorpay.open();
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

  const supportedMethods = [
    { id: 'card', name: 'Credit/Debit Card' },
    { id: 'upi', name: 'UPI' },
    { id: 'netbanking', name: 'Net Banking' },
    { id: 'wallet', name: 'Wallet' },
    { id: 'emi', name: 'EMI' },
  ];

  // SDK is loaded lazily on click; no pre-check needed

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
