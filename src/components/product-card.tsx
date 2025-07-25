
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart } from 'lucide-react';
import type { Product } from '@/lib/products';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/hooks/use-wishlist';

export default function ProductCard({ product, className }: { product: Product, className?: string }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();
  const [imageError, setImageError] = useState(false);

  const isInWishlist = isItemInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: 'Added to your bag!',
      description: `${product.name} is now in your bag.`,
    });
  };
  
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: 'Removed from wishlist',
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: 'Added to your wishlist!',
        description: `${product.name} has been saved.`,
      });
    }
  };

  const priceNum = parseFloat(product.price.replace('₹', ''));
  const originalPriceNum = parseFloat(product.originalPrice.replace('₹', ''));
  const discount = originalPriceNum > 0 && priceNum < originalPriceNum ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100) : 0;


  return (
    <Card className={cn("overflow-hidden border-none shadow-none rounded-none bg-transparent text-left", className)}>
        <CardContent className="p-0">
          <div className="relative group">
            <Link href={`/product/${product.id}`} className="block">
              {imageError ? (
                <div className="w-full aspect-[4/5] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Image unavailable</span>
                </div>
              ) : (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={400}
                  height={500}
                  className="object-cover w-full h-auto aspect-[4/5]"
                  data-ai-hint={product.imageHints[0]}
                  onError={() => setImageError(true)}
                />
              )}
            </Link>
             <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white border border-black/20 rounded-full transition-all duration-200"
                onClick={handleWishlistClick}
                aria-label="Toggle Wishlist"
              >
                <Heart className={cn("h-4 w-4 text-black", isInWishlist && "fill-destructive text-destructive")} />
              </Button>
          </div>
          <div className="pt-2 space-y-1">
            {product.condition && (
                <Badge variant="secondary" className="font-semibold text-xs uppercase">
                  {product.condition}
                </Badge>
            )}
            <p className="text-sm font-semibold text-foreground pt-1 truncate">{product.brand}</p>
            <h3 className="text-sm text-muted-foreground leading-tight h-10 overflow-hidden">
                <Link href={`/product/${product.id}`} className="hover:underline">
                    {product.name}
                </Link>
            </h3>
            <div className="flex items-center space-x-1 pt-1">
                {product.colors.slice(0, 4).map((color) => (
                <span key={color.name} className="block h-3 w-3 rounded-full border border-neutral-300" style={{ backgroundColor: color.hex }} title={color.name} />
                ))}
                {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground">+ {product.colors.length - 4}</span>
                )}
            </div>
            <div className="flex items-baseline flex-wrap gap-x-2 pt-1">
                <p className="text-sm font-bold">{product.price}</p>
                <p className="text-xs text-muted-foreground line-through">{product.originalPrice}</p>
                {discount > 0 && (
                    <p className="text-sm font-semibold text-primary">{discount}% OFF</p>
                )}
            </div>
          </div>
        </CardContent>
    </Card>
  );
}
