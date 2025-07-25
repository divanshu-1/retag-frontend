/**
 * Root Layout Component for ReTag Marketplace
 *
 * This is the main layout component that wraps all pages in the Next.js app.
 * It provides:
 * - Global styling and fonts
 * - Context providers for state management
 * - SEO metadata configuration
 * - Global UI components (toaster, footer)
 *
 * Context Providers:
 * - UserProvider: Manages user authentication state
 * - CartProvider: Manages shopping cart state
 * - WishlistProvider: Manages wishlist state
 *
 * @author ReTag Team
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/components/cart-provider';
import { WishlistProvider } from '@/components/wishlist-provider';
import { UserProvider } from '@/components/user-provider';
import Footer from '@/components/layout/footer';

/**
 * Font Configuration
 * Using Inter font from Google Fonts with optimizations
 */
const inter = Inter({
  subsets: ['latin'],           // Latin character subset
  variable: '--font-inter',     // CSS variable for the font
  display: 'swap',              // Font display strategy for performance
});

/**
 * SEO Metadata Configuration
 * Defines how the app appears in search engines and social media
 */
export const metadata: Metadata = {
  title: 'ReTag Marketplace',
  description: 'Sell Smart. Buy Better. ReTag. India’s smartest thrift store – quality-checked & AI-priced.',
  manifest: '/manifest.json',  // PWA manifest for mobile app-like experience
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png',  // Apple touch icon for iOS devices
  },
};

/**
 * Root Layout Component
 *
 * This component wraps all pages and provides:
 * - HTML structure with proper meta tags
 * - Font loading and optimization
 * - Global context providers
 * - Consistent layout structure
 *
 * @param children - Page content to be rendered
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
       <head>
        {/* Mobile-first responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        {/* Font preloading for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen">
        {/* Context Providers for Global State Management */}
        <UserProvider>
          <CartProvider>
            <WishlistProvider>
              {/* Main content area */}
              <div className="flex-1">
                {children}
              </div>

              {/* Global UI Components */}
              <Toaster />                    {/* Toast notifications */}
              <Footer collapsible={true} />  {/* Site footer */}
            </WishlistProvider>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
