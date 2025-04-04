import nodemailer from 'nodemailer';
import { SMTPConfig } from '@/types';
import { encryptEmailContent } from '../encryption/aes';
import { createDigitalSignature } from '../encryption/aes';

// This is a server-side function to send emails
export async function sendEmail(
  from: string,
  to: string[],
  subject: string,
  body: string,
  isEncrypted: boolean = false,
  recipientPublicKey?: string,
  senderPrivateKey?: string,
  smtpConfig?: SMTPConfig
) {
  try {
    // Use provided SMTP config or default to environment variables
    const config: SMTPConfig = smtpConfig || {
      user: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASSWORD || '',
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true'
    };

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password
      }
    });

    let emailBody = body;
    let encryptionMetadata = null;

    // Add encryption if requested and recipient public key is available
    if (isEncrypted && recipientPublicKey) {
      const encryptionResult = encryptEmailContent(body, recipientPublicKey);
      
      // In real app, we would encrypt the AES key with the recipient's public key
      emailBody = encryptionResult.encryptedData;
      encryptionMetadata = {
        isEncrypted: true,
        encryptionMethod: 'AES-256-CBC',
        iv: encryptionResult.iv
      };
    }

    // Create digital signature if sender's private key is available
    let signature = null;
    if (senderPrivateKey) {
      signature = createDigitalSignature(body, senderPrivateKey);
    }

    // Create email headers with proper typing
    const headers: { [key: string]: string | string[] } = {
      'X-Secure-Email': isEncrypted ? 'encrypted' : 'plaintext'
    };
    
    // Add optional headers only if they exist
    if (encryptionMetadata) {
      headers['X-Encryption-Metadata'] = JSON.stringify(encryptionMetadata);
    }
    
    if (signature) {
      headers['X-Digital-Signature'] = signature;
    }

    // Create email
    const mailOptions = {
      from,
      to: to.join(','),
      subject,
      text: emailBody,
      headers
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 