import { NextResponse } from 'next/server';
import { Order } from '@/app/types/order';

// Reference the same orders array
declare global {
  var orders: Order[];
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const updates = await request.json();
    
    const orderIndex = global.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const updatedOrder = {
      ...global.orders[orderIndex],
      ...updates,
      // Handle special cases for status changes
      ...(updates.status === 'completed' ? { completedAt: new Date().toISOString() } : {}),
      ...(updates.status === 'cancelled' ? { cancelledAt: new Date().toISOString() } : {}),
      // If status is changed from cancelled to something else, remove cancelledAt
      ...(updates.status && updates.status !== 'cancelled' ? { cancelledAt: null } : {}),
      // If status is changed from completed to something else, remove completedAt
      ...(updates.status && updates.status !== 'completed' ? { completedAt: null } : {}),
    };

    global.orders[orderIndex] = updatedOrder;

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    
    const orderIndex = global.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    global.orders = global.orders.filter(order => order.id !== orderId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
} 