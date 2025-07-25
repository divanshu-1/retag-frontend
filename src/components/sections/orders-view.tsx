'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/hooks/use-user';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Calendar, MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import type { View } from '@/app/page';
import { apiRequestJson } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { LoginButton } from '@/components/auth/login-button';

interface OrderItem {
  productId: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  address: {
    name: string;
    phone: string;
    pincode: string;
    house: string;
    area: string;
  };
  cart: OrderItem[];
  amount: number;
  status: 'created' | 'paid' | 'failed';
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  estimatedDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

const EmptyOrdersIcon = () => (
  <div className="relative inline-block">
    <Package className="h-24 w-24 text-foreground" strokeWidth={1}/>
    <div className="absolute top-[35%] left-[-10px] h-1.5 w-1.5 rounded-full bg-muted-foreground" />
    <div className="absolute top-[50%] left-[-20px] h-2.5 w-2.5 rounded-full bg-primary/80" />
    <div className="absolute top-[30%] right-[-15px] h-2.5 w-2.5 rounded-full bg-primary/80" />
    <div className="absolute top-[45%] right-[-8px] h-1.5 w-1.5 rounded-full bg-muted-foreground" />
  </div>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'failed':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'created':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'paid':
      return 'Delivered';
    case 'failed':
      return 'Delivery failed';
    case 'created':
      return 'Processing';
    default:
      return status;
  }
};

export default function OrdersView({ onNavigate }: { onNavigate: (view: View) => void }) {
  const { isLoggedIn } = useUser();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await apiRequestJson('/api/user/orders');

      // Ensure response is an array
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('Orders response is not an array:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]); // Set empty array on error
      toast({
        title: 'Error',
        description: 'Failed to fetch orders. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, fetchOrders]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-[#18181b] min-h-full">
        <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="container max-w-4xl mx-auto text-center py-16">
            <EmptyOrdersIcon />
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight mt-6">
              Please log in to view your orders
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Login to view your order history and track your purchases.
            </p>
            <div className="mt-6">
              <LoginButton />
            </div>
          </div>
        </section>
        <div className="border-t border-border w-full" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#18181b] min-h-full">
        <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="container max-w-4xl mx-auto text-center py-16">
            <Package className="h-24 w-24 text-foreground mx-auto animate-pulse" strokeWidth={1}/>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight mt-6">
              Loading your orders...
            </h1>
          </div>
        </section>
        <div className="border-t border-border w-full" />
      </div>
    );
  }

  // Ensure orders is always an array
  const safeOrders = Array.isArray(orders) ? orders : [];

  if (safeOrders.length === 0) {
    return (
      <div className="bg-[#18181b] min-h-full">
        <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="container max-w-4xl mx-auto text-center py-16">
            <EmptyOrdersIcon />
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight mt-6">
              No orders yet! Let's find some great items shall we?
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Start shopping to see your order history here.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="rounded-full px-8 py-6 font-bold"
                onClick={() => onNavigate('shop')}
              >
                Start Shopping
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 py-6 font-bold"
                onClick={() => onNavigate('account')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Account
              </Button>
            </div>
          </div>
        </section>
        <div className="border-t border-border w-full" />
      </div>
    );
  }

  return (
    <div className="bg-[#18181b] min-h-full">
      <section className="py-16 sm:py-24">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-8 text-left">
            <Button 
              variant="ghost" 
              className="mb-4 text-muted-foreground hover:text-foreground"
              onClick={() => onNavigate('account')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Account
            </Button>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground uppercase">
              Your Orders
            </h1>
            <p className="text-muted-foreground mt-2">
              {safeOrders.length} {safeOrders.length === 1 ? 'order' : 'orders'} found
            </p>
          </div>

          <div className="space-y-6">
            {safeOrders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Order Header */}
                  <div className="bg-muted/30 p-4 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <p className="font-mono text-sm">{order.razorpayOrderId}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.createdAt)}
                        </div>
                        {order.estimatedDeliveryDate && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Package className="h-4 w-4" />
                            <span>Delivery by {formatDate(order.estimatedDeliveryDate)}</span>
                          </div>
                        )}
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-4">
                      {order.cart.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium text-sm">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">{order.address.name}</p>
                            <p>{order.address.house}, {order.address.area}</p>
                            <p>Pincode: {order.address.pincode}</p>
                            <p>Phone: {order.address.phone}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <CreditCard className="h-4 w-4" />
                            Total Amount
                          </div>
                          <p className="text-2xl font-bold">₹{order.amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <div className="border-t border-border w-full" />
    </div>
  );
}
