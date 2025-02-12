import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidObjectId } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    
    if (!isValidObjectId(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      },
      include: {
        items: true
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const updates = await request.json();
    
    const order = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        ...updates,
        // Handle special cases for status changes
        ...(updates.status === 'completed' ? { completedAt: new Date() } : {}),
        ...(updates.status === 'cancelled' ? { cancelledAt: new Date() } : {}),
        // If status is changed from cancelled to something else, remove cancelledAt
        ...(updates.status && updates.status !== 'cancelled' ? { cancelledAt: null } : {}),
        // If status is changed from completed to something else, remove completedAt
        ...(updates.status && updates.status !== 'completed' ? { completedAt: null } : {})
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
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
    
    // First delete all order items
    await prisma.orderItem.deleteMany({
      where: {
        orderId: orderId
      }
    });

    // Then delete the order
    await prisma.order.delete({
      where: {
        id: orderId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
} 