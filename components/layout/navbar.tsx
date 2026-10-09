"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";
const categoryGroups = [
  {
    title: "Fiction",
    genres: [
      "Fantasy",
      "Sci-Fi",
      "Romance",
      "Thriller",
      "Mystery",
      "Historical Fiction",
      "Horror",
    ],
  },
  {
    title: "Non-Fiction",
    genres: [
      "Biography",
      "Self-Help",
      "History",
      "Business",
      "Science",
      "Philosophy",
    ],
  },
  {
    title: "Children",
    genres: ["Picture Books", "Early Readers", "Middle Grade", "Young Adult"],
  },
];

function MobileGenreAccordion({
  onClose,
}: {
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-between text-left over",
          isOpen
            ? "bg-brand-blue/5 text-brand-blue shadow-sm ring-1 ring-brand-blue/20"
            : "hover:bg-muted/60 text-foreground"
        )}
      >
        <span className="flex items-center gap-2">
          Genres
        </span>
        <div className={cn(
          "w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300",
          isOpen ? "bg-brand-blue/10 text-brand-blue rotate-180" : "bg-transparent text-muted-foreground"
        )}>
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-3 mx-2 mb-2 rounded-xl bg-muted/30 border border-border/40 flex flex-col gap-4">
            {categoryGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-1.5">
                <h4 className="text-xs uppercase tracking-wider font-bold text-muted-foreground/80 pl-2">
                  {group.title}
                </h4>
                <div className="flex flex-col gap-1">
                  {group.genres.map((genre) => (
                    <Link
                      key={genre}
                      href={`/all?category=${encodeURIComponent(genre)}`}
                      className={cn(
                        "group py-2 px-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-3",
                        "text-foreground/80 hover:text-brand-blue hover:bg-brand-blue/5"
                      )}
                      onClick={onClose}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/40 group-hover:bg-brand-gold transition-colors" />
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-3 mt-1 border-t border-border/50">
              <Link
                href="/genres"
                className="w-full py-2.5 px-3 flex items-center justify-center gap-2 text-sm font-semibold rounded-lg bg-brand-blue text-white hover:bg-brand-blue/90 transition-all shadow-sm"
                onClick={onClose}
              >
                See All Genres <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isCartOpen, setIsCartOpen, totalCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{
    id: string;
  } | null>(null);
  const [profile, setProfile] = useState<{
    full_name: string | null;
    avatar_url?: string | null;
  } | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [bookOpen, setBookOpen] = useState<boolean>(false);
  const bookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();
        setProfile(data);
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const { data } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", session.user.id)
            .single();
          setProfile(data);
        } else {
          setUser(null);
          setProfile(null);
        }
      });

      return () => subscription.unsubscribe();
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (bookRef.current && !bookRef.current.contains(e.target as Node)) {
        setBookOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBookOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/all?search=${encodeURIComponent(query)}` : "/all");
    setMobileMenuOpen(false);
  };
  const navClass = (href: string) =>
    cn(
      "text-sm font-medium hover:text-accent transition-colors",
      pathname === href && "text-accent",
    );

  return (
    <>
      <div className="bg-brand-blue text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <div className="container mx-auto flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
            Delivered Across Nepal • Cash On Delivery Available
          </span>
          <a
            href="https://wa.me/9779717028478"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 hover:underline text-white/90"
          >
            <span>WhatsApp:</span>{" "}
            <span className="font-semibold">+977 9717028478</span>
          </a>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border/80 shadow-xs py-2.5"
            : "bg-background/80 backdrop-blur-sm border-b border-border/40 py-3.5",
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 group shrink-0"
              aria-label="BookMello home"
            >
              <Image
                src="/bookmello-logo.svg"
                alt="BookMello"
                width={160}
                height={40}
                priority
                className="h-8 sm:h-9 w-auto object-contain dark:brightness-110"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-7">
              <Link href="/" className={navClass("/")}>
                Home
              </Link>
              <div ref={bookRef} className="relative group">
                <button
                  onClick={() => setBookOpen((o) => !o)}
                  aria-expanded={bookOpen}
                  aria-haspopup="true"
                  className={cn(
                    "flex items-center gap-1 py-2",
                    navClass("/all"),
                  )}
                >
                  Books{" "}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      bookOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "absolute top-full -left-40 pt-2 transition-all duration-200 z-50",
                    bookOpen ? "opacity-100 visible" : "opacity-0 invisible",
                  )}
                >
                  <div className="w-145 bg-background border border-border/60 shadow-2xl rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50 relative z-10">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-foreground">Explore Catalog</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Find your next great read</p>
                      </div>
                      <Link
                        href="/all"
                        onClick={() => setBookOpen(false)}
                        className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 px-4 py-2 text-sm font-semibold text-brand-blue transition-all hover:bg-brand-blue hover:text-white"
                      >
                        All Books
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-x-8 gap-y-6 relative z-10">
                      {categoryGroups.map((group) => (
                        <div key={group.title} className="space-y-3">
                          <h4 className="font-serif font-bold text-accent text-sm tracking-wide uppercase">
                            {group.title}
                          </h4>
                          <ul className="space-y-2">
                            {group.genres.map((genre) => (
                              <li key={genre}>
                                <Link
                                  href={`/all?category=${encodeURIComponent(genre)}`}
                                  onClick={() => setBookOpen(false)}
                                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-blue transition-colors"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/30 group-hover:bg-brand-gold transition-colors" />
                                  {genre}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/50 text-center relative z-10">
                      <Link
                        href="/genres"
                        onClick={() => setBookOpen(false)}
                        className="text-sm font-semibold text-brand-blue hover:text-brand-gold transition-colors inline-flex items-center gap-1.5"
                      >
                        Browse all genres <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <form className="relative w-56 lg:w-64" onSubmit={submitSearch}>
                <label htmlFor="desktop-book-search" className="sr-only">
                  Search books and authors
                </label>
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="desktop-book-search"
                  type="search"
                  placeholder="Search books, authors..."
                  className="w-full pl-9 h-9 text-sm bg-muted/40 border-border/60 focus-visible:bg-background rounded-full transition-all"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </form>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                aria-label="Toggle color theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <Link href={user ? "/profile" : "/login"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full overflow-hidden"
                  aria-label="Account"
                >
                  {user ? (
                    <div className="w-full h-full bg-brand-gold text-slate-900 flex items-center justify-center font-serif font-bold text-sm">
                      {profile?.full_name?.charAt(0).toUpperCase() || (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </Button>
              </Link>

              <Button
                variant="outline"
                size="icon"
                aria-label="Open shopping cart"
                className="relative h-9 w-9 rounded-full border-border/60 hover:border-accent hover:text-accent transition-colors"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-4 w-4" />
                <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 flex items-center justify-center p-0 text-[10px] bg-brand-gold text-slate-900 font-bold border-none">
                  {totalCount}
                </Badge>
              </Button>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Open shopping cart"
                className="relative h-9 w-9 rounded-full border-border/60"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-4 w-4" />
                <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 flex items-center justify-center p-0 text-[10px] bg-brand-gold text-slate-900 font-bold border-none">
                  {totalCount}
                </Badge>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-background border-b border-border p-4 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top-2">
            <form className="relative w-full" onSubmit={submitSearch}>
              <label htmlFor="mobile-book-search" className="sr-only">
                Search books and authors
              </label>
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="mobile-book-search"
                type="search"
                placeholder="Search books, authors..."
                className="w-full pl-9 h-10 rounded-full bg-muted/40"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </form>
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                className={cn(
                  "px-4 py-2.5 rounded-lg hover:bg-muted font-medium transition-colors",
                  pathname === "/" && "bg-muted text-accent",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/all"
                className={cn(
                  "px-4 py-2.5 rounded-lg hover:bg-muted font-medium transition-colors",
                  pathname === "/all" && "bg-muted text-accent",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop All
              </Link>
              <MobileGenreAccordion
                onClose={() => setMobileMenuOpen(false)}
              />
              <div className="h-px bg-border my-2"></div>
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-lg hover:bg-muted font-medium flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" /> Account
              </Link>
              <button
                className="px-4 py-3 rounded-md hover:bg-secondary font-medium flex items-center gap-2 text-left"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setMobileMenuOpen(false);
                }}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                Toggle Theme
              </button>
            </nav>
          </div>
        )}
      </header>
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
