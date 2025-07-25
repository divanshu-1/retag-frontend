'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import type { View } from '@/app/page';
import type { Category } from '@/lib/products';
import { useUser } from '@/hooks/use-user';

export default function AboutUsPage() {
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
          <div className="space-y-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary mb-4 text-center">
              About Us
            </h1>
            <div className="space-y-8 text-base text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-foreground mt-4 mb-2 text-left">Welcome to ReTag</h2>
                <p className="text-justify">
                  Welcome to ReTag - your ultimate destination for premium thrift apparel at unbeatable
                  prices. Born out of a passion for style, affordability, and sustainability, we recognized a glaring
                  gap in the fashion industry: the disconnect between premium clothing and affordability. And thus,
                  ReTag was born.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mt-4 mb-2 text-left">Our Mission</h2>
                <p className="text-justify">
                  At ReTag, we cater to the needs and desires of the Gen-Z community, understanding the
                  importance of both quality and accessibility in fashion. We believe that everyone deserves to
                  express themselves through their clothing choices without breaking the bank. That's why we curate
                  a diverse selection of high-quality thrifted pieces, ranging from timeless classics to trendy must-haves,
                  all at prices that won't leave your wallet feeling empty.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mt-4 mb-2 text-left">Our Vision</h2>
                <p className="text-justify">
                  Our vision is simple yet powerful: to bridge the chasm between premium fashion and affordability.
                  We understand that in today's fast-paced world, consumers seek value without compromising on
                  style. With ReTag, you can have the best of both worlds - premium quality clothing at
                  prices that won't leave you second-guessing.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold text-foreground mt-4 mb-2 text-left">Sustainability Commitment</h2>
                <p className="text-justify">
                  But our mission extends beyond just offering affordable fashion. We are committed to promoting
                  sustainability in the fashion industry by giving pre-loved clothing a new lease on life. By shopping
                  with us, you're not only saving money but also contributing to a more sustainable future.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mt-4 mb-2 text-left">What Sets Us Apart</h2>
                <p className="text-justify">
                  What sets us apart is our dedication to providing an unparalleled shopping experience. From
                  hand-picked selections to exceptional customer service, we strive to make every interaction with
                  ReTag a memorable one. Whether you're a fashion enthusiast looking to refresh your
                  wardrobe or a conscientious shopper seeking eco-friendly alternatives, we've got something for
                  everyone.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mt-4 mb-2 text-left">Join Our Journey</h2>
                <p className="text-justify">
                  Join us on our journey as we redefine the way you shop for fashion. Welcome to ReTag,
                  where premium thrift apparel meets affordability – because everyone deserves to look and feel
                  their best, without breaking the bank.
                </p>
                <p className="mt-4 font-semibold text-justify">
                  Shop now and experience the thrill of thrifting with ReTag.
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
