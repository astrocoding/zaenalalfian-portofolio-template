"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export interface AdminFormHeaderProps {
  backHref: string;
  backLabel?: string;
  title: string;
  subtitle?: string;
  status?: "draft" | "published" | "archived" | string;
  loading?: boolean;
  onSaveDraft?: (e?: React.MouseEvent) => void;
  onPublish?: (e?: React.MouseEvent) => void;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  showSaveDraft?: boolean;
}

export const AdminFormHeader: React.FC<AdminFormHeaderProps> = ({
  backHref,
  backLabel = "Back to list",
  title,
  subtitle,
  status,
  loading = false,
  onSaveDraft,
  onPublish,
  primaryActionLabel = "Publish",
  secondaryActionLabel = "Save Draft",
  showSaveDraft = true,
}) => {
  return (
    <div className="fixed top-[63px] lg:top-0 left-0 right-0 lg:left-64 z-30 w-auto px-4 sm:px-6 h-[63px] bg-surface border-b border-border-warm flex items-center justify-between gap-3 shrink-0">
      {/* Left: Small Back Icon Button + Short Title & Subtitle */}
      <div className="flex items-center space-x-3 min-w-0">
        <Link
          href={backHref}
          className="p-2 rounded-lg bg-watermark-surface border border-border-warm text-ink hover:text-primary hover:border-primary/50 transition-colors shrink-0 flex items-center justify-center"
          title={backLabel}
          aria-label={backLabel}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center space-x-2.5 min-w-0">
          <h1 className="hidden sm:block text-base sm:text-lg font-serif font-bold text-ink truncate shrink-0">
            {title}
          </h1>

          {subtitle && (
            <span className="text-xs font-mono text-ink-muted truncate hidden sm:inline-block border-l border-border-subtle pl-2.5 max-w-[160px] md:max-w-[320px] lg:max-w-[500px]">
              {subtitle}
            </span>
          )}

          {status && (
            <Badge
              variant={status === "published" ? "default" : status === "draft" ? "accent" : "outline"}
              size="sm"
              className="capitalize hidden md:inline-flex shrink-0"
            >
              {status}
            </Badge>
          )}
        </div>
      </div>

      {/* Right: Dynamic Action Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {showSaveDraft && onSaveDraft && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={onSaveDraft}
            className="text-xs px-3 py-1.5"
          >
            {secondaryActionLabel}
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={loading}
          onClick={onPublish}
          icon={loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          className="text-xs px-3.5 py-1.5"
        >
          {loading ? "Saving..." : primaryActionLabel}
        </Button>
      </div>
    </div>
  );
};
