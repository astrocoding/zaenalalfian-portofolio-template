import * as React from "react";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export const metadata = {
  title: "Edit Experience | Admin Portal",
};

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
    <div className="w-full pb-12">
      <ExperienceForm initialData={experience} isEdit />
    </div>
  );
}
