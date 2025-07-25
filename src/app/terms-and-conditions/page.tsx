
'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import type { View } from '@/app/page';
import type { Category } from '@/lib/products';
import { useUser } from '@/hooks/use-user';

export default function TermsAndConditionsPage() {
  const router = useRouter();
  const { logout } = useUser();

  // Navigation functions
  const handleNavigate = (view: View, category?: Category) => {
    if (view === 'home') {
      router.push('/');
    } else if (view === 'shop' && category) {
      window.location.href = `${window.location.origin}/#shop/${category}`;
    } else {
      window.location.href = `${window.location.origin}/#${view}`;
    }
  };

  const handleSelectCategory = (category: Category) => {
    window.location.href = `${window.location.origin}/#shop/${category}`;
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#18181b]">
      <Header
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onNavigateToCategory={handleSelectCategory}
        showBackButton={true}
      />
      <main className="flex-grow pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary text-center">
              Terms & Conditions
            </h1>

            <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
              <h2 className="text-xl font-bold text-foreground mt-4 text-left">1. Introduction</h2>
              <p className="text-justify">
                Welcome to ReTag Marketplace ("ReTag", "we", "our", "us"). These Terms and Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our platform. All transactions and activities are simulated for demonstration purposes.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-4 text-left">2. Use of Our Platform</h2>
              <p className="text-justify">
                You must be at least 18 years old to use our platform or have the permission of a legal guardian. You are responsible for ensuring that your account information is accurate and for maintaining the confidentiality of your account and password.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-4 text-left">3. Selling on ReTag</h2>
              <p className="text-justify">
                By listing an item for sale, you confirm that you are the rightful owner of the item and that the item's description is accurate and not misleading. All items are subject to our AI-pricing suggestion and admin approval process. ReTag provides a platform for simulated transactions; no real items are exchanged or payments processed.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-4 text-left">4. Buying on ReTag</h2>
              <p className="text-justify">
                When you purchase an item, you are entering into a simulated agreement to buy. While we perform quality checks, items are sold "as-is." All payments, shipping, and deliveries are simulated and not real transactions.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-4 text-left">5. Intellectual Property</h2>
              <p className="text-justify">
                All content on this platform, including text, graphics, logos, and images, is the property of ReTag or its content suppliers and is protected by international copyright laws.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-4 text-left">6. Prohibited Activities</h2>
              <p className="text-justify">
                You may not use our platform for any illegal or unauthorized purpose. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the service without express written permission from us.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-4 text-left">7. Limitation of Liability</h2>
              <p className="text-justify">
                ReTag and its directors, employees, and affiliates will not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services, as all activities are for demonstration purposes only.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-4 text-left">8. Indemnification</h2>
              <p className="text-justify">
                You agree to indemnify and hold harmless ReTag and our partners, officers, directors, agents, and employees from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms and Conditions.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-4 text-left">9. Governing Law</h2>
              <p className="text-justify">
                These Terms and Conditions and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of India.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-4 text-left">10. Changes to Terms & Conditions</h2>
              <p className="text-justify">
                We reserve the right to update, change or replace any part of these Terms and Conditions by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-4 text-left">11. Contact Information</h2>
              <p className="text-justify">
                Questions about the Terms and Conditions should be sent to us at support@retag.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      {/* Divider above footer */}
      <div className="border-t border-border w-full" />
    </div>
  );
}
