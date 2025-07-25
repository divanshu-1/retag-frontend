import type { View } from '@/app/page';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export default function Hero({ onNavigate }: { onNavigate: (view: View) => void }) {
  const handleScroll = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative h-screen min-h-[500px] w-full flex items-center justify-center text-white">
      <Image
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
        alt="Interior of a stylish second-hand clothing store"
        data-ai-hint="clothing store"
        fill
        className="object-cover brightness-50"
        priority
      />
      <div className="relative z-10 text-center p-4">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 font-headline tracking-tight">
          <span className="whitespace-nowrap">Sell Smart. Buy Better.</span><br /> ReTag.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/90">
          India’s smartest thrift store – quality-checked & AI-priced.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="font-bold text-lg px-8 py-6" onClick={() => onNavigate('sell')}>
            Sell Your Item
          </Button>
          <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 border-2 border-white text-white bg-transparent hover:bg-white hover:text-background" onClick={() => onNavigate('shop')}>
            Shop Now
          </Button>
        </div>
      </div>
       <button onClick={handleScroll} className="absolute bottom-20 animate-bounce" aria-label="Scroll down">
         <ChevronDown className="h-8 w-8 text-white" />
      </button>
    </section>
  );
}
