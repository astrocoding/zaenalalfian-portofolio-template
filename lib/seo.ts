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
