import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Greentiq CRM | Advanced Customer Management Dashboard',
  description: 'A production-grade CRM dashboard built with Next.js 14, TypeScript, TanStack Query v5, and Atomic Design Architecture.',
  keywords: ['CRM', 'Customer Management', 'Greentiq', 'Dashboard'],
};

const isAuthEnabled = process.env.ENABLE_AUTH === 'true';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <QueryProvider>
          <AuthProvider isAuthEnabled={isAuthEnabled}>
            {children}
            <Toaster
              position="bottom-right"
              theme="dark"
              toastOptions={{
                style: {
                  background: 'hsl(222 47% 9%)',
                  border: '1px solid hsl(217 33% 14%)',
                  color: 'hsl(213 31% 91%)',
                },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
