'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import type { View } from '@/app/page';
import type { Category } from '@/lib/products';
import { useUser } from '@/hooks/use-user';

export default function ShippingPolicyPage() {
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
              Shipping Policy
            </h1>

            <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
              <section>
                <p className="text-justify">
                  At ReTag, we're committed to delivering your pre-loved fashion finds safely and efficiently.
                  Our shipping policy ensures transparency and reliability in every delivery.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 text-left">Shipping Methods & Costs</h2>

                <h3 className="text-lg font-semibold text-white mb-2 text-left">Packaging & Delivery Fee</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 text-justify">
                  <li>₹70 for orders below ₹499</li>
                  <li>₹20 for orders from ₹499 - ₹999</li>
                  <li><strong>FREE delivery</strong> for all orders above ₹999</li>
                  <li>3-7 business days standard delivery</li>
                  <li>Available across India</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 text-left">Convenience Charges</h2>

                <h3 className="text-lg font-semibold text-white mb-2 text-left">Platform Fee</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 text-justify">
                  <li>₹29 applied to all customers</li>
                  <li>Platform upkeep and maintenance</li>
                  <li>Customer support services</li>
                  <li><strong>FREE for First Order</strong></li>
                </ul>

                <p className="text-justify mb-4">
                  <strong>Total Convenience Charges:</strong> ₹29 (Platform Fee) + Delivery Fee (based on order value)
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 text-left">Order Processing</h2>

                <h3 className="text-lg font-semibold text-white mb-2 text-left">Processing Timeline</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 text-justify">
                  <li><strong>Order Confirmation:</strong> Within 2 hours of payment</li>
                  <li><strong>Quality Check:</strong> 1-2 business days for item inspection</li>
                  <li><strong>Packaging:</strong> Same day after quality approval</li>
                  <li><strong>Dispatch:</strong> Within 24 hours of packaging</li>
                </ul>

                <p className="text-justify">
                  <strong>Cut-off Time:</strong> Orders placed before 2:00 PM on business days
                  are processed the same day. Weekend orders are processed on Monday.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 text-left">Delivery Coverage</h2>

                <h3 className="text-lg font-semibold text-white mb-2 text-left">Tier 1 Cities (1-3 business days)</h3>
                <p className="mb-4 text-justify">Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Kolkata, Ahmedabad</p>

                <h3 className="text-lg font-semibold text-white mb-2 text-left">Tier 2 Cities (3-5 business days)</h3>
                <p className="mb-4 text-justify">Jaipur, Lucknow, Kanpur, Nagpur, Indore, Bhopal, Visakhapatnam, Patna</p>

                <h3 className="text-lg font-semibold text-white mb-2 text-left">Other Areas (5-7 business days)</h3>
                <p className="text-justify">All other serviceable PIN codes across India</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 text-left">Delivery Process</h2>

                <h3 className="text-lg font-semibold text-white mb-2 text-left">Packaging Standards</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 text-justify">
                  <li>Eco-friendly packaging materials</li>
                  <li>Protective wrapping for delicate items</li>
                  <li>Tamper-evident sealing</li>
                  <li>Weather-resistant outer packaging</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mb-2 text-left">Tracking & Updates</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 text-justify">
                  <li>SMS and email notifications at each stage</li>
                  <li>Real-time tracking via our app/website</li>
                  <li>Delivery partner contact details</li>
                  <li>Estimated delivery time updates</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mb-2 text-left">Delivery Attempts</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 text-justify">
                  <li>Up to 3 delivery attempts</li>
                  <li>24-hour notice before each attempt</li>
                  <li>Flexible delivery time slots</li>
                  <li>Safe drop option for trusted locations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 text-left">Special Circumstances</h2>

                <h3 className="text-lg font-semibold text-white mb-2 text-left">Address Changes</h3>
                <p className="mb-4 text-justify">
                  Address changes are possible only before dispatch. Contact our support team
                  immediately if you need to modify your delivery address.
                </p>

                <h3 className="text-lg font-semibold text-white mb-2 text-left">Damaged or Lost Packages</h3>
                <p className="mb-4 text-justify">
                  We take full responsibility for items damaged during transit. Report any
                  issues within 24 hours of delivery for immediate resolution and replacement.
                </p>

                <h3 className="text-lg font-semibold text-white mb-2 text-left">Delivery Delays</h3>
                <p className="text-justify">
                  While we strive for timely delivery, factors like weather, festivals, or
                  unforeseen circumstances may cause delays. We'll keep you informed of any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 text-left">Return Shipping</h2>

                <h3 className="text-lg font-semibold text-white mb-2 text-left">Return Process</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 text-justify">
                  <li><strong>Free return pickup</strong> for defective or incorrect items</li>
                  <li><strong>Customer pays return shipping</strong> for change of mind returns</li>
                  <li>Return pickup scheduled within 2-3 business days</li>
                  <li>Original packaging preferred but not mandatory</li>
                  <li>Refund processed within 5-7 business days after return verification</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 text-left">Need Help?</h2>

                <p className="mb-4 text-justify">
                  Have questions about your shipment or need to modify your order?
                </p>
                <p className="text-justify"><strong>Customer Support:</strong> retagcontact00@gmail.com</p>
                <p className="text-justify"><strong>Phone:</strong> +91-8847674125</p>
                <p className="text-justify"><strong>Hours:</strong> Monday to Saturday, 9:00 AM - 7:00 PM</p>
              </section>

              <section>
                <p className="text-center">
                  Last updated: January 2025<br />
                  This policy is subject to change. Please check back regularly for updates.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      {/* Divider above footer */}
      <div className="border-t border-border w-full" />
    </div>
  );
}
