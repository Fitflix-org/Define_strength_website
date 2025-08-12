import React from 'react';
import { Package, Truck, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface OrderTrackingItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location?: string;
  timestamp: string;
  isCompleted: boolean;
}

interface OrderTrackingProps {
  orderId: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  items: OrderTrackingItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  trackingEvents: TrackingEvent[];
  total: number;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  orderNumber,
  status,
  items,
  shippingAddress,
  trackingNumber,
  estimatedDelivery,
  trackingEvents,
  total
}) => {
  const getStatusColor = (orderStatus: string) => {
    switch (orderStatus) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-purple-100 text-purple-800';
      case 'SHIPPED': return 'bg-orange-100 text-orange-800';
      case 'OUT_FOR_DELIVERY': return 'bg-green-100 text-green-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (orderStatus: string) => {
    switch (orderStatus) {
      case 'PENDING': return <Clock className="h-5 w-5" />;
      case 'CONFIRMED': return <CheckCircle className="h-5 w-5" />;
      case 'PROCESSING': return <Package className="h-5 w-5" />;
      case 'SHIPPED': return <Truck className="h-5 w-5" />;
      case 'OUT_FOR_DELIVERY': return <Truck className="h-5 w-5" />;
      case 'DELIVERED': return <CheckCircle className="h-5 w-5" />;
      case 'CANCELLED': return <AlertCircle className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const getProgressPercentage = () => {
    const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(status);
    if (status === 'CANCELLED') return 0;
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const statusSteps = [
    { key: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle },
    { key: 'PROCESSING', label: 'Processing', icon: Package },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: MapPin }
  ];

  const getCurrentStepIndex = () => {
    const stepOrder = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    return stepOrder.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
          <p className="text-gray-600">Track your order #{orderNumber}</p>
        </div>

        <div className="grid gap-6">
          {/* Order Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  Order Status
                </CardTitle>
                <Badge className={getStatusColor(status)}>
                  {status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {status !== 'CANCELLED' && (
                <div className="space-y-4">
                  <Progress value={getProgressPercentage()} className="h-2" />
                  
                  {/* Status Steps */}
                  <div className="grid grid-cols-5 gap-2">
                    {statusSteps.map((step, index) => {
                      const currentStepIndex = getCurrentStepIndex();
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      const IconComponent = step.icon;

                      return (
                        <div key={step.key} className="text-center">
                          <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isCurrent 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className={`text-xs font-medium ${
                            isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery Information */}
              {estimatedDelivery && status !== 'DELIVERED' && status !== 'CANCELLED' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Estimated Delivery: {new Date(estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Tracking Number */}
              {trackingNumber && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-600">Tracking Number:</span>
                      <div className="font-mono font-medium">{trackingNumber}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Track with Courier
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{item.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">
                        ₹{(item.price / item.quantity).toFixed(2)} each
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium">{shippingAddress.name}</div>
                <div className="text-gray-700">
                  {shippingAddress.address}<br />
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
                </div>
                <div className="text-gray-600">Phone: {shippingAddress.phone}</div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Events */}
          {trackingEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingEvents.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${
                          event.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        {index < trackingEvents.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.status}</h4>
                          <span className="text-sm text-gray-600">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                        {event.location && (
                          <p className="text-gray-500 text-xs mt-1">📍 {event.location}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1">
              Contact Support
            </Button>
            {status === 'DELIVERED' && (
              <Button variant="outline" className="flex-1">
                Return/Exchange
              </Button>
            )}
            <Button variant="outline" className="flex-1">
              View Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
