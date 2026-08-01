"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  X,
  Check,
} from "lucide-react";
import {
  createAboutCardAction,
  updateAboutCardAction,
  deleteAboutCardAction,
  reorderAboutCardsAction,
} from "@/app/actions/admin";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { DynamicIcon, getLucideIcon } from "@/components/ui/DynamicIcon";
import { AlertBanner } from "@/components/ui/AlertBanner";

export interface AboutCardItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string | null;
  icon?: string | null;
  order: number;
}

export interface AboutCardManagerProps {
  aboutId: string;
  initialCards: AboutCardItem[];
}

export const AboutCardManager: React.FC<AboutCardManagerProps> = ({
  aboutId,
  initialCards,
}) => {
  const router = useRouter();
  const [cards, setCards] = React.useState<AboutCardItem[]>(initialCards);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCard, setEditingCard] = React.useState<AboutCardItem | null>(
    null,
  );
  const [cardToDelete, setCardToDelete] = React.useState<AboutCardItem | null>(
    null,
  );
  const [loading, setLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    title: "",
    subtitle: "",
    badge: "",
    icon: "",
  });

  // Keep cards synced when initialCards prop updates from server revalidation
  const [prevInitialCards, setPrevInitialCards] = React.useState(initialCards);
  if (prevInitialCards !== initialCards) {
    setPrevInitialCards(initialCards);
    setCards(initialCards);
  }

  const handleOpenAddModal = () => {
    setEditingCard(null);
    setFormData({ title: "", subtitle: "", badge: "", icon: "" });
    setIsModalOpen(true);
    setError(null);
  };

  const handleOpenEditModal = (card: AboutCardItem) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      subtitle: card.subtitle,
      badge: card.badge || "",
      icon: card.icon || "",
    });
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCard(null);
    setFormData({ title: "", subtitle: "", badge: "", icon: "" });
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    let res;
    if (editingCard) {
      res = await updateAboutCardAction(editingCard.id, formData);
    } else {
      res = await createAboutCardAction(aboutId, formData);
    }

    setLoading(false);
    if (res.success) {
      setSuccess(
        editingCard
          ? "About Card updated! / カードを更新しました。"
          : "New About Card created! / カードを追加しました。",
      );
      handleCloseModal();
      router.refresh();
    } else {
      setError(res.error || "Failed to save card.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!cardToDelete) return;

    setDeleteLoading(true);
    setDeleteError(null);
    const res = await deleteAboutCardAction(cardToDelete.id);
    setDeleteLoading(false);

    if (res.success) {
      setSuccess(
        `Card "${cardToDelete.title}" deleted! / カードを削除しました。`,
      );
      setCardToDelete(null);
      router.refresh();
    } else {
      setDeleteError(res.error || "Failed to delete card.");
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === cards.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...cards];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate order index values
    const reordered = updated.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setCards(reordered);
    setError(null);

    const res = await reorderAboutCardsAction(
      reordered.map((c) => ({ id: c.id, order: c.order })),
    );

    if (!res.success) {
      setError("Failed to update order.");
      router.refresh();
    } else {
      router.refresh();
    }
  };

  return (
    <div className="bg-surface border border-border-warm rounded-xl p-5 sm:p-6 shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-md bg-[#f6e0ce]/40 border border-[#ebd9c8]">
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-ink">
              About Cards &amp; Pillars Management
            </h2>
            <p className="text-xs text-ink-muted font-sans">
              Manage engineering principles &amp; value cards displayed across
              /about and landing pages.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleOpenAddModal}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Add About Card / カード追加
        </Button>
      </div>

      <AlertBanner
        variant="error"
        message={error}
        onClose={() => setError(null)}
      />

      <AlertBanner
        variant="success"
        message={success}
        onClose={() => setSuccess(null)}
      />

      {cards.length === 0 ? (
        <div className="text-center py-10 px-4 bg-paper rounded-lg border border-dashed border-border-warm">
          <p className="text-xs font-mono text-ink-muted">
            No About Cards found. Click &quot;Add About Card&quot; to create
            one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="p-4 rounded-lg bg-paper border border-border-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors shadow-2xs"
            >
              <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                <div className="flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-mono text-ink-muted uppercase">
                    Order
                  </span>
                  <span className="font-serif font-bold text-sm text-primary">
                    #{index + 1}
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    {card.badge && (
                      <Badge variant="accent" size="sm">
                        {card.badge}
                      </Badge>
                    )}
                    {card.icon && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-bold inline-flex items-center gap-1">
                        <DynamicIcon
                          name={card.icon}
                          className="w-3.5 h-3.5 text-primary"
                        />
                        <span>Icon: {card.icon}</span>
                      </span>
                    )}
                    <h3 className="font-serif font-bold text-sm text-ink truncate">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs text-ink-muted line-clamp-2 font-sans leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  disabled={index === 0 || loading}
                  onClick={() => handleMoveOrder(index, "up")}
                  className="p-1.5 rounded bg-surface border border-border-warm text-ink hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  disabled={index === cards.length - 1 || loading}
                  onClick={() => handleMoveOrder(index, "down")}
                  className="p-1.5 rounded bg-surface border border-border-warm text-ink hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEditModal(card)}
                  className="p-1.5 rounded bg-surface border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                  title="Edit Card"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeleteError(null);
                    setCardToDelete(card);
                  }}
                  className="p-1.5 rounded bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                  title="Delete Card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(cardToDelete)}
        onClose={() => {
          if (!deleteLoading) setCardToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={cardToDelete?.title}
        itemType="About Card"
        loading={deleteLoading}
        error={deleteError}
      />

      {/* Modal Dialog for Add/Edit Card */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border-warm rounded-xl p-6 shadow-2xl w-full max-w-lg space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="font-serif font-bold text-base text-ink">
                {editingCard
                  ? "Edit About Card / カード編集"
                  : "Create About Card / カード追加"}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded text-ink-muted hover:text-ink hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-4">
              <AlertBanner
                variant="error"
                message={error}
                onClose={() => setError(null)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono font-medium text-ink">
                    Card Title / タイトル *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Clean Architecture"
                    className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium text-ink">
                    Badge / Kanji
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) =>
                      setFormData({ ...formData, badge: e.target.value })
                    }
                    placeholder="e.g. 建築 or 01"
                    className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-medium text-ink">
                    Icon Name (Lucide React)
                  </label>
                  {formData.icon && getLucideIcon(formData.icon) ? (
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold inline-flex items-center gap-1">
                      <DynamicIcon
                        name={formData.icon}
                        className="w-3 h-3 text-emerald-700"
                      />
                      <span>Valid Icon</span>
                    </span>
                  ) : formData.icon ? (
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-semibold">
                      Custom / Default Fallback
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-ink-muted">
                      Optional
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2.5 rounded-md bg-paper border border-border-warm shrink-0 flex items-center justify-center min-w-[42px] min-h-[42px]">
                    <DynamicIcon
                      name={formData.icon}
                      fallback={Layers}
                      className="w-5 h-5 text-primary"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="e.g. Cpu, Zap, Layout, ShieldCheck, Code, Sparkles, Terminal, Rocket"
                    className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-ink">
                  Subtitle / Card Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder="Strict separation of concerns, domain-driven boundaries..."
                  className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-watermark-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans leading-relaxed"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-border-subtle">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={loading}
                  icon={<Check className="w-4 h-4" />}
                >
                  {loading
                    ? "Saving..."
                    : editingCard
                      ? "Update Card"
                      : "Add Card"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
