import * as React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return <ProjectForm />;
}
