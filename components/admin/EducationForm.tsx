"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Save, AlertCircle } from "lucide-react";
import { createEducationAction, updateEducationAction } from "@/app/actions/admin";

export interface EducationData {
  id?: string;
  title?: string;
  organization?: string;
  location?: string;
  period?: string;
  statusBadge?: string | null;
  grades?: string | null;
  educationLevel?: string | null;
  description?: string;
  highlights?: string[];
  courses?: string[];
  order?: number;
}

export interface EducationFormProps {
  initialData?: EducationData | null;
  isEdit?: boolean;
}

export const EducationForm: React.FC<EducationFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    title: initialData?.title || "",
    organization: initialData?.organization || "",
    location: initialData?.location || "",
    period: initialData?.period || "2020 — 2024",
    statusBadge: initialData?.statusBadge || "卒業 • Graduated",
    grades: initialData?.grades || "GPA 3.85 / 4.00",
    educationLevel: initialData?.educationLevel || "Bachelor Degree",
    description: initialData?.description || "",
    highlightsText: initialData?.highlights ? initialData.highlights.join("\n") : "",
    coursesText: initialData?.courses ? initialData.courses.join(", ") : "",
    order: initialData?.order || 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Parse highlights newline-separated text into array
    const highlightsArray = formData.highlightsText
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);

    // Parse courses comma-separated text into array
    const coursesArray = formData.coursesText
      .split(",")
      .map((c: string) => c.trim())
      .filter((c: string) => c.length > 0);

    const payload = {
      title: formData.title,
      organization: formData.organization,
      location: formData.location,
      period: formData.period,
      statusBadge: formData.statusBadge || undefined,
      grades: formData.grades || undefined,
      educationLevel: formData.educationLevel || undefined,
      description: formData.description,
      highlights: highlightsArray,
      courses: coursesArray,
      order: Number(formData.order) || 1,
    };

    let res;
    if (isEdit && initialData?.id) {
      res = await updateEducationAction(initialData.id, payload);
    } else {
      res = await createEducationAction(payload);
    }

    setLoading(false);
    if (res.success) {
      router.push("/admin/education");
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
          <label className="text-xs font-mono font-medium text-ink">Degree / Degree Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Bachelor of Computer Science (S.Kom.)"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Institution / University *</label>
          <input
            type="text"
            required
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            placeholder="e.g. University / Higher Education Institute"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Location / 所在地 *</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Indonesia or Karawang, Indonesia"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Time Period / 期間 *</label>
          <input
            type="text"
            required
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            placeholder="e.g. 2020 — 2024"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Education Level / 区分</label>
          <input
            type="text"
            value={formData.educationLevel}
            onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
            placeholder="e.g. Bachelor Degree or Vocational High School"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Status Badge / ステータス</label>
          <input
            type="text"
            value={formData.statusBadge}
            onChange={(e) => setFormData({ ...formData, statusBadge: e.target.value })}
            placeholder="e.g. 卒業 • Graduated"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">GPA / Grades / 成績</label>
          <input
            type="text"
            value={formData.grades}
            onChange={(e) => setFormData({ ...formData, grades: e.target.value })}
            placeholder="e.g. GPA 3.85 / 4.00 or Rank 3 / 120"
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
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-medium text-ink">Overview &amp; Academic Focus / 学歴概要 *</label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe specialization, academic honors, thesis research..."
          className="w-full px-4 py-3 rounded-md border border-border-warm bg-paper text-ink text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-medium text-ink">Academic Highlights (1 bullet point per line / Enter per item)</label>
          <span className="text-[10px] font-mono text-ink-muted">Enter key achievements line by line</span>
        </div>
        <textarea
          rows={5}
          value={formData.highlightsText}
          onChange={(e) => setFormData({ ...formData, highlightsText: e.target.value })}
          placeholder={`Graduated with Academic Distinction (Cum Laude)\nPublished Capstone Project on High-Performance Web System Architecture\nActive Leader in Computer Science & Software Engineering Student Guild`}
          className="w-full px-4 py-3 rounded-md border border-border-warm bg-paper text-ink text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y font-sans"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-medium text-ink">Key Coursework &amp; Competencies (comma separated)</label>
          <span className="text-[10px] font-mono text-ink-muted">Badges preview</span>
        </div>
        <input
          type="text"
          value={formData.coursesText}
          onChange={(e) => setFormData({ ...formData, coursesText: e.target.value })}
          placeholder="Software Engineering, Database Systems & Design, Web Technologies, Data Structures & Algorithms"
          className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="pt-4 flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => router.push("/admin/education")}
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
          {loading ? "Saving..." : isEdit ? "Update Education" : "Create Education"}
        </Button>
      </div>
    </form>
  );
};
