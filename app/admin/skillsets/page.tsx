import * as React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { SkillsetsClient } from "@/components/admin/SkillsetsClient";

export const metadata = {
  title: "Technical Skillsets | Admin Portal",
};

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

  return (
    <SkillsetsClient
      skillsets={skillsets}
      totalItems={totalItems}
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
