import * as React from "react";
import { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  subtitleKanji?: string;
  description: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  subtitleKanji,
  description,
  className = "",
}) => {
  return (
    <div
      className={`w-full py-16 px-6 rounded-2xl bg-surface border border-border-warm flex flex-col items-center justify-center text-center space-y-4 shadow-xs my-4 ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xs mb-1">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <div className="space-y-1.5 max-w-md">
        {subtitleKanji && (
          <span className="text-xs font-serif font-semibold text-primary tracking-widest block uppercase">
            {subtitleKanji}
          </span>
        )}
        <h3 className="text-lg font-serif font-bold text-ink leading-tight">
          {title}
        </h3>
        <p className="text-xs text-ink-muted leading-relaxed font-sans pt-1">
          {description}
        </p>
      </div>
    </div>
  );
};
