import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    // Validate required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'state',
      'district',
      'street',
      'city',
      'items',
      'totalPrice',
      'shippingCost',
      'grandTotal'
    ];

    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate items array
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const numericFields = ['totalPrice', 'shippingCost', 'grandTotal'];
    for (const field of numericFields) {
      if (typeof orderData[field] !== 'number' || isNaN(orderData[field])) {
        return NextResponse.json(
          { error: `Invalid ${field}: must be a number` },
          { status: 400 }
        );
      }
    }
    
    // Create the order with its items
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
        postcode: orderData.postcode || '',
        notes: orderData.notes || '',
        totalPrice: Number(orderData.totalPrice),
        shippingCost: Number(orderData.shippingCost),
        grandTotal: Number(orderData.grandTotal),
        status: 'pending',
        paymentMethod: orderData.paymentMethod || 'cash_on_delivery',
        paymentSlipUrl: orderData.paymentSlipUrl || null,
        items: {
          create: orderData.items.map((item: any) => ({
            productId: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            color: item.selectedColor || null,
            size: item.selectedSize || null,
            image: item.selectedImage || item.image || null,
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    // Return more specific error message if available
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 