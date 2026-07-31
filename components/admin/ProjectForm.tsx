"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { AdminFormHeader } from "./AdminFormHeader";
import { createProjectAction, updateProjectAction } from "@/app/actions/admin";
import { slugify } from "@/lib/utils";

export interface ProjectData {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  description?: string;
  thumbnail?: string | null;
  images?: string[];
  techstack?: string[];
  problem?: string | null;
  solution?: string | null;
  architecture?: string | null;
  challenge?: string | null;
  result?: string | null;
  repository?: string | null;
  sourceLink?: string | null;
  priorityOrder?: number;
  status?: "draft" | "published" | "archived";
}

export interface ProjectFormProps {
  initialData?: ProjectData | null;
  isEdit?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "Full-Stack Web App",
    description: initialData?.description || "",
    thumbnail: initialData?.thumbnail && initialData.thumbnail !== "/projects/preview.jpg" ? initialData.thumbnail : "",
    images: initialData?.images || [],
    techstack: initialData?.techstack ? initialData.techstack.join(", ") : "Next.js 16, React 19, TypeScript",
    problem: initialData?.problem || "",
    solution: initialData?.solution || "",
    architecture: initialData?.architecture || "",
    challenge: initialData?.challenge || "",
    result: initialData?.result || "",
    repository: initialData?.repository || "",
    sourceLink: initialData?.sourceLink || "",
    priorityOrder: initialData?.priorityOrder ?? 1,
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

