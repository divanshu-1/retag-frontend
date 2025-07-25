
'use client';

import { useState, useRef, useEffect } from 'react';
import type { View } from '@/app/page';
import { Logo } from '@/components/logo';
import { Separator } from '@/components/ui/separator';
import { Twitter, Instagram, Facebook, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { PWAInstallButton } from '@/components/pwa-install-button';
import type { Category } from '@/lib/products';
import { cn } from '@/lib/utils';
import { DesktopUploadRestrictionModal } from '@/components/ui/desktop-upload-restriction-modal';
import { Button } from '@/components/ui/button';

function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

export default function Footer({ 
    onNavigate, 
    onNavigateToCategory, 
    onNavigateToFaq, 
    collapsible = false,
    hideOnMobile = false 
}: { 
    onNavigate?: (view: View) => void, 
    onNavigateToCategory?: (category: Category) => void, 
    onNavigateToFaq?: () => void,
    collapsible?: boolean,
    hideOnMobile?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);

  useEffect(() => {
    if (collapsible && isOpen && window.innerWidth < 768) {
      const timer = setTimeout(() => {
        footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100); // Small delay for animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, collapsible]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isMobileDevice() && installPromptEvent) {
      await installPromptEvent.prompt();
      setInstallPromptEvent(null);
    } else {
      setShowInstallModal(true);
    }
  };
  
  const NavItem = ({ view, children }: { view: View; children: React.ReactNode }) => {
    const className = "text-sm text-neutral-400 hover:text-white bg-transparent border-none p-0 text-left";
    if (onNavigate) {
      return (
        <button onClick={() => onNavigate(view)} className={className}>
          {children}
        </button>
      );
    }
    return (
      <Link href="/" className={className}>
        {children}
      </Link>
    );
  };
  
  const CategoryNavItem = ({ category, children }: { category: Category; children: React.ReactNode }) => {
    const className = "text-sm text-neutral-400 hover:text-white bg-transparent border-none p-0 text-left";
    if (onNavigateToCategory) {
      return (
        <button onClick={() => onNavigateToCategory(category)} className={className} type="button">
          {children}
        </button>
      );
    }
    // Fallback navigation using full URL to ensure it works from any page
    return (
      <button
        onClick={() => {
          window.location.href = `${window.location.origin}/#shop/${category}`;
        }}
        className={className}
        type="button"
      >
        {children}
      </button>
    );
  };

  const footerContent = (
    <div className="container py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
            <Logo className="text-white" onNavigate={onNavigate ? () => onNavigate('home') : undefined} />
            <p className="text-sm text-neutral-400">India’s smartest thrift store</p>
            <div className="flex items-center gap-2 -ml-2">
            {/* Social icons removed as per user request */}
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-white">Categories</h3>
            <CategoryNavItem category="Men">Men's Clothing</CategoryNavItem>
            <CategoryNavItem category="Women">Women's Clothing</CategoryNavItem>
            <CategoryNavItem category="Kids">Kids' Clothing</CategoryNavItem>
        </div>
        <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-white">Support</h3>
            {onNavigate ? (
              <button onClick={() => onNavigate('terms')} className="text-sm text-neutral-400 hover:text-white bg-transparent border-none p-0 text-left" type="button">Terms & Conditions</button>
            ) : (
              <a href="#terms" className="text-sm text-neutral-400 hover:text-white">Terms & Conditions</a>
            )}
            {onNavigate ? (
              <button onClick={() => onNavigate('privacy')} className="text-sm text-neutral-400 hover:text-white bg-transparent border-none p-0 text-left" type="button">Privacy Policy</button>
            ) : (
              <a href="#privacy" className="text-sm text-neutral-400 hover:text-white">Privacy Policy</a>
            )}
            {onNavigate ? (
              <button onClick={() => onNavigate('contact')} className="text-sm text-neutral-400 hover:text-white bg-transparent border-none p-0 text-left" type="button">Contact Us</button>
            ) : (
              <a href="#contact" className="text-sm text-neutral-400 hover:text-white">Contact Us</a>
            )}
            {onNavigateToFaq ? (
            <button
                onClick={onNavigateToFaq}
                className="text-sm text-neutral-400 hover:text-white bg-transparent border-none p-0 text-left"
                type="button"
            >
                FAQ
            </button>
            ) : (
            <a href="/#faq" className="text-sm text-neutral-400 hover:text-white">
                FAQ
            </a>
            )}
        </div>
        <div className="flex flex-col gap-2 self-stretch">
            <h3 className="font-bold text-lg text-white">Install App</h3>
            <p className="text-sm text-neutral-400">Add ReTag to your home screen for quick access</p>
            <div className="mt-auto">
                <Button
                    variant="secondary"
                    className="w-full rounded-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    onClick={handleInstallClick}
                    disabled={isMobileDevice() && !installPromptEvent}
                >
                    Install PWA
                </Button>
            </div>
        </div>
        </div>
        <Separator className="my-8 bg-neutral-700" />
        <div className="text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} ReTag. All rights reserved. All deliveries, pickups, and payments are simulated.
        </div>
        <DesktopUploadRestrictionModal open={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </div>
  );

  const standardFooter = <footer className={cn("bg-black text-white", hideOnMobile && "hidden md:block")}>{footerContent}</footer>;

  if (!collapsible) {
    return standardFooter;
  }

  const mobileAboutContent = (
    <div className="px-4 py-6">
      {footerContent}
      <p className="text-sm text-neutral-400 mb-2">India’s smartest thrift store</p>

    </div>
  );

  const collapsibleFooterMobile = (
    <footer className={cn("bg-background text-foreground", hideOnMobile ? "pb-0" : "pb-16")} ref={footerRef}>
      <Separator className="bg-border" />
      <div 
        className="container max-w-7xl mx-auto py-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-foreground">About ReTag</span>
        <ChevronDown className={cn("h-6 w-6 text-foreground transition-transform duration-300", isOpen && "rotate-180")} />
      </div>
      <div className={cn(
        "transition-[max-height,opacity] duration-700 ease-in-out overflow-hidden bg-black text-white",
        isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
      )}>
        {isOpen ? mobileAboutContent : null}
      </div>
    </footer>
  );
  
  return (
    <>
      <div className="md:hidden">
        {collapsibleFooterMobile}
      </div>
      <div className="hidden md:block">
        {standardFooter}
      </div>
    </>
  );
}
