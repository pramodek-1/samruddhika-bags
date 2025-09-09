import React, { useState } from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({ subsets: ['latin'] });

interface InvoiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedImage?: string;
  image: string;
}

interface InvoiceProps {
  orderId: string;
  date: Date | string;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    district: string;
    postcode: string;
  };
  items: InvoiceItem[];
  totalPrice: number;
  shippingCost: number;
  grandTotal: number;
  paymentMethod?: 'cash_on_delivery' | 'bank_transfer';
  paymentSlipUrl?: string;
}

export const Invoice: React.FC<InvoiceProps> = ({
  orderId,
  date,
  customerDetails,
  items,
  totalPrice,
  shippingCost,
  grandTotal,
  paymentMethod = 'cash_on_delivery',
  paymentSlipUrl,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (dateValue: Date | string) => {
    try {
      if (dateValue instanceof Date) {
        return format(dateValue, 'dd MMMM yyyy');
      }
      
      // If it's an ISO string, parse it directly
      if (dateValue.includes('T')) {
        return format(parseISO(dateValue), 'dd MMMM yyyy');
      }
      
      // If it's a date string without time
      if (dateValue.includes('-')) {
        return format(parseISO(dateValue), 'dd MMMM yyyy');
      }
      
      // Fallback to current date if invalid
      return format(new Date(), 'dd MMMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return format(new Date(), 'dd MMMM yyyy');
    }
  };

  const handleDownload = async () => {
    if (isGenerating) return; // Prevent multiple clicks

    try {
      setIsGenerating(true);
      const toastId = toast.loading('Preparing invoice for download...', {
        duration: Infinity, // Don't auto-dismiss
      });

      const invoiceElement = document.getElementById('invoice-content');
      if (!invoiceElement) {
        toast.error('Could not generate PDF. Please try again.');
        setIsGenerating(false);
        return;
      }

      // Update loading message
      toast.loading('Converting invoice to image...', {
        id: toastId,
      });

      // Set temporary styles for better PDF quality
      const originalStyle = invoiceElement.style.cssText;
      
      // Calculate scaling factors based on number of items
      const itemCount = items.length;
      const getScaledSize = (baseSize: number) => {
        const contentScale = Math.max(0.7, 1 - (itemCount * 0.05)); // Gradually reduce scale but not below 70%
        return Math.round(baseSize * contentScale);
      };

      // Calculate base dimensions and spacing
      const baseMargin = getScaledSize(24);
      const basePadding = itemCount <= 3 ? 40 : itemCount <= 5 ? 30 : 20;

      // Apply responsive styles
      invoiceElement.style.width = '794px'; // A4 width in pixels
      invoiceElement.style.margin = '0 auto';
      invoiceElement.style.backgroundColor = 'white';
      invoiceElement.style.padding = `${basePadding}px`;

      // Add temporary styles for better scaling
      const styles = document.createElement('style');
      styles.textContent = `
        #invoice-content {
          font-size: ${getScaledSize(12)}px !important;
        }
        #invoice-content h1 { 
          font-size: ${getScaledSize(28)}px !important; 
          margin-bottom: ${baseMargin / 2}px !important; 
        }
        #invoice-content h2 { 
          font-size: ${getScaledSize(20)}px !important; 
          margin-bottom: ${baseMargin / 2}px !important; 
        }
        #invoice-content .text-4xl {
          font-size: ${getScaledSize(28)}px !important;
        }
        #invoice-content .text-2xl {
          font-size: ${getScaledSize(20)}px !important;
        }
        #invoice-content .text-xl {
          font-size: ${getScaledSize(18)}px !important;
        }
        #invoice-content .text-lg {
          font-size: ${getScaledSize(16)}px !important;
        }
        #invoice-content .text-sm {
          font-size: ${getScaledSize(11)}px !important;
        }
        #invoice-content .text-xs {
          font-size: ${getScaledSize(10)}px !important;
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
        #invoice-content table {
          font-size: ${getScaledSize(11)}px !important;
        }
        #invoice-content .py-4 {
          padding-top: ${baseMargin * 0.5}px !important;
          padding-bottom: ${baseMargin * 0.5}px !important;
        }
        #invoice-content .space-y-2 > * {
          margin-top: ${baseMargin * 0.25}px !important;
        }
        #invoice-content .space-y-3 > * {
          margin-top: ${baseMargin * 0.375}px !important;
        }
        #invoice-content .pt-8 {
          padding-top: ${baseMargin}px !important;
        }
        #invoice-content .pt-3 {
          padding-top: ${baseMargin * 0.375}px !important;
        }
        #invoice-content .pt-2 {
          padding-top: ${baseMargin * 0.25}px !important;
        }
      `;
      document.head.appendChild(styles);

      // Create a canvas from the invoice content
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 794, // A4 width in pixels
        height: invoiceElement.scrollHeight, // Use actual content height
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('invoice-content');
          if (clonedElement) {
            clonedElement.style.margin = '0';
            clonedElement.style.padding = `${basePadding}px`;
            clonedElement.style.width = '794px'; // A4 width in pixels
            clonedElement.style.minHeight = '1123px'; // A4 height in pixels
            clonedElement.style.height = 'auto';
            clonedElement.style.overflow = 'visible';
          }
          // Ensure all images are loaded in the cloned document
          const images = clonedDoc.getElementsByTagName('img');
          
          // Force all images to be visible and properly sized in the clone
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

      // Restore original styles
      invoiceElement.style.cssText = originalStyle;
      document.head.removeChild(styles);

      // Update loading message
      toast.loading('Generating PDF file...', {
        id: toastId,
      });

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
      pdf.save(`invoice-${orderId}.pdf`);

      // Show success message
      toast.success('Invoice downloaded successfully!', {
        id: toastId,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-8 max-w-4xl mx-auto my-8 print:shadow-none print:my-0">
      {/* Action Buttons - Hidden when printing */}
      <div className="print:hidden mb-8 flex justify-end">
        <Button
          onClick={handleDownload}
          variant="outline"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="animate-pulse">Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      {/* Invoice Content */}
      <div id="invoice-content" className="bg-white p-8 rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">SAMRUDDHIKA BAGS MANUFACTURER</h1>
          <p className={`text-2xl ${dancingScript.className} mb-2`} style={{ color: '#FF0000' }}>
            More Than 20+ Years Business Experience
          </p>

        </div>

        <div className="flex justify-between items-start mb-12 border-b pb-8">
          <div>
            <img
              src="/images/logo_l.png"
              alt="Samruddhika Bags"
              style={{
                width: '200px',
                height: 'auto',
                marginBottom: '24px',
                display: 'block'
              }}
              className="mb-6"
            />

            
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-800 mb-2">Invoice #: {orderId}</p>
            <p className="text-gray-600 mb-4">Date: {formatDate(date)}</p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Amount Due</p>
              <p className="text-2xl font-bold text-gray-800">
                LKR {paymentMethod === 'bank_transfer' ? '0.00' : grandTotal.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {paymentMethod === 'bank_transfer' ? 'Paid in full' : 'Due upon receipt'}
              </p>
              <div className="border-t border-gray-200 mt-2 pt-2">
                <p className="text-sm font-medium text-gray-800">Payment Method</p>
                <p className="text-sm text-gray-600">
                  {paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Bank Transfer'}
                </p>
                {paymentMethod === 'bank_transfer' && paymentSlipUrl && (
                  <p className="text-xs text-gray-500 mt-1">
                    Payment slip uploaded
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-base font-semibold mb-2 text-gray-800">From:</h2>
            <div className="space-y-2 text-gray-600">
              <p className="text-sm font-medium text-gray-600">Samruddhika Bags Manufacturer</p>
              <p className="text-xs">no.290 2<sup>nd</sup> Step,</p>
              <p className="text-xs">Thambuttegama, Sri Lanka</p>
              <p className="text-xs">Email: contact@samruddhika.lk</p>
              <p className="text-xs">Phone: +94 72 414 9720</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-3 text-amber-800">Bill To</h2>
            <div className="space-y-1.5">
              <p className="text-lg font-semibold text-gray-900">
                {customerDetails.firstName} {customerDetails.lastName}
              </p>
              <p className="text-sm text-gray-700">{customerDetails.street}</p>
              <p className="text-sm text-gray-700">{customerDetails.city}, {customerDetails.district}</p>
              <p className="text-sm text-gray-700">{customerDetails.state}, {customerDetails.postcode}</p>
              <div className="pt-2 grid grid-cols-1 gap-1.5">
                <p className="text-sm"><span className="text-gray-600">Email:</span> <span className="font-medium text-gray-800">{customerDetails.email}</span></p>
                <p className="text-sm"><span className="text-gray-600">Phone:</span> <span className="font-medium text-gray-800">{customerDetails.phone}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-12">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 text-gray-800 font-semibold">Item</th>
                <th className="text-right py-4 text-gray-800 font-semibold">Quantity</th>
                <th className="text-right py-4 text-gray-800 font-semibold">Price</th>
                <th className="text-right py-4 text-gray-800 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={`${item.id}`}>
                  <td className="py-4">
                    <div className="flex items-center gap-10">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden" style={{ minHeight: '64px', minWidth: '64px' }}>
                        {/* Use regular img for PDF generation compatibility */}
                        <img
                          src={item.selectedImage || item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          style={{
                            width: '64px',
                            height: '64px',
                            objectFit: 'cover'
                          }}
                          data-original-src={item.selectedImage || item.image}
                        />
                      </div>
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-4 text-gray-600">{item.quantity}</td>
                  <td className="text-right py-4 text-gray-600">LKR {item.price.toFixed(2)}</td>
                  <td className="text-right py-4 font-medium text-gray-800">
                    LKR {(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-80 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>LKR {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping:</span>
              <span>LKR {shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-semibold text-gray-800 border-t border-gray-200 pt-3">
              <span>Total{paymentMethod === 'bank_transfer' && <span className="text-red-600"> (Paid)</span>}:</span>
              <span>LKR {grandTotal.toFixed(2)}</span>
            </div>
            {paymentMethod === 'bank_transfer' && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Payment Status:</span>
                <span>Paid via Bank Transfer</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-200 pt-8">
          <p className="text-gray-800 font-medium mb-2">Thank you for your business!</p>
          <p className="text-gray-600">For any queries, please contact us at support@samruddhika.lk</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          #invoice-content {
            width: 100% !important;
            padding: 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </Card>
  );
}; 