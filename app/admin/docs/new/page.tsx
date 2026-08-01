import * as React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DocForm } from "@/components/admin/DocForm";

export const metadata = {
  title: "New Documentation Guide | Admin Portal",
};

export default async function NewDocPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="w-full pb-12">
      <DocForm />
    </div>
  );
}
