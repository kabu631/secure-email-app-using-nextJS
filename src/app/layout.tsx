import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Secure Email Application",
  description: "A secure email application with encryption features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // On page load or when changing themes, best to add inline in \`head\` to avoid FOUC
                  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark')
                  } else {
                    document.documentElement.classList.remove('dark')
                  }
                  
                  // Add transition class for smooth theme changes
                  document.addEventListener('themeChange', () => {
                    document.documentElement.classList.add('transition');
                    window.setTimeout(() => {
                      document.documentElement.classList.remove('transition');
                    }, 300);
                  });
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} h-full`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
