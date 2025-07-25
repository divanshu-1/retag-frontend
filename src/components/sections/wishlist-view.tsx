
'use client';

import Image from 'next/image';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ShoppingBag, Heart } from 'lucide-react';
import Link from 'next/link';
import type { View } from '@/app/page';
import { LoginButton } from '@/components/auth/login-button';
import { LoginToViewIcon } from '@/components/icons/login-to-view-icon';
import { useUser } from '@/hooks/use-user';

const EmptyWishlistIcon = () => (
  <div className="relative inline-block">
    <Heart className="h-24 w-24 text-foreground" strokeWidth={1}/>
    <div className="absolute top-[35%] left-[-10px] h-1.5 w-1.5 rounded-full bg-muted-foreground" />
    <div className="absolute top-[50%] left-[-20px] h-2.5 w-2.5 rounded-full bg-primary/80" />
    <div className="absolute top-[30%] right-[-15px] h-2.5 w-2.5 rounded-full bg-primary/80" />
    <div className="absolute top-[45%] right-[-8px] h-1.5 w-1.5 rounded-full bg-muted-foreground" />
  </div>
);

export default function WishlistView({
  onNavigate,
}: { 
  onNavigate: (view: View) => void,
}) {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { isLoggedIn } = useUser();

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast({
      title: 'Item Removed',
      description: `${productName} has been removed from your wishlist.`,
    });
  };

  const handleAddToCart = (product: (typeof items)[0]) => {
    // Remove from wishlist first
    removeFromWishlist(product.id);
    
    // Then add to cart
    addToCart(product);
    
    toast({
      title: 'Moved to your bag!',
      description: `${product.name} has been moved from your wishlist to your bag.`,
    });
  };
  
  if (!isLoggedIn) {
    return (
      <div className="bg-[#18181b] min-h-full">
        <section className="flex flex-col items-center justify-center flex-grow min-h-[calc(100vh-10rem)] text-center">
          <div className="container max-w-sm mx-auto flex flex-col items-center py-16 sm:py-24">
            <LoginToViewIcon className="h-32 w-32" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mt-4">
              PLEASE LOG IN
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Login to view items in your wishlist.
            </p>
            <LoginButton>
                <Button size="lg" variant="outline" className="mt-8 font-bold px-12 py-6 border-primary text-primary hover:bg-primary/5 border-2 w-full">
                    LOGIN
                </Button>
            </LoginButton>
          </div>
        </section>
        <div className="border-t border-border w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#18181b] min-h-full">
        <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="container max-w-4xl mx-auto text-center py-16">
            <EmptyWishlistIcon />
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight mt-6">
              Your wishlist is empty! Let's find some favorites shall we?
            </h1>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                className="w-full sm:w-auto rounded-full px-8 py-3 h-auto"
                onClick={() => onNavigate('shop')}
              >
                Start Shopping
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-full px-8 py-3 h-auto"
                onClick={() => onNavigate('cart')}
              >
                View your bag
              </Button>
            </div>
          </div>
        </section>
        {/* Divider above footer */}
        <div className="border-t border-border w-full" />
      </div>
    );
  }

  return (
    <div className="bg-[#18181b] min-h-full">
      <section className="flex-grow py-16 sm:py-24">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-8 text-left">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground uppercase">Your Wishlist</h1>
            <p className="text-muted-foreground mt-2">
              You have {items.length} {items.length === 1 ? 'item' : 'items'} saved for later.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Items in your wishlist are saved for you — add them to your bag when you're ready.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative">
                    <Link href={`/product/${product.id}`} className="block">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={400}
                        height={500}
                        className="object-cover w-full h-auto aspect-[4/5] transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={product.imageHints[0]}
                      />
                    </Link>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 rounded-full h-8 w-8"
                      onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove from wishlist</span>
                    </Button>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>
                      <h3 className="font-bold text-base truncate">
                          <Link href={`/product/${product.id}`}>
                              {product.name}
                          </Link>
                      </h3>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <p className="text-lg font-semibold">{product.price}</p>
                      <p className="text-sm text-muted-foreground line-through">{product.originalPrice}</p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-auto"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add to Bag
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <div className="border-t border-border w-full" />
    </div>
  );
}
