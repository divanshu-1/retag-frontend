/**
 * Main Home Page Component for ReTag Marketplace
 *
 * This is the primary landing page that showcases all major features:
 * - Hero section with main value proposition
 * - Product browsing and shopping functionality
 * - Selling form for users to list items
 * - Category navigation and featured products
 * - FAQ and community sections
 *
 * The page uses a view-based navigation system where different sections
 * are shown based on user interaction (home, shop, sell, etc.)
 *
 * @author ReTag Team
 */

'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';

// Layout Components
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';

// Section Components
import Hero from '@/components/sections/hero';
import FeaturedProducts from '@/components/sections/featured-products';
import Faq from '@/components/sections/faq';
import CommunityCTA from '@/components/sections/community-cta';
import ShopByCategory from '@/components/sections/shop-by-category';
import NewArrivals from '@/components/sections/new-arrivals';
import ProductList from '@/components/sections/product-list';
import SellForm from '@/components/sections/enhanced-sell-form';
import AboutUs from '@/components/sections/about-us';
import ContactUs from '@/components/sections/contact-us';
import CartView from '@/components/sections/cart-view';
import WishlistView from '@/components/sections/wishlist-view';
import AccountView from '@/components/sections/account-view';
import ProfileView from '@/components/sections/profile-view';
import PaymentView from '@/components/sections/payment-view';
import OrdersView from '@/components/sections/orders-view';
import TermsAndConditionsContent from '@/app/terms-and-conditions/page';
import PrivacyPolicyContent from '@/app/privacy-policy/page';
import ShippingPolicyContent from '@/app/shipping-policy/page';
import type { Category } from '@/lib/products';
import Footer from '@/components/layout/footer';
import SellingProcess from '@/components/sections/selling-process';
import Image from 'next/image';
import AdminDashboard from '@/app/admin/page';

export type View = 'home' | 'shop' | 'sell' | 'about' | 'contact' | 'cart' | 'wishlist' | 'account' | 'profile' | 'payment' | 'orders' | 'terms' | 'privacy' | 'shipping' | 'admin';
export type ShopView = 'categories' | 'products';

export default function Home() {
  const [hash, setHash] = useState('');
  const { logout } = useUser();

  // Derive all view state directly from the URL hash
  const [viewStr, ...rest] = hash.split('/');

  const activeView: View = ['shop', 'sell', 'about', 'contact', 'cart', 'wishlist', 'account', 'profile', 'payment', 'orders', 'terms', 'privacy', 'shipping', 'admin'].includes(viewStr)
    ? viewStr as View
    : 'home';

  const categoryStr = activeView === 'shop' ? rest[0] : null;

  const shopView: ShopView = (activeView === 'shop' && categoryStr && ['Men', 'Women', 'Kids'].includes(categoryStr)) 
    ? 'products' 
    : 'categories';

  const selectedCategory: Category | null = shopView === 'products' ? categoryStr as Category : null;

  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash.replace(/^#/, '');
      setHash(newHash);
      if (!newHash.includes('faq')) {
          window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial load
    handleHashChange(); 

    // Handle back/forward navigation
    window.onpopstate = handleHashChange;

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.onpopstate = null;
    };
  }, []);

  // Scroll to FAQ section on home page
  useEffect(() => {
    if (hash.endsWith('faq') && activeView === 'home') {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash, activeView]);

  // Navigation functions now only update the hash
  const handleNavigate = (view: View, category?: Category) => {
    if (view === 'home') {
      window.location.hash = '';
    } else if (view === 'shop' && category) {
      window.location.hash = `shop/${category}`;
    } else {
      window.location.hash = view;
    }
  };
  
  const handleSelectCategory = (category: Category) => {
    window.location.hash = `shop/${category}`;
  };

  const handleBackToCategories = () => {
    window.location.hash = 'shop';
  };
  
  const handleNavigateToFaq = () => {
    window.location.hash = 'faq';
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '';
  };
  
  const handleBackClick = () => {
      window.history.back();
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <>
            <Hero onNavigate={handleNavigate} />
            <FeaturedProducts />
            <Faq />
            <CommunityCTA />
          </>
        );
      case 'shop':
        if (shopView === 'categories') {
          return <ShopByCategory onSelectCategory={handleSelectCategory} />;
        }
        return <ProductList category={selectedCategory!} onBackToCategories={handleBackToCategories} onNavigate={handleNavigate} />;
      case 'sell':
        return (
          <>
            {/* Banner/Header Section */}
            <section className="relative h-48 sm:h-64 md:h-80 w-full hidden md:flex items-center justify-center text-white">
              <Image
                src="https://t4.ftcdn.net/jpg/08/29/92/35/360_F_829923583_Q9qvQUSqXo0URtHNzwwFqU0H0ByKXz1Y.jpg"
                alt="A rack of second-hand clothes"
                data-ai-hint="clothing rack"
                fill
                className="object-cover brightness-75"
              />
              <div className="relative z-10 text-center px-4 py-8">
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black tracking-tight font-headline">
                  How Selling Works
                </h1>
              </div>
            </section>
            {/* Steps Section */}
            <SellingProcess />
            {/* Sell Form Section */}
            <SellForm />
          </>
        );
      case 'about':
        return <AboutUs />;
      case 'contact':
        return <ContactUs />;
      case 'cart':
        return <CartView onNavigate={handleNavigate} />;
      case 'wishlist':
        return <WishlistView onNavigate={handleNavigate} />;
      case 'account':
        return <AccountView onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'profile':
        return <ProfileView onNavigate={handleNavigate} />;
      case 'payment':
        return <PaymentView onNavigate={handleNavigate} />;
      case 'orders':
        return <OrdersView onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsAndConditionsContent />;
      case 'privacy':
        return <PrivacyPolicyContent />;
      case 'shipping':
        return <ShippingPolicyContent />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Hero onNavigate={handleNavigate} />;
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        activeView={activeView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onNavigateToCategory={handleSelectCategory}
        showBackButton={activeView !== 'home'}
      />
      
      <main className="flex-1">
        {renderContent()}
      </main>

      <MobileNav activeView={activeView} onNavigate={handleNavigate} />
    </div>
  );
}
