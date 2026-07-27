"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Trash2, X, AlertCircle } from "lucide-react";

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  itemName?: string;
  itemType?: string;
  loading?: boolean;
  error?: string | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  itemType = "item",
  loading = false,
  error,
}) => {
  if (!isOpen) return null;

  const modalTitle = title || `Confirm Deletion / 削除の確認`;
  const modalDescription =
    description ||
    `Are you sure you want to delete this ${itemType}? This action cannot be undone. / この操作は取り消せません。`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface border border-border-warm rounded-2xl p-6 shadow-2xl w-full max-w-md space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Danger Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-ink leading-snug">
                {modalTitle}
              </h3>
              <p className="text-xs text-ink-muted font-sans mt-0.5">
                Action requires confirmation
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="p-1 rounded text-ink-muted hover:text-ink hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Body & Item Preview */}
        <div className="space-y-3">
          <p className="text-xs text-ink-muted font-sans leading-relaxed">
            {modalDescription}
          </p>

          {itemName && (
            <div className="p-3 rounded-lg bg-paper border border-border-warm font-mono text-xs font-semibold text-ink truncate">
              {itemName}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end space-x-3 border-t border-border-subtle">
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={loading}
            onClick={onClose}
          >
            Cancel / キャンセル
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={loading}
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white border-rose-700 font-bold shadow-2xs"
            icon={<Trash2 className="w-4 h-4" />}
          >
            {loading ? "Deleting..." : "Confirm Delete / 削除"}
          </Button>
        </div>
      </div>
    </div>
  );
};
