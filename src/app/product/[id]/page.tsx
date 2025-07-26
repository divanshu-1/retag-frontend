'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Header from '@/components/layout/header';
import ProductDetails from '@/components/sections/product-details';
import { useUser } from '@/hooks/use-user';
import type { View } from '@/app/page';
import type { Category } from '@/lib/products';
import { apiRequest } from '@/lib/api';
import { getConsistentColors, getColorHex } from '@/lib/product-colors';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // All hooks at the top!
  const [hash, setHash] = useState('');
  const { logout } = useUser();
  const resolvedParams = use(params);
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {


    // Fetch product from backend
    apiRequest('/sell/listed-public')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.products)) {
          const backendProduct = data.products.find((p: any) => p._id === resolvedParams.id);
          if (backendProduct) {
            // Map backend product to ProductDetails format
            const lp = backendProduct.listed_product || {};
            setProduct({
              id: backendProduct._id,
              name: lp.title || backendProduct.article,
              brand: backendProduct.brand,
              category: lp.category || '',
              mainCategory: lp.mainCategory || 'Unisex',
              price: `₹${lp.price || ''}`,
              originalPrice: lp.mrp ? `₹${lp.mrp}` : '',
              condition: backendProduct.ai_analysis?.image_analysis?.quality || '',
              images: (backendProduct.images || []).map((img: string) => img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/${img.replace(/^uploads\//, 'uploads/')}`),
              imageHints: lp.tags || [],
              sizes: backendProduct.size ? [backendProduct.size] : [],
              colors: (backendProduct.ai_analysis?.image_analysis?.colors_detected || []).length > 0
                ? (backendProduct.ai_analysis.image_analysis.colors_detected || []).map((colorName: string) => ({
                    name: colorName,
                    hex: getColorHex(colorName)
                  }))
                : getConsistentColors(backendProduct._id, backendProduct.category || 'Other', backendProduct.article || '', backendProduct.brand || ''),
            });
          } else {
            setProduct(null);
          }
        } else {
          setProduct(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash.replace(/^#/, '');
      setHash(newHash);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (!product) {
    return <div className="flex items-center justify-center min-h-screen text-2xl">404 | This page could not be found.</div>;
  }

  // Derive view state from URL hash
  const [viewStr] = hash.split('/');
  const activeView: View = ['shop', 'sell', 'about', 'contact', 'cart', 'wishlist', 'account', 'profile', 'terms', 'privacy'].includes(viewStr) 
    ? viewStr as View 
    : 'home';

  // Navigation functions
  const handleNavigate = (view: View, category?: Category) => {
    if (view === 'home') {
      window.location.href = '/';
    } else if (view === 'shop' && category) {
      window.location.href = `${window.location.origin}/#shop/${category}`;
    } else {
      window.location.href = `${window.location.origin}/#${view}`;
    }
  };

  const handleSelectCategory = (category: Category) => {
    // Navigate to home page with the shop category hash using full URL
    window.location.href = `${window.location.origin}/#shop/${category}`;
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header
        activeView={activeView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onNavigateToCategory={handleSelectCategory}
        showBackButton
      />
      <main className="flex-grow pt-16 text-white" style={{ backgroundColor: '#18181b' }}>
        <ProductDetails product={product} />
      </main>
    </div>
  );
}
