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
import { Plus, Edit } from "lucide-react";
import { deleteExperienceAction } from "@/app/actions/admin";

export interface AdminExperiencesPageProps {
  searchParams?: Promise<{ page?: string; limit?: string; q?: string }>;
}

export default async function AdminExperiencesPage({
  searchParams,
}: AdminExperiencesPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const pageSize = Math.max(1, Number(resolvedSearchParams.limit) || 5);
  const searchQuery = resolvedSearchParams.q?.trim() || "";

  const where: Prisma.ExperienceWhereInput = searchQuery
    ? {
        OR: [
          { role: { contains: searchQuery, mode: "insensitive" } },
          { company: { contains: searchQuery, mode: "insensitive" } },
          { period: { contains: searchQuery, mode: "insensitive" } },
        ],
      }
    : {};

  let experiences: Awaited<ReturnType<typeof prisma.experience.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.experience.count({ where });
    experiences = await prisma.experience.findMany({
      where,
      orderBy: { order: "asc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  } catch (e) {
    console.warn("Error fetching experiences:", e);
  }

  const totalPages = Math.ceil(totalItems / pageSize);
  type ExperienceItem = (typeof experiences)[number];

  return (
    <>
      <AdminFormHeader
        backHref="/admin"
        backLabel="Back to Dashboard"
        title="Professional Experience"
        showBadge={false}
        showSaveDraft={false}
        showSearch={true}
        searchPlaceholder="Search role, company..."
        primaryActionLabel="Add Experience"
        primaryActionHref="/admin/experiences/new"
        primaryActionIcon={<Plus className="w-3.5 h-3.5" />}
      />

      <div className="pt-[77px] lg:pt-[87px] px-4 sm:px-6 lg:px-6 pb-4 sm:pb-6 lg:pb-6">
        <AdminContent<ExperienceItem>
          items={experiences}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          baseUrl="/admin/experiences"
          emptyMessage="No experience records found in database. Click 'Add Experience' to add one."
          getItemKey={(item) => item.id}
          columns={[
            {
              header: "#",
              className: "p-4 w-12 text-center",
              render: (exp) => (
                <span className="font-mono font-bold text-primary text-xs">
                  #{exp.order}
                </span>
              ),
            },
            {
              header: "Role & Company",
              className: "p-4",
              render: (exp) => (
                <div className="min-w-0">
                  <span className="font-bold text-ink block font-serif truncate">
                    {exp.role}
                  </span>
                  <span className="text-xs font-mono text-ink-muted block truncate">
                    {exp.company}
                  </span>
                </div>
              ),
            },
            {
              header: "Period",
              headerClassName: "p-4 text-white",
              className:
                "p-4 text-xs font-mono text-ink-muted whitespace-nowrap",
              render: (exp) => exp.period,
            },
            {
              header: "Tech Skills",
              className: "p-4",
              render: (exp) => (
                <div className="flex items-center gap-1.5 flex-nowrap overflow-hidden">
                  {exp.skills.length <= 3 ? (
                    exp.skills.map((t: string) => (
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
                      {exp.skills.slice(0, 2).map((t: string) => (
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
                        +{exp.skills.length - 2} more
                      </Badge>
                    </>
                  )}
                </div>
              ),
            },
            {
              header: "Actions",
              className: "p-4 text-right",
              render: (exp) => (
                <div className="flex items-center justify-end space-x-2">
                  <Link href={`/admin/experiences/${exp.id}/edit`}>
                    <button
                      type="button"
                      className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                  <DeleteButton
                    itemId={exp.id}
                    itemName={`${exp.role} at ${exp.company}`}
                    itemType="experience"
                    onDeleteAction={deleteExperienceAction}
                  />
                </div>
              ),
            },
          ]}
          renderMobileCard={(exp) => (
            <div className="bg-surface border border-[#c8c5c2] rounded-xl p-4 space-y-3 shadow-card hover:border-primary/50 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded bg-paper border border-border-warm text-xs font-mono font-bold text-primary shrink-0">
                    #{exp.order}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-sm text-ink truncate leading-snug">
                      {exp.role}
                    </h3>
                    <p className="text-[11px] font-mono text-ink-muted truncate">
                      {exp.company}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono text-ink-muted pt-1 border-t border-border-subtle/50">
                  {exp.period}
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {exp.skills.map((t: string) => (
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
                <Link href={`/admin/experiences/${exp.id}/edit`}>
                  <button
                    type="button"
                    className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </Link>
                <DeleteButton
                  itemId={exp.id}
                  itemName={`${exp.role} at ${exp.company}`}
                  itemType="experience"
                  onDeleteAction={deleteExperienceAction}
                />
              </div>
            </div>
          )}
        />
      </div>
    </>
  );
}
