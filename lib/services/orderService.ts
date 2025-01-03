import { CartItem } from '@/lib/context/CartContext';

interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  street: string;
  city: string;
  postcode?: string;
  notes?: string;
  items: CartItem[];
  totalPrice: number;
  shippingCost: number;
  grandTotal: number;
}

export async function createOrder(orderData: OrderData) {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
} 