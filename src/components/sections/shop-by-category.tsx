'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Category } from '@/lib/products';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import NewArrivals from '@/components/sections/new-arrivals';

const categoryData = [
  {
    name: 'Women',
    title: 'For Women',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop',
    imageHint: 'woman portrait',
    hoverDescription: 'For all the Super Women.',
    objectPositionClass: 'object-center',
  },
  {
    name: 'Men',
    title: 'For Men',
    image: 'https://img.freepik.com/free-photo/young-sensitive-man-thinking_23-2149459724.jpg',
    imageHint: 'man portrait',
    hoverDescription: 'For all the Super Men.',
    objectPositionClass: 'object-center',
  },
  {
    name: 'Kids',
    title: 'For Kids',
    image: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    imageHint: 'kids fashion',
    objectPositionClass: 'object-top',
    hoverDescription: 'For the tiny trendsetters.',
  },
];

const decorativeImages = [
  { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop', alt: 'Woman in stylish outfit', hint: 'woman fashion', rotation: -8, y: -180, x: -250 },
  { src: 'https://img.freepik.com/free-photo/young-sensitive-man-thinking_23-2149459724.jpg', alt: 'Man thinking', hint: 'man portrait', rotation: 4, y: -130, x: -50 },
  { src: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', alt: 'Kid in yellow jacket', hint: 'kid fashion', rotation: 9, y: -170, x: 150 },
  { src: 'https://images.insmind.com/market-operations/market/side/051e8e5fdf134ac1a70280a14bf14863/1726020233495.jpg', alt: 'Stylish kid in sunglasses', hint: 'kid fashion', rotation: -3, y: -120, x: 350 }
];

export default function ShopByCategory({ onSelectCategory }: { onSelectCategory: (category: Category) => void }) {
  const cardsRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    cardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const plusPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.59l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <>
      {/* Hero Section */}
      <section className="hidden md:flex relative h-screen w-full flex-col items-center justify-center text-white bg-black overflow-hidden pt-10 md:pt-20">
        <div className="absolute inset-0" style={{ backgroundImage: plusPattern }} />

        {/* Decorative images */}
        <div className="absolute inset-0 flex items-center justify-center scale-[0.85] lg:scale-[0.95] transform -translate-y-10">
          {decorativeImages.map((img) => (
            <div
              key={img.alt}
              className="absolute w-56 h-72 shadow-2xl rounded-2xl overflow-hidden bg-gray-700"
              style={{ transform: `rotate(${img.rotation}deg) translateY(${img.y}px) translateX(${img.x}px)` }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-center"
                data-ai-hint={img.hint}
              />
            </div>
          ))}
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center p-4 flex flex-col items-center transform translate-y-28">
          <p className="text-sm tracking-widest text-muted-foreground uppercase">Explore Collections</p>
          <h1 className="text-5xl lg:text-7xl font-black mt-4 leading-tight">Unique Styles For Everyone</h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Curated, quality-checked thrift fashion for men, women, and kids. Find your next favorite piece.
          </p>
        </div>

        {/* Scroll arrow */}
        <button onClick={handleScroll} className="absolute bottom-8 sm:bottom-14 animate-bounce z-10" aria-label="Scroll down">
          <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <ChevronDown className="h-8 w-8" />
          </div>
        </button>
      </section>

      {/* Category Cards Section */}
      <section ref={cardsRef} id="category-cards" className="py-12 md:py-24 bg-card">
        <div className="container w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 text-foreground md:hidden">
            <p className="text-sm tracking-widest text-muted-foreground uppercase">Explore Collections</p>
            <h1 className="text-3xl md:text-5xl font-black mt-2">Unique Styles For Everyone</h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Curated, quality-checked thrift fashion for men, women, and kids. Find your next favorite piece.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {categoryData.map((cat) => (
              <div
                key={cat.name}
                onClick={() => onSelectCategory(cat.name as Category)}
                className="relative group aspect-[3/2] md:aspect-[4/5] rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className={cn(
                    'object-cover transition-transform duration-500 group-hover:scale-105',
                    cat.objectPositionClass
                  )}
                  data-ai-hint={cat.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:bg-black/70 transition-colors duration-300" />
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col items-center justify-center md:justify-end text-center">
                  <div className="transition-transform duration-300 group-hover:-translate-y-2 md:group-hover:-translate-y-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{cat.title}</h2>
                    <p className="mt-1 md:mt-2 text-white/90 text-sm md:text-base max-h-0 opacity-0 transition-all duration-300 group-hover:max-h-40 group-hover:opacity-100">
                      {cat.hoverDescription}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-3 md:mt-4 text-sm md:text-base bg-transparent border-white text-white hover:bg-white hover:text-black transition-transform duration-300 group-hover:scale-105"
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <NewArrivals />
    </>
  );
}
