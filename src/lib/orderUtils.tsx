import { Order } from "@/services/orderService";
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ShoppingBag,
  ArrowRight,
  Download,
  RefreshCw,
  CreditCard,
  AlertCircle,
  Loader2,
  CircleDotDashed,
  XCircle
} from "lucide-react";

// Define a type for the icons to ensure type safety
type IconType = React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & React.RefAttributes<SVGSVGElement>>;

interface StatusIconMap {
  [key: string]: IconType;
}

const icons: StatusIconMap = {
  pending: Clock,
  payment_initiated: CreditCard,
  payment_failed: AlertCircle,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  expired: Clock,
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "payment_initiated":
      return "bg-blue-100 text-blue-800";
    case "payment_failed":
      return "bg-red-100 text-red-800";
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-purple-100 text-purple-800";
    case "shipped":
      return "bg-indigo-100 text-indigo-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-gray-100 text-gray-800";
    case "expired":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

import React from 'react';

export const getStatusIcon = (status: string): JSX.Element => {
  const IconComponent = icons[status] || Package;
  return <IconComponent className="h-4 w-4" />;
};

export const getTrackingSteps = (order: Order) => {
  return [
    {
      status: "pending",
      label: "Order Placed",
      completed: true,
      timestamp: order.createdAt,
    },
    {
      status: "payment_initiated",
      label: "Payment Initiated",
      completed: ["payment_initiated", "payment_failed", "confirmed", "processing", "shipped", "delivered"].includes(order.status),
      timestamp: order.paymentInitiatedAt || null,
    },
    {
      status: "confirmed",
      label: "Payment Confirmed",
      completed: ["confirmed", "processing", "shipped", "delivered"].includes(order.status),
      timestamp: order.status === "confirmed" || order.status === "processing" || order.status === "shipped" || order.status === "delivered" ? order.updatedAt : null,
    },
    {
      status: "processing",
      label: "Processing",
      completed: ["processing", "shipped", "delivered"].includes(order.status),
      timestamp: ["processing", "shipped", "delivered"].includes(order.status) ? order.updatedAt : null,
    },
    {
      status: "shipped",
      label: "Shipped",
      completed: ["shipped", "delivered"].includes(order.status),
      timestamp: ["shipped", "delivered"].includes(order.status) ? order.updatedAt : null,
    },
    {
      status: "delivered",
      label: "Delivered",
      completed: order.status === "delivered",
      timestamp: order.status === "delivered" ? order.updatedAt : null,
    },
  ];
};