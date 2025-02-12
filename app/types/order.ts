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
  items: OrderItem[];
  totalPrice: number;
  shippingCost: number;
  grandTotal: number;
  status: OrderStatus;
  trackingNumber?: string;
  completedAt?: string;
  cancelledAt?: string;
  paymentMethod: 'cash_on_delivery' | 'bank_transfer';
  paymentSlipUrl?: string;
} 