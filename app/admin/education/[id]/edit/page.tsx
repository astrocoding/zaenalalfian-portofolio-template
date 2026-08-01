import * as React from "react";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EducationForm } from "@/components/admin/EducationForm";

export const metadata = {
  title: "Edit Education Record | Admin Portal",
};

export interface EditEducationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEducationPage({
  params,
}: EditEducationPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const education = await prisma.education.findUnique({ where: { id } });
  if (!education) notFound();

  return (
    <div className="w-full pb-12">
      <EducationForm initialData={education} isEdit={true} />
    </div>
  );
}
