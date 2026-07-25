import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { Plus, Edit, Trash2, ArrowLeft, Calendar } from "lucide-react";
import { deleteBlogAction } from "@/app/actions/admin";

export interface AdminBlogsPageProps {
  searchParams?: Promise<{ page?: string }>;
}

const PAGE_SIZE = 10;

export default async function AdminBlogsPage({ searchParams }: AdminBlogsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);

  let blogs: Awaited<ReturnType<typeof prisma.blog.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.blog.count();
    blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
  } catch (e) {
    console.warn("Error fetching blogs:", e);
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
            Blog Articles Management / 記事管理
          </h1>
        </div>

        <Link href="/admin/blogs/new">
          <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
            Create Article / 新規記事
          </Button>
        </Link>
      </div>

      {/* Blogs Table */}
      <div className="bg-surface border border-border-warm rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-paper border-b border-border-warm font-serif text-ink text-xs uppercase tracking-wider">
                <th className="p-4">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Published Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-ink-muted font-mono text-xs">
                    No blog posts found in database. Click &quot;Create Article&quot; to add one.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-black/2 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-ink block font-serif">{blog.title}</span>
                      <span className="text-xs font-mono text-ink-muted">
                        /blogs/{blog.category.toLowerCase()}/{blog.slug}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="accent" size="sm">
                        {blog.category}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs font-mono text-ink-muted">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
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

                        <form
                          action={async () => {
                            "use server";
                            await deleteBlogAction(blog.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-1.5 rounded bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
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
          baseUrl="/admin/blogs"
        />
      </div>
    </div>
  );
}
