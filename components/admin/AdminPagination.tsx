"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleScrollToTop = React.useCallback(() => {
    if (typeof window === "undefined") return;

    const mainEl = document.querySelector("main");
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Trigger smooth scroll to top seamlessly when currentPage or pageSize changes
  React.useEffect(() => {
    if (totalItems > 0) {
      handleScrollToTop();
    }
  }, [currentPage, pageSize, totalItems, handleScrollToTop]);

  // Synchronize URL parameters if page or limit are missing from searchParams (idle/default visit)
  React.useEffect(() => {
    if (!searchParams) return;

    const hasPage = searchParams.has("page");
    const hasLimit = searchParams.has("limit");

    if (!hasPage || !hasLimit) {
      const params = new URLSearchParams(searchParams.toString());
      if (!hasPage) params.set("page", currentPage.toString());
      if (!hasLimit) params.set("limit", pageSize.toString());

      const targetPath = baseUrl.split("?")[0] || pathname;
      router.replace(`${targetPath}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, currentPage, pageSize, baseUrl, pathname, router]);

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPages = Math.max(1, totalPages);
    if (maxPages <= 7) {
      for (let i = 1; i <= maxPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(maxPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < maxPages - 2) pages.push("...");
      pages.push(maxPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  const createQueryString = (page: number, limit: number) => {
    const params = new URLSearchParams(
      searchParams ? searchParams.toString() : "",
    );
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    return params.toString();
  };

  const getHref = (page: number, limit: number = pageSize) => {
    const targetPath = baseUrl.split("?")[0] || pathname;
    const queryString = createQueryString(page, limit);
    return `${targetPath}?${queryString}`;
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    handleScrollToTop();
    const targetPath = baseUrl.split("?")[0] || pathname;
    const queryString = createQueryString(1, newLimit);
    router.push(`${targetPath}?${queryString}`);
  };

  return (
    <div className="px-4 py-3 sm:px-6 sm:py-4 bg-surface border-t border-border-warm flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs font-mono select-none">
      {/* Items count summary */}
      <div className="text-ink-muted text-center sm:text-left">
        Showing <span className="font-bold text-ink">{startItem}</span>–
        <span className="font-bold text-ink">{endItem}</span> of{" "}
        <span className="font-bold text-ink">{totalItems}</span> items
      </div>

      {/* Right controls: Show Limit Dropdown + Pagination Buttons */}
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
        {/* "Show:" page size dropdown (to the left of Prev) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-ink-muted text-xs font-mono">Show:</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="admin-select h-7 pl-2 pr-6 rounded border border-border-warm bg-watermark-surface text-ink text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
          >
            {[5, 10, 15, 25].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination Navigation */}
        <div className="flex items-center space-x-1 shrink-0">
          {/* Previous Page Button */}
          {currentPage > 1 ? (
            <Link
              href={getHref(currentPage - 1)}
              scroll={false}
              onClick={handleScrollToTop}
              className="h-7 px-2.5 rounded border border-border-warm bg-paper text-ink hover:text-primary hover:border-primary transition-colors inline-flex items-center justify-center gap-1 font-mono text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </Link>
          ) : (
            <span className="h-7 px-2.5 rounded border border-border-subtle bg-black/5 text-ink-muted cursor-not-allowed inline-flex items-center justify-center gap-1 opacity-50 font-mono text-xs">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </span>
          )}

          {/* Page Numbers */}
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`dots-${idx}`}
                  className="h-7 px-1.5 inline-flex items-center justify-center text-ink-muted select-none font-mono text-xs"
                >
                  ...
                </span>
              );
            }

            const isCurrent = p === currentPage;

            return isCurrent ? (
              <span
                key={`page-${p}`}
                className="h-7 min-w-[28px] px-2.5 rounded bg-primary text-white font-bold inline-flex items-center justify-center font-mono text-xs"
              >
                {p}
              </span>
            ) : (
              <Link
                key={`page-${p}`}
                href={getHref(Number(p))}
                scroll={false}
                onClick={handleScrollToTop}
                className="h-7 min-w-[28px] px-2.5 rounded border border-border-warm bg-paper text-ink hover:text-primary hover:border-primary transition-colors inline-flex items-center justify-center font-mono text-xs"
              >
                {p}
              </Link>
            );
          })}

          {/* Next Page Button */}
          {currentPage < totalPages ? (
            <Link
              href={getHref(currentPage + 1)}
              scroll={false}
              onClick={handleScrollToTop}
              className="h-7 px-2.5 rounded border border-border-warm bg-paper text-ink hover:text-primary hover:border-primary transition-colors inline-flex items-center justify-center gap-1 font-mono text-xs"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="h-7 px-2.5 rounded border border-border-subtle bg-black/5 text-ink-muted cursor-not-allowed inline-flex items-center justify-center gap-1 opacity-50 font-mono text-xs">
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
