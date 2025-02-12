'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Invoice } from '@/components/Invoice';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { isValidObjectId } from '@/lib/utils';

interface OrderData {
  id: string;
  date: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  district: string;
  postcode: string;
  items: any[];
  totalPrice: number;
  shippingCost: number;
  grandTotal: number;
  createdAt: string;
  paymentMethod: 'cash_on_delivery' | 'bank_transfer';
  paymentSlipUrl?: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      if (!isValidObjectId(orderId)) {
        toast.error('Invalid order ID format');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch order details');
        }
        const data = await response.json();
        setOrderData(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">Loading order details...</div>
      </div>
    );
  }

  if (!orderId || !orderData) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The order you're looking for could not be found. Please check the order ID and try again.
          </p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold">
            Thank You for Your Order!
          </h1>
          
          <p className="text-muted-foreground">
            Your order has been successfully placed. We'll send you an email with your order details and tracking information once your order ships.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/orders">
                View Orders
              </Link>
            </Button>
            
            <Button asChild>
              <Link href="/">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>

        {/* Invoice Section */}
        <Invoice
          orderId={orderData.id}
          date={orderData.createdAt}
          customerDetails={{
            firstName: orderData.firstName,
            lastName: orderData.lastName,
            email: orderData.email,
            phone: orderData.phone,
            street: orderData.street,
            city: orderData.city,
            state: orderData.state,
            district: orderData.district,
            postcode: orderData.postcode,
          }}
          items={orderData.items}
          totalPrice={orderData.totalPrice}
          shippingCost={orderData.shippingCost}
          grandTotal={orderData.grandTotal}
          paymentMethod={orderData.paymentMethod}
          paymentSlipUrl={orderData.paymentSlipUrl}
        />
      </div>
    </div>
  );
} 