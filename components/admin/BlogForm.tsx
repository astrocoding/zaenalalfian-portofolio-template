"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Save, AlertCircle } from "lucide-react";
import { createBlogAction, updateBlogAction } from "@/app/actions/admin";

export interface BlogData {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  description?: string;
  content?: string;
  thumbnail?: string | null;
  keywords?: string[];
}

export interface BlogFormProps {
  initialData?: BlogData | null;
  isEdit?: boolean;
}

export const BlogForm: React.FC<BlogFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "architecture",
    description: initialData?.description || "",
    content: initialData?.content || "# Article Title\n\nWrite article content here...",
    keywords: initialData?.keywords ? initialData.keywords.join(", ") : "Next.js, Architecture",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const keywordsArray = formData.keywords
      .split(",")
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 0);

    const payload = {
      ...formData,
      keywords: keywordsArray,
    };

    let res;
    if (isEdit && initialData?.id) {
      res = await updateBlogAction(initialData.id, payload);
    } else {
      res = await createBlogAction(payload);
    }

    setLoading(false);
    if (res.success) {
      router.push("/admin/blogs");
      router.refresh();
    } else {
      setError(res.error || "Operation failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full bg-surface border border-border-warm rounded-xl p-6 sm:p-8 md:p-10 shadow-card">
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Title / タイトル *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Mastering Next.js 16 App Router"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Slug / スラッグ *</label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="e.g. mastering-nextjs-16-app-router"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Category / カテゴリ *</label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="architecture, design, or performance"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">SEO Keywords (comma separated)</label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            placeholder="Next.js 16, Prisma 7, PostgreSQL"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-medium text-ink">Description / 概要 *</label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Short summary for search results & cards..."
          className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-medium text-ink">Markdown / MDX Content / 本文 *</label>
        <textarea
          required
          rows={16}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Write article content in Markdown format..."
          className="w-full px-4 py-3 rounded-md border border-border-warm bg-paper text-ink font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
        />
      </div>

      <div className="pt-4 flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => router.push("/admin/blogs")}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={loading}
          icon={<Save className="w-4 h-4" />}
        >
          {loading ? "Saving..." : isEdit ? "Update Article" : "Create Article"}
        </Button>
      </div>
    </form>
  );
};
