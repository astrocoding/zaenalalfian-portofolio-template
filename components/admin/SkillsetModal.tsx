"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { X, Save, Layers } from "lucide-react";
import {
  createSkillsetAction,
  updateSkillsetAction,
} from "@/app/actions/admin";

export interface SkillsetData {
  id?: string;
  skillName?: string;
  category?: string;
  categoryOrder?: number;
  link?: string | null;
  description?: string | null;
}

export interface SkillsetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SkillsetData | null;
  isEdit?: boolean;
}

const DEFAULT_CATEGORIES = [
  { name: "Frontend Engineering", order: 1 },
  { name: "Backend & Database", order: 2 },
  { name: "Architecture & DevOps", order: 3 },
  { name: "Tools & Methodologies", order: 4 },
];

export const SkillsetModal: React.FC<SkillsetModalProps> = ({
  isOpen,
  onClose,
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    skillName: isEdit && initialData ? initialData.skillName || "" : "",
    category:
      isEdit && initialData
        ? initialData.category || "Frontend Engineering"
        : "Frontend Engineering",
    categoryOrder: isEdit && initialData ? initialData.categoryOrder || 1 : 1,
    link: isEdit && initialData ? initialData.link || "" : "",
    description: isEdit && initialData ? initialData.description || "" : "",
  });

  if (!isOpen) return null;

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
      onClose();
      router.refresh();
    } else {
      setError(res.error || "Operation failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface border border-border-warm rounded-2xl p-5 sm:p-6 shadow-2xl w-full max-w-lg space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-bold text-base text-ink">
              {isEdit
                ? "Edit Skillset / スキル編集"
                : "New Skillset / スキル追加"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dismissible Error Alert */}
        <AlertBanner
          variant="error"
          message={error}
          onClose={() => setError(null)}
        />

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">
              Skill / Tool Name /{" "}
              <span className="text-primary">スキル名 *</span>
            </label>
            <input
              type="text"
              required
              value={formData.skillName}
              onChange={(e) =>
                setFormData({ ...formData, skillName: e.target.value })
              }
              placeholder="e.g. Next.js 16 (App Router)"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-ink">
                Category / <span className="text-primary">カテゴリ *</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="admin-select w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-ink">
                Order Index / <span className="text-primary">順序 *</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.categoryOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryOrder: Number(e.target.value),
                  })
                }
                placeholder="1, 2, 3..."
                className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">
              Reference Link / リファレンス (optional)
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="https://nextjs.org"
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-ink">
              Description / 概要 (optional)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description or usage notes..."
              className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm leading-relaxed placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-border-subtle">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading}
              icon={<Save className="w-3.5 h-3.5" />}
            >
              {loading
                ? "Saving..."
                : isEdit
                  ? "Update Skillset"
                  : "Create Skillset"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
