import * as React from "react";
import { Badge } from "../ui/Badge";

export interface DocsContentProps {
  title: string;
  category: string;
  description: string;
  htmlContent: string;
}

export const DocsContent: React.FC<DocsContentProps> = ({
  title,
  category,
  description,
  htmlContent,
}) => {
  return (
    <div className="flex-1 min-w-0 space-y-6">
      {/* Doc Header */}
      <div className="pb-6 border-b border-border-warm space-y-3">
        <div className="flex items-center space-x-2">
          <Badge variant="accent" size="sm">
            {category}
          </Badge>
          <span className="font-serif text-xs text-primary font-semibold">公式ドキュメント</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink leading-tight">
          {title}
        </h1>

        <p className="text-base text-ink-muted leading-relaxed font-sans">
          {description}
        </p>
      </div>

      {/* Doc Body */}
      <div
        className="space-y-6 text-ink font-sans leading-relaxed text-sm sm:text-base
          [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:font-serif [&>h1]:text-ink [&>h1]:mt-8 [&>h1]:mb-3 [&>h1]:pb-2 [&>h1]:border-b [&>h1]:border-border-subtle
          [&>h2]:text-xl [&>h2]:font-bold [&>h2]:font-serif [&>h2]:text-ink [&>h2]:mt-6 [&>h2]:mb-2
          [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-ink [&>h3]:mt-4 [&>h3]:mb-2
          [&>p]:text-ink-muted [&>p]:leading-relaxed [&>p]:mb-4
          [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:my-3 [&>ul]:text-ink-muted
          [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>ol]:my-3 [&>ol]:text-ink-muted
          [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:font-serif [&>blockquote]:my-4 [&>blockquote]:text-ink
          [&>pre]:bg-[#1e1e1e] [&>pre]:text-neutral-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:font-mono [&>pre]:text-xs [&>pre]:my-4 [&>pre]:border [&>pre]:border-neutral-800
          [&>code]:font-mono [&>code]:text-xs [&>code]:bg-[#f6e0ce]/50 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-primary"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};
