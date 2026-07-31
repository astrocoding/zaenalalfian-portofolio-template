import * as React from "react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SkillsetForm } from "@/components/admin/SkillsetForm";
import { ArrowLeft } from "lucide-react";

export interface EditSkillsetPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSkillsetPage({ params }: EditSkillsetPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;

  const skillset = await prisma.skillset.findUnique({
    where: { id },
  });

  if (!skillset) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-border-warm">
        <Link
          href="/admin/skillsets"
          className="inline-flex items-center space-x-1 text-xs font-mono text-ink-muted hover:text-primary mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Skillsets List</span>
        </Link>
        <h1 className="text-3xl font-serif font-bold text-ink">Edit Skillset Item</h1>
      </div>

      <SkillsetForm initialData={skillset} isEdit={true} />
    </div>
  );
}
