"use client";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { StoreBook } from "@/lib/book-shape";
import { BookCard } from "@/components/books/book-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type InfiniteSliderProps = {
  books: StoreBook[];
};
const AUTOPLAY_MS = 2000;
export function InfiniteSlider({ books }: InfiniteSliderProps) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(books.length / 2));
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPause] = useState(false);
  useEffect(() => {
    if (isPaused || books.length < 2) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % books.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, activeIndex, books.length]);

  const onMouseLeave = (e: React.MouseEvent) => {
    if (dragStartX.current !== null) {
      handleDragEnd(e.clientX);
    }
    setIsPause(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPause(true);
    handleDragStart(e.touches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    handleDragEnd(e.changedTouches[0].clientX);
    setIsPause(false);  
  };
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % books.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const handleDragStart = (clientX: number) => {
    dragStartX.current = clientX;
    isDragging.current = false;
  };

  const handleDragEnd = (clientX: number) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - clientX;

    if (Math.abs(diff) > 10) {
      isDragging.current = true;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    dragStartX.current = null;

    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const onMouseUp = (e: React.MouseEvent) => handleDragEnd(e.clientX);


  useGSAP(() => {
    if (!containerRef.current) return;
    const cards = gsap.utils.toArray<HTMLElement>(".carousel-card");
    const total = books.length;

    cards.forEach((card, i) => {
      let offset = i - activeIndex;
      if (offset > Math.floor(total / 2)) offset -= total;
      if (offset < -Math.floor(total / 2)) offset += total;

      const absOffset = Math.abs(offset);
      const isActive = offset === 0;

      const xOffset = offset * 80;

      gsap.to(card, {
        xPercent: xOffset,
        scale: isActive ? 1 : Math.max(0.5, 1 - absOffset * 0.2),
        opacity: isActive ? 1 : Math.max(0, 1 - absOffset * 0.4),
        zIndex: 100 - absOffset,
        duration: 0.6,
        ease: "power3.out",
        rotationY: offset * -15,
      });
    });
  }, [activeIndex, books.length]);

  if (!books || books.length === 0) return null;
  
  return (
    <div
      className="relative isolate w-full h-160.5 sm:h-187.5 flex items-center justify-center overflow-hidden perspective-1000 touch-pan-y select-none cursor-grab active:cursor-grabbing"
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {books.map((book, i) => {
        let offset = i - activeIndex;
        if (offset > Math.floor(books.length / 2)) offset -= books.length;
        if (offset < -Math.floor(books.length / 2)) offset += books.length;
        const isActive = offset === 0;
        const isPausable=Math.abs(offset)<=1
        let glowClass = "border-transparent";
        if (isActive)
          glowClass =
            "border-brand-gold shadow-[0_0_40px_rgba(229,161,22,0.4)]";
        else if (offset === -1)
          glowClass =
            "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]";
        else if (offset === 1)
          glowClass =
            "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]";
        else glowClass = "border-border/30 opacity-50";

        return (
          <div
            key={book.id}
            className="carousel-card absolute w-60 sm:w-70 md:w-[320px] cursor-pointer will-change-transform"
            onMouseEnter={()=>{
              if (isPausable) setIsPause(true)
            }}
            onMouseLeave={()=>{
              if (isPausable) setIsPause(false)
            }}
            onClick={(e) => {
              if (isDragging.current) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              setActiveIndex(i);
            }}
          >
            <div
              className={cn(
                "transition-all duration-500 rounded-2xl border-2 bg-card overflow-auto",
                glowClass,
              )}
            >
              <BookCard book={book} />
            </div>

            {!isActive && (
              <div className="absolute inset-0 bg-background/20 rounded-2xl pointer-events-none transition-opacity duration-500" />
            )}
          </div>
        );
      })}

      <div className="hidden sm:flex absolute bottom-0 left-1/2 -translate-x-1/2 items-center gap-6 pb-2">
        <button
          onClick={handlePrev}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/80 backdrop-blur-md border border-border/60 shadow-lg hover:border-brand-gold/50 hover:text-brand-gold transition-all text-foreground font-medium"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Prev
        </button>
        <button
          onClick={handleNext}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/80 backdrop-blur-md border border-border/60 shadow-lg hover:border-brand-gold/50 hover:text-brand-gold transition-all text-foreground font-medium"
        >
          Next
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
