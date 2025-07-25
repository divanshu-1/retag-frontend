
"use client";

import { useState, useEffect } from 'react';
import type { View } from '@/app/page';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu, ShoppingBag, User, Heart, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { LoginButton } from '@/components/auth/login-button';
import type { Category } from '@/lib/products';
import { useUser } from '@/hooks/use-user';

export default function Header({ 
  activeView, 
  onNavigate,
  onLogout,
  onNavigateToCategory,
  showBackButton,
}: { 
  activeView?: View; 
  onNavigate?: (view: View) => void;
  onLogout?: () => void;
  onNavigateToCategory?: (category: Category) => void;
  showBackButton?: boolean;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { isLoggedIn } = useUser();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'sell', label: 'Sell' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ] as const;

  const mobileNavCategories: { name: Category; description: string; image: string; imageHint: string }[] = [
    {
      name: 'Women',
      description: 'Shop Westernwear, Indianwear and More',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop',
      imageHint: 'woman portrait'
    },
    {
      name: 'Men',
      description: 'Shop Formals, Casuals and Denims',
      image: 'https://img.freepik.com/free-photo/young-sensitive-man-thinking_23-2149459724.jpg',
      imageHint: 'man portrait'
    },
    {
      name: 'Kids',
      description: 'Shop for Boys, Girls and Infants',
      image: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      imageHint: 'kids fashion'
    },
  ];
  
  const headerClasses = cn(
      "fixed top-0 z-50 w-full transition-colors duration-300 ease-in-out",
      isScrolled
        ? 'bg-background/95 backdrop-blur-sm text-foreground shadow-md border-b border-border'
        : 'bg-transparent text-white'
  );

  const WishlistButton = ({ isMobile = false, onClose }: { isMobile?: boolean, onClose?: () => void }) => {
    const buttonContent = (
      <>
        <Heart className={cn(isMobile && "mr-2", "h-5 w-5")} />
        {isMobile && `Your Wishlist (${wishlistItemCount})`}
        {!isMobile && wishlistItemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {wishlistItemCount}
          </span>
        )}
        <span className="sr-only">Open wishlist</span>
      </>
    );

    const handleClick = () => {
        onNavigate?.('wishlist');
        onClose?.();
    }

    if (isMobile) {
      if (isLoggedIn) {
        return (
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleClick}>
            {buttonContent}
          </Button>
        );
      }
      
      return (
        <LoginButton>
          <Button variant="ghost" className="w-full justify-start gap-2">
            {buttonContent}
          </Button>
        </LoginButton>
      );
    }

    // Desktop version - use regular button to match cart and account
    if (isLoggedIn) {
      return (
        <button
          type="button"
          onClick={handleClick}
          className={cn("relative p-2 transition-opacity hover:opacity-75", isScrolled ? "text-foreground" : "text-white")}
        >
          {buttonContent}
        </button>
      );
    }

    return (
      <LoginButton>
        <button
          type="button"
          className={cn("relative p-2 transition-opacity hover:opacity-75", isScrolled ? "text-foreground" : "text-white")}
        >
          {buttonContent}
        </button>
      </LoginButton>
    );
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <header className={headerClasses}>
      <div className="container relative flex h-16 max-w-7xl items-center justify-between">
        
        {/* Mobile Header */}
        <div className="flex w-full items-center justify-between md:hidden">
          {showBackButton ? (
            <Button variant="ghost" size="icon" className={cn("-ml-2", isScrolled ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10")} onClick={handleBackClick}>
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back</span>
            </Button>
          ) : (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("ml-1", isScrolled ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10")}>
                  <Menu className="h-7 w-7" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 flex flex-col h-full">
                <SheetHeader className="p-4 pb-4 border-b">
                  <SheetTitle className="text-2xl font-bold">Categories</SheetTitle>
                </SheetHeader>
                <div className="flex-grow overflow-y-auto">
                  <div className="p-4">
                    <nav className="flex flex-col gap-3 text-lg font-medium">
                      {mobileNavCategories.map((cat) => {
                          return (
                              <button
                                  key={cat.name}
                                  className="relative overflow-hidden rounded-xl h-24 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                  onClick={() => {
                                      onNavigateToCategory?.(cat.name);
                                      setIsMobileMenuOpen(false);
                                  }}
                              >
                                  {/* Background Image */}
                                  <Image
                                      src={cat.image}
                                      alt={cat.name}
                                      fill
                                      className="object-cover object-center"
                                      data-ai-hint={cat.imageHint}
                                  />
                                  {/* Overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
                                  {/* Content */}
                                  <div className="relative z-10 flex flex-col justify-center h-full px-4 text-left">
                                      <span className="font-bold text-lg text-white">{cat.name}</span>
                                      <span className="text-sm text-white/90 mt-0.5">{cat.description}</span>
                                  </div>
                              </button>
                          );
                      })}
                    </nav>
                  </div>
                </div>
                <div className="border-t p-4 mt-auto">
                  <div className="flex flex-col gap-4">
                    <WishlistButton isMobile onClose={() => setIsMobileMenuOpen(false)} />
                    <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => { onNavigate?.('cart'); setIsMobileMenuOpen(false); }}>
                      <ShoppingBag /> Your Bag ({cartItemCount})
                    </Button>
                    <LoginButton>
                        <Button variant="secondary" className="w-full justify-start gap-2">
                          <User /> Login
                        </Button>
                      </LoginButton>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
             <Logo className={cn(activeView === 'home' && !isScrolled ? "text-white" : "text-foreground", "text-xl")} onNavigate={onNavigate ? () => onNavigate('home') : undefined} />
          </div>

          <div className="flex items-center gap-0">
             <WishlistButton />
             <button
                type="button"
                onClick={() => onNavigate?.('cart')}
                className={cn("relative p-2 transition-opacity hover:opacity-75", isScrolled ? "text-foreground" : "text-white")}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cartItemCount}
                  </span>
                )}
                <span className="sr-only">Open cart</span>
              </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden w-full items-center justify-between md:flex">
            <div className="flex-1">
              <Logo className={activeView === 'home' && !isScrolled ? "text-white" : "text-foreground"} onNavigate={onNavigate ? () => onNavigate('home') : undefined} />
            </div>

            <nav className="flex-none text-base font-medium flex items-center gap-6">
            {navItems.map((item) => {
                const className = cn(
                    'transition-colors bg-transparent border-none p-0 hover:opacity-80',
                    activeView === item.id ? 'font-semibold underline' : '',
                    isScrolled ? 'text-foreground' : 'text-white'
                );
                return (
                    <button
                        key={item.id}
                        onClick={() => onNavigate?.(item.id)}
                        className={className}
                    >
                    {item.label}
                    </button>
                )
            })}
            </nav>

            <div className="flex flex-1 justify-end items-center gap-2">
                <WishlistButton />
                <button
                    type="button"
                    onClick={() => onNavigate?.('cart')}
                    className={cn("relative p-2 transition-opacity hover:opacity-75", isScrolled ? "text-foreground" : "text-white")}
                >
                    <ShoppingBag className="h-5 w-5" />
                    {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {cartItemCount}
                    </span>
                    )}
                    <span className="sr-only">Open cart</span>
                </button>
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => onNavigate?.('account')}
                    className={cn("p-2 transition-opacity hover:opacity-75", isScrolled ? "text-foreground" : "text-white")}
                  >
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </button>
                ) : (
                  <LoginButton>
                      <button
                          type="button"
                          className={cn("p-2 transition-opacity hover:opacity-75", isScrolled ? "text-foreground" : "text-white")}
                      >
                      <User className="h-5 w-5" />
                      <span className="sr-only">Login</span>
                      </button>
                  </LoginButton>
                )}
            </div>
        </div>
      </div>
    </header>
  );
}
