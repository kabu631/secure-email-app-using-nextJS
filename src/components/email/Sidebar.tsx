"use client";

import { EmailFolder } from '@/types';

interface SidebarProps {
  currentFolder: EmailFolder;
  onFolderChange: (folder: EmailFolder) => void;
  onComposeClick: () => void;
}

export default function Sidebar({ currentFolder, onFolderChange, onComposeClick }: SidebarProps) {
  const folders = [
    { id: EmailFolder.INBOX, name: 'Inbox', icon: '📥' },
    { id: EmailFolder.SENT, name: 'Sent', icon: '📤' },
    { id: EmailFolder.DRAFT, name: 'Drafts', icon: '📝' },
    { id: EmailFolder.TRASH, name: 'Trash', icon: '🗑️' },
    { id: EmailFolder.SPAM, name: 'Spam', icon: '⚠️' },
  ];

  return (
    <div className="w-64 flex-shrink-0 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <button
        onClick={onComposeClick}
        className="mb-6 w-full rounded-md bg-indigo-600 dark:bg-indigo-700 px-4 py-2 text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-150 shadow-sm"
      >
        Compose New Email
      </button>
      
      <nav>
        <ul className="space-y-1">
          {folders.map(folder => (
            <li key={folder.id}>
              <button
                onClick={() => onFolderChange(folder.id)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm flex items-center ${
                  currentFolder === folder.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-3 inline-block w-5 text-center">{folder.icon}</span>
                {folder.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 