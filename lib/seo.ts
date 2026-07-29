/**
 * SEO helpers — all canonical URLs and OG image sources resolve from
 * NEXTAUTH_URL so the site works correctly across dev, staging, and prod
 * without any hardcoded domain in components, layouts, or pages.
 */

/** Returns the site root URL from env. Never has a trailing slash. */
export const getSiteUrl = (): string => {
  const url = process.env.NEXTAUTH_URL ?? "https://zaenalalfian.cloud";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

/** Builds a fully-qualified canonical URL for the given path. */
export const buildCanonical = (path: string): string => {
  const base = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

/**
 * Fallback OG image — the Zen logo SVG served from /public.
 * Used when a post/project has no thumbnail.
 */
export const DEFAULT_OG_IMAGE = (): string => `${getSiteUrl()}/zen.svg`;

/**
 * Normalizes an image URL:
 * If the URL contains `/upload/img/` with a full domain prefix (e.g. https://zaenalalfian.cloud/upload/img/file.webp),
 * convert it to a relative same-origin path `/upload/img/file.webp`.
 * This prevents Next.js <Image> from treating internal uploaded images as unallowed external domains,
 * eliminating HTTP 400 Bad Request errors.
 */
export const normalizeImageUrl = (url?: string | null): string | null => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.includes("/upload/img/")) {
    const idx = trimmed.indexOf("/upload/img/");
    return trimmed.substring(idx);
  }
  return trimmed;
};

