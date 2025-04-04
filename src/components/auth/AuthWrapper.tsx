"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthWrapper({
  children,
  requireAuth = true,
  redirectTo = "/auth/signin",
}: AuthWrapperProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If authentication is required and user is not authenticated, redirect
    if (requireAuth && status === "unauthenticated") {
      router.push(redirectTo);
    }
  }, [requireAuth, redirectTo, router, status]);

  // Show loading state while checking auth
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 animate-spin text-indigo-500 dark:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="text-gray-700 dark:text-gray-300 text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render children if authentication is required but user is not authenticated
  if (requireAuth && status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
} 