import * as React from "react";
import Link from "next/link";
import { Button } from "./Button";
import { ArrowRight } from "lucide-react";

export interface ActionFooterProps {
  title: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  primaryButtonIcon?: React.ReactNode;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  secondaryButtonIcon?: React.ReactNode;
  className?: string;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({
  title,
  description,
  primaryButtonText = "Get in Touch",
  primaryButtonHref = "/contact",
  primaryButtonIcon = <ArrowRight className="w-4 h-4" />,
  secondaryButtonText,
  secondaryButtonHref,
  secondaryButtonIcon,
  className = "",
}) => {
  return (
    <section
      aria-label="Call to Action"
      className={`p-6 sm:p-8 rounded-2xl bg-surface border border-border-warm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-card ${className}`}
    >
      <div className="space-y-1 max-w-xl">
        <h2 className="text-xl font-serif font-bold text-ink tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex items-center space-x-3 shrink-0 flex-wrap gap-y-2">
        {secondaryButtonText && secondaryButtonHref && (
          <Link href={secondaryButtonHref}>
            <Button variant="outline" size="md" icon={secondaryButtonIcon}>
              {secondaryButtonText}
            </Button>
          </Link>
        )}

        {primaryButtonText && primaryButtonHref && (
          <Link href={primaryButtonHref}>
            <Button variant="primary" size="md" icon={primaryButtonIcon}>
              {primaryButtonText}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};
