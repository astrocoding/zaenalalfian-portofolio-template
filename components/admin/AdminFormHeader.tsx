"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, Search, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useSidebar } from "@/components/admin/SidebarContext";

export interface AdminFormHeaderProps {
  backHref: string;
  backLabel?: string;
  title?: string;
  status?: "draft" | "published" | "archived" | string;
  showBadge?: boolean;
  loading?: boolean;
  onSaveDraft?: (e?: React.MouseEvent) => void;
  onPublish?: (e?: React.MouseEvent) => void;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  primaryActionIcon?: React.ReactNode;
  secondaryActionLabel?: string;
  showSaveDraft?: boolean;
  customActions?: React.ReactNode;

  // Search functionality
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchParamName?: string;
}

function getStatusBadgeVariant(status?: string) {
  switch (status) {
    case "published":
      return "status-published" as const;
    case "archived":
      return "status-archived" as const;
    case "draft":
    default:
      return "status-draft" as const;
  }
}

function getStatusLabel(status?: string) {
  switch (status) {
    case "published": return "Published";
    case "archived": return "Archived";
    case "draft":
    default:
      return "Draft";
  }
}

function getShortActionLabel(label?: string) {
  if (!label) return "Save";
  if (label.toLowerCase().includes("publish")) return "Publish";
  if (label.toLowerCase().includes("update")) return "Update";
  if (label.toLowerCase().includes("create")) return "Create";
  return label.split(" ")[0] || label;
}

export const AdminFormHeader: React.FC<AdminFormHeaderProps> = ({
  backHref,
  backLabel = "Back to list",
  title,
  status,
  showBadge = status !== undefined,
  loading = false,
  onSaveDraft,
  onPublish,
  primaryActionLabel = "Publish",
  primaryActionHref,
  primaryActionIcon,
  secondaryActionLabel = "Save Draft",
  showSaveDraft = true,
  customActions,
  showSearch = false,
  searchPlaceholder = "Search...",
  searchParamName = "q",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isCollapsed } = useSidebar();

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const currentParam = searchParams?.get(searchParamName) || "";
  const [searchTerm, setSearchTerm] = React.useState(currentParam);
  const [prevParam, setPrevParam] = React.useState(currentParam);

  if (currentParam !== prevParam) {
    setPrevParam(currentParam);
    setSearchTerm(currentParam);
  }

  // ⌘K Keyboard Shortcut handler
  React.useEffect(() => {
    if (!showSearch) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSearch]);

  // Debounced search execution (300ms)
  React.useEffect(() => {
    if (!showSearch) return;

    const timer = setTimeout(() => {
      const currentParam = searchParams?.get(searchParamName) || "";
      if (searchTerm.trim() !== currentParam.trim()) {
        const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
        if (searchTerm.trim()) {
          params.set(searchParamName, searchTerm.trim());
        } else {
          params.delete(searchParamName);
        }
        params.set("page", "1"); // Reset pagination on search
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, pathname, router, searchParamName, showSearch]);

  const badgeVariant = getStatusBadgeVariant(status);
  const badgeLabel = getStatusLabel(status);
  const shortPrimary = getShortActionLabel(primaryActionLabel);

  const renderActionButtons = () => {
    if (customActions) return customActions;

    return (
      <>
        {showSaveDraft && onSaveDraft && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={onSaveDraft}
            className="text-xs px-2.5 sm:px-3 py-1.5 font-medium shrink-0"
          >
            <span className="sm:hidden">Save</span>
            <span className="hidden sm:inline">{secondaryActionLabel}</span>
          </Button>
        )}

        {primaryActionHref ? (
          <Link href={primaryActionHref} className={showSearch ? "hidden lg:inline-block" : "inline-block"}>
            <Button
              variant="primary"
              size="sm"
              disabled={loading}
              icon={primaryActionIcon || (loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />)}
              className="text-xs px-3 sm:px-3.5 py-1.5 font-medium shrink-0"
            >
              <span className="sm:hidden">{shortPrimary}</span>
              <span className="hidden sm:inline">{primaryActionLabel}</span>
            </Button>
          </Link>
        ) : (
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={loading}
            onClick={onPublish}
            icon={primaryActionIcon || (loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />)}
            className="text-xs px-3 sm:px-3.5 py-1.5 font-medium shrink-0"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <span className="sm:hidden">{shortPrimary}</span>
                <span className="hidden sm:inline">{primaryActionLabel}</span>
              </>
            )}
          </Button>
        )}
      </>
    );
  };

  return (
    <>
      <div className={`fixed top-[63px] lg:top-0 left-0 right-0 z-40 px-3 sm:px-6 h-[63px] bg-surface border-b border-border-warm shadow-none flex items-center justify-between gap-2.5 sm:gap-3 shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? "lg:left-[72px]" : "lg:left-64"
      }`}>
        {/* Left Section: Back Button + Title + Status Badge */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <Link
            href={backHref}
            className="p-2 rounded-lg bg-watermark-surface border border-[#c8c5c2] text-ink hover:text-primary hover:border-primary/50 transition-colors shrink-0 flex items-center justify-center"
            title={backLabel}
            aria-label={backLabel}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {title && (
            <h1 className="hidden sm:block text-base font-serif font-bold text-ink truncate shrink-0">
              {title}
            </h1>
          )}

          {showBadge && (
            <Badge
              variant={badgeVariant}
              size="sm"
              className="capitalize shrink-0"
            >
              {badgeLabel}
            </Badge>
          )}
        </div>

        {/* Center/Right Section: Inline Search Bar */}
        {showSearch && (
          <div className="relative flex-1 sm:flex-initial sm:w-64 md:w-72 lg:w-80 min-w-0 sm:ml-auto">
            <div className="relative h-8 rounded-md bg-watermark-surface border border-[#c8c5c2] flex items-center px-2.5 sm:px-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all w-full">
              <Search className="w-3.5 h-3.5 text-ink-muted shrink-0 mr-1.5 sm:mr-2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="bg-transparent border-none outline-none text-xs text-ink placeholder:text-ink-muted/70 w-full pr-5 truncate"
              />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 text-ink-muted hover:text-ink transition-colors p-0.5 rounded-full hover:bg-black/5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-ink-muted bg-surface rounded border border-border-subtle shrink-0 absolute right-2 select-none">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>
        )}

        {/* Right Section: Action Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {renderActionButtons()}
        </div>
      </div>

      {/* Mobile & Tablet Floating Action Button (FAB) for list pages */}
      {showSearch && primaryActionHref && (
        <Link
          href={primaryActionHref}
          className="fixed bottom-6 right-6 z-40 lg:hidden w-14 h-14 rounded-2xl bg-primary text-white shadow-xl hover:bg-[#993b3d] active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-white/20"
          title={primaryActionLabel || "Create"}
          aria-label={primaryActionLabel || "Create"}
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </Link>
      )}
    </>
  );
};
