"use client";

import { useState } from 'react';
import { Attachment } from '@/types';

interface ComposeEmailProps {
  onClose: () => void;
  onSend: (to: string[], cc: string[], subject: string, body: string, isEncrypted: boolean, attachments: Attachment[]) => Promise<boolean>;
  userEmail: string;
  publicKey: string;
}

export default function ComposeEmail({ onClose, onSend, userEmail, publicKey }: ComposeEmailProps) {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB limit
    
    // Check for files that are too large
    const oversizedFiles = files.filter(file => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      setError(`Files exceeding 5MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    // Process each file
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          // Extract the base64 content without the data URL prefix
          const base64Content = event.target.result.toString().split(',')[1];
          
          // Create a new attachment
          const newAttachment: Attachment = {
            id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            filename: file.name,
            content: base64Content,
            contentType: file.type,
            size: file.size
          };
          
          setAttachments(prev => [...prev, newAttachment]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Clear the file input
    e.target.value = '';
  };
  
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!to) {
      setError('Please enter at least one recipient email');
      return;
    }
    
    if (!subject) {
      setError('Please enter a subject');
      return;
    }
    
    if (!body) {
      setError('Please enter a message');
      return;
    }
    
    // Parse recipients
    const recipients = to.split(',').map(email => email.trim());
    
    // Parse CC recipients
    const ccRecipients = cc ? cc.split(',').map(email => email.trim()) : [];
    
    // Validate all emails (both TO and CC)
    const allEmails = [...recipients, ...ccRecipients];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = allEmails.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      setError(`Invalid email address(es): ${invalidEmails.join(', ')}`);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await onSend(recipients, ccRecipients, subject, body, isEncrypted, attachments);
      
      if (success) {
        onClose();
      } else {
        setError('Failed to send email. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while sending the email');
      console.error('Error sending email:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-gray-800 p-5 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compose New Email</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-3 rounded-md bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-800 dark:text-red-300">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              From
            </label>
            <input
              id="from"
              type="text"
              value={userEmail}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-gray-500 dark:text-gray-400 shadow-sm"
            />
          </div>
          
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              To
            </label>
            <input
              id="to"
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Separate multiple emails with commas
            </p>
          </div>
          
          <div>
            <label htmlFor="cc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              CC
            </label>
            <input
              id="cc"
              type="text"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="cc@example.com, cc2@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Carbon copy recipients (optional)
            </p>
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
          </div>

          {/* File Attachments */}
          <div>
            <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Attachments
            </label>
            <div className="mt-1 flex items-center">
              <label className="cursor-pointer rounded-md bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50">
                <span>Add Files</span>
                <input
                  id="attachments"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
              </label>
              <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                Maximum file size: 5MB
              </span>
            </div>
            
            {/* Attachment List */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                {attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between rounded-md bg-gray-50 dark:bg-gray-700 px-3 py-2">
                    <div className="flex items-center">
                      <span className="mr-2">📎</span>
                      <div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">{attachment.filename}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(attachment.size / 1024)} KB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      disabled={isLoading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              id="encrypt"
              type="checkbox"
              checked={isEncrypted}
              onChange={(e) => setIsEncrypted(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700"
              disabled={isLoading || !publicKey}
            />
            <label htmlFor="encrypt" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Encrypt this email
            </label>
            {!publicKey && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                (Requires encryption key setup in settings)
              </span>
            )}
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 dark:bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 