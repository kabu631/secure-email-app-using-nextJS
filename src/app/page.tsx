"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Simply redirect to the signin page on initial load
    // The dashboard page will handle authentication check
    router.push('/auth/signin');
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-indigo-900">
      <div className="text-center">
        <div className="mb-4 animate-spin text-indigo-500 dark:text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div className="text-gray-700 dark:text-gray-300 text-lg font-medium">Loading Secure Email...</div>
      </div>
    </div>
  );
}
