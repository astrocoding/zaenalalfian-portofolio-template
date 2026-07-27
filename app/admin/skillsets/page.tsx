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
import { Plus, Edit, ArrowLeft, ExternalLink } from "lucide-react";
import { deleteSkillsetAction } from "@/app/actions/admin";

export interface AdminSkillsetsPageProps {
  searchParams?: Promise<{ page?: string }>;
}

const PAGE_SIZE = 10;

export default async function AdminSkillsetsPage({ searchParams }: AdminSkillsetsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);

  let skillsets: Awaited<ReturnType<typeof prisma.skillset.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.skillset.count();
    skillsets = await prisma.skillset.findMany({
      orderBy: [{ categoryOrder: "asc" }, { category: "asc" }, { createdAt: "asc" }],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
  } catch (e) {
    console.warn("Error fetching skillsets:", e);
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
            Technical Skillsets / 技能管理
          </h1>
        </div>

        <Link href="/admin/skillsets/new">
          <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
            Add Skillset / スキル追加
          </Button>
        </Link>
      </div>

      {/* Skillsets Table */}
      <div className="bg-surface border border-border-warm rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-paper border-b border-border-warm font-serif text-ink text-xs uppercase tracking-wider">
                <th className="p-4">Card Order</th>
                <th className="p-4">Category</th>
                <th className="p-4">Skill / Tool Name</th>
                <th className="p-4">Link / Ref</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {skillsets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink-muted font-mono text-xs">
                    No skillset records found. Click &quot;Add Skillset&quot; to create one.
                  </td>
                </tr>
              ) : (
                skillsets.map((skill) => (
                  <tr key={skill.id} className="hover:bg-black/2 transition-colors">
                    <td className="p-4 text-xs font-mono font-bold text-primary">
                      Card #{skill.categoryOrder}
                    </td>
                    <td className="p-4">
                      <span className="font-serif font-semibold text-ink text-sm block">
                        {skill.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="tech" size="md">
                        {skill.skillName}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs font-mono text-ink-muted">
                      {skill.link ? (
                        <a
                          href={skill.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Link <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4 text-xs text-ink-muted max-w-xs truncate">
                      {skill.description || "—"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/skillsets/${skill.id}/edit`}>
                          <button
                            type="button"
                            className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                            title="Edit Skillset"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>

                        <DeleteButton
                          itemId={skill.id}
                          itemName={`${skill.skillName} (${skill.category})`}
                          itemType="skillset item"
                          onDeleteAction={deleteSkillsetAction}
                          buttonTitle="Delete Skillset"
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
          pageSize={PAGE_SIZE}
          baseUrl="/admin/skillsets"
        />
      </div>
    </div>
  );
}
