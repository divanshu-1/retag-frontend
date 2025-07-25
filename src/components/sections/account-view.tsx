
'use client';

import type { View } from '@/app/page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ChevronRight,
  CreditCard,
  FileText,
  Heart,
  Info,
  Lock,
  LogOut,
  MessageSquare,
  Package,
  Truck,
  User as UserIcon,
  LayoutDashboard,
} from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@/hooks/use-user';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-bold uppercase text-muted-foreground tracking-wider pt-6 pb-2">{children}</h2>
);

const MenuItem = ({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description?: string, onClick?: () => void }) => (
  <button onClick={onClick} className="w-full text-left p-4 bg-card rounded-lg flex items-center gap-4 hover:bg-muted transition-colors">
    <div className="text-primary">{icon}</div>
    <div className="flex-grow">
      <h3 className="font-semibold text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    <ChevronRight className="h-5 w-5 text-muted-foreground" />
  </button>
);

const FooterIcon = ({ icon, label, href, onClick }: { icon: React.ReactNode; label: string; href?: string; onClick?: () => void; }) => (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className="flex flex-col items-center gap-2 text-center text-xs text-muted-foreground hover:text-primary transition-colors no-underline"
    >
      <div className="h-12 w-12 rounded-full bg-card flex items-center justify-center text-primary">{icon}</div>
      <span>{label}</span>
    </a>
  );


export default function AccountView({ onNavigate, onLogout }: { onNavigate: (view: View) => void; onLogout: () => void }) {
  const { user } = useUser();
  
  const handleLinkNavigation = (url: string) => {
    window.location.href = url;
  };
  
  const userName = user?.name || 'there';
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-8 w-8"/>;

  const isAdmin = user?.email === 'retagcontact00@gmail.com';

  // Remove all address management state, effects, and UI from this file.


  return (
    <div className="bg-[#18181b] min-h-full pt-24 pb-20">
      <div className="container max-w-7xl mx-auto px-4">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-foreground">Hey, {userName}!</h1>
            <p className="text-sm text-muted-foreground">Logged in via {user?.email}</p>
          </div>
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-2xl">{userInitial}</AvatarFallback>
          </Avatar>
        </div>

        {isAdmin ? (
          <>
            <SectionHeader>ADMIN DASHBOARD</SectionHeader>
            <div className="block cursor-pointer" onClick={() => { window.location.hash = 'admin'; }}>
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-primary/10 to-background rounded-xl shadow-lg hover:from-primary/20 hover:shadow-xl transition-all">
                <LayoutDashboard className="h-10 w-10 text-primary" />
                <div className="flex-1">
                  <div className="font-extrabold text-2xl text-primary mb-1">Admin Dashboard</div>
                  <div className="text-base text-muted-foreground">Manage seller requests, approve listings, and control your marketplace.</div>
                </div>
                <Button variant="default" className="ml-4">Go to Dashboard</Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <SectionHeader>Orders and Wishlist</SectionHeader>
            <div className="space-y-4">
              <MenuItem icon={<Package className="h-6 w-6" />} title="Orders" description="Check your Order Status" onClick={() => onNavigate('orders')} />
              <MenuItem icon={<Heart className="h-6 w-6" />} title="Wishlist" description="Shop from your wishlist" onClick={() => onNavigate('wishlist')} />
            </div>
          </>
        )}

        {/* Support */}
        <SectionHeader>Support</SectionHeader>
        <div className="space-y-4">
          <MenuItem icon={<MessageSquare className="h-6 w-6" />} title="Contact Us" description="Get in touch with our team" onClick={() => onNavigate('contact')} />
        </div>

        {/* Personalization */}
        <SectionHeader>Personalization</SectionHeader>
        <div className="space-y-4">
          <MenuItem icon={<UserIcon className="h-6 w-6" />} title="Profile" description="View and update your profile" onClick={() => onNavigate('profile')} />
          <MenuItem icon={<CreditCard className="h-6 w-6" />} title="Payment" description="Manage your payment account" onClick={() => onNavigate('payment')} />
        </div>

        <Separator className="my-8 bg-border" />

        {/* Footer Links */}
        <div className="grid grid-cols-4 gap-4 text-center">
            <FooterIcon icon={<Truck className="h-6 w-6" />} label="Shipping Policy" onClick={() => handleLinkNavigation('/shipping-policy')} />
            <FooterIcon icon={<FileText className="h-6 w-6" />} label="Terms & Conditions" onClick={() => handleLinkNavigation('/terms-and-conditions')} />
            <FooterIcon icon={<Lock className="h-6 w-6" />} label="Privacy Policy" onClick={() => handleLinkNavigation('/privacy-policy')} />
            <FooterIcon icon={<Info className="h-6 w-6" />} label="About Us" onClick={() => handleLinkNavigation('/about-us')} />
        </div>

        <Button variant="outline" className="w-full mt-8 mb-2" onClick={onLogout}>
          <LogOut className="h-5 w-5 mr-2"/> Logout
        </Button>
      </div>
    </div>
  );
}
