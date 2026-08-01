"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createBlogAction, updateBlogAction } from "@/app/actions/admin";
import { slugify } from "@/lib/utils";
import { TiptapBlogEditor } from "./TiptapBlogEditor";
import { ImageUploader } from "./ImageUploader";
import { AdminFormHeader } from "./AdminFormHeader";
import { AlertBanner } from "@/components/ui/AlertBanner";

export interface BlogData {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  description?: string;
  content?: string;
  thumbnail?: string | null;
  keywords?: string[];
  status?: "draft" | "published" | "archived";
}

export interface BlogFormProps {
  initialData?: BlogData | null;
  isEdit?: boolean;
}

export const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "architecture",
    description: initialData?.description || "",
    content:
      initialData?.content ||
      "# Article Title\n\nWrite article content here...",
    thumbnail: initialData?.thumbnail || "",
    keywords: initialData?.keywords
      ? initialData.keywords.join(", ")
      : "Next.js, Architecture",
    status: (initialData?.status || "draft") as
      "draft" | "published" | "archived",
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugify(val),
    }));
  };

  const submitWithStatus = async (
    statusOverride?: "draft" | "published" | "archived",
  ) => {
    setLoading(true);
    setError(null);

    const targetStatus = statusOverride || formData.status;

    const keywordsArray = formData.keywords
      .split(",")
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 0);

    const payload = {
      ...formData,
      status: targetStatus,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitWithStatus();
  };

  const handleSaveDraft = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setFormData((prev) => ({ ...prev, status: "draft" }));
    submitWithStatus("draft");
  };

  const handlePublish = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setFormData((prev) => ({ ...prev, status: "published" }));
    submitWithStatus("published");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <AdminFormHeader
        backHref="/admin/blogs"
        backLabel="Back to Articles Management"
        title={isEdit ? "Edit Article" : "New Article"}
        status={formData.status}
        loading={loading}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        primaryActionLabel={isEdit ? "Update Article" : "Publish Article"}
        secondaryActionLabel="Save Draft"
      />

      <div className="pt-[77px] lg:pt-[87px] px-4 sm:px-6 lg:px-6 pb-4 sm:pb-6 lg:pb-6">
        <div className="space-y-5 bg-surface border border-border-warm rounded-xl p-5 sm:p-6 shadow-card">
          <AlertBanner
            variant="error"
            message={error}
            onClose={() => setError(null)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">
              Title / <span className="text-primary">タイトル *</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. Mastering Next.js 16 App Router"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-ink">
                Category / <span className="text-primary">カテゴリ *</span>
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="architecture, design, or performance"
                className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-ink">
                SEO Keywords (comma separated)
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) =>
                  setFormData({ ...formData, keywords: e.target.value })
                }
                placeholder="Next.js 16, Prisma 7, PostgreSQL"
                className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">
              Description / <span className="text-primary">概要 *</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Short summary for search results & cards..."
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <ImageUploader
              value={formData.thumbnail ? [formData.thumbnail] : []}
              onChange={(newUrls) =>
                setFormData((prev) => ({
                  ...prev,
                  thumbnail: newUrls[0] || "",
                }))
              }
              maxFiles={1}
              label="Article Cover / Thumbnail Image / サムネイル"
              sublabel="Saved to /public/upload/img as WebP format"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">
              Markdown / MDX Content /{" "}
              <span className="text-primary">本文 *</span>
            </label>
            <TiptapBlogEditor
              content={formData.content}
              onChange={(newContent) =>
                setFormData((prev) => ({ ...prev, content: newContent }))
              }
            />
          </div>
        </div>
      </div>
    </form>
  );
};
