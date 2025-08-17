import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Plus, Edit, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { addressService, Address, CreateAddressData } from "@/services/addressService";
import { orderService } from "@/services/orderService";

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const total = cart?.total || 0;
  const items = cart?.items || [];

  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [newAddress, setNewAddress] = useState<CreateAddressData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    isDefault: false,
  });

  const isDirect = searchParams.get("direct") === "true";

  // Fetch addresses using React Query
  const { data: addresses = [], isLoading: addressesLoading, error: addressesError } = useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: () => addressService.getAddresses(),
    enabled: isAuthenticated,
    retry: 1,
  });

  // Handle address loading errors
  useEffect(() => {
    if (addressesError) {
      console.error('Failed to load addresses:', addressesError);
      const error = addressesError as any;
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast({
          title: "Authentication Error", 
          description: "Please log in again to manage your addresses",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error Loading Addresses",
          description: "Failed to load your saved addresses. You can still add a new address.",
          variant: "destructive",
        });
      }
    }
  }, [addressesError, toast]);

  // Create address mutation
  const createAddressMutation = useMutation({
    mutationFn: (addressData: CreateAddressData) => addressService.createAddress(addressData),
    onSuccess: (newAddress) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setSelectedAddress(newAddress.id);
      setIsAddingAddress(false);
      setNewAddress({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        isDefault: false,
      });
      toast({
        title: "Address Added",
        description: "New address has been added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: (addressId: string) => addressService.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast({
        title: "Address Deleted",
        description: "Address has been deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!cart || items.length === 0) {
      navigate("/cart");
      return;
    }
  }, [isAuthenticated, cart, navigate, items.length]);

  // Set first address as selected when addresses load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress.id);
    }
  }, [addresses, selectedAddress]);

  const handleAddAddress = () => {
    if (!newAddress.firstName || !newAddress.lastName || !newAddress.phone || 
        !newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createAddressMutation.mutate(newAddress);
  };

  const handleDeleteAddress = (addressId: string) => {
    if (selectedAddress === addressId) {
      const remainingAddresses = addresses.filter(addr => addr.id !== addressId);
      setSelectedAddress(remainingAddresses.length > 0 ? remainingAddresses[0].id : "");
    }
    deleteAddressMutation.mutate(addressId);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: "Address Required",
        description: "Please select a delivery address",
        variant: "destructive",
      });
      return;
    }

    const address = addresses.find(addr => addr.id === selectedAddress);
    if (!address) {
      toast({
        title: "Address Error",
        description: "Selected address not found",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order with payment_initiated status
      const shippingAddress = {
        firstName: address.firstName,
        lastName: address.lastName,
        address: `${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}`,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone,
      };

      // Create order data with both items and shipping address
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        shippingAddress: shippingAddress
      };

      const { order, isExisting } = await orderService.createOrder(orderData);
      
      toast({
        title: isExisting ? "Resuming Order" : "Order Created",
        description: `${isExisting ? 'Continuing existing order' : 'Order created successfully'} (#${order.id}). Redirecting to payment...`,
      });

      // Navigate to payment page with order data
      navigate("/payment", {
        state: {
          orderId: order.id,
          orderNumber: order.orderNumber || order.id,
          total: order.total,
          items: order.items,
          shippingAddress: shippingAddress,
          status: "payment_initiated"
        }
      });
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast({
        title: "Order Failed",
        description: error.response?.data?.message || "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-black mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/cart")}
                className="flex items-center text-gray-600 hover:text-olive-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Cart
              </button>
              <h1 className="text-2xl font-bold text-black">Checkout</h1>
            </div>
            <div className="text-sm text-gray-600">
              Step 2 of 3
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-olive-600" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addressesLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading your addresses...</p>
                  </div>
                ) : addressesError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-4">Unable to load saved addresses.</p>
                    <p className="text-gray-600 mb-4">Please add a new address to continue.</p>
                    <Button
                      onClick={() => setIsAddingAddress(true)}
                      className="bg-olive-600 hover:bg-olive-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Delivery Address
                    </Button>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No addresses found</p>
                    <Button
                      onClick={() => setIsAddingAddress(true)}
                      className="bg-olive-600 hover:bg-olive-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  </div>
                ) : (
                  <>
                    <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <RadioGroupItem value={address.id} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-black">
                                {address.firstName} {address.lastName}
                                {address.isDefault && (
                                  <span className="ml-2 text-xs bg-olive-100 text-olive-600 px-2 py-1 rounded">
                                    Default
                                  </span>
                                )}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <button className="text-olive-600 hover:text-olive-700">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Phone: {address.phone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>

                    <Button
                      variant="outline"
                      onClick={() => setIsAddingAddress(true)}
                      className="w-full border-olive-600 text-olive-600 hover:bg-olive-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  </>
                )}

                {/* Add Address Form */}
                {isAddingAddress && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Add New Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={newAddress.firstName}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, firstName: e.target.value }))}
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={newAddress.lastName}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, lastName: e.target.value }))}
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+91 XXXXXXXXXX"
                        />
                      </div>

                      <div>
                        <Label htmlFor="addressLine1">Address Line 1 *</Label>
                        <Input
                          id="addressLine1"
                          value={newAddress.addressLine1}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                          placeholder="House no, Building name, Street"
                        />
                      </div>

                      <div>
                        <Label htmlFor="addressLine2">Address Line 2</Label>
                        <Input
                          id="addressLine2"
                          value={newAddress.addressLine2}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
                          placeholder="Area, Landmark (Optional)"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="Enter city"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Select
                            value={newAddress.state}
                            onValueChange={(value) => setNewAddress(prev => ({ ...prev, state: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                              <SelectItem value="Delhi">Delhi</SelectItem>
                              <SelectItem value="Karnataka">Karnataka</SelectItem>
                              <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                              <SelectItem value="Gujarat">Gujarat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            value={newAddress.zipCode}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                            placeholder="400001"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={newAddress.country}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isDefault"
                          checked={newAddress.isDefault}
                          onCheckedChange={(checked) => 
                            setNewAddress(prev => ({ ...prev, isDefault: checked as boolean }))
                          }
                        />
                        <Label htmlFor="isDefault">Set as default address</Label>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          onClick={handleAddAddress}
                          className="bg-olive-600 hover:bg-olive-700"
                        >
                          Save Address
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddingAddress(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Special instructions for delivery..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24"
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-black text-sm line-clamp-2">
                        {item.product.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Qty: {item.quantity} × ${item.product.salePrice || item.product.price}
                      </p>
                    </div>
                    <span className="font-semibold text-black">
                      ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-black">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-olive-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-black">${(total * 0.18).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-black">Total:</span>
                    <span className="text-olive-600">${(total * 1.18).toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddress || isProcessing}
                  className="w-full bg-olive-600 hover:bg-olive-700"
                  size="lg"
                >
                  {isProcessing ? "Processing..." : "Proceed to Payment"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;