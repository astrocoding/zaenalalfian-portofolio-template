import hljs from "highlight.js";

/**
 * Optimizes raw HTML code blocks by pre-rendering syntax highlighting (via highlight.js)
 * and embedding header bars with language badges & copy buttons during server-side processing.
 * Prevents FOUC (Flash of Unstyled Content) and visual glitches on initial page paint.
 */
export function optimizeHtmlCodeBlocks(htmlContent: string): string {
  if (!htmlContent) return "";

  return htmlContent.replace(
    /<pre><code(?:\s+class="([^"]*)")?>([\s\S]*?)<\/code><\/pre>/gi,
    (match, classAttr, rawCode) => {
      // If already wrapped in code-block-wrapper, skip
      if (match.includes("code-block-wrapper")) {
        return match;
      }

      // Decode basic HTML entities to get clean source code for highlight.js
      const decodedCode = rawCode
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      // Extract language from class (e.g. language-js, language-python, language-bash)
      let lang = "";
      if (classAttr) {
        const langMatch = classAttr.match(/language-([^\s]+)/);
        if (langMatch) {
          lang = langMatch[1].toLowerCase();
        }
      }

      // Perform server-side syntax highlighting
      let highlightedCode = "";
      if (lang && hljs.getLanguage(lang)) {
        try {
          highlightedCode = hljs.highlight(decodedCode, { language: lang }).value;
        } catch {
          highlightedCode = hljs.highlightAuto(decodedCode).value;
        }
      } else {
        try {
          highlightedCode = hljs.highlightAuto(decodedCode).value;
        } catch {
          highlightedCode = rawCode;
        }
      }

      const displayLang = (lang || "CODE").toUpperCase();

      return `<div class="code-block-wrapper my-6 rounded-xl overflow-hidden border border-neutral-800 bg-[#1e1e1e] shadow-md">
  <div class="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-neutral-800 text-xs font-mono text-neutral-400 select-none">
    <span class="font-semibold uppercase tracking-wider text-primary">${displayLang}</span>
    <button type="button" data-copy-code="true" class="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors text-[11px] font-mono flex items-center gap-1 cursor-pointer">
      <span>Copy</span>
    </button>
  </div>
  <pre class="m-0 p-4 bg-[#1e1e1e] text-neutral-100 overflow-x-auto font-mono text-xs sm:text-sm border-none"><code class="hljs ${lang ? `language-${lang}` : ""}">${highlightedCode}</code></pre>
</div>`;
    }
  );
}

/**
 * Ensures images inside markdown HTML are properly formatted with lazy loading.
 */
export function optimizeHtmlImages(htmlContent: string): string {
  if (!htmlContent) return "";
  return htmlContent.replace(/<img\s+([^>]*)\/?>/gi, (match, attributes) => {
    if (!attributes.includes('loading=')) {
      attributes += ' loading="lazy"';
    }
    return `<img ${attributes} />`;
  });
}
