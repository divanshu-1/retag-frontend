import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ClipboardList, Sparkles, ShieldCheck, Truck, Wrench, Store } from 'lucide-react';

const steps = [
  {
    icon: <ClipboardList className="w-10 h-10 text-primary" />,
    title: '1. List Your Item',
    description: 'Choose details like brand, size, and age, then upload clear photos of your item.',
  },
  {
    icon: <Sparkles className="w-10 h-10 text-primary" />,
    title: '2. Get AI Pricing',
    description: 'Our smart AI assesses your item and suggests a competitive, fair price instantly.',
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: '3. Admin Approval',
    description: 'Our team reviews the AI suggestion to finalize a transparent offer for you.',
  },
  {
    icon: <Truck className="w-10 h-10 text-primary" />,
    title: '4. Easy Pickup & Pay',
    description: 'Accept the offer and we’ll arrange a free pickup and pay you via UPI/Bank transfer.',
  },
  {
    icon: <Wrench className="w-10 h-10 text-primary" />,
    title: '5. We Revamp It',
    description: 'We handle professional cleaning and minor repairs to get your item store-ready.',
  },
  {
    icon: <Store className="w-10 h-10 text-primary" />,
    title: '6. Goes On Sale',
    description: 'Your item gets a new life! It’s listed on our store for someone else to love.',
  },
];

export default function SellingProcess() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-card">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tight text-primary">How Selling Works</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Turn your closet into cash in a few simple steps. It's fast, easy, and smart.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center p-6 flex flex-col items-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="mb-4">{step.icon}</div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-bold font-headline">{step.title}</CardTitle>
              </CardHeader>
              <CardDescription className="mt-2 text-base">
                {step.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
