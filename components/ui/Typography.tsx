import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "lead" | "caption" | "kanji";
  as?: React.ElementType;
  serif?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  as,
  serif = false,
  className,
  children,
  ...props
}) => {
  const Component =
    as ||
    (variant === "h1"
      ? "h1"
      : variant === "h2"
      ? "h2"
      : variant === "h3"
      ? "h3"
      : variant === "h4"
      ? "h4"
      : variant === "caption" || variant === "kanji"
      ? "span"
      : "p");

  const variantStyles = {
    h1: "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink font-serif leading-[1.15]",
    h2: "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink font-serif leading-[1.25]",
    h3: "text-xl sm:text-2xl font-semibold tracking-tight text-ink leading-snug",
    h4: "text-lg font-medium text-ink",
    body: "text-base leading-relaxed text-ink-muted",
    lead: "text-lg sm:text-xl font-light text-ink-muted leading-relaxed font-serif italic",
    caption: "text-xs font-mono tracking-wider uppercase text-ink-muted",
    kanji: "font-serif text-primary/30 tracking-widest select-none pointer-events-none text-sm uppercase font-semibold",
  };

  return (
    <Component
      className={cn(
        variantStyles[variant],
        serif && "font-serif",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
