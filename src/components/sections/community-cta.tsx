'use client';

import { LoginButton } from '@/components/auth/login-button';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, Star, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: <Smartphone className="h-10 w-10 text-primary" />,
    title: 'Mobile Optimized',
    description: 'Responsive across all devices',
  },
  {
    icon: <Download className="h-10 w-10 text-primary" />,
    title: 'Install as App',
    description: 'Native app experience',
  },
  {
    icon: <Star className="h-10 w-10 text-primary" />,
    title: 'Quality Assured',
    description: 'Every item verified',
  },
];

export default function CommunityCTA() {
  return (
    <section className="bg-card py-12 sm:py-16">
      <div className="container max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-black tracking-tight text-primary">
          Join ReTag Community
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Sign up with Google and start your sustainable fashion journey
        </p>
        <div className="mt-8 flex justify-center">
            <LoginButton>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-medium">
                <Search className="h-5 w-5 mr-2" /> Continue with Google
              </Button>
            </LoginButton>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-4 p-6 bg-background rounded-lg shadow-sm border"
            >
              {feature.icon}
              <h3 className="font-bold text-lg">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
