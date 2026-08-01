"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminFormHeader } from "@/components/admin/AdminFormHeader";
import { AdminContent } from "@/components/admin/AdminContent";
import { SkillsetModal, SkillsetData } from "./SkillsetModal";
import { Plus, Edit, ExternalLink } from "lucide-react";
import { deleteSkillsetAction } from "@/app/actions/admin";

export interface SkillsetItem {
  id: string;
  skillName: string;
  category: string;
  categoryOrder: number;
  link: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillsetsClientProps {
  skillsets: SkillsetItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export const SkillsetsClient: React.FC<SkillsetsClientProps> = ({
  skillsets,
  totalItems,
  currentPage,
  totalPages,
  pageSize,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingSkillset, setEditingSkillset] =
    React.useState<SkillsetData | null>(null);

  const handleOpenAdd = () => {
    setEditingSkillset(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SkillsetItem) => {
    setEditingSkillset({
      id: item.id,
      skillName: item.skillName,
      category: item.category,
      categoryOrder: item.categoryOrder,
      link: item.link,
      description: item.description,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkillset(null);
  };

  return (
    <>
      <AdminFormHeader
        backHref="/admin"
        backLabel="Back to Dashboard"
        title="Technical Skillsets"
        showBadge={false}
        showSaveDraft={false}
        showSearch={true}
        searchPlaceholder="Search category, skill..."
        primaryActionLabel="Add Skillset"
        onPublish={handleOpenAdd}
        primaryActionIcon={<Plus className="w-3.5 h-3.5" />}
      />

      <div className="pt-[77px] lg:pt-[87px] px-4 sm:px-6 lg:px-6 pb-4 sm:pb-6 lg:pb-6">
        <AdminContent<SkillsetItem>
          items={skillsets}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          baseUrl="/admin/skillsets"
          emptyMessage="No skillsets found in database. Click 'Add Skillset' to add one."
          getItemKey={(item) => item.id}
          columns={[
            {
              header: "Order",
              headerClassName: "p-4 w-12 text-center text-white",
              className: "p-4 w-12 text-center",
              render: (sk) => (
                <span className="font-mono font-bold text-primary text-xs">
                  #{sk.categoryOrder}
                </span>
              ),
            },
            {
              header: "Category",
              className: "p-4",
              render: (sk) => (
                <Badge variant="accent" size="sm">
                  {sk.category}
                </Badge>
              ),
            },
            {
              header: "Skill / Tool Name",
              className: "p-4 font-bold text-ink font-serif text-sm",
              render: (sk) => sk.skillName,
            },
            {
              header: "Link / Ref",
              className: "p-4 text-xs font-mono",
              render: (sk) =>
                sk.link ? (
                  <a
                    href={sk.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>{sk.link}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-ink-muted">-</span>
                ),
            },
            {
              header: "Actions",
              headerClassName: "p-4 text-right text-white",
              className: "p-4 text-right",
              render: (sk) => (
                <div className="flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(sk)}
                    className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <DeleteButton
                    itemId={sk.id}
                    itemName={sk.skillName}
                    itemType="skillset"
                    onDeleteAction={deleteSkillsetAction}
                  />
                </div>
              ),
            },
          ]}
          renderMobileCard={(sk) => (
            <div className="bg-surface border border-[#c8c5c2] rounded-xl p-4 space-y-3 shadow-card hover:border-primary/50 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded bg-paper border border-border-warm text-xs font-mono font-bold text-primary shrink-0">
                      #{sk.categoryOrder}
                    </span>
                    <Badge variant="accent" size="sm" className="truncate">
                      {sk.category}
                    </Badge>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-base text-ink tracking-tight pt-1">
                  {sk.skillName}
                </h3>

                {sk.description && (
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
                    {sk.description}
                  </p>
                )}

                {sk.link && (
                  <div className="pt-1">
                    <a
                      href={sk.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span className="truncate max-w-[200px]">{sk.link}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(sk)}
                  className="p-2 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <DeleteButton
                  itemId={sk.id}
                  itemName={sk.skillName}
                  itemType="skillset"
                  onDeleteAction={deleteSkillsetAction}
                />
              </div>
            </div>
          )}
        />
      </div>

      {/* Floating Action Button for Mobile */}
      {!isModalOpen && (
        <button
          type="button"
          onClick={handleOpenAdd}
          className="fixed bottom-6 right-6 z-40 lg:hidden w-14 h-14 rounded-2xl bg-primary text-white shadow-xl hover:bg-[#993b3d] active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-white/20"
          title="Add Skillset"
          aria-label="Add Skillset"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      )}

      {/* Modal Form */}
      <SkillsetModal
        key={editingSkillset?.id || (isModalOpen ? "new" : "closed")}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingSkillset}
        isEdit={Boolean(editingSkillset?.id)}
      />
    </>
  );
};
