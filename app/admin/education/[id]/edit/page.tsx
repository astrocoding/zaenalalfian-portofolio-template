import * as React from "react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EducationForm } from "@/components/admin/EducationForm";
import { ArrowLeft, GraduationCap } from "lucide-react";

export interface EditEducationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEducationPage({ params }: EditEducationPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const education = await prisma.education.findUnique({ where: { id } });
  if (!education) notFound();

  return (
    <div className="p-4 sm:p-6 lg:p-6 space-y-6">
      <div className="pb-4 border-b border-border-warm">
        <Link
          href="/admin/education"
          className="inline-flex items-center space-x-1 text-xs font-mono text-ink-muted hover:text-primary mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Education List / 学歴一覧へ戻る</span>
        </Link>

        <h1 className="text-3xl font-serif font-bold text-ink flex items-center gap-2.5">
          <GraduationCap className="w-7 h-7 text-primary shrink-0" />
          <span>Edit Education Record / 学歴編集</span>
        </h1>
        <p className="text-xs font-mono text-ink-muted mt-1">
          Update degree parameters, institution details, highlights, or coursework competencies.
        </p>
      </div>

      <EducationForm initialData={education} isEdit={true} />
    </div>
  );
}
