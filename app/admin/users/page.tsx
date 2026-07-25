import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { UserPlus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { deleteUserAction } from "@/app/actions/admin";

export interface AdminUsersPageProps {
  searchParams?: Promise<{ page?: string }>;
}

const PAGE_SIZE = 10;

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);

  let users: Awaited<ReturnType<typeof prisma.user.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.user.count();
    users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
  } catch (e) {
    console.warn("Error fetching users:", e);
  }

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-warm">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center space-x-1 text-xs font-mono text-ink-muted hover:text-primary mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-ink">
            Admin User Management / ユーザー管理
          </h1>
        </div>

        <Link href="/admin/users/new">
          <Button variant="primary" size="md" icon={<UserPlus className="w-4 h-4" />}>
            Create Admin User / ユーザー追加
          </Button>
        </Link>
      </div>

      {/* Users Table */}
      <div className="bg-surface border border-border-warm rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-paper border-b border-border-warm font-serif text-ink text-xs uppercase tracking-wider">
                <th className="p-4">User</th>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-ink-muted font-mono text-xs">
                    No users found in database. Click &quot;Create Admin User&quot; to add one.
                  </td>
                </tr>
              ) : (
                users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-black/2 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs font-serif">
                          {usr.name ? usr.name.charAt(0) : "U"}
                        </div>
                        <div>
                          <span className="font-bold text-ink block font-serif">{usr.name}</span>
                          <span className="text-[10px] font-mono text-ink-muted">
                            Joined {new Date(usr.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono font-medium text-ink">
                      @{usr.username}
                    </td>
                    <td className="p-4 text-xs font-mono text-ink-muted">
                      {usr.email}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={usr.role === "ADMIN" ? "accent" : "ghost"}
                        size="sm"
                      >
                        {usr.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/users/${usr.id}/edit`}>
                          <button
                            type="button"
                            className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>

                        {totalItems > 1 && (
                          <form
                            action={async () => {
                              "use server";
                              await deleteUserAction(usr.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="p-1.5 rounded bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Interactive Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          baseUrl="/admin/users"
        />
      </div>
    </div>
  );
}
