"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the UI that depends on client-side theme state
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Dispatch theme change event for transitions
    document.dispatchEvent(new Event('themeChange'));
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button 
        className={`rounded-md bg-indigo-700 dark:bg-indigo-600 p-2 text-white hover:bg-indigo-800 dark:hover:bg-indigo-700 ${className}`}
        aria-label="Toggle theme"
      >
        <div className="h-4 w-4"></div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`rounded-md bg-indigo-700 dark:bg-indigo-600 p-2 text-white hover:bg-indigo-800 dark:hover:bg-indigo-700 ${className}`}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
} 