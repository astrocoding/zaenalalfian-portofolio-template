"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Container } from "../ui/Container";

const navItems = [
  { label: "Home", href: "/", id: "home", kanji: "ホーム" },
  { label: "About", href: "/#about", id: "about", kanji: "概要" },
  { label: "Experience", href: "/#experience", id: "experience", kanji: "経歴" },
  { label: "Projects", href: "/#projects", id: "projects", kanji: "実績" },
  { label: "Blog", href: "/#blogs", id: "blogs", kanji: "記事" },
  { label: "Contact", href: "/#contact", id: "contact", kanji: "連絡" },
];

const sectionIds = ["about", "experience", "projects", "blogs", "contact"];

const getSectionForPath = (path: string) => {
  if (path.startsWith("/about")) return "about";
  if (path.startsWith("/projects")) return "projects";
  if (path.startsWith("/blogs")) return "blogs";
  if (path.startsWith("/experience")) return "experience";
  if (path.startsWith("/docs")) return "docs";
  if (path === "/") return "home";
  return "";
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  // Initial state matches SSR output deterministically to avoid hydration mismatches
  const [scrolled, setScrolled] = React.useState<boolean>(false);

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  const [activeSection, setActiveSection] = React.useState<string>(() =>
    getSectionForPath(pathname)
  );

  // Sync state on route change without cascading effect renders
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setActiveSection(getSectionForPath(pathname));
    setScrolled(false);
  }

  // Handle Navbar Background Scroll State before browser paint on mount and scroll across all pages
  useIsomorphicLayoutEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Execute immediately on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Event-driven smooth scroll handler ONLY on explicit user link clicks
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === "/") {
      if (href === "/" || href === "/#home" || href === "/#hero") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (href.startsWith("/#")) {
        const sectionId = href.replace("/#", "");
        const targetEl = document.getElementById(sectionId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  // Synchronously compute and update active section based on user's actual scroll position
  useIsomorphicLayoutEffect(() => {
    if (pathname !== "/") return;

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition < 250) {
        setActiveSection("home");
        return;
      }

      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= 180) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    // Execute immediately before paint on mount to prevent indicator jumping from "home"
    handleScrollSpy();

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [pathname]);

  return (
    <header
      suppressHydrationWarning
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-border-subtle shadow-xs py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <Container size="wide">
        <nav className="flex items-center justify-between" aria-label="Main Navigation">
          {/* Logo Branding */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            className="group flex items-center space-x-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1"
          >
            <Image
              src="/zen.svg?v=2"
              alt="Zaenal Alfian Logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
              priority
            />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-primary text-base tracking-tight leading-none uppercase transition-colors">
                ZAENAL ALFIAN
              </span>
              <span className="text-[10px] font-mono tracking-widest text-ink-muted uppercase mt-0.5">
                フルスタックエンジニア
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Visible on LG screens 1024px+) */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all relative group flex items-center space-x-1.5 ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-ink-muted hover:text-ink hover:bg-black/5"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-primary/40 font-serif opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.kanji}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            <div className="h-4 w-px bg-border-warm mx-2" />

            <Link
              href="/#contact"
              onClick={(e) => handleNavClick(e, "/#contact")}
              className="inline-flex items-center justify-center text-xs font-mono font-medium px-3.5 py-2 rounded-md bg-primary text-white hover:bg-[#993b3d] transition-colors shadow-2xs space-x-1"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile & Tablet Navigation Toggle Button (Visible up to LG screens <1024px) */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-ink hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={isOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </Container>

      {/* Mobile & Tablet Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden bg-surface/98 backdrop-blur-xl border-b border-t border-border-warm overflow-hidden shadow-lg mt-2 sm:mt-3"
          >
            <Container className="pt-6 pb-6 space-y-5">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => {
                        setIsOpen(false);
                        handleNavClick(e, item.href);
                      }}
                      className={`flex items-center justify-between py-3 px-3.5 rounded-md font-medium transition-colors ${
                        isActive ? "bg-primary/10 text-primary font-bold" : "text-ink hover:bg-[#f6e0ce]/40"
                      }`}
                    >
                      <span className="text-base">{item.label}</span>
                      <span className="text-xs font-serif text-primary/60">{item.kanji}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border-subtle flex flex-col space-y-3">
                <Link
                  href="/#contact"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleNavClick(e, "/#contact");
                  }}
                  className="w-full py-3 px-4 bg-primary text-white text-center font-medium rounded-md text-sm shadow-xs flex items-center justify-center space-x-2"
                >
                  <span>Get in Touch</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
