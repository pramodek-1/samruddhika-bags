import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { email, orderId, customerName, items, totalPrice, shippingCost, grandTotal } = await request.json();

    // Verify transporter
    await transporter.verify();

    const orderItemsHtml = items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
          ${item.name}
          ${item.selectedColor ? `<br><span style="color: #718096; font-size: 12px;">Color: ${item.selectedColor}</span>` : ''}
          ${item.selectedSize ? `<br><span style="color: #718096; font-size: 12px;">Size: ${item.selectedSize}</span>` : ''}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">LKR ${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">LKR ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"${process.env.BUSINESS_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Order Confirmation - Your Order Has Been Placed!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #2c5282;">Thank you for your order!</h2>
          <p>Dear ${customerName},</p>
          <p>We're excited to confirm that your order has been successfully placed.</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          
          <div style="margin: 20px 0; background-color: #f7fafc; border-radius: 5px; padding: 15px;">
            <h3 style="color: #2c5282; margin-bottom: 10px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
              <thead>
                <tr style="background-color: #edf2f7;">
                  <th style="padding: 8px; text-align: left;">Product</th>
                  <th style="padding: 8px; text-align: center;">Quantity</th>
                  <th style="padding: 8px; text-align: right;">Price</th>
                  <th style="padding: 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 8px; text-align: right;"><strong>Subtotal:</strong></td>
                  <td style="padding: 8px; text-align: right;">LKR ${totalPrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 8px; text-align: right;"><strong>Shipping:</strong></td>
                  <td style="padding: 8px; text-align: right;">LKR ${shippingCost.toFixed(2)}</td>
                </tr>
                <tr style="background-color: #edf2f7;">
                  <td colspan="3" style="padding: 8px; text-align: right;"><strong>Grand Total:</strong></td>
                  <td style="padding: 8px; text-align: right;"><strong>LKR ${grandTotal.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p>We'll start processing your order right away and keep you updated on its status.</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f7fafc; border-radius: 5px;">
            <h3 style="color: #2c5282; margin-bottom: 10px;">Contact Information</h3>
            <p><strong>Email:</strong> ${process.env.EMAIL_USER}</p>
            <p><strong>Phone:</strong> +94 72 414 9720</p>
            <p><strong>WhatsApp:</strong> https://wa.me/94724149720</p>
            <p><strong>Address:</strong> no.290 2<sup>nd</sup> Step, Thambuttegama</p>
          </div>

          <p>If you have any questions about your order, please don't hesitate to contact us through any of the above channels.</p>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p>Best regards,<br>
            <strong>${process.env.BUSINESS_NAME}</strong></p>
          </div>
          
          <div style="margin-top: 20px; font-size: 12px; color: #718096;">
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
} 