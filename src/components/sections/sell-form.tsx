'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, ClipboardList, Sparkles, ShieldCheck, Truck, Wrench, Store } from 'lucide-react';

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


export default function SellForm() {
  return (
    <>
       <section className="relative h-80 w-full hidden md:flex items-center justify-center text-white">
        <Image
          src="https://t4.ftcdn.net/jpg/08/29/92/35/360_F_829923583_Q9qvQUSqXo0URtHNzwwFqU0H0ByKXz1Y.jpg"
          alt="A rack of second-hand clothes"
          data-ai-hint="clothing rack"
          fill
          className="object-cover brightness-75"
        />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight font-headline">
            How Selling Works
          </h1>
        </div>
      </section>

      <section id="how-it-works" className="bg-card py-16">
        <div className="container max-w-7xl mx-auto px-4">
           <div className="md:hidden mb-12 text-center">
            <h1 className="text-4xl font-black tracking-tight text-primary">
              How Selling Works
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Turn your closet into cash in a few simple steps. It's fast, easy, and smart.
            </p>
          </div>
           <div className="text-center mb-12 hidden md:block">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
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

      <section id="sell-form" className="py-16 sm:py-24 bg-card">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black font-headline tracking-tight text-primary">
              Sell Your Item
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Fill out the form below to list your pre-loved item.
            </p>
          </div>

          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>
                Provide as much detail as possible for a better price suggestion.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="article">Article Type *</Label>
                    <Input type="text" id="article" placeholder="e.g., T-Shirt, Handbag" autoComplete="off" required />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input type="text" id="brand" placeholder="e.g., Zara, Nike" autoComplete="off" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="unisex">Unisex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="size">Size</Label>
                    <Input type="text" id="size" placeholder="e.g., M, 32, UK 8" autoComplete="off" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="age">Age of Item</Label>
                     <Select>
                      <SelectTrigger id="age">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<1">Less than a year</SelectItem>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="2-3">2-3 years</SelectItem>
                        <SelectItem value=">3">More than 3 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="wear_count">Times Worn (approx.)</Label>
                    <Input type="number" id="wear_count" placeholder="e.g., 5" />
                  </div>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="photos">Upload Photos *</Label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (MAX. 5MB)</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" multiple />
                    </label>
                  </div> 
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="damage">Damage Description</Label>
                  <Textarea placeholder="Describe any stains, tears, or other imperfections." id="damage" />
                </div>
                <div>
                  <Button
                    type="submit"
                    className="font-bold px-8 w-full md:w-auto"
                  >
                    Get AI Price Suggestion
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
