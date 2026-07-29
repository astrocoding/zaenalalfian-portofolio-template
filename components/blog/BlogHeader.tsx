import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export interface BlogHeaderProps {
  title: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  description: string;
  thumbnail?: string;
}

export const BlogHeader: React.FC<BlogHeaderProps> = ({
  title,
  category,
  publishedAt,
  readingTime,
  description,
  thumbnail,
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
          <span className="font-serif text-xs text-primary font-medium">記事の詳細</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink leading-tight">
          {title}
        </h1>

        <p className="text-lg text-ink-muted leading-relaxed font-serif italic max-w-3xl border-l-2 border-primary/40 pl-4 py-1">
          &quot;{description}&quot;
        </p>

        {thumbnail &&
          (thumbnail.startsWith("/upload/") ||
            thumbnail.startsWith("http") ||
            thumbnail.startsWith("/")) && (
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden border border-border-warm my-6 shadow-md">
              <Image
                src={thumbnail}
                alt={title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
                className="object-cover"
              />
            </div>
          )}

        <div className="flex items-center space-x-3 pt-2">
          <Image
            src="/zen.svg?v=2"
            alt="Zaenal Alfian Logo"
            width={36}
            height={36}
            className="w-9 h-9 object-contain"
          />
          <div>
            <div className="text-sm font-bold text-ink font-sans">Zaenal Alfian</div>
            <div className="text-xs font-mono text-ink-muted">Full-Stack Engineer</div>
          </div>
        </div>
      </div>
    </div>
  );
};
