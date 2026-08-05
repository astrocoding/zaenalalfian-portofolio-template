"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Container } from "./Container";
import { GenkoYoshiPattern } from "./GenkoYoshiPattern";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  bgVariant?: "paper" | "surface" | "accent";
  kanjiSubtitle?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  headerAction?: React.ReactNode;
  headerAlign?: "left" | "center";
  containerSize?: "narrow" | "default" | "wide";
  /** @deprecated animate prop is ignored — sections now use CSS-native fade-in */
  animate?: boolean;
  children?: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  bgVariant = "paper",
  kanjiSubtitle,
  sectionTitle,
  sectionDescription,
  headerAction,
  headerAlign = "left",
  containerSize = "default",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  animate: _animate,
  className,
  children,
  ...props
}) => {
  const bgStyles = {
    paper: "bg-paper",
    surface: "bg-surface border-y border-border-subtle",
    accent: "bg-[#f6e0ce]/30 border-y border-border-warm",
  };

  const isCenter = headerAlign === "center";

  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-24 relative overflow-hidden scroll-mt-[65px] section-fade-in",
        bgStyles[bgVariant],
        className,
      )}
      {...props}
    >
      <Container size={containerSize}>
        {(sectionTitle || kanjiSubtitle) && (
          <div
            className={cn(
              "mb-8 sm:mb-12 relative flex w-full",
              isCenter
                ? "flex-col items-center text-center space-y-2"
                : "flex-col sm:flex-row sm:items-end justify-between gap-4",
            )}
          >
            <div
              className={cn(
                "flex flex-col space-y-2",
                isCenter
                  ? "items-center text-center w-full"
                  : "items-start text-left",
              )}
            >
              {kanjiSubtitle && (
                <span className="font-serif text-primary tracking-widest text-xs font-semibold uppercase block">
                  {kanjiSubtitle}
                </span>
              )}
              {sectionTitle && (
                <div className="relative py-2 px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-2xl overflow-hidden inline-block">
                  <GenkoYoshiPattern />
                  <h2 className="relative z-10 text-3xl sm:text-4xl font-bold font-serif text-ink tracking-tight">
                    {sectionTitle}
                  </h2>
                </div>
              )}
              {sectionDescription && (
                <p
                  className={cn(
                    "text-base text-ink-muted max-w-2xl leading-relaxed pt-1",
                    isCenter && "mx-auto",
                  )}
                >
                  {sectionDescription}
                </p>
              )}
            </div>
            {headerAction && (
              <div className="shrink-0 pb-1 relative z-10">{headerAction}</div>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
};
