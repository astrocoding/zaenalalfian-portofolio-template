"use client";

/**
 * Motion.tsx — Native CSS animation wrappers (zero framer-motion dependency).
 *
 * Animation is driven by:
 *  1. data-animate="<direction>" sets the initial hidden state via animation.css
 *  2. IntersectionObserver sets data-animate-done when the element enters the viewport
 *  3. animation.css fires the corresponding @keyframes animation once
 *
 * This is equivalent to framer-motion's `whileInView={{ once: true }}` pattern,
 * but ~26 kB lighter (no framer-motion JS bundle for scroll-triggered animations).
 */

import * as React from "react";

/* ──────────────────────────────────────────────────────────────
   Shared IntersectionObserver hook
   ────────────────────────────────────────────────────────────── */

function useIntersectionAnimation(
  ref: React.RefObject<HTMLElement | null>,
  rootMargin = "-40px",
) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-animate-done", "");
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
}

/* ──────────────────────────────────────────────────────────────
   FadeIn
   Replaces: <motion.div initial={{ opacity: 0, y/x: ±20 }} whileInView … />
   ────────────────────────────────────────────────────────────── */

export interface FadeInProps {
  children?: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  direction = "up",
  className,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  useIntersectionAnimation(ref as React.RefObject<HTMLElement | null>);

  return (
    <div
      ref={ref}
      data-animate={direction}
      data-delay={delay > 0 ? String(delay) : undefined}
      style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
   StaggerContainer
   Replaces: <motion.div variants={staggerChildren} whileInView … />
   Children receive incremental animation-delay via CSS custom property.
   ────────────────────────────────────────────────────────────── */

export interface StaggerContainerProps {
  children?: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 100,
  className,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  // Assign --stagger-delay to each direct child once on mount
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>("[data-animate='stagger']");
    items.forEach((item, i) => {
      item.style.setProperty("--stagger-delay", `${i * staggerDelay}ms`);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          items.forEach((item) => item.setAttribute("data-animate-done", ""));
          observer.disconnect();
        }
      },
      { rootMargin: "-40px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [staggerDelay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
   StaggerItem
   Replaces: <motion.div variants={{ hidden, show }} />
   Must be a direct child of <StaggerContainer>.
   ────────────────────────────────────────────────────────────── */

export interface StaggerItemProps {
  children?: React.ReactNode;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className,
}) => {
  return (
    <div data-animate="stagger" className={className}>
      {children}
    </div>
  );
};
