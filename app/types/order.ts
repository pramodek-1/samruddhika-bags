export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedImage?: string;
  image: string;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';

export interface Order {
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
  status: OrderStatus;
  completedAt?: string;
  trackingNumber?: string;
  notes?: string;
  cancelledAt?: string;
} 