import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline" | "ghost" | "tech";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-medium font-mono transition-colors focus:outline-none";

  const variantStyles = {
    default: "bg-[#f6e0ce] text-[#853234] border border-[#ebd9c8]",
    accent: "bg-[#dac0ca]/40 text-[#4a2e38] border border-[#dac0ca]",
    outline: "bg-transparent text-ink-muted border border-border-warm",
    ghost: "bg-black/5 text-ink-muted",
    tech: "bg-surface text-primary border border-border-warm font-mono text-xs shadow-2xs",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 rounded",
    md: "text-xs px-2.5 py-1 rounded-md",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};
