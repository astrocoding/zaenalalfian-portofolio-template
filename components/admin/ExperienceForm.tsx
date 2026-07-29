"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Save, AlertCircle } from "lucide-react";
import { createExperienceAction, updateExperienceAction } from "@/app/actions/admin";

export interface ExperienceData {
  id?: string;
  role?: string;
  company?: string;
  period?: string;
  isCurrent?: boolean;
  description?: string;
  accomplishments?: string[];
  skills?: string[];
  order?: number;
}

export interface ExperienceFormProps {
  initialData?: ExperienceData | null;
  isEdit?: boolean;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    role: initialData?.role || "",
    company: initialData?.company || "",
    period: initialData?.period || "2023 — Present",
    isCurrent: initialData?.isCurrent ?? true,
    description: initialData?.description || "",
    accomplishmentsText: initialData?.accomplishments ? initialData.accomplishments.join("\n") : "",
    skills: initialData?.skills ? initialData.skills.join(", ") : "Next.js, TypeScript, PostgreSQL",
    order: initialData?.order || 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const skillsArray = formData.skills
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    const accomplishmentsArray = formData.accomplishmentsText
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);

    const payload = {
      role: formData.role,
      company: formData.company,
      period: formData.period,
      isCurrent: formData.isCurrent,
      description: formData.description,
      accomplishments: accomplishmentsArray,
      skills: skillsArray,
      order: Number(formData.order) || 1,
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
    <form onSubmit={handleSubmit} className="space-y-5 w-full bg-surface border border-border-warm rounded-xl p-5 sm:p-6 shadow-card">
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            placeholder="e.g. Zenith Tech Labs"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Time Period / 期間 *</label>
          <input
            type="text"
            required
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            placeholder="2023 — Present"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Order Index / 順序</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
            placeholder="1"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex items-center pt-6 space-x-2">
          <input
            type="checkbox"
            id="isCurrent"
            checked={formData.isCurrent}
            onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
            className="w-4 h-4 rounded border-border-warm text-primary focus:ring-primary/50"
          />
          <label htmlFor="isCurrent" className="text-xs font-mono font-medium text-ink cursor-pointer">
            Current Position / 在職中
          </label>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-medium text-ink">Skills Used (comma separated) *</label>
          <span className="text-[10px] font-mono text-ink-muted">Badges preview</span>
        </div>
        <input
          type="text"
          required
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="Next.js, React, TypeScript, PostgreSQL, Docker"
          className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-medium text-ink">Role Overview / 職務概要 *</label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe main responsibilities, team scope, and general overview..."
          className="w-full px-4 py-3 rounded-md border border-border-warm bg-paper text-ink text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-medium text-ink">Key Accomplishments &amp; Responsibilities (1 bullet point per line / Enter per item)</label>
          <span className="text-[10px] font-mono text-ink-muted">Enter key achievements line by line</span>
        </div>
        <textarea
          rows={5}
          value={formData.accomplishmentsText}
          onChange={(e) => setFormData({ ...formData, accomplishmentsText: e.target.value })}
          placeholder={`Architected 3-tier enterprise ERP system using Node.js/Hapi, React, PostgreSQL & Redis (+150% performance speedup).\nDeveloped barcode-scanned employee attendance system integrated with payroll in Laravel (65% HR reconciliation time saved).\nLed end-to-end database modeling, Redis caching strategies, and REST API architectural standards.`}
          className="w-full px-4 py-3 rounded-md border border-border-warm bg-paper text-ink text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y font-sans"
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
