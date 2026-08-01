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
import { Prisma } from "@/app/generated/prisma/client";
import { AdminFormHeader } from "@/components/admin/AdminFormHeader";
import { Plus, Edit, ExternalLink, Code2 } from "lucide-react";
import { deleteProjectAction } from "@/app/actions/admin";

export interface AdminProjectsPageProps {
  searchParams?: Promise<{ page?: string; limit?: string; q?: string }>;
}

export default async function AdminProjectsPage({ searchParams }: AdminProjectsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const pageSize = Math.max(1, Number(resolvedSearchParams.limit) || 10);
  const searchQuery = resolvedSearchParams.q?.trim() || "";

  const where: Prisma.ProjectWhereInput = searchQuery
    ? {
      OR: [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { category: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
        { techstack: { hasSome: [searchQuery] } },
      ],
    }
    : {};

  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.project.count({ where });
    projects = await prisma.project.findMany({
      where,
      orderBy: [{ priorityOrder: "asc" }, { createdAt: "desc" }],
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  } catch (e) {
    console.warn("Error fetching projects:", e);
  }

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <>
      <AdminFormHeader
        backHref="/admin"
        backLabel="Back to Dashboard"
        title="Project Showcase"
        showBadge={false}
        showSaveDraft={false}
        showSearch={true}
        searchPlaceholder="Search title, category, techstack..."
        primaryActionLabel="Create Project"
        primaryActionHref="/admin/projects/new"
        primaryActionIcon={<Plus className="w-3.5 h-3.5" />}
      />

      <div className="pt-[77px] lg:pt-[87px] px-4 sm:px-6 lg:px-6 pb-4 sm:pb-6 lg:pb-6 space-y-6">

        {/* Desktop Table View (lg+) */}
        <div className="hidden lg:block bg-surface border border-border-warm rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-secondary border-b border-border-warm font-serif text-white text-xs uppercase tracking-wider">
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-4 max-w-[140px] lg:max-w-[200px] xl:max-w-[260px]">Project Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 min-w-[240px]">Tech Stack</th>
                  <th className="p-4">Links</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-ink-muted font-mono text-xs">
                      No projects found in database. Click &quot;Create Project&quot; to add one.
                    </td>
                  </tr>
                ) : (
                  projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-black/2 transition-colors">
                      <td className="p-3 w-12 text-center text-xs font-mono font-bold text-primary">
                        #{proj.priorityOrder}
                      </td>
                      <td className="p-4 max-w-[140px] lg:max-w-[200px] xl:max-w-[260px]">
                        <div className="min-w-0">
                          <span
                            className="font-bold text-ink block font-serif truncate whitespace-nowrap"
                            title={proj.title}
                          >
                            {proj.title}
                          </span>
                          <span
                            className="text-xs font-mono text-ink-muted block truncate whitespace-nowrap"
                            title={`/${proj.slug}`}
                          >
                            /{proj.slug}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 max-w-[130px] lg:max-w-[170px]">
                        <Badge
                          variant="accent"
                          size="sm"
                          className="max-w-full truncate inline-block align-middle"
                          title={proj.category}
                        >
                          <span className="truncate block">{proj.category}</span>
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${proj.status === "published"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : proj.status === "draft"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-slate-100 text-slate-700 border border-slate-300"
                            }`}
                        >
                          {proj.status}
                        </span>
                      </td>
                      <td className="p-4 max-w-[260px] lg:max-w-[360px] xl:max-w-[480px]">
                        <div className="flex items-center gap-1.5 flex-nowrap overflow-hidden">
                          {proj.techstack.length <= 3 ? (
                            proj.techstack.map((t: string) => (
                              <Badge key={t} variant="tech" size="sm" className="max-w-[110px] truncate inline-block shrink-0" title={t}>
                                <span className="truncate block">{t}</span>
                              </Badge>
                            ))
                          ) : (
                            <>
                              {proj.techstack.slice(0, 2).map((t: string) => (
                                <Badge key={t} variant="tech" size="sm" className="max-w-[110px] truncate inline-block shrink-0" title={t}>
                                  <span className="truncate block">{t}</span>
                                </Badge>
                              ))}
                              <Badge variant="tech" size="sm" className="opacity-80 shrink-0 font-mono">
                                +{proj.techstack.length - 2} more
                              </Badge>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-xs font-mono">
                        <div className="flex items-center space-x-2">
                          {proj.sourceLink && (
                            <a
                              href={proj.sourceLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 font-semibold"
                            >
                              <ExternalLink className="w-3 h-3" /> Live
                            </a>
                          )}
                          {proj.repository && (
                            <a
                              href={proj.repository}
                              target="_blank"
                              rel="noreferrer"
                              className="text-ink-muted hover:underline flex items-center gap-1"
                            >
                              <Code2 className="w-3 h-3" /> Repo
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/admin/projects/${proj.id}/edit`}>
                            <button
                              type="button"
                              className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>

                          <DeleteButton
                            itemId={proj.id}
                            itemName={proj.title}
                            itemType="project"
                            onDeleteAction={deleteProjectAction}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Interactive Pagination (Desktop) */}
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            baseUrl="/admin/projects"
          />
        </div>

        {/* Mobile & Tablet Card List View (< lg) */}
        <div className="block lg:hidden space-y-3.5">
          {projects.length === 0 ? (
            <div className="bg-surface border border-border-warm rounded-xl p-6 text-center text-ink-muted font-mono text-xs shadow-card">
              No projects created yet. Tap &quot;+&quot; button to add one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-surface border border-[#c8c5c2] rounded-xl p-4 space-y-3 shadow-card hover:border-primary/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header Row: Priority + Title/Slug + Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="px-2 py-0.5 rounded bg-paper border border-border-warm text-xs font-mono font-bold text-primary shrink-0">
                          #{proj.priorityOrder}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-serif font-bold text-ink text-sm leading-tight truncate">
                            {proj.title}
                          </h3>
                          <p className="text-[11px] font-mono text-ink-muted truncate">
                            /{proj.slug}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${proj.status === "published"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : proj.status === "draft"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-slate-100 text-slate-700 border border-slate-300"
                          }`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    {/* Badges Row: Category + Techstack */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <Badge
                        variant="accent"
                        size="sm"
                        className="max-w-[120px] sm:max-w-[140px] truncate inline-block align-middle"
                        title={proj.category}
                      >
                        <span className="truncate block">{proj.category}</span>
                      </Badge>
                      {proj.techstack.length <= 3 ? (
                        proj.techstack.map((t: string) => (
                          <Badge key={t} variant="tech" size="sm" className="max-w-[100px] truncate inline-block" title={t}>
                            <span className="truncate block">{t}</span>
                          </Badge>
                        ))
                      ) : (
                        <>
                          {proj.techstack.slice(0, 2).map((t: string) => (
                            <Badge key={t} variant="tech" size="sm" className="max-w-[100px] truncate inline-block" title={t}>
                              <span className="truncate block">{t}</span>
                            </Badge>
                          ))}
                          <Badge variant="tech" size="sm" className="opacity-80 shrink-0 font-mono">
                            +{proj.techstack.length - 2} more
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Footer Row: Links + Actions */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-border-subtle/60 text-xs font-mono mt-3">
                    {/* External Links */}
                    <div className="flex items-center space-x-3">
                      {proj.sourceLink && (
                        <a
                          href={proj.sourceLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Live
                        </a>
                      )}
                      {proj.repository && (
                        <a
                          href={proj.repository}
                          target="_blank"
                          rel="noreferrer"
                          className="text-ink-muted hover:underline flex items-center gap-1"
                        >
                          <Code2 className="w-3.5 h-3.5" /> Repo
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Link href={`/admin/projects/${proj.id}/edit`}>
                        <button
                          type="button"
                          className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>

                      <DeleteButton
                        itemId={proj.id}
                        itemName={proj.title}
                        itemType="project"
                        onDeleteAction={deleteProjectAction}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile & Tablet Interactive Pagination Card */}
          <div className="bg-surface border border-border-warm rounded-xl overflow-hidden shadow-card mt-3">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              baseUrl="/admin/projects"
            />
          </div>
        </div>
      </div>
    </>
  );
}
