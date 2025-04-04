"use client";

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import EmailList from '@/components/email/EmailList';
import EmailView from '@/components/email/EmailView';
import ComposeEmail from '@/components/email/ComposeEmail';
import Sidebar from '@/components/email/Sidebar';
import ThemeToggle from '@/components/ThemeToggle';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { Email, EmailFolder, Attachment } from '@/types';

// Dashboard component with session access
function DashboardContent() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [currentFolder, setCurrentFolder] = useState<EmailFolder>(EmailFolder.INBOX);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Show email view and hide sidebar on mobile when an email is selected
  useEffect(() => {
    if (isMobile && selectedEmail) {
      setShowSidebar(false);
    }
  }, [selectedEmail, isMobile]);

  // Fetch emails when folder changes
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/email/inbox?folder=${currentFolder}`);
        const data = await response.json();
        
        if (data.success) {
          setEmails(data.emails);
        } else {
          console.error('Failed to fetch emails:', data.error);
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();
  }, [currentFolder]);

  // Handle folder change
  const handleFolderChange = (folder: EmailFolder) => {
    setCurrentFolder(folder);
    setSelectedEmail(null);
    
    // On mobile, close the sidebar after selecting a folder
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  // Handle email selection
  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
  };

  // Handle email deletion
  const handleDeleteEmails = async (emailIds: string[]) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/email/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: emailIds,
          folder: currentFolder
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // If we're currently viewing a deleted email, close it
        if (selectedEmail && emailIds.includes(selectedEmail.id)) {
          setSelectedEmail(null);
        }
        
        // Refresh emails
        const refreshResponse = await fetch(`/api/email/inbox?folder=${currentFolder}`);
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          setEmails(refreshData.emails);
        }
      } else {
        console.error('Failed to delete emails:', data.error);
      }
    } catch (error) {
      console.error('Error deleting emails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle compose email modal
  const toggleComposeEmail = () => {
    setIsComposeOpen(!isComposeOpen);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Handle email send - updated to include CC
  const handleSendEmail = async (
    to: string[], 
    cc: string[], 
    subject: string, 
    body: string, 
    isEncrypted: boolean,
    attachments: Attachment[] = []
  ) => {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          cc,
          subject,
          body,
          isEncrypted,
          attachments,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsComposeOpen(false);
        // If we're in the sent folder, refresh emails
        if (currentFolder === EmailFolder.SENT) {
          // Fetch emails again
          const response = await fetch(`/api/email/inbox?folder=${currentFolder}`);
          const data = await response.json();
          
          if (data.success) {
            setEmails(data.emails);
          }
        }
      } else {
        console.error('Failed to send email:', data.error);
      }
      
      return data.success;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex items-center justify-between bg-indigo-600 dark:bg-indigo-800 px-4 py-3 sm:px-6 text-white shadow-md">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-3 md:hidden text-white"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Secure Email</h1>
        </div>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <span className="hidden sm:inline">{session?.user?.email}</span>
          <button
            onClick={() => router.push('/settings')}
            className="rounded-md bg-indigo-700 dark:bg-indigo-600 px-3 py-1 text-sm hover:bg-indigo-800 dark:hover:bg-indigo-700"
          >
            Settings
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="rounded-md bg-rose-600 dark:bg-rose-700 px-3 py-1 text-sm hover:bg-rose-700 dark:hover:bg-rose-800"
          >
            Logout
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <Sidebar 
            currentFolder={currentFolder} 
            onFolderChange={handleFolderChange}
            onComposeClick={toggleComposeEmail}
          />
        )}
        
        <div className="flex flex-1 overflow-hidden">
          {(!isMobile || (isMobile && !selectedEmail)) && (
            <EmailList
              emails={emails}
              isLoading={isLoading}
              onEmailSelect={handleEmailSelect}
              onDeleteEmails={handleDeleteEmails}
              selectedEmailId={selectedEmail?.id}
              folder={currentFolder}
            />
          )}
          
          {(!isMobile || (isMobile && selectedEmail)) && (
            <EmailView 
              email={selectedEmail}
              onClose={() => {
                setSelectedEmail(null);
                if (isMobile) {
                  setShowSidebar(false);
                }
              }}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
      
      {isComposeOpen && (
        <ComposeEmail
          onClose={toggleComposeEmail}
          onSend={handleSendEmail}
          userEmail={session?.user?.email || ''}
          publicKey={session?.user?.publicKey || ''}
        />
      )}
    </div>
  );
}

// Main component that ensures auth is properly handled
export default function DashboardPage() {
  return (
    <AuthWrapper>
      <DashboardContent />
    </AuthWrapper>
  );
} 