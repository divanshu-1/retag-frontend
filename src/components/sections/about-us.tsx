import Image from 'next/image';

export default function AboutUs() {
  return (
    <>
      <section className="relative h-80 w-full hidden md:flex items-center justify-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop"
          alt="Two friends holding hands and smiling on a beach"
          data-ai-hint="friends fashion"
          fill
          className="object-cover brightness-75"
        />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight font-headline">
            About Us
          </h1>
        </div>
      </section>
      <section id="about-content" className="bg-card text-card-foreground pt-16 pb-16 md:pt-20 md:pb-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="space-y-8 text-left">
            <div className="md:hidden text-center pt-8">
                 <h1 className="text-4xl font-black tracking-tight text-primary">
                    About Us
                </h1>
            </div>
             <h2 className="hidden md:block text-3xl md:text-4xl font-black tracking-tight text-primary text-center">A Leap of Faith</h2>
            <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              <p className="text-justify">
                Welcome to ReTag - your ultimate destination for premium thrift apparel at unbeatable
                prices. Born out of a passion for style, affordability, and sustainability, we recognized a glaring
                gap in the fashion industry: the disconnect between premium clothing and affordability. And thus,
                ReTag was born.
              </p>
              <p className="text-justify">
                At ReTag, we cater to the needs and desires of the Gen-Z community, understanding the
                importance of both quality and accessibility in fashion. We believe that everyone deserves to
                express themselves through their clothing choices without breaking the bank. That's why we curate
                a diverse selection of high-quality thrifted pieces, ranging from timeless classics to trendy must-haves,
                all at prices that won't leave your wallet feeling empty.
              </p>
              <p className="text-justify">
                Our vision is simple yet powerful: to bridge the chasm between premium fashion and affordability.
                We understand that in today's fast-paced world, consumers seek value without compromising on
                style. With ReTag, you can have the best of both worlds - premium quality clothing at
                prices that won't leave you second-guessing.
              </p>
              <p className="text-justify">
                But our mission extends beyond just offering affordable fashion. We are committed to promoting
                sustainability in the fashion industry by giving pre-loved clothing a new lease on life. By shopping
                with us, you're not only saving money but also contributing to a more sustainable future.
              </p>
              <p className="text-justify">
                What sets us apart is our dedication to providing an unparalleled shopping experience. From
                hand-picked selections to exceptional customer service, we strive to make every interaction with
                ReTag a memorable one. Whether you're a fashion enthusiast looking to refresh your
                wardrobe or a conscientious shopper seeking eco-friendly alternatives, we've got something for
                everyone.
              </p>
              <p className="text-justify">
                Join us on our journey as we redefine the way you shop for fashion. Welcome to ReTag,
                where premium thrift apparel meets affordability – because everyone deserves to look and feel
                their best, without breaking the bank.
              </p>
              <p className="text-justify">
                Shop now and experience the thrill of thrifting with ReTag.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
