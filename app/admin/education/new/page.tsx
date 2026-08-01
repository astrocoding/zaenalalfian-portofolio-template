import * as React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EducationForm } from "@/components/admin/EducationForm";

export const metadata = {
  title: "New Education Record | Admin Portal",
};

export default async function NewEducationPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="w-full pb-12">
      <EducationForm isEdit={false} />
    </div>
  );
}
