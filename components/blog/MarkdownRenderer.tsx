"use client";

import * as React from "react";
import { optimizeHtmlCodeBlocks } from "@/lib/markdownUtils";

export interface MarkdownRendererProps {
  contentHtml: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  contentHtml,
}) => {
  // Synchronously ensure code blocks have syntax highlighting and container boxes
  const renderedHtml = React.useMemo(() => {
    return optimizeHtmlCodeBlocks(contentHtml);
  }, [contentHtml]);

  // Handle interactive Copy buttons via event delegation
  const handleArticleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const copyBtn = target.closest(
      "button[data-copy-code='true']"
    ) as HTMLButtonElement;
    if (!copyBtn) return;

    const wrapper = copyBtn.closest(".code-block-wrapper");
    if (!wrapper) return;

    const codeEl = wrapper.querySelector("code");
    if (!codeEl) return;

    const textToCopy = codeEl.textContent || "";
    navigator.clipboard.writeText(textToCopy).then(() => {
      const span = copyBtn.querySelector("span");
      if (span) {
        const originalText = span.textContent;
        span.textContent = "Copied!";
        span.className = "text-emerald-400 font-bold";
        setTimeout(() => {
          span.textContent = originalText;
          span.className = "";
        }, 2000);
      }
    });
  };

  return (
    <article
      onClick={handleArticleClick}
      className="pb-10 space-y-6 text-ink font-sans leading-relaxed text-base
        [&>:first-child]:mt-0 [&>:first-child]:pt-0
        [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:font-bold [&_h1]:font-serif [&_h1]:text-primary [&_h1]:mb-4 [&_h1]:pb-2 [&_h1]:border-b [&_h1]:border-border-subtle [&_h1:not(:first-child)]:mt-8
        [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:font-serif [&_h2]:text-ink [&_h2]:mb-3 [&_h2:not(:first-child)]:mt-8
        [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mb-2 [&_h3:not(:first-child)]:mt-6
        [&>p]:text-ink-muted [&>p]:leading-relaxed [&>p]:mb-4
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-4 [&_ul]:text-ink-muted
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-4 [&_ol]:text-ink-muted
        [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:italic [&_blockquote]:font-serif [&_blockquote]:my-6 [&_blockquote]:text-ink
        [&_pre]:bg-[#1e1e1e] [&_pre]:text-neutral-100 [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:font-mono [&_pre]:text-xs sm:[&_pre]:text-sm
        [&>code]:font-mono [&>code]:text-xs [&>code]:bg-[#f6e0ce]/50 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-primary
        [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-[#993b3d]
        [&_div[data-align='left']]:text-left [&_div[data-align='center']]:text-center [&_div[data-align='right']]:text-right [&_div[data-align='justify']]:text-justify
        [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:inline-block"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
