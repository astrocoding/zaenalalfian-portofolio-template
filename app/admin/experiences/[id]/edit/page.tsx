import * as React from "react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedParams = await params;
  const experience = await prisma.experience.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!experience) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/experiences"
          className="inline-flex items-center space-x-1 text-xs font-mono text-ink-muted hover:text-primary mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Experience Management</span>
        </Link>
        <h1 className="text-3xl font-serif font-bold text-ink">
          Edit Experience: {experience.role} at {experience.company}
        </h1>
      </div>

      <ExperienceForm initialData={experience} isEdit />
    </div>
  );
}
