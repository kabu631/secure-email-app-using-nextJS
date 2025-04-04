"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });
      
      if (result?.error) {
        setError('Invalid email or password');
        return;
      }
      
      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred during sign in');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-800 dark:text-red-300">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
          placeholder="you@example.com"
          disabled={isLoading}
          required
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <a href="#" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
            Forgot password?
          </a>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
          placeholder="••••••••"
          disabled={isLoading}
          required
        />
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-indigo-600 dark:bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-150"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
      
      <div className="mt-6 text-center text-sm space-y-3">
        <div className="rounded-md bg-gray-50 dark:bg-gray-700 p-3">
          <p className="text-gray-700 dark:text-gray-300 mb-1">
            Demo accounts:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="font-medium text-gray-800 dark:text-gray-200">
              <div>demo@example.com</div>
              <div className="text-gray-500 dark:text-gray-400">secure123</div>
            </div>
            <div className="font-medium text-gray-800 dark:text-gray-200">
              <div>test1@example.com</div>
              <div className="text-gray-500 dark:text-gray-400">secure123</div>
            </div>
            <div className="font-medium text-gray-800 dark:text-gray-200">
              <div>test2@example.com</div>
              <div className="text-gray-500 dark:text-gray-400">secure123</div>
            </div>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
} 