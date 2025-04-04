"use client";

import { Email, Attachment } from '@/types';

interface EmailViewProps {
  email: Email | null;
  onClose: () => void;
  isMobile?: boolean;
}

export default function EmailView({ email, onClose, isMobile = false }: EmailViewProps) {
  if (!email) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-800 p-4 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="mb-2 text-indigo-500 dark:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <p className="text-sm font-medium">Select an email to view</p>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-white dark:bg-gray-800 shadow-sm">
      <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-2">{email.subject}</h2>
        <button
          onClick={onClose}
          className="rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
        >
          {isMobile && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
          {isMobile ? 'Back' : 'Close'}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 rounded-md bg-gray-50 dark:bg-gray-700 p-4">
          <div className="mb-2 flex flex-col sm:flex-row sm:justify-between">
            <div className="mb-1 sm:mb-0">
              <span className="font-bold text-gray-800 dark:text-gray-200">From:</span>{' '}
              <span className="text-gray-700 dark:text-gray-300">{email.from}</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(email.date)}
            </div>
          </div>
          
          <div className="mb-2">
            <span className="font-bold text-gray-800 dark:text-gray-200">To:</span>{' '}
            <span className="text-gray-700 dark:text-gray-300">{email.to.join(', ')}</span>
          </div>
          
          {email.cc && email.cc.length > 0 && (
            <div className="mb-2">
              <span className="font-bold text-gray-800 dark:text-gray-200">CC:</span>{' '}
              <span className="text-gray-700 dark:text-gray-300">{email.cc.join(', ')}</span>
            </div>
          )}
          
          {email.isEncrypted && (
            <div className="mt-2 rounded-md bg-indigo-50 dark:bg-indigo-900/30 p-2 text-sm text-indigo-600 dark:text-indigo-400 flex items-center">
              <span className="mr-2" role="img" aria-label="lock">🔒</span>
              This email is encrypted and secure
            </div>
          )}
        </div>
        
        <div className="mb-6 whitespace-pre-wrap text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md p-2">
          {email.body}
        </div>
        
        {email.attachments && email.attachments.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">Attachments:</h3>
            <ul className="space-y-2">
              {email.attachments.map((attachment: Attachment) => (
                <li key={attachment.id} className="flex items-center rounded-md border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
                  <span className="mr-2">📎</span>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{attachment.filename}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(attachment.size / 1024)} KB
                    </div>
                  </div>
                  <button
                    className="ml-auto rounded-md bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-xs text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
                    onClick={() => {
                      // Download attachment
                      const dataUrl = `data:${attachment.contentType};base64,${attachment.content}`;
                      const a = document.createElement('a');
                      a.href = dataUrl;
                      a.download = attachment.filename;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 