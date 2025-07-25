
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/products';
import Image from 'next/image';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Breadcrumb from '@/components/ui/breadcrumb';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/use-wishlist';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function ProductDetails({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const router = useRouter();
  const { addToCart, items } = useCart();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();

  const isInWishlist = isItemInWishlist(product.id);

  // Check if item is already in cart
  const isInCart = items.some(item => item.id === product.id);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/#shop' },
    { label: product.mainCategory, href: `/#shop/${product.mainCategory}` },
    { label: product.name },
  ];

  const handleWishlistClick = () => {
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

  const handleCartAction = () => {
    // If item is already in cart, navigate to cart
    if (isInCart) {
      router.push('/#cart');
      return;
    }

    // Otherwise, add to cart
    if (!selectedSize) {
      toast({
        title: 'Please select a size',
        description: 'You must select a size before adding the item to your bag.',
        variant: 'destructive',
      });
      return;
    }

    const productToAdd = {
      ...product,
      sizes: [selectedSize],
      color: product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default',
    };

    console.log('Before: isInWishlist =', isInWishlist);
    console.log('Product ID:', product.id);

    // Force remove from wishlist regardless of current state
    removeFromWishlist(product.id);
    console.log('Called removeFromWishlist with ID:', product.id);

    // Force a re-render to update the UI
    setForceUpdate(prev => prev + 1);

    // Then add to cart
    addToCart(productToAdd);

    // Show appropriate message
    if (isInWishlist) {
      toast({
          title: 'Moved to your bag!',
          description: `${product.name} (Size: ${selectedSize}) has been moved from your wishlist to your bag.`,
      });
  } else {
      toast({
          title: 'Added to your bag!',
          description: `${product.name} (Size: ${selectedSize}) is now in your bag.`,
      });
    }
};

  return (
    <>
      <div className="container mx-auto max-w-7xl px-0 md:px-4 md:py-8 text-white" style={{ backgroundColor: '#18181b' }}>
        <div className="hidden md:block">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="md:hidden px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-5 md:mt-4">
          {/* Image gallery */}
          <div className="relative max-w-md mx-auto lg:max-w-2xl lg:mx-0">
            {/* Mobile: Carousel */}
            <div className="lg:hidden">
              <Carousel className="w-full group">
                <CarouselContent>
                  {product.images.map((src, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[2/3] relative">
                        <Image
                          src={src}
                          alt={`${product.name} image ${index + 1}`}
                          fill
                          className="object-cover w-full h-full"
                          data-ai-hint={product.imageHints[index]}
                          priority={index === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white border-white/20" />
                <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white border-white/20" />
              </Carousel>
              <Button
                size="icon"
                variant="ghost"
                className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full h-10 w-10 z-10"
                onClick={handleWishlistClick}
              >
                <Heart className={cn("h-5 w-5", isInWishlist && "fill-destructive text-destructive")} />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>

            {/* Desktop: 2x2 Grid */}
            <div className="hidden lg:block relative">
              <div className="grid grid-cols-2 gap-4">
                {product.images.slice(0, 4).map((src, index) => (
                  <div key={index} className="aspect-square relative">
                    <Image
                      src={src}
                      alt={`${product.name} image ${index + 1}`}
                      fill
                      className="object-cover w-full h-full rounded-lg"
                      data-ai-hint={product.imageHints[index]}
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="px-4 md:px-0 mt-6 lg:mt-0 pb-28 md:pb-0">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-4">
              {product.name}
            </h1>
            <div className="mt-2">
              <p className="text-lg text-muted-foreground">{product.brand}</p>
              <p className="text-sm text-muted-foreground">{product.mainCategory} / {product.category}</p>
            </div>

            <div className="mt-4 hidden md:flex items-baseline gap-3">
              <p className="text-3xl tracking-tight text-foreground">{product.price}</p>
              {product.originalPrice && (
                <p className="text-xl tracking-tight text-muted-foreground line-through">{product.originalPrice}</p>
              )}
              {product.originalPrice && (
                <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full font-medium">
                  {Math.round(((parseFloat(product.originalPrice.replace('₹', '')) - parseFloat(product.price.replace('₹', ''))) / parseFloat(product.originalPrice.replace('₹', ''))) * 100)}% OFF
                </span>
              )}
            </div>
            
            <p className="mt-4 text-base text-muted-foreground hidden md:block">Condition: {product.condition}</p>

            <Separator className="my-6 bg-gray-700" />

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-foreground">Color</h3>
                <div className="mt-2 flex items-center space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      className="h-8 w-8 rounded-full border border-black border-opacity-10 ring-2 ring-offset-1 ring-primary"
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Sizes */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Size</h3>
              </div>

              <div className="mt-2 grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-5">
                {product.sizes.map((size) => (
                  <Button 
                    key={size} 
                    variant={selectedSize === size ? "default" : "outline"} 
                    className="font-medium"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mt-8 hidden md:flex gap-4">
              <Button size="lg" className="flex-1" onClick={handleCartAction}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                {isInCart ? 'Go to Bag' : 'Add to Bag'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-4"
                onClick={handleWishlistClick}
              >
                <Heart className={cn("h-5 w-5", isInWishlist && "fill-destructive text-destructive")} />
                <span className="sr-only">Toggle wishlist</span>
              </Button>
            </div>
            
            <div className="mt-8 space-y-4 text-base text-muted-foreground">
              <h3 className="text-lg font-medium text-foreground">Description</h3>
              <p>
                A timeless piece from {product.brand}, this {product.name.toLowerCase()} is a must-have for any wardrobe.
                It's in {product.condition.toLowerCase()} condition, ready for a new life. Perfect for any occasion.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky footer for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-700 p-3 flex items-center justify-between gap-4 z-20" style={{ backgroundColor: '#18181b' }}>
          <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold tracking-tight text-foreground">{product.price}</p>
                {product.originalPrice && (
                  <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full font-medium">
                    {Math.round(((parseFloat(product.originalPrice.replace('₹', '')) - parseFloat(product.price.replace('₹', ''))) / parseFloat(product.originalPrice.replace('₹', ''))) * 100)}% OFF
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-xs tracking-tight text-muted-foreground line-through">{product.originalPrice}</p>
              )}
          </div>
          <Button size="lg" className="flex-1" onClick={handleCartAction}>
              <ShoppingBag className="mr-2 h-5 w-5" />
              {isInCart ? 'Go to Bag' : 'Add to Bag'}
          </Button>
      </div>
    </>
  );
}
