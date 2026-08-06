import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Greentiq CRM | Advanced Customer Management Dashboard',
  description: 'A production-grade CRM dashboard built with Next.js 14, TypeScript, TanStack Query v5, and Atomic Design Architecture.',
  keywords: ['CRM', 'Customer Management', 'Greentiq', 'Dashboard'],
};

const isAuthEnabled = process.env.ENABLE_AUTH === 'true' || process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <QueryProvider>
            <AuthProvider isAuthEnabled={isAuthEnabled}>
              {children}
              <Toaster
                position="bottom-right"
                theme="dark"
                toastOptions={{
                  style: {
                    background: 'hsl(220 38% 11%)',
                    border: '1px solid hsl(217 28% 17%)',
                    color: 'hsl(215 25% 88%)',
                  },
                }}
              />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
