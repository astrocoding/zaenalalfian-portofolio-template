import * as React from "react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import { DocForm } from "@/components/admin/DocForm";

export default async function EditDocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedParams = await params;
  const doc = await prisma.doc.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!doc) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/docs"
          className="inline-flex items-center space-x-1 text-xs font-mono text-ink-muted hover:text-primary mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Documentation Management</span>
        </Link>
        <h1 className="text-3xl font-serif font-bold text-ink">
          Edit Guide: {doc.title}
        </h1>
      </div>

      <DocForm initialData={doc} isEdit />
    </div>
  );
}
