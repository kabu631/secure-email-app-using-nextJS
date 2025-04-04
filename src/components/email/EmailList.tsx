"use client";

import { useState } from 'react';
import { Email } from '@/types';

interface EmailListProps {
  emails: Email[];
  isLoading: boolean;
  onEmailSelect: (email: Email) => void;
  onDeleteEmails: (emailIds: string[]) => void;
  selectedEmailId?: string;
  folder: string;
}

export default function EmailList({ 
  emails, 
  isLoading, 
  onEmailSelect, 
  onDeleteEmails,
  selectedEmailId, 
  folder 
}: EmailListProps) {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);

  // Format date for display
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    
    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedEmails([]);
  };

  const toggleEmailSelection = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (selectedEmails.includes(emailId)) {
      setSelectedEmails(selectedEmails.filter(id => id !== emailId));
    } else {
      setSelectedEmails([...selectedEmails, emailId]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedEmails.length > 0) {
      onDeleteEmails(selectedEmails);
      setSelectedEmails([]);
      setSelectMode(false);
    }
  };

  const selectAll = () => {
    if (selectedEmails.length === emails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map(email => email.id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full md:w-96 flex-shrink-0 flex-col overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-center h-full p-4 text-center text-gray-500 dark:text-gray-400">
          <div className="flex flex-col items-center">
            <div className="mb-2 animate-spin text-indigo-500 dark:text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p>Loading emails...</p>
          </div>
        </div>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex w-full md:w-96 flex-shrink-0 flex-col overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <div className="mb-2 text-indigo-500 dark:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p>No emails found in this folder</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full md:w-96 flex-shrink-0 flex-col overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="sticky top-0 flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 shadow-sm border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center">
          {selectMode && (
            <>
              <input
                type="checkbox"
                checked={selectedEmails.length === emails.length && emails.length > 0}
                onChange={selectAll}
                className="mr-2 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-800"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {selectedEmails.length} selected
              </span>
            </>
          )}
          {!selectMode && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {emails.length} {emails.length === 1 ? 'message' : 'messages'}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {selectMode && (
            <button
              onClick={handleDeleteSelected}
              disabled={selectedEmails.length === 0}
              className="rounded bg-rose-600 dark:bg-rose-700 px-2 py-1 text-xs font-medium text-white hover:bg-rose-700 dark:hover:bg-rose-800 disabled:opacity-50"
            >
              Delete
            </button>
          )}
          <button
            onClick={toggleSelectMode}
            className="rounded bg-gray-200 dark:bg-gray-600 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            {selectMode ? 'Cancel' : 'Select'}
          </button>
        </div>
      </div>

      <div className="overflow-y-auto">
        {emails.map(email => (
          <div
            key={email.id}
            className={`flex border-b border-gray-200 dark:border-gray-700 transition-colors ${
              selectedEmailId === email.id 
                ? 'bg-indigo-50 dark:bg-indigo-900/20' 
                : selectedEmails.includes(email.id)
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            } ${
              !email.read ? 'font-semibold' : ''
            }`}
          >
            {selectMode && (
              <div className="flex items-center pl-2" onClick={(e) => toggleEmailSelection(email.id, e)}>
                <input
                  type="checkbox"
                  checked={selectedEmails.includes(email.id)}
                  onChange={() => {}}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-800"
                />
              </div>
            )}
            <button
              onClick={() => onEmailSelect(email)}
              className="flex flex-1 flex-col p-3 text-left"
            >
              <div className="flex justify-between">
                <span className="truncate text-gray-800 dark:text-gray-200">{email.from}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{formatDate(email.date)}</span>
              </div>
              
              <div className="mt-1 flex items-center">
                <span className="truncate font-medium text-gray-900 dark:text-gray-100">{email.subject}</span>
                {email.isEncrypted && (
                  <span className="ml-2 text-indigo-600 dark:text-indigo-400" title="Encrypted">🔒</span>
                )}
              </div>
              
              <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-400">
                {email.body.substring(0, 80)}
                {email.body.length > 80 ? '...' : ''}
              </p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 