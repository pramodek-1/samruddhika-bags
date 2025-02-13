'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Order, OrderStatus } from '@/app/types/order';
import { CheckCircle2, Trash2, Download } from 'lucide-react';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackingNumbers, setTrackingNumbers] = useState<{ [key: string]: string }>({});
  const [recentlyCancelled, setRecentlyCancelled] = useState<{ [key: string]: NodeJS.Timeout }>({});
  const [recentlyCompleted, setRecentlyCompleted] = useState<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    loadOrders();
    
    return () => {
      // Cleanup timeouts when component unmounts
      Object.values(recentlyCancelled).forEach(timeout => clearTimeout(timeout));
      Object.values(recentlyCompleted).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      
      const sortedOrders = data.orders.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setOrders(sortedOrders);
      
      // Initialize tracking numbers state
      const trackingState: { [key: string]: string } = {};
      sortedOrders.forEach((order: Order) => {
        trackingState[order.id] = order.trackingNumber || '';
      });
      setTrackingNumbers(trackingState);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error loading orders:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      // Don't allow updates if order is completed or cancelled
      const currentOrder = orders.find(o => o.id === orderId);
      if (currentOrder?.status === 'completed' || currentOrder?.status === 'cancelled') {
        toast.error(`Cannot update a ${currentOrder.status} order`);
        return;
      }

      // Add confirmation for completed and cancelled status
      if (status === 'completed' || status === 'cancelled') {
        const confirmed = window.confirm(
          `Are you sure you want to mark this order as ${status}? This action can be undone within 5 minutes.`
        );
        if (!confirmed) {
          return;
        }
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      const updatedOrder = await response.json();
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );

      if (updatedOrder) {
        await sendStatusUpdateEmail(orderId, status, updatedOrder.trackingNumber, updatedOrder);
      }
      
      if (status === 'completed') {
        toast.success('Order marked as completed successfully', {
          action: {
            label: "Undo",
            onClick: () => handleUndoComplete(orderId)
          },
        });

        // Set a timeout to remove the undo option after 5 minutes
        const timeout = setTimeout(() => {
          const newRecentlyCompleted = { ...recentlyCompleted };
          delete newRecentlyCompleted[orderId];
          setRecentlyCompleted(newRecentlyCompleted);
        }, 5 * 60 * 1000); // 5 minutes

        setRecentlyCompleted(prev => ({
          ...prev,
          [orderId]: timeout
        }));
      } else if (status === 'cancelled') {
        toast.success('Order cancelled successfully', {
          action: {
            label: "Undo",
            onClick: () => handleUndoCancel(orderId)
          },
        });

        // Set a timeout to remove the undo option after 5 minutes
        const timeout = setTimeout(() => {
          const newRecentlyCancelled = { ...recentlyCancelled };
          delete newRecentlyCancelled[orderId];
          setRecentlyCancelled(newRecentlyCancelled);
        }, 5 * 60 * 1000); // 5 minutes

        setRecentlyCancelled(prev => ({
          ...prev,
          [orderId]: timeout
        }));
      } else {
        toast.success('Order status updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order:', error);
    }
  };

  const handleUndoCancel = async (orderId: string) => {
    try {
      // Clear the timeout
      if (recentlyCancelled[orderId]) {
        clearTimeout(recentlyCancelled[orderId]);
        const newRecentlyCancelled = { ...recentlyCancelled };
        delete newRecentlyCancelled[orderId];
        setRecentlyCancelled(newRecentlyCancelled);
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'pending',
          cancelledAt: null  // Explicitly set cancelledAt to null
        }),
      });

      if (!response.ok) throw new Error('Failed to undo cancellation');

      const updatedOrder = await response.json();
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      
      if (updatedOrder) {
        await sendStatusUpdateEmail(orderId, 'pending', updatedOrder.trackingNumber, updatedOrder);
      }
      
      toast.success('Order cancellation undone');
    } catch (error) {
      toast.error('Failed to undo cancellation');
      console.error('Error undoing cancellation:', error);
    }
  };

  const handleUndoComplete = async (orderId: string) => {
    try {
      // Clear the timeout
      if (recentlyCompleted[orderId]) {
        clearTimeout(recentlyCompleted[orderId]);
        const newRecentlyCompleted = { ...recentlyCompleted };
        delete newRecentlyCompleted[orderId];
        setRecentlyCompleted(newRecentlyCompleted);
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'processing',
          completedAt: null
        }),
      });

      if (!response.ok) throw new Error('Failed to undo completion');

      const updatedOrder = await response.json();
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      
      if (updatedOrder) {
        await sendStatusUpdateEmail(orderId, 'processing', updatedOrder.trackingNumber, updatedOrder);
      }
      
      toast.success('Order completion undone');
    } catch (error) {
      toast.error('Failed to undo completion');
      console.error('Error undoing completion:', error);
    }
  };

  const updateTrackingNumber = async (orderId: string) => {
    try {
      // Don't allow updates if order is completed or cancelled
      const currentOrder = orders.find(o => o.id === orderId);
      if (currentOrder?.status === 'completed' || currentOrder?.status === 'cancelled') {
        toast.error(`Cannot update a ${currentOrder.status} order`);
        return;
      }

      const trackingNumber = trackingNumbers[orderId];
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackingNumber }),
      });

      if (!response.ok) throw new Error('Failed to update tracking number');

      const updatedOrder = await response.json();
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );

      if (updatedOrder) {
        await sendStatusUpdateEmail(orderId, updatedOrder.status, trackingNumber, updatedOrder);
      }
      
      toast.success('Tracking number updated successfully');
    } catch (error) {
      toast.error('Failed to update tracking number');
      console.error('Error updating tracking number:', error);
    }
  };

  const sendStatusUpdateEmail = async (
    orderId: string, 
    status: string, 
    trackingNumber: string | undefined,
    order: Order
  ) => {
    try {
      await fetch('/api/send-status-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: order.email,
          orderId,
          status,
          trackingNumber,
          customerName: `${order.firstName} ${order.lastName}`,
        }),
      });
    } catch (error) {
      console.error('Failed to send status update email:', error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this order? This action cannot be undone.'
    );
    
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete order');

      setOrders(prevOrders => 
        prevOrders.filter(order => order.id !== orderId)
      );
      
      toast.success('Order deleted successfully');
    } catch (error) {
      toast.error('Failed to delete order');
      console.error('Error deleting order:', error);
    }
  };

  const generateInvoicePDF = async (order: Order) => {
    try {
      const toastId = toast.loading('Generating invoice...');

      // Create a temporary div to render the invoice
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '794px'; // A4 width in pixels
      tempDiv.style.backgroundColor = 'white';
      document.body.appendChild(tempDiv);

      // Render the invoice component
      const { render } = await import('react-dom');
      const { Invoice } = await import('@/components/Invoice');
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      
      render(
        <Invoice
          orderId={order.id}
          date={order.createdAt}
          customerDetails={{
            firstName: order.firstName,
            lastName: order.lastName,
            email: order.email,
            phone: order.phone,
            street: order.street,
            city: order.city,
            state: order.state,
            district: order.district,
            postcode: order.postcode || '',
          }}
          items={order.items}
          totalPrice={order.totalPrice}
          shippingCost={order.shippingCost}
          grandTotal={order.grandTotal}
          paymentMethod={order.paymentMethod || 'cash_on_delivery'}
          paymentSlipUrl={order.paymentSlipUrl || undefined}
        />,
        tempDiv
      );

      // Wait for component to render and images to load
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.loading('Processing images...', { id: toastId });

      // Get the invoice content div
      const invoiceContent = tempDiv.querySelector('#invoice-content') as HTMLElement;
      if (!invoiceContent) {
        throw new Error('Invoice content not found');
      }

      // Calculate scaling factors based on number of items
      const itemCount = order.items.length;
      const getScaledSize = (baseSize: number) => {
        // More gradual scaling based on item count
        const scaleFactor = itemCount <= 2 ? 1 :
                          itemCount <= 4 ? 0.95 :
                          itemCount <= 6 ? 0.9 :
                          itemCount <= 8 ? 0.85 :
                          0.8;
        return Math.round(baseSize * scaleFactor);
      };

      // Calculate base dimensions and spacing
      const baseMargin = getScaledSize(24);
      const basePadding = itemCount <= 2 ? 40 :
                         itemCount <= 4 ? 35 :
                         itemCount <= 6 ? 30 :
                         itemCount <= 8 ? 25 :
                         20;

      // Apply responsive styles
      invoiceContent.style.width = '794px'; // A4 width in pixels
      invoiceContent.style.margin = '0 auto';
      invoiceContent.style.backgroundColor = 'white';
      invoiceContent.style.padding = `${basePadding}px`;

      // Add temporary styles for better scaling
      const styles = document.createElement('style');
      styles.textContent = `
        #invoice-content {
          font-size: ${getScaledSize(12)}px !important;
          line-height: 1.5 !important;
        }
        #invoice-content h1 { 
          font-size: ${getScaledSize(32)}px !important; 
          margin-bottom: ${baseMargin / 2}px !important;
          line-height: 1.2 !important;
        }
        #invoice-content h2 { 
          font-size: ${getScaledSize(22)}px !important; 
          margin-bottom: ${baseMargin / 2}px !important;
          line-height: 1.3 !important;
        }
        #invoice-content .text-4xl {
          font-size: ${getScaledSize(32)}px !important;
        }
        #invoice-content .text-2xl {
          font-size: ${getScaledSize(22)}px !important;
        }
        #invoice-content .text-xl {
          font-size: ${getScaledSize(20)}px !important;
        }
        #invoice-content .text-lg {
          font-size: ${getScaledSize(18)}px !important;
        }
        #invoice-content .text-base {
          font-size: ${getScaledSize(14)}px !important;
        }
        #invoice-content .text-sm {
          font-size: ${getScaledSize(12)}px !important;
        }
        #invoice-content .text-xs {
          font-size: ${getScaledSize(11)}px !important;
        }
        #invoice-content .billing-address {
          font-weight: 500 !important;
        }
        #invoice-content .billing-address .customer-name {
          font-size: ${getScaledSize(18)}px !important;
          font-weight: 600 !important;
          color: #1a1a1a !important;
        }
        #invoice-content .billing-address p {
          margin-bottom: ${getScaledSize(4)}px !important;
          color: #374151 !important;
        }
        #invoice-content table {
          font-size: ${getScaledSize(12)}px !important;
        }
        #invoice-content table th {
          font-size: ${getScaledSize(13)}px !important;
          font-weight: 600 !important;
        }
        #invoice-content .item-name {
          font-size: ${getScaledSize(13)}px !important;
          font-weight: 500 !important;
        }
        #invoice-content .totals-section {
          font-size: ${getScaledSize(14)}px !important;
        }
        #invoice-content .grand-total {
          font-size: ${getScaledSize(18)}px !important;
          font-weight: 600 !important;
        }
        #invoice-content .mb-12 {
          margin-bottom: ${baseMargin * 1.5}px !important;
        }
        #invoice-content .mb-8 {
          margin-bottom: ${baseMargin}px !important;
        }
        #invoice-content .mb-6 {
          margin-bottom: ${baseMargin * 0.75}px !important;
        }
        #invoice-content .mb-4 {
          margin-bottom: ${baseMargin * 0.5}px !important;
        }
        #invoice-content .mb-2 {
          margin-bottom: ${baseMargin * 0.25}px !important;
        }
        #invoice-content .p-8 {
          padding: ${baseMargin}px !important;
        }
        #invoice-content .p-4 {
          padding: ${baseMargin * 0.5}px !important;
        }
        #invoice-content .gap-12 {
          gap: ${baseMargin * 1.5}px !important;
        }
        #invoice-content .gap-4 {
          gap: ${baseMargin * 0.5}px !important;
        }
        #invoice-content .gap-2 {
          gap: ${baseMargin * 0.25}px !important;
        }
      `;
      document.head.appendChild(styles);

      // Create canvas with proper dimensions
      const canvas = await html2canvas(invoiceContent, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 794, // A4 width in pixels
        height: invoiceContent.scrollHeight,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('invoice-content');
          if (clonedElement) {
            clonedElement.style.margin = '0';
            clonedElement.style.padding = `${basePadding}px`;
            clonedElement.style.width = '794px';
            clonedElement.style.minHeight = '1123px';
            clonedElement.style.height = 'auto';
            clonedElement.style.overflow = 'visible';
          }

          // Ensure all images are loaded in the cloned document
          const images = clonedDoc.getElementsByTagName('img');
          Array.from(images).forEach(img => {
            if (img.dataset.originalSrc) {
              img.src = img.dataset.originalSrc;
            }
            img.style.opacity = '1';
            img.style.visibility = 'visible';
            img.style.maxWidth = 'none';
            img.style.maxHeight = 'none';
            img.style.position = 'relative';

            // Apply different sizes based on image type and number of items
            if (img.alt === 'Samruddhika Bags') {
              // Scale logo based on number of items
              const maxLogoWidth = 200;
              const logoScale = Math.max(0.6, 1 - (itemCount * 0.05));
              const logoWidth = Math.round(maxLogoWidth * logoScale);
              img.style.width = `${logoWidth}px`;
              img.style.height = 'auto';
            } else {
              // Scale product images based on number of items
              const maxImageSize = 64;
              const imageScale = Math.max(0.65, 1 - (itemCount * 0.05));
              const imageSize = Math.round(maxImageSize * imageScale);
              img.style.width = `${imageSize}px`;
              img.style.height = `${imageSize}px`;
              img.style.objectFit = 'cover';
            }
          });
        }
      });

      toast.loading('Creating PDF...', { id: toastId });

      // Create PDF with better quality settings
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'mm',
        orientation: 'portrait',
        compress: true,
        precision: 16
      });

      // Calculate dimensions to fit A4 perfectly
      const imgWidth = 210; // A4 width in mm
      const imgHeight = Math.min((canvas.height * imgWidth) / canvas.width, 297); // A4 height in mm
      const verticalOffset = Math.max(0, (297 - imgHeight) / 2); // Center vertically if smaller than A4

      // Calculate scale to fit content
      const scale = Math.min(
        210 / (canvas.width / 96 * 25.4),  // Width scale (96 DPI to mm)
        297 / (canvas.height / 96 * 25.4)   // Height scale (96 DPI to mm)
      );

      // Calculate the scaled height in mm
      const scaledHeight = (canvas.height * scale * 25.4) / 96;
      
      // Calculate number of pages needed
      const pageHeight = 297; // A4 height in mm
      const totalPages = Math.ceil(scaledHeight / pageHeight);

      // Add content to pages
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        // Calculate the position and height for this page's content
        const yOffset = -i * pageHeight; // Offset for current page
        const remainingHeight = scaledHeight - (i * pageHeight); // Height left to display
        const currentPageHeight = Math.min(remainingHeight, pageHeight); // Height for this page

        pdf.addImage(
          canvas.toDataURL('image/jpeg', 1.0),
          'JPEG',
          0,
          yOffset,
          210, // A4 width in mm
          scaledHeight,
          undefined,
          'FAST'
        );
      }

      // Download the PDF
      pdf.save(`invoice-${order.id}.pdf`);

      // Cleanup
      document.body.removeChild(tempDiv);
      document.head.removeChild(styles);
      
      toast.success('Invoice downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Manage Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden relative">
            <div className="absolute top-2 right-2 flex gap-2">
              <Button 
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/10"
                onClick={() => generateInvoicePDF(order)}
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button 
                variant="ghost"
                size="icon"
                onClick={() => deleteOrder(order.id)}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Order #{order.id}</p>
                    {order.status === 'completed' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {order.status === 'cancelled' && (
                      <span className="text-sm text-red-500 font-medium">Cancelled</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ordered on: {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} at {new Date(order.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Customer: {order.firstName} {order.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: {order.email}
                  </p>
                  {order.completedAt && (
                    <p className="text-sm text-green-600">
                      Completed on: {new Date(order.completedAt).toLocaleDateString()}
                    </p>
                  )}
                  {order.cancelledAt && (
                    <p className="text-sm text-red-600">
                      Cancelled on: {new Date(order.cancelledAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) => 
                        updateOrderStatus(order.id, value as Order['status'])
                      }
                      disabled={order.status === 'completed' || order.status === 'cancelled'}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tracking Number"
                      value={trackingNumbers[order.id] || ''}
                      onChange={(e) => 
                        setTrackingNumbers(prev => ({
                          ...prev,
                          [order.id]: e.target.value
                        }))
                      }
                      disabled={order.status === 'completed' || order.status === 'cancelled'}
                      className="w-[180px]"
                    />
                    <Button 
                      variant="outline"
                      onClick={() => updateTrackingNumber(order.id)}
                      disabled={order.status === 'completed' || order.status === 'cancelled'}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <p>Shipping Address:</p>
                <p>{order.street}</p>
                <p>{order.city}, {order.state} {order.postcode}</p>
              </div>

              {order.paymentMethod === 'bank_transfer' && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Payment Details</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Payment Method: Bank Transfer</p>
                    {order.paymentSlipUrl ? (
                      <div>
                        <p className="text-sm font-medium mb-2">Payment Slip:</p>
                        <a 
                          href={order.paymentSlipUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Image
                            src={order.paymentSlipUrl}
                            alt="Payment Slip"
                            width={200}
                            height={200}
                            className="rounded-lg border hover:opacity-90 transition-opacity"
                          />
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-red-500">No payment slip uploaded</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.id}`} className="flex gap-4">
                      <Image
                        src={item.selectedImage || item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × LKR {item.price.toFixed(2)}
                        </p>
                        {item.selectedColor && (
                          <div className="flex items-center gap-2 mt-1">
                            <div 
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {item.selectedColor}
                            </span>
                          </div>
                        )}
                        {item.selectedSize && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Size: {item.selectedSize}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <p>Total: LKR {order.grandTotal.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 