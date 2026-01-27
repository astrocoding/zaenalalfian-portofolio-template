"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Container } from "../ui/Container";

const navItems = [
  { label: "Home", href: "/", id: "home", kanji: "ホーム" },
  { label: "Projects", href: "/#projects", id: "projects", kanji: "実績" },
  { label: "Blog", href: "/#blogs", id: "blogs", kanji: "記事" },
  { label: "Docs", href: "/#docs", id: "docs", kanji: "文書" },
  { label: "About", href: "/#about", id: "about", kanji: "概要" },
  { label: "Contact", href: "/#contact", id: "contact", kanji: "連絡" },
];

const sectionIds = ["about", "projects", "blogs", "docs", "contact"];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string>("home");
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll Spy for dynamic section highlighting on landing page
  React.useEffect(() => {
    if (pathname !== "/") {
      // Set active based on subpage path
      if (pathname.startsWith("/about")) setActiveSection("about");
      else if (pathname.startsWith("/projects")) setActiveSection("projects");
      else if (pathname.startsWith("/blogs")) setActiveSection("blogs");
      else if (pathname.startsWith("/docs")) setActiveSection("docs");
      else setActiveSection("");
      return;
    }

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

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();

    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [pathname]);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/90 backdrop-blur-md border-b border-border-subtle shadow-xs py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <Container size="wide">
        <nav className="flex items-center justify-between" aria-label="Main Navigation">
          {/* Logo Branding */}
          <Link
            href="/"
            className="group flex items-center space-x-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1"
          >
            <div className="w-9 h-9 rounded-md bg-primary text-white flex items-center justify-center font-serif font-bold text-lg shadow-xs group-hover:bg-[#993b3d] transition-colors">
              才
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-ink text-base tracking-tight leading-none group-hover:text-primary transition-colors">
                Zaenal Alfian
              </span>
              <span className="text-[10px] font-mono tracking-widest text-ink-muted uppercase mt-0.5">
                フルスタックエンジニア
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <Link
                  key={item.href}
                  href={item.href}
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
              className="inline-flex items-center justify-center text-xs font-mono font-medium px-3.5 py-2 rounded-md bg-primary text-white hover:bg-[#993b3d] transition-colors shadow-2xs space-x-1"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Navigation Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-ink hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={isOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </Container>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-surface/98 backdrop-blur-xl border-b border-border-warm overflow-hidden shadow-lg"
          >
            <Container className="py-6 space-y-4">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between py-2.5 px-3 rounded-md font-medium transition-colors ${
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
                  onClick={() => setIsOpen(false)}
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
