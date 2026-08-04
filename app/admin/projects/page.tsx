import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Prisma } from "@/app/generated/prisma/client";
import { AdminFormHeader } from "@/components/admin/AdminFormHeader";
import { AdminContent } from "@/components/admin/AdminContent";
import { Plus, Edit, ExternalLink, Code2, Eye } from "lucide-react";
import { deleteProjectAction } from "@/app/actions/admin";

export interface AdminProjectsPageProps {
  searchParams?: Promise<{ page?: string; limit?: string; q?: string }>;
}

export default async function AdminProjectsPage({
  searchParams,
}: AdminProjectsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const pageSize = Math.max(1, Number(resolvedSearchParams.limit) || 5);
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
  type ProjectItem = (typeof projects)[number];

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

      <div className="pt-[77px] lg:pt-[87px] px-4 sm:px-6 lg:px-6 pb-4 sm:pb-6 lg:pb-6">
        <AdminContent<ProjectItem>
          items={projects}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          baseUrl="/admin/projects"
          emptyMessage="No projects found in database. Click 'Create Project' to add one."
          getItemKey={(item) => item.id}
          tableHeaderClass="bg-secondary border-b border-border-warm font-serif text-white text-xs uppercase tracking-wider"
          columns={[
            {
              header: "#",
              headerClassName: "p-3 w-12 text-center text-white",
              className: "p-3 w-12 text-center",
              render: (proj) => (
                <span className="font-mono font-bold text-primary text-xs">
                  #{proj.priorityOrder}
                </span>
              ),
            },
            {
              header: "Project Title",
              className: "p-4 max-w-[140px] lg:max-w-[200px] xl:max-w-[260px]",
              render: (proj) => (
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
              ),
            },
            {
              header: "Category",
              className: "p-4 max-w-[130px] lg:max-w-[170px]",
              render: (proj) => (
                <Badge
                  variant="accent"
                  size="sm"
                  className="max-w-full truncate inline-block align-middle"
                  title={proj.category}
                >
                  <span className="truncate block">{proj.category}</span>
                </Badge>
              ),
            },
            {
              header: "Status",
              className: "p-4",
              render: (proj) => (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    proj.status === "published"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : proj.status === "draft"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-slate-100 text-slate-700 border border-slate-300"
                  }`}
                >
                  {proj.status}
                </span>
              ),
            },
            {
              header: "Tech Stack",
              className: "p-4 max-w-[260px] lg:max-w-[360px] xl:max-w-[480px]",
              render: (proj) => (
                <div className="flex items-center gap-1.5 flex-nowrap overflow-hidden">
                  {proj.techstack.length <= 3 ? (
                    proj.techstack.map((t: string) => (
                      <Badge
                        key={t}
                        variant="tech"
                        size="sm"
                        className="max-w-[110px] truncate inline-block shrink-0"
                        title={t}
                      >
                        <span className="truncate block">{t}</span>
                      </Badge>
                    ))
                  ) : (
                    <>
                      {proj.techstack.slice(0, 2).map((t: string) => (
                        <Badge
                          key={t}
                          variant="tech"
                          size="sm"
                          className="max-w-[110px] truncate inline-block shrink-0"
                          title={t}
                        >
                          <span className="truncate block">{t}</span>
                        </Badge>
                      ))}
                      <Badge
                        variant="tech"
                        size="sm"
                        className="opacity-80 shrink-0 font-mono"
                      >
                        +{proj.techstack.length - 2} more
                      </Badge>
                    </>
                  )}
                </div>
              ),
            },
            {
              header: "Views",
              className: "p-4 text-xs font-mono text-ink-muted",
              render: (proj) => (
                <div className="flex items-center space-x-1" title={`${proj.views ?? 0} organic views`}>
                  <Eye className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="font-bold text-ink">{(proj.views ?? 0).toLocaleString()}</span>
                </div>
              ),
            },
            {
              header: "Links",
              className: "p-4 text-xs font-mono",
              render: (proj) => (
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
              ),
            },
            {
              header: "Actions",
              headerClassName: "p-4 text-right text-white",
              className: "p-4 text-right",
              render: (proj) => (
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
              ),
            },
          ]}
          renderMobileCard={(proj) => (
            <div className="bg-surface border border-[#c8c5c2] rounded-xl p-4 space-y-3 shadow-card hover:border-primary/50 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded bg-paper border border-border-warm text-xs font-mono font-bold text-primary shrink-0">
                      #{proj.priorityOrder}
                    </span>
                    <div className="min-w-0">
                      <h3
                        className="font-serif font-bold text-sm text-ink truncate leading-snug"
                        title={proj.title}
                      >
                        {proj.title}
                      </h3>
                      <p
                        className="text-[11px] font-mono text-ink-muted truncate"
                        title={`/${proj.slug}`}
                      >
                        /{proj.slug}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                      proj.status === "published"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : proj.status === "draft"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-slate-100 text-slate-700 border border-slate-300"
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono gap-2 pt-1 border-t border-border-subtle/50">
                  <Badge
                    variant="accent"
                    size="sm"
                    className="max-w-[140px] truncate"
                  >
                    {proj.category}
                  </Badge>

                  <div className="flex items-center space-x-2 shrink-0 text-[11px]">
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
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.techstack.map((t: string) => (
                    <Badge
                      key={t}
                      variant="tech"
                      size="sm"
                      className="text-[10px] px-1.5 py-0.5"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-end space-x-2 mt-2">
                <Link href={`/admin/projects/${proj.id}/edit`}>
                  <button
                    type="button"
                    className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
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
          )}
        />
      </div>
    </>
  );
}
