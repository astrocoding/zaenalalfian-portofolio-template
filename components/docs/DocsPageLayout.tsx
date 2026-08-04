"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CardCornerSeigaiha } from "@/components/ui/CardCornerSeigaiha";
import { EmptyState } from "@/components/ui/EmptyState";

export interface DocItem {
  title: string;
  slug: string;
  category: string;
  description: string;
}

const DOCS_PER_PAGE = 6;

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
    // Smooth scroll to top of the docs grid
    const el = document.getElementById("docs-grid-top");
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
      aria-label="Documentation pagination"
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
export const DocsPageLayout: React.FC<{ docs: DocItem[] }> = ({ docs }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(docs.length / DOCS_PER_PAGE);
  const hasDocs = docs.length > 0;

  const paginated = docs.slice(
    (currentPage - 1) * DOCS_PER_PAGE,
    currentPage * DOCS_PER_PAGE
  );

  return (
    <section className="w-full">
      {/* ── Header ── */}
      <div className="text-center space-y-3 pb-10 sm:pb-14">
        <span className="font-serif text-primary tracking-widest text-xs font-semibold uppercase block">
          公式文書
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink tracking-tight">
          Technical Documentation
        </h1>
        <p className="text-sm sm:text-base text-ink-muted max-w-xl mx-auto leading-relaxed font-sans">
          Comprehensive technical blueprints, system architecture notes, and developer guides.
        </p>
        {/* decorative rule */}
        <div className="flex items-center justify-center pt-1">
          <div className="w-12 h-px bg-primary/30" />
        </div>
      </div>

      {/* ── Scroll anchor ── */}
      <div id="docs-grid-top" className="-mt-4 pt-4" aria-hidden />

      {/* ── Content ── */}
      {!hasDocs ? (
        <EmptyState
          icon={FileText}
          title="No docs posted yet"
          subtitleKanji="ドキュメントはまだありません"
          description="Technical blueprints, system architecture notes, and developer guides will be published here once available."
        />
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((doc) => {
              const docUrl = `/docs/${doc.category.toLowerCase()}/${doc.slug}`;
              return (
                <Card
                  key={doc.slug}
                  hoverEffect
                  className="group relative overflow-hidden p-6 flex flex-col justify-between"
                >
                  <CardCornerSeigaiha cardBgColor="#ffffff" />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="accent" size="sm">
                        {doc.category}
                      </Badge>
                      <span className="font-serif text-xs text-primary font-semibold">
                        文書
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Link href={docUrl} className="group/title block">
                        <h3 className="text-xl font-serif font-bold text-ink group-hover:text-primary group-hover/title:text-primary transition-colors leading-snug line-clamp-2">
                          {doc.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                        {doc.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-6 mt-4 border-t border-border-subtle flex items-center justify-between text-xs font-mono">
                    <span className="text-ink-muted flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      Guide
                    </span>
                    <Link
                      href={docUrl}
                      className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Read Doc <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              );
            })}
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
              Page {currentPage} of {totalPages} &nbsp;·&nbsp; {docs.length} documents total
            </p>
          )}
        </>
      )}
    </section>
  );
};
