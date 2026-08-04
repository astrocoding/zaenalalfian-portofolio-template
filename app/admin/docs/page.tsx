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
import { Plus, Edit, Eye } from "lucide-react";
import { deleteDocAction } from "@/app/actions/admin";

export interface AdminDocsPageProps {
  searchParams?: Promise<{ page?: string; limit?: string; q?: string }>;
}

export default async function AdminDocsPage({
  searchParams,
}: AdminDocsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const pageSize = Math.max(1, Number(resolvedSearchParams.limit) || 5);
  const searchQuery = resolvedSearchParams.q?.trim() || "";

  const where: Prisma.DocWhereInput = searchQuery
    ? {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { category: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
        ],
      }
    : {};

  let docs: Awaited<ReturnType<typeof prisma.doc.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.doc.count({ where });
    docs = await prisma.doc.findMany({
      where,
      orderBy: { order: "asc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  } catch (e) {
    console.warn("Error fetching docs:", e);
  }

  const totalPages = Math.ceil(totalItems / pageSize);
  type DocItem = (typeof docs)[number];

  return (
    <>
      <AdminFormHeader
        backHref="/admin"
        backLabel="Back to Dashboard"
        title="Documentations"
        showBadge={false}
        showSaveDraft={false}
        showSearch={true}
        searchPlaceholder="Search title, category..."
        primaryActionLabel="Create Doc"
        primaryActionHref="/admin/docs/new"
        primaryActionIcon={<Plus className="w-3.5 h-3.5" />}
      />

      <div className="pt-[77px] lg:pt-[87px] px-4 sm:px-6 lg:px-6 pb-4 sm:pb-6 lg:pb-6">
        <AdminContent<DocItem>
          items={docs}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          baseUrl="/admin/docs"
          emptyMessage="No docs found in database. Click 'Create Doc' to add one."
          getItemKey={(item) => item.id}
          columns={[
            {
              header: "#",
              headerClassName: "p-4 w-12 text-center text-white",
              className: "p-4 w-12 text-center",
              render: (doc) => (
                <span className="font-mono font-bold text-primary text-xs">
                  #{doc.order}
                </span>
              ),
            },
            {
              header: "Title",
              className: "p-4",
              render: (doc) => (
                <div className="min-w-0">
                  <span className="font-bold text-ink block font-serif truncate">
                    {doc.title}
                  </span>
                  <span className="text-xs font-mono text-ink-muted block truncate">
                    /{doc.slug}
                  </span>
                </div>
              ),
            },
            {
              header: "Category",
              className: "p-4",
              render: (doc) => (
                <Badge variant="accent" size="sm">
                  {doc.category}
                </Badge>
              ),
            },
            {
              header: "Status",
              className: "p-4",
              render: (doc) => (
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
              ),
            },
            {
              header: "Views",
              className: "p-4 text-xs font-mono text-ink-muted",
              render: (doc) => (
                <div className="flex items-center space-x-1" title={`${doc.views ?? 0} organic views`}>
                  <Eye className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="font-bold text-ink">{(doc.views ?? 0).toLocaleString()}</span>
                </div>
              ),
            },
            {
              header: "Actions",
              headerClassName: "p-4 text-right text-white",
              className: "p-4 text-right",
              render: (doc) => (
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
                    itemType="documentation"
                    onDeleteAction={deleteDocAction}
                  />
                </div>
              ),
            },
          ]}
          renderMobileCard={(doc) => (
            <div className="bg-surface border border-[#c8c5c2] rounded-xl p-4 space-y-3 shadow-card hover:border-primary/50 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded bg-paper border border-border-warm text-xs font-mono font-bold text-primary shrink-0">
                      #{doc.order}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-serif font-bold text-sm text-ink truncate leading-snug">
                        {doc.title}
                      </h3>
                      <p className="text-[11px] font-mono text-ink-muted truncate">
                        /{doc.slug}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                      doc.status === "published"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : doc.status === "draft"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-slate-100 text-slate-700 border border-slate-300"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono gap-2 pt-1 border-t border-border-subtle/50">
                  <Badge variant="accent" size="sm">
                    {doc.category}
                  </Badge>
                </div>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-end space-x-2 mt-2">
                <Link href={`/admin/docs/${doc.id}/edit`}>
                  <button
                    type="button"
                    className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </Link>
                <DeleteButton
                  itemId={doc.id}
                  itemName={doc.title}
                  itemType="documentation"
                  onDeleteAction={deleteDocAction}
                />
              </div>
            </div>
          )}
        />
      </div>
    </>
  );
}
