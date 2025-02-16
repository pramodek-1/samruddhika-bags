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
import Image from 'next/image';
import { Copy } from 'lucide-react';
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "../api/uploadthing/core";

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
  paymentMethod: 'cash_on_delivery' | 'bank_transfer';
  paymentSlipUrl?: string;
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
    paymentMethod: 'cash_on_delivery',
    paymentSlipUrl: undefined,
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    
    if (type === 'file' && (e.target as HTMLInputElement).files) {
      const file = (e.target as HTMLInputElement).files![0];
      setFormData(prev => ({
        ...prev,
        paymentSlipUrl: file.name
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
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
      'city',
      'paymentMethod'
    ];
    
    // Log the form data to debug
    console.log('Form Data:', formData);
    
    for (const field of requiredFields) {
      if (field === 'paymentMethod') {
        if (!formData[field]) {
          toast.error('Please select a payment method');
          return false;
        }
      } else {
        const value = formData[field as keyof FormData];
        if (typeof value !== 'string' || !value.trim()) {
          toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          return false;
        }
      }
    }

    if (formData.paymentMethod === 'bank_transfer' && !formData.paymentSlipUrl) {
      toast.error('Please upload your payment slip');
      return false;
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
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        state: formData.state.trim(),
        district: formData.district.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        postcode: formData.postcode?.trim(),
        notes: formData.notes?.trim(),
        paymentMethod: formData.paymentMethod,
        paymentSlipUrl: formData.paymentSlipUrl,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          selectedImage: item.selectedImage,
          image: item.image,
        })),
        totalPrice: Number(totalPrice),
        shippingCost: Number(shippingCost),
        grandTotal: Number(grandTotal),
      };

      // Send order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create order');
      }

      // Send confirmation email
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            orderId: responseData.id,
            customerName: `${formData.firstName} ${formData.lastName}`,
            items,
            totalPrice,
            shippingCost,
            grandTotal
          }),
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't throw error here - we still want to complete the order
      }

      // Only clear cart and show success if order was created
      clearCart();
      toast.success('Order placed successfully!');
      
      // Wait for toast to show before redirecting
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/order-success?orderId=${responseData.id}`);

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
            
            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <div className="grid gap-4">
                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    id="paymentMethod"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={formData.paymentMethod === 'cash_on_delivery'}
                    onChange={handleFormChange}
                    className="h-4 w-4"
                  />
                  <div>
                    <label htmlFor="cash_on_delivery" className="font-medium cursor-pointer">
                      Cash on Delivery
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Pay with cash upon delivery
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      id="paymentMethod"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleFormChange}
                      className="h-4 w-4"
                    />
                    <div>
                      <label htmlFor="bank_transfer" className="font-medium cursor-pointer">
                        Bank Transfer
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Pay via bank transfer
                      </p>
                    </div>
                  </div>

                  {formData.paymentMethod === 'bank_transfer' && (
                    <div className="ml-7 space-y-4">
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-sm font-medium text-red-600">
                          Important: Please add your name &ldquo;{formData.firstName} {formData.lastName}&rdquo; as the payment reference/remarks when making the bank transfer.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                          <h3 className="font-medium">Bank Details</h3>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Bank:</span> People&apos;s Bank</p>
                            <p><span className="font-medium">Account Name:</span> C Kaluarachchi</p>
                            <p className="flex items-center justify-between">
                              <span>
                                <span className="font-medium">Account Number:</span> 219200177431962
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText('219200177431962');
                                  toast.success('Account number copied!');
                                }}
                                className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </p>
                            <p><span className="font-medium">Branch:</span> Thambuttegama</p>
                          </div>
                        </div>

                        <div className="bg-muted p-4 rounded-lg space-y-2">
                          <h3 className="font-medium">Bank Details</h3>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Bank:</span> HNB Bank</p>
                            <p><span className="font-medium">Account Name:</span> Ekanayaka E M P V K</p>
                            <p className="flex items-center justify-between">
                              <span>
                                <span className="font-medium">Account Number:</span> 088020354967
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText('088020354967');
                                  toast.success('Account number copied!');
                                }}
                                className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </p>
                            <p><span className="font-medium">Branch:</span> Thambuttegama</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Upload Payment Slip
                        </label>
                        <UploadButton<OurFileRouter>
                          endpoint="paymentSlipUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              setFormData(prev => ({
                                ...prev,
                                paymentSlipUrl: res[0].url
                              }));
                              toast.success("Payment slip uploaded successfully!");
                            }
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`Error uploading payment slip: ${error.message}`);
                          }}
                          className={{
                            container: "w-full",
                            button: "ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                          }}
                        />
                        {formData.paymentSlipUrl && (
                          <p className="text-sm text-green-600">
                            Payment slip uploaded successfully
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Accepted formats: JPG, PNG, PDF (Max size: 4MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
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
                    <Image
                      src={item.selectedImage || item.image}
                      alt={item.name}
                      width={64}
                      height={64}
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