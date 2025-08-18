import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import RazorpayCheckout from "@/components/payment/RazorpayCheckout";
import { orderService, ShippingAddress } from "@/services/orderService";

interface LocationState {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: ShippingAddress;
  total: number;
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = (location.state || {}) as any;

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<null | { order: any; razorpay: any }>(null);

  useEffect(() => {
    if (!state?.order || !state?.razorpay) {
      toast({ title: 'Payment Error', description: 'Missing order details', variant: 'destructive' });
      navigate('/checkout');
    } else {
      setCreated(state);
    }
  }, [state, navigate, toast]);

  const createOrder = async () => {
    setLoading(true);
    try {
      const res = await orderService.createOrder({
        items: state.items,
        shippingAddress: state.shippingAddress,
      });
      setCreated(res);
      toast({ title: 'Order created', description: `Order #${res.order.orderNumber}` });
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Order Error', description: e.message || 'Failed to create order', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = async (rp: any) => {
    try {
      await orderService.verifyPayment({
        razorpay_order_id: rp.razorpay_order_id,
        razorpay_payment_id: rp.razorpay_payment_id,
        razorpay_signature: rp.razorpay_signature,
        orderId: created?.order.id,
      });
      navigate('/payment-success', { state: { orderId: created?.order.id, orderNumber: created?.order.orderNumber, total: created?.order.total, paymentMethod: 'razorpay', verified: true } });
    } catch (err: any) {
      toast({ title: 'Verification Failed', description: err.message || 'Could not verify payment', variant: 'destructive' });
      navigate('/payment-failure', { state: { orderId: created?.order.id, total: created?.order.total, paymentMethod: 'razorpay', error: err.message } });
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="mb-4">
            <Label className="mb-2 block">Payment Options</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online">Pay Online (Razorpay)</Label>
              </div>
              <div className="flex items-center space-x-2 opacity-50">
                <RadioGroupItem value="cod" id="cod" disabled />
                <Label htmlFor="cod">Cash on Delivery (disabled)</Label>
              </div>
            </RadioGroup>
          </div>

          {created ? (
            <RazorpayCheckout
              orderId={created.order.id}
              amount={created.order.total}
              currency="INR"
              razorpayOrderId={created.razorpay.orderId}
              publicKey={created.razorpay.key}
              onSuccess={handleSuccess}
              onError={(e) => navigate('/payment-failure', { state: { orderId: created.order.id, total: created.order.total, paymentMethod: 'razorpay', error: e.message } })}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
