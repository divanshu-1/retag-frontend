
'use client';

import type { View } from '@/app/page';
import { Home, LayoutGrid, TicketPercent, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoginButton } from '@/components/auth/login-button';
import { useUser } from '@/hooks/use-user';


interface MobileNavProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

export default function MobileNav({ activeView, onNavigate }: MobileNavProps) {
  const { isLoggedIn } = useUser();
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: LayoutGrid },
    { id: 'sell', label: 'Sell', icon: TicketPercent },
  ] as const;

  const AccountButton = () => {
    if (isLoggedIn) {
      return (
        <button
          onClick={() => onNavigate('account')}
          className={cn(
            'flex flex-col items-center justify-center gap-1 text-xs font-medium w-full h-full',
            activeView === 'account' ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <User className="h-6 w-6 mb-0.5" />
          <span>Account</span>
        </button>
      );
    }

    return (
      <LoginButton>
        <button
          className={cn(
            'flex flex-col items-center justify-center gap-1 text-xs font-medium w-full h-full',
            'text-muted-foreground' // No active state for account
          )}
        >
          <User className="h-6 w-6 mb-0.5" />
          <span>Account</span>
        </button>
      </LoginButton>
    );
  };
  
  if (activeView === 'account' || activeView === 'profile') {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="container mx-auto h-16 flex justify-around items-center max-w-md px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 text-xs font-medium w-full h-full',
              activeView === item.id ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-6 w-6 mb-0.5" />
            <span>{item.label}</span>
          </button>
        ))}
        <AccountButton />
      </div>
    </div>
  );
}
