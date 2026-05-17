import * as React from "react";

export interface MarkdownRendererProps {
  contentHtml: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  contentHtml,
}) => {
  return (
    <article
      className="pt-7 pb-10 space-y-6 text-ink font-sans leading-relaxed text-base
        [&>:first-child]:mt-3
        [&>h1]:text-2xl [&>h1]:sm:text-3xl [&>h1]:font-bold [&>h1]:font-serif [&>h1]:text-ink [&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:pb-2 [&>h1]:border-b [&>h1]:border-border-subtle
        [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-bold [&>h2]:font-serif [&>h2]:text-ink [&>h2]:mt-8 [&>h2]:mb-3
        [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-ink [&>h3]:mt-6 [&>h3]:mb-2
        [&>p]:text-ink-muted [&>p]:leading-relaxed [&>p]:mb-4
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-4 [&_ul]:text-ink-muted
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-4 [&_ol]:text-ink-muted
        [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:italic [&_blockquote]:font-serif [&_blockquote]:my-6 [&_blockquote]:text-ink
        [&>pre]:bg-[#1e1e1e] [&>pre]:text-neutral-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:font-mono [&>pre]:text-xs [&>pre]:my-6 [&>pre]:border [&>pre]:border-neutral-800
        [&>code]:font-mono [&>code]:text-xs [&>code]:bg-[#f6e0ce]/50 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-primary
        [&>a]:text-primary [&>a]:underline [&>a]:underline-offset-4 [&>a]:hover:text-[#993b3d]
        [&_div[data-align='left']]:text-left [&_div[data-align='center']]:text-center [&_div[data-align='right']]:text-right [&_div[data-align='justify']]:text-justify
        [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:inline-block"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
};
