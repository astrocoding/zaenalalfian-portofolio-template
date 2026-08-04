import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import { ArrowLeft, BookOpen } from "lucide-react";

export interface DocHeaderProps {
  title: string;
  category: string;
  description: string;
}

export const DocHeader: React.FC<DocHeaderProps> = ({
  title,
  category,
  description,
}) => {
  return (
    <div className="space-y-6 pb-4 border-b border-border-warm">
      <Link
        href="/docs"
        className="inline-flex items-center space-x-2 text-xs font-mono text-ink-muted hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Documentation / ドキュメント一覧へ戻る</span>
      </Link>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" size="md">
            {category}
          </Badge>
          <span className="text-xs font-mono text-ink-muted flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            Technical Guide
          </span>
          <span className="font-serif text-xs text-primary font-semibold">公式ドキュメント</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink leading-tight">
          {title}
        </h1>

        <p className="text-lg text-ink-muted leading-relaxed font-serif italic max-w-3xl border-l-2 border-primary/40 pl-4 py-1">
          &quot;{description}&quot;
        </p>

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
            <div className="text-xs font-mono text-ink-muted">Software Architect &amp; Author</div>
          </div>
        </div>
      </div>
    </div>
  );
};
