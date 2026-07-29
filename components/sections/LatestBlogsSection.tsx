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

import Image from "next/image";
import { EmptyState } from "../ui/EmptyState";

function formatDate(dateStr: string): string {
  try {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return dateStr;
  }
}

import { normalizeImageUrl } from "@/lib/seo";

const BlogCardThumbnail: React.FC<{
  thumbnail?: string | null;
  title: string;
  category: string;
}> = ({ thumbnail, title, category }) => {
  const [imageError, setImageError] = React.useState(false);
  const normalized = normalizeImageUrl(thumbnail);

  const isCustomImage =
    normalized &&
    normalized !== "/blogs/preview.jpg" &&
    !imageError;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isCustomImage ? (
        <Image
          src={normalized}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 400px"
          decoding="async"
          loading="lazy"
          onError={() => setImageError(true)}
          className="object-cover"
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
      className={`group/blog group relative flex flex-col justify-between w-full transform-gpu hover:-translate-y-1.5 transition-transform duration-200 ease-out ${className}`}
    >
      {/* --- TOP THUMBNAIL IMAGE (IMAGE ONLY HAS ROUNDED-2XL BORDER RADIUS) --- */}
      <Link
        href={`/blogs/${blog.category.toLowerCase()}/${blog.slug}`}
        className="block relative w-full h-44 sm:h-48 overflow-hidden bg-[#f6e0ce]/30 shrink-0 rounded-2xl border border-border-subtle group-hover/blog:border-primary transition-colors duration-200"
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
  blogs = [],
}) => {
  const hasBlogs = blogs && blogs.length > 0;

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
      {!hasBlogs ? (
        <EmptyState
          icon={BookOpen}
          title="No blogs posted yet"
          subtitleKanji="投稿された記事はまだありません"
          description="Technical insights, articles, and architecture breakdowns will appear here once published."
        />
      ) : (
        <>
          <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-none gap-6 sm:gap-8 lg:gap-10 pb-6 pt-2 items-stretch">
            {blogs.slice(0, 3).map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                className="w-[85vw] sm:w-[calc(50%-16px)] lg:w-auto shrink-0 snap-start lg:shrink"
              />
            ))}
          </div>

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
        </>
      )}
    </SectionWrapper>
  );
};
