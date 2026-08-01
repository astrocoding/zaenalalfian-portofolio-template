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
import { Plus, Edit, ExternalLink } from "lucide-react";
import { deleteSkillsetAction } from "@/app/actions/admin";

export interface AdminSkillsetsPageProps {
  searchParams?: Promise<{ page?: string; limit?: string; q?: string }>;
}

export default async function AdminSkillsetsPage({
  searchParams,
}: AdminSkillsetsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const pageSize = Math.max(1, Number(resolvedSearchParams.limit) || 5);
  const searchQuery = resolvedSearchParams.q?.trim() || "";

  const where: Prisma.SkillsetWhereInput = searchQuery
    ? {
        OR: [
          { category: { contains: searchQuery, mode: "insensitive" } },
          { skillName: { contains: searchQuery, mode: "insensitive" } },
        ],
      }
    : {};

  let skillsets: Awaited<ReturnType<typeof prisma.skillset.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.skillset.count({ where });
    skillsets = await prisma.skillset.findMany({
      where,
      orderBy: [
        { categoryOrder: "asc" },
        { category: "asc" },
        { createdAt: "asc" },
      ],
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  } catch (e) {
    console.warn("Error fetching skillsets:", e);
  }

  const totalPages = Math.ceil(totalItems / pageSize);
  type SkillsetItem = (typeof skillsets)[number];

  return (
    <>
      <AdminFormHeader
        backHref="/admin"
        backLabel="Back to Dashboard"
        title="Technical Skillsets"
        showBadge={false}
        showSaveDraft={false}
        showSearch={true}
        searchPlaceholder="Search category, skill..."
        primaryActionLabel="Add Skillset"
        primaryActionHref="/admin/skillsets/new"
        primaryActionIcon={<Plus className="w-3.5 h-3.5" />}
      />

      <div className="pt-[77px] lg:pt-[87px] px-4 sm:px-6 lg:px-6 pb-4 sm:pb-6 lg:pb-6">
        <AdminContent<SkillsetItem>
          items={skillsets}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          baseUrl="/admin/skillsets"
          emptyMessage="No skillsets found in database. Click 'Add Skillset' to add one."
          getItemKey={(item) => item.id}
          columns={[
            {
              header: "Order",
              headerClassName: "p-4 w-12 text-center text-white",
              className: "p-4 w-12 text-center",
              render: (sk) => (
                <span className="font-mono font-bold text-primary text-xs">
                  #{sk.categoryOrder}
                </span>
              ),
            },
            {
              header: "Category",
              className: "p-4",
              render: (sk) => (
                <Badge variant="accent" size="sm">
                  {sk.category}
                </Badge>
              ),
            },
            {
              header: "Skill / Tool Name",
              className: "p-4 font-bold text-ink font-serif text-sm",
              render: (sk) => sk.skillName,
            },
            {
              header: "Link / Ref",
              className: "p-4 text-xs font-mono",
              render: (sk) =>
                sk.link ? (
                  <a
                    href={sk.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>{sk.link}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-ink-muted">-</span>
                ),
            },
            {
              header: "Actions",
              headerClassName: "p-4 text-right text-white",
              className: "p-4 text-right",
              render: (sk) => (
                <div className="flex items-center justify-end space-x-2">
                  <Link href={`/admin/skillsets/${sk.id}/edit`}>
                    <button
                      type="button"
                      className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                  <DeleteButton
                    itemId={sk.id}
                    itemName={sk.skillName}
                    itemType="skillset"
                    onDeleteAction={deleteSkillsetAction}
                  />
                </div>
              ),
            },
          ]}
          renderMobileCard={(sk) => (
            <div className="bg-surface border border-[#c8c5c2] rounded-xl p-4 space-y-3 shadow-card hover:border-primary/50 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded bg-paper border border-border-warm text-xs font-mono font-bold text-primary shrink-0">
                      #{sk.categoryOrder}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-ink truncate leading-snug">
                      {sk.skillName}
                    </h3>
                  </div>
                  <Badge variant="accent" size="sm" className="shrink-0">
                    {sk.category}
                  </Badge>
                </div>

                {sk.link && (
                  <div className="text-xs font-mono text-ink-muted pt-1 border-t border-border-subtle/50">
                    <a
                      href={sk.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1 truncate max-w-full"
                    >
                      <span className="truncate">{sk.link}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-end space-x-2 mt-2">
                <Link href={`/admin/skillsets/${sk.id}/edit`}>
                  <button
                    type="button"
                    className="p-1.5 rounded bg-paper border border-border-warm text-ink hover:text-primary transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </Link>
                <DeleteButton
                  itemId={sk.id}
                  itemName={sk.skillName}
                  itemType="skillset"
                  onDeleteAction={deleteSkillsetAction}
                />
              </div>
            </div>
          )}
        />
      </div>
    </>
  );
}
