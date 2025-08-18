import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
// Legacy component not used in new flow; keep a lightweight wrapper if needed
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

  const handlePayment = async () => onError(new Error('Deprecated component'));

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
