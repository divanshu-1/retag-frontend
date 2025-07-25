'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { ShoppingBag, X, ArrowRight, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { View } from '@/app/page';
import type { CartItem } from '@/hooks/use-cart';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';


const EmptyBagIcon = () => (
  <div className="relative inline-block">
    <ShoppingBag className="h-24 w-24 text-foreground" strokeWidth={1}/>
    <div className="absolute bottom-[28px] left-[15%] right-[15%] h-1.5 bg-primary" />
    <div className="absolute bottom-[20px] left-[15%] right-[15%] h-1.5 bg-primary" />
    <div className="absolute top-[35%] left-[-10px] h-1.5 w-1.5 rounded-full bg-muted-foreground" />
    <div className="absolute top-[50%] left-[-20px] h-2.5 w-2.5 rounded-full bg-primary/80" />
    <div className="absolute top-[30%] right-[-15px] h-2.5 w-2.5 rounded-full bg-primary/80" />
    <div className="absolute top-[45%] right-[-8px] h-1.5 w-1.5 rounded-full bg-muted-foreground" />
  </div>
);


export default function CartView({ onNavigate }: { onNavigate: (view: View) => void }) {
  const { items, removeFromCart, updateQuantity } = useCart();
  const { addToWishlist } = useWishlist();
  const { toast } = useToast();
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  // Debug: Log cart items
  console.log('CartView - items:', items);
  console.log('CartView - items length:', items.length);

  const handleConfirmRemove = () => {
    if (!itemToRemove) return;
    removeFromCart(itemToRemove.cartItemId);
    toast({
      title: 'Item Removed',
      description: `${itemToRemove.name} has been removed from your bag.`,
    });
    setItemToRemove(null);
  };

  const handleMoveToWishlist = () => {
    if (!itemToRemove) return;
    addToWishlist(itemToRemove);
    removeFromCart(itemToRemove.cartItemId);
    toast({
      title: 'Moved to Wishlist',
      description: `${itemToRemove.name} has been moved to your wishlist.`,
    });
    setItemToRemove(null);
  }


  
  const subtotal = items.reduce((acc, item) => {
    const price = parseFloat(item.price.replace('₹', ''));
    return acc + price; // Each item has quantity 1
  }, 0);

  const originalTotal = items.reduce((acc, item) => {
    const original = parseFloat(item.originalPrice?.replace('₹', '') || item.price.replace('₹', ''));
    return acc + original; // Each item has quantity 1
  }, 0);

  const totalItems = items.length; // Each item has quantity 1
  const savings = originalTotal - subtotal;
  const convenienceCharges = 29; // Fixed convenience charge
  const total = subtotal + convenienceCharges;

  if (items.length === 0) {
    return (
      <div className="bg-[#18181b] min-h-full">
        <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="container max-w-4xl mx-auto text-center py-16">
            <EmptyBagIcon />
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight mt-6">
              Your bag is empty! Let's fill it up shall we?
            </h1>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                className="w-full sm:w-auto rounded-full px-8 py-3 h-auto"
                onClick={() => onNavigate('shop')}
              >
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-full px-8 py-3 h-auto"
                onClick={() => onNavigate('wishlist')}
              >
                View saved products
              </Button>
            </div>
          </div>
        </section>
        {/* Divider above footer */}
        <div className="border-t border-border w-full" />
      </div>
    );
  }

  const handleApplyPromo = () => {
    setPromoError('Invalid code, Please check the code');
  };

  return (
    <div className="bg-[#18181b] min-h-full">
      <section className="flex-grow py-16 sm:py-24">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-8 text-left">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground uppercase">Your Bag</h1>
              <p className="text-muted-foreground mt-2">
                TOTAL: ({totalItems} {totalItems === 1 ? 'item' : 'items'}) <span className="font-bold text-foreground">₹{total.toFixed(2)}</span>
              </p>
               <p className="mt-2 text-sm text-muted-foreground">
                  Items in your bag are not reserved — check out now to make them yours.
              </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => {
                  const unitPrice = parseFloat(item.price.replace('₹', ''));
                  const originalPrice = parseFloat(item.originalPrice?.replace('₹', '') || item.price.replace('₹', ''));
                  const discountPercentage = originalPrice > unitPrice ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100) : 0;

                  return (
                      <Card key={item.cartItemId} className="overflow-hidden">
                      <CardContent className="p-4 flex gap-4">
                          <div className="relative w-24 h-32 md:w-32 md:h-40 flex-shrink-0">
                          <Link href={`/product/${item.id}`} className="block w-full h-full">
                              <Image
                                  src={item.images[0]}
                                  alt={item.name}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-md hover:opacity-80 transition-opacity cursor-pointer"
                                  data-ai-hint={item.imageHints[0]}
                              />
                          </Link>
                          </div>
                          <div className="flex-grow flex flex-col justify-between">
                          <div className="flex justify-between gap-4">
                              <div>
                              <h3 className="font-semibold text-base md:text-lg">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.brand}</p>
                              <p className="text-sm text-muted-foreground">Size: {item.sizes[0]}</p>
                              </div>
                              <div className="text-right">
                                  <div className="flex items-center justify-end gap-2 mb-1">
                                    <p className="font-bold text-base md:text-lg">{item.price}</p>
                                    {discountPercentage > 0 && (
                                      <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded font-semibold">
                                        {discountPercentage}% OFF
                                      </span>
                                    )}
                                  </div>
                                  {discountPercentage > 0 && (
                                    <p className="text-sm text-muted-foreground line-through text-right">
                                      MRP ₹{originalPrice.toFixed(0)}
                                    </p>
                                  )}
                              <div className="flex items-center justify-end gap-1 mt-1">
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                                      onClick={() => setItemToRemove(item)}
                                      aria-label="Remove item"
                                  >
                                      <X className="h-5 w-5" />
                                  </Button>
                              </div>
                              </div>
                          </div>
                          </div>
                      </CardContent>
                      </Card>
                  );
                })}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4 uppercase">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</span>
                    <span>₹{originalTotal.toFixed(0)}</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Bag Discount</span>
                      <span>-₹{savings.toFixed(0)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Convenience Charges</span>
                    <span>₹{convenienceCharges}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>You Pay</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>

                {savings > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded px-1 py-0.5 mt-4 mb-2">
                    <div className="text-green-600 text-sm font-semibold text-center">
                      You are saving ₹{savings.toFixed(0)}.
                    </div>
                  </div>
                )}
                <Button variant="outline" className="w-full mt-2 mb-4 font-bold justify-start px-4" onClick={() => setPromoDialogOpen(true)}>
                  <span className="text-lg mr-2">%</span> USE A PROMO CODE
                </Button>
                <Button size="lg" className="w-full font-bold justify-between" onClick={() => { window.location.href = '/checkout'; }}>
                  CHECKOUT <ArrowRight className="h-5 w-5" />
                </Button>
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-center mb-2 uppercase">Accepted payment methods</h3>
                  <div className="flex justify-center items-center gap-2 flex-wrap text-muted-foreground text-xs">
                    <span>UPI</span> • <span>Cards</span> • <span>EMI</span> • <span>Netbanking</span> • <span>Wallet</span> • <span>Paylater</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Divider above footer */}
      <div className="border-t border-border w-full" />

      {/* Promo Code Dialog */}
      <Dialog open={promoDialogOpen} onOpenChange={setPromoDialogOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogTitle>Enter Promo Code</DialogTitle>
          <div className="mt-4">
            <input
              type="text"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your promo code"
              value={promoCode}
              onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
            />
            {promoError && (
              <div className="text-red-500 text-sm mt-2">{promoError}</div>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleApplyPromo}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!itemToRemove} onOpenChange={(isOpen) => !isOpen && setItemToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Bag?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{itemToRemove?.name}" from your bag? You can also move it to your wishlist to save it for later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToRemove(null)}>Cancel</AlertDialogCancel>
            <Button variant="outline" onClick={handleMoveToWishlist}>
              <Heart className="mr-2 h-4 w-4"/> Move to Wishlist
            </Button>
            <AlertDialogAction onClick={handleConfirmRemove}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
