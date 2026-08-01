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
import { deleteEducationAction } from "@/app/actions/admin";

export interface AdminEducationPageProps {
  searchParams?: Promise<{ page?: string; limit?: string }>;
}

export default async function AdminEducationPage({
  searchParams,
}: AdminEducationPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const pageSize = Math.max(1, Number(resolvedSearchParams.limit) || 5);

  let educations: Awaited<ReturnType<typeof prisma.education.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.education.count();
    educations = await prisma.education.findMany({
      orderBy: { order: "asc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  } catch (e) {
    console.warn("Error fetching education records:", e);
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
          <h1 className="text-3xl font-serif font-bold text-ink flex items-center gap-2.5">
            <span>Education Journey</span>
          </h1>
        </div>

        <Link href="/admin/education/new">
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
          >
            Add Education
          </Button>
        </Link>
      </div>

      {/* Education Table */}
      <div className="bg-surface border border-border-warm rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-primary border-b border-border-warm font-serif text-white text-xs uppercase tracking-wider">
                <th className="p-4">#</th>
                <th className="p-4">Degree &amp; Institution</th>
                <th className="p-4">Period &amp; Location</th>
                <th className="p-4">Coursework / Competencies</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {educations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-ink-muted font-mono text-xs"
                  >
                    No education records found. Click &quot;Add Education&quot;
                    to create one.
                  </td>
                </tr>
              ) : (
                educations.map((edu) => (
                  <tr
                    key={edu.id}
                    className="hover:bg-black/2 transition-colors"
                  >
                    <td className="p-4 text-xs font-mono font-bold text-primary">
                      #{edu.order}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-ink block font-serif">
                          {edu.title}
                        </span>
                        {edu.statusBadge && (
                          <Badge variant="accent" size="sm">
                            {edu.statusBadge}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs font-mono text-ink-muted block mt-0.5">
                        {edu.organization}
                      </span>
                      {edu.grades && (
                        <span className="text-[11px] font-mono text-primary font-medium block mt-0.5">
                          {edu.grades}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs font-mono text-ink-muted">
                      <div>{edu.period}</div>
                      <div className="text-[11px] text-ink-muted/80">
                        {edu.location}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {edu.courses.map((course: string) => (
                          <Badge key={course} variant="tech" size="sm">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/education/${edu.id}/edit`}>
                          <button
                            type="button"
                            className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                            title="Edit Education Entry"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>

                        <DeleteButton
                          itemId={edu.id}
                          itemName={edu.title}
                          itemType="education entry"
                          onDeleteAction={deleteEducationAction}
                          buttonTitle="Delete Education Entry"
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
          baseUrl="/admin/education"
        />
      </div>
    </div>
  );
}
