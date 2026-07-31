import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Plus, Edit, ArrowLeft } from "lucide-react";
import { deleteDocAction } from "@/app/actions/admin";

export interface AdminDocsPageProps {
  searchParams?: Promise<{ page?: string }>;
}

const PAGE_SIZE = 10;

export default async function AdminDocsPage({ searchParams }: AdminDocsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);

  let docs: Awaited<ReturnType<typeof prisma.doc.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.doc.count();
    docs = await prisma.doc.findMany({
      orderBy: { order: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
  } catch (e) {
    console.warn("Error fetching docs:", e);
  }

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return (
    <div className="p-4 sm:p-6 lg:p-6 space-y-6">
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
            Documentation Guides Management / 文書管理
          </h1>
        </div>

        <Link href="/admin/docs/new">
          <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
            Create Doc Guide / 新規文書
          </Button>
        </Link>
      </div>

      {/* Docs Table */}
      <div className="bg-surface border border-border-warm rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-paper border-b border-border-warm font-serif text-ink text-xs uppercase tracking-wider">
                <th className="p-4">Order</th>
                <th className="p-4">Guide Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {docs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-ink-muted font-mono text-xs">
                    No database docs found. Click &quot;Create Doc Guide&quot; to add one.
                  </td>
                </tr>
              ) : (
                docs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-black/2 transition-colors">
                    <td className="p-4 text-xs font-mono font-bold text-primary">
                      #{doc.order}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-ink block font-serif">{doc.title}</span>
                      <span className="text-xs font-mono text-ink-muted">
                        /docs/{doc.category.toLowerCase()}/{doc.slug}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="accent" size="sm">
                        {doc.category}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          doc.status === "published"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : doc.status === "draft"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-slate-100 text-slate-700 border border-slate-300"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/docs/${doc.id}/edit`}>
                          <button
                            type="button"
                            className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>

                        <DeleteButton
                          itemId={doc.id}
                          itemName={doc.title}
                          itemType="documentation guide"
                          onDeleteAction={deleteDocAction}
                        />
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
          baseUrl="/admin/docs"
        />
      </div>
    </div>
  );
}
