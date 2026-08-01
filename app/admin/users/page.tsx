import * as React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { UsersClient } from "@/components/admin/UsersClient";

export const metadata = {
  title: "Users Management | Admin Portal",
};

export interface AdminUsersPageProps {
  searchParams?: Promise<{ page?: string; limit?: string; q?: string }>;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const pageSize = Math.max(1, Number(resolvedSearchParams.limit) || 5);
  const searchQuery = resolvedSearchParams.q?.trim() || "";

  const where: Prisma.UserWhereInput = searchQuery
    ? {
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { username: { contains: searchQuery, mode: "insensitive" } },
          { email: { contains: searchQuery, mode: "insensitive" } },
        ],
      }
    : {};

  let users: Awaited<ReturnType<typeof prisma.user.findMany>> = [];
  let totalItems = 0;

  try {
    totalItems = await prisma.user.count({ where });
    users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  } catch (e) {
    console.warn("Error fetching users:", e);
  }

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <UsersClient
      users={users}
      totalItems={totalItems}
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
