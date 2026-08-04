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
import { Plus, Edit, Calendar, Eye } from "lucide-react";
import { deleteBlogAction } from "@/app/actions/admin";

export interface AdminBlogsPageProps {
  searchParams?: Promise<{ page?: string; limit?: string; q?: string }>;
}

export default async function AdminBlogsPage({
  searchParams,
}: AdminBlogsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const pageSize = Math.max(1, Number(resolvedSearchParams.limit) || 5);
  const searchQuery = resolvedSearchParams.q?.trim() || "";

  const where: Prisma.BlogWhereInput = searchQuery
    ? {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { category: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
        ],
      }
    : {};

  let blogs: Awaited<ReturnType<typeof prisma.blog.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.blog.count({ where });
    blogs = await prisma.blog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  } catch (e) {
    console.warn("Error fetching blogs:", e);
  }

  const totalPages = Math.ceil(totalItems / pageSize);
  type BlogItem = (typeof blogs)[number];

  return (
    <>
      <AdminFormHeader
        backHref="/admin"
        backLabel="Back to Dashboard"
        title="Blog Articles"
        showBadge={false}
        showSaveDraft={false}
        showSearch={true}
        searchPlaceholder="Search title, category..."
        primaryActionLabel="Create Article"
        primaryActionHref="/admin/blogs/new"
        primaryActionIcon={<Plus className="w-3.5 h-3.5" />}
      />

      <div className="pt-[77px] lg:pt-[87px] px-4 sm:px-6 lg:px-6 pb-4 sm:pb-6 lg:pb-6">
        <AdminContent<BlogItem>
          items={blogs}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          baseUrl="/admin/blogs"
          emptyMessage="No blog articles found in database. Click 'Create Article' to add one."
          getItemKey={(item) => item.id}
          columns={[
            {
              header: "Article Title",
              className: "p-4",
              render: (blog) => (
                <div className="min-w-0">
                  <span className="font-bold text-ink block font-serif truncate">
                    {blog.title}
                  </span>
                  <span className="text-xs font-mono text-ink-muted block truncate">
                    /{blog.slug}
                  </span>
                </div>
              ),
            },
            {
              header: "Category",
              className: "p-4",
              render: (blog) => (
                <Badge variant="accent" size="sm">
                  {blog.category}
                </Badge>
              ),
            },
            {
              header: "Status",
              className: "p-4",
              render: (blog) => (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    blog.status === "published"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : blog.status === "draft"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-slate-100 text-slate-700 border border-slate-300"
                  }`}
                >
                  {blog.status}
                </span>
              ),
            },
            {
              header: "Views",
              className: "p-4 text-xs font-mono text-ink-muted",
              render: (blog) => (
                <div className="flex items-center space-x-1" title={`${blog.views ?? 0} organic views`}>
                  <Eye className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="font-bold text-ink">{(blog.views ?? 0).toLocaleString()}</span>
                </div>
              ),
            },
            {
              header: "Date Published",
              className: "p-4 text-xs font-mono text-ink-muted",
              render: (blog) => (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              ),
            },
            {
              header: "Actions",
              headerClassName: "p-4 text-right text-white",
              className: "p-4 text-right",
              render: (blog) => (
                <div className="flex items-center justify-end space-x-2">
                  <Link href={`/admin/blogs/${blog.id}/edit`}>
                    <button
                      type="button"
                      className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                  <DeleteButton
                    itemId={blog.id}
                    itemName={blog.title}
                    itemType="blog article"
                    onDeleteAction={deleteBlogAction}
                  />
                </div>
              ),
            },
          ]}
          renderMobileCard={(blog) => (
            <div className="bg-surface border border-[#c8c5c2] rounded-xl p-4 space-y-3 shadow-card hover:border-primary/50 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-sm text-ink truncate leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-[11px] font-mono text-ink-muted truncate">
                      /{blog.slug}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                      blog.status === "published"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : blog.status === "draft"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-slate-100 text-slate-700 border border-slate-300"
                    }`}
                  >
                    {blog.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono gap-2 pt-1 border-t border-border-subtle/50">
                  <Badge variant="accent" size="sm">
                    {blog.category}
                  </Badge>
                  <div className="flex items-center space-x-1 text-[11px] text-ink-muted">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-end space-x-2 mt-2">
                <Link href={`/admin/blogs/${blog.id}/edit`}>
                  <button
                    type="button"
                    className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </Link>
                <DeleteButton
                  itemId={blog.id}
                  itemName={blog.title}
                  itemType="blog article"
                  onDeleteAction={deleteBlogAction}
                />
              </div>
            </div>
          )}
        />
      </div>
    </>
  );
}
