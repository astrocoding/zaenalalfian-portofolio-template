"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Save, AlertCircle } from "lucide-react";
import { createSkillsetAction, updateSkillsetAction } from "@/app/actions/admin";

export interface SkillsetData {
  id?: string;
  skillName?: string;
  category?: string;
  categoryOrder?: number;
  link?: string | null;
  description?: string | null;
}

export interface SkillsetFormProps {
  initialData?: SkillsetData | null;
  isEdit?: boolean;
}

const DEFAULT_CATEGORIES = [
  { name: "Frontend Engineering", order: 1 },
  { name: "Backend & Database", order: 2 },
  { name: "Architecture & DevOps", order: 3 },
  { name: "Tools & Methodologies", order: 4 },
];

export const SkillsetForm: React.FC<SkillsetFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    skillName: initialData?.skillName || "",
    category: initialData?.category || "Frontend Engineering",
    categoryOrder: initialData?.categoryOrder || 1,
    link: initialData?.link || "",
    description: initialData?.description || "",
  });

  const handleCategoryChange = (val: string) => {
    const found = DEFAULT_CATEGORIES.find((c) => c.name === val);
    setFormData((prev) => ({
      ...prev,
      category: val,
      categoryOrder: found ? found.order : prev.categoryOrder,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      skillName: formData.skillName.trim(),
      category: formData.category.trim(),
      categoryOrder: Number(formData.categoryOrder) || 1,
      link: formData.link.trim() || undefined,
      description: formData.description.trim() || undefined,
    };

    let res;
    if (isEdit && initialData?.id) {
      res = await updateSkillsetAction(initialData.id, payload);
    } else {
      res = await createSkillsetAction(payload);
    }

    setLoading(false);
    if (res.success) {
      router.push("/admin/skillsets");
      router.refresh();
    } else {
      setError(res.error || "Operation failed.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 w-full bg-surface border border-border-warm rounded-xl p-5 sm:p-6 shadow-card"
    >
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Skill / Tool Name *</label>
          <input
            type="text"
            required
            value={formData.skillName}
            onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
            placeholder="e.g. Next.js 16 (App Router)"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Category *</label>
          <div className="space-y-2">
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} (Card #{c.order})
                </option>
              ))}
              <option value="Custom">Custom Category...</option>
            </select>

            {formData.category === "Custom" && (
              <input
                type="text"
                required
                placeholder="Type custom category name..."
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Card Order Index (category_order) *</label>
          <input
            type="number"
            required
            min={1}
            value={formData.categoryOrder}
            onChange={(e) => setFormData({ ...formData, categoryOrder: Number(e.target.value) })}
            placeholder="1, 2, 3, etc."
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <span className="text-[11px] font-mono text-ink-muted block">
            Used to determine card sequence on landing page (1: Frontend, 2: Backend, 3: Architecture, 4: Tools).
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-ink">Reference Link (optional)</label>
          <input
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://nextjs.org"
            className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-medium text-ink">Description (optional)</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description or usage notes..."
          className="w-full px-4 py-3 rounded-md border border-border-warm bg-paper text-ink text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
        />
      </div>

      <div className="pt-4 flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => router.push("/admin/skillsets")}
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
          {loading ? "Saving..." : isEdit ? "Update Skillset" : "Create Skillset"}
        </Button>
      </div>
    </form>
  );
};
