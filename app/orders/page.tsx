'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageSearch, Trash2, TruckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedImage?: string;
  image: string;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  totalPrice: number;
  shippingCost: number;
  grandTotal: number;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
}

function getStatusColor(status: Order['status']) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatPrice(value: number | undefined): string {
  return value ? value.toFixed(2) : '0.00';
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    // Filter out invalid orders
    const validOrders = storedOrders.filter((order: Order) => {
      return (
        order.id &&
        order.date &&
        order.items?.length > 0 &&
        order.firstName &&
        order.lastName &&
        order.street &&
        order.city &&
        order.state &&
        order.grandTotal > 0
      );
    });
    
    setOrders(validOrders.sort((a: Order, b: Order) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const updatedOrders = orders.filter(order => order.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
        toast.success('Order deleted successfully');
      } catch (error) {
        toast.error('Failed to delete order');
      }
    }
  };

  const getTrackingLink = (trackingNumber: string) => {
    // You can customize this based on your shipping provider
    return `https://track.samruddhibags.com/tracking/${trackingNumber}`;
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh] flex flex-col items-center justify-center">
        <PackageSearch className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Orders Found</h1>
        <p className="text-muted-foreground mb-4">You haven&apos;t placed any orders yet.</p>
        <Button asChild>
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between mb-4">
                <div>
                  {order.id && (
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium">Order #{order.id}</p>
                      <Badge variant="secondary" className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  )}
                  {order.date && (
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.date)}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-end gap-2">
                  <div className="text-right">
                    <p className="font-medium">Total Amount</p>
                    <p className="text-sm text-muted-foreground">
                      LKR {formatPrice(order.grandTotal)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {order.trackingNumber && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-purple-500 hover:text-purple-700 hover:bg-purple-50"
                        onClick={() => window.open(getTrackingLink(order.trackingNumber!), '_blank')}
                        title="Track order"
                      >
                        <TruckIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteOrder(order.id)}
                      title="Delete order"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="border-t pt-4">
                  <div className="grid gap-4">
                    {order.items.map((item) => (
                      <div 
                        key={`${order.id}-${item.id}`} 
                        className="flex flex-col sm:flex-row gap-4"
                      >
                        <Image
                          src={item.selectedImage || item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × LKR {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(order.firstName || order.lastName || order.street || order.city || order.state) && (
                <div className="border-t mt-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.firstName} {order.lastName}<br />
                        {order.street && <>{order.street}<br /></>}
                        {order.city && order.state && (
                          <>{order.city}, {order.state} {order.postcode}</>
                        )}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <h3 className="font-medium mb-2">Order Summary</h3>
                      <div className="text-sm text-muted-foreground">
                        <p>Subtotal: LKR {formatPrice(order.totalPrice)}</p>
                        <p>Shipping: LKR {formatPrice(order.shippingCost)}</p>
                        <p className="font-medium text-foreground">
                          Total: LKR {formatPrice(order.grandTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 