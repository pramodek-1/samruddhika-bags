'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold">
          Thank You for Your Order!
        </h1>
        
        <p className="text-muted-foreground">
          Your order has been successfully placed. We'll send you a confirmation email shortly.
        </p>
        
        {orderId && (
          <p className="text-sm bg-muted p-3 rounded-md">
            Order ID: <span className="font-mono font-medium">{orderId}</span>
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
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
    </div>
  );
} 