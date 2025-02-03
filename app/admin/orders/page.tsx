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
import { Order, OrderStatus } from '@/app/types/order';
import { CheckCircle2, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackingNumbers, setTrackingNumbers] = useState<{ [key: string]: string }>({});
  const [recentlyCancelled, setRecentlyCancelled] = useState<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    loadOrders();
    
    return () => {
      // Cleanup timeouts when component unmounts
      Object.values(recentlyCancelled).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
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
      // Don't allow updates if order is completed or cancelled
      const currentOrder = orders.find(o => o.id === orderId);
      if (currentOrder?.status === 'completed' || currentOrder?.status === 'cancelled') {
        toast.error(`Cannot update a ${currentOrder.status} order`);
        return;
      }

      // Add confirmation for completed and cancelled status
      if (status === 'completed' || status === 'cancelled') {
        const confirmed = window.confirm(
          `Are you sure you want to mark this order as ${status}? This action cannot be undone.`
        );
        if (!confirmed) {
          return;
        }
      }

      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : order.completedAt,
            cancelledAt: status === 'cancelled' ? new Date().toISOString() : order.cancelledAt,
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
      
      if (status === 'completed') {
        toast.success('Order marked as completed successfully');
      } else if (status === 'cancelled') {
        toast.success('Order cancelled successfully', {
          action: {
            label: "Undo",
            onClick: () => handleUndoCancel(orderId)
          },
        });

        // Set a timeout to remove the undo option after 5 minutes
        const timeout = setTimeout(() => {
          const newRecentlyCancelled = { ...recentlyCancelled };
          delete newRecentlyCancelled[orderId];
          setRecentlyCancelled(newRecentlyCancelled);
        }, 5 * 60 * 1000); // 5 minutes

        setRecentlyCancelled(prev => ({
          ...prev,
          [orderId]: timeout
        }));
      } else {
        toast.success('Order status updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleUndoCancel = async (orderId: string) => {
    try {
      // Clear the timeout
      if (recentlyCancelled[orderId]) {
        clearTimeout(recentlyCancelled[orderId]);
        const newRecentlyCancelled = { ...recentlyCancelled };
        delete newRecentlyCancelled[orderId];
        setRecentlyCancelled(newRecentlyCancelled);
      }

      // Restore the order to its previous state
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'pending' as OrderStatus,
            cancelledAt: undefined,
          };
        }
        return order;
      });

      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      
      const order = updatedOrders.find(o => o.id === orderId);
      if (order) {
        await sendStatusUpdateEmail(orderId, 'pending', order.trackingNumber, order);
      }
      
      toast.success('Order cancellation undone');
    } catch (error) {
      toast.error('Failed to undo cancellation');
    }
  };

  const updateTrackingNumber = async (orderId: string) => {
    try {
      // Don't allow updates if order is completed or cancelled
      const currentOrder = orders.find(o => o.id === orderId);
      if (currentOrder?.status === 'completed' || currentOrder?.status === 'cancelled') {
        toast.error(`Cannot update a ${currentOrder.status} order`);
        return;
      }

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

  const deleteOrder = (orderId: string) => {
    // Ask for confirmation before deleting
    const confirmed = window.confirm(
      'Are you sure you want to delete this order? This action cannot be undone.'
    );
    
    if (!confirmed) {
      return;
    }

    try {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      toast.success('Order deleted successfully');
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Manage Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden relative">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => deleteOrder(order.id)}
              className="absolute top-2 right-2 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Order #{order.id}</p>
                    {order.status === 'completed' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {order.status === 'cancelled' && (
                      <span className="text-sm text-red-500 font-medium">Cancelled</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ordered on: {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Customer: {order.firstName} {order.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: {order.email}
                  </p>
                  {order.completedAt && (
                    <p className="text-sm text-green-600">
                      Completed on: {new Date(order.completedAt).toLocaleDateString()}
                    </p>
                  )}
                  {order.cancelledAt && (
                    <p className="text-sm text-red-600">
                      Cancelled on: {new Date(order.cancelledAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) => 
                        updateOrderStatus(order.id, value as Order['status'])
                      }
                      disabled={order.status === 'completed' || order.status === 'cancelled'}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
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
                      disabled={order.status === 'completed' || order.status === 'cancelled'}
                      className="w-[180px]"
                    />
                    <Button 
                      variant="outline"
                      onClick={() => updateTrackingNumber(order.id)}
                      disabled={order.status === 'completed' || order.status === 'cancelled'}
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
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.id}`} className="flex gap-4">
                      <Image
                        src={item.selectedImage || item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × LKR {item.price.toFixed(2)}
                        </p>
                        {item.selectedColor && (
                          <div className="flex items-center gap-2 mt-1">
                            <div 
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {item.selectedColor}
                            </span>
                          </div>
                        )}
                        {item.selectedSize && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Size: {item.selectedSize}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <p>Total: LKR {order.grandTotal.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 