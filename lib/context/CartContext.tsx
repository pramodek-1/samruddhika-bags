'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product } from '@/lib/types/product';
import { useSession } from 'next-auth/react';

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedImage?: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, color?: string, size?: string, image?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  shippingCost: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Sync with server when user signs in/out
  useEffect(() => {
    const syncCart = async () => {
      if (session?.user) {
        try {
          // If user just signed in, first try to load their server-stored cart
          const response = await fetch('/api/cart');
          const serverCart = await response.json();
          
          if (serverCart.items?.length) {
            setCartItems(serverCart.items);
          } else {
            // If no server cart, push local cart to server
            await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: cartItems }),
            });
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      }
    };

    syncCart();
  }, [session]);

  // Save to localStorage and server (if signed in)
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    if (session?.user) {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      }).catch(error => console.error('Error saving cart:', error));
    }
  }, [cartItems, session?.user]);

  const addToCart = useCallback((
    product: Product,
    quantity: number,
    color?: string,
    size?: string,
    image?: string
  ) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(
        item => 
          item.id === product.id && 
          item.selectedColor === color && 
          item.selectedSize === size
      );

      if (existingItem) {
        return currentItems.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentItems, { 
        ...product, 
        quantity, 
        selectedColor: color, 
        selectedSize: size,
        selectedImage: image || product.image
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate shipping cost: 350 for first item, +50 for each additional item
  const shippingCost = totalItems > 0 
    ? 350 + (Math.max(0, totalItems - 1) * 50)
    : 0;
  
  const grandTotal = totalPrice + shippingCost;

  return (
    <CartContext.Provider
      value={{
        items: cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        shippingCost,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 