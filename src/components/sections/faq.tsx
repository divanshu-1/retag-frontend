
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How do you ensure the quality of items?',
    answer:
      'Every item goes through a rigorous quality check. We inspect for any damage, wear, and authenticity. We also professionally clean and sanitize each piece before it\'s listed, so it arrives fresh and ready to wear.',
  },
  {
    question: 'How does the AI pricing work?',
    answer:
      'Our custom AI analyzes each item based on brand, type, condition, age, and current market trends. It suggests a fair, competitive price, which is then reviewed by our team to ensure you get the best value, whether you\'re buying or selling.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We want you to love your finds! If you\'re not completely satisfied, you can return your purchase within 7 days of delivery for a full refund. Please note that all items must be returned in the same condition they were received.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'We process orders within 1-2 business days. Standard shipping typically takes 3-5 business days depending on your location. All deliveries are currently simulated for this demo application.',
  },
  {
    question: 'How do I sell my clothes on ReTag?',
    answer:
      'Just head to our "Sell" page! Fill out the form with details about your item and upload some photos. Our AI will give you a price suggestion, our team will approve it, and we\'ll arrange a free pickup and pay you instantly. It\'s that simple!',
  },
];

export default function Faq() {
  return (
    <section id="faq" className="py-12 sm:py-16 bg-background">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black font-headline tracking-tight text-primary">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions? We have answers.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-semibold text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
