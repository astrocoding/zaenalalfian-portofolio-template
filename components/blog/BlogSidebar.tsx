"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Check,
  Share2,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface BlogSidebarProps {
  title: string;
  keywords: string[];
  slug?: string;
  category?: string;
}

export const BlogSidebar: React.FC<BlogSidebarProps> = ({
  title,
  keywords,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = (platform: string) => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title);

    let targetUrl = "";
    if (platform === "linkedin") {
      targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    } else if (platform === "facebook") {
      targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    } else if (platform === "whatsapp") {
      targetUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
    } else if (platform === "twitter") {
      targetUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    }

    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyLink = () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareButtons = [
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: (
        <svg
          className="w-4 h-4 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 0 0-1.6 1.6c0 .88.71 1.6 1.6 1.6.88 0 1.6-.72 1.6-1.6 0-.88-.72-1.6-1.6-1.6Z" />
        </svg>
      ),
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: (
        <svg
          className="w-4 h-4 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.81c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.89h-2.33v6.99C18.34 21.12 22 16.99 22 12z" />
        </svg>
      ),
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: (
        <svg
          className="w-4 h-4 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.276.44-1.156 4.225 4.316-1.132.307.134z" />
        </svg>
      ),
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      icon: (
        <svg
          className="w-4 h-4 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Share Section */}
      <div className="space-y-3.5 pb-6 border-b border-border-warm">
        <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-ink flex items-center gap-2">
          <Share2 className="w-4 h-4 text-primary" />
          <span>Share Article</span>
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {shareButtons.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleShare(item.id)}
              className="p-2.5 rounded-xl border border-border-warm bg-surface text-ink hover:border-primary/60 hover:text-primary hover:bg-paper transition-all shadow-2xs cursor-pointer"
              title={`Share on ${item.name}`}
            >
              {item.icon}
            </button>
          ))}
          {/* Instagram Share / Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-2.5 rounded-xl border border-border-warm bg-surface text-ink hover:border-primary/60 hover:text-primary hover:bg-paper transition-all shadow-2xs relative cursor-pointer"
            title="Copy Link for Instagram / Social Media"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            )}
          </button>
        </div>
        {copied && (
          <p className="text-[11px] font-mono text-emerald-600 font-medium animate-fade-in">
            Article link copied to clipboard!
          </p>
        )}
      </div>

      {/* 2. SEO Keywords Badges Section */}
      {keywords && keywords.length > 0 && (
        <div className="space-y-3.5">
          <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-ink flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <span>Topics & Keywords</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, idx) => (
              <Badge key={`${kw}-${idx}`} variant="default" size="md">
                #{kw}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 3. CTA Project Card Component */}
      <div className="bg-surface border border-border-warm rounded-2xl p-6 sm:p-7 hover:shadow-sm transition-all relative overflow-hidden group">
        {/* Header Kanji Decorator & Icon */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <span className="font-serif font-bold text-xl text-primary tracking-wide">
            作品
          </span>
          <div className="bg-watermark-surface border border-border-subtle rounded-xl p-2 text-primary">
            <Code2 className="w-5 h-5" />
          </div>
        </div>

        {/* Title */}
        <h4 className="font-serif font-bold text-xl sm:text-2xl text-primary mt-4 mb-2.5 leading-tight">
          Let&apos;s Build Something Great!
        </h4>

        {/* Description */}
        <p className="text-ink-muted text-xs sm:text-sm leading-relaxed mb-6 font-sans">
          Looking for high-performance web development, scalable full-stack
          architecture, or custom software solutions? Let&apos;s turn your vision into reality.
        </p>

        {/* CTA Link Button to /projects */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-mono font-semibold hover:bg-primary/90 transition-all shadow-sm group-hover:translate-x-0.5"
        >
          <span>My Projects</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
