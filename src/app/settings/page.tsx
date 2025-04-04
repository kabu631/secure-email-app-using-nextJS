"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { generateRSAKeyPair } from '@/lib/encryption/rsa';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [imapHost, setImapHost] = useState('imap.example.com');
  const [imapPort, setImapPort] = useState('993');
  const [imapUsername, setImapUsername] = useState('');
  const [imapPassword, setImapPassword] = useState('');
  const [imapSecure, setImapSecure] = useState(true);
  
  const [smtpHost, setSmtpHost] = useState('smtp.example.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(true);
  
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const [hasPGPKeys, setHasPGPKeys] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Set default values from user session
  useEffect(() => {
    if (session?.user?.email) {
      setImapUsername(session.user.email);
      setSmtpUsername(session.user.email);
    }
    
    // Check if user has PGP keys
    if (session?.user?.publicKey) {
      setHasPGPKeys(true);
    }
  }, [session]);

  // Handle key generation
  const handleGenerateKeys = () => {
    setIsGeneratingKeys(true);
    
    // Simulate key generation (in a real app, we would use proper API call)
    setTimeout(() => {
      const keys = generateRSAKeyPair();
      
      // In a real app, we would send the keys to the server
      console.log('Generated keys:', keys);
      
      setHasPGPKeys(true);
      setIsGeneratingKeys(false);
    }, 1500);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    
    // In a real app, we would save settings to the server
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Hide success message after a few seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  // If loading session
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated
  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between bg-blue-600 px-6 py-4 text-white">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Secure Email</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span>{session?.user?.email}</span>
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-md bg-blue-700 px-3 py-1 text-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </header>
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">Account Settings</h2>
        
        {saveSuccess && (
          <div className="mb-6 rounded-md bg-green-50 p-4 text-green-800">
            Settings saved successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-md bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-medium">Encryption Keys</h3>
            
            <div className="mb-4">
              <p className="text-gray-600">
                Encryption keys are used to secure your emails. They allow you to send and receive encrypted messages.
              </p>
            </div>
            
            {hasPGPKeys ? (
              <div className="rounded-md bg-green-50 p-4 text-green-800">
                <p className="flex items-center">
                  <span className="mr-2">✓</span>
                  Your encryption keys are set up and ready to use.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGenerateKeys}
                disabled={isGeneratingKeys}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isGeneratingKeys ? 'Generating Keys...' : 'Generate New Keys'}
              </button>
            )}
          </div>
          
          <div className="rounded-md bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-medium">IMAP Settings (Incoming Mail)</h3>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="imapHost" className="block text-sm font-medium text-gray-700">
                  IMAP Server
                </label>
                <input
                  id="imapHost"
                  type="text"
                  value={imapHost}
                  onChange={(e) => setImapHost(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="imapPort" className="block text-sm font-medium text-gray-700">
                  Port
                </label>
                <input
                  id="imapPort"
                  type="text"
                  value={imapPort}
                  onChange={(e) => setImapPort(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="imapUsername" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="imapUsername"
                  type="text"
                  value={imapUsername}
                  onChange={(e) => setImapUsername(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="imapPassword" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="imapPassword"
                  type="password"
                  value={imapPassword}
                  onChange={(e) => setImapPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <input
                id="imapSecure"
                type="checkbox"
                checked={imapSecure}
                onChange={(e) => setImapSecure(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="imapSecure" className="ml-2 text-sm text-gray-700">
                Use TLS/SSL for secure connection
              </label>
            </div>
          </div>
          
          <div className="rounded-md bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-medium">SMTP Settings (Outgoing Mail)</h3>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700">
                  SMTP Server
                </label>
                <input
                  id="smtpHost"
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                  Port
                </label>
                <input
                  id="smtpPort"
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="smtpUsername"
                  type="text"
                  value={smtpUsername}
                  onChange={(e) => setSmtpUsername(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="smtpPassword"
                  type="password"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <input
                id="smtpSecure"
                type="checkbox"
                checked={smtpSecure}
                onChange={(e) => setSmtpSecure(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="smtpSecure" className="ml-2 text-sm text-gray-700">
                Use TLS/SSL for secure connection
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 