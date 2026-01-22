"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Container } from "./Container";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SectionWrapperProps extends Omit<HTMLMotionProps<"section">, "children"> {
  id?: string;
  bgVariant?: "paper" | "surface" | "accent";
  kanjiSubtitle?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  containerSize?: "narrow" | "default" | "wide";
  animate?: boolean;
  children?: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  bgVariant = "paper",
  kanjiSubtitle,
  sectionTitle,
  sectionDescription,
  containerSize = "default",
  animate = true,
  className,
  children,
  ...props
}) => {
  const bgStyles = {
    paper: "bg-paper",
    surface: "bg-surface border-y border-border-subtle",
    accent: "bg-[#f6e0ce]/30 border-y border-border-warm",
  };

  const innerContent = (
    <Container size={containerSize}>
      {(sectionTitle || kanjiSubtitle) && (
        <div className="mb-12 relative flex flex-col items-start space-y-2">
          {kanjiSubtitle && (
            <span className="font-serif text-primary/40 tracking-widest text-xs font-semibold uppercase block">
              {kanjiSubtitle}
            </span>
          )}
          {sectionTitle && (
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-ink tracking-tight">
              {sectionTitle}
            </h2>
          )}
          {sectionDescription && (
            <p className="text-base text-ink-muted max-w-2xl leading-relaxed">
              {sectionDescription}
            </p>
          )}
          <div className="w-12 h-0.5 bg-primary/40 mt-3 rounded-full" />
        </div>
      )}
      {children}
    </Container>
  );

  const sectionClassName = cn(
    "py-16 sm:py-24 relative overflow-hidden scroll-mt-[65px]",
    bgStyles[bgVariant],
    className
  );

  if (!animate) {
    return (
      <section id={id} className={sectionClassName}>
        {innerContent}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={sectionClassName}
      {...props}
    >
      {innerContent}
    </motion.section>
  );
};
