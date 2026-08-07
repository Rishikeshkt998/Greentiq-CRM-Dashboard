import type { Metadata } from 'next';
import { Sora, Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'GreenTiq CRM | Advanced Customer Management Dashboard',
  description: 'A production-grade CRM dashboard built with Next.js 14, TypeScript, TanStack Query v5, and Atomic Design Architecture.',
  keywords: ['CRM', 'Customer Management', 'GreenTiq', 'Dashboard'],
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isAuthEnabled = process.env.ENABLE_AUTH === 'true' || process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true';

  return (
    <html lang="en" suppressHydrationWarning className={`${sora.variable} ${jakarta.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <QueryProvider>
            <AuthProvider isAuthEnabled={isAuthEnabled}>
              {children}
              <Toaster
                position="top-right"
                richColors
                closeButton
                duration={3500}
                style={{ zIndex: 99999 }}
                toastOptions={{
                  style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.75rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
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
