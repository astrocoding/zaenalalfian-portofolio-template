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
import { deleteExperienceAction } from "@/app/actions/admin";

export interface AdminExperiencesPageProps {
  searchParams?: Promise<{ page?: string; limit?: string }>;
}

export default async function AdminExperiencesPage({ searchParams }: AdminExperiencesPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const pageSize = Math.max(1, Number(resolvedSearchParams.limit) || 10);

  let experiences: Awaited<ReturnType<typeof prisma.experience.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.experience.count();
    experiences = await prisma.experience.findMany({
      orderBy: { order: "asc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  } catch (e) {
    console.warn("Error fetching experiences:", e);
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
            Experience Management / 職務経歴管理
          </h1>
        </div>

        <Link href="/admin/experiences/new">
          <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
            Add Experience / 職歴追加
          </Button>
        </Link>
      </div>

      {/* Experience Table */}
      <div className="bg-surface border border-border-warm rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-paper border-b border-border-warm font-serif text-ink text-xs uppercase tracking-wider">
                <th className="p-4">Order</th>
                <th className="p-4">Role &amp; Company</th>
                <th className="p-4">Period</th>
                <th className="p-4">Tech Skills</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {experiences.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-ink-muted font-mono text-xs">
                    No experience records found. Click &quot;Add Experience&quot; to create one.
                  </td>
                </tr>
              ) : (
                experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-black/2 transition-colors">
                    <td className="p-4 text-xs font-mono font-bold text-primary">
                      #{exp.order}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-ink block font-serif">{exp.role}</span>
                        {exp.isCurrent && (
                          <Badge variant="accent" size="sm">
                            現職
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs font-mono text-ink-muted block mt-0.5">
                        {exp.company}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-mono text-ink-muted">
                      {exp.period}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {exp.skills.map((skill: string) => (
                          <Badge key={skill} variant="tech" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/experiences/${exp.id}/edit`}>
                          <button
                            type="button"
                            className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                            title="Edit Experience"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>

                        <DeleteButton
                          itemId={exp.id}
                          itemName={`${exp.role} at ${exp.company}`}
                          itemType="experience record"
                          onDeleteAction={deleteExperienceAction}
                          buttonTitle="Delete Experience"
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
          baseUrl="/admin/experiences"
        />
      </div>
    </div>
  );
}
