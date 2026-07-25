"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  baseUrl: string;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  baseUrl,
}) => {
  if (totalItems === 0 || totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handleScrollToTop = () => {
    const mainEl = document.querySelector("main");
    if (mainEl && mainEl.scrollTop > 0) {
      mainEl.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (typeof window !== "undefined" && window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  const getHref = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}`;
  };

  return (
    <div className="px-6 py-4 bg-surface border-t border-border-warm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
      <div className="text-ink-muted">
        Showing <span className="font-bold text-ink">{startItem}</span>–
        <span className="font-bold text-ink">{endItem}</span> of{" "}
        <span className="font-bold text-ink">{totalItems}</span> items
      </div>

      <div className="flex items-center space-x-1">
        {/* Previous Page Button */}
        {currentPage > 1 ? (
          <Link
            href={getHref(currentPage - 1)}
            scroll={false}
            onClick={handleScrollToTop}
            className="p-1.5 rounded border border-border-warm bg-paper text-ink hover:text-primary hover:border-primary transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </Link>
        ) : (
          <span className="p-1.5 rounded border border-border-subtle bg-black/5 text-ink-muted cursor-not-allowed flex items-center gap-1 opacity-50">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </span>
        )}

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`dots-${idx}`} className="px-2 py-1 text-ink-muted select-none">
                  ...
                </span>
              );
            }

            const isCurrent = p === currentPage;

            return isCurrent ? (
              <span
                key={`page-${p}`}
                className="px-3 py-1 rounded bg-primary text-white font-bold"
              >
                {p}
              </span>
            ) : (
              <Link
                key={`page-${p}`}
                href={getHref(Number(p))}
                scroll={false}
                onClick={handleScrollToTop}
                className="px-3 py-1 rounded border border-border-warm bg-paper text-ink hover:text-primary hover:border-primary transition-colors"
              >
                {p}
              </Link>
            );
          })}
        </div>

        {/* Next Page Button */}
        {currentPage < totalPages ? (
          <Link
            href={getHref(currentPage + 1)}
            scroll={false}
            onClick={handleScrollToTop}
            className="p-1.5 rounded border border-border-warm bg-paper text-ink hover:text-primary hover:border-primary transition-colors flex items-center gap-1"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="p-1.5 rounded border border-border-subtle bg-black/5 text-ink-muted cursor-not-allowed flex items-center gap-1 opacity-50">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </div>
  );
};