  const submitWithStatus = async (overrideStatus?: "draft" | "published" | "archived") => {
    setLoading(true);
    setError(null);

    const targetStatus = overrideStatus || formData.status;

    const techArray = formData.techstack
      .split(",")
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    const payload = {
      ...formData,
      status: targetStatus,
      priorityOrder: Number(formData.priorityOrder) || 1,
      techstack: techArray,
    };

    let res;
    if (isEdit && initialData?.id) {
      res = await updateProjectAction(initialData.id, payload);
    } else {
      res = await createProjectAction(payload);
    }

    setLoading(false);
    if (res.success) {
      router.push("/admin/projects");
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
    const nextStatus = formData.status === "draft" ? "published" : formData.status;
    setFormData((prev) => ({ ...prev, status: nextStatus }));
    submitWithStatus(nextStatus);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <AdminFormHeader
        backHref="/admin/projects"
        backLabel="Back to Projects Management"
        title={isEdit ? "Edit Project" : "New Project"}
        subtitle={isEdit ? formData.title || initialData?.title : "Add to Portfolio"}
        status={formData.status}
        loading={loading}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        primaryActionLabel={isEdit ? "Update Project" : "Publish Project"}
        secondaryActionLabel="Save Draft"
      />

      <div className="pt-[87px] px-4 sm:px-6 lg:px-6 pb-4 sm:pb-6 lg:pb-6">
        <div className="space-y-5 bg-surface border border-border-warm rounded-xl p-5 sm:p-6 shadow-card">
          {error && (
            <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

      {/* Title & Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Title / タイトル *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="e.g. Zenith Architecture Platform"
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

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Category / カテゴリ *</label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g. Full-Stack Web App"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Techstack, Publication Status & Priority Order Grid (Asymmetric Widths) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="space-y-1.5 md:col-span-6">
          <label className="text-xs font-mono font-medium text-ink">Tech Stack (comma separated) *</label>
          <input
            type="text"
            required
            value={formData.techstack}
            onChange={(e) => setFormData({ ...formData, techstack: e.target.value })}
            placeholder="Next.js 16, React 19, TypeScript, PostgreSQL"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5 md:col-span-3">
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

        <div className="space-y-1.5 md:col-span-3">
          <label className="text-xs font-mono font-medium text-ink">Priority Order / 優先順位 *</label>
          <input
            type="number"
            required
            min={1}
            value={formData.priorityOrder}
            onChange={(e) => setFormData({ ...formData, priorityOrder: Number(e.target.value) })}
            placeholder="1"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-medium text-ink">Description / 概要 *</label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief summary of the project architecture and features..."
          className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>

      {/* Repository URL & Live Demo URL Grid (Below Description) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Repository URL</label>
          <input
            type="text"
            value={formData.repository}
            onChange={(e) => setFormData({ ...formData, repository: e.target.value })}
            placeholder="https://github.com/username/repo"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-xs placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Live Demo URL</label>
          <input
            type="text"
            value={formData.sourceLink}
            onChange={(e) => setFormData({ ...formData, sourceLink: e.target.value })}
            placeholder="https://app.domain.com"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-xs placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Side-by-Side Image Uploaders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
        <div className="lg:col-span-4 bg-watermark-surface/40 p-4 sm:p-5 rounded-xl border border-border-subtle flex flex-col justify-between">
          <ImageUploader
            label="Main Thumbnail"
            sublabel="/ サムネイル (WebP)"
            value={formData.thumbnail ? [formData.thumbnail] : []}
            onChange={(newUrls) =>
              setFormData({
                ...formData,
                thumbnail: newUrls[0] || "",
              })
            }
            maxFiles={1}
          />
        </div>

        <div className="lg:col-span-8 bg-watermark-surface/40 p-4 sm:p-5 rounded-xl border border-border-subtle flex flex-col justify-between">
          <ImageUploader
            label="Showcase Carousel Images (Max 3)"
            sublabel="/ 実績詳細カルーセル (WebP)"
            value={formData.images}
            onChange={(newUrls) => setFormData({ ...formData, images: newUrls })}
            maxFiles={3}
          />
        </div>
      </div>

      {/* Case Study Details Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
          <h4 className="font-serif font-bold text-sm text-ink uppercase">Case Study Details / ケーススタディ詳細</h4>
          <span className="text-[10px] font-mono text-ink-muted">Enter 1 bullet point per line / Enter per item</span>
        </div>

        {/* Row 1: Problem Statement & Solution Architecture (2 Cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-medium text-ink">Problem Statement / 課題 (1 bullet point per line)</label>
              <span className="text-[10px] font-mono text-ink-muted">Enter per item</span>
            </div>
            <textarea
              rows={4}
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              placeholder={`Legacy monolithic code caused slow response times\nHigh database lock contention during peak operations\nManual reconciliation delays across partner networks`}
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-xs leading-relaxed placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-medium text-ink">Solution Architecture / 解決策 (1 bullet point per line)</label>
              <span className="text-[10px] font-mono text-ink-muted">Enter per item</span>
            </div>
            <textarea
              rows={4}
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              placeholder={`Architected decoupled 3-tier REST API services\nImplemented Redis caching reducing database reads by 70%\nAdopted Next.js 16 App Router & Server Actions`}
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-xs leading-relaxed placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y font-sans"
            />
          </div>
        </div>

        {/* Row 2: System Architecture & Key Challenge (2 Cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-medium text-ink">System Architecture (1 bullet per line)</label>
            </div>
            <textarea
              rows={4}
              value={formData.architecture}
              onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
              placeholder={`Node.js API Gateway & Hapi microservices\nPostgreSQL database cluster with indexed tables\nRedis caching layer & Edge CDN distribution`}
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-xs leading-relaxed placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-medium text-ink">Key Challenge (1 bullet per line)</label>
            </div>
            <textarea
              rows={4}
              value={formData.challenge}
              onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
              placeholder={`Optimizing multi-table SQL join queries\nDesigning real-time cache invalidation strategies\nManaging multi-role permissions securely`}
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-xs leading-relaxed placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y font-sans"
            />
          </div>
        </div>

        {/* Row 3: Result / Outcome (Below Architecture & Challenge) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-medium text-ink">Result / Outcome (1 bullet per line)</label>
            <span className="text-[10px] font-mono text-ink-muted">Enter per item</span>
          </div>
          <textarea
            rows={4}
            value={formData.result}
            onChange={(e) => setFormData({ ...formData, result: e.target.value })}
            placeholder={`Achieved 150% throughput improvement\nSub-100ms response time across primary endpoints\nStreamlined tracking across 500+ vocational students`}
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-xs leading-relaxed placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y font-sans"
          />
        </div>
      </div>
      </div>
      </div>
    </form>
  );
};
