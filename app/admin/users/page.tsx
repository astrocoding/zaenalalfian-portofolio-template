import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminFormHeader } from "@/components/admin/AdminFormHeader";
import { AdminContent } from "@/components/admin/AdminContent";
import { Prisma } from "@/app/generated/prisma/client";
import { UserPlus, Edit } from "lucide-react";
import { deleteUserAction } from "@/app/actions/admin";

export interface AdminUsersPageProps {
  searchParams?: Promise<{ page?: string; limit?: string; q?: string }>;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const pageSize = Math.max(1, Number(resolvedSearchParams.limit) || 5);
  const searchQuery = resolvedSearchParams.q?.trim() || "";

  const where: Prisma.UserWhereInput = searchQuery
    ? {
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { username: { contains: searchQuery, mode: "insensitive" } },
          { email: { contains: searchQuery, mode: "insensitive" } },
        ],
      }
    : {};

  let users: Awaited<ReturnType<typeof prisma.user.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.user.count({ where });
    users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  } catch (e) {
    console.warn("Error fetching users:", e);
  }

  const totalPages = Math.ceil(totalItems / pageSize);
  type UserItem = (typeof users)[number];

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
        primaryActionHref="/admin/users/new"
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
                  <Link href={`/admin/users/${u.id}/edit`}>
                    <button
                      type="button"
                      className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
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
                    <p className="text-[11px] font-mono text-ink-muted truncate">
                      @{u.username}
                    </p>
                  </div>
                  <Badge
                    variant="accent"
                    size="sm"
                    className="uppercase font-mono shrink-0"
                  >
                    {u.role}
                  </Badge>
                </div>

                <div className="text-xs font-mono text-ink-muted pt-1 border-t border-border-subtle/50 truncate">
                  {u.email}
                </div>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-end space-x-2 mt-2">
                <Link href={`/admin/users/${u.id}/edit`}>
                  <button
                    type="button"
                    className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </Link>
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
    </>
  );
}
