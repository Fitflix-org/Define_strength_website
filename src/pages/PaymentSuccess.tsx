import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as {
    orderId?: string;
    orderNumber?: string;
    total?: number;
    paymentMethod?: string;
    verified?: boolean;
    codOrder?: boolean;
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Payment Successful 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {state.orderNumber && <p>Order Number: <b>{state.orderNumber}</b></p>}
          {state.orderId && <p>Order ID: <code>{state.orderId}</code></p>}
          {state.total !== undefined && <p>Amount Paid: ₹{state.total?.toFixed(2)}</p>}
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
