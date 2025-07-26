/**
 * Featured Products Section Component
 *
 * Displays a curated selection of featured products on the homepage.
 * Shows the first 4 products from the products array in a responsive grid.
 *
 * Features:
 * - Responsive grid layout (2 columns on mobile, 4 on desktop)
 * - Branded section title and description
 * - Integration with ProductCard component
 * - Consistent spacing and styling
 *
 * @author ReTag Team
 */

'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import type { Product } from '@/lib/products';
import ProductCard from '@/components/product-card';
import { getColorHex } from '@/lib/product-colors';
import { getBackendUrl } from '@/lib/backend-url';

/**
 * Featured Products Component
 *
 * Renders a section showcasing featured products with a title,
 * description, and grid of product cards fetched from the backend.
 *
 * @returns JSX element containing the featured products section
 */
export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured products from backend
    apiRequest('/sell/listed-public')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.products)) {
          // Map backend products to Product type
          const mapped = data.products.map((p: any) => {
            const lp = p.listed_product || {};
            return {
              id: p._id,
              name: lp.title || p.article,
              brand: p.brand,
              category: lp.category || '',
              mainCategory: lp.mainCategory || 'Unisex',
              price: `₹${lp.price || ''}`,
              originalPrice: '',
              condition: p.ai_analysis?.image_analysis?.quality || '',
              images: (p.images || []).map((img: string) =>
                img.startsWith('http') ? img : `${getBackendUrl()}/${img.replace(/^uploads\//, 'uploads/')}`
              ),
              imageHints: lp.tags || [],
              sizes: p.size ? [p.size] : [],
              colors: (p.ai_analysis?.image_analysis?.colors_detected || []).map((colorName: string) => ({
                name: colorName,
                hex: getColorHex(colorName)
              })),
            };
          });

          // Shuffle the products array and get first 4
          const shuffled = [...mapped].sort(() => Math.random() - 0.5);
          setProducts(shuffled.slice(0, 4) as Product[]);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  return (
    <section id="products" className="pt-2 pb-16 sm:pt-4 sm:pb-24 bg-card">
      <div className="container max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black font-headline tracking-tight text-primary">
            Featured Finds
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Check out some of the fresh styles that have just been Revamped.
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured products available yet. Be the first to sell!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
