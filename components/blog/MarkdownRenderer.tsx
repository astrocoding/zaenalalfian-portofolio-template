import * as React from "react";

export interface MarkdownRendererProps {
  contentHtml: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  contentHtml,
}) => {
  return (
    <article
      className="py-8 space-y-6 text-ink font-sans leading-relaxed text-base
        [&>h1]:text-2xl [&>h1]:sm:text-3xl [&>h1]:font-bold [&>h1]:font-serif [&>h1]:text-ink [&>h1]:mt-10 [&>h1]:mb-4 [&>h1]:pb-2 [&>h1]:border-b [&>h1]:border-border-subtle
        [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-bold [&>h2]:font-serif [&>h2]:text-ink [&>h2]:mt-8 [&>h2]:mb-3
        [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-ink [&>h3]:mt-6 [&>h3]:mb-2
        [&>p]:text-ink-muted [&>p]:leading-relaxed [&>p]:mb-4
        [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:my-4 [&>ul]:text-ink-muted
        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:my-4 [&>ol]:text-ink-muted
        [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:font-serif [&>blockquote]:my-6 [&>blockquote]:text-ink
        [&>pre]:bg-[#1e1e1e] [&>pre]:text-neutral-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:font-mono [&>pre]:text-xs [&>pre]:my-6 [&>pre]:border [&>pre]:border-neutral-800
        [&>code]:font-mono [&>code]:text-xs [&>code]:bg-[#f6e0ce]/50 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-primary
        [&>a]:text-primary [&>a]:underline [&>a]:underline-offset-4 [&>a]:hover:text-[#993b3d]"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
};
