"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Trash2 } from "lucide-react";

export interface DeleteButtonProps {
  itemId: string;
  itemName?: string;
  itemType?: string;
  onDeleteAction: (id: string) => Promise<{ success: boolean; error?: string }>;
  buttonTitle?: string;
  className?: string;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  itemId,
  itemName,
  itemType = "item",
  onDeleteAction,
  buttonTitle = "Delete",
  className,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await onDeleteAction(itemId);
      if (res && !res.success) {
        setError(res.error || `Failed to delete ${itemType}.`);
        setLoading(false);
        return;
      }
      setIsOpen(false);
      setLoading(false);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Failed to delete ${itemType}.`);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setIsOpen(true);
        }}
        className={
          className ||
          "p-1.5 rounded bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
        }
        title={buttonTitle}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <DeleteConfirmModal
        isOpen={isOpen}
        onClose={() => {
          if (!loading) setIsOpen(false);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={itemName}
        itemType={itemType}
        loading={loading}
        error={error}
      />
    </>
  );
};
