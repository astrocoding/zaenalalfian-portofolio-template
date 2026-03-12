"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, AlertCircle } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { createProjectAction, updateProjectAction } from "@/app/actions/admin";

export interface ProjectFormProps {
  initialData?: any;
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const techArray = formData.techstack
      .split(",")
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    const payload = {
      ...formData,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-surface border border-border-warm rounded-xl p-6 sm:p-8 shadow-card">
      {error && (
        <div className="p-3.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Title / タイトル *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Zenith Architecture Platform"
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
            placeholder="e.g. zenith-architecture-platform"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Category / カテゴリ *</label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g. Full-Stack Web App"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Tech Stack (comma separated) *</label>
          <input
            type="text"
            required
            value={formData.techstack}
            onChange={(e) => setFormData({ ...formData, techstack: e.target.value })}
            placeholder="Next.js 16, React 19, TypeScript, PostgreSQL"
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
          placeholder="Brief summary of the project architecture and features..."
          className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>

      {/* Main Project Card Thumbnail Uploader (1 Image WebP) */}
      <div className="pt-2 pb-2 border-t border-border-subtle">
        <ImageUploader
          label="Main Project Card Thumbnail (Public Home Page)"
          sublabel="/ サムネイル画像 (WebP)"
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

      {/* Drag & Drop Multi-Image Showcase Uploader (Max 3 Images WebP) */}
      <div className="pt-2 pb-2 border-y border-border-subtle">
        <ImageUploader
          label="Showcase Carousel Images (Max 3)"
          sublabel="/ 実績詳細カルーセル (WebP)"
          value={formData.images}
          onChange={(newUrls) => setFormData({ ...formData, images: newUrls })}
          maxFiles={3}
        />
      </div>

      {/* Case Study Details Grid */}
      <div className="space-y-4 pt-2">
        <h4 className="font-serif font-bold text-sm text-ink uppercase">Case Study Details / ケーススタディ詳細</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Problem Statement / 課題</label>
            <textarea
              rows={3}
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              placeholder="What technical problem did this project solve?"
              className="w-full px-3.5 py-2 rounded-md border border-border-warm bg-paper text-ink text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Solution Architecture / 解決策</label>
            <textarea
              rows={3}
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              placeholder="What software architecture was implemented?"
              className="w-full px-3.5 py-2 rounded-md border border-border-warm bg-paper text-ink text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">System Architecture</label>
            <textarea
              rows={2}
              value={formData.architecture}
              onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
              placeholder="System details..."
              className="w-full px-3.5 py-2 rounded-md border border-border-warm bg-paper text-ink text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Key Challenge</label>
            <textarea
              rows={2}
              value={formData.challenge}
              onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
              placeholder="Main obstacle faced..."
              className="w-full px-3.5 py-2 rounded-md border border-border-warm bg-paper text-ink text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">Result / Outcome</label>
            <textarea
              rows={2}
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              placeholder="Metrics & speedups achieved..."
              className="w-full px-3.5 py-2 rounded-md border border-border-warm bg-paper text-ink text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Repository URL</label>
          <input
            type="text"
            value={formData.repository}
            onChange={(e) => setFormData({ ...formData, repository: e.target.value })}
            placeholder="https://github.com/username/repo"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Live Demo URL</label>
          <input
            type="text"
            value={formData.sourceLink}
            onChange={(e) => setFormData({ ...formData, sourceLink: e.target.value })}
            placeholder="https://app.domain.com"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => router.push("/admin/projects")}
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
          {loading ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
};
