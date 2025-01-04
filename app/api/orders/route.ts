import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedImage?: string;
  image?: string;
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    const order = await prisma.order.create({
      data: {
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        email: orderData.email,
        phone: orderData.phone,
        state: orderData.state,
        district: orderData.district,
        street: orderData.street,
        city: orderData.city,
        postcode: orderData.postcode,
        notes: orderData.notes,
        totalPrice: orderData.totalPrice,
        shippingCost: orderData.shippingCost,
        grandTotal: orderData.grandTotal,
        items: {
          create: orderData.items.map((item: OrderItem) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            color: item.selectedColor,
            size: item.selectedSize,
            image: item.selectedImage || item.image
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create order'
      },
      { status: 500 }
    );
  }
} 