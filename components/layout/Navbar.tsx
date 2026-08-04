"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Container } from "../ui/Container";

import contentData from "@/data/content.json";

export interface NavItem {
  label: string;
  href: string;
  id: string;
  kanji: string;
}

const getNavItems = (isHomePage: boolean): NavItem[] =>
  contentData.nav.items.map((item) => {
    let href = item.href;
    if (isHomePage) {
      if (item.id === "about") href = "/#about";
      if (item.id === "experience") href = "/#experience";
      if (item.id === "projects") href = "/#projects";
      if (item.id === "blogs") href = "/#blogs";
      if (item.id === "contact") href = "/#contact";
    } else {
      if (item.id === "contact") href = "/contact";
    }
    return { ...item, href };
  });

const observedSectionIds = [
  "about",
  "skills",
  "experience",
  "projects",
  "blogs",
  "contact",
];
const sectionToNavMap: Record<string, string> = {
  about: "about",
  skills: "about",
  experience: "experience",
  projects: "projects",
  blogs: "blogs",
  contact: "contact",
};

const getSectionForPath = (path: string) => {
  if (path.startsWith("/about")) return "about";
  if (path.startsWith("/projects")) return "projects";
  if (path.startsWith("/blogs")) return "blogs";
  if (path.startsWith("/experiences") || path.startsWith("/experience"))
    return "experience";
  if (path.startsWith("/docs")) return "docs";
  if (path.startsWith("/contact")) return "contact";
  if (path === "/") return "home";
  return "";
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const emptySubscribe = () => () => { };
const useIsMounted = () =>
  React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

export const Navbar: React.FC = () => {
  const mounted = useIsMounted();
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session, status: sessionStatus } = useSession();
  const isAdmin = Boolean(session?.user && session.user.role === "ADMIN");
  const sessionLoading = sessionStatus === "loading";

  const isHomePage = pathname === "/";
  const navItems = getNavItems(isHomePage);

  // Initial state matches SSR output deterministically to avoid hydration mismatches
  const [scrolled, setScrolled] = React.useState<boolean>(false);

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  const [activeSection, setActiveSection] = React.useState<string>(() =>
    getSectionForPath(pathname),
  );

  // Sync state on route change without cascading effect renders
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setActiveSection(getSectionForPath(pathname));
    setScrolled(false);
  }

  const isProgrammaticScrollRef = React.useRef(false);
  const scrollEndTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const unlockScrollSpy = React.useCallback(() => {
    isProgrammaticScrollRef.current = false;
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = null;
    }
  }, []);

  // Check for pending scrollToSection when landing on home page (e.g. from Contact click outside landing page)
  React.useEffect(() => {
    if (isHomePage) {
      try {
        const pendingSection = sessionStorage.getItem("scrollToSection");
        if (pendingSection) {
          sessionStorage.removeItem("scrollToSection");
          setTimeout(() => {
            const el = document.getElementById(pendingSection);
            if (el) {
              isProgrammaticScrollRef.current = true;
              setActiveSection(pendingSection);
              const headerOffset = 65;
              const elementPosition = el.getBoundingClientRect().top;
              const offsetPosition =
                elementPosition + window.scrollY - headerOffset;
              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });
              if (scrollEndTimerRef.current)
                clearTimeout(scrollEndTimerRef.current);
              scrollEndTimerRef.current = setTimeout(unlockScrollSpy, 1000);
            }
          }, 150);
        }
      } catch { }
    }
  }, [isHomePage, unlockScrollSpy]);

  // Optimized rAF-throttled scroll state & scroll spy listener (0ms forced reflow)
  useIsomorphicLayoutEffect(() => {
    // Evaluate initial client scroll position & active section synchronously on mount before paint
    if (typeof window !== "undefined") {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      if (isHomePage && !isProgrammaticScrollRef.current) {
        if (scrollY < 180) {
          setActiveSection((prev) => (prev !== "home" ? "home" : prev));
        } else if (window.location.hash) {
          const hashId = window.location.hash.replace("#", "");
          if (sectionToNavMap[hashId]) {
            setActiveSection(sectionToNavMap[hashId]);
          }
        } else {
          const anchorY = 70;
          for (const id of observedSectionIds) {
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= anchorY && rect.bottom > anchorY) {
                const matched = sectionToNavMap[id] || id;
                setActiveSection((prev) => (prev !== matched ? matched : prev));
                break;
              }
            }
          }
        }
      }
    }

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setScrolled(scrollY > 20);

          if (isHomePage && !isProgrammaticScrollRef.current) {
            if (scrollY < 180) {
              setActiveSection((prev) => (prev !== "home" ? "home" : prev));
            } else {
              let matched: string | null = null;
              const anchorY = 70; // Precise 70px viewport anchor line (5px below 65px header)

              for (const id of observedSectionIds) {
                const el = document.getElementById(id);
                if (el) {
                  const rect = el.getBoundingClientRect();
                  if (rect.top <= anchorY && rect.bottom > anchorY) {
                    matched = sectionToNavMap[id] || id;
                    break;
                  }
                }
              }

              if (matched) {
                setActiveSection((prev) => (prev !== matched ? matched : prev));
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleScrollEnd = () => {
      if (isProgrammaticScrollRef.current) {
        unlockScrollSpy();
        onScroll();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", handleScrollEnd, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [isHomePage, unlockScrollSpy]);

  // Event-driven smooth scroll handler ONLY on explicit user link clicks (Mobile & Desktop)
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem,
  ) => {
    const wasOpen = isOpen;
    setIsOpen(false);

    if (isHomePage) {
      e.preventDefault();
      isProgrammaticScrollRef.current = true;
      setActiveSection(item.id);

      const doScroll = () => {
        if (item.id === "home") {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } else {
          const targetEl = document.getElementById(item.id);
          if (targetEl) {
            try {
              targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            } catch {
              const headerOffset = 65;
              const elementPosition =
                targetEl.getBoundingClientRect().top + window.scrollY;
              const offsetPosition = Math.max(0, elementPosition - headerOffset);
              window.scrollTo({
                top: offsetPosition,
                left: 0,
                behavior: "smooth",
              });
            }
          } else {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }
        }

        if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
        scrollEndTimerRef.current = setTimeout(unlockScrollSpy, 1200);
      };

      if (wasOpen) {
        // Wait 310ms for mobile drawer animation & DOM unmount to finish so smooth scroll is not cancelled mid-flight
        setTimeout(doScroll, 310);
      } else {
        doScroll();
      }
    }
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      handleNavClick(e, {
        label: "Contact",
        href: "/#contact",
        id: "contact",
        kanji: "お問い合わせ",
      });
    } else {
      setIsOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/95 backdrop-blur-md border-b border-border-subtle shadow-xs py-3.5"
        : "bg-transparent py-5"
        } ${mounted
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
    >
      <Container size="wide">
        <nav
          className="flex items-center justify-between"
          aria-label="Main Navigation"
        >
          {/* Logo Branding */}
          <Link
            href="/"
            onClick={(e) =>
              handleNavClick(e, {
                label: "Home",
                href: "/",
                id: "home",
                kanji: "ホーム",
              })
            }
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
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all relative group flex items-center space-x-1.5 ${isActive
                    ? "text-primary font-semibold"
                    : "text-ink-muted hover:text-ink hover:bg-black/5"
                    }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-primary font-serif font-normal">
                    {item.kanji}
                  </span>
                  {mounted && isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}

            <div className="h-4 w-px bg-border-warm mx-2" />

            {/* Desktop CTA: skeleton during session load, then Dashboard or Get in Touch */}
            {sessionLoading ? (
              <div
                className="h-8 w-24 rounded-md bg-border-warm/60 animate-pulse"
                aria-hidden="true"
              />
            ) : isAdmin ? (
              <Link
                href="/admin"
                className="inline-flex items-center justify-center text-xs font-mono font-medium px-3.5 py-2 rounded-md bg-primary text-white hover:bg-[#993b3d] transition-colors shadow-2xs space-x-1"
              >
                <span>{contentData.nav.cta.dashboard}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href={isHomePage ? "/#contact" : "/contact"}
                onClick={handleContactClick}
                className="inline-flex items-center justify-center text-xs font-mono font-medium px-3.5 py-2 rounded-md bg-primary text-white hover:bg-[#993b3d] transition-colors shadow-2xs space-x-1"
              >
                <span>{contentData.nav.cta.getInTouch}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Mobile & Tablet Navigation Toggle Button (Visible up to LG screens <1024px) */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-ink hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={
              isOpen ? "Close Navigation Menu" : "Open Navigation Menu"
            }
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
            key="mobile-nav-drawer"
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
                      key={item.id}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item)}
                      className={`flex items-center justify-between py-3 px-3.5 rounded-md font-medium transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-ink hover:bg-[#f6e0ce]/40"
                        }`}
                    >
                      <span className="text-base">{item.label}</span>
                      <span className="text-xs font-serif text-primary font-semibold">
                        {item.kanji}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border-subtle flex flex-col space-y-3">
                {/* Mobile CTA: skeleton during session load, then Dashboard or Get in Touch */}
                {sessionLoading ? (
                  <div
                    className="h-11 w-full rounded-md bg-border-warm/60 animate-pulse"
                    aria-hidden="true"
                  />
                ) : isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 px-4 bg-primary text-white text-center font-medium rounded-md text-sm shadow-xs flex items-center justify-center space-x-2"
                  >
                    <span>{contentData.nav.cta.dashboard}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href={isHomePage ? "/#contact" : "/contact"}
                    onClick={handleContactClick}
                    className="w-full py-3 px-4 bg-primary text-white text-center font-medium rounded-md text-sm shadow-xs flex items-center justify-center space-x-2"
                  >
                    <span>{contentData.nav.cta.getInTouch}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
