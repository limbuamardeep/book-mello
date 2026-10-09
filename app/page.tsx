import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Truck,
  MessageCircle,
  Quote,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBooks } from "@/lib/books";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { InfiniteSlider } from "@/components/infiniteSlider/infinite-slider";
import BookCarousel from "@/components/featureCarousel/book-carousel";

export default async function Home() {
  const books = await getBooks();
  const featuredBooks =
    books.filter((b) => b.isFeatured).length >= 4
      ? books.filter((b) => b.isFeatured).slice(0, 8)
      : books.slice(0, 8);
  const newArrivals =
    books.filter((b) => b.isNew).length >= 4
      ? books.filter((b) => b.isNew).slice(0, 8)
      : books.slice(4, 12);

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        <HeroSection />

        <section className="w-full py-14 sm:py-20">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-blue-400 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
                  Curated Collection
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif tracking-tight">
                  Staff Picks
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base mt-1">
                  Hand-selected favorites loved by readers across Nepal.
                </p>
              </div>
              <Link
                href="/all"
                className="inline-flex items-center text-sm font-semibold text-brand-blue dark:text-blue-400 hover:underline shrink-0 group"
              >
                View All Books{" "}
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="w-full relative mt-8">
              <BookCarousel
                books={featuredBooks}
                visibleCount={4}
                autoplay_MS={2000}
              />
            </div>
          </div>
        </section>
        <section className="w-full py-10 sm:py-10">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-brand-gold">
                  Fresh Releases
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif tracking-tight mt-1">
                  New Arrivals
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base mt-1">
                  Fresh off the press and ready to be delivered to your hands.
                </p>
              </div>
              <Link
                href="/all?filter=new"
                className="inline-flex items-center text-sm font-semibold text-brand-blue dark:text-blue-400 hover:underline shrink-0 group"
              >
                Browse New Arrivals{" "}
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="w-full relative">
              <InfiniteSlider books={newArrivals} />
            </div>
          </div>
        </section>

        <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto rounded-3xl bg-linear-to-br from-brand-blue via-[#164E87] to-[#0E355E] text-white p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-2xl">
            {/* Background Aesthetic Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider">
                  <Truck className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Doorstep Delivery Across All Nepal</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif tracking-tight text-white leading-tight">
                  Can&apos;t Find Your Book? We Deliver on Request.
                </h2>
                <p className="text-white/85 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
                  Send us the title or author on WhatsApp. We source
                  hard-to-find books, bestsellers, and academic texts with
                  doorstep Cash on Delivery in Kathmandu and throughout Nepal.
                </p>
                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <Button
                    size="lg"
                    className="rounded-full bg-brand-gold hover:bg-[#D08F0E] text-slate-950 font-bold px-7 h-12 shadow-lg hover:shadow-xl transition-all"
                    asChild
                  >
                    <a
                      href="https://wa.me/9779717028478?text=Hello%20BookMello,%20I'd%20like%20to%20request%20a%20book!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp: +977 9717028478</span>
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="rounded-full border-2 border-white/60 text-white bg-white/10 hover:bg-white hover:text-brand-blue px-7 h-12 font-bold transition-all shadow-xs"
                    asChild
                  >
                    <Link
                      href="/all"
                      className="flex items-center justify-center"
                    >
                      Explore Full Shop
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Showcase Cover Elements */}
              <div className="lg:col-span-4 flex items-center justify-center relative">
                <div className="relative w-64 sm:w-72 h-80 flex items-center justify-center">
                  <div className="absolute w-44 h-64 bg-white p-2 pb-6 rounded-sm shadow-2xl transform -rotate-8 ring-1 ring-black/10">
                    <div className="relative w-full h-full overflow-hidden rounded-xs bg-muted">
                      <Image
                        src={books[0]?.cover ?? "/hero-picnic.jpg"}
                        alt="Featured title"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute w-44 h-64 bg-white p-2 pb-6 rounded-sm shadow-2xl transform rotate-6 ring-1 ring-black/10 translate-x-10 translate-y-3 z-10">
                    <div className="relative w-full h-full overflow-hidden rounded-xs bg-muted">
                      <Image
                        src={books[1]?.cover ?? "/hero-reader.jpg"}
                        alt="Featured title"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          aria-labelledby="reader-testimonials-title"
          className="w-full py-14 sm:py-20 bg-muted/40 border-y border-border/40"
        >
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <span className="text-xs uppercase font-bold tracking-wider text-brand-blue dark:text-blue-400">
                From Our Readers
              </span>
              <h2
                id="reader-testimonials-title"
                className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif tracking-tight mt-1 mb-2"
              >
                Stories That Stay With Us
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                A little love from readers who found their next favorite book
                with BookMello.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {[
                {
                  initials: "AS",
                  name: "Aarati S.",
                  location: "Kathmandu",
                  quote:
                    "I found a book I had been searching for everywhere. Ordering was easy, and it arrived right at my doorstep.",
                },
                {
                  initials: "BK",
                  name: "Bibek K.",
                  location: "Pokhara",
                  quote:
                    "The selection made it easy to discover something new. My book arrived in great condition, and I’m already picking my next read.",
                },
                {
                  initials: "MP",
                  name: "Mina P.",
                  location: "Lalitpur",
                  quote:
                    "I love having a local bookstore that makes finding and ordering books feel so simple. BookMello has become my happy place.",
                },
              ].map((testimonial) => (
                <figure
                  key={testimonial.initials}
                  className="relative flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 sm:p-7 shadow-sm"
                >
                  <Quote
                    aria-hidden="true"
                    className="absolute right-6 top-6 h-8 w-8 text-brand-blue/10"
                  />
                  <div
                    aria-label="5 out of 5 stars"
                    className="mb-4 flex gap-1 text-brand-gold"
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        aria-hidden="true"
                        className="h-4 w-4 fill-current"
                      />
                    ))}
                  </div>
                  <blockquote className="flex-1 text-sm sm:text-base leading-relaxed text-foreground/85">
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-sm font-bold text-brand-blue dark:bg-brand-blue/20 dark:text-blue-400">
                      {testimonial.initials}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {testimonial.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Reader in {testimonial.location}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
