"use client";

import * as React from "react";
import Link from "next/link";
import { SectionWrapper } from "../ui/SectionWrapper";
import { Button } from "../ui/Button";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  publishedAt: string;
  readingTime?: string;
  author?: string;
  thumbnail?: string | null;
  kanji?: string;
  bgGradient?: string;
  illustration?: "castle" | "fox" | "fuji" | "pagoda";
}

const fallbackBlogs: BlogItem[] = [
  {
    id: "blog-1",
    title: "Optimizing React 19 Server Components for Web Vitals",
    slug: "optimizing-react-19-server-components",
    category: "Performance",
    author: "Zaenal Alfian",
    description:
      "Practical strategies to eliminate hydration shifts, optimize streaming boundaries, and achieve sub-200ms INP metrics.",
    publishedAt: "2026-04-10",
    readingTime: "5 min read",
    thumbnail: "",
  },
  {
    id: "blog-2",
    title: "The Art of Japanese Minimalist UI: Clarity & Ma",
    slug: "japanese-minimalist-ui-design-clarity",
    category: "Design System",
    author: "Zaenal Alfian",
    description:
      "How traditional Japanese spatial aesthetics (Ma) and muted rice paper color palettes improve user focus and reduce cognitive load.",
    publishedAt: "2026-05-28",
    readingTime: "8 min read",
    thumbnail: "",
  },
  {
    id: "blog-3",
    title: "Mastering Next.js 16 App Router & Prisma 7",
    slug: "nextjs-16-prisma-7-driver-adapters",
    category: "Architecture",
    author: "Zaenal Alfian",
    description:
      "A deep dive into setting up Prisma 7 SQL driver adapters with PostgreSQL, server components, and clean data access patterns.",
    publishedAt: "2026-06-15",
    readingTime: "6 min read",
    thumbnail: "",
  },
  {
    id: "blog-4",
    title: "Editorial Craftsmanship: Engineering High-Fidelity UI",
    slug: "editorial-craftsmanship-high-fidelity-ui",
    category: "Craftsmanship",
    author: "Zaenal Alfian",
    description:
      "Combining micro-interactions, responsive CSS layout structures, and Japanese typographic rhythm for premium portfolio web apps.",
    publishedAt: "2026-03-22",
    readingTime: "7 min read",
    thumbnail: "",
  },
];

function formatDate(dateStr: string): string {
  try {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const BlogCardThumbnail: React.FC<{
  thumbnail?: string | null;
  title: string;
  category: string;
}> = ({ thumbnail, title, category }) => {
  const [imageError, setImageError] = React.useState(false);

  const isCustomImage =
    thumbnail &&
    thumbnail !== "/blogs/preview.jpg" &&
    (thumbnail.startsWith("/upload/") ||
      thumbnail.startsWith("http") ||
      thumbnail.includes(".")) &&
    !imageError;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isCustomImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={thumbnail}
          alt={title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#f6e0ce]/30">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-medium text-ink-muted">
            {category}
          </span>
        </div>
      )}
    </div>
  );
};

export const BlogCard: React.FC<{
  blog: BlogItem;
  className?: string;
}> = ({ blog, className = "" }) => {
  const authorName = blog.author || "Zaenal Alfian";
  const readTime = blog.readingTime || "5 min read";

  return (
    <div
      className={`group/blog group relative flex flex-col justify-between w-full hover:-translate-y-1.5 transition-all duration-300 ${className}`}
    >
      {/* --- TOP THUMBNAIL IMAGE (IMAGE ONLY HAS ROUNDED-2XL BORDER RADIUS) --- */}
      <Link
        href={`/blogs/${blog.category.toLowerCase()}/${blog.slug}`}
        className="block relative w-full h-44 sm:h-48 overflow-hidden bg-[#f6e0ce]/30 shrink-0 rounded-2xl border border-border-subtle group-hover/blog:border-primary transition-all"
      >
        <BlogCardThumbnail
          thumbnail={blog.thumbnail}
          title={blog.title}
          category={blog.category}
        />
      </Link>

      {/* --- CARD CONTENT BODY (TRANSPARENT BG, CLEAN EDITORIAL TEXT) --- */}
      <div className="pt-3.5 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Author & Reading Time */}
          <div className="text-xs font-mono text-ink-muted flex items-center space-x-1.5">
            <span>{authorName}</span>
            <span>•</span>
            <span>{readTime}</span>
          </div>

          {/* Title (Truncated to 1 line with Arrow Up Right icon) */}
          <Link
            href={`/blogs/${blog.category.toLowerCase()}/${blog.slug}`}
            className="group/title flex items-start justify-between gap-2"
          >
            <h3
              className="text-base sm:text-lg font-serif font-bold text-ink group-hover/blog:text-primary group-hover/title:text-primary hover:text-primary transition-colors leading-snug truncate"
              title={blog.title}
            >
              {blog.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-ink-muted group-hover/blog:text-primary group-hover/title:text-primary hover:text-primary transition-colors shrink-0 mt-0.5" />
          </Link>

          {/* Description (Truncated to 2 lines) */}
          <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
            {blog.description}
          </p>
        </div>

        {/* --- FOOTER: CATEGORY BADGE & PUBLISHED DATE --- */}
        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="inline-block px-2.5 py-1 rounded-full bg-border-subtle/50 text-ink-muted font-mono font-medium text-[11px]">
            {blog.category}
          </span>
          <span className="font-mono text-xs text-ink-muted">
            {formatDate(blog.publishedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const LatestBlogsSection: React.FC<{ blogs?: BlogItem[] }> = ({
  blogs = fallbackBlogs,
}) => {
  // Ensure 3 items exist for clean 3-column desktop layout
  const displayBlogs = React.useMemo(() => {
    const list = [...blogs];
    while (list.length < 3) {
      const fallback = fallbackBlogs[list.length % fallbackBlogs.length];
      list.push({ ...fallback, id: `${fallback.id}-extra-${list.length}` });
    }
    return list.slice(0, 3);
  }, [blogs]);

  return (
    <SectionWrapper
      id="blogs"
      kanjiSubtitle="最新記事"
      sectionTitle="Latest Technical Insights"
      sectionDescription="Articles on modern frontend engineering, system design, performance, and editorial UI craftsmanship."
      headerAlign="center"
      bgVariant="surface"
      containerSize="wide"
      className="pt-10 sm:pt-14 pb-16 sm:pb-24 relative overflow-hidden"
    >
      {/* --- CAROUSEL TRACK (Native Touch Swipe on Mobile/Tablet, 3-Col Grid on Desktop with Spacious Gap) --- */}
      <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-none gap-6 sm:gap-8 lg:gap-10 pb-6 pt-2 items-stretch">
        {displayBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            className="w-[85vw] sm:w-[calc(50%-16px)] lg:w-auto shrink-0 snap-start lg:shrink"
          />
        ))}
      </div>

      {/* --- SECTION SEPARATOR WITH CENTERED SHOW MORE ARTICLES BUTTON --- */}
      <div className="mt-12 sm:mt-16 flex items-center justify-center w-full">
        <div className="flex-1 h-px bg-border-subtle" />
        <Link href="/blogs" className="mx-4 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-5 py-2.5 text-xs font-mono font-semibold border-border-warm bg-surface hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Show More Articles
          </Button>
        </Link>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>
    </SectionWrapper>
  );
};
