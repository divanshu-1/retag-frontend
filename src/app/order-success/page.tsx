"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Simple confetti effect using canvas-confetti (if available)
function Confetti() {
  useEffect(() => {
    let confetti;
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then((module) => {
        confetti = module.default;
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.6 },
        });
      });
    }
    return () => {};
  }, []);
  return null;
}

export default function OrderSuccess() {
  const router = useRouter();

  // Note: Cart is now cleared in the checkout flow after payment verification
  // No need to clear it again here

  const handleContinueShopping = () => {
    router.push('/');
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-background px-4">
      <Confetti />
      <div className="bg-card rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full">
        <svg className="mb-6" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2l4-4"/></svg>
        <h1 className="text-4xl font-extrabold text-primary mb-2 text-center">Order Placed Successfully!</h1>
        <p className="text-lg text-muted-foreground mb-6 text-center">Thank you for shopping with ReTag. Your payment was successful and your order is being processed.</p>
        <div className="w-full bg-muted rounded-lg p-4 mb-6">
          <h2 className="font-bold text-lg mb-2">Order Summary</h2>
          <div className="text-sm text-muted-foreground">(Order details will appear here. You can enhance this with real data!)</div>
        </div>
        <Button
          onClick={handleContinueShopping}
          className="font-bold px-6 py-3 rounded-lg shadow mb-2"
          size="lg"
        >
          Continue Shopping
        </Button>
        <div className="text-xs text-muted-foreground mt-2">Need help? <a href="/contact" className="underline">Contact support</a></div>
      </div>
    </div>
  );
} 