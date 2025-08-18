import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orderService, Order } from "@/services/orderService";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const state = (location.state || {}) as {
    orderId?: string;
    orderNumber?: string;
    total?: number;
    paymentMethod?: string;
    verified?: boolean;
    codOrder?: boolean;
  };

  // Fetch order details if we only have orderId (or nothing)
  useEffect(() => {
    const load = async () => {
      try {
        if (state.orderId && !state.orderNumber) {
          const order = await orderService.getOrder(state.orderId);
          setOrderDetails(order);
        }
      } catch (error: any) {
        console.error('Failed to fetch order details on success page:', error);
        toast({ title: 'Note', description: 'Order details not available yet. You can see it in Orders.', });
      }
    };
    load();
  }, [state.orderId, state.orderNumber, toast]);

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Payment Successful 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(state.orderNumber || orderDetails?.orderNumber) && (
            <p>Order Number: <b>{state.orderNumber || orderDetails?.orderNumber}</b></p>
          )}
          {(state.orderId || orderDetails?.id) && (
            <p>Order ID: <code>{state.orderId || orderDetails?.id}</code></p>
          )}
          {(state.total !== undefined || orderDetails?.total !== undefined) && (
            <p>Amount Paid: ₹{(state.total ?? orderDetails?.total ?? 0).toFixed(2)}</p>
          )}
          {state.paymentMethod && <p>Method: {state.paymentMethod.toUpperCase()}</p>}
          {state.verified && <p>Verification: ✅ Verified</p>}
          {state.codOrder && <p>Payment on Delivery: ✅ Confirmed</p>}
          <div className="flex gap-3 pt-4">
            <Button onClick={() => navigate("/orders")}>Go to My Orders</Button>
            <Button variant="outline" onClick={() => navigate("/")}>Continue Shopping</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
