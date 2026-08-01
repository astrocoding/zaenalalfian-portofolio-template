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
import { Plus, Edit, ArrowLeft, Calendar } from "lucide-react";
import { deleteBlogAction } from "@/app/actions/admin";

export interface AdminBlogsPageProps {
  searchParams?: Promise<{ page?: string; limit?: string }>;
}

export default async function AdminBlogsPage({
  searchParams,
}: AdminBlogsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const pageSize = Math.max(1, Number(resolvedSearchParams.limit) || 5);

  let blogs: Awaited<ReturnType<typeof prisma.blog.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.blog.count();
    blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  } catch (e) {
    console.warn("Error fetching blogs:", e);
  }

  const totalPages = Math.ceil(totalItems / pageSize);

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
            Blog Articles
          </h1>
        </div>

        <Link href="/admin/blogs/new">
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
          >
            Create Article
          </Button>
        </Link>
      </div>

      {/* Blogs Table */}
      <div className="bg-surface border border-border-warm rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-primary border-b border-border-warm font-serif text-white text-xs uppercase tracking-wider">
                <th className="p-4">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Published Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {blogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-ink-muted font-mono text-xs"
                  >
                    No blog posts found in database. Click &quot;Create
                    Article&quot; to add one.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-black/2 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-bold text-ink block font-serif">
                        {blog.title}
                      </span>
                      <span className="text-xs font-mono text-ink-muted">
                        /blogs/{blog.category.toLowerCase()}/{blog.slug}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="accent" size="sm">
                        {blog.category}
                      </Badge>
                    </td>
                    <td className="p-4">
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
                    </td>
                    <td className="p-4 text-xs font-mono text-ink-muted">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(blog.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
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
                          itemType="article"
                          onDeleteAction={deleteBlogAction}
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
          pageSize={pageSize}
          baseUrl="/admin/blogs"
        />
      </div>
    </div>
  );
}
