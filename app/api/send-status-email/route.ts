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
    const { email, orderId, status, trackingNumber, customerName } = await request.json();

    const statusMessages = {
      pending: 'has been received and is pending processing',
      processing: 'is now being processed',
      shipped: 'has been shipped',
      delivered: 'has been delivered'
    };

    // Verify transporter
    await transporter.verify();

    const mailOptions = {
      from: `"${process.env.BUSINESS_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order #${orderId} Status Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #2c5282;">Order Status Update</h2>
          
          <p>Dear ${customerName},</p>
          
          <p>Your order #${orderId} ${statusMessages[status as keyof typeof statusMessages]}.</p>
          
          ${trackingNumber ? `
          <div style="margin: 20px 0; background-color: #f7fafc; border-radius: 5px; padding: 15px;">
            <h3 style="color: #2c5282; margin-bottom: 10px;">Tracking Information</h3>
            <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
            <p>Track your order here: <a href="https://track.samruddhibags.com/tracking/${trackingNumber}" style="color: #2c5282;">Click to track your order</a></p>
          </div>
          ` : ''}
          
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
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Status update email sent: %s', info.messageId);
    
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Status email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send status email', details: error.message },
      { status: 500 }
    );
  }
} 