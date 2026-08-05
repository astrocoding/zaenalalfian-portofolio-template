import hljs from "highlight.js";

/**
 * Decodes all HTML entities (named, decimal numeric like &#60;, and hexadecimal numeric like &#x3C;)
 * into their original raw string representation for accurate syntax parsing & rendering.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return "";
  return text
    // Hexadecimal numeric entities (e.g. &#x3C; -> <, &#x3E; -> >, &#x26; -> &, &#x22; -> ")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const codePoint = parseInt(hex, 16);
      return isNaN(codePoint) ? _ : String.fromCharCode(codePoint);
    })
    // Decimal numeric entities (e.g. &#60; -> <, &#62; -> >, &#38; -> &)
    .replace(/&#([0-9]+);/g, (_, dec) => {
      const codePoint = parseInt(dec, 10);
      return isNaN(codePoint) ? _ : String.fromCharCode(codePoint);
    })
    // Named HTML entities
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/**
 * Optimizes raw HTML code blocks by pre-rendering syntax highlighting (via highlight.js)
 * and embedding header bars with language badges & copy buttons during server-side processing.
 * Prevents FOUC (Flash of Unstyled Content) and visual glitches on initial page paint.
 */
export function optimizeHtmlCodeBlocks(htmlContent: string): string {
  if (!htmlContent) return "";

  // 1. Process <pre><code> blocks with highlight.js syntax pre-rendering
  let result = htmlContent.replace(
    /<pre><code(?:\s+class="([^"]*)")?>([\s\S]*?)<\/code><\/pre>/gi,
    (match, classAttr, rawCode) => {
      // If already wrapped in code-block-wrapper, skip
      if (match.includes("code-block-wrapper")) {
        return match;
      }

      // Fully decode ALL HTML entities (including &#x3C;, &#x3E;, &lt;, &gt;, &amp;) to get clean source code
      const decodedCode = decodeHtmlEntities(rawCode);

      // Extract language from class (e.g. language-js, language-python, language-bash, language-html)
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
          highlightedCode = decodedCode
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
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

  // 2. Process inline <code> tags outside of <pre> blocks to clean any residual hex/decimal entities (e.g. &#x3C;)
  result = result.replace(/(?:^|[^>])<code(?:\s+class="([^"]*)")?>([\s\S]*?)<\/code>/gi, (match, classAttr, innerText) => {
    if (classAttr && classAttr.includes("hljs")) {
      return match;
    }
    const decoded = decodeHtmlEntities(innerText);
    const safeDecoded = decoded
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return match.replace(innerText, safeDecoded);
  });

  return result;
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
