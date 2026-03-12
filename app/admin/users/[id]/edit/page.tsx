import * as React from "react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import { UserForm } from "@/components/admin/UserForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedParams = await params;
  const user = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!user) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center space-x-1 text-xs font-mono text-ink-muted hover:text-primary mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to User Management</span>
        </Link>
        <h1 className="text-3xl font-serif font-bold text-ink">
          Edit User: {user.name} (@{user.username})
        </h1>
      </div>

      <UserForm initialData={user} isEdit />
    </div>
  );
}
