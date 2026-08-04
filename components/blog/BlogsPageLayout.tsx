"use client";

import * as React from "react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { BlogCard, BlogItem } from "@/components/sections/LatestBlogsSection";
import { EmptyState } from "@/components/ui/EmptyState";

import contentData from "@/data/content.json";

const POSTS_PER_PAGE = 6;

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handleChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
    // Smooth scroll to top of the blogs grid
    const el = document.getElementById("blogs-grid-top");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Build page number array with ellipsis logic
  const getPages = (): (number | "…")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "…")[] = [1];
    if (currentPage > 3) pages.push("…");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  return (
    <nav
      aria-label="Blog pagination"
      className="flex items-center justify-center gap-1.5 pt-10 pb-2 select-none"
    >
      {/* Prev */}
      <button
        onClick={() => handleChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="group flex items-center justify-center w-9 h-9 rounded-xl border border-border-warm bg-surface text-ink-muted hover:border-primary hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      {getPages().map((p, idx) =>
        p === "…" ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-ink-muted text-sm font-mono"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => handleChange(p as number)}
            aria-current={p === currentPage ? "page" : undefined}
            aria-label={`Page ${p}`}
            className={`w-9 h-9 rounded-xl border text-sm font-mono font-semibold transition-all duration-200 ${
              p === currentPage
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-border-warm bg-surface text-ink-muted hover:border-primary hover:text-primary hover:bg-primary/5"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="group flex items-center justify-center w-9 h-9 rounded-xl border border-border-warm bg-surface text-ink-muted hover:border-primary hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

// ─── Main Layout ──────────────────────────────────────────────────────────────
export const BlogsPageLayout: React.FC<{ blogs: BlogItem[] }> = ({ blogs }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE);
  const hasBlogs = blogs.length > 0;

  const paginated = blogs.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <section className="w-full">
      {/* ── Header ── */}
      <div className="text-center space-y-3 pb-10 sm:pb-14">
        <span className="font-serif text-primary tracking-widest text-xs font-semibold uppercase block">
          {contentData.blogs.page.kanjiLabel}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink tracking-tight">
          {contentData.blogs.page.title}
        </h1>
        <p className="text-sm sm:text-base text-ink-muted max-w-xl mx-auto leading-relaxed font-sans">
          {contentData.blogs.page.description}
        </p>
        {/* decorative rule */}
        <div className="flex items-center justify-center pt-1">
          <div className="w-12 h-px bg-primary/30" />
        </div>
      </div>

      {/* ── Scroll anchor ── */}
      <div id="blogs-grid-top" className="-mt-4 pt-4" aria-hidden />

      {/* ── Content ── */}
      {!hasBlogs ? (
        <EmptyState
          icon={BookOpen}
          title={contentData.emptyStates.blogs.title}
          subtitleKanji={contentData.emptyStates.blogs.subtitleKanji}
          description={contentData.emptyStates.blogs.description}
        />
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {paginated.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {/* Page indicator */}
          {totalPages > 1 && (
            <p className="text-center text-[11px] font-mono text-ink-muted/60 mt-3">
              Page {currentPage} of {totalPages} &nbsp;·&nbsp; {blogs.length} articles total
            </p>
          )}
        </>
      )}
    </section>
  );
};
