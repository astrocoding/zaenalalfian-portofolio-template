"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

/**
 * ScrollToTop — CSS-native fade (no framer-motion).
 *
 * The button is always rendered in the DOM to avoid layout shift.
 * Visibility is toggled via .scroll-top-visible class defined in animation.css,
 * which transitions opacity + visibility smoothly (no JS animation loop).
 */
export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;

    const toggleVisibility = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`scroll-to-top fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-10 h-10 rounded-md bg-primary text-white flex items-center justify-center shadow-md hover:bg-[#993b3d] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:scale-[1.05] active:scale-95 transition-[opacity,visibility,transform,box-shadow] duration-200 cursor-pointer group${isVisible ? " scroll-top-visible" : ""}`}
      aria-label="Scroll back to top"
      aria-hidden={!isVisible}
      title="Back to Top / ページ上部へ戻る"
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
    </button>
  );
};
