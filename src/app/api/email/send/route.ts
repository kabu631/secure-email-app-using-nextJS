import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { EmailFolder, Attachment } from '@/types';

// Define the request schema for validation
const emailSchema = z.object({
  to: z.array(z.string().email()).min(1),
  cc: z.array(z.string().email()).optional().default([]),
  subject: z.string().min(1),
  body: z.string().min(1),
  isEncrypted: z.boolean().optional().default(false),
  recipientPublicKey: z.string().optional(),
  attachments: z.array(z.object({
    id: z.string(),
    filename: z.string(),
    content: z.string(), // Base64 encoded
    contentType: z.string(),
    size: z.number()
  })).optional().default([]),
});

// Mock database to store sent emails for all users
const mockEmailStore: { [email: string]: any[] } = {};

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await request.json();
    const result = emailSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.format() },
        { status: 400 }
      );
    }

    const { to, cc, subject, body: emailBody, isEncrypted, attachments } = result.data;
    const fromEmail = session.user.email || '';
    const messageId = `mock-email-${uuidv4()}`;
    const now = new Date();

    // Create the sent email for the sender
    const sentEmail = {
      id: messageId,
      from: fromEmail,
      to,
      cc,
      subject,
      body: emailBody,
      attachments,
      isEncrypted,
      date: now,
      read: true,
      deleted: false,
      folder: EmailFolder.SENT
    };

    // Add to sender's sent folder
    if (!mockEmailStore[fromEmail]) {
      mockEmailStore[fromEmail] = [];
    }
    mockEmailStore[fromEmail].push(sentEmail);

    // Deliver to all recipients' inboxes
    const allRecipients = [...to, ...(cc || [])];
    for (const recipient of allRecipients) {
      if (!mockEmailStore[recipient]) {
        mockEmailStore[recipient] = [];
      }
      mockEmailStore[recipient].push({
        id: messageId,
        from: fromEmail,
        to,
        cc,
        subject,
        body: emailBody,
        attachments,
        isEncrypted,
        date: now,
        read: false,
        deleted: false,
        folder: EmailFolder.INBOX
      });
    }

    // Calculate total attachment size for logging
    const totalAttachmentSize = (attachments || []).reduce((total, attachment) => total + attachment.size, 0);
    const attachmentSizeKB = Math.round(totalAttachmentSize / 1024);

    // Log for debugging
    console.log('Email sent:', {
      from: fromEmail,
      to,
      cc,
      subject,
      body: emailBody.substring(0, 50) + (emailBody.length > 50 ? '...' : ''),
      attachments: attachments ? `${attachments.length} files (${attachmentSizeKB} KB)` : 'none',
      isEncrypted,
      recipients: allRecipients,
      mockStoreSize: Object.keys(mockEmailStore).length
    });

    return NextResponse.json({ 
      success: true, 
      messageId,
      recipients: allRecipients.length,
      attachmentCount: attachments.length
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

// Export the mock store for use in other routes
export { mockEmailStore }; 