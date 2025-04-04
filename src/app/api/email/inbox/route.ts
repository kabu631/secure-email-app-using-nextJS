import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Email, EmailFolder } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '@/lib/auth';
import { mockEmailStore } from '../send/route';

// Keep track of users who have already had default emails generated
const defaultEmailsGenerated: { [email: string]: Set<EmailFolder> } = {};

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated with proper auth options
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email || '';

    // Get folder from query params or default to inbox
    const searchParams = request.nextUrl.searchParams;
    const folderParam = searchParams.get('folder');
    const folder = folderParam 
      ? folderParam as EmailFolder 
      : EmailFolder.INBOX;
    
    // Get emails from mock store if available
    let emails: Email[] = [];
    
    if (mockEmailStore[userEmail]) {
      // Filter emails by the requested folder
      emails = mockEmailStore[userEmail]
        .filter(email => email.folder === folder)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    // Initialize the user in our default emails tracking if not already there
    if (!defaultEmailsGenerated[userEmail]) {
      defaultEmailsGenerated[userEmail] = new Set();
    }
    
    // If no emails in the store AND we haven't generated default emails for this folder yet
    if (emails.length === 0 && !defaultEmailsGenerated[userEmail].has(folder)) {
      emails = generateMockEmails(folder, userEmail);
      
      // Add these to the mock store
      if (!mockEmailStore[userEmail]) {
        mockEmailStore[userEmail] = [];
      }
      
      if (emails.length > 0) {
        mockEmailStore[userEmail].push(...emails);
        
        // Mark that we've generated default emails for this folder
        defaultEmailsGenerated[userEmail].add(folder);
      }
    }

    console.log(`Fetched ${emails.length} emails for ${userEmail} from ${folder} folder`);

    return NextResponse.json({ 
      success: true,
      emails
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}

// Function to generate mock emails for demonstration
function generateMockEmails(folder: EmailFolder, userEmail: string): Email[] {
  const currentDate = new Date();
  const emails: Email[] = [];

  // Generate different emails based on the folder
  switch (folder) {
    case EmailFolder.INBOX:
      // Demo user gets emails from our test accounts
      if (userEmail === 'demo@example.com') {
        emails.push({
          id: uuidv4(),
          from: 'test1@example.com',
          to: [userEmail],
          cc: ['test2@example.com'],
          subject: 'Testing CC functionality',
          body: 'This is a test email with CC. Both you and test2@example.com should receive this message.',
          isEncrypted: true,
          date: new Date(currentDate.getTime() - 1000 * 60 * 10), // 10 minutes ago
          read: false,
          deleted: false,
          folder: EmailFolder.INBOX
        });
      }
      
      // Test1 gets emails from demo and test2
      if (userEmail === 'test1@example.com') {
        emails.push({
          id: uuidv4(),
          from: 'demo@example.com',
          to: [userEmail],
          subject: 'Welcome to the test account',
          body: 'Hi Test User 1, welcome to our secure email platform. You can use this account to send and receive secure messages.',
          isEncrypted: false,
          date: new Date(currentDate.getTime() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          deleted: false,
          folder: EmailFolder.INBOX
        });
      }
      
      // Test2 gets emails with CC
      if (userEmail === 'test2@example.com') {
        emails.push({
          id: uuidv4(),
          from: 'test1@example.com',
          to: ['demo@example.com'],
          cc: [userEmail],
          subject: 'You are CCed on this message',
          body: 'This message was sent to demo@example.com with you in CC. You can reply to all to continue the conversation.',
          isEncrypted: true,
          date: new Date(currentDate.getTime() - 1000 * 60 * 45), // 45 minutes ago
          read: false,
          deleted: false,
          folder: EmailFolder.INBOX
        });
      }
      
      // Add some common emails for all users
      emails.push({
        id: uuidv4(),
        from: 'support@securemail.com',
        to: [userEmail],
        subject: 'Your Account Setup',
        body: 'Your secure email account has been set up successfully. You can now send and receive encrypted emails. If you have any questions, please contact our support team.',
        isEncrypted: false,
        date: new Date(currentDate.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true,
        deleted: false,
        folder: EmailFolder.INBOX
      });
      break;

    case EmailFolder.SENT:
      // Each user has different sent items
      if (userEmail === 'demo@example.com') {
        emails.push({
          id: uuidv4(),
          from: userEmail,
          to: ['test1@example.com', 'test2@example.com'],
          subject: 'Group message to test users',
          body: 'This is a message sent to both test users. Please reply to confirm you received it.',
          isEncrypted: true,
          date: new Date(currentDate.getTime() - 1000 * 60 * 45), // 45 minutes ago
          read: true,
          deleted: false,
          folder: EmailFolder.SENT
        });
      }
      
      if (userEmail === 'test1@example.com') {
        emails.push({
          id: uuidv4(),
          from: userEmail,
          to: ['demo@example.com'],
          cc: ['test2@example.com'],
          subject: 'Response to your message',
          body: 'I received your message. Test2 is also included in this conversation via CC.',
          isEncrypted: true,
          date: new Date(currentDate.getTime() - 1000 * 60 * 15), // 15 minutes ago
          read: true,
          deleted: false,
          folder: EmailFolder.SENT
        });
      }
      
      if (userEmail === 'test2@example.com') {
        emails.push({
          id: uuidv4(),
          from: userEmail,
          to: ['demo@example.com', 'test1@example.com'],
          subject: 'My introduction',
          body: 'Hello everyone, I\'m Test User 2. Looking forward to our secure communications.',
          isEncrypted: false,
          date: new Date(currentDate.getTime() - 1000 * 60 * 60), // 1 hour ago
          read: true,
          deleted: false,
          folder: EmailFolder.SENT
        });
      }
      break;

    // Other folders remain mostly the same for all users
    case EmailFolder.DRAFT:
      emails.push({
        id: uuidv4(),
        from: userEmail,
        to: ['recipient@example.com'],
        subject: 'Draft message',
        body: 'This is a draft message that hasn\'t been sent yet.\n\n[DRAFT - NOT COMPLETE]',
        isEncrypted: false,
        date: new Date(currentDate.getTime() - 1000 * 60 * 60), // 1 hour ago
        read: true,
        deleted: false,
        folder: EmailFolder.DRAFT
      });
      break;

    case EmailFolder.TRASH:
      emails.push({
        id: uuidv4(),
        from: 'spam@unwanted.com',
        to: [userEmail],
        subject: 'You Won a Prize!',
        body: 'Congratulations! You\'ve won a prize in our sweepstakes. Click the link below to claim your reward.',
        isEncrypted: false,
        date: new Date(currentDate.getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        read: true,
        deleted: true,
        folder: EmailFolder.TRASH
      });
      break;

    case EmailFolder.SPAM:
      emails.push({
        id: uuidv4(),
        from: 'noreply@suspicious.com',
        to: [userEmail],
        subject: 'Urgent: Your Account Needs Verification',
        body: 'Your account needs immediate verification. Please click the link below to confirm your identity.',
        isEncrypted: false,
        date: new Date(currentDate.getTime() - 1000 * 60 * 60 * 3), // 3 hours ago
        read: false,
        deleted: false,
        folder: EmailFolder.SPAM
      });
      break;
  }

  return emails;
} 