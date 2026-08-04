"use client";

import * as React from "react";
import Link from "next/link";
import { SectionWrapper } from "../ui/SectionWrapper";
import { Button } from "../ui/Button";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import Image from "next/image";
import { EmptyState } from "../ui/EmptyState";
import { normalizeImageUrl } from "@/lib/seo";
import contentData from "@/data/content.json";

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

const BlogCardThumbnail: React.FC<{
  thumbnail?: string | null;
  title: string;
  category: string;
}> = ({ thumbnail, title, category }) => {
  const [imageError, setImageError] = React.useState(false);
  const normalized = normalizeImageUrl(thumbnail);

  const isCustomImage =
    normalized && normalized !== "/blogs/preview.jpg" && !imageError;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isCustomImage ? (
        <Image
          src={normalized}
          alt={title}
          fill
          unoptimized={normalized.startsWith("/upload/")}
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

export const FeaturedBlogCard: React.FC<{ blog: BlogItem }> = ({ blog }) => {
  const authorName = blog.author || contentData.blogs.defaultAuthor;
  const readTime = blog.readingTime || contentData.blogs.defaultReadTime;

  return (
    <div className="group/blog group relative flex flex-col justify-between w-full h-full bg-surface border border-border-warm rounded-3xl p-4 sm:p-5 hover:border-primary/60 hover:shadow-md transition-all duration-300 transform-gpu hover:-translate-y-1">
      <div className="space-y-3.5">
        {/* Thumbnail Image with Category Overlay */}
        <Link
          href={`/blogs/${blog.category.toLowerCase()}/${blog.slug}`}
          className="block relative w-full h-48 sm:h-56 lg:h-60 xl:h-64 overflow-hidden rounded-2xl border border-border-subtle group-hover/blog:border-primary/50 transition-colors"
        >
          <BlogCardThumbnail
            thumbnail={blog.thumbnail}
            title={blog.title}
            category={blog.category}
          />
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium bg-black/50 backdrop-blur-md text-white border border-white/20 shadow-sm">
              {blog.category}
            </span>
          </div>
        </Link>

        {/* Content Body */}
        <div className="space-y-2 min-w-0">
          <div className="text-xs font-mono text-ink-muted flex items-center space-x-1.5">
            <span>{authorName}</span>
            <span>•</span>
            <span>{readTime}</span>
          </div>

          <Link
            href={`/blogs/${blog.category.toLowerCase()}/${blog.slug}`}
            className="group/title flex items-center justify-between gap-2 min-w-0"
          >
            <h3
              className="text-lg sm:text-xl font-serif font-bold text-ink group-hover/blog:text-primary group-hover/title:text-primary transition-colors leading-snug truncate"
              title={blog.title}
            >
              {blog.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-ink-muted group-hover/blog:text-primary group-hover/title:text-primary transition-colors shrink-0" />
          </Link>

          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed line-clamp-2">
            {blog.description}
          </p>
        </div>
      </div>

      {/* Date Footer */}
      <div className="pt-3 mt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs font-mono text-ink-muted">
        <span>{formatDate(blog.publishedAt)}</span>
        <span className="text-primary font-semibold group-hover/blog:translate-x-1 transition-transform inline-flex items-center gap-1">
          Read Article &rarr;
        </span>
      </div>
    </div>
  );
};

export const CompactBlogCard: React.FC<{ blog: BlogItem }> = ({ blog }) => {
  const readTime = blog.readingTime || contentData.blogs.defaultReadTime;

  return (
    <div className="group/blog group relative flex flex-col justify-between w-full h-full bg-surface border border-border-warm rounded-2xl p-3 sm:p-3.5 hover:border-primary/60 hover:shadow-sm transition-all duration-300 transform-gpu hover:-translate-y-1">
      <div className="space-y-2.5">
        {/* Thumbnail Image with Category Overlay */}
        <Link
          href={`/blogs/${blog.category.toLowerCase()}/${blog.slug}`}
          className="block relative w-full h-28 sm:h-32 lg:h-32 overflow-hidden rounded-xl border border-border-subtle group-hover/blog:border-primary/50 transition-colors"
        >
          <BlogCardThumbnail
            thumbnail={blog.thumbnail}
            title={blog.title}
            category={blog.category}
          />
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-black/50 backdrop-blur-md text-white border border-white/20 shadow-2xs">
              {blog.category}
            </span>
          </div>
        </Link>

        {/* Title */}
        <Link
          href={`/blogs/${blog.category.toLowerCase()}/${blog.slug}`}
          className="group/title flex items-center justify-between gap-1.5 min-w-0"
        >
          <h4
            className="text-sm font-serif font-bold text-ink group-hover/blog:text-primary group-hover/title:text-primary transition-colors leading-snug truncate"
            title={blog.title}
          >
            {blog.title}
          </h4>
          <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted group-hover/blog:text-primary group-hover/title:text-primary transition-colors shrink-0" />
        </Link>
      </div>

      {/* Date & Read Time Footer */}
      <div className="pt-2 mt-2 border-t border-border-subtle/50 flex items-center justify-between text-xs font-mono text-ink-muted">
        <span>{formatDate(blog.publishedAt)}</span>
        <span>{readTime}</span>
      </div>
    </div>
  );
};

export const BlogCard = CompactBlogCard;

export const LatestBlogsSection: React.FC<{ blogs?: BlogItem[] }> = ({
  blogs = [],
}) => {
  const hasBlogs = blogs && blogs.length > 0;
  const featuredBlog = blogs[0];
  const compactBlogs = blogs.slice(1, 5);

  return (
    <SectionWrapper
      id="blogs"
      kanjiSubtitle={contentData.blogs.kanjiSubtitle}
      sectionTitle={contentData.blogs.sectionTitle}
      sectionDescription={contentData.blogs.sectionDescription}
      headerAlign="center"
      bgVariant="surface"
      containerSize="wide"
      className="pt-10 sm:pt-14 pb-16 sm:pb-24 relative overflow-hidden"
    >
      {!hasBlogs ? (
        <EmptyState
          icon={BookOpen}
          title={contentData.emptyStates.blogs.title}
          subtitleKanji={contentData.emptyStates.blogs.subtitleKanji}
          description={contentData.emptyStates.blogs.description}
        />
      ) : (
        <>
          {/* Desktop & Laptop 5-Card Layout (Left Dominant + Right 2x2 Grid) */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 lg:gap-5 xl:gap-6 items-stretch">
            {/* Left Dominant Card (5 Columns) */}
            <div className="lg:col-span-5 flex flex-col h-full">
              {featuredBlog && <FeaturedBlogCard blog={featuredBlog} />}
            </div>

            {/* Right 4 Balanced Cards Grid (7 Columns - 2x2 Grid) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 h-full">
              {compactBlogs.map((blog) => (
                <CompactBlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>

          {/* Mobile & Tablet Layout (Horizontal Scroll Snap or Stacked) */}
          <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3.5 sm:gap-4 pb-2 pt-2 items-stretch">
            {blogs.slice(0, 5).map((blog, idx) => (
              <div
                key={blog.id}
                className="w-[85vw] sm:w-[calc(50%-16px)] shrink-0 snap-start flex flex-col"
              >
                {idx === 0 ? (
                  <FeaturedBlogCard blog={blog} />
                ) : (
                  <CompactBlogCard blog={blog} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 flex items-center justify-center w-full">
            <div className="flex-1 h-px bg-border-subtle" />
            <Link href="/blogs" className="mx-4 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl px-5 py-2.5 text-xs font-mono font-semibold border-border-warm bg-surface text-ink hover:bg-primary hover:!text-white hover:border-primary transition-all duration-300"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {contentData.blogs.ctaShowMore}
              </Button>
            </Link>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>
        </>
      )}
    </SectionWrapper>
  );
};
