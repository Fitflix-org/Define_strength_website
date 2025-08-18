import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingBag,
  ArrowRight,
  Download,
  RefreshCw,
  AlertCircle,
  Loader2,
  Clock,
  Truck,
  CheckCircle,
  Package
} from "lucide-react";
import { getStatusColor, getStatusIcon } from "@/lib/orderUtils.tsx";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { orderService, Order as BackendOrder } from "@/services/orderService";

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    images: string[];
  };
  quantity: number;
}

interface TrackingStep {
  status: string;
  label: string;
  completed: boolean;
  timestamp: string | null;
}

// Extended order interface for frontend with tracking
interface Order extends BackendOrder {
  estimatedDelivery?: string;
  trackingSteps?: TrackingStep[];
}

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [retryingPayments, setRetryingPayments] = useState<Set<string>>(new Set());
  const [orderToRetry, setOrderToRetry] = useState<Order | null>(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use real API service - fetch orders for current user
      // Backend requires userId in path; page can be extended to pass actual user.id
      const backendOrders = await orderService.getUserOrders('me');
      
      const ordersWithMeta = backendOrders.map(order => ({
        ...order,
        estimatedDelivery: order.createdAt ? 
          new Date(Date.parse(order.createdAt as any) + 7 * 24 * 60 * 60 * 1000).toISOString() : 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      setOrders(ordersWithMeta);
    } catch (error) {
      console.error("Failed to load orders:", error);
      
      // Fallback to localStorage for demo purposes
      try {
        const userOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
        setOrders(userOrders);
      } catch (fallbackError) {
        console.error("Fallback failed:", fallbackError);
        setOrders([]);
      }
      
      toast({
        title: "Error",
        description: "Failed to load orders from server, showing cached orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    loadOrders();
  }, [isAuthenticated, navigate, loadOrders]);

  const handleRetryClick = (order: Order) => setOrderToRetry(order);

  const retryPayment = async (orderId: string) => {
    setRetryingPayments(prev => new Set(prev).add(orderId));
    
    try {
      const response = await orderService.retryOrderPayment(orderId);
      if (response.success) {
        navigate('/payment', { state: response });
      } else {
        toast({
          title: "Payment Retry Failed",
          description: "Failed to initiate payment retry.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Payment retry failed:", error);
      toast({
        title: "Retry Failed",
        description: error.response?.data?.message || "Failed to retry payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRetryingPayments(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const confirmRetryPayment = async () => {
    if (!orderToRetry) return;
    setRetryingPayments(prev => new Set(prev).add(orderToRetry.id));
    try {
      const response = await orderService.retryOrderPayment(orderToRetry.id);
      if (response.success) {
        navigate('/payment', { state: response });
      } else {
        toast({ title: "Payment Retry Failed", description: "Failed to initiate payment retry.", variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Payment retry failed:", error);
      toast({ title: "Retry Failed", description: error.response?.data?.message || "Failed to retry payment. Please try again.", variant: "destructive" });
    } finally {
      setRetryingPayments(prev => { const n = new Set(prev); n.delete(orderToRetry.id); return n; });
      setOrderToRetry(null);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      CANCELLED: "bg-gray-100 text-gray-800",
      REFUNDED: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };



  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-olive-600 mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center max-w-md">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-black mb-4">No Orders Yet</h1>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Button
            onClick={() => navigate("/shop")}
            className="bg-olive-600 hover:bg-olive-700"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
          <Button
            variant="outline"
            onClick={loadOrders}
            className="border-olive-600 text-olive-600 hover:bg-olive-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Order Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({orders.filter(o => o.status === "pending").length})</TabsTrigger>
            <TabsTrigger value="payment_initiated">Payment Initiated ({orders.filter(o => o.status === "payment_initiated").length})</TabsTrigger>
            <TabsTrigger value="failed">Failed ({orders.filter(o => o.status === "failed").length})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed ({orders.filter(o => o.status === "confirmed").length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({orders.filter(o => o.status === "cancelled").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>Order #{order.id}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">
                            {order.status.replace("-", " ")}
                          </span>
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-olive-600">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-black text-sm line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Qty: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <span className="font-semibold text-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-600 pl-15">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Timeline: show only for confirmed and after */}
                  {['confirmed'].includes(order.status) && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-black">Fulfillment Timeline</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { key: 'confirmed', label: 'Confirmed' },
                          { key: 'processing', label: 'Processing' },
                          { key: 'shipped', label: 'Shipped' },
                          { key: 'delivered', label: 'Delivered' },
                        ].map((step) => (
                          <div key={step.key} className="flex flex-col items-center text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                              (step.key === 'confirmed') ? 'bg-olive-600 text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                              {(step.key === 'confirmed') ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                            <p className={`text-xs font-medium ${
                              (step.key === 'confirmed') ? 'text-olive-600' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Retry button for non-successful payments */}
                  {(['pending', 'payment_initiated', 'failed'].includes(order.status)) && (
                    <div className="bg-amber-50 p-4 rounded-md mb-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-semibold text-amber-800 mb-1">Payment Required</h4>
                          <p className="text-sm text-amber-700 mb-3">Your order is awaiting payment. Please complete your payment to process your order.</p>
                          <Button 
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={() => retryPayment(order.id)}
                            disabled={retryingPayments.has(order.id)}
                          >
                            {retryingPayments.has(order.id) ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry Payment
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Expired Order Notice */}
                  {order.isExpired && (
                    <div className="bg-gray-100 p-4 rounded-md mb-4">
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-600 mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">Order Expired</h4>
                          <p className="text-sm text-gray-700 mb-3">
                            This order has expired due to payment not being completed within the time limit.
                            Please create a new order to purchase these items.
                          </p>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => navigate("/shop")}
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Shop Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      {["confirmed", "processing", "shipped", "delivered"].includes(order.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.print()}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {["confirmed", "processing", "shipped"].includes(order.status) && (
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-1" />
                          <span>
                            Expected by {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate("/shop")}
                      >
                        Shop Again
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-black mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              No orders match the selected filter.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;