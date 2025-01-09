'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BillingDetailsForm } from "./billing-details-form";
import { CouponInput } from "./coupon-input";
import { OrderNotes } from "./order-notes";
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/services/orderService';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  street: string;
  city: string;
  postcode: string;
  notes: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, shippingCost, grandTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    district: '',
    street: '',
    city: '',
    postcode: '',
    notes: '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'state',
      'district',
      'street',
      'city'
    ];
    
    // Log the form data to debug
    console.log('Form Data:', formData);
    
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]?.trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!formData.phone.match(/^\d{10}$/)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        items,
        totalPrice,
        shippingCost,
        grandTotal
      };

      const order = await createOrder(orderData);

      if (!order) {
        throw new Error('Failed to create order');
      }

      // Only clear cart and show success if order was created
      clearCart();
      toast.success('Order placed successfully!');
      
      // Wait for toast to show before redirecting
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/order-success?orderId=${order.id}`);

    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-center">Checkout</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button className="mt-4" asChild>
              <a href="/">Continue Shopping</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <CouponInput />
          <div className="space-y-6">
            <BillingDetailsForm formData={formData} onChange={handleFormChange} />
            <OrderNotes 
              value={formData.notes || ''}
              onChange={handleFormChange} 
            />
          </div>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4">
                    <img
                      src={item.selectedImage || item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × LKR {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>LKR {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>LKR {shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>LKR {grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}