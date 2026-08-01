import * as React from "react";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DocForm } from "@/components/admin/DocForm";

export const metadata = {
  title: "Edit Guide | Admin Portal",
};

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
    <div className="w-full pb-12">
      <DocForm initialData={doc} isEdit />
    </div>
  );
}
