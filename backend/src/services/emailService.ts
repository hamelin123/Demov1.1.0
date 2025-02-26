import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

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

/**
 * อ่านและคอมไพล์เทมเพลตอีเมล
 * @param templateName ชื่อไฟล์เทมเพลต
 */
const getEmailTemplate = (templateName: string) => {
  try {
    const templatePath = path.join(__dirname, `../templates/emails/${templateName}.html`);
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    return Handlebars.compile(templateSource);
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
    return info;
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