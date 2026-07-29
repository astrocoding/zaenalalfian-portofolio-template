"use client";

import * as React from "react";
import { CardCornerSeigaiha } from "./CardCornerSeigaiha";
import { Badge } from "./Badge";
import { Calendar, Briefcase, GraduationCap, Award, BookOpen, Sparkles } from "lucide-react";

export interface TimelineCardItem {
  id?: string;
  title: string;
  organization: string;
  location?: string;
  period: string;
  statusBadge?: string;
  isCurrent?: boolean;
  type?: "experience" | "education";
  gpaOrBadge?: string;
  description: string;
  highlightsTitle?: string;
  highlights?: string[];
  tagsTitle?: string;
  tags?: string[];
}

export interface TimelineCardListProps {
  items: TimelineCardItem[];
  type?: "experience" | "education";
  className?: string;
}

export const TimelineCardList: React.FC<TimelineCardListProps> = ({
  items,
  type = "experience",
  className = "",
}) => {
  return (
    <div className={`relative pl-6 sm:pl-8 border-l-2 border-border-warm space-y-6 sm:space-y-7 my-8 ${className}`}>
      {items.map((item, idx) => {
        const itemType = item.type || type;
        const OrgIcon = itemType === "education" ? GraduationCap : Briefcase;
        const statusText =
          item.statusBadge || (item.isCurrent ? "現職 • Present" : undefined);

        const highlightsHeader =
          item.highlightsTitle ||
          (itemType === "education"
            ? "Academic Highlights & Honors"
            : "Key Accomplishments & Responsibilities");

        const tagsHeader =
          item.tagsTitle ||
          (itemType === "education"
            ? "Key Coursework & Competencies"
            : "Tech Stack & Tools Used");

        return (
          <div key={(item.id || item.title) + idx} className="relative group">
            {/* Timeline Japanese Seal Dot */}
            <div className="absolute -left-[24px] sm:-left-[32px] -translate-x-1/2 top-6 sm:top-8 w-5 h-5 rounded-full bg-surface border-2 border-primary group-hover:scale-110 transition-all flex items-center justify-center z-10 shadow-xs">
              <div className="w-2 h-2 rounded-full bg-primary transition-colors" />
            </div>

            <div className="relative overflow-hidden bg-surface border border-border-warm rounded-xl p-6 sm:p-8 hover:border-primary/40 transition-colors shadow-2xs space-y-5">
              {/* Bottom-right diagonal Seigaiha wave accent */}
              <CardCornerSeigaiha cardBgColor="#ffffff" />

              {/* Header Row */}
              <div className="relative z-10 flex flex-wrap items-start justify-between gap-3 border-b border-border-subtle pb-4">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink">
                    {item.title}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-primary font-medium">
                    <div className="flex items-center gap-1.5">
                      <OrgIcon className="w-4 h-4 shrink-0" />
                      <span>{item.organization}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1.5 pl-[22px] sm:pl-0 text-xs text-ink-muted font-normal">
                        <span className="hidden sm:inline text-ink-muted/50">•</span>
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs text-ink-muted font-mono flex-wrap gap-y-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    {item.period}
                  </span>
                  {statusText && (
                    <span className="font-serif text-primary font-semibold text-xs">
                      {statusText}
                    </span>
                  )}
                </div>
              </div>

              {/* Description & Optional GPA / Badge */}
              <div className="relative z-10 space-y-3">
                {item.gpaOrBadge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold">
                    <Award className="w-3.5 h-3.5" />
                    {item.gpaOrBadge}
                  </div>
                )}
                <p className="text-sm text-ink-muted leading-relaxed font-sans line-clamp-2" title={item.description}>
                  {item.description}
                </p>
              </div>

              {/* Highlights Section (Bullet Points) */}
              {item.highlights && item.highlights.length > 0 && (
                <div className="relative z-10 space-y-2 pt-2 border-t border-border-subtle">
                  <h3 className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    {itemType === "education" ? (
                      <Award className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    )}
                    {highlightsHeader}
                  </h3>
                  <ul className="space-y-1.5 text-xs text-ink-muted font-sans pl-1">
                    {item.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Coursework / Skills Badges */}
              {item.tags && item.tags.length > 0 && (
                <div className="relative z-10 space-y-2 pt-2 border-t border-border-subtle/60">
                  <h3 className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    {tagsHeader}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="ghost" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
