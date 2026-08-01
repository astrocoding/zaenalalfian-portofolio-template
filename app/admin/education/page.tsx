import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminFormHeader } from "@/components/admin/AdminFormHeader";
import { AdminContent } from "@/components/admin/AdminContent";
import { Prisma } from "@/app/generated/prisma/client";
import { Plus, Edit } from "lucide-react";
import { deleteEducationAction } from "@/app/actions/admin";

export interface AdminEducationPageProps {
  searchParams?: Promise<{ page?: string; limit?: string; q?: string }>;
}

export default async function AdminEducationPage({
  searchParams,
}: AdminEducationPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const pageSize = Math.max(1, Number(resolvedSearchParams.limit) || 5);
  const searchQuery = resolvedSearchParams.q?.trim() || "";

  const where: Prisma.EducationWhereInput = searchQuery
    ? {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { organization: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
        ],
      }
    : {};

  let educations: Awaited<ReturnType<typeof prisma.education.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.education.count({ where });
    educations = await prisma.education.findMany({
      where,
      orderBy: { order: "asc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  } catch (e) {
    console.warn("Error fetching education records:", e);
  }

  const totalPages = Math.ceil(totalItems / pageSize);
  type EducationItem = (typeof educations)[number];

  return (
    <>
      <AdminFormHeader
        backHref="/admin"
        backLabel="Back to Dashboard"
        title="Education Journey"
        showBadge={false}
        showSaveDraft={false}
        showSearch={true}
        searchPlaceholder="Search degree, institution, coursework..."
        primaryActionLabel="Add Education"
        primaryActionHref="/admin/education/new"
        primaryActionIcon={<Plus className="w-3.5 h-3.5" />}
      />

      <div className="pt-[77px] lg:pt-[87px] px-4 sm:px-6 lg:px-6 pb-4 sm:pb-6 lg:pb-6">
        <AdminContent<EducationItem>
          items={educations}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          baseUrl="/admin/education"
          emptyMessage="No education records found in database. Click 'Add Education' to add one."
          getItemKey={(item) => item.id}
          columns={[
            {
              header: "#",
              headerClassName: "p-4 w-12 text-center text-white",
              className: "p-4 w-12 text-center",
              render: (edu) => (
                <span className="font-mono font-bold text-primary text-xs">
                  #{edu.order}
                </span>
              ),
            },
            {
              header: "Degree & Institution",
              className: "p-4",
              render: (edu) => (
                <div className="min-w-0">
                  <span className="font-bold text-ink block font-serif truncate">
                    {edu.title}
                  </span>
                  <span className="text-xs font-mono text-ink-muted block truncate">
                    {edu.organization}
                  </span>
                </div>
              ),
            },
            {
              header: "Period & Location",
              className:
                "p-4 text-xs font-mono text-ink-muted whitespace-nowrap",
              render: (edu) => (
                <div>
                  <span>{edu.period}</span>
                  {edu.location && (
                    <span className="block text-[11px] text-primary/80">
                      {edu.location}
                    </span>
                  )}
                </div>
              ),
            },
            {
              header: "Coursework / Competencies",
              className: "p-4",
              render: (edu) => (
                <div className="text-xs text-ink-muted line-clamp-2">
                  {edu.courses && edu.courses.length > 0
                    ? edu.courses.join(", ")
                    : edu.description || "-"}
                </div>
              ),
            },
            {
              header: "Actions",
              headerClassName: "p-4 text-right text-white",
              className: "p-4 text-right",
              render: (edu) => (
                <div className="flex items-center justify-end space-x-2">
                  <Link href={`/admin/education/${edu.id}/edit`}>
                    <button
                      type="button"
                      className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                  <DeleteButton
                    itemId={edu.id}
                    itemName={`${edu.title} at ${edu.organization}`}
                    itemType="education record"
                    onDeleteAction={deleteEducationAction}
                  />
                </div>
              ),
            },
          ]}
          renderMobileCard={(edu) => (
            <div className="bg-surface border border-[#c8c5c2] rounded-xl p-4 space-y-3 shadow-card hover:border-primary/50 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded bg-paper border border-border-warm text-xs font-mono font-bold text-primary shrink-0">
                    #{edu.order}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-sm text-ink truncate leading-snug">
                      {edu.title}
                    </h3>
                    <p className="text-[11px] font-mono text-ink-muted truncate">
                      {edu.organization}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono text-ink-muted pt-1 border-t border-border-subtle/50 flex justify-between items-center">
                  <span>{edu.period}</span>
                  {edu.location && (
                    <span className="text-[11px] text-primary/80">
                      {edu.location}
                    </span>
                  )}
                </div>

                {(edu.description ||
                  (edu.courses && edu.courses.length > 0)) && (
                  <p className="text-xs text-ink-muted line-clamp-2 pt-1">
                    {edu.courses && edu.courses.length > 0
                      ? edu.courses.join(", ")
                      : edu.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-end space-x-2 mt-2">
                <Link href={`/admin/education/${edu.id}/edit`}>
                  <button
                    type="button"
                    className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </Link>
                <DeleteButton
                  itemId={edu.id}
                  itemName={`${edu.title} at ${edu.organization}`}
                  itemType="education record"
                  onDeleteAction={deleteEducationAction}
                />
              </div>
            </div>
          )}
        />
      </div>
    </>
  );
}
