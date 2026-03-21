"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Save, AlertCircle } from "lucide-react";
import { createExperienceAction, updateExperienceAction } from "@/app/actions/admin";

export interface ExperienceFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    role: initialData?.role || "",
    company: initialData?.company || "",
    period: initialData?.period || "",
    isCurrent: initialData?.isCurrent ?? false,
    description: initialData?.description || "",
    skills: initialData?.skills ? initialData.skills.join(", ") : "Next.js 16, React 19, TypeScript, PostgreSQL",
    order: initialData?.order ?? 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const skillsArray = formData.skills
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    const payload = {
      ...formData,
      order: Number(formData.order) || 1,
      skills: skillsArray,
    };

    let res;
    if (isEdit && initialData?.id) {
      res = await updateExperienceAction(initialData.id, payload);
    } else {
      res = await createExperienceAction(payload);
    }

    setLoading(false);
    if (res.success) {
      router.push("/admin/experiences");
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
          <label className="text-xs font-mono font-medium text-ink">Job Title / 役職名 *</label>
          <input
            type="text"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g. Lead Full-Stack Architect"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Company / 会社名 *</label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. Apex Digital Systems"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-mono font-medium text-ink">Period / 期間 *</label>
          <input
            type="text"
            required
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            placeholder="e.g. 2024 — Present"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Order Index / 表示順序</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
            placeholder="1"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-1">
        <input
          type="checkbox"
          id="isCurrent"
          checked={formData.isCurrent}
          onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
          className="w-4 h-4 rounded border-border-warm text-primary focus:ring-primary/50"
        />
        <label htmlFor="isCurrent" className="text-xs font-mono text-ink font-medium cursor-pointer">
          Current Position / 現職 (Displays '現職' status badge)
        </label>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-medium text-ink">Key Technologies & Skills (comma separated)</label>
        <input
          type="text"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="Next.js 16, React 19, TypeScript, PostgreSQL, Prisma 7, TailwindCSS"
          className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-medium text-ink">Description & Accomplishments / 業務内容 *</label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe software engineering leadership, performance optimization outcomes, or architecture decisions..."
          className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
        />
      </div>

      <div className="pt-4 flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => router.push("/admin/experiences")}
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
          {loading ? "Saving..." : isEdit ? "Update Experience" : "Create Experience"}
        </Button>
      </div>
    </form>
  );
};
