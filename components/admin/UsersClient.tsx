"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminFormHeader } from "@/components/admin/AdminFormHeader";
import { AdminContent } from "@/components/admin/AdminContent";
import { UserModal, UserData } from "./UserModal";
import { UserPlus, Edit } from "lucide-react";
import { deleteUserAction } from "@/app/actions/admin";

export interface UserItem {
  id: string;
  name: string | null;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersClientProps {
  users: UserItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export const UsersClient: React.FC<UsersClientProps> = ({
  users,
  totalItems,
  currentPage,
  totalPages,
  pageSize,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<UserData | null>(null);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <>
      <AdminFormHeader
        backHref="/admin"
        backLabel="Back to Dashboard"
        title="Users Management"
        showBadge={false}
        showSaveDraft={false}
        showSearch={true}
        searchPlaceholder="Search name, username, email..."
        primaryActionLabel="Create Admin"
        onPublish={handleOpenAdd}
        primaryActionIcon={<UserPlus className="w-3.5 h-3.5" />}
      />

      <div className="pt-[77px] lg:pt-[87px] px-4 sm:px-6 lg:px-6 pb-4 sm:pb-6 lg:pb-6">
        <AdminContent<UserItem>
          items={users}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          baseUrl="/admin/users"
          emptyMessage="No users found in database. Click 'Create Admin' to add one."
          getItemKey={(item) => item.id}
          columns={[
            {
              header: "User",
              className: "p-4",
              render: (u) => (
                <div className="font-bold text-ink font-serif text-sm">
                  {u.name || "Unnamed"}
                </div>
              ),
            },
            {
              header: "Username",
              className: "p-4 text-xs font-mono text-ink-muted",
              render: (u) => `@${u.username}`,
            },
            {
              header: "Email",
              className: "p-4 text-xs font-mono text-ink-muted",
              render: (u) => u.email,
            },
            {
              header: "Role",
              className: "p-4",
              render: (u) => (
                <Badge
                  variant="accent"
                  size="sm"
                  className="uppercase font-mono"
                >
                  {u.role}
                </Badge>
              ),
            },
            {
              header: "Actions",
              headerClassName: "p-4 text-right text-white",
              className: "p-4 text-right",
              render: (u) => (
                <div className="flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(u)}
                    className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {users.length > 1 && (
                    <DeleteButton
                      itemId={u.id}
                      itemName={u.username}
                      itemType="user"
                      onDeleteAction={deleteUserAction}
                    />
                  )}
                </div>
              ),
            },
          ]}
          renderMobileCard={(u) => (
            <div className="bg-surface border border-[#c8c5c2] rounded-xl p-4 space-y-3 shadow-card hover:border-primary/50 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-sm text-ink truncate leading-snug">
                      {u.name || "Unnamed"}
                    </h3>
                    <p className="text-xs font-mono text-ink-muted mt-0.5">
                      @{u.username}
                    </p>
                  </div>
                  <Badge
                    variant="accent"
                    size="sm"
                    className="uppercase shrink-0 font-mono"
                  >
                    {u.role}
                  </Badge>
                </div>
                <p className="text-xs font-mono text-ink-muted truncate">
                  {u.email}
                </p>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(u)}
                  className="p-2 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {users.length > 1 && (
                  <DeleteButton
                    itemId={u.id}
                    itemName={u.username}
                    itemType="user"
                    onDeleteAction={deleteUserAction}
                  />
                )}
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
          title="Create Admin"
          aria-label="Create Admin"
        >
          <UserPlus className="w-7 h-7 stroke-[2.5]" />
        </button>
      )}

      {/* Modal Form */}
      <UserModal
        key={editingUser?.id || (isModalOpen ? "new" : "closed")}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingUser}
        isEdit={Boolean(editingUser?.id)}
      />
    </>
  );
};
