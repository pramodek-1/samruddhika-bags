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
      delivered: 'has been delivered',
      completed: 'has been completed'
    };

    // Special email template for completed orders
    const emailTemplate = status === 'completed' ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; animation: fadeIn 1s ease-in;">
          <div style="display: inline-block; margin: 20px 0;">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" style="margin: 0 auto;">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                style="animation: checkmark 0.8s ease-in-out forwards;"/>
              <path d="M22 4L12 14.01l-3-3" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                style="animation: checkmark 0.8s ease-in-out forwards;"/>
            </svg>
          </div>
          <h2 style="color: #2c5282; animation: slideDown 0.5s ease-out;">Thank You for Your Purchase!</h2>
        </div>
        
        <div style="animation: fadeIn 1s ease-in 0.3s both;">
          <p>Dear ${customerName},</p>
          
          <p style="font-size: 1.1em; color: #2c5282;">Thank you for shopping with Samruddhika Bags! Your order #${orderId} has been successfully completed.</p>
          
          <p>We truly appreciate your business and hope you are completely satisfied with your purchase. If you have any feedback about our products or service, we'd love to hear from you!</p>
        </div>
        
        ${trackingNumber ? `
        <div style="margin: 20px 0; background-color: #f7fafc; border-radius: 5px; padding: 15px; animation: slideIn 0.5s ease-out 0.5s both;">
          <h3 style="color: #2c5282; margin-bottom: 10px;">Tracking Information</h3>
          <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
          <p>Track your order here: <a href="https://track.samruddhibags.com/tracking/${trackingNumber}" 
            style="color: #2c5282; text-decoration: none; border-bottom: 2px solid #2c5282; transition: all 0.3s ease;">
            Click to track your order</a></p>
        </div>
        ` : ''}
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f7fafc; border-radius: 5px; animation: slideIn 0.5s ease-out 0.7s both;">
          <h3 style="color: #2c5282; margin-bottom: 10px;">Contact Information</h3>
          <p><strong>Email:</strong> ${process.env.EMAIL_USER}</p>
          <p><strong>Phone:</strong> +94 72 414 9720</p>
          <p><strong>WhatsApp:</strong> https://wa.me/94724149720</p>
          <p><strong>Address:</strong> no.290 2<sup>nd</sup> Step, Thambuttegama</p>
        </div>

        <p style="text-align: center; font-size: 1.1em; color: #2c5282; animation: fadeIn 1s ease-in 1s both;">
          We hope to see you again soon!
        </p>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; animation: fadeIn 1s ease-in 1.2s both;">
          <p>Best regards,<br>
          <strong>${process.env.BUSINESS_NAME}</strong></p>
        </div>

        <style>
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { 
              transform: translateX(-20px);
              opacity: 0;
            }
            to { 
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes slideDown {
            from { 
              transform: translateY(-20px);
              opacity: 0;
            }
            to { 
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes checkmark {
            0% {
              stroke-dashoffset: 100;
              opacity: 0;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
          }
        </style>
      </div>
    ` : `
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
    `;

    const mailOptions = {
      from: `"${process.env.BUSINESS_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: status === 'completed' 
        ? `Thank You for Your Purchase - Order #${orderId}`
        : `Order #${orderId} Status Update`,
      html: emailTemplate,
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