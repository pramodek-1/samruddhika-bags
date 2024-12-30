'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '@/lib/types/product';

interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedImage?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, color?: string, size?: string, image?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  totalItems: number;
  totalPrice: number;
  shippingCost: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((
    product: Product,
    quantity: number,
    color?: string,
    size?: string,
    image?: string
  ) => {
    setItems(currentItems => {
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
    setItems(currentItems => currentItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate shipping cost: 350 for first item, +50 for each additional item
  const shippingCost = totalItems > 0 
    ? 350 + (Math.max(0, totalItems - 1) * 50)
    : 0;
  
  const grandTotal = totalPrice + shippingCost;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
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