import { simpleParser } from 'mailparser';
import imaps from 'imap-simple';
import { Email, EmailFolder, IMAPConfig, Attachment } from '@/types';
import { aesDecrypt } from '../encryption/aes';
import { verifyDigitalSignature } from '../encryption/aes';
import { v4 as uuidv4 } from 'uuid';

// This is a server-side function to fetch emails
export async function fetchEmails(
  folder: EmailFolder = EmailFolder.INBOX,
  privateKey?: string,
  imapConfig?: IMAPConfig
) {
  try {
    // Use provided IMAP config or default to environment variables
    const config: IMAPConfig = imapConfig || {
      user: process.env.IMAP_USER || '',
      password: process.env.IMAP_PASSWORD || '',
      host: process.env.IMAP_HOST || 'imap.example.com',
      port: parseInt(process.env.IMAP_PORT || '993'),
      tls: process.env.IMAP_TLS === 'true'
    };

    // Create IMAP connection configuration
    const imapConnection: imaps.ImapSimpleOptions = {
      imap: {
        user: config.user,
        password: config.password,
        host: config.host,
        port: config.port,
        tls: config.tls,
        authTimeout: 10000
      }
    };

    // Connect to the IMAP server
    const connection = await imaps.connect(imapConnection);
    
    // Open the specified mailbox
    await connection.openBox(folder);
    
    // Search for all emails in the mailbox (last 50 emails)
    const searchCriteria = ['ALL'];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      markSeen: false
    };
    
    const messages = await connection.search(searchCriteria, fetchOptions);
    
    // Parse and process each email
    const emails: Email[] = [];
    
    for (const message of messages.slice(-50)) { // Get last 50 emails
      const headerPart = message.parts.find((part: imaps.MessagePart) => part.which === 'HEADER');
      const bodyPart = message.parts.find((part: imaps.MessagePart) => part.which === 'TEXT');
      
      const headerInfo = headerPart?.body || {};
      const body = bodyPart?.body || '';
      
      // Extract encryption metadata and digital signature if they exist
      const isEncrypted = headerInfo['x-secure-email']?.[0]?.toLowerCase() === 'encrypted';
      const encryptionMetadata = headerInfo['x-encryption-metadata']?.[0];
      const digitalSignature = headerInfo['x-digital-signature']?.[0];
      
      // Parse the raw email
      const parsed = await simpleParser(body);
      
      let emailBody = parsed.text || '';
      
      // Decrypt the email if it's encrypted and we have the private key
      if (isEncrypted && privateKey && encryptionMetadata) {
        try {
          const metadata = JSON.parse(encryptionMetadata);
          const decrypted = aesDecrypt(emailBody, privateKey, metadata.iv);
          emailBody = decrypted.decryptedData;
        } catch (error) {
          console.error('Error decrypting email:', error);
          // Keep the encrypted version if decryption fails
        }
      }
      
      // Verify digital signature if available
      let signatureValid = false;
      if (digitalSignature && headerInfo.from?.[0]) {
        // In a real app, we would get the sender's public key from a key server
        // For demo, we use a simplified check
        const senderPublicKey = ''; // This would be fetched from a key server
        signatureValid = verifyDigitalSignature(emailBody, digitalSignature, senderPublicKey);
      }
      
      // Process attachments
      const attachments: Attachment[] = [];
      if (parsed.attachments && parsed.attachments.length > 0) {
        for (const attachment of parsed.attachments) {
          const content = attachment.content.toString('base64');
          
          attachments.push({
            id: uuidv4(),
            filename: attachment.filename || 'unnamed',
            content,
            contentType: attachment.contentType || 'application/octet-stream',
            size: content.length
          });
        }
      }
      
      // Create the email object
      emails.push({
        id: uuidv4(),
        from: headerInfo.from?.[0] || '',
        to: headerInfo.to || [],
        subject: headerInfo.subject?.[0] || '',
        body: emailBody,
        attachments,
        isEncrypted,
        date: new Date(headerInfo.date?.[0] || Date.now()),
        read: false,
        deleted: false,
        folder
      });
    }
    
    // Close the connection
    connection.end();
    
    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}

// Additional functions to manage emails
export async function markEmailAsRead(emailId: string, imapConfig?: IMAPConfig) {
  // Implementation to mark an email as read on the IMAP server
  return true;
}

export async function deleteEmail(emailId: string, imapConfig?: IMAPConfig) {
  // Implementation to delete an email or move it to trash folder
  return true;
}

export async function moveEmail(emailId: string, targetFolder: EmailFolder, imapConfig?: IMAPConfig) {
  // Implementation to move an email to a different folder
  return true;
} 