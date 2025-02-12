import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Printer, Download } from 'lucide-react';
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
  date: string;
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

  const handlePrint = () => {
    window.print();
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
      invoiceElement.style.width = '1024px';
      invoiceElement.style.margin = '0 auto';
      invoiceElement.style.backgroundColor = 'white';
      invoiceElement.style.padding = '40px';

      // Create a canvas from the invoice content
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
        onclone: (clonedDoc) => {
          // Ensure all images are loaded in the cloned document
          const images = clonedDoc.getElementsByTagName('img');
          return new Promise((resolve) => {
            let loadedImages = 0;
            const totalImages = images.length;

            if (totalImages === 0) {
              resolve(undefined);
              return;
            }

            // Update loading message with progress
            toast.loading('Loading images... (0%)', {
              id: toastId,
            });

            for (let i = 0; i < totalImages; i++) {
              const img = images[i];
              if (img.complete) {
                loadedImages++;
                const progress = Math.round((loadedImages / totalImages) * 100);
                toast.loading(`Loading images... (${progress}%)`, {
                  id: toastId,
                });
                if (loadedImages === totalImages) resolve(undefined);
              } else {
                img.onload = () => {
                  loadedImages++;
                  const progress = Math.round((loadedImages / totalImages) * 100);
                  toast.loading(`Loading images... (${progress}%)`, {
                    id: toastId,
                  });
                  if (loadedImages === totalImages) resolve(undefined);
                };
                img.onerror = () => {
                  loadedImages++;
                  if (loadedImages === totalImages) resolve(undefined);
                };
              }
            }
          });
        }
      });

      // Restore original styles
      invoiceElement.style.cssText = originalStyle;

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
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to the PDF with high quality
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );

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
      <div className="print:hidden mb-8 flex justify-end gap-4">
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
        <Button onClick={handlePrint} variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
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
            <Image
              src="/images/logo_l.png"
              alt="Samruddhika Bags"
              width={200}
              height={67}
              className="mb-6"
              priority
            />

            <div className="text-lg font-semibold text-gray-800">INVOICE</div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-800 mb-2">Invoice #: {orderId}</p>
            <p className="text-gray-600 mb-4">Date: {format(new Date(date), 'dd MMMM yyyy')}</p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Amount Due</p>
              <p className="text-2xl font-bold text-gray-800">LKR {grandTotal.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Due upon receipt</p>
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
            <h2 className="text-xl font-semibold mb-4 text-gray-800">From:</h2>
            <div className="space-y-2 text-gray-600">
              <p className="text-lg font-medium text-gray-700">Samruddhika Bags</p>
              <p>123 Business Street</p>
              <p>Colombo, Sri Lanka</p>
              <p>Email: contact@samruddhika.com</p>
              <p>Phone: +94 XX XXX XXXX</p>
              
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Bill To:</h2>
            <div className="space-y-2 text-gray-600">
              <p className="text-lg font-medium text-gray-700">
                {customerDetails.firstName} {customerDetails.lastName}
              </p>
              <p>{customerDetails.street}</p>
              <p>{customerDetails.city}, {customerDetails.district}</p>
              <p>{customerDetails.state}, {customerDetails.postcode}</p>
              <p>Email: {customerDetails.email}</p>
              <p>Phone: {customerDetails.phone}</p>
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
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={item.selectedImage || item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          priority
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
              <span>Total:</span>
              <span>LKR {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-200 pt-8">
          <p className="text-gray-800 font-medium mb-2">Thank you for your business!</p>
          <p className="text-gray-600">For any queries, please contact us at support@samruddhika.com</p>
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