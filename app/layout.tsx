import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/lib/context/CartContext';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import FloatingButton from '@/components/FloatingButton';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { AdminProvider } from '@/lib/context/AdminContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SamruddhikaBags - Premium Bag Collection',
  description: 'Your one-stop shop for premium quality bags',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <AdminProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <CartProvider>
                <Header />
                <Navbar />
                {children}
                <Footer />
                <FloatingButton />
                <Toaster />
              </CartProvider>
            </ThemeProvider>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}