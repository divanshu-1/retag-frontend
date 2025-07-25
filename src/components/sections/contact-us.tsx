
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function ContactUs() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.comment) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Message Sent!',
          description: 'Thank you for contacting us. We\'ll get back to you soon.',
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          comment: ''
        });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative h-80 w-full hidden md:flex items-center justify-center text-white">
        <Image
          src="https://t4.ftcdn.net/jpg/08/29/92/35/360_F_829923583_Q9qvQUSqXo0URtHNzwwFqU0H0ByKXz1Y.jpg"
          alt="A rack of second-hand clothes"
          data-ai-hint="contact support"
          fill
          className="object-cover brightness-75"
        />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight font-headline">
            Contact Us
          </h1>
        </div>
      </section>
      
      <section id="contact" className="bg-card text-card-foreground py-16 sm:py-24">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
              <div className="md:hidden">
                <h1 className="text-4xl font-black tracking-tight text-primary">
                  Contact Us
                </h1>
              </div>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Ready to start your thrift adventure? Get in touch with us today!
              </p>
          </div>

          <div className="space-y-6 text-base text-center md:text-lg text-muted-foreground leading-relaxed mb-12">
              <p>
                  <strong>Phone:</strong> +91 8847674125
              </p>
              <p>
                  <strong>Email:</strong> retagcontact00@gmail.com
              </p>
              <div className="pt-2">
                  <p className="font-semibold text-foreground">Join The ReTag Community:</p>
                  <p>
                  Follow us on social media for the latest updates, styling tips, and
                  exclusive offers. Let's connect and celebrate the joy of thrift
                  together!
                  </p>
              </div>
          </div>
          
          <Card className="bg-background">
            <CardHeader>
                <CardTitle className="text-2xl text-primary">Send us a message</CardTitle>
                <CardDescription>We'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit} autoComplete="off">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      autoComplete="off"
                      required
                    />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="off"
                      required
                    />
                    </div>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    type="tel"
                    id="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="comment">Comment *</Label>
                  <Textarea
                    placeholder="Comment"
                    id="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    autoComplete="off"
                    required
                  />
                </div>
                <div>
                    <Button
                    type="submit"
                    variant="default"
                    className="font-bold px-8 w-full md:w-auto"
                    disabled={isSubmitting}
                    >
                    {isSubmitting ? 'Sending...' : 'Send'}
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
