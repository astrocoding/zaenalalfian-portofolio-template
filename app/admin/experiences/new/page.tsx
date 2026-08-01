import * as React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export const metadata = {
  title: "New Experience Record | Admin Portal",
};

export default async function NewExperiencePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="w-full pb-12">
      <ExperienceForm />
    </div>
  );
}
