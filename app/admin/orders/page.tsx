'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Order } from '@/app/types/order';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackingNumbers, setTrackingNumbers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders.sort((a: Order, b: Order) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
    
    // Initialize tracking numbers state
    const trackingState: { [key: string]: string } = {};
    storedOrders.forEach((order: Order) => {
      trackingState[order.id] = order.trackingNumber || '';
    });
    setTrackingNumbers(trackingState);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
          };
        }
        return order;
      });

      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      
      const order = updatedOrders.find(o => o.id === orderId);
      if (order) {
        await sendStatusUpdateEmail(orderId, status, order.trackingNumber, order);
      }
      
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const updateTrackingNumber = async (orderId: string) => {
    try {
      const trackingNumber = trackingNumbers[orderId];
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            trackingNumber,
          };
        }
        return order;
      });

      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      
      const order = updatedOrders.find(o => o.id === orderId);
      if (order) {
        await sendStatusUpdateEmail(orderId, order.status, trackingNumber, order);
      }
      
      toast.success('Tracking number updated successfully');
    } catch (error) {
      toast.error('Failed to update tracking number');
    }
  };

  const sendStatusUpdateEmail = async (
    orderId: string, 
    status: string, 
    trackingNumber: string | undefined,
    order: Order
  ) => {
    try {
      await fetch('/api/send-status-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: order.email,
          orderId,
          status,
          trackingNumber,
          customerName: `${order.firstName} ${order.lastName}`,
        }),
      });
    } catch (error) {
      console.error('Failed to send status update email:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Manage Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    Customer: {order.firstName} {order.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: {order.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) => 
                        updateOrderStatus(order.id, value as Order['status'])
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tracking Number"
                      value={trackingNumbers[order.id] || ''}
                      onChange={(e) => 
                        setTrackingNumbers(prev => ({
                          ...prev,
                          [order.id]: e.target.value
                        }))
                      }
                      className="w-[180px]"
                    />
                    <Button 
                      variant="outline"
                      onClick={() => updateTrackingNumber(order.id)}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <p>Shipping Address:</p>
                <p>{order.street}</p>
                <p>{order.city}, {order.state} {order.postcode}</p>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.id}`} className="text-sm">
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 