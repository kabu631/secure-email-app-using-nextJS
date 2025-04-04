import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { mockEmailStore } from '@/app/api/email/send/route';
import { EmailFolder } from '@/types';

// Define the request schema for validation
const deleteEmailSchema = z.object({
  ids: z.array(z.string()).min(1),
  folder: z.nativeEnum(EmailFolder)
});

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
    const result = deleteEmailSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.format() },
        { status: 400 }
      );
    }

    const { ids, folder } = result.data;
    const userEmail = session.user.email || '';
    
    // Check if the user has emails to delete
    if (!mockEmailStore[userEmail] || !mockEmailStore[userEmail].length) {
      return NextResponse.json(
        { error: 'No emails found for the user' },
        { status: 404 }
      );
    }

    // Find the user's emails
    const userEmails = mockEmailStore[userEmail];
    
    // Handle based on current folder
    if (folder === EmailFolder.TRASH) {
      // If already in trash, permanently delete
      mockEmailStore[userEmail] = userEmails.filter(email => !ids.includes(email.id));
    } else {
      // For other folders, move to trash or mark as deleted
      mockEmailStore[userEmail] = userEmails.map(email => {
        if (ids.includes(email.id) && email.folder === folder) {
          return {
            ...email,
            folder: EmailFolder.TRASH,
            deleted: true
          };
        }
        return email;
      });
    }

    console.log(`Deleted/moved ${ids.length} emails for user ${userEmail}`);
    
    return NextResponse.json({ 
      success: true, 
      deleted: ids.length 
    });
  } catch (error) {
    console.error('Error deleting emails:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete emails' },
      { status: 500 }
    );
  }
} 