import * as React from "react";
import Link from "next/link";
import { Badge } from "../ui/Badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export interface BlogHeaderProps {
  title: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  description: string;
}

export const BlogHeader: React.FC<BlogHeaderProps> = ({
  title,
  category,
  publishedAt,
  readingTime,
  description,
}) => {
  return (
    <div className="space-y-6 pb-4 border-b border-border-warm">
      <Link
        href="/#blogs"
        className="inline-flex items-center space-x-2 text-xs font-mono text-ink-muted hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Articles / 記事一覧へ戻る</span>
      </Link>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" size="md">
            {category}
          </Badge>
          <span className="text-xs font-mono text-ink-muted flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {publishedAt}
          </span>
          <span className="text-xs font-mono text-ink-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {readingTime}
          </span>
          <span className="font-serif text-xs text-primary/50 font-semibold">記事の詳細</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink leading-tight">
          {title}
        </h1>

        <p className="text-lg text-ink-muted leading-relaxed font-serif italic max-w-3xl border-l-2 border-primary/40 pl-4 py-1">
          &quot;{description}&quot;
        </p>

        <div className="flex items-center space-x-3 pt-2">
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-serif font-bold text-sm">
            才
          </div>
          <div>
            <div className="text-sm font-bold text-ink font-sans">Zaenal Alfian</div>
            <div className="text-xs font-mono text-ink-muted">Senior Full-Stack Architect</div>
          </div>
        </div>
      </div>
    </div>
  );
};
