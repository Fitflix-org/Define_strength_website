import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface LocationState {
  orderId: string;
  amount: number;
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { orderId, amount } = location.state as LocationState;

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Added validation for order data before navigation
      if (!orderId || !amount) {
        toast({ title: 'Payment Error', description: 'Missing order details', variant: 'destructive' });
        navigate('/cart');
        return;
      }
      if (paymentMethod === "cod") {
        // ✅ Directly confirm COD
        navigate("/order-confirmation", {
          state: { orderId, status: "Cash on Delivery", amount },
        });
      } else {
        // ✅ Online payment flow → call your existing createOrder function
        const res = await createOrder(orderId, amount);
        if (res.success) {
          navigate("/order-confirmation", {
            state: { orderId, status: "Paid Online", amount },
          });
        } else {
          toast({
  title: "Payment Failed",
  description: "Please try again",
  variant: "destructive"
});
        }
      }
    } catch (err) {
      console.error(err);
      toast({
  title: "Payment Error",
  description: "An unexpected error occurred",
  variant: "destructive"
});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="mb-4">
            <Label className="mb-2 block">Payment Options</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod">Cash on Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online">Pay Online (UPI, Card, etc.)</Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            className="w-full mt-4"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Pay"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// NOTE: placeholder – you already have this function in your project
async function createOrder(orderId: string, amount: number) {
  // Call your backend API → Razorpay or other gateway
  return { success: true };
}
