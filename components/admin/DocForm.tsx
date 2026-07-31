"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Save, AlertCircle } from "lucide-react";
import { createDocAction, updateDocAction } from "@/app/actions/admin";
import { slugify } from "@/lib/utils";
import { TiptapBlogEditor } from "./TiptapBlogEditor";

export interface DocData {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  description?: string;
  content?: string;
  order?: number;
  status?: "draft" | "published" | "archived";
}

export interface DocFormProps {
  initialData?: DocData | null;
  isEdit?: boolean;
}

export const DocForm: React.FC<DocFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "architecture",
    description: initialData?.description || "",
    content: initialData?.content || "# Documentation Guide Title\n\nWrite guide content here...",
    order: initialData?.order || 1,
    status: (initialData?.status || "published") as "draft" | "published" | "archived",
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugify(val),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      order: Number(formData.order) || 1,
    };

    let res;
    if (isEdit && initialData?.id) {
      res = await updateDocAction(initialData.id, payload);
    } else {
      res = await createDocAction(payload);
    }

    setLoading(false);
    if (res.success) {
      router.push("/admin/docs");
      router.refresh();
    } else {
      setError(res.error || "Operation failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full bg-surface border border-border-warm rounded-xl p-5 sm:p-6 shadow-card">
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-medium text-ink">Guide Title / タイトル *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={handleTitleChange}
          placeholder="e.g. System Architecture & Design Specification"
          className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {formData.slug && (
          <div className="flex items-center gap-2 mt-2 text-[11px] font-mono w-full min-w-0">
            <span className="text-primary font-medium whitespace-nowrap shrink-0">
              Auto Slug:
            </span>
            <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none py-0.5">
              <code className="inline-block px-2 py-0.5 rounded bg-surface border border-border-subtle text-ink font-semibold whitespace-nowrap">
                {formData.slug}
              </code>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Category / カテゴリ *</label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="architecture, design-system, or backend"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Order Index / 順序</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
            placeholder="1"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Publication Status / ステータス *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" | "archived" })}
            className="admin-select w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-medium text-ink">Description / 概要 *</label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the documentation guide..."
          className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-medium text-ink">Markdown / MDX Content / 本文 *</label>
        <TiptapBlogEditor
          content={formData.content}
          onChange={(newContent) =>
            setFormData((prev) => ({ ...prev, content: newContent }))
          }
        />
      </div>

      <div className="pt-4 flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => router.push("/admin/docs")}
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
          {loading ? "Saving..." : isEdit ? "Update Guide" : "Create Guide"}
        </Button>
      </div>
    </form>
  );
};
