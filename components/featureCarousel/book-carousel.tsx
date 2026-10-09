"use client"
import { StoreBook } from "@/lib/book-shape";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "../ui/button";
import { BookCard } from "../books/book-card";

gsap.registerPlugin(Flip);

interface BookCarouselProps {
  books: StoreBook[];
  visibleCount?: number;
  autoplay_MS: number;
}

type Item = {
  uid: number;
  book: StoreBook;
  leaving?: boolean;
};
export default function BookCarousel({
  books,
  visibleCount = 4,
  autoplay_MS,
}: BookCarouselProps) {
  const count = Math.min(visibleCount, books.length);
  const canAnimate = books.length > count;
  const uidRef = useRef(count);
  const head = useRef(0);
  const animatingRef = useRef(false);
  const hoveredRef = useRef(false);
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const directionRef = useRef<"prev" | "next">("next");
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [items, setItems] = useState<Item[]>(() =>
    books.slice(0, count).map((book, i) => ({ uid: i, book })),
  );
  const move = useCallback(
    (forward: boolean) => {
      if (!canAnimate || animatingRef.current || !containerRef.current) return;
      animatingRef.current = true;
      directionRef.current = forward ? "next" : "prev";
      flipStateRef.current = Flip.getState(
        containerRef.current.querySelectorAll(".caterpillar-card"),
      );
      const n = books.length;
      if (forward) {
        const incoming = books[(head.current + count) % n];
        head.current = (head.current + 1) % n;
        setItems((prev) => [
          ...prev.map((it, i) => (i == 0 ? { ...it, leaving: true } : it)),
          { uid: uidRef.current++, book: incoming },
        ]);
      } else {
        head.current = (head.current - 1 + n) % n;
        const incoming = books[head.current];
        setItems((prev) => [
          { uid: uidRef.current++, book: incoming },
          ...prev.map((it, i) =>
            i === prev.length - 1 ? { ...it, leaving: true } : it,
          ),
        ]);
      }
    },
    [books, canAnimate, count],
  );
  useLayoutEffect(() => {
    const state = flipStateRef.current;
    if (!state) return;
    flipStateRef.current = null;
    const forward = directionRef.current === "next";
    Flip.from(state, {
      targets: ".caterpillar-card",
      fade: true,
      absoluteOnLeave: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            transformOrigin: forward ? "bottom right" : "bottom left",
          },
        ),
      onLeave: (els) => {
        gsap.to(els, {
          opacity: 0,
          scale: 0,
          transformOrigin: forward ? "bottom left" : "bottom right",
          onComplete: () => {
            setItems((prev) => prev.filter((it) => !it.leaving));
            animatingRef.current = false;
          },
        });
      },
    });
  }, [items]);
  useEffect(() => {
    if (!canAnimate) return;
    const id = setInterval(() => {
      if (!hoveredRef.current) move(true);
    }, autoplay_MS);
    return () => clearInterval(id);
  }, [move, canAnimate, autoplay_MS]);

  useEffect(() => {
    const el = containerRef.current;
    return () => {
      if (el) gsap.killTweensOf(el.querySelectorAll(".caterpillar-card"));
    };
  }, []);
  return (
    <div
      className="carousel-wrapper relative"
      onMouseEnter={() => (hoveredRef.current = true)}
      onMouseLeave={() => (hoveredRef.current = false)}
    >
      <div className="flex gap-4 overflow-hidden" ref={containerRef}>
        {items.map((item) => (
          <div
            key={item.uid}
            data-flip-id={item.uid}
            className={`caterpillar-card min-w-0 flex-1 ${item.leaving ? "hidden" : ""}`}
          >
            <BookCard book={item.book} />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-3 mt-8">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 border-border shadow-sm hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors"
          onClick={() => move(false)}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 border-border shadow-sm hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors"
          onClick={() => move(true)}
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
