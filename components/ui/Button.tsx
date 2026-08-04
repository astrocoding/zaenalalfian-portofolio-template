"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      children,
      icon,
      iconPosition = "right",
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md cursor-pointer active:scale-[0.98] hover:scale-[1.02] [&_svg]:text-current [&_svg]:transition-colors [&_span]:text-inherit";

    const variantStyles = {
      primary:
        "bg-primary text-white hover:bg-[#993b3d] active:bg-[#853234] shadow-sm hover:shadow-md border border-transparent",
      secondary:
        "bg-[#f6e0ce] text-ink hover:bg-[#ebd0b9] border border-[#ebd9c8] active:bg-[#e0c0a7]",
      outline:
        "border border-border-warm bg-transparent text-ink hover:bg-white/60 hover:border-primary active:bg-white",
      ghost:
        "bg-transparent text-ink hover:bg-black/5 hover:text-primary active:bg-black/10",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 min-h-[32px]",
      md: "text-sm px-4 py-2.5 gap-2 min-h-[40px]",
      lg: "text-base px-6 py-3 gap-2.5 min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className="inline-flex shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {icon && iconPosition === "right" && (
          <span className="inline-flex shrink-0">{icon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
