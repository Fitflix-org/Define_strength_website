import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { razorpayService, RazorpayService } from '@/services/razorpayService';
import { useToast } from '@/hooks/use-toast';

interface PaymentButtonProps {
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
  children?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  orderId,
  amount,
  currency = 'INR',
  customerInfo,
  onSuccess,
  onError,
  disabled = false,
  children,
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!razorpayService.isAvailable()) {
      const error = new Error('Payment gateway not configured');
      onError(error);
      return;
    }

    setIsProcessing(true);

    try {
      const paymentResult = await razorpayService.processPayment({
        orderId,
        amount: RazorpayService.formatAmountToPaise(amount),
        currency,
        customerInfo
      });

      if (paymentResult.verified && paymentResult.status === 'success') {
        toast({
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully.',
        });
        onSuccess(paymentResult);
      } else {
        throw new Error(paymentResult.message || 'Payment verification failed');
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      
      toast({
        title: 'Payment Failed',
        description: error.message || 'Payment failed. Please try again.',
        variant: 'destructive',
      });
      
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isProcessing}
      variant={variant}
      size={size}
      className={className}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {children || (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay {formatCurrency(amount)}
            </>
          )}
        </>
      )}
    </Button>
  );
};

export default PaymentButton;
