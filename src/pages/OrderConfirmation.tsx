import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';

interface OrderConfirmationData {
  orderId: string;
  status: string;
  amount: number;
}

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { clearCart } = useCart();
  
  // Get order data from location state
  const orderData = location.state as OrderConfirmationData;
  
  useEffect(() => {
    // Check if we have valid order data
    if (!orderData || !orderData.orderId) {
      toast({
        title: 'Error',
        description: 'Order information not found. Please check your orders.',
        variant: 'destructive',
      });
      navigate('/orders');
      return;
    }
    
    // Clear the cart on successful order
    clearCart();
    
    // Show success toast
    toast({
      title: 'Order Confirmed',
      description: `Your order #${orderData.orderId} has been confirmed.`,
    });
  }, []);
  
  if (!orderData || !orderData.orderId) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="shadow-lg border-green-100">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Order Confirmed!</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Order ID:</div>
                  <div className="font-medium text-gray-900">{orderData.orderId}</div>
                  
                  <div className="text-gray-600">Payment Method:</div>
                  <div className="font-medium text-gray-900">{orderData.status}</div>
                  
                  <div className="text-gray-600">Amount:</div>
                  <div className="font-medium text-gray-900">₹{orderData.amount ? Number(orderData.amount).toFixed(2) : '0.00'}</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">What's Next?</h3>
                <p className="text-sm text-gray-600">
                  We've received your order and will begin processing it right away. 
                  You'll receive an email confirmation shortly.
                </p>
                
                <div className="flex flex-col space-y-3">
                  <Button 
                    onClick={() => navigate('/orders')} 
                    className="w-full bg-olive-600 hover:bg-olive-700"
                  >
                    View Your Orders
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/shop')} 
                    className="w-full border-olive-600 text-olive-600 hover:bg-olive-50"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}