// src/services/emailService.ts
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import dotenv from 'dotenv';

dotenv.config();

// สร้าง transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || ''
  }
});

// สร้างโฟลเดอร์สำหรับเก็บเทมเพลตอีเมลถ้ายังไม่มี
const templateDir = path.join(__dirname, '../templates/emails');
if (!fs.existsSync(templateDir)) {
  fs.mkdirSync(templateDir, { recursive: true });
  
  // สร้างเทมเพลตพื้นฐาน
  const defaultTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>{{title}}</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #0066FF; color: white; padding: 20px; text-align: center; }
      .content { padding: 20px; background-color: #f9f9f9; }
      .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>{{title}}</h1>
      </div>
      <div class="content">
        {{{content}}}
      </div>
      <div class="footer">
        <p>&copy; 2025 ColdChain Logistics. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
  
  fs.writeFileSync(path.join(templateDir, 'default.html'), defaultTemplate);
  
  // สร้างเทมเพลตสำหรับการลงทะเบียน
  const registrationTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Welcome to ColdChain Logistics</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #0066FF; color: white; padding: 20px; text-align: center; }
      .content { padding: 20px; background-color: #f9f9f9; }
      .button { background-color: #0066FF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
      .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to ColdChain Logistics</h1>
      </div>
      <div class="content">
        <p>Hello {{username}},</p>
        <p>Thank you for registering with ColdChain Logistics. We're excited to have you on board!</p>
        <p>To verify your email address, please click the button below:</p>
        <p style="text-align: center;">
          <a href="{{verificationUrl}}" class="button">Verify Email</a>
        </p>
        <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
        <p>{{verificationUrl}}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The ColdChain Logistics Team</p>
      </div>
      <div class="footer">
        <p>&copy; 2025 ColdChain Logistics. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
  
  fs.writeFileSync(path.join(templateDir, 'registration.html'), registrationTemplate);
}

/**
 * อ่านและคอมไพล์เทมเพลตอีเมล
 * @param templateName ชื่อไฟล์เทมเพลต
 */
const getEmailTemplate = (templateName: string) => {
  try {
    const templatePath = path.join(templateDir, `${templateName}.html`);
    if (fs.existsSync(templatePath)) {
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      return Handlebars.compile(templateSource);
    } else {
      console.warn(`Template ${templateName} not found, using default template`);
      const defaultPath = path.join(templateDir, 'default.html');
      const templateSource = fs.readFileSync(defaultPath, 'utf-8');
      return Handlebars.compile(templateSource);
    }
  } catch (error) {
    console.error(`Error loading email template ${templateName}:`, error);
    // ถ้าไม่พบเทมเพลต ให้ใช้เทมเพลตเริ่มต้น
    return Handlebars.compile('<div><h1>{{title}}</h1><p>{{content}}</p></div>');
  }
};

interface EmailOptions {
  to: string;
  subject: string;
  templateData: any;
  from?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: any[];
}

/**
 * ส่งอีเมลโดยใช้เทมเพลต
 */
export const sendTemplatedEmail = async (
  templateName: string,
  options: EmailOptions
) => {
  try {
    // ตรวจสอบว่าการตั้งค่าอีเมลถูกกำหนดไว้หรือไม่
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email credentials not configured. Email sending is disabled.');
      return { messageId: 'EMAIL_DISABLED', success: false };
    }
    
    const template = getEmailTemplate(templateName);
    const html = template(options.templateData);

    const mailOptions = {
      from: options.from || process.env.EMAIL_FROM || 'noreply@coldchain.com',
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      html,
      attachments: options.attachments || []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { ...info, success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * ส่งอีเมลยืนยันการลงทะเบียน
 */
export const sendRegistrationEmail = async (
  to: string,
  username: string,
  verificationUrl: string
) => {
  return sendTemplatedEmail('registration', {
    to,
    subject: 'Welcome to ColdChain Logistics - Please Verify Your Email',
    templateData: {
      username,
      verificationUrl
    }
  });
};

/**
 * ส่งอีเมลรีเซ็ตรหัสผ่าน
 */
export const sendPasswordResetEmail = async (
  to: string,
  username: string,
  resetUrl: string
) => {
  return sendTemplatedEmail('default', {
    to,
    subject: 'ColdChain Logistics - Password Reset Request',
    templateData: {
      title: 'Password Reset',
      content: `
        <p>Hello ${username},</p>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <p><a href="${resetUrl}" style="background-color: #0066FF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The ColdChain Logistics Team</p>
      `
    }
  });
};

/**
 * ส่งอีเมลแจ้งเตือนอุณหภูมิ
 */
export const sendTemperatureAlertEmail = async (
  to: string,
  orderNumber: string,
  temperature: number,
  threshold: { min: number, max: number },
  timestamp: Date
) => {
  return sendTemplatedEmail('default', {
    to,
    subject: `ALERT: Temperature Threshold Exceeded for Order ${orderNumber}`,
    templateData: {
      title: 'Temperature Alert',
      content: `
        <p>Alert: Temperature threshold exceeded for order ${orderNumber}.</p>
        <p>Current temperature: ${temperature}°C</p>
        <p>Acceptable range: ${threshold.min}°C to ${threshold.max}°C</p>
        <p>Time detected: ${timestamp.toLocaleString()}</p>
        <p>Please take immediate action to maintain product integrity.</p>
      `
    }
  });
};

/**
 * ส่งอีเมลยืนยันคำสั่งซื้อ
 */
export const sendOrderConfirmationEmail = async (
  to: string,
  orderDetails: {
    orderNumber: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    trackingUrl: string;
  }
) => {
  return sendTemplatedEmail('default', {
    to,
    subject: `ColdChain Logistics - Order Confirmation #${orderDetails.orderNumber}`,
    templateData: {
      title: 'Order Confirmation',
      content: `
        <p>Hello ${orderDetails.customerName},</p>
        <p>Thank you for your order. Your order #${orderDetails.orderNumber} has been confirmed and is being processed.</p>
        <p>You can track your shipment here: <a href="${orderDetails.trackingUrl}">${orderDetails.trackingUrl}</a></p>
        <p>Order details:</p>
 orderDetails.trackingUrl}">${orderDetails.trackingUrl}</a></p>
        <h3>Order Summary:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f2f2f2;">
            <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Item</th>
            <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">Quantity</th>
            <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Price</th>
          </tr>
          ${orderDetails.items.map(item => `
          <tr>
            <td style="text-align: left; padding: 8px; border: 1px solid #ddd;">${item.name}</td>
            <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
          </tr>
          `).join('')}
          <tr>
            <td colspan="2" style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>Total:</strong></td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>$${orderDetails.total.toFixed(2)}</strong></td>
          </tr>
        </table>
        <p>If you have any questions, please contact our customer service.</p>
        <p>Best regards,<br>The ColdChain Logistics Team</p>
      `
    }
  });
};

/**
 * ส่งอีเมลแจ้งสถานะการจัดส่ง
 */
export const sendShipmentStatusEmail = async (
  to: string,
  shipmentDetails: {
    orderNumber: string;
    customerName: string;
    status: string;
    location: string;
    timestamp: Date;
    estimatedDelivery: Date;
    trackingUrl: string;
  }
) => {
  return sendTemplatedEmail('default', {
    to,
    subject: `ColdChain Logistics - Shipment Update for Order #${shipmentDetails.orderNumber}`,
    templateData: {
      title: 'Shipment Status Update',
      content: `
        <p>Hello ${shipmentDetails.customerName},</p>
        <p>Your shipment for order #${shipmentDetails.orderNumber} has been updated:</p>
        <p><strong>Status:</strong> ${shipmentDetails.status}</p>
        <p><strong>Location:</strong> ${shipmentDetails.location}</p>
        <p><strong>Time:</strong> ${shipmentDetails.timestamp.toLocaleString()}</p>
        <p><strong>Estimated Delivery:</strong> ${shipmentDetails.estimatedDelivery.toLocaleDateString()}</p>
        <p>You can track your shipment here: <a href="${shipmentDetails.trackingUrl}">${shipmentDetails.trackingUrl}</a></p>
        <p>Thank you for choosing ColdChain Logistics.</p>
        <p>Best regards,<br>The ColdChain Logistics Team</p>
      `
    }
  });
};

// Export ฟังก์ชันทั้งหมด
export default {
  sendTemplatedEmail,
  sendRegistrationEmail,
  sendPasswordResetEmail,
  sendTemperatureAlertEmail,
  sendOrderConfirmationEmail,
  sendShipmentStatusEmail
};       