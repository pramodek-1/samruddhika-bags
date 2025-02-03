import { NextResponse } from 'next/server';
import { Order } from '@/app/types/order';

// Initialize the global orders array if it doesn't exist
if (!global.orders) {
  global.orders = [];
}

export async function GET() {
  return NextResponse.json({ orders: global.orders });
}

export async function POST(request: Request) {
  const order = await request.json();
  global.orders.push(order);
  return NextResponse.json(order);
} 