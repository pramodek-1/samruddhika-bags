'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    totalPrice, 
    shippingCost,
    grandTotal 
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Shopping Cart</h1>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4" />
              <p>Your cart is empty</p>
              <Button className="mt-4" asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Shopping Cart</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}>
              <CardContent className="p-6 flex gap-4">
              <Image
                  src={item.selectedImage || item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.selectedColor && `Color: ${item.selectedColor}`}
                    {item.selectedSize && `, Size: ${item.selectedSize}`}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border rounded"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    LKR {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>LKR {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>LKR {shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>LKR {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-6" asChild>
                <Link href="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}